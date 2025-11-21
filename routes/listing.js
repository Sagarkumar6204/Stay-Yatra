const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");




//index route for listings
router.get("/",wrapAsync(async(req,res)=>{
  const allListing= await Listing.find({});
 res.render("listings/index", { allListing });

})); 

//new route
router.get("/new",isLoggedIn,async(req,res)=>{
   
    res.render("listings/new");
});

//show Rouite
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author",
        },
    }
     ).populate("owner");
     if(!listing)
     {
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show",{listing});
}));
//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    //let{title,description,price,location,country}=req.body;

    
    const newListing=req.body.listing;
    newListing.owner=req.user._id;

    const listing=new Listing(newListing);
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings`);
}));

//edit route
// ✅ Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing)
     {
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
  res.render("listings/edit", { listing });
}));
//update route
router.put("/:id",isLoggedIn,isLoggedIn,isOwner,validateListing,wrapAsync( async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,'Empty Listing Data');
    }
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success", "Listing Updated!");
res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

module.exports=router;
