const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');

const Review=require("../models/reviews.js");
const Listing=require('../models/listing.js');

const {validatereview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewContorller=require("../controllers/reviews.js");

//reviews
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewContorller.createReview));

// delete review
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewContorller.destroyReview));
module.exports=router