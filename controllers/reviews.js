const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");


// /post reviews route - callback
module.exports.createReview = async(req,res)=>{

    //finding the listing by that review
    let listing =await Listing.findById(req.params.id);

    //creating a new review of the model of ours from the acquired data 
    let newReview = new Review(req.body.review)
        // get author field for the created review 
        newReview.author = req.user._id;
        // console.log(newReview.author)
    
    
    //now pushing that newReview into the array of Reviews of that particular listing only
    listing.reviews.push(newReview)

    //now saving both the review and updated listing to db
    await newReview.save();
    await listing.save();

    // res.send(listing);

    req.flash("success","Review Created!")
    res.redirect(`/listings/${listing._id}`);
    
}

//delete reviews route - callback
module.exports.destroyReview = async(req,res)=>{
    let{id , reviewId} = req.params;
    //we are deleting the review from db
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    //we are deleting from the array of reviews of that listing by using pull operator 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})

    // console.log(deletedReview);
    req.flash("deleted","Review Deleted!")
    res.redirect(`/listings/${id}`);
}