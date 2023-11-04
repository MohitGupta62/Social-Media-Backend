const mongoose = require("mongoose")
const plm = require('passport-local-mongoose')


mongoose.connect("mongodb://127.0.0.1:27017/socialmedia");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    picture: String,
    likes: {
        type: Array,
        default:[]
    }
})

userSchema.plugin(plm);  //password ko incrept and decrept me save karta hai
                         // || Incrept - Serialization & Decrept - Deserialization
                         
module.exports = mongoose.model("user", userSchema)
