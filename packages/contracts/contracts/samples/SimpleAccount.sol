// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol';

import '../core/BaseAccount.sol';
import './callback/TokenCallbackHandler.sol';
import '../axiom-contracts/client/AxiomV2Client.sol';

/**
 * minimal account.
 *  this is sample minimal account.
 *  has execute, eth handling methods
 *  has a single signer that can send requests through the entryPoint.
 */
contract SimpleAccount is
  BaseAccount,
  TokenCallbackHandler,
  UUPSUpgradeable,
  Initializable,
  AxiomV2Client
{
  error SourceChainIdDoesNotMatch();
  using ECDSA for bytes32;

  address public owner;
  uint64 public callbackSourceChainId; //It can be hardcoded as goerlichainID too.

  IEntryPoint private immutable _entryPoint;

  event SimpleAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);

  modifier onlyOwner() {
    _onlyOwner();
    _;
  }

  /// @inheritdoc BaseAccount
  function entryPoint() public view virtual override returns (IEntryPoint) {
    return _entryPoint;
  }

  // solhint-disable-next-line no-empty-blocks
  receive() external payable {}

  // 0xBd5307B0Bf573E3F2864Af960167b24Aa346952b is the AxiomV2Query (proxy) address
  constructor(
    IEntryPoint anEntryPoint
  ) AxiomV2Client(address(0xBd5307B0Bf573E3F2864Af960167b24Aa346952b)) {
    _entryPoint = anEntryPoint;
    callbackSourceChainId = 5; //Normally it will come from the construtor as a parameter but in this case we will work it on goerli only
    _disableInitializers();
  }

  function _onlyOwner() internal view {
    //directly from EOA owner, or through the account itself (which gets redirected through execute())
    require(msg.sender == owner || msg.sender == address(this), 'only owner');
  }

  /**
   * execute a transaction (called directly from owner, or by entryPoint)
   */
  function execute(address dest, uint256 value, bytes calldata func) external {
    _requireFromEntryPointOrOwner();
    _call(dest, value, func);
  }

  /**
   * execute a sequence of transactions
   * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
   */
  function executeBatch(
    address[] calldata dest,
    uint256[] calldata value,
    bytes[] calldata func
  ) external {
    _requireFromEntryPointOrOwner();
    require(
      dest.length == func.length && (value.length == 0 || value.length == func.length),
      'wrong array lengths'
    );
    if (value.length == 0) {
      for (uint256 i = 0; i < dest.length; i++) {
        _call(dest[i], 0, func[i]);
      }
    } else {
      for (uint256 i = 0; i < dest.length; i++) {
        _call(dest[i], value[i], func[i]);
      }
    }
  }

  /**
   * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
   * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
   * the implementation by calling `upgradeTo()`
   */
  function initialize(address anOwner) public virtual initializer {
    _initialize(anOwner);
  }

  function _initialize(address anOwner) internal virtual {
    owner = anOwner;
    emit SimpleAccountInitialized(_entryPoint, owner);
  }

  // Require the function call went through EntryPoint or owner
  function _requireFromEntryPointOrOwner() internal view {
    require(
      msg.sender == address(entryPoint()) || msg.sender == owner,
      'account: not Owner or EntryPoint'
    );
  }

  /// implement template method of BaseAccount
  function _validateSignature(
    UserOperation calldata userOp,
    bytes32 userOpHash
  ) internal virtual override returns (uint256 validationData) {
    bytes32 hash = userOpHash.toEthSignedMessageHash();
    if (owner != hash.recover(userOp.signature)) return SIG_VALIDATION_FAILED;
    return 0;
  }

  function _call(address target, uint256 value, bytes memory data) internal {
    (bool success, bytes memory result) = target.call{value: value}(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
  }

  /**
   * check current account deposit in the entryPoint
   */
  function getDeposit() public view returns (uint256) {
    return entryPoint().balanceOf(address(this));
  }

  /**
   * deposit more funds for this account in the entryPoint
   */
  function addDeposit() public payable {
    entryPoint().depositTo{value: msg.value}(address(this));
  }

  /**
   * withdraw value from the account's deposit
   * @param withdrawAddress target to send to
   * @param amount to withdraw
   */
  function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
    entryPoint().withdrawTo(withdrawAddress, amount);
  }

  function _authorizeUpgrade(address newImplementation) internal view override {
    (newImplementation);
    _onlyOwner();
  }

  //Axiom Contract callbacks
  function _axiomV2Callback(
    uint64 sourceChainId,
    address caller,
    bytes32 querySchema,
    uint256 queryId,
    bytes32[] calldata axiomResults,
    bytes calldata extraData
  ) internal override {
    //emit ExampleClientEvent(queryId, axiomResults, extraData);
  }

  function _validateAxiomV2Call(
    AxiomCallbackType callbackType,
    uint64 sourceChainId,
    address caller,
    bytes32 querySchema,
    uint256 queryId,
    bytes calldata extraData
  ) internal override {
    if (sourceChainId != callbackSourceChainId) {
      revert SourceChainIdDoesNotMatch();
    }

    // We do not validate the caller or querySchema for example purposes,
    // but a typical application will want to validate that the querySchema matches
    // their application.
    //emit ExampleClientAddrAndSchema(caller, querySchema);
  }
}
