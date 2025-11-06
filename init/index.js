const mongoose = require('mongoose');
const initdata=require('./data.js');
const Listing=require('../models/listing.js');

const MONGO_URL = "mongodb://localhost:27017/stay-yatra";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});


const initDB=async()=>{
   await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
}
initDB();