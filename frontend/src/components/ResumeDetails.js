import React from "react";

export default function ResumeDetails({ data }) {
  if (!data) return null;
  const Section = ({ title, children }) => (
    <div style={{ margin: "12px 0" }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );

  return (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 8 }}>
      <Section title="Basic Info">
        <div><b>Name:</b> {data.name || "-"}</div>
        <div><b>Email:</b> {data.email || "-"}</div>
        <div><b>Phone:</b> {data.phone || "-"}</div>
        <div><b>LinkedIn:</b> {data.linkedin_url || "-"}</div>
        <div><b>Portfolio:</b> {data.portfolio_url || "-"}</div>
      </Section>

      <Section title="Summary">{data.summary || "-"}</Section>

      <Section title="Work Experience">
        <ul>
          {(data.work_experience || []).map((w, i) => (
            <li key={i}>
              <div><b>{w.role}</b> @ {w.company} — {w.duration}</div>
              <ul>{(w.description || []).map((d, j) => <li key={j}>{d}</li>)}</ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        <ul>
          {(data.education || []).map((e, i) => (
            <li key={i}>{e.degree} — {e.institution} ({e.graduation_year})</li>
          ))}
        </ul>
      </Section>

      <Section title="Skills">
        <div><b>Technical:</b> {(data.technical_skills || []).join(", ") || "-"}</div>
        <div><b>Soft:</b> {(data.soft_skills || []).join(", ") || "-"}</div>
      </Section>

      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <Section title="Projects">
          <ul>{data.projects.map((p, i) => <li key={i}><b>{p.name}:</b> {p.description}</li>)}</ul>
        </Section>
      )}

      {Array.isArray(data.certifications) && data.certifications.length > 0 && (
        <Section title="Certifications">
          <ul>{data.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </Section>
      )}

      <Section title="AI Feedback">
        <div><b>Rating:</b> {data.resume_rating ?? "-"}/10</div>
        <div><b>Areas to Improve:</b> {data.improvement_areas || "-"}</div>
        <div><b>Upskill Suggestions:</b> {(data.upskill_suggestions || []).join(", ") || "-"}</div>
      </Section>
    </div>
  );
}
