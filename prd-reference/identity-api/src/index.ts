import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("combined"));

const landingHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Identity API</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; background:#f5f6fb; color:#0c111d; }
      h1 { margin-top:0; }
      code { background:#272d3d; color:#fff; padding:0.2rem 0.4rem; border-radius:4px; }
      .card { background:#fff; border-radius:12px; padding:1.5rem; margin-top:1rem; box-shadow:0 20px 45px rgba(15,20,40,0.12); }
      ul { line-height:1.6; }
    </style>
  </head>
  <body>
    <h1>Identity & Access API</h1>
    <p>Server is running. Use the endpoints below to exercise auth flows.</p>
    <div class="card">
      <h2>Common endpoints</h2>
      <ul>
        <li><code>GET /health</code></li>
        <li><code>POST /auth/signup</code></li>
        <li><code>POST /auth/verify</code></li>
        <li><code>POST /auth/login</code></li>
        <li><code>POST /auth/google/start</code> + <code>/auth/google/callback</code></li>
        <li><code>POST /auth/mfa/enroll</code>, <code>/auth/mfa/verify</code></li>
        <li><code>POST /profile</code></li>
        <li><code>GET /admin/roles</code> / <code>POST /admin/roles/:userId</code></li>
        <li><code>GET /admin/audit</code></li>
      </ul>
      <p>See <code>identity-api/README.md</code> for usage + env setup.</p>
    </div>
  </body>
</html>
`;

app.get("/", (_req, res) => res.send(landingHtml));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(routes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
);

const start = async () => {
  await prisma.$connect();
  app.listen(env.port, () => {
    console.log(`Identity API listening on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
