import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plug } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ConfigTable, { Column } from "./ConfigTable";
import ConfigFormModal from "./ConfigFormModal";
import {
  EmailService,
  fetchEmailServices,
  createEmailService,
  patchEmailService,
  deleteEmailService,
  testEmailServiceConnection,
} from "@/lib/api/configurations";

const emptyForm = {
  name: "",
  provider: "smtp",
  host: "",
  port: 587,
  username: "",
  password: "",
  from_email: "",
  from_name: "",
  use_tls: true,
  is_active: true,
};

export default function EmailServicesTab() {
  const [data, setData] = useState<EmailService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"view" | "edit" | "create" | null>(null);
  const [current, setCurrent] = useState<EmailService | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetchEmailServices(); setData(res.results); }
    catch { toast.error("Failed to load email services"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns: Column<EmailService>[] = [
    { header: "Name", accessor: (r) => r.name, searchable: (r) => r.name },
    { header: "Provider", accessor: (r) => r.provider, searchable: (r) => r.provider },
    { header: "Host", accessor: (r) => `${r.host}:${r.port}`, searchable: (r) => r.host },
    { header: "From", accessor: (r) => r.from_email, searchable: (r) => r.from_email },
  ];

  const openView = (item: EmailService) => { setCurrent(item); setModal("view"); };
  const openEdit = (item: EmailService) => {
    setCurrent(item);
    setForm({
      name: item.name, provider: item.provider, host: item.host, port: item.port,
      username: item.username, password: "", from_email: item.from_email,
      from_name: item.from_name ?? "", use_tls: item.use_tls, is_active: item.is_active,
    });
    setModal("edit");
  };
  const openCreate = () => { setCurrent(null); setForm(emptyForm); setModal("create"); };

  const handleSave = async () => {
    if (!form.name || !form.host || !form.from_email) { toast.error("Name, host and from email are required"); return; }
    setSaving(true);
    try {
      const payload: Partial<EmailService> = { ...form };
      if (!form.password) delete payload.password;
      if (modal === "create") await createEmailService(payload);
      else if (current) await patchEmailService(current.id, payload);
      toast.success(modal === "create" ? "Email service created" : "Email service updated");
      setModal(null); load();
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try { await deleteEmailService(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (item: EmailService) => {
    try { await patchEmailService(item.id, { is_active: !item.is_active }); load(); } catch { toast.error("Update failed"); }
  };

  const handleTest = async (item: EmailService) => {
    setTestingId(item.id);
    try {
      const res = await testEmailServiceConnection(item.id);
      const ok = res?.success ?? res?.status === "success";
      const msg = res?.message || res?.detail || (ok ? "Connection successful" : "Connection failed");
      ok ? toast.success(msg) : toast.error(msg);
    } catch { toast.error("Connection test failed"); }
    setTestingId(null);
  };

  return (
    <>
      <ConfigTable
        title="Email Services"
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

      <ConfigFormModal open={modal === "view"} onClose={() => setModal(null)} title="Email Service Details" readOnly>
        <div><Label>Name</Label><Input value={current?.name ?? ""} disabled /></div>
        <div><Label>Provider</Label><Input value={current?.provider ?? ""} disabled /></div>
        <div><Label>Host</Label><Input value={current?.host ?? ""} disabled /></div>
        <div><Label>Port</Label><Input value={current?.port ?? ""} disabled /></div>
        <div><Label>Username</Label><Input value={current?.username ?? ""} disabled /></div>
        <div><Label>From Email</Label><Input value={current?.from_email ?? ""} disabled /></div>
        <div><Label>From Name</Label><Input value={current?.from_name ?? ""} disabled /></div>
        <div className="flex items-center gap-2"><Switch checked={current?.use_tls ?? false} disabled /><Label>Use TLS</Label></div>
        <div className="flex items-center gap-2"><Switch checked={current?.is_active ?? false} disabled /><Label>Active</Label></div>
      </ConfigFormModal>

      <ConfigFormModal
        open={modal === "edit" || modal === "create"}
        onClose={() => setModal(null)}
        title={modal === "create" ? "Add Email Service" : "Edit Email Service"}
        onSubmit={handleSave}
        loading={saving}
      >
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Provider</Label><Input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="smtp, sendgrid, ses..." /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Host</Label><Input value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} /></div>
          <div><Label>Port</Label><Input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Username</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
        <div><Label>Password</Label><Input type="password" placeholder={modal === "edit" ? "Leave blank to keep current" : ""} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>From Email</Label><Input type="email" value={form.from_email} onChange={(e) => setForm({ ...form, from_email: e.target.value })} /></div>
          <div><Label>From Name</Label><Input value={form.from_name} onChange={(e) => setForm({ ...form, from_name: e.target.value })} /></div>
        </div>
        <div className="flex items-center gap-2"><Switch checked={form.use_tls} onCheckedChange={(v) => setForm({ ...form, use_tls: v })} /><Label>Use TLS</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
      </ConfigFormModal>
    </>
  );
}
