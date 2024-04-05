import express from "express";
import { googleFacebook, register } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleFacebook);
router.post("/facebook", googleFacebook);

export default router;
