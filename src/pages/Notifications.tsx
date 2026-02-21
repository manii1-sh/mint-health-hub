import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { useApp } from '@/context/AppContext';
import { Bell, CalendarDays, Package, ShieldAlert, FileText, Check, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const iconMap: Record<string, any> = { appointment: CalendarDays, resource: Package, crisis: ShieldAlert, service: FileText };

const Notifications = () => {
  const { notifications, setNotifications } = useApp();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = filter === 'all' ? notifications
    : filter === 'unread' ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All marked as read'); };
  const deleteNotification = (id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success('Notification deleted'); };
  const clearAll = () => { setNotifications([]); toast.success('All notifications cleared'); };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <PageHeader title="Notifications" subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`} />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36 h-9"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
              <SelectItem value="resource">Resources</SelectItem>
              <SelectItem value="crisis">Crisis</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={markAllRead}><Check className="w-4 h-4 mr-1" /> Mark All Read</Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4 mr-1" /> Clear All</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <div key={n.id} className={cn(
                "bg-card rounded-xl border border-border p-4 card-shadow flex items-start gap-3 transition-all hover:card-shadow-lg group",
                !n.read && "border-l-4 border-l-primary bg-primary/5"
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  n.type === 'crisis' ? 'bg-destructive/10' : 'bg-primary/10'
                )}>
                  <Icon className={cn("w-4 h-4", n.type === 'crisis' ? 'text-destructive' : 'text-primary')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="text-xs h-7">Read</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(n.id)} className="text-xs h-7 text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
