import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router()

// api / auth / register
authRouter.post('/register', authController.register)

// api/auth/get-me
authRouter.get('/get-me', authController.getMe)

// api/auth/refresh-token
authRouter.get('/refresh-token', authController.refreshToken)

// api/auth/logout
authRouter.get('/logout',authController.logout)

export default authRouter