if(process.env.NODE_ENV !="production")
{
const env=require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride=require('method-override');
app.use(methodOverride('_method'));
const listingRouter=require("./routes/listing.js")
const userROuter=require("./routes/user.js");
const ejs = require('ejs');
const ejsMate=require('ejs-mate');
const reviewRouter = require("./routes/review.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.engine('ejs',ejsMate);
const port = 8080;
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));//help to parse the form data

const MONGO_URL = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(MONGO_URL,{
         useNewUrlParser: true,
  useUnifiedTopology: true
    });
}

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});


const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crytpto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
 cookie: {
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in ms
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // optional
    httpOnly:true,
},
};
// app.get("/",(req,res)=>{
//     res.send("I am Working!!")
// })

//session create kiiya hai or niche flash jab kch operation perform ho tab
app.use(session(sessionOptions));
app.use(flash());

//session phle fir intialize warna har baar login karwana padega jab page change hoga
//passport ko phle intialize karna padta hai
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});


//demo user
app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"Student@gmail.com",
        username:"sagar-kumar"
    });
    //second parameter is Our password;
    let registeredUser=await User.register(fakeUser, "helloWorldPassword");
    res.send(registeredUser);

    
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userROuter);


app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render('listings/error',{err});
   // res.status(statusCode).send(message);
    });
    
app.listen(port,(req,res)=>{ //test karne ke liye
    console.log(`Server is running on port ${port}`);
});