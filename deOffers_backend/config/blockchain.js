// const Web3 = require('web3');
// const DigiFashion=require('../../../src/abis/DigiFashion.json')
// const Token=require('../../../src/abis/Token.json')
// //const CryptoBoys=require('../../../src/abis/CryptoBoys.json')
// //const EthSwap=require('../../../src/abis/EthSwap.json')
// //const Token=require('../../../src/abis/Token.json')

// const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

// //let marketplace, networkDataM, networkId, account;
// let networkId, networkDataD, DigiFashionContract,tokenContract,networkDataT;
// //let networkId,networkData,ethSwapData,tokenData,cryptoBoysContract,token,ethswap;
// const initializeBlockchain = async () => {
//   try {
//     networkId = await web3.eth.net.getId();
//     networkDataD = DigiFashion.networks[networkId];
//     networkDataT = Token.networks[networkId]
//     DigiFashionContract= new web3.eth.Contract(DigiFashion.abi, networkDataD.address);
//     tokenContract = new web3.eth.Contract(Token.abi, networkDataT.address)
//     // const accounts = await web3.eth.getAccounts();
//     // console.log(accounts);

//     // account = accounts[0];

//     // const myBalance = await tokenContract.methods.balanceOf(account).call();

//     // console.log(web3.utils.fromWei(myBalance.toString()), networkDataM.address);
//     // networkId =  await web3.eth.net.getId();
//     // networkData = CryptoBoys.networks[networkId];
//     // ethSwapData = EthSwap.networks[networkId]
//     // tokenData = Token.networks[networkId]
//     // cryptoBoysContract = new web3.eth.Contract(CryptoBoys.abi, networkData.address)
//     // token = new web3.eth.Contract(Token.abi, tokenData.address)
//     // ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
//   }
//   catch (err) {
//     console.log(err);
//   }
// };

// const getMethods = async () => {
//   return { 
//     DigiFashionContract,
//     networkDataD,
//     networkDataT,  
//     networkId,
//     tokenContract
//    // account
//   };
// };
// module.exports = {
//   initializeBlockchain,
//   web3,
//   getMethods,
// };

const ethers=require('ethers');
require('dotenv').config;
// const {ethereum}=process;
const web3 = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today/');
// const provider=new ethers.providers.Web3Provider(ethereum);
const signer=web3.getSigner("0x9574a450194692E2C873AAd82297C075584488CD");
// let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
let wallet = new ethers.Wallet(process.env.privateKey, web3);
const deOffercontractAddress ="0x43Bb602D6a511c7df69AB4047AcB3a50e31447D1"
// '0xB7E090ec46E859BaD4ea0f56886c81683564c4b3'
const DeOffer=require('../abis/DeOfferAbis.json')

let deOfferContract;
const initializeBlockchain = async () => {
    try {
        console.log(signer.getAddress())
        console.log(wallet)
        deOfferContract = new ethers.Contract(deOffercontractAddress, DeOffer, signer);
        deOfferContractWithSigner = new ethers.Contract(deOffercontractAddress, DeOffer, wallet);
        // console.log(deOfferContract)

    }
    catch(error){
        console.log(error.msg);
    }
}
const getMethods = async () => {
  return { 
    deOfferContract,
    deOfferContractWithSigner
  };
};

module.exports = {
  initializeBlockchain,
  web3,
  getMethods,
};