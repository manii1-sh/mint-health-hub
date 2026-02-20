import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Users, Stethoscope, Package,
  AlertTriangle, ShieldAlert, FileText, BarChart3, Bell,
  ClipboardList, Settings, User, LogOut, Heart
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CalendarDays, label: 'Appointments', path: '/appointments' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
  { icon: Package, label: 'Resources', path: '/resources' },
  { icon: AlertTriangle, label: 'Emergency Queue', path: '/emergency' },
  { icon: ShieldAlert, label: 'Crisis Panel', path: '/crisis' },
  { icon: FileText, label: 'Service Requests', path: '/service-requests' },
  { icon: BarChart3, label: 'Reports & Analytics', path: '/reports' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: ClipboardList, label: 'Audit Logs', path: '/audit-logs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: User, label: 'Profile', path: '/profile' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { crisisMode } = useApp();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40 sidebar-transition",
      collapsed ? "w-[70px]" : "w-[260px]"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold text-foreground leading-tight">SmartHealth</h1>
            <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Crisis indicator */}
      {crisisMode && (
        <div className={cn(
          "mx-3 mt-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 py-2",
          collapsed ? "px-2 justify-center" : "px-3"
        )}>
          <ShieldAlert className="w-4 h-4 text-destructive animate-pulse-soft flex-shrink-0" />
          {!collapsed && <span className="text-xs font-semibold text-destructive">CRISIS MODE</span>}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 rounded-lg text-sm font-medium w-full transition-colors text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
          )}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
