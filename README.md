# avalanche-build-AMM-tutorial
*** build amm like uniswap on avalanche network ***

- [Demo](#Demo)
- [Introduction](#Introduction)
- [The Components of AMM](#The-Components-of-AMM)
- [Deploy AMM smart contract](#Deploy-AMM-smart-contract)
- [Modify avalanche-sdk code](#Modify-avalanche-sdk-code)
- [Modify avalanche-interface code](#Modify-avalanche-interface-code)
- [Create your ERC20 token](#Create-your-ERC20-token)
- [The video demo of add liquidity and swap token](#The-video-demo-of-add-liquidity-and-swap-token)

## Demo

- Demo Video：https://www.bilibili.com/video/BV1cg411j7Hw/
- Similar Demo Website(use polygon network)：www.dfdota.cn
- Github： https://github.com/valueflowever/avalanche-build-AMM-tutorial

## Introduction 

***What is Avalanche?***

Avalanche is the fastest smart contract platform in the blockchain, and the fastest transaction completion on the avalanche protocol chain, the largest number of validators, and the security of all PoS protocol activities. This tutorial choose Avalanche's C-Chain test network to deploy AMM smart contract.

***What is AMM ?***

AMM(Automated Market Maker), market maker play both buyer and seller, they get fee from other people transactions by adding liquidity, compare to centralized exchange, AMM doesn't need toekn buyer,so it can achieve the greatest liquidity and the highest average daily trading volume.

***What is Uniswap ?***

[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/protocol-overview/how-uniswap-works) is the top Decentralized exchange deploy on ethereum, the famous project use AMM protocol to achieve commercial success.

***Why choose Uniswap V2 AMM protocol deploy on Avalanche ?***

Currently most of the Decentralized exchange fork the AMM smart contract of Uniswap V2, for example sushiswap/pancakeswap/quickswap, they have achieved success in commercial applications.  
Create AMM is a complicated process, and have very high requirements for solodity code writing, Considering the development cost and practicality, we choose to fork the smart contract of Uniswap V2 to build the decentralized exchange.

***What is Remix ?***

[Remix](https://remix.ethereum.org/) solidity IDE, we can write and deploy smart contract.

---

## The Components of AMM
* Router smart contract(the function of swap token and add/remove liqidity)
* Factory smart contract(the function of create liquidity pair and manage which address to get transaction fees)
* WETH Token smart contract(mainnet token is used to pay gas rather than swap token, we often need wrap mainnet token fist, beacause of deploying on Avalanche network, we should use WAVAX replace of the WETH)

## Deploy AMM smart contract

1. Go to [Chainlist](https://chainlist.org/) and add Avalanche Testnet to Metamask, Testnet ChainID is 43113.
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/MetaMask%E6%B7%BB%E5%8A%A0AVAX%E6%B5%8B%E8%AF%95%E7%BD%91%E7%BB%9C.png)

2.Before we deploy smart contract on Avalanche testnet，we should go to [Avalanche faucets](https://faucet.avax-test.network/) get some token for test.

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%A2%86%E5%8F%96AVAX%E6%B5%8B%E8%AF%95%E4%BB%A3%E5%B8%81.png)

3.Deploy Factory smart contract

* Open [Remix](https://remix.ethereum.org/), create Factory.sol, use this code [Factory Code](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/Factory.sol)

* Add const 'INIT_CODE_PAIR_HASH' in UniswapV2Factory 

``` solidity
contract UniswapV2Factory is IUniswapV2Factory {
    # etc
    
    // Deploy Router.sol need INIT_CODE_PAIR_HASH
    bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(UniswapV2Pair).creationCode));
    
    # etc}
```

* COMPILER choose solidity version ***0.5.16***, EVM version choose ***istanbul***, optimization times fill in ***999999*** 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%BC%96%E8%AF%91%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6.png)

* Metamask choose ***Avalanche Fuji Testnet***, Remix ENVIRONMENT choose ***Injected Web3***, CONTRACT choose ***UniswapV2Factory*** deploy

* DEPLOY _FEETOSETTER fill your address(manage address which get transaction fees) 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6.png)

* click **transact**, and confirm in Metamask
 
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%A1%AE%E8%AE%A4%E9%83%A8%E7%BD%B2%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6.png)

* After deploy success, now we can see the Factory contract in Deployed Contracts

* Click right and copy depolyed contract address, and then click get 'INIT_CODE_PAIR_HASH', we will use it when deploying router contract.
  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6INIT_CODE_PAIR_HASH%E5%B8%B8%E9%87%8F%E5%80%BC.png)

4.Deploy Router smart contract

* create Router.sol, use this [Router contract code](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/Router.sol)

* search 'hex' in Router.sol, and change 'init code hash' to Factory contract INIT_CODE_PAIR_HASH(Not included 0x) 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E4%BF%AE%E6%94%B9%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* COMPILER choose Solidity Version ***0.6.6***, EVM Version choose ***istanbul***, optimization times fill in ***999999*** 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%BC%96%E8%AF%91%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* CONTRACT choose ***UniswapV2Router02*** deploy

* DEPLOY _FACTORY fill in deployed factory contract address，_WETH fill in Avalanche testnet WAVAX address（you can use Avalanche C-chain testnet [Explorer](https://cchain.explorer.avax-test.network/tokens/0xd00ae08403B9bbb9124bB305C09058E32C39A48c/token-transfers) get WAVAX address： 0xd00ae08403B9bbb9124bB305C09058E32C39A48c  

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* click deploy and confirm in MetaMask
  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%A1%AE%E8%AE%A4%E9%83%A8%E7%BD%B2%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* after deploy success. copy your deployed router contract address(it will be used in next step)  

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6%E6%88%90%E5%8A%9F.png)

5.Deploy multicall contract

* Remix create multicall.sol, use [multicall code](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/multicall.sol)

* COMPILER choose solidity version ***0.6.6***，EVM Version choose ***istanbul***, optimization times fill in  ***999999*** 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%BC%96%E8%AF%91multicall%E5%90%88%E7%BA%A6.png)

* Deploy multicall contract

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2multicall%E5%90%88%E7%BA%A6.png)

* after deploy success. copy your deployed multicall contract address(it will be used in next step)  

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E8%AE%B0%E5%BD%95multicall%E5%90%88%E7%BA%A6%E5%9C%B0%E5%9D%80.png)

Now we have built mainly AMM function on avalanche testnet.

## Modify avalanche-sdk code
*In the next, we will use modified uniswap-sdk and uniswap-interface code，i have modified many place and then you just need change a little*

* [avalanche-sdk code](https://github.com/valueflowever/avalanche-build-AMM-tutorial/tree/main/avalanche-sdk)
``` sh
cd avalanche-sdk
npm install
```
* [avalanche-sdk\src] choose 'constants.ts' file, fill in your deployed factory contract address and INIT_CODE_PAIR_HASH to 'FACTORY_ADDRESS' and 'INIT_CODE_HASH'

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-sdk%E5%8F%82%E6%95%B0%E4%BF%AE%E6%94%B9.png)

* avalanche-sdk [avalanche-sdk\src\entities\currency.ts] use 'tAVAX' take replace of the origin token name

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-sdk%E4%BF%AE%E6%94%B9%E9%BB%98%E8%AE%A4token%E5%91%BD%E5%90%8D.png)

* open package.json change "name" and version, then push as your own npm package

``` sh
npm login // login your npm account 
npm init // init file
npm publish --access public // push your npm package
```
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-sdk%E5%BA%93%E5%8F%91%E5%B8%83%E6%88%90%E5%8A%9F.png)

ok, push success.

## Modify avalanche-interface code
* [avalanche-interface code](https://github.com/valueflowever/avalanche-build-AMM-tutorial/tree/main/avalanche-interface) 

``` sh
cd avalanche-interface
```
* find package.json, search the position like below picture, change to your package name and version

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E4%BF%AE%E6%94%B9%E4%B8%BA%E8%87%AA%E5%B7%B1%E5%88%9A%E6%89%8D%E4%B8%8A%E4%BC%A0%E7%9A%84%E5%BA%93%E5%90%8D.png)

* use your package name replace of origin avalanche-sdk package name

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E6%9B%BF%E6%8D%A2%E5%BA%93.png)

