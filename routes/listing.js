const express=require("express");
const router=express.Router({mergeParams:true});
const { listingSchema } = require('../schema.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
       
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//index route for listings
router.get("/",wrapAsync(async(req,res)=>{
  const allListing= await Listing.find({});
 res.render("listings/index", { allListing });

})); 

//new route
router.get("/new",wrapAsync(async(req,res)=>{
    res.render("listings/new");
}));

//show Rouite
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id).populate("reviews");
     if(!listing)
     {
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
     res.render("listings/show",{listing});
}));
//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    //let{title,description,price,location,country}=req.body;
    const newListing=req.body.listing;

    const listing=new Listing(newListing);
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings`);
}));

//edit route
// ✅ Route
router.get("/:id/edit",validateListing, wrapAsync(async (req, res) => {
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
router.put("/:id",validateListing,wrapAsync( async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,'Empty Listing Data');
    }
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success", "Listing Updated!");
res.redirect(`/listings`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

module.exports=router;
