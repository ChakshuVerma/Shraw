import express from "express";
import {
  loginUserController,
  signupUserController,
  logoutUserController,
  markUserVerifiedController,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/login", loginUserController);
router.post("/signup", signupUserController);
router.post("/logout", logoutUserController);
router.post("/verify-email", markUserVerifiedController);

export default router;
