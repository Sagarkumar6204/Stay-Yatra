const Listing=require("../models/listing");


module.exports.index=async(req,res)=>{
  const listings= await Listing.find({});
 res.render("listings/index", { listings });

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
  try {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user?._id;

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    } else {
      listing.image = {
        url: "https://res.cloudinary.com/demo/image/upload/v1720000000/default.jpg",
        filename: "default"
      };
    }

    // IMPORTANT: Save the document
    await listing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Listing create failed. Please check required fields and image upload.");
    res.redirect("/listings/new");
  }
};

module.exports.editRenderForm=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing)
     {
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
     }
     let originalImgUrl=listing.image.url;
     originalImgUrl=originalImgUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit", { listing,originalImgUrl });
};

module.exports.updateListings = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, 'Empty Listing Data');
  }

  const { id } = req.params;

  // OLD LISTING FETCH KARO
  let listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  // TEXT FIELDS UPDATE KARO 
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;

  // 🔥 MOST IMPORTANT PART:
  // ONLY UPDATE IMAGE IF req.file EXISTS
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  // ❗ If NO new file → DO NOT TOUCH image field!
  //   Old image safe rahegi.

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};




module.exports.destroy=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};