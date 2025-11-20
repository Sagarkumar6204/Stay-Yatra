//const { string, required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportrLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    },

});
userSchema.plugin(passportrLocalMongoose);
module.exports=mongoose.model("User",userSchema);