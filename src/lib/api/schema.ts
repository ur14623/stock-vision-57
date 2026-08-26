import { API_BASE, authFetch, authHeaders, handleResponse } from "./base";
import { fetchDataSources, type DataSource } from "./configurations";

export interface DbConnection {
  id: string;
  name: string;
  type: string;
}

export interface DbTable {
  name: string;
  rowCount?: number;
}

/** Deterministic fallback schema used when the backend exposes no introspection endpoint. */
function fallbackTables(): DbTable[] {
  return [
    { name: "subscribers" },
    { name: "customers" },
    { name: "customer_profile" },
    { name: "vip_customers" },
    { name: "language_reference" },
  ];
}

function fallbackColumns(table: string): string[] {
  if (table.includes("language") || table.includes("profile")) {
    return ["id", "customer_msisdn", "customer_id", "language", "region", "updated_at"];
  }
  return ["id", "msisdn", "phone_number", "customer_id", "lang", "name", "status", "created_at"];
}

/** Database connections come from the Configurations → Data Sources module. */
export async function listConnections(): Promise<DbConnection[]> {
  try {
    const res = await fetchDataSources();
    return (res.results || []).map((d: DataSource) => ({
      id: String(d.id),
      name: d.name,
      type: d.source_type,
    }));
  } catch {
    return [];
  }
}

export async function listTables(connectionId: string): Promise<DbTable[]> {
  if (!connectionId) return [];
  try {
    const res = await authFetch(
      `${API_BASE}/api/configurations/data-sources/${connectionId}/tables/`,
      { headers: authHeaders() },
    );
    const data = await handleResponse<any>(res);
    const list = Array.isArray(data) ? data : data?.tables || data?.results || [];
    if (list.length) {
      return list.map((t: any) =>
        typeof t === "string" ? { name: t } : { name: t.name ?? t.table, rowCount: t.row_count },
      );
    }
  } catch {
    /* fall through */
  }
  return fallbackTables();
}

export async function listColumns(connectionId: string, table: string): Promise<string[]> {
  if (!connectionId || !table) return [];
  try {
    const res = await authFetch(
      `${API_BASE}/api/configurations/data-sources/${connectionId}/tables/${encodeURIComponent(table)}/columns/`,
      { headers: authHeaders() },
    );
    const data = await handleResponse<any>(res);
    const list = Array.isArray(data) ? data : data?.columns || data?.results || [];
    if (list.length) {
      return list.map((c: any) => (typeof c === "string" ? c : c.name ?? c.column));
    }
  } catch {
    /* fall through */
  }
  return fallbackColumns(table);
}
