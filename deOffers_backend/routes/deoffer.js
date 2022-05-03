
const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
    getAllOffers,
    createOffer,
    purchaseOffer,
    getMyOffer,
    offerById,
    updateOffer
   
  } = require('../controllers/deoffer.controller.js');

router.get("/all", asyncHandler(getAllOffers));

router.post("/create", asyncHandler(createOffer));

// {
//     "brand":"nike",
//     "description":"A shoe brand",
//     "dateExpired":50,
//     "brandImage":"https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg",
//     "offerImage":"https://i.pinimg.com/736x/a2/14/a4/a214a4a72020c4584bb48579863ecf3e--adidas-logo-adidas-symbol.jpg",
//     "totalStock":100,
//     "offerDiscount":25,
//     "category":"shoes",
//     "code":"VARFAME"
// }
router.put("/update",asyncHandler(updateOffer));
// {
//     "offerId":"5",
//     "description":"We make the best pizza",
//     "dateExpired":10,
//     "brandImage":"https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg",
//     "offerImage":"https://i.pinimg.com/736x/a2/14/a4/a214a4a72020c4584bb48579863ecf3e--adidas-logo-adidas-symbol.jpg",
//     "offerDiscount":20
// }
router.get("/purchase", asyncHandler(purchaseOffer));

router.get("/my", asyncHandler(getMyOffer));
// {
//     "purchaser":"address"
// }
router.get("/id", asyncHandler(offerById));
// {
//     "offerId":"id"
// }
module.exports = router;