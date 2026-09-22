import mongoose from "mongoose";

const reviewSchema =  new mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true //one email(user) can have only one review
    },

    name : {
        type : String,
        required : true
    },

    rating : {
        type : Number,
        required : true
    },

    comment : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        required : true,
        default : Date.now() //get the current date
    },

    profilePicture : {
        type : String,
        required : true,
        default : "http://www.shrek.lk"
    },

    isApproved : {
        type : Boolean,
        required : true,
        default : false
    }

})

const Review = mongoose.model("Review", reviewSchema)

export default Review;