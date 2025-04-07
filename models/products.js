let mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
let productSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true,
        unique:true
    },
    brand: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        min:0,
        default:1
    },
    quantity:{
        type:Number,
        min:0,
        default:1
    },
    description:{
        type:String,
        default:""
    },
    imgURL:{
        type:String,
        default:""
    },
    categoryID:{
        type:mongoose.Types.ObjectId,
        ref:"category",
        required:true
    },
    frameSize: {
        type: String,
        required: true
    },
    wheelSize: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports=
mongoose.model('product',productSchema)