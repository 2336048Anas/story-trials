import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import assetsRouter from "./routes/assets.js";
import trialsRouter from "./routes/trials.js";
import paymentsRouter from "./routes/payments.js";
import usersRouter from "./routes/users.js";
import licensesRouter from "./routes/licenses.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "story-trials api",
    syntheticDataOnly: true,
    note: "This system uses synthetic data only - no real patient data or financial transactions"
  });
});

app.use("/assets", assetsRouter);
app.use("/trials", trialsRouter);
app.use("/payments", paymentsRouter);
app.use("/users", usersRouter);
app.use("/licenses", licensesRouter);

app.use((req, res) => res.status(404).json({ ok: false, error: "Not found" }));

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});
