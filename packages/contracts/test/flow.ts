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

//Main flow which mainly follows Account test flow
describe('AccountFlow', function () {
    let entryPoint: string
    let accounts: string[]
    let testUtil: TestUtil
    let accountOwner: Wallet
    const ethersSigner = ethers.provider.getSigner()

    before(async function () {
    //  EntryPoint is the first/main contract to enter to the smart contract flow and handles the user operations
    // Instead of deploying
    entryPoint = await deployEntryPoint().then(e => e.address)
    accounts = await ethers.provider.listAccounts()
    // ignore in geth.. this is just a sanity test. should be refactored to use a single-account mode..
    if (accounts.length < 2) this.skip()
    testUtil = await new TestUtil__factory(ethersSigner).deploy()
    accountOwner = createAccountOwner()
    })
    
})