import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    orderId : {
        type : String,
        required : true,
        unique : true
    },

    email : {
        type : String, // in here we wget the user email who make the order
        required : true
    },

    orderDate : {
        type : Date,
        required : true,
        default: Date.now
    },

    orderedItems : { //in here we store the perticuler items details because if we want to provide a bill then the product details in the bill should be in the same details when a ordered cant change the price or other etc.. after the order
        type : [
            {
                product : {
                    key : {
                        type : String,
                        required : true
                    },

                    name : {
                        type : String,
                        required : true
                    },

                    image : {
                        type : String,
                        required : true
                    },

                        price : {
                        type : Number,
                        required : true
                    }
                },

                quantity : {
                    type : Number,
                    required : true
                }
            }
        ],

        required : true
    },

    days :  { //in here we store how many days the perticuller item needs ( Because we rent items  not sell)
        type : Number,
        required : true
    },

    startingDate : {
        type : Date,
        required : true
    },

    endingDate : {
        type : Date,
        required : true
    },

    totalAmount : {
        type : Number,
        required : true
    },

    isApproved : {
        type : Boolean,
        required : true,
        default : false
    },

    status : {
        type : String,
        required : true,
        default : "Pending"
    }

})

const Order = mongoose.model("Order",  orderSchema);

export default Order;