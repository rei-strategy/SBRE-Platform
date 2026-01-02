import { Router } from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import profileRoutes from "./profile";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);

export default router;
