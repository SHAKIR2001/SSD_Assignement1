import express from "express";
import { addProduct, getProducts, updateProducts, deleteProduct, getProductById } from "../controllers/productController.js"; 

const productRouter = express.Router();

productRouter.post("/", addProduct)
productRouter.get("/", getProducts)
productRouter.put("/:key", updateProducts)
productRouter.delete("/:key", deleteProduct)
productRouter.get("/:key", getProductById )

export default productRouter;