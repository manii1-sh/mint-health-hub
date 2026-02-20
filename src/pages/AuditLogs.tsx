import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { Column } from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useApp, AuditLog } from '@/context/AppContext';

const AuditLogs = () => {
  const { auditLogs } = useApp();

  const columns: Column<AuditLog>[] = [
    { key: 'action', label: 'Action' },
    { key: 'module', label: 'Module' },
    { key: 'user', label: 'User' },
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'status', label: 'Status', render: (l) => <StatusBadge status={l.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Audit Logs" subtitle="Track all system activities" />
      <DataTable columns={columns} data={auditLogs} />
    </DashboardLayout>
  );
};

export default AuditLogs;
