import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { getNotifications, deleteNotifications } from "../controllers/notification.controller.js";

const router = Router();

// All notification routes require being logged in
router.route("/").get(verifyJWT, getNotifications);
router.route("/").delete(verifyJWT, deleteNotifications);

export default router;