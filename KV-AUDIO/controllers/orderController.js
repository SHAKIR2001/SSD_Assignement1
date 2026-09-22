import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItCustomer, isItADMIN } from "./userController.js";


export async function addOrder(req,res){
    const data = req.body;
    const orderInfo = { //its working like dummy we just assign value to this dummy by getting from the frontend
        orderedItems : []

    }

    if ( req.user == null){
        res.status(401).json( {message : "Please login and try again"})
        return
    }

    orderInfo.email = req.user.email; //user in email eduththal


    const lastOrder = await Order.find().sort({orderId: -1}).limit(1) //get the last order ID

    if(lastOrder.length == 0){ //check if there any orderIDs avauilable
        orderInfo.orderId = "ORD0001" //if not avauilable the "ORD0001" this is the 1st orderId
    }
    else{

        const lastOrderId = lastOrder[0].orderId     
        const lastOrderNumberInString = lastOrderId.replace("ORD", "") //remove the "ORD" from the orderId
        const lastOrderNumber = parseInt(lastOrderNumberInString) //ORD ei remove seidhaalum adhan pin irukkum numbers String il irukkum so adhei Int aha maatrudhal
        const currentOrderNumber = lastOrderNumber + 1 //last orderId in number itku +1 pannudhal 
        const formattedNumber = String(currentOrderNumber).padStart(4, '0') //4digits number manage seidhal (doubt) 0001 0002 0003
        orderInfo.orderId = "ORD" + formattedNumber
    }

    let oneDayCost = 0; //oneDayCost vaiable declare for store the cost of the order (price)

    for(let i=0; i<data.orderedItems.length; i++){ //front endaal anuppiya product = data.orderedItems order seidha productshal
        try{
             const product = await Product.findOne({key : data.orderedItems[i].key}) //import product and search if there any products have related to the key that we get from order

             if (product == null){
                res.status(404).json({message : "Product with key "+data.orderedItems[i].key+" not found" })
                return
             }

/*             { 
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
            } */


             orderInfo.orderedItems.push({
                product : {
                    key : product.key,
                    name : product.name,
                    image : product.image[0],
                    price : product.price
                },
                quantity : data.orderedItems[i].quantity //qiuantity get by req's body (front end)
             })

             oneDayCost += product.price * data.orderedItems[i].quantity; //calculating the total one day cost by Product price and quantity 

        }catch(e){
            console.log(e);
            res.status(500).json({message : "Can not make an order"})
        }
       
       
    }

    orderInfo.days = data.days;
    orderInfo.startingDate =  data.startingDate;
    orderInfo.endingDate =  data.endingDate;
    orderInfo.totalAmount =  oneDayCost * data.days //calculating the total amount by  totalOneday cost * how many days they want the product(day count)

    try{
        const newOrder = new Order(orderInfo)
        const result = await newOrder.save();
        
        res.json({
            message : "Order added successfully",
            order : result
        })
    }catch(e){
        res.status(500).json({message : "Order can not be created"})
    }



}


export async function getQuote(req,res){
    const data = req.body;
    const orderInfo = { //its working like dummy we just assign value to this dummy by getting from the frontend
        orderedItems : []

    }
 
    let oneDayCost = 0; //oneDayCost vaiable declare for store the cost of the order (price)

    for(let i=0; i<data.orderedItems.length; i++){ //front endaal anuppiya product = data.orderedItems order seidha productshal
        try{
             const product = await Product.findOne({key : data.orderedItems[i].key}) //import product and search if there any products have related to the key that we get from order

             if (product == null){
                res.status(404).json({message : "Product with key "+data.orderedItems[i].key+" not found" })
                return
             }

             orderInfo.orderedItems.push({
                product : {
                    key : product.key,
                    name : product.name,
                    image : product.image[0],
                    price : product.price
                },
                quantity : data.orderedItems[i].quantity //qiuantity get by req's body (front end)
             })

             oneDayCost += product.price * data.orderedItems[i].quantity; //calculating the total one day cost by Product price and quantity 

        }catch(e){
            console.log(e);
            res.status(500).json({message : "Can not make an order"})
        }
       
       
    }

    orderInfo.days = data.days;
    orderInfo.startingDate =  data.startingDate;
    orderInfo.endingDate =  data.endingDate;
    orderInfo.totalAmount =  oneDayCost * data.days //calculating the total amount by  totalOneday cost * how many days they want the product(day count)

    try{
           
        res.json({
            message : "Order quatation",
            total : orderInfo.totalAmount,
        })
    }catch(e){
        res.status(500).json({message : "Failed to get the Quotation"})
    }

}



export async function getOrders(req,res){
    
    if(isItADMIN(req)){
        try{

        const orders = await Order.find()
        res.json(orders)

        }catch(e){
            res.status(500).json({message : "Cannot get the orders"})
        }
    }

    else if(isItCustomer(req)){
     try{
        const orders = await Order.find({email : req.user.email })
        res.json(orders)
     }catch(e){
      res.status(500).json({message : "Cannot get the orders"})
     }

    }

    else{
        res.status(403).json({error : "Unauthorized"})
    }

}

export async function approveOrRejectOrder(req,res){
    const orderId =  req.params.orderId;
    const status = req.body.status;

    if(isItADMIN(req)){
        try{
            const order = await Order.findOne({
                orderId : orderId
            })

            if(order == null){
                res.status(404).json({error : "Order not found"})
            }

            await Order.updateOne({
                orderId : orderId
            },
            {
                status : status
            }
        );
        res.json({message : "Order approved/ rejected successfully"})
        }catch(e){
            res.status(500).json({error : "Failed to get order"})
        }

    }else{
        res.status(403).json({error : "Unauthorized"})

    }



}