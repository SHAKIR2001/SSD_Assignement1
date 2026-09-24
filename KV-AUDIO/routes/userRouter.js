import express from "express"
import { registerUser,loginUser,getAllUsers, blockOrUnblockUser, getUser, updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/all", getAllUsers )
userRouter.put("/block/:email", blockOrUnblockUser)
userRouter.get("/",getUser)
userRouter.put("/profile", updateProfile)

export default userRouter