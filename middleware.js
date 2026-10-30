//is authenticated middleware
const Listing = require("./models/listings.js");
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');
const Review = require("./models/reviews.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Login to access!");
        return res.redirect("/login");
    }
    next();
}


//saving the url using res.locals because passport will reset the url everytime login happens to overcome that we are doing this 
module.exports.saveRedirectUrl = (req,res,next)=>{
    //so if exists a original url in req.session.redirectUrl, save it inside res.locals.redirectUrl
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have the permission to edit this listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have the permission to delete this review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}


module.exports.validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        let errMsg = result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    // let result = reviewSchema.validate(req.body);
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


