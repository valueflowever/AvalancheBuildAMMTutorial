# avalanche-build-AMM-tutorial
*** build amm like uniswap on avalanche network ***

- [Demo](#Demo)
- [Introduction](#Introduction)
- [The Components of AMM](#The-Components-of-AMM)
- [Deploy AMM smart contract](#Deploy-AMM-smart-contract)
- [Modify avalanche-sdk code](#Modify-avalanche-sdk-code)
- [Modify avalanche-interface code](#Modify-avalanche-interface-code)
- [Create your ERC20 token](#create-your-ERC20-token)
- [The video demo of add liquidity and swap token](#the-video-demo-of-add-liquidity-and-swap-token)

## Demo

- Demo Video：https://www.bilibili.com/video/BV1cg411j7Hw/
- Similar demo website(use polygon network)：www.dfdota.cn
- github： https://github.com/valueflowever/avalanche-build-AMM-tutorial

## Introduction 

***What is Avalanche?***

Avalanche is the fastest smart contract platform in the blockchain, and the fastest transaction completion on the avalanche protocol chain, the largest number of validators, and the security of all PoS protocol activities. This tutorial choose Avalanche's C-Chain test network to deploy AMM smart contract.

***What is AMM ?***

AMM(Automated Market Maker), market maker play both buyer and seller, they get fee from other people transactions by adding liquidity, compare to centralized exchange, AMM doesn't need toekn buyer,so it can achieve the greatest liquidity and the highest average daily trading volume.

***What is Uniswap ?***

[uniswap](https://docs.uniswap.org/protocol/V2/concepts/protocol-overview/how-uniswap-works)is the top Decentralized exchange deploy on ethereum, the famous project use AMM protocol to achieve commercial success.

***Why choose Uniswap V2 AMM protocol deploy on Avalanche ?***

Currently most of the Decentralized exchange fork the AMM smart contract of Uniswap V2, for example sushiswap/pancakeswap/quickswap, they have achieved success in commercial applications.  
Create AMM is a complicated process, and have very high requirements for solodity code writing, Considering the development cost and practicality, we choose to fork the smart contract of Uniswap V2 to build the decentralized exchange.

***What is Remix ?***

[Remix](http://remix.app.hubwiz.com/) solidity IDE, we can write and deploy smart contract.

---

## The Components of AMM
* Router smart contract(the function of swap token and add/remove liqidity)
* Factory smart contract(the function of create liquidity pair and manage which address to get transaction fees)
* WETH Token smart contract(mainnet token is used to pay gas rather than swap token, we often need wrap mainnet token fist, beacause of deploying on Avalanche network, we should use WAVAX replace of the WETH)

## Deploy AMM smart contract

1. Go to [Chainlist](https://chainlist.org/) add Avalanche Testnet in Metamask, Testnet ChainID is 43113.
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/MetaMask%E6%B7%BB%E5%8A%A0AVAX%E6%B5%8B%E8%AF%95%E7%BD%91%E7%BB%9C.png)

2.部署在Avalanche测试网上，先去[水龙头合约](https://faucet.avax-test.network/)领取测试代币![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%A2%86%E5%8F%96AVAX%E6%B5%8B%E8%AF%95%E4%BB%A3%E5%B8%81.png)

3.部署工厂合约

* 打开[Remix](http://remix.app.hubwiz.com/),创建Factory.sol文件，导入[工厂合约代码](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/Factory.sol)

* 在 UniswapV2Factory 中添加常量 constant INIT_CODE_PAIR_HASH

``` solidity
contract UniswapV2Factory is IUniswapV2Factory {
    # etc
    
    // 部署路由合约需要使用 INIT_CODE_PAIR_HASH 参数
    bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(UniswapV2Pair).creationCode));
    
    # etc
```

* 编译器中solidity的版本选择 ***0.5.16***，EVM版本选择 ***istanbul***，编译次数填写 ***999999*** ![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%BC%96%E8%AF%91%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6.png)

* Metamask选择***Avalanche的测试网***，Remix部署的环境选择***注入的Web3***，部署的合约选择***UniswapV2Factory***

* 部署栏中 _FEETOSETTER 填入自己的地址(管理收取交易手续费的地址) ![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6.png)

* 点击 **transact**后，在Metamask中确认部署  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%A1%AE%E8%AE%A4%E9%83%A8%E7%BD%B2%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6.png)

* 部署成功后，我们可以看到已部署合约栏出现刚才部署的工厂合约

* 点击已部署合约的最右侧，复制部署好的工厂合约地址并记录，之后点击 INIT_CODE_PAIR_HASH 获取值，稍后部署路由合约时会用到  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%8E%82%E5%90%88%E7%BA%A6INIT_CODE_PAIR_HASH%E5%B8%B8%E9%87%8F%E5%80%BC.png)

4.部署路由合约

* 创建Factory.sol文件，导入[路由合约的代码](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/Router.sol)

* 在路由合约中搜索 hex，将 init code hash 修改为 工厂合约中显示的INIT_CODE_PAIR_HASH值（0x后的值) ![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E4%BF%AE%E6%94%B9%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* 编译器中solidity的版本选择 ***0.6.6***，EVM版本选择 ***istanbul***， 编译次数填写 ***999999*** ![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%BC%96%E8%AF%91%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* 部署页面的合约栏选择***UniswapV2Router02***

* 部署栏中 _FACTORY 填入刚才部署工厂合约的地址，_WETH 填入 Avalanche测试网 WAVAX的地址（查询 Avalanche C-chain 测试网的[区块链浏览器](https://cchain.explorer.avax-test.network/tokens/0xd00ae08403B9bbb9124bB305C09058E32C39A48c/token-transfers) 得到 WAVAX的地址： 0xd00ae08403B9bbb9124bB305C09058E32C39A48c  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* 点击部署，并在Metamask中点击确认  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%A1%AE%E8%AE%A4%E9%83%A8%E7%BD%B2%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6.png)

* 部署成功后，记录下路由合约的地址(稍后会用到)  
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6%E6%88%90%E5%8A%9F.png)

5.部署multicall合约

* Remix创建multicall.sol文件，导入[multicall的代码](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/multicall.sol)

* 编译器中solidity的版本选择 ***0.6.6***，EVM版本选择 ***istanbul***， 编译次数填写 ***999999*** ![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E7%BC%96%E8%AF%91multicall%E5%90%88%E7%BA%A6.png)

* 部署multicall合约
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E9%83%A8%E7%BD%B2multicall%E5%90%88%E7%BA%A6.png)

* 部署成功后，记录multicall合约地址，接下来会用到  

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E8%AE%B0%E5%BD%95multicall%E5%90%88%E7%BA%A6%E5%9C%B0%E5%9D%80.png)

现在已经将AMM的主要功能部署在Avalanche测试网上。

## Modify avalanche-sdk code
*接下来将用到原uniswap-sdk以及uniswap-interface部分代码，在上传之前，我已经对部分内容进行了修改，随后你只需要修改一下参数即可*

* [avalanche-sdk代码](https://github.com/valueflowever/avalanche-build-AMM-tutorial/tree/main/avalanche-sdk)
``` sh
cd avalanche-sdk
npm install
```
* 修改 Build-Defi-AMM-on-Avalanche\avalanche-sdk\src 目录下 constants.ts 文件中 FACTORY_ADDRESS 和 INIT_CODE_HASH，分别填入刚才部署的工厂合约地址以及 INIT_CODE_PAIR_HASH参数

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-sdk%E5%8F%82%E6%95%B0%E4%BF%AE%E6%94%B9.png)

* avalanche-sdk 修改 avalanche-sdk\src\entities\currency.ts 默认token命名, 这里用tAVAX代替
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-sdk%E4%BF%AE%E6%94%B9%E9%BB%98%E8%AE%A4token%E5%91%BD%E5%90%8D.png)

然后打开 package.json 修改参数 "name"，作为自己的库上传到NPM

``` sh
npm login // 登录npm账号
npm init // 初始化
npm publish --access public //上传npm包
```
![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-sdk%E5%BA%93%E5%8F%91%E5%B8%83%E6%88%90%E5%8A%9F.png)

上传成功

## Modify avalanche-interface code
* [avalanche-interface]()代码

``` sh
cd avalanche-interface
```
* 找到 package.json 文件, 按下图所示位置，修改为自己刚才上传的库名以及版本号

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E4%BF%AE%E6%94%B9%E4%B8%BA%E8%87%AA%E5%B7%B1%E5%88%9A%E6%89%8D%E4%B8%8A%E4%BC%A0%E7%9A%84%E5%BA%93%E5%90%8D.png)

* 然后将原来在文件内的库给替换掉

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E6%9B%BF%E6%8D%A2%E5%BA%93.png)

* 修改 avalanche-interface\src\constants\index.ts 路径下的路由地址

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E4%BF%AE%E6%94%B9%E8%B7%AF%E7%94%B1%E5%90%88%E7%BA%A6%E5%9C%B0%E5%9D%80.png)

* 将avalanche-inteface\src\constants\multicall\index.ts 参数改为自己的multicall合约地址

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E4%BF%AE%E6%94%B9multicall%E5%90%88%E7%BA%A6%E5%9C%B0%E5%9D%80.png)

```sh
npm install
npm start
```

启动后，即可看到如下所示页面，已经成功部署! AMM的功能已经实现，后续可以按照自己的需求进行修改。

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/avalanche-interface%E6%B5%8B%E8%AF%95%E9%A1%B5%E9%9D%A2.png)

## Create your ERC20 token
1. 打开Remix,导入 [EIP20.sol](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/EIP20.sol) 和 [EIP20Interface.sol](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/smart_contract/EIP20Interface.sol)

2. 部署两个代币合合约并记录下它们的地址, 部署 EIP20.sol 即可（用来测试AMM功能）

* 按照下面参数说明，创建自己的代币

| 参数 | 说明 |
| --- | --- | 
| _INITIALAMOUNT | 代币发行量 | 
| _TOKENNAME | 代币名称 | 
| _DECIMALUNITS | 浮点位数 | 
| _TOKENSYMBOL | 代币简称 | 

![](https://github.com/valueflowever/avalanche-build-AMM-tutorial/blob/main/image/%E5%A1%AB%E5%86%99%E4%BD%A0%E7%9A%84%E4%BB%A3%E5%B8%81%E5%B9%B6%E7%A1%AE%E8%AE%A4%E9%83%A8%E7%BD%B2.png)

## The video demo of add liquidity and swap token
Demo URL：https://www.bilibili.com/video/BV1cg411j7Hw/

