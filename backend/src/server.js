import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middleware/protectRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
//Enables authentication for all routes
app.use(clerkMiddleware());

// Health check (NO DB HERE)
app.get("/api/health", (req, res) => {
  res.json({ message: "API is up!" });
});

// Inngest webhook (DB inside functions is OK)
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
    signingKey: ENV.INGEST_SIGNING_KEY,
  })
);

app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

export default app;