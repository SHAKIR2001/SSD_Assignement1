import { addOrder,getQuote, getOrders, approveOrRejectOrder } from "../controllers/orderController.js";
import express from 'express'

const orderRouter = express.Router();

orderRouter.post("/", addOrder);
orderRouter.post("/quote", getQuote );
orderRouter.get("/", getOrders);
orderRouter.put("/status/:orderId", approveOrRejectOrder);

export default orderRouter;
