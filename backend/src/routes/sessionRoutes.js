import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import {
  createNewSession,
  getActiveSessions,
  getSessionById,
  getRecentSessions,
  joinSession,
  endSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createNewSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/recent", protectRoute, getRecentSessions);
router.get("/:sessionId", protectRoute, getSessionById);

router.post("/:sessionId/join", protectRoute, joinSession);
router.post("/:sessionId/end", protectRoute, endSession);

//TODO: Get participants for sessions

export default router;