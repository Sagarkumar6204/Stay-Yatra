const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session=require("express-session");
const flash=require("connect-flash");
const path = require("path");

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
const sessionOptions={
    secret:"stay-yatra-secret-key",
     resave: false,
      saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());
//register
app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous")
    {

  req.flash("error", "user not registered!");

    }
    else{
         req.flash("success", "user registered successfully!");

    }
   
    res.redirect("/hello");


});

//say hello
app.get("/hello", (req, res) => {
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");

    res.render("page", { name: req.session.name});
});



//get count the session
app.get("/reqcount",(req,res)=>{
    if(req.session.count)
    {
        req.session.count++;

    }
    else{
        req.session.count=1;
    }
    
res.send(`you send a request ${req.session.count} times! `)
});


//test the session
app.get("/test",(req,res)=>{
res.send("test successful");
});


app.listen(3000,()=>{
    console.log("server started :3000");
});