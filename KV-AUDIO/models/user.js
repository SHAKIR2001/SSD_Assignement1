import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email : {
        type :String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    isBlocked : {
        type : Boolean,
        required : true,
        default : false
    },

    role : {
        type : String,
        default : "customer"
    },

    firstName : {
        type : String,
        required : true
    },

    lastName : {
        type : String,
        require : true
    },

    address : {
        type : String,
        required : true
    },

    phone :  {
        type : String,
        required : true
    },

    profilePicture : {
        type : String,
        required : true,
        default : "https://i.pinimg.com/736x/e1/e1/af/e1e1af3435004e297bc6067d2448f8e5.jpg" 
    }

});

const User = mongoose.model("User",userSchema)

export default User

