import React, { useEffect, useState } from "react";
import axios from "axios";
import ResumeDetails from "./ResumeDetails";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function PastResumesTable() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null); // full record
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API}/api/resumes`)
      .then(({ data }) => setRows(data))
      .catch(e => setError(e?.response?.data?.error || e.message));
  }, []);

  async function openDetails(id) {
    try {
      const { data } = await axios.get(`${API}/api/resumes/${id}`);
      setSelected(data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    }
  }

  async function handleDelete(id) {
  if (!window.confirm("Are you sure you want to delete this resume?")) return;
  try {
    await axios.delete(`${API}/api/resumes/${id}`);
    setRows(rows.filter(r => r.id !== id));
  } catch (e) {
    setError(e?.response?.data?.error || e.message);
  }
}


  return (
    <div>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
            <tr>
                <th>ID</th>
                <th>File</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Uploaded</th>
                <th>Details</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.file_name}</td>
              <td>{r.name || "-"}</td>
              <td>{r.email || "-"}</td>
              <td>{r.resume_rating ?? "-"}</td>
              <td>{new Date(r.uploaded_at).toLocaleString()}</td>
              <td><button onClick={() => openDetails(r.id)}>Open</button></td>
              
            <td>
            <button
                onClick={() => handleDelete(r.id)}
                style={{ color: "crimson", cursor: "pointer" }}
            >
                🗑
            </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
          onClick={() => setSelected(null)}
        >
          <div style={{ background: "#fff", padding: 20, width: "80%", maxHeight: "80%", overflow: "auto" }}
               onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Resume Details</h2>
              <button onClick={() => setSelected(null)}>Close</button>
            </div>
            <ResumeDetails data={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
