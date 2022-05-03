// https://docs.ethers.io/v4/api-contract.html
// https://stackoverflow.com/questions/55154713/error-the-method-eth-sendtransaction-does-not-exist-is-not-available
var abi = require('ethereumjs-abi')
const ethers=require('ethers');
var ethUtil=require("ethereumjs-util");
const {web3,wallet,signer,getMethods} = require("../config/blockchain");
const getSignatureParameters = signature => {
    if (!ethers.utils.isHexString(signature)) {
      throw new Error(
          'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = ethers.BigNumber.from(v).toNumber();
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v
    };
  }; 
const constructMetaTransactionMessage = (nonce, salt, functionSignature, contractAddress) => {
    return abi.soliditySHA3(
      ["uint256","address","uint256","bytes"],
      [nonce, contractAddress, salt, ethUtil.toBuffer(Array.from((functionSignature)))]
    );
  }
const writeHelper = async (deLibC,wallet,functionSignature, contractInterface, gasLimit) => {
    let nonce = await deLibC.getNonce(wallet.address);
    console.log("fs",functionSignature);
    let messageToSign = constructMetaTransactionMessage(parseInt(nonce), process.env.CHAINID, functionSignature,process.env.contractAddress);
    
    const signature = await wallet.signMessage(messageToSign);
    console.info(`User signature is ${signature}`);

    let { r, s, v } = getSignatureParameters(signature);
  
    let rawTx, tx;
    rawTx = {
      to: process.env.contractAddress,
    data: contractInterface.encodeFunctionData("executeMetaTransaction", [wallet.address, functionSignature, r, s, v]),
      from: wallet.address,
      gasLimit: gasLimit,
    };
    // console.log("rawTx",rawTx);
//   console.log('wallet',wallet);
    tx = await wallet.signTransaction(rawTx);
    console.log("tx",tx);
  
    let transactionHash;
    try {
      let receipt = await signer.sendTransaction(tx);
      console.log("receipt",receipt);
    } 
    catch (error) {
      if (error.returnedHash && error.expectedHash) {
        console.log("Transaction hash : ", error.returnedHash);
        transactionHash = error.returnedHash;
      } 
      else {
        console.log(error);
        console.log("Error while sending transaction");
      }
    }
  
    if (transactionHash) {
      // display transactionHash
      let receipt = await signer.waitForTransaction(transactionHash);
      console.log(receipt);
      //show Success Message
    } 
    else {
      console.log("Could not get transaction hash");
    }
  }
exports.getAllOffers=async(req,res)=>{
    try {
      const {deOfferContractWithSigner} =await getMethods();
      console.log("body",req.body);
    //   console.log("here",deOfferContract)
      //let index=req.body.index;
      let offers=[];
      //let index;
     // index=app.get('/count')
      const offersCount = await deOfferContractWithSigner
            .offerCount()
     console.log(offersCount.toNumber())  
    //   for(let   i=1;i<=offersCount.toNumber();i++){
        const offer = await deOfferContractWithSigner
            .getAllOffers()

            console.log(offer)
            offers=offer
    //   }
      
      res.send(offers);
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }

exports.updateOffer=async(req,res)=>{
    try {
      const  {deOfferContractWithSigner}=await getMethods();
      const { offerId,description,dateExpired,brandImage,offerImage,offerDiscount } = req.body;
      let tx =  await deOfferContractWithSigner
          .updateOffer(offerId,description,dateExpired,brandImage,offerImage,offerDiscount,{
                gasLimit: 500000,
          }
            );
            console.log("Hash*********************",tx.hash);
            if(tx.hash){
                res.send(tx);
            }

    }
    catch (err) {
        res.send("err");
       console.log(err);
    }
};

  exports.createOffer=async(req,res)=>{
    try {
      const  {deOfferContractWithSigner,contractInterface}=await getMethods();
      const { brand,description,dateExpired,brandImage,offerImage,totalStock,offerDiscount,category,code } = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
    //   const gasP =await web3.eth.getGasPrice();
    //   let myEstimatedGas;
    // console.log(contractInterface)
    // let functionSignature = contractInterface.encodeFunctionData("addOffers", [brand,description,dateExpired,brandImage,offerImage,totalStock,offerDiscount,category,code]);
    // console.log(req.body);
    let tx =  await deOfferContractWithSigner
          .addOffers(brand,description,dateExpired,brandImage,offerImage,totalStock,offerDiscount,category,code,{
            
                gasLimit: 500000,
          }
            );
            console.log("Hash*********************",tx.hash);
            // "0xaf0068dcf728afa5accd02172867627da4e6f946dfb8174a7be31f01b11d5364"
            
            // The operation is NOT complete yet; we must wait until it is mined
            // await tx.wait();
            if(tx.hash){
                res.send(tx);
            }
            
            // const gasLimit = 500000;

    // await writeHelper(deOfferContractWithSigner, wallet, functionSignature, contractInterface, gasLimit);
    
    } catch (err) {
      res.send("err");
     console.log(err);
    }
  }

  exports.purchaseOffer=async(req,res)=>{
    try {
      const  {deOfferContractWithSigner}=await getMethods();
      const {offerId,purchaser} = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
      
      await deOfferContractWithSigner
          .purchaseOffer(offerId,purchaser,{
            
            gasLimit: 500000,
      })
      await deOfferContractWithSigner.on("PurchaseOffer", (offerId, purchaser, timestamp, event) => {
            // Called when anyone changes the value
        
            console.log(offerId);
            // "0x14791697260E4c9A71f18484C9f997B308e59325"
        
            console.log(purchaser);
            // "Hello World"
        
            console.log(timestamp);
            // "Ilike turtles."
        
            // See Event Emitter below for all properties on Event
            console.log(event.blockNumber);
            // 4115004
        });
          res.send(200);
       
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }

  exports.getMyOffer=async(req,res)=>{
    try {
      const  {deOfferContractWithSigner}=await getMethods();
      const {purchaser} = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
        let myOffers=[];
      const myOffer=await deOfferContractWithSigner
          .getMyOffers(purchaser)
          res.send(myOffer);

          
       
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }
  exports.offerById=async(req,res)=>{
    try {
      const  {deOfferContractWithSigner}=await getMethods();
      const {offerId} = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
        
      const offer=await deOfferContractWithSigner
          .getOffer(offerId)
        res.send(offer);

          
       
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }