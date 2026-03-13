import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { auth } from "./lib/auth";
import termsRouter from "./routes/terms";

const app = new Hono();

const corsOrigins = process.env.CORS_ORIGINS?.split(",") || [
  "http://localhost:4321",
  "http://frontend:4321",
];

app.use(logger());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/api/terms", termsRouter);

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Server running on port ${port}`);
console.log(`CORS allowed origins: ${corsOrigins.join(", ")}`);

serve({
  fetch: app.fetch,
  port,
});