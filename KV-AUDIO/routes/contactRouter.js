import express from "express";
import { createContactMessage, getAllContactMessages, resolveContactMessage } from "../controllers/contactController.js";


const contactRouter = express.Router();

contactRouter.post("/", createContactMessage);
contactRouter.get("/", getAllContactMessages);
contactRouter.put("/:id", resolveContactMessage);

export default contactRouter;

