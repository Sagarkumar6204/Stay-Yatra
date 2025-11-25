
const Listing=require("./models/listing");
const Review=require("./models/reviews");
const ExpressError=require('./utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('./schema.js');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { 
        req.session.redirectUrl = req.originalUrl;   // ✅ fixed
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/user/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next(); 
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
       
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
if (error) {
    let msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
} else {
    next();
}

};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

