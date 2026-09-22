import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js"
import orderRouter from "./routes/orderRouter.js";
import contactRouter from "./routes/contactRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config(); //use to access the values in .env file
const app = express();

app.use(cors())
app.use(bodyParser.json());  //idhu app = express in pirahu koduttal wendum aduththa requests(GET,POST,PUT,DELETE) nadakka mun
app.use( (req,res,next)=>{  //Authentication (identify the users)

    let token = req.header("Authorization")
    
    if (token != null){
        token = token.replace("Bearer ","") //Bearer (space) endrathei remove seidhal

        jwt.verify(token, process.env.JWT_SECRET,
        (err,decoded)=>{
            if(!err){
               req.user = decoded;
               
            }
        });
    }
    next()
});

let mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

let connection =  mongoose.connection
connection.once("open", ()=>{
    console.log("MongoDB connected successfully ✅")
});


app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/inquiries", inquiryRouter)
app.use("/api/orders", orderRouter)
app.use("/api/contact", contactRouter)

app.listen(3000,()=>{
    console.log("Server is running on PORT 3000 🚀")
});



/*   "email": "shakir@gmail.com",        customer
  "password": "password123",  */ 

  /*    "email": "shakir077@gmail.com",    admin
    "password": "password123", */