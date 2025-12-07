// src/components/PhaseNav.js
import React from "react";
import { Link } from "react-router-dom";

const PHASES = [
  { id: 1, label: "Phase 1", to: "/dashboard" },   // adjust targets if needed
  { id: 2, label: "Phase 2", to: "/test" },
  { id: 3, label: "Phase 3", to: "/phase3" },
  { id: 4, label: "Phase 4", to: "/phase4" },
];

export default function PhaseNav({ small=false }) {
  return (
    <div style={{
      display:"flex",
      gap:10,
      alignItems:"center",
      padding: small ? "4px" : "8px"
    }}>
      {PHASES.map(p => (
        <Link key={p.id} to={p.to} style={{ textDecoration: "none" }}>
          <div style={{
            width: small ? 34 : 44,
            height: small ? 34 : 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: "#0f3a2d",
            color: "#bfffd1",
            fontWeight: 700,
            cursor: "pointer",
            border: "2px solid rgba(127,255,150,0.08)"
          }}>
            {p.id}
          </div>
        </Link>
      ))}
    </div>
  );
}
