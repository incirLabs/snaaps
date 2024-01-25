"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[796],{9053:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>l,frontMatter:()=>c,metadata:()=>r,toc:()=>u});var s=n(2322),a=n(5392);const c={id:"accounts",title:"Accounts",sidebar_position:2},o="Accounts",r={id:"accounts",title:"Accounts",description:"There are two types of accounts in snAAps: Created accounts and Integrated AA accounts.",source:"@site/docs/accounts.md",sourceDirName:".",slug:"/accounts",permalink:"/snaaps/accounts",draft:!1,unlisted:!1,editUrl:"https://github.com/incirLabs/snaaps/blob/main/packages/docs/docs/accounts.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"accounts",title:"Accounts",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/snaaps/"},next:{title:"Supported Networks",permalink:"/snaaps/supported-networks"}},i={},u=[{value:"Created accounts",id:"created-accounts",level:2},{value:"Integrated AA accounts",id:"integrated-aa-accounts",level:2}];function d(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"accounts",children:"Accounts"}),"\n",(0,s.jsxs)(t.p,{children:["There are two types of accounts in snAAps: ",(0,s.jsx)(t.strong,{children:"Created accounts"})," and ",(0,s.jsx)(t.strong,{children:"Integrated AA accounts"}),"."]}),"\n",(0,s.jsx)(t.h2,{id:"created-accounts",children:"Created accounts"}),"\n",(0,s.jsxs)(t.p,{children:["Created accounts are accounts that are created by the user using our site and snap.\nThey are created by calling the ",(0,s.jsx)(t.code,{children:"createAccount"})," function on the ",(0,s.jsx)(t.code,{children:"Account Factory"})," contract. The user can then deposit funds into the account and use them to pay for services.\nSigner of these accounts is generated by the user's MetaMask wallet specifically for this account. They are dependent on user's MetaMask seed phrase. If the user loses access to their wallet, they can recover their account by using the same mnemonic phrase of their MetaMask wallet."]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Pros:","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Full support for all features."}),"\n",(0,s.jsx)(t.li,{children:"Can create as many accounts as they want."}),"\n",(0,s.jsx)(t.li,{children:"Can use the same account on multiple devices."}),"\n",(0,s.jsx)(t.li,{children:"Can recover their account using only their MetaMask seed phrase."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"integrated-aa-accounts",children:"Integrated AA accounts"}),"\n",(0,s.jsxs)(t.p,{children:["Integrated AA accounts are accounts that are created outside of our site and snap. User must have an AA account on any of the ",(0,s.jsx)(t.a,{href:"/snaaps/supported-networks",children:"supported networks"})," to be able to use them.\nUser must know the address and the signer private key of the account to be able to add and use it on our site and snap.\nPrivate key of the signer is securely stored on the user's MetaMask wallet. If the user loses access to their wallet, they must recover by using the same private key of their signer."]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Limitations:","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Some features may not be supported."}),"\n",(0,s.jsx)(t.li,{children:"Can have issues with some AA accounts that are not fully ERC-4337 compatible."}),"\n",(0,s.jsx)(t.li,{children:"Must have access to the private key of the signer to be able to recover the account."}),"\n"]}),"\n"]}),"\n"]})]})}function l(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},5392:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>o});var s=n(2784);const a={},c=s.createContext(a);function o(e){const t=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(c.Provider,{value:t},e.children)}}}]);