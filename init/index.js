const mongoose=require("mongoose");
const initdata = require("/init/data.js");

const Listing = require("../models/listings.js");
const { init } = require("../models/listings");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then((res)=>{
        console.log("Connected to db",res);})
    .catch((err) => {
        console.log("Failed connecting to database",err)});

const initDb = async () => {
    //to delete any prior data before init our new random data
    await Listing.deleteMany({});

    //using this map to assign a owner to already existing listings
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6ad9e44ed26a5fc53299e9d4"}))

    //adding our new listing data to db
    await Listing.insertMany(initdata.data);

    console.log("Data was initialized");
}
initDb();