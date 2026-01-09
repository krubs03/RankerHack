import express from "express";
import cors from "cors";
import path from "path";
import { ENV } from "./lib/Env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// Credentials: true => Allows addition of cookies in requests
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));

app.use("api/inngest", serve({client: inngest, functions, signingKey: ENV.INGEST_SIGNING_KEY}));

const __dirname = path.resolve();

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is up!" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();