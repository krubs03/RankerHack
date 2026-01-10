import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Health check (NO DB HERE)
app.get("/api/health", (req, res) => {
  res.json({ message: "API is up!" });
});

app.get("/api/example", async (req, res) => {
  try {
    await connectDB();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB failed" });
  }
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

export default app;