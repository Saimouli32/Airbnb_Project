const mongoose=require("mongoose");
let Schema = mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
    //username and password will be added to schema directy by this passport-local-mongoose. no need to specify them in schema
});

//you need to pass this as a plugin to  your model to automatically implement hashing, salting, username, pw before export t
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);