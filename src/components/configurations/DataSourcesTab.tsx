import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plug } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfigTable, { Column } from "./ConfigTable";
import ConfigFormModal from "./ConfigFormModal";
import {
  DataSource,
  fetchDataSources,
  createDataSource,
  patchDataSource,
  deleteDataSource,
  testDataSourceConnection,
} from "@/lib/api/configurations";

const emptyForm = {
  name: "",
  source_type: "postgresql",
  host: "",
  port: 5432,
  database_name: "",
  username: "",
  password: "",
  is_active: true,
};

const TYPES = ["postgresql", "mysql", "oracle", "mssql", "sqlite", "api", "csv"];

export default function DataSourcesTab() {
  const [data, setData] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"view" | "edit" | "create" | null>(null);
  const [current, setCurrent] = useState<DataSource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetchDataSources(); setData(res.results); }
    catch { toast.error("Failed to load data sources"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns: Column<DataSource>[] = [
    { header: "Name", accessor: (r) => r.name, searchable: (r) => r.name },
    { header: "Type", accessor: (r) => r.source_type, searchable: (r) => r.source_type },
    { header: "Host", accessor: (r) => `${r.host}:${r.port}`, searchable: (r) => r.host },
    { header: "Database", accessor: (r) => r.database_name },
  ];

  const openView = (item: DataSource) => { setCurrent(item); setModal("view"); };
  const openEdit = (item: DataSource) => {
    setCurrent(item);
    setForm({
      name: item.name, source_type: item.source_type, host: item.host, port: item.port,
      database_name: item.database_name, username: item.username, password: "", is_active: item.is_active,
    });
    setModal("edit");
  };
  const openCreate = () => { setCurrent(null); setForm(emptyForm); setModal("create"); };

  const handleSave = async () => {
    if (!form.name || !form.host) { toast.error("Name and host are required"); return; }
    setSaving(true);
    try {
      const payload: Partial<DataSource> = { ...form };
      if (!form.password) delete payload.password;
      if (modal === "create") await createDataSource(payload);
      else if (current) await patchDataSource(current.id, payload);
      toast.success(modal === "create" ? "Data source created" : "Data source updated");
      setModal(null); load();
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try { await deleteDataSource(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (item: DataSource) => {
    try { await patchDataSource(item.id, { is_active: !item.is_active }); load(); } catch { toast.error("Update failed"); }
  };

  const handleTest = async (item: DataSource) => {
    setTestingId(item.id);
    try {
      const res = await testDataSourceConnection(item.id);
      const ok = res?.success ?? res?.status === "success";
      const msg = res?.message || res?.detail || (ok ? "Connection successful" : "Connection failed");
      ok ? toast.success(msg) : toast.error(msg);
    } catch { toast.error("Connection test failed"); }
    setTestingId(null);
  };

  return (
    <>
      <ConfigTable
        title="Data Sources"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={openCreate}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggle}
        extraActions={(row) => (
          <Button variant="ghost" size="icon" title="Test connection" disabled={testingId === row.id} onClick={() => handleTest(row)}>
            <Plug className="h-4 w-4" />
          </Button>
        )}
      />

      <ConfigFormModal open={modal === "view"} onClose={() => setModal(null)} title="Data Source Details" readOnly>
        <div><Label>Name</Label><Input value={current?.name ?? ""} disabled /></div>
        <div><Label>Type</Label><Input value={current?.source_type ?? ""} disabled /></div>
        <div><Label>Host</Label><Input value={current?.host ?? ""} disabled /></div>
        <div><Label>Port</Label><Input value={current?.port ?? ""} disabled /></div>
        <div><Label>Database</Label><Input value={current?.database_name ?? ""} disabled /></div>
        <div><Label>Username</Label><Input value={current?.username ?? ""} disabled /></div>
        <div className="flex items-center gap-2"><Switch checked={current?.is_active ?? false} disabled /><Label>Active</Label></div>
      </ConfigFormModal>

      <ConfigFormModal
        open={modal === "edit" || modal === "create"}
        onClose={() => setModal(null)}
        title={modal === "create" ? "Add Data Source" : "Edit Data Source"}
        onSubmit={handleSave}
        loading={saving}
      >
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div>
          <Label>Type</Label>
          <Select value={form.source_type} onValueChange={(v) => setForm({ ...form, source_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Host</Label><Input value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} /></div>
          <div><Label>Port</Label><Input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Database Name</Label><Input value={form.database_name} onChange={(e) => setForm({ ...form, database_name: e.target.value })} /></div>
        <div><Label>Username</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
        <div><Label>Password</Label><Input type="password" placeholder={modal === "edit" ? "Leave blank to keep current" : ""} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
      </ConfigFormModal>
    </>
  );
}
