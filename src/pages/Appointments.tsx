import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { Column } from '@/components/shared/DataTable';
import ModalForm from '@/components/shared/ModalForm';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useApp, Appointment } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Appointments = () => {
  const { appointments, setAppointments, addAuditLog, doctors } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState({ patientName: '', date: '', doctor: '', department: '', status: 'Scheduled' as Appointment['status'] });

  const openAdd = () => { setEditing(null); setForm({ patientName: '', date: '', doctor: '', department: '', status: 'Scheduled' }); setModalOpen(true); };
  const openEdit = (a: Appointment) => { setEditing(a); setForm({ ...a }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.patientName || !form.date || !form.doctor) { toast.error('Fill all fields'); return; }
    if (editing) {
      setAppointments(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
      addAuditLog('Updated Appointment', 'Appointments');
      toast.success('Appointment updated');
    } else {
      setAppointments(prev => [...prev, { ...form, id: Date.now().toString() }]);
      addAuditLog('Created Appointment', 'Appointments');
      toast.success('Appointment created');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this appointment?')) return;
    setAppointments(prev => prev.filter(a => a.id !== id));
    addAuditLog('Deleted Appointment', 'Appointments');
    toast.success('Appointment deleted');
  };

  const columns: Column<Appointment>[] = [
    { key: '#', label: '#', render: (_, i) => <span className="font-medium text-muted-foreground">{(i ?? 0) + 1}</span> },
    { key: 'patientName', label: 'Patient Name' },
    { key: 'date', label: 'Date & Time' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'actions', label: 'Actions', render: (a) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(a); }}><Pencil className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Appointments" subtitle="Manage patient appointments" actionLabel="Add Appointment" onAction={openAdd} />
      <DataTable columns={columns} data={appointments} />

      <ModalForm open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Appointment' : 'Add Appointment'} onSubmit={handleSave}>
        <div className="space-y-3">
          <div><Label>Patient Name</Label><Input value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} /></div>
          <div><Label>Date & Time</Label><Input type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div><Label>Doctor</Label>
            <Select value={form.doctor} onValueChange={v => { const d = doctors.find(doc => doc.name === v); setForm(f => ({ ...f, doctor: v, department: d?.department || '' })); }}>
              <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
              <SelectContent>{doctors.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Department</Label><Input value={form.department} readOnly /></div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Appointment['status'] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No-Show">No-Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModalForm>
    </DashboardLayout>
  );
};

export default Appointments;
