import { Button } from '@/components/ui/button';
import { Plus, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
}

const PageHeader = ({ title, subtitle, actionLabel, actionIcon: ActionIcon = Plus, onAction }: PageHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {actionLabel && onAction && (
      <Button onClick={onAction} className="gap-2">
        <ActionIcon className="w-4 h-4" />
        {actionLabel}
      </Button>
    )}
  </div>
);

export default PageHeader;
