import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import {
  ERC1967Proxy__factory,
  SimpleAccount,
  SimpleAccountFactory__factory,
  SimpleAccount__factory,
  TestCounter,
  TestCounter__factory,
  TestUtil,
  TestUtil__factory
} from '../typechain'
import {
  createAccount,
  createAddress,
  createAccountOwner,
  getBalance,
  isDeployed,
  ONE_ETH,
  HashZero, deployEntryPoint
} from './testutils'
import { fillUserOpDefaults, getUserOpHash, packUserOp, signUserOp } from './UserOp'
import { parseEther } from 'ethers/lib/utils'
import { UserOperation } from './UserOperation'

// MAIN FLOW WHICH I TOOK FROM SIMPLE_WALLET_TEST
describe('SimpleAccountFlow', function () {
  let entryPoint: string
  let accounts: string[]
  let testUtil: TestUtil
  let accountOwner: Wallet
  const ethersSigner = ethers.provider.getSigner()

  before(async function () {
    //  EntryPoint is the first/main contract to enter to the smart contract flow and handles the user operations
    // Instead of deployin
    entryPoint = await deployEntryPoint().then(e => e.address)
    accounts = await ethers.provider.listAccounts()
    // ignore in geth.. this is just a sanity test. should be refactored to use a single-account mode..
    if (accounts.length < 2) this.skip()
    testUtil = await new TestUtil__factory(ethersSigner).deploy()
    accountOwner = createAccountOwner()
  })

  it('owner should be able to call transfer', async () => {
    //  classic ether transfer you can skip
    const { proxy: account } = await createAccount(ethers.provider.getSigner(), accounts[0], entryPoint)
    await ethersSigner.sendTransaction({ from: accounts[0], to: account.address, value: parseEther('2') })
    await account.execute(accounts[2], ONE_ETH, '0x')
  })

  it('should pack in js the same as solidity', async () => {
    //  User operation is the main struct/object to made in js and sent to the smart contract
    const op = await fillUserOpDefaults({ sender: accounts[0] })
    const packed = packUserOp(op)
    expect(await testUtil.packUserOp(op)).to.equal(packed)
  })

  describe('#executeBatch', () => {
    let account: SimpleAccount
    let counter: TestCounter
    before(async () => {
      ({ proxy: account } = await createAccount(ethersSigner, await ethersSigner.getAddress(), entryPoint))
      //    counter contract which just has specific funtions to revert, add to countrt, emit events and use gas
      //    main point is to see if account functions are called the right way
      counter = await new TestCounter__factory(ethersSigner).deploy()
    })

    //  to see if executeBatch executes with zero array
    it('should allow zero value array', async () => {
      const counterJustEmit = await counter.populateTransaction.justemit().then(tx => tx.data!)
      //    this is the executeBatch call we are going to use
      const rcpt = await account.executeBatch(
        [counter.address, counter.address],
        [],
        [counterJustEmit, counterJustEmit]
      ).then(async t => await t.wait())
      //    checking for events, which got called 2 times
      const targetLogs = await counter.queryFilter(counter.filters.CalledFrom(), rcpt.blockHash)
      expect(targetLogs.length).to.eq(2)
    })

    it('should allow transfer value', async () => {
      //    function call packaged into an object
      const counterJustEmit = await counter.populateTransaction.justemit().then(tx => tx.data!)
      const target = createAddress()
      await ethersSigner.sendTransaction({ from: accounts[0], to: account.address, value: parseEther('2') })
      //   executeBatch with the real parameters & with value
      const rcpt = await account.executeBatch(
        [target, counter.address],
        [ONE_ETH, 0],
        ['0x', counterJustEmit]
      ).then(async t => await t.wait())
      expect(await ethers.provider.getBalance(target)).to.equal(ONE_ETH)
      const targetLogs = await counter.queryFilter(counter.filters.CalledFrom(), rcpt.blockHash)
      expect(targetLogs.length).to.eq(1)
    })
  })

  describe('#validateUserOp', () => {
    let account: SimpleAccount
    let userOp: UserOperation
    let userOpHash: string
    let preBalance: number
    let expectedPay: number

    const actualGasPrice = 1e9
    // for testing directly validateUserOp, we initialize the account with EOA as entryPoint.
    let entryPointEoa: string

    before(async () => {
      entryPointEoa = accounts[2]
      const epAsSigner = await ethers.getSigner(entryPointEoa)

      // cant use "SimpleAccountFactory", since it attempts to increment nonce first
      // its the name of the sol contract, instead deploy code just calls simpleaccount
      const implementation = await new SimpleAccount__factory(ethersSigner).deploy(entryPointEoa)
      const proxy = await new ERC1967Proxy__factory(ethersSigner).deploy(implementation.address, '0x')
      account = SimpleAccount__factory.connect(proxy.address, epAsSigner)

      await ethersSigner.sendTransaction({ from: accounts[0], to: account.address, value: parseEther('0.2') })
      const callGasLimit = 200000
      const verificationGasLimit = 100000
      const maxFeePerGas = 3e9
      const chainId = await ethers.provider.getNetwork().then(net => net.chainId)

      userOp = signUserOp(fillUserOpDefaults({
        sender: account.address,
        callGasLimit,
        verificationGasLimit,
        maxFeePerGas
      }), accountOwner, entryPointEoa, chainId)

      userOpHash = await getUserOpHash(userOp, entryPointEoa, chainId)

      expectedPay = actualGasPrice * (callGasLimit + verificationGasLimit)

      preBalance = await getBalance(account.address)
      const ret = await account.validateUserOp(userOp, userOpHash, expectedPay, { gasPrice: actualGasPrice })
      await ret.wait()
    })

    it('should pay', async () => {
      const postBalance = await getBalance(account.address)
      expect(preBalance - postBalance).to.eql(expectedPay)
    })

    it('should return NO_SIG_VALIDATION on wrong signature', async () => {
      const userOpHash = HashZero
      const deadline = await account.callStatic.validateUserOp({ ...userOp, nonce: 1 }, userOpHash, 0)
      expect(deadline).to.eq(1)
    })
  })

  context('SimpleAccountFactory', () => {
    it('sanity: check deployer', async () => {
      const ownerAddr = createAddress()
      const deployer = await new SimpleAccountFactory__factory(ethersSigner).deploy(entryPoint)
      const target = await deployer.callStatic.createAccount(ownerAddr, 1234)
      expect(await isDeployed(target)).to.eq(false)
      await deployer.createAccount(ownerAddr, 1234)
      expect(await isDeployed(target)).to.eq(true)
    })
  })
})
