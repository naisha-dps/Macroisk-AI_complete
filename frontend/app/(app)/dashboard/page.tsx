"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Building2, Info, LineChart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

const capabilities = [
  {
    href: "/forecast",
    icon: LineChart,
    tag: "Agent 1",
    title: "Macro Forecast",
    description:
      "Autoregressive ensemble of XGBoost, LightGBM, SARIMAX and VAR(2) projecting India CPI inflation, repo rate, Brent oil and FX up to 6 months out.",
  },
  {
    href: "/companies",
    icon: Building2,
    tag: "Agent 2",
    title: "Company Explorer",
    description:
      "Sector → company drill-down over the historical growth panel and granular financial statements, rendered Moneycontrol-style.",
  },
  {
    href: "/analysis",
    icon: Sparkles,
    tag: "Agents 1–4",
    title: "Full Analysis",
    description:
      "The LangGraph pipeline end to end — macro projection, historical baseline, scenario-resilience forecasting, and an AI-authored investment report.",
  },
  {
    href: "/assistant",
    icon: Bot,
    tag: "RAG",
    title: "Assistant",
    description:
      "Ask questions against the research corpus and vector store — automatically grounded in your most recent Full Analysis run.",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Console"
        title="Welcome back."
        description="Four agents, one pipeline. Pick a capability below, or run the full analysis to see everything the platform produces for a single company."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <motion.div
              key={cap.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={cap.href} className="group block h-full">
                <Card className="flex h-full flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-pop)]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent-soft text-accent-ink">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                        {cap.tag}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[17px] font-semibold text-ink-primary">{cap.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{cap.description}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-[13px] font-medium text-accent-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-surface-2/50 px-5 py-4"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
        <p className="text-[13px] leading-relaxed text-ink-secondary">
          This console talks directly to the FastAPI backend — no endpoints, payloads, or response shapes were
          changed to build it. If a page shows a connection error, the backend process isn&apos;t reachable at the
          configured API base URL; every page here is built to fail gracefully rather than silently.
        </p>
      </motion.div>
    </div>
  );
}
