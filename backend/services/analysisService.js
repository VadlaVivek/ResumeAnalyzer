import pdfParse from "pdf-parse-fixed";
import { GoogleGenerativeAI } from "@google/generative-ai";

const modelName = "gemini-1.5-flash"; // good for long PDF text

function sanitizeToJson(text) {
  // If the model ever adds code fences, strip them
  const trimmed = text.trim();
  const fenceStripped = trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  // Try to find the first valid JSON object in the string
  const start = fenceStripped.indexOf("{");
  const end = fenceStripped.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = fenceStripped.slice(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // fall through
    }
  }
  // final attempt
  return JSON.parse(fenceStripped);
}

export async function analyzeResumeFromPdfBuffer(fileBuffer) {
  // 1) Extract text from PDF
  const parsed = await pdfParse(fileBuffer);
  const resumeText = parsed.text?.trim() || "";

  if (!resumeText) {
    throw new Error("Could not extract text from the PDF.");
  }

  // 2) Build prompt exactly like the assignment requests
  const prompt = `
You are an expert technical recruiter and career coach. Analyze the following resume text and
extract the information into a valid JSON object. The JSON object must conform to the following
structure, and all fields must be populated. Do not include any text or markdown formatting before
or after the JSON object.

Resume Text:
"""
${resumeText}
"""

JSON Structure:
{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": [{"name":"string","description":"string"}],
  "certifications": ["string"],
  "resume_rating": "number (1-10)",
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}
`.trim();

  // 3) Call Gemini
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });
  const response = await model.generateContent(prompt);
  const rawText = response.response.text();

  // 4) Parse JSON safely
  const json = sanitizeToJson(rawText);

  // 5) Basic validation of expected keys
  const requiredKeys = [
    "name","email","phone","linkedin_url","portfolio_url","summary",
    "work_experience","education","technical_skills","soft_skills",
    "resume_rating","improvement_areas","upskill_suggestions"
  ];
  for (const k of requiredKeys) {
    if (!(k in json)) {
      throw new Error(`Model output missing key: ${k}`);
    }
  }

  return json;
}
