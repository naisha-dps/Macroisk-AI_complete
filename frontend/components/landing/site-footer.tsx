import Link from "next/link";
import { Gauge } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-[13px] font-medium text-ink-secondary">
          <Gauge className="h-4 w-4" />
          MacroRisk AI
        </Link>
        <p className="text-[12px] text-ink-muted">
          A FastAPI + LangGraph multi-agent pipeline, console built with Next.js.
        </p>
      </div>
    </footer>
  );
}
