// https://docs.ethers.io/v4/api-contract.html
const {web3,getMethods} = require("../config/blockchain");


exports.getAllOffers=async(req,res)=>{
    try {
      const {deOfferContract} =await getMethods();
      console.log("body",req.body);
    //   console.log("here",deOfferContract)
      //let index=req.body.index;
      let offers=[];
      //let index;
     // index=app.get('/count')
      const offersCount = await deOfferContract
            .offerCount()
     console.log(offersCount.toNumber())  
    //   for(let   i=1;i<=offersCount.toNumber();i++){
        const offer = await deOfferContract
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

  exports.createOffer=async(req,res)=>{
    try {
      const  {deOfferContractWithSigner}=await getMethods();
      const { brand,description,dateExpired,brandImage,offerImage,totalStock,offerDiscount,category,code } = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
    //   const gasP =await web3.eth.getGasPrice();
    //   let myEstimatedGas;
    console.log(req.body);
      await deOfferContractWithSigner
          .addOffers(brand,description,dateExpired,brandImage,offerImage,totalStock,offerDiscount,category,code
            )
          
    
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }

  exports.purchaseOffer=async(req,res)=>{
    try {
      const  {deOfferContract}=await getMethods();
      const {offerId,purchaser} = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
      
      await deOfferContract
          .purchaseOffer(offerId,purchaser)
      await deOfferContract.on("PurchaseOffer", (offerId, purchaser, timestamp, event) => {
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
      const  {deOfferContract}=await getMethods();
      const {purchaser} = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
        let myOffers=[];
      const myOffer=await deOfferContract
          .getMyOffers(purchaser)
          res.send(myOffer);

          
       
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }
  exports.offerById=async(req,res)=>{
    try {
      const  {deOfferContract}=await getMethods();
      const {offerId} = req.body;
      //await tokenContract.methods.approve(networkDataD.address, price).send({ from: account }).on('transactionHash', (hash) => {
        
      const offer=await deOfferContract
          .getOffer(offerId)
        res.send(offer);

          
       
    } catch (err) {
      res.send("err");
      console.log(err);
    }
  }