const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req,res,next)=>{

    //using try catch even there is wrapAsync because wrapAsync only shows message but leads to no page we want to go to signup page again if registration fails. so to redirect to signup page again
    //  if there is error we are using try catch
    try{
        let {username, email, password} = req.body;

        //creating a newuser doc of model User of collection user with the email and username only cause password saving part will be in next step. we cant directly store without salting and hashing
        const newUser = new User({email,username});

        //now pushing the details of the newUser along with the password here to db with the help of .register(doc,password) so that salting and hashing occur
        //this[.register] is like .save but with hashing and salting
        const registeredUser = await User.register(newUser,password);

        console.log(registeredUser);

        //to automatically login into page after signup use passport methof -> req.login() in which we pass our newly registered user and callback
        req.login(registeredUser,(error)=>{
            if(error){
                return next(error);
            }
            req.flash("success",`Registration Successful! Welcome to Wanderlust ${username}`);
            res.redirect("/listings");
        })

        //flashing and redirecting to listings if successful
    }catch(e){
        //if error flashing error message and again redirecting to signup
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

//render login page form mw
module.exports.renderLoginPage = (req,res)=>{
    res.render("./users/login.ejs")
}


//redirect after login mw 
module.exports.postLoginPage = async (req,res)=>{
        let{username} = req.body;
    req.flash("success",`Login Successful! Welcome back ${username}`);

    //after login direclty sending user to his requested page instead of the listings page 
    //but this also wont work due to passport so save this in res.locals and pass as a mw.
    // res.redirect(req.session.redirectUrl);

    //so redirect to res.locals.redirectUrl cause thats where we are storing the original url in mw
    //so if redirectUrl is undefined means he is in homepage. then take the homepage route itself to redirect 
    let redirectUrl = res.locals.redirectUrl || "/listings" //this is because if u login in listings page the originalUrl value will be undefined so in that case it says page not found. so to fix that we are doing this way

    res.redirect(redirectUrl)

    // res.redirect("/listings"); //not doing this anymore
}


//logout mw 
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Log out Successful");
        res.redirect("/listings");
    })
}