import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name:{
        type : String,
        required : [true, "Product name is required"]
    },
    description:{
        type : String,
        required : [true, "Product description is required"]
    },
    price:{
        type : Number,
        required : [true, "Product price is required"],
        min : [0,"Product price cannot be negative"]
    },
    imgURL:{
        type : String,
        required : true,
        trim : true
    },
    category:{
        type : String,
        required : true
    }
})

const Product = mongoose.model('Product',productSchema)
export default Product;