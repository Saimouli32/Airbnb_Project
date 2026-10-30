const express = require("express");
const router= express.Router({ mergeParams: true });
const wrapAsync = require('../utils/err.js');
const {listingSchema} = require('../schema.js');
const Listing = require("../models/listings.js");
// const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");

//flashes are in flash.ejs and linked to boilerplate

//all middlewares are moved to middlwares.js
//all callbacks are moved to /controllers/reviews.js

//using controller and transferred all callbacks. requirng them here and pass as middlewares to the path
const listingController = require("../controllers/listings.js") //to get our index route callback

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


//restructions routes - usign router.route to handle different requests coming to same path in a single request
//--index route-- to show all available listings AND createListing route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single("listing[image][url]"),
        wrapAsync(listingController.createListing));


//keep this route above the /:id because interpretor might think /new value as /id value!
//-- for new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//to showListing route, to updateListing route, to deletelisting route combined
router.route("/:id")
    
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//--edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
 