import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";

const app: Application = express();

// ─── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes (add here as you build features) ──────────────────────────────
// import { authRouter } from "./routes/auth.routes";
// app.use("/api/auth", authRouter);

export default app;
