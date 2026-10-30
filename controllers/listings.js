//this file contains all the callbacks of the routes which are used in /routes/listings.js file.

const Listing = require("../models/listings.js");

//including geo coding for this page
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});


//callback to display all listings
//--index route-- to show all available listings
module.exports.index = async (req,res,next)=>{
    //can us try catch or wrapsync
        //get all listings of our db
        let allListings = await Listing.find({})
        res.render("./listings/index.ejs",{allListings});
        //calling our default error handler which is at bottom or you can use custom handling here itselF    
}

//-- for new route
module.exports.renderNewForm = (req,res)=>{

    //check if authenticated or not to create a new listing else pass a flash to let him log in 
    // console.log(req.user);

    //instead of writing code here we are passing it as middleware by creating a fn for this in middleware.js
    // if(!req.isAuthenticated()){
    //     req.flash("error","Login to create a listing!");
    //     return res.redirect("/login");
    // }

    res.render("../views/listings/new.ejs")
}

//show route
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const item = await Listing.findById(id)
        .populate({path :"reviews",     //means for every listing populate every review and for every review populate its author
            populate:
            {path:"author"}
        })
        .populate("owner");  //to get info of the posted user

    if(!item){
        req.flash("error","The listing you are trying to access does not exist");
        return res.redirect("/listings");
    }
    // console.log(item);
    res.render("../views/listings/show.ejs",{item});
}

//create route
module.exports.createListing = async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    console.log(response.body.features[0].geometry);
    // res.send("done")

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data!");
    // }
    //using joi
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }

    //obtaining the path and filename [saved as url and filename in db schema] of uploded image from Cloudinary which lies in req.file.path
    let url = req.file.path;
    let filename = req.file.filename;

    // let {title,description,image,price,location,country} = req.body;  //you can write like this or directly like but you need to declare name as in new.ejs
    const newListing = new Listing(req.body.listing); // means here we are directly creating a object of Listing clss with the recieved values from form
    // console.log(listing);

    //saving owner name also to db by default
    newListing.owner = req.user._id;

    //now giving the path and filename fields of our image to listing which we got from cloudinary before saving to db
    newListing.image.url=url;
    newListing.image.filename=filename

    // Access the first feature in the array [0] and its nested geometry path
    newListing.geometry.type = response.body.features[0].geometry.type;
    newListing.geometry.coordinates = response.body.features[0].geometry.coordinates;

    // res.send(newListing);

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","Listing Created!")
    res.redirect("/listings");
}

//--edit route
module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    const item = await Listing.findById(id);
     if(!item){
        req.flash("error","The listing you are trying to edit does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = item.image.url;
    originalImageUrl = originalImageUrl.replace( /\/upload/g,"/upload/w_200,e_blur:100")
    res.render("../views/listings/edit.ejs",{item,originalImageUrl});
}

//update route
module.exports.updateListing = async (req,res,next)=>{

    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data!");
    }
    let {id} = req.params;
    let listing =     await Listing.findByIdAndUpdate(id,{ ...req.body.listing }); //here we are passing id of item and the new details that are entered by user to update 

    //passing this authentication function as mw -> isOwner
    // let {id} = req.params;
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","You don't have the permission to edit this listing")
    //     return res.redirect(`/listings/${id}`)
    // }

    //getting updated image from cloudinary
    if(typeof req.file != "undefined"){
         let url = req.file.path;
        let filename = req.file.filename;

        //setting new values of image
        listing.image = {url,filename};

        await listing.save();
    }

    req.flash("updated","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

//delete route by id
module.exports.destroyListing = async (req,res,next)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("deleted","Listing Deleted!")
    res.redirect("/listings");
}