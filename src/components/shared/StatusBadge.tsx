import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  Scheduled: 'bg-info/10 text-info border-info/20',
  Completed: 'bg-success/10 text-success border-success/20',
  Cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  'No-Show': 'bg-warning/10 text-warning border-warning/20',
  Active: 'bg-success/10 text-success border-success/20',
  Discharged: 'bg-muted text-muted-foreground border-border',
  Critical: 'bg-destructive/10 text-destructive border-destructive/20',
  Available: 'bg-success/10 text-success border-success/20',
  'On Leave': 'bg-warning/10 text-warning border-warning/20',
  'In Surgery': 'bg-info/10 text-info border-info/20',
  Pending: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-success/10 text-success border-success/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  Waiting: 'bg-warning/10 text-warning border-warning/20',
  'In Treatment': 'bg-info/10 text-info border-info/20',
  Resolved: 'bg-success/10 text-success border-success/20',
  Low: 'bg-success/10 text-success border-success/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  High: 'bg-destructive/10 text-destructive border-destructive/20',
  Success: 'bg-success/10 text-success border-success/20',
  Failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant="outline" className={cn('font-medium text-xs', statusColors[status] || 'bg-muted text-muted-foreground')}>
    {status}
  </Badge>
);

export default StatusBadge;
