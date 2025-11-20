const express=require("express");
const router=express.Router();


//index -user
router.get("/",(req,res)=>{
    res.send("GET for posts ");
});

//show-user
router.get("/:id",(req,res)=>{
    res.send("GET for posts id");
});
//post-user
router.post("/",(req,res)=>{
    res.send("post for posts");
});

//delete-user
router.delete("/:id",(req,res)=>{
    res.send("delete for posts id");
});
module.exports=router;