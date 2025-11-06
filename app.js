const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing=require('./models/listing.js');
const path = require('path');
const port = 8080;
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

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

app.get("/listings",async(req,res)=>{
  const allListing= await Listing.find({});
 res.render("listings/index", { allListing });

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