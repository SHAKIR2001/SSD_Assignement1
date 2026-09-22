import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    key : {
        type : String,
        required : true,
        unique : true
    },

    name : {
        type : String,
        required : true
    },
    
    price : {
        type : Number,
        required : true
    },

    category : {
        type : String,
        required : true,
        default : "Uncategorized"
    },

    dimensions : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    availability : {
        type : Boolean,
        required : true,
        default : true
    },

    image : {
        type : [String], // [String] ivvaaru koduppadham moolam multiple images add seiyyalaam
        required : true,
        default : ["https://m.media-amazon.com/images/I/713TUYjagQL._AC_SY300_SX300_QL70_FMwebp_.jpg"]
        
    }
})

const Product = mongoose.model("Products", productSchema)

export  default Product; 