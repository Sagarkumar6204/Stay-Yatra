const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing=require('./models/listing.js');
const path = require('path');
const methodOverride=require('method-override');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
app.use(methodOverride('_method'));
const Review=require("./models/reviews.js");

const ejs = require('ejs');
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);
const port = 8080;
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));//help to parse the form data
const MONGO_URL = "mongodb://localhost:27017/stay-yatra";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
       
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
       
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


app.get('/',wrapAsync(async(req,res)=>{
    res.send('Hello World!');
}));
//index route for listings
app.get("/listings",wrapAsync(async(req,res)=>{
  const allListing= await Listing.find({});
 res.render("listings/index", { allListing });

})); 

//new route
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new");
}));

//show Rouite
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id).populate("reviews");
     res.render("listings/show",{listing});
}));
//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    //let{title,description,price,location,country}=req.body;
    const newListing=req.body.listing;

    const listing=new Listing(newListing);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//edit route
// ✅ Route
app.get("/listings/:id/edit",validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));
//update route
app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,'Empty Listing Data');
    }
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings`);
}));

//delete route
app.delete("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
let{id}=req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listings");
}));

//reviews
app.post("/listings/:id/reviews",validatereview,wrapAsync((async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review({
    rating:req.body.review.rating,
    comment:req.body.review.comment.trim()
});
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
 res.redirect(`/listings/${listing._id}`);
})));

// app.get('/testListing', async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "Cozy Apartment in Downtown",
//         description: "A comfortable and modern apartment located in the heart of the city.",
//         price: 120,
//         location: "Downtown",
//         country: "USA",
        

//     });
//     await sampleListing.save();
//     console.log("Sample listing saved to database");
//     res.send('Sample listing created and saved to database!');
// });


// app.all('*', (req, res, next) => {
//   next(new ExpressError(404,'Page Not Found'));
// });

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render('listings/error',{err});
   // res.status(statusCode).send(message);
    });
    
app.listen(port,(req,res)=>{ //test karne ke liye
    console.log(`Server is running on port ${port}`);
});