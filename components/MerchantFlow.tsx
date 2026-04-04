"use client";

import { useState } from "react";

type Step = {
  id: number;
  label: string;
  detail: string;
  status: "pending" | "active" | "done" | "error";
  tag?: string;
  tagColor?: string;
};

const INITIAL_STEPS: Step[] = [
  { id: 1, label: "Incoming purchase request", detail: "Agent-0x4f3a requests: 1× API Credits Pack ($9.99)", status: "pending", tag: "Inbound", tagColor: "#3b82f6" },
  { id: 2, label: "Agent identity check", detail: "Resolving ERC-8004 identity · checking reputation registry", status: "pending", tag: "ERC-8004", tagColor: "#7c3aed" },
  { id: 3, label: "Identity verified ✓", detail: "Agent score: 94/100 · 312 completed jobs · 0 disputes", status: "pending", tag: "Verified", tagColor: "#10b981" },
  { id: 4, label: "Payment received", detail: "9.99 USDC settled · Base network · tx 0x8c2d…f441", status: "pending", tag: "USDC", tagColor: "#7c3aed" },
  { id: 5, label: "Order created", detail: "Order #10291 created · API Credits Pack × 1 · fulfilled", status: "pending", tag: "Order", tagColor: "#f59e0b" },
  { id: 6, label: "CRM record updated", detail: "Contact: Agent-0x4f3a · Lifetime value: $47.96 · last_purchase updated", status: "pending", tag: "CRM", tagColor: "#10b981" },
];

const CRM_BEFORE = { ltv: "$37.97", orders: 4, status: "Active" };
const CRM_AFTER  = { ltv: "$47.96", orders: 5, status: "Active" };

export default function MerchantFlow() {
  const [steps, setSteps]   = useState<Step[]>(INITIAL_STEPS);
  const [running, setRunning] = useState(false);
  const [done, setDone]     = useState(false);
  const [crm, setCrm]       = useState(CRM_BEFORE);

  async function run() {
    setRunning(true);
    setDone(false);
    setSteps(INITIAL_STEPS);
    setCrm(CRM_BEFORE);

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 800 + i * 150));
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "active" } : s));
      await new Promise((r) => setTimeout(r, 750));
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "done" } : s));
      if (i === 5) setCrm(CRM_AFTER);
    }

    setRunning(false);
    setDone(true);
  }

  function reset() {
    setSteps(INITIAL_STEPS);
    setDone(false);
    setCrm(CRM_BEFORE);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
      {/* Main flow */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Merchant Verification Flow</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Identify agent → verify → accept → update CRM</div>
          </div>
          <button
            onClick={running ? undefined : done ? reset : run}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: running ? "var(--border)" : done ? "#1a2e1a" : "var(--accent)",
              color: running ? "var(--muted)" : done ? "#10b981" : "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: running ? "not-allowed" : "pointer",
            }}
          >
            {running ? "Running…" : done ? "↺ Reset" : "▶ Run"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((step) => (
            <div
              key={step.id}
              className={step.status !== "pending" ? "animate-slide-in" : ""}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 8,
                background:
                  step.status === "done" ? "rgba(16,185,129,0.06)"
                  : step.status === "active" ? "rgba(124,58,237,0.10)"
                  : "transparent",
                border: `1px solid ${
                  step.status === "done" ? "rgba(16,185,129,0.2)"
                  : step.status === "active" ? "rgba(124,58,237,0.3)"
                  : "var(--border)"
                }`,
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                  background: step.status === "done" ? "var(--green)" : step.status === "active" ? "var(--accent-light)" : "var(--border)",
                }}
                className={step.status === "active" ? "animate-blink" : ""}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: step.status === "pending" ? "var(--muted)" : "var(--foreground)" }}>
                    {step.label}
                  </span>
                  {step.tag && (
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: (step.tagColor ?? "#fff") + "22", color: step.tagColor, fontWeight: 700, letterSpacing: "0.04em" }}>
                      {step.tag}
                    </span>
                  )}
                </div>
                {step.status !== "pending" && (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{step.detail}</div>
                )}
              </div>
              {step.status === "done" && <span style={{ color: "var(--green)", fontSize: 14, flexShrink: 0 }}>✓</span>}
            </div>
          ))}
        </div>

        {done && (
          <div
            className="animate-slide-in"
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 8,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "var(--green)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ✓ Agent payment accepted, verified, and recorded in CRM — no manual intervention
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Agent card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            Incoming Agent
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--foreground)", marginBottom: 6 }}>Agent-0x4f3a…c821</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["ERC-8004 verified", "Base network", "Score: 94"].map((tag) => (
              <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "rgba(124,58,237,0.12)", color: "var(--accent-light)", fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CRM record */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
            CRM Record
          </div>
          {[
            { label: "Contact", value: "Agent-0x4f3a" },
            { label: "Orders", value: crm.orders.toString() },
            { label: "LTV", value: crm.ltv },
            { label: "Status", value: crm.status },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color:
                    crm === CRM_AFTER && (label === "LTV" || label === "Orders")
                      ? "var(--green)"
                      : "var(--foreground)",
                  transition: "color 0.4s",
                }}
              >
                {value}
              </span>
            </div>
          ))}
          {crm === CRM_AFTER && (
            <div className="animate-slide-in" style={{ fontSize: 11, color: "var(--green)", marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              ↑ Updated after agent purchase
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
