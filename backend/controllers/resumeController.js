import { pool } from "../db/index.js";
import { analyzeResumeFromPdfBuffer } from "../services/analysisService.js";

export async function uploadResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const analysis = await analyzeResumeFromPdfBuffer(req.file.buffer);

    // Save to DB
    const {
      name, email, phone, linkedin_url, portfolio_url, summary,
      work_experience = [], education = [], technical_skills = [],
      soft_skills = [], projects = [], certifications = [],
      resume_rating, improvement_areas, upskill_suggestions = []
    } = analysis;

    const insertSQL = `
      INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects, certifications,
        resume_rating, improvement_areas, upskill_suggestions
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,
        $14,$15,$16
      )
      RETURNING *;
    `;

    const values = [
      req.file.originalname, name, email, phone, linkedin_url, portfolio_url, summary,
      JSON.stringify(work_experience), JSON.stringify(education),
      JSON.stringify(technical_skills), JSON.stringify(soft_skills),
      JSON.stringify(projects), JSON.stringify(certifications),
      resume_rating, improvement_areas,
      JSON.stringify(upskill_suggestions)
    ];

    const { rows } = await pool.query(insertSQL, values);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}

export async function getAllResumes(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT id, file_name, uploaded_at, name, email, resume_rating FROM resumes ORDER BY uploaded_at DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch resumes" });
  }
}

export async function getResumeById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM resumes WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch resume" });
  }
}

export async function deleteResume(req, res) {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM resumes WHERE id=$1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    return res.json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Failed to delete resume" });
  }
}

