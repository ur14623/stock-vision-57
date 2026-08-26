import { API_BASE, authFetch, authHeaders, handleResponse } from "./base";

const PATH = "/api/reports/";

export interface Report {
  id: number;
  name: string;
  description?: string;
  report_type: string;
  format?: string;
  recipients?: string;
  schedule?: string;
  filters?: string;
  is_active: boolean;
  last_run_at?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportRunResult {
  success?: boolean;
  status?: string;
  message?: string;
  detail?: string;
  download_url?: string;
}

export async function fetchReports() {
  const res = await authFetch(`${API_BASE}${PATH}`, { headers: authHeaders() });
  const data = await handleResponse<{ results?: Report[] } | Report[]>(res);
  return { results: Array.isArray(data) ? data : data.results ?? [] };
}

export async function getReport(id: number) {
  const res = await authFetch(`${API_BASE}${PATH}${id}/`, { headers: authHeaders() });
  return handleResponse<Report>(res);
}

export async function createReport(d: Partial<Report>) {
  const res = await authFetch(`${API_BASE}${PATH}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(d),
  });
  return handleResponse<Report>(res);
}

export async function updateReport(id: number, d: Partial<Report>) {
  const res = await authFetch(`${API_BASE}${PATH}${id}/`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(d),
  });
  return handleResponse<Report>(res);
}

export async function patchReport(id: number, d: Partial<Report>) {
  const res = await authFetch(`${API_BASE}${PATH}${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(d),
  });
  return handleResponse<Report>(res);
}

export async function deleteReport(id: number) {
  const res = await authFetch(`${API_BASE}${PATH}${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<void>(res);
}

async function action<T>(id: number, name: string) {
  const res = await authFetch(`${API_BASE}${PATH}${id}/${name}/`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse<T>(res);
}

export const runReport = (id: number) => action<ReportRunResult>(id, "run");
export const triggerReport = (id: number) => action<ReportRunResult>(id, "trigger");
export const toggleReportStatus = (id: number) => action<Report>(id, "toggle-status");
