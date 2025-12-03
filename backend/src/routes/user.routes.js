import express from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
