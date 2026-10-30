const express = require("express");
const router= express.Router({ mergeParams: true });
const wrapAsync = require('../utils/err.js');
// const {reviewSchema} = require('/Users/saimo/Documents/WEBDEV/AirBnb_Pro/schema.js');
// const Listing = require("../models/listings.js");
// const Review = require("../models/reviews.js");
// const ExpressError = require('/Users/saimo/Documents/WEBDEV/AirBnb_Pro/utils/ExpressError.js');
const {
    validateReview, 
    isLoggedIn, 
    isReviewAuthor} = require("../middleware.js")

//all middlewares are moved to middlwares.js
//all callbacks are moved to /controllers/reviews.js
const reviewController = require("../controllers/reviews.js");

// /post reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete reviews route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))


module.exports = router;