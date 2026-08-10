"use client";

import { motion } from "framer-motion";
import { Bot, Building2, LineChart, Sparkles } from "lucide-react";

const AGENTS = [
  {
    icon: LineChart,
    tag: "Agent 1",
    title: "Inflation Outlook",
    description:
      "An autoregressive ensemble of XGBoost, LightGBM, SARIMAX and VAR(2) — weighted, clipped to historical bounds, and rolled forward month by month.",
  },
  {
    icon: Building2,
    tag: "Agent 2",
    title: "Corporate Analysis",
    description:
      "Pulls the historical growth panel and granular financial statements for any company across a six-sector universe.",
  },
  {
    icon: Sparkles,
    tag: "Agent 3",
    title: "Scenario Resilience",
    description:
      "Runs six panel-regression models twice — once under the projected economy, once frozen — to isolate the macro effect on each metric.",
  },
  {
    icon: Bot,
    tag: "Agent 4 · RAG",
    title: "Investment Intelligence",
    description:
      "An LLM analyst writes the report; a separate RAG assistant answers follow-up questions grounded in your latest run.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="mb-12 max-w-xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-ink">The pipeline</p>
        <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink-primary">
          Four purpose-built agents, orchestrated end to end.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[var(--radius-lg)] border border-line bg-surface-1 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent-soft text-accent-ink transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{agent.tag}</p>
              <h3 className="mt-1 text-[16px] font-semibold text-ink-primary">{agent.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{agent.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
