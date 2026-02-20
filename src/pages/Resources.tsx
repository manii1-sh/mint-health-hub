import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { Column } from '@/components/shared/DataTable';
import ModalForm from '@/components/shared/ModalForm';
import PageHeader from '@/components/shared/PageHeader';
import { useApp, Resource } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Resources = () => {
  const { resources, setResources, addAuditLog } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState('bed');
  const [form, setForm] = useState({ name: '', type: 'bed', total: 0, occupied: 0, available: 0, threshold: 0 });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', type: activeTab, total: 0, occupied: 0, available: 0, threshold: 0 });
    setModalOpen(true);
  };
  const openEdit = (r: Resource) => { setEditing(r); setForm({ ...r, threshold: r.threshold || 0 }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name) { toast.error('Name is required'); return; }
    const data = { ...form, available: form.total - form.occupied };
    if (editing) {
      setResources(prev => prev.map(r => r.id === editing.id ? { ...r, ...data } : r));
      addAuditLog('Updated Resource', 'Resources');
      toast.success('Resource updated');
    } else {
      setResources(prev => [...prev, { ...data, id: Date.now().toString() }]);
      addAuditLog('Created Resource', 'Resources');
      toast.success('Resource added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this resource?')) return;
    setResources(prev => prev.filter(r => r.id !== id));
    addAuditLog('Deleted Resource', 'Resources');
    toast.success('Resource deleted');
  };

  const makeColumns = (): Column<Resource>[] => [
    { key: 'name', label: 'Name' },
    { key: 'total', label: 'Total' },
    { key: 'occupied', label: 'In Use' },
    { key: 'available', label: 'Available' },
    {
      key: 'usage', label: 'Usage', render: (r) => {
        const pct = Math.round((r.occupied / r.total) * 100);
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress value={pct} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground w-10">{pct}%</span>
          </div>
        );
      }
    },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  const tabs = [
    { value: 'bed', label: 'Beds' },
    { value: 'oxygen', label: 'Oxygen' },
    { value: 'blood', label: 'Blood Bank' },
    { value: 'ventilator', label: 'Ventilators' },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Resources" subtitle="Manage hospital resources" actionLabel="Add Resource" onAction={openAdd} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => (
          <TabsContent key={t.value} value={t.value}>
            <DataTable columns={makeColumns()} data={resources.filter(r => r.type === t.value)} />
          </TabsContent>
        ))}
      </Tabs>

      <ModalForm open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Resource' : 'Add Resource'} onSubmit={handleSave}>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><Label>Total</Label><Input type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: parseInt(e.target.value) || 0 }))} /></div>
          <div><Label>In Use</Label><Input type="number" value={form.occupied} onChange={e => setForm(f => ({ ...f, occupied: parseInt(e.target.value) || 0 }))} /></div>
          <div><Label>Threshold</Label><Input type="number" value={form.threshold} onChange={e => setForm(f => ({ ...f, threshold: parseInt(e.target.value) || 0 }))} /></div>
        </div>
      </ModalForm>
    </DashboardLayout>
  );
};

export default Resources;
