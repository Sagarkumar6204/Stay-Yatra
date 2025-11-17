const mongoose = require('mongoose');
const reviews = require('./reviews');
const { ref } = require('joi');
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://png.pngtree.com/background/20230526/original/pngtree-sunset-in-ocean-palm-tree-clouds-natural-scene-wallpaper-picture-image_2742444.jpg",
      set: (v) =>
        v === ""
          ? "https://png.pngtree.com/background/20230526/original/pngtree-sunset-in-ocean-palm-tree-clouds-natural-scene-wallpaper-picture-image_2742444.jpg"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:mongoose.Schema.Types.ObjectId,
ref:"Review",
  }]
});

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;