* [avalanche-interface\src\constants\index.ts] change router address

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E4%BF%AE%E6%94%B9%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6%E5%9C%B0%E5%9D%80.png)

* [avalanche-inteface\src\constants\multicall\index.ts] set your multicall contract address like below picture

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E4%BF%AE%E6%94%B9multicall%E5%90%88%E7%BA%A6%E5%9C%B0%E5%9D%80.png)

```sh
npm install
npm start
```

Now we can look the website like below picture, we deploy the AMM and build the DEX success! you can modifiy the code by your requirements.

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E6%B5%8B%E8%AF%95%E9%A1%B5%E9%9D%A2.png)

## Create your ERC20 token
1. Open Remix, create [EIP20.sol](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/EIP20.sol) and [EIP20Interface.sol](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/EIP20Interface.sol) solidity files.

* Follow the parameter description below, create your ERC-20 token

| Param | Description |
| --- | --- | 
| _INITIALAMOUNT | total amount of the token| 
| _TOKENNAME | name of the token | 
| _DECIMALUNITS | decimals of the token | 
| _TOKENSYMBOL | symbol of the token | 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E5%A1%AB%E5%86%99%E4%BD%A0%E7%9A%84%E4%BB%A3%E5%B8%81%E5%B9%B6%E7%A1%AE%E8%AE%A4%E9%83%A8%E7%BD%B2.png)

2. Deploy EIP20.sol use different TOKENNAME twice and copy their contract address, they will be used to test DEX function.

## The video demo of add liquidity and swap token
*** this demo video show the processing of using our create token to add liquidity and swap.***
Demo URL：https://www.bilibili.com/video/BV1cg411j7Hw/
