import Product from "../models/product.js"
import { isItADMIN } from "./userController.js"

export async function addProduct(req,res){

    if(req.user == null){
        res.status(401).json({
            message : "Please login and try again"
        })
        return //add return to close the function so other codes not run
    }

    if(req.user.role != "admin"){
        res.status(401).json({
            message : "You are not authorized to perform this action"
        })
        return //add return to close the function so other codes not run
    }

    const data = req.body
    const newProduct = new Product(data)

    try{
        await newProduct.save();  
        res.json({
            message : "Product added successfully" 
        })

    }catch(e){
        res.status(500).json({
            error : "Product can not be added"
        })

    }
}

export async function getProducts(req,res){
    try{
        if(isItADMIN(req)){
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({availability : true})
            res.json(products)
        }
    }catch(e){
        res.status(500).json({
            message : "Failed to get products"
        })
    }

}

export async function updateProducts(req,res){
    try{
        if(isItADMIN(req)){

            const key = req.params.key
            const data = req.body

            await Product.updateOne({key:key},data)

            res.json({message : "Product updated successfully"})

        }else{
            res.status(403).json({ message : "You are not authorized to perform this action"})
        }

    }catch(e){
        res.status(500).json({ message : "Can not update the products"})
    }
}

export async function deleteProduct(req,res){

    try{
        if(isItADMIN(req)){

            const key = req.params.key
            await Product.deleteOne({key:key})

            res.json({message : "Product deleted"})
        }else{
            res.status(403).json({message : "You are not authorized to perform this action "})
        }

    }catch(e){
        res.json({message : "Product cannot be deleted"})
    }
}

export async function getProductById(req,res){
    try{

        const key = req.params.key
        const product = await Product.findOne({key : key})

        if (product == null){
            res.status(404).json({message : "Product can not be found"})
            return;
        }

        res.json(product)
    }catch(e){
        res.status(500).json({ message : "Failed to get product"})
    }
}