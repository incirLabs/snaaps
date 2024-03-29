---
id: accounts
title: Accounts
sidebar_position: 2
---

# Accounts

There are two types of accounts in snAAps: **Created accounts** and **Integrated AA accounts**.

## Created accounts

Created accounts are accounts that are created by the user using our site and snap.
They are created by calling the `createAccount` function on the `Account Factory` contract. The user can then deposit funds into the account and use them to pay for services.
Signer of these accounts is generated by the user's MetaMask wallet specifically for this account. They are dependent on user's MetaMask seed phrase. If the user loses access to their wallet, they can recover their account by using the same mnemonic phrase of their MetaMask wallet.

- Pros:
  - Full support for all features.
  - Can create as many accounts as they want.
  - Can use the same account on multiple devices.
  - Can recover their account using only their MetaMask seed phrase.

## Integrated AA accounts

Integrated AA accounts are accounts that are created outside of our site and snap. User must have an AA account on any of the [supported networks](./supported-networks.md) to be able to use them.
User must know the address and the signer private key of the account to be able to add and use it on our site and snap.
Private key of the signer is securely stored on the user's MetaMask wallet. If the user loses access to their wallet, they must recover by using the same private key of their signer.

- Limitations:
  - Some features may not be supported.
  - Can have issues with some AA accounts that are not fully ERC-4337 compatible.
  - Must have access to the private key of the signer to be able to recover the account.
