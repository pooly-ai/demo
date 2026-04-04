"use client";

import { useState } from "react";
import AgentFlow from "@/components/AgentFlow";
import MerchantFlow from "@/components/MerchantFlow";

export default function Home() {
  const [tab, setTab] = useState<"agent" | "merchant">("agent");

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "var(--background)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#7c3aed" strokeWidth="2" />
            <circle cx="11" cy="11" r="4" fill="#7c3aed" />
            <circle cx="11" cy="5" r="1.5" fill="#a78bfa" />
            <circle cx="11" cy="17" r="1.5" fill="#a78bfa" />
            <circle cx="5" cy="11" r="1.5" fill="#a78bfa" />
            <circle cx="17" cy="11" r="1.5" fill="#a78bfa" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
            Pooly.AI
          </span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 99,
              background: "#1e1230",
              color: "var(--accent-light)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Demo
          </span>
        </div>
        <a
          href="https://twitter.com/poolyai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            color: "var(--accent-light)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Follow for updates →
        </a>
      </header>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "56px 24px 40px" }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Payments built for agents,
          <br />
          <span style={{ color: "var(--accent-light)" }}>not humans.</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          See how Pooly.AI gives AI agents managed wallets — and gives merchants the
          tools to verify and accept agent payments.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
        {(["agent", "merchant"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: tab === t ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: tab === t ? "#1e1230" : "transparent",
              color: tab === t ? "var(--accent-light)" : "var(--muted)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t === "agent" ? "🤖 Agent Flow" : "🏪 Merchant Flow"}
          </button>
        ))}
      </div>

      {/* Demo panel */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 16px 80px" }}>
        {tab === "agent" ? <AgentFlow /> : <MerchantFlow />}
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          padding: "24px",
          color: "var(--muted)",
          fontSize: 13,
        }}
      >
        Pooly.AI — pre-product · building in public ·{" "}
        <a href="https://twitter.com/poolyai" style={{ color: "var(--accent-light)" }}>
          follow us
        </a>
      </footer>
    </div>
  );
}
