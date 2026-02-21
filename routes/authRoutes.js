import express from "express";
import {
  generateAccessTokenUsingRefreshToken,
  login,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", generateAccessTokenUsingRefreshToken);

export default router;
