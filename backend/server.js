import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/resumes", resumeRoutes);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
