import React, { useState } from "react";
import axios from "axios";
import './component.css';

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function ResumeUploader({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleUpload() {
    if (!file) return;
    setLoading(true); setErr("");
    try {
      const form = new FormData();
      form.append("resume", file);
      const { data } = await axios.post(`${API}/api/resumes/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAnalyzed?.(data);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file || loading} style={{ marginLeft: 8 , borderRadius: 5, borderWidth:0}}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
    </div>
  );
}
