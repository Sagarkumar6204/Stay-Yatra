const User=require("../models/user");

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
//
module.exports.renderLoginForm=async(req,res)=>{
    res.render("users/login.ejs");
};
//
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to Stay-Yatra");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // ✅ fallback
    res.redirect(redirectUrl);
  };
  //
  module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err)
        {
            next(err);

        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
};

module.exports.signup=async(req,res)=>{
    try{
let{username, email, password}=req.body;
    const newUser=new User({email,username});
    let registeredUser=await User.register(newUser, password );
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
          
        }
              req.flash("success", "user was registered successfully");
                res.redirect("/listings");
    });
  
    }
    catch(err)
    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};