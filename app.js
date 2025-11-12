const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing=require('./models/listing.js');
const path = require('path');
const methodOverride=require('method-override');
app.use(methodOverride('_method'));


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

app.get('/',(req,res)=>{
    res.send('Hello World!');
})
//index route for listings
app.get("/listings",async(req,res)=>{
  const allListing= await Listing.find({});
 res.render("listings/index", { allListing });

}); 

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

//show Rouite
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id);
     res.render("listings/show",{listing});
});
//create route
app.post("/listings",async(req,res)=>{
    //let{title,description,price,location,country}=req.body;
    let newListing=req.body.listing;
    const listing=new Listing(newListing);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);

});

//edit route
// ✅ Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

app.put("/listings/:id", async (req, res) => {
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings`);
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
let{id}=req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listings");
});

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

app.listen(port,(req,res)=>{ //test karne ke liye
    console.log(`Server is running on port ${port}`);
});