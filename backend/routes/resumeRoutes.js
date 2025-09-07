import express from "express";
import multer from "multer";
import { uploadResume, getAllResumes, getResumeById, deleteResume } from "../controllers/resumeController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getAllResumes);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

export default router;
