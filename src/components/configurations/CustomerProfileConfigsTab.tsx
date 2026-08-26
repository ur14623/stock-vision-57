import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfigTable, { Column } from "./ConfigTable";
import ConfigFormModal from "./ConfigFormModal";
import {
  CustomerProfileConfig,
  DataSource,
  fetchCustomerProfileConfigs,
  createCustomerProfileConfig,
  patchCustomerProfileConfig,
  deleteCustomerProfileConfig,
  fetchDataSources,
} from "@/lib/api/configurations";

const emptyForm = {
  name: "",
  data_source: "" as string,
  table_name: "",
  phone_field: "",
  name_field: "",
  email_field: "",
  language_field: "",
  filter_query: "",
  is_active: true,
};

export default function CustomerProfileConfigsTab() {
  const [data, setData] = useState<CustomerProfileConfig[]>([]);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"view" | "edit" | "create" | null>(null);
  const [current, setCurrent] = useState<CustomerProfileConfig | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetchCustomerProfileConfigs(); setData(res.results); }
    catch { toast.error("Failed to load customer profile configs"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchDataSources().then((r) => setSources(r.results)).catch(() => {}); }, []);

  const columns: Column<CustomerProfileConfig>[] = [
    { header: "Name", accessor: (r) => r.name, searchable: (r) => r.name },
    { header: "Data Source", accessor: (r) => r.data_source_name ?? (r.data_source ? String(r.data_source) : "—") },
    { header: "Table", accessor: (r) => r.table_name, searchable: (r) => r.table_name },
    { header: "Phone Field", accessor: (r) => r.phone_field },
  ];

  const openView = (item: CustomerProfileConfig) => { setCurrent(item); setModal("view"); };
  const openEdit = (item: CustomerProfileConfig) => {
    setCurrent(item);
    setForm({
      name: item.name,
      data_source: item.data_source ? String(item.data_source) : "",
      table_name: item.table_name,
      phone_field: item.phone_field,
      name_field: item.name_field ?? "",
      email_field: item.email_field ?? "",
      language_field: item.language_field ?? "",
      filter_query: item.filter_query ?? "",
      is_active: item.is_active,
    });
    setModal("edit");
  };
  const openCreate = () => { setCurrent(null); setForm(emptyForm); setModal("create"); };

  const handleSave = async () => {
    if (!form.name || !form.table_name || !form.phone_field) {
      toast.error("Name, table name and phone field are required");
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<CustomerProfileConfig> = {
        ...form,
        data_source: form.data_source ? Number(form.data_source) : null,
      };
      if (modal === "create") await createCustomerProfileConfig(payload);
      else if (current) await patchCustomerProfileConfig(current.id, payload);
      toast.success(modal === "create" ? "Profile config created" : "Profile config updated");
      setModal(null); load();
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try { await deleteCustomerProfileConfig(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (item: CustomerProfileConfig) => {
    try { await patchCustomerProfileConfig(item.id, { is_active: !item.is_active }); load(); } catch { toast.error("Update failed"); }
  };

  return (
    <>
      <ConfigTable
        title="Customer Profile Configuration"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={openCreate}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggle}
      />

      <ConfigFormModal open={modal === "view"} onClose={() => setModal(null)} title="Profile Config Details" readOnly>
        <div><Label>Name</Label><Input value={current?.name ?? ""} disabled /></div>
        <div><Label>Data Source</Label><Input value={current?.data_source_name ?? String(current?.data_source ?? "")} disabled /></div>
        <div><Label>Table</Label><Input value={current?.table_name ?? ""} disabled /></div>
        <div><Label>Phone Field</Label><Input value={current?.phone_field ?? ""} disabled /></div>
        <div><Label>Name Field</Label><Input value={current?.name_field ?? ""} disabled /></div>
        <div><Label>Email Field</Label><Input value={current?.email_field ?? ""} disabled /></div>
        <div><Label>Language Field</Label><Input value={current?.language_field ?? ""} disabled /></div>
        <div><Label>Filter Query</Label><Textarea value={current?.filter_query ?? ""} disabled /></div>
        <div className="flex items-center gap-2"><Switch checked={current?.is_active ?? false} disabled /><Label>Active</Label></div>
      </ConfigFormModal>

      <ConfigFormModal
        open={modal === "edit" || modal === "create"}
        onClose={() => setModal(null)}
        title={modal === "create" ? "Add Profile Config" : "Edit Profile Config"}
        onSubmit={handleSave}
        loading={saving}
      >
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div>
          <Label>Data Source</Label>
          <Select value={form.data_source} onValueChange={(v) => setForm({ ...form, data_source: v })}>
            <SelectTrigger><SelectValue placeholder="Select data source" /></SelectTrigger>
            <SelectContent>
              {sources.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div><Label>Table Name</Label><Input value={form.table_name} onChange={(e) => setForm({ ...form, table_name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Phone Field</Label><Input value={form.phone_field} onChange={(e) => setForm({ ...form, phone_field: e.target.value })} /></div>
          <div><Label>Name Field</Label><Input value={form.name_field} onChange={(e) => setForm({ ...form, name_field: e.target.value })} /></div>
          <div><Label>Email Field</Label><Input value={form.email_field} onChange={(e) => setForm({ ...form, email_field: e.target.value })} /></div>
          <div><Label>Language Field</Label><Input value={form.language_field} onChange={(e) => setForm({ ...form, language_field: e.target.value })} /></div>
        </div>
        <div><Label>Filter Query</Label><Textarea rows={3} value={form.filter_query} onChange={(e) => setForm({ ...form, filter_query: e.target.value })} placeholder="e.g. status = 'active'" /></div>
        <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
      </ConfigFormModal>
    </>
  );
}
