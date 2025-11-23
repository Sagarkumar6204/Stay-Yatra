const Listing=require("../models/listing");


module.exports.index=async(req,res)=>{
  const allListing= await Listing.find({});
 res.render("listings/index", { allListing });

};

module.exports.renderNewForm=async(req,res)=>{
   
    res.render("listings/new");
};

module.exports.showListings=async(req,res)=>{
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
    //  console.log(listing);
     res.render("listings/show",{listing});
};

module.exports.createListing = async (req, res) => {
  
  const listing = new Listing(req.body.listing);

  listing.owner = req.user._id;

  listing.image = {
    url: req.file.path,        // Cloudinary URL
    filename: req.file.filename // Cloudinary public_id
  };

  await listing.save();
  console.log(listing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.editRenderForm=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing)
     {
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
  res.render("listings/edit", { listing });
};

module.exports.updateListings=async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,'Empty Listing Data');
    }
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success", "Listing Updated!");
res.redirect(`/listings/${id}`);
};

module.exports.destroy=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};