if(process.env.NODE_ENV !=  "production"){
    require('dotenv').config()
}
console.log(process.env.NAME)

const express = require("express");
// const router = express.Router({ mergeParams: true });
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const port = 3000;
// const wrapAsync = require('./utils/err.js')
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require("./schema.js"); 
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo').default; 
const cookieParser = require("cookie-parser")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isloggedIn} = require("./middleware.js");
const dbUrl = process.env.ATLASDB_URL;


//requiring listings,reviews,users route from route folder T
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.engine('ejs', engine);
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"public")));
app.use(flash())

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60
})

store.on("error",()=>{
        console.log("ERROR IN MONGO ATLAS",error);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}


// app.get("/",(req, res)=>{
//     res.send("Route is on");
// })

app.use(session(sessionOptions));
app.use(flash());

//everything related to user authentication
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mw to use flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");  //to display when successful add
    res.locals.updated = req.flash("updated");  //to display when successful update
    res.locals.deleted = req.flash("deleted");  //to display when successful delete
    res.locals.error= req.flash("error")    //to display when not present listing request to access or edit 
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
}) //flashes are not in the respective ejs file but in flash.ejs and linked to boilerplate so that every page can be a part of them.


//using routes/listings file for all listings route requests T
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


async function main(){
    await mongoose.connect(dbUrl);
}
main()
    .then((res)=>{
        console.log("Connected to db",res);})
    .catch((err) => {
        console.log("Failed connecting to database",err)});

//listingtest
// app.get("/listingtest",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "Sample Listing",
//         description:"Sample Description",
//         price:1200,
//         location:"Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     res.send("Successful");
//     console.log("test success");
// })
 
//to check working of passport using a demo user
// app.get("/demoUser",async (req,res)=>{
//     let user1 = new User({
//         email:"djf@icloud.com",
//         username:"king"
//     })
//     let regUser = await User.register(user1,"likr");
//     res.send(regUser);
// })


// ---------------------------------- Transferred to routes folder ----------------------------

//transferred to listings.js in routes folder 
// validate schema fn using joi to pass as a mw for new listing route 
// const validateListing = (req,res,next)=>{
//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//         let errMsg = result.error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }
// //for new review route 
// const validateReview = (req,res,next)=>{
//     // let result = reviewSchema.validate(req.body);
//     let { error } = reviewSchema.validate(req.body);
//     console.log(error);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

//all listings routes were replaced with the help of router in routes folder


//--index route-- to show all available listings
// app.get("/listings", wrapAsync(async (req,res,next)=>{
//     //can us try catch or wrapsync
//         //get all listings of our db
//         let allListings = await Listing.find({})
//         res.render("/Users/saimo/Documents/WEBDEV/AirBnb_Pro/views/listings/index.ejs",{allListings});
//         //calling our default error handler which is at bottom or you can use custom handling here itselF    
// }))


// //-- for new route
// app.get("/listings/new",(req,res)=>{
//     res.render("../views/listings/new.ejs")
// })

// //show route
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const item = await Listing.findById(id).populate("reviews"); 
    
//     res.render("../views/listings/show.ejs",{item});
// }))

// //create route 
// app.post("/listings",validateListing,wrapAsync(async (req,res)=>{
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data!");
//     // }
//     //using joi
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }
//     // let {title,description,image,price,location,country} = req.body;  //you can write like this or directly like but you need to declare name as in new.ejs
//     const newListing = new Listing(req.body.listing); // means here we are directly creating a object of Listing clss with the recieved values from form
//     // console.log(listing);
//     await newListing.save();
//     res.redirect("/listings");
// }))

// //--edit route
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const item = await Listing.findById(id);
//     res.render("../views/listings/edit.ejs",{item});
// }))

// //update route
// app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send valid data!");
//     }
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{ ...req.body.listing }); //here we are passing id of item and the new details that are entered by user to update 
//     res.redirect("/listings");
// }))

// //delete route by id
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }))

// //post reviews route
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{

//     //finding the listing by that review
//     let listing =await Listing.findById(req.params.id);

//     //creating a new review of the model of ours from the acquired data 
//     let newReview = new Review(req.body.review)

//     //now pushing that newReview into the array of Reviews of that particular listing only
//     listing.reviews.push(newReview)

//     //now saving both the review and updated listing to db
//     await newReview.save();
//     await listing.save();

//     // res.send(listing);
//     res.redirect(`/listings/${listing._id}`);

// }))

// //delete reviews route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let{id , reviewId} = req.params;
//     //we are deleting the review from db
//     let deletedReview = await Review.findByIdAndDelete(reviewId);
//     //we are deleting from the array of reviews of that listing by using pull operator 
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})

//     // console.log(deletedReview);
//     res.redirect(`/listings/${id}`);
// }))

// ---------------------------------- Transferred to routes folder ----------------------------





//common error if the page req is not matched to any of the above routes, it will catch and send to next error
app.all("/",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

//for async errors 
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Error occured!"} = err;
    res.status(statusCode).render("./listings/error.ejs",{err});
    // res.render("/Users/saimo/Documents/WEBDEV/AirBnb_Pro/views/listings/error.ejs",{err})
    // res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log("listening..")
})

