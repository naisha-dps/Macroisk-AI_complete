"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AnalysisForm } from "@/components/analysis/analysis-form";
import { AnalysisResults } from "@/components/analysis/analysis-results";
import { PipelineTimeline } from "@/components/analysis/pipeline-timeline";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { Card } from "@/components/ui/card";
import { useAnalyzeCompany } from "@/lib/hooks/use-analyze-company";
import { useAnalysisContext } from "@/lib/providers/analysis-context";

export default function AnalysisPage() {
  const analysis = useAnalyzeCompany();
  const { setLastAnalysis } = useAnalysisContext();

  useEffect(() => {
    if (analysis.isSuccess) setLastAnalysis(analysis.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis.isSuccess, analysis.data]);

  return (
    <div>
      <PageHeader
        eyebrow="Agents 1 → 4 · POST /analyze_company"
        title="Full Analysis"
        description="Runs the LangGraph pipeline end to end: macro projection, company baseline, scenario-resilience forecasting, and an AI-authored investment report — one company, one call."
      />

      <div className="flex flex-col gap-6">
        <AnalysisForm
          onSubmit={(companyName, monthsAhead) => analysis.mutate({ company_name: companyName, months_ahead: monthsAhead })}
          pending={analysis.isPending}
        />

        {analysis.isPending && (
          <Card className="p-6">
            <p className="mb-1 text-[13px] font-semibold text-ink-primary">Agents are collaborating…</p>
            <p className="mb-4 text-[12px] text-ink-muted">
              This is a single blocking request — the steps below describe what the pipeline is doing, not a live
              progress feed.
            </p>
            <PipelineTimeline />
          </Card>
        )}

        {analysis.isError && <ErrorState error={analysis.error} />}

        {analysis.isSuccess && (
          <>
            <AnalysisResults data={analysis.data} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link
                href="/assistant"
                className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-line bg-surface-2/50 px-5 py-4 text-[13px] text-ink-secondary transition-colors hover:bg-surface-2"
              >
                <span>
                  This run is now available as context for the <strong className="text-ink-primary">Assistant</strong> —
                  ask follow-up questions about {analysis.data.company.toUpperCase()}.
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </motion.div>
          </>
        )}

        {analysis.isIdle && (
          <EmptyState
            icon={Sparkles}
            title="No analysis yet"
            description="Select a company above and run the full analysis to see the entire pipeline's output in one place."
          />
        )}
      </div>
    </div>
  );
}
