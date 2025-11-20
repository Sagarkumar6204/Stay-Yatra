const express=require("express");
const router=express.Router();

//index -user
router.get("/",(req,res)=>{
    res.send("GET for users");
});

//show-user
router.get("/:id",(req,res)=>{
    res.send("GET for users id");
});
//post-user
router.post("/",(req,res)=>{
    res.send("post for users");
});

//delete-user
router.delete("/:id",(req,res)=>{
    res.send("delete for users id");
});
module.exports=router;