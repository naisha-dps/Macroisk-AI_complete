import { Bot, Building2, LayoutDashboard, LineChart, Sparkles } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, agent: null },
  { href: "/forecast", label: "Inflation Outlook Agent", icon: LineChart, agent: "Agent 1" },
  { href: "/companies", label: "Corporate Analysis Agent", icon: Building2, agent: "Agent 2" },
  { href: "/analysis", label: "Full Analysis", icon: Sparkles, agent: "1–4" },
  { href: "/assistant", label: "Assistant", icon: Bot, agent: "RAG" },
] as const;
