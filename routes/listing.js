const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");


const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingContorller = require("../controllers/listings.js");
const multer = require("multer");
const {storage}=require("../cloundConfig.js");
const upload = multer({ storage});

//index route for listings
router
  .route("/")
  .get(wrapAsync(listingContorller.index))
  .post(
    isLoggedIn,
   
     upload.single('listing[image][url]'),
      validateListing,
     wrapAsync(listingContorller.createListing)
   );
// Express route for file upload



//new route
router.get("/new", isLoggedIn, listingContorller.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingContorller.showListings))
  .put(
    
    isLoggedIn,
    isOwner,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingContorller.updateListings)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingContorller.destroy));

//show Rouite

//edit route
// ✅ Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingContorller.editRenderForm)
);
//update route

//delete route

module.exports = router;
