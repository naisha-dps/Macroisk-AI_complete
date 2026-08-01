"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => null });

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-20 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-1/80 px-3.5 py-1.5 text-[12px] font-medium text-ink-secondary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-good" />
            </span>
            Four agents. One console.
          </div>

          <h1 className="text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink-primary sm:text-[3.4rem]">
            Macro risk,
            <br />
            <span className="text-accent-ink">modeled and explained.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink-muted">
            An ensemble inflation forecaster, a corporate financial engine, a scenario-resilience model, and an
            AI analyst — chained into one pipeline that turns a company name and a horizon into a full investment
            read.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/dashboard">
                Enter the console <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/analysis">
                <PlayCircle className="h-4 w-4" /> Run a live analysis
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] text-ink-muted">
            <span>Ensemble macro forecasting</span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <span>LangGraph orchestration</span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <span>RAG-grounded assistant</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative aspect-square w-full max-w-[480px] justify-self-center lg:justify-self-end"
        >
          {reducedMotion ? (
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--accent) 55%, transparent), transparent 60%), radial-gradient(circle at 65% 70%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 55%)",
              }}
            />
          ) : (
            <HeroScene />
          )}
        </motion.div>
      </div>
    </section>
  );
}
