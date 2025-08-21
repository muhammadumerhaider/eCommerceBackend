import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email:{
        type : String,
        required: [true, "Email is required"],
        lowercase : true
    },
    password:{
        type : String,
        required : [true, "Password is required"]
    },
    role:{
        type : String,
        enum: ["customer", "admin"], 
        default: "customer"
    }
})

// userSchema.methods.matchPassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// }

const User = mongoose.model('User',userSchema)
export default User;