const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    email:{
        type : String,
        required: [true, "Email is required"]
    },
    password:{
        type : String,
        required : [true, "Password is required"]
    },
    role:{
        type : String,
        required : [true, "Role is required"]
    }
})

const Register = mongoose.model('Registration',registerSchema)
module.exports = Register