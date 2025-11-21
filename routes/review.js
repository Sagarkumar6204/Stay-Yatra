const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');

const Review=require("../models/reviews.js");
const Listing=require('../models/listing.js');

const {validatereview, isLoggedIn,isReviewAuthor}=require("../middleware.js");


//reviews
router.post("/",isLoggedIn,validatereview,wrapAsync((async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review({
    rating:req.body.review.rating,
    comment:req.body.review.comment.trim()
});
newReview.author=req.user._id;
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success", "New Review Created!");
 res.redirect(`/listings/${listing._id}`);
})));

// delete review
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    console.log("Deleting reviewId:", reviewId); // Debugging
    
    // Correct usage
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));
module.exports=router