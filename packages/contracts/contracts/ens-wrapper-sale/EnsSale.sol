// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

interface IRegistry {
  function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external;
}

contract EnsSale {
  ERC20 public ApeCoin = ERC20(0x4d224452801ACEd8B2F0aebE155379bb5D594381);
  address public treasury; // will be the ApeDAO multisig
  address public registry;
  address public metadataService;

  constructor(address _treasury, address _registry, address _metadataService) {
    treasury = _treasury;
    registry = _registry;
    metadataService = _metadataService;
  }

  function setSubnodeOwner(bytes32 _node, bytes32 _label, address _owner) external {
    require(address(0) == _owner); //We will let contract sell but before ownership should be none so others cant buy already bought sub domains
    ApeCoin.transferFrom(msg.sender, treasury, 1000000000000000000000);
    IRegistry(registry).setSubnodeOwner(_node, _label, _owner);
  }
}
