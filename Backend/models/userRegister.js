
const mongoose = require("mongoose");



const userRegister = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    
})

module.exports = mongoose.model("user",userRegister);