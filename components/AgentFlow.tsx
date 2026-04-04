"use client";

import { useState, useEffect } from "react";

type Step = {
  id: number;
  label: string;
  detail: string;
  status: "pending" | "active" | "done" | "error";
  tag?: string;
  tagColor?: string;
};

const INITIAL_STEPS: Step[] = [
  { id: 1, label: "Agent requests paid API", detail: "GET /api/market-data → needs payment", status: "pending", tag: "HTTP GET", tagColor: "#3b82f6" },
  { id: 2, label: "Server returns 402", detail: 'HTTP 402 Payment Required · "Pay 0.10 USDC to proceed"', status: "pending", tag: "402", tagColor: "#f59e0b" },
  { id: 3, label: "Pooly wallet intercepts", detail: "Managed wallet detects 402 · checks spend limit · $12.40 remaining", status: "pending", tag: "Pooly", tagColor: "#7c3aed" },
  { id: 4, label: "USDC payment signed", detail: "Signed transferWithAuthorization · 0.10 USDC · Base network", status: "pending", tag: "EIP-3009", tagColor: "#7c3aed" },
  { id: 5, label: "Agent retries with proof", detail: "GET /api/market-data + X-Payment header attached", status: "pending", tag: "HTTP GET", tagColor: "#3b82f6" },
  { id: 6, label: "Server verifies & responds", detail: "Payment verified · data returned · 200 OK", status: "pending", tag: "200 OK", tagColor: "#10b981" },
];

const WALLET = { address: "0x4f3a...c821", balance: 12.50 };

export default function AgentFlow() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [balance, setBalance] = useState(WALLET.balance);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(msg: string) {
    setLogs((l) => [...l, msg]);
  }

  async function run() {
    setRunning(true);
    setDone(false);
    setSteps(INITIAL_STEPS);
    setBalance(WALLET.balance);
    setLogs([]);

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900 + i * 200));
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "active" } : s
        )
      );
      addLog(INITIAL_STEPS[i].detail);
      await new Promise((r) => setTimeout(r, 700));
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "done" } : s
        )
      );
      if (i === 3) setBalance((b) => Math.round((b - 0.10) * 100) / 100);
    }

    setRunning(false);
    setDone(true);
  }

  function reset() {
    setSteps(INITIAL_STEPS);
    setDone(false);
    setLogs([]);
    setBalance(WALLET.balance);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
      {/* Main flow */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Agent Payment Flow</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>HTTP 402 → Pooly wallet → USDC → success</div>
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
              className={step.status === "active" || step.status === "done" ? "animate-slide-in" : ""}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 8,
                background:
                  step.status === "done"
                    ? "rgba(16,185,129,0.06)"
                    : step.status === "active"
                    ? "rgba(124,58,237,0.10)"
                    : "transparent",
                border: `1px solid ${
                  step.status === "done"
                    ? "rgba(16,185,129,0.2)"
                    : step.status === "active"
                    ? "rgba(124,58,237,0.3)"
                    : "var(--border)"
                }`,
                transition: "all 0.2s",
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  marginTop: 5,
                  flexShrink: 0,
                  background:
                    step.status === "done"
                      ? "var(--green)"
                      : step.status === "active"
                      ? "var(--accent-light)"
                      : "var(--border)",
                }}
                className={step.status === "active" ? "animate-blink" : ""}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: step.status === "pending" ? "var(--muted)" : "var(--foreground)" }}>
                    {step.label}
                  </span>
                  {step.tag && (
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: step.tagColor + "22", color: step.tagColor, fontWeight: 700, letterSpacing: "0.04em" }}>
                      {step.tag}
                    </span>
                  )}
                </div>
                {step.status !== "pending" && (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{step.detail}</div>
                )}
              </div>
              {step.status === "done" && (
                <span style={{ color: "var(--green)", fontSize: 14, flexShrink: 0 }}>✓</span>
              )}
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
            ✓ Agent completed API call autonomously — 0.10 USDC settled, zero human involvement
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Wallet */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            Managed Wallet
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
            {WALLET.address}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: balance < WALLET.balance ? "var(--accent-light)" : "var(--foreground)" }}>
              ${balance.toFixed(2)}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>USDC</span>
          </div>
          {balance < WALLET.balance && (
            <div className="animate-slide-in" style={{ fontSize: 11, color: "var(--green)", marginTop: 6 }}>
              −$0.10 settled
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>
              <span>Spend limit</span><span>$25.00/day</span>
            </div>
            <div style={{ height: 4, background: "var(--border)", borderRadius: 99 }}>
              <div style={{ height: "100%", borderRadius: 99, background: "var(--accent)", width: `${(balance / 25) * 100}%`, transition: "width 0.6s" }} />
            </div>
          </div>
        </div>

        {/* Log */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            Activity Log
          </div>
          {logs.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Waiting…</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {logs.map((log, i) => (
                <div key={i} className="animate-slide-in" style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4, paddingBottom: 6, borderBottom: "1px solid var(--border)" }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
