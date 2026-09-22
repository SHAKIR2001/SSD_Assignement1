import mongoose from "mongoose";

const inquirySchema =  new mongoose.Schema({

    id : {
        type : Number,
        required : true,
        unique : true

    },

    email : {
        type : String,
        required : true, //unique true kudukkaameiku kaarnam :-oru user many reviews poda mudiyumaaha irukka wendum
        
    },

    message : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        required : true,
        default : Date.now
    },

    responce : {
        type : String,
        required : false,
        default : ""
    },

    isResolved : {
        type : Boolean,
        required : true,
        default : false
    }

});

const Inquiry = mongoose.model("inquiries", inquirySchema)

export default Inquiry