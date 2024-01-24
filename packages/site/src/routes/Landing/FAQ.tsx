export const FAQContent: [handle: React.ReactNode, content: React.ReactNode][] = [
  [
    'Is it free to use?',
    <>
      Yes, it is free to use. We do not charge any fees for using our services for now. However, you
      still need to pay the gas fees yourself for the transactions you make. This includes the
      account creation and any other transactions you make.
    </>,
  ],

  [
    'Which networks are supported?',
    <>
      Currently we only support the following networks:
      <ul>
        <li>Ethereum Mainnet</li>
        <li>Ethereum Goerli</li>
        <li>Linea</li>
        <li>Arbitrum One</li>
        <li>Optimism</li>
        <li>Scroll</li>
        <li>Polygon</li>
        <li>Base</li>
        <li>BNB Chain</li>
        <li>Gnosis Chain</li>
      </ul>
      This list will be updated as we add support for more networks.
    </>,
  ],

  [
    'Which AA Wallets are supported?',
    <>
      In practice, any ERC-4337 compatible AA wallet is supported. However, we only test and support
      the following wallets for now:
      <ul>
        <li>CyberConnect (In progress)</li>
        <li>Gnosis Safe (Planned)</li>
      </ul>
      This list will be updated as we add support for more wallets.
    </>,
  ],

  [
    'How do I get started?',
    <>
      We currently do not have a ready to use version of the app. If you want to try it out, you
      need to take your own risk and build it yourself. You can find the source code at our Github
      repository.
      <br />
      If you're curious about how it works, you can read our documentation and see the demo video.
    </>,
  ],

  [
    'What is snAAps?',
    <>
      snAAps is a MetaMask Snap designed to use the ERC-4337 Account Abstraction wallets directly in
      your MetaMask wallet.
      <br />
      snAAps is designed to provide a better user experience for AA wallets on MetaMask and our plan
      is to be the one-stop hub for all Account Abstraction wallets.
      <br />
      Simply put, with snAAps, you can use any dApp with your AA wallet, directly on MetaMask.
    </>,
  ],

  [
    'Is it safe to use?',
    <>
      Currently we are still in the development phase and can't make any promises. Our code is open
      source but we do not recommend using it in production yet. It is unaudited and undocumented.
      <br />
      We're working hard to make it production ready as soon as possible. If you want to help us,
      you can contribute to our Github repository.
      <br />
      We do not take any responsibility for any loss of funds or any other damages caused by using
      our product.
      <br />
      Simply put,
      <br />
      <b>Do not use it with your main wallet.</b>
    </>,
  ],
];
