const mongoose=require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./reviews.js")

//creating the schema is first step 
const listingSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    description: String,
    // image:{
    //     type:String,
    //     default:"https://www.magnific.com/free-photos-vectors/resort",
    //     set:(v) => v==="" ? "https://www.magnific.com/free-photos-vectors/resort" : v,
    // },
    // image: {
    // type: String,
    // default:
    //   "https://www.magnific.com/free-photos-vectors/resort",
    // set: (v) =>
    //   v === ""
    //     ? "https://www.magnific.com/free-photos-vectors/resort"
    //     : v,
    // },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT1DflnlW9CQWyZhnX-ev_Fm-sb8SQWAHKIMJqj3cAk1IRKyP-Cj0vvWo&s=10",
            set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT1DflnlW9CQWyZhnX-ev_Fm-sb8SQWAHKIMJqj3cAk1IRKyP-Cj0vvWo&s=10" : v
        }
    },
    price: Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
        // • The reviews: [...] syntax defines reviews as an array. Instead of saving whole review documents inside this array, it only stores their unique MongoDB IDs (ObjectId).
        // • The ref: "Review" part tells Mongoose that every ID placed in this array belongs to a document in the Review collection.
        // Because it only stores IDs, if you read this document normally, you will only see those ID strings. To pull the actual review text, rating, or author data into your query, you must use Mongoose's .populate() method:
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
            coordinates: {
            type: [Number],
            required: true
        }
    } 
});

//creating a mongoose mw to delete reviews of a listing when a listing is deleted

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
         await Review.deleteMany({_id: {$in:listing.reviews}})
    }
   
})



//now creating a model of this Schema
const Listing = mongoose.model("Listing",listingSchema);

//now you can create objects using this model directly.
//but we will do it in main page just export this

module.exports = Listing;