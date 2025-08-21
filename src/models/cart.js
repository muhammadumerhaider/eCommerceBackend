import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        required: true
    },
    items:[
        {
            productId: {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required : true
            },
            quantity:{
                type : Number,
                required : true,
                min : 1
            },
            price:{
                type : Number,
                required : true
            }
        }
    ],
    totalPrice:{
        type : Number,
        required : true
    },
    isOrdered:{
        type : Boolean,
        default : false
    }
})

const Cart = mongoose.model('Cart',cartSchema);
export default Cart;