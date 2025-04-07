let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        default:""
    },
    type: {
        type: String,
        enum: ['Mountain Bike', 'Road Bike', 'Hybrid Bike', 'Electric Bike', 'Kids Bike', 'Accessories'],
        required: true
    },
    image: {
        type: String,
        default: ""
    }
},{
    timestamps:true
})
module.exports =  mongoose.model('category',categorySchema)
