import { apiFetch } from "./client";
import type {
  AnalyzeCompanyResponse,
  ChatRequest,
  ChatResponse,
  CompanyFinancialsResponse,
  CompanyForecastRequest,
  CompanyList,
  ForecastRequest,
  ForecastResponse,
  SectorList,
} from "./types";

/**
 * One function per backend route. Paths, methods, and payload shapes are
 * kept byte-for-byte identical to main.py — nothing is renamed here.
 */

export function getHealth(signal?: AbortSignal) {
  return apiFetch<{ message: string }>("/", { signal });
}

export function postForecast(req: ForecastRequest, signal?: AbortSignal) {
  return apiFetch<ForecastResponse>("/forecast", { method: "POST", body: req, signal });
}

export function getSectors(signal?: AbortSignal) {
  return apiFetch<SectorList>("/sectors", { signal });
}

export function getCompaniesBySector(sectorName: string, signal?: AbortSignal) {
  return apiFetch<CompanyList>(`/companies/${encodeURIComponent(sectorName)}`, { signal });
}

export function getCompanyFinancials(companyName: string, signal?: AbortSignal) {
  return apiFetch<CompanyFinancialsResponse>(
    `/company_financials/${encodeURIComponent(companyName)}`,
    { signal },
  );
}

export function postAnalyzeCompany(req: CompanyForecastRequest, signal?: AbortSignal) {
  return apiFetch<AnalyzeCompanyResponse>("/analyze_company", { method: "POST", body: req, signal });
}

export function postChat(req: ChatRequest, signal?: AbortSignal) {
  return apiFetch<ChatResponse>("/chat", { method: "POST", body: req, signal });
}
