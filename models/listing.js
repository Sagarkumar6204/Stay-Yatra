const mongoose = require('mongoose');
const schema=mongoose.Schema;

const listingSchema=new schema({
title:{
    type : String,
    required : true,
},
description:String,
images:
{type:String,
    default:"https://png.pngtree.com/background/20230526/original/pngtree-sunset-in-ocean-palm-tree-clouds-natural-scene-wallpaper-picture-image_2742444.jpg",
    set:(v)=> v === "" ? "https://png.pngtree.com/background/20230526/original/pngtree-sunset-in-ocean-palm-tree-clouds-natural-scene-wallpaper-picture-image_2742444.jpg" : v,
},
price:Number,
location:String,
country:String,
});
const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;