const express = require("express");
const router= express.Router();
// const User = require("/Users/saimo/Documents/WEBDEV/AirBnb_Pro/models/user.js");
const wrapAsync = require('../utils/err.js')
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

//all middlewares are moved to middlwares.js
//all callbacks are moved to /controllers/reviews.js
const userController = require("../controllers/users.js")

//to render signupform and signup save actually routes
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))


//for login page form and login authentication and setting up page routes  
router.route("/login")
    .get(userController.renderLoginPage)
    .post(saveRedirectUrl,
        passport.authenticate("local",{
        failureRedirect : "/login",   // login is done by this authenticate fn
        failureFlash : true
    }), userController.postLoginPage)   //we are just showing the page he was on before login instead of listingspage  

    
//logout route 
router.get("/logout",userController.logout)


module.exports = router;