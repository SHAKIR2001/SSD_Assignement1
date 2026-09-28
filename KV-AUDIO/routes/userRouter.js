import express from "express"
import { registerUser, registerAdmin, loginUser, logoutUser, getAllUsers, blockOrUnblockUser, getUser, getSession, updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser)
userRouter.post("/admin", registerAdmin)
userRouter.post("/login", loginUser)
userRouter.post("/logout", logoutUser)
userRouter.get("/all", getAllUsers )
userRouter.get("/session", getSession)
userRouter.put("/block/:email", blockOrUnblockUser)
userRouter.get("/",getUser)
userRouter.put("/profile", updateProfile)

export default userRouter
