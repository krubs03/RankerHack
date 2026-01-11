import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await connectDB();

        //Find user in DB
        const user = await User.findOne({ "clerkId": clerkId  });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        //Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoutes middleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  },
];
