import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShieldAlert, AlertTriangle, BedDouble, Wind, Activity } from 'lucide-react';
import { toast } from 'sonner';

const CrisisPanel = () => {
  const { crisisMode, setCrisisMode, emergencyCases, resources, addAuditLog } = useApp();

  const toggleCrisis = (val: boolean) => {
    setCrisisMode(val);
    addAuditLog(val ? 'Activated Crisis Mode' : 'Deactivated Crisis Mode', 'Crisis Panel');
    toast[val ? 'warning' : 'success'](val ? 'Crisis Mode Activated!' : 'Crisis Mode Deactivated');
  };

  const icu = resources.find(r => r.name === 'ICU');
  const icuPct = icu ? Math.round((icu.occupied / icu.total) * 100) : 0;
  const oxygen = resources.find(r => r.type === 'oxygen');
  const oxyPct = oxygen ? Math.round((oxygen.occupied / oxygen.total) * 100) : 0;
  const criticalCases = emergencyCases.filter(e => e.severity === 'Critical' || e.severity === 'High');

  return (
    <DashboardLayout>
      <PageHeader title="Crisis Control Panel" subtitle="Activate and manage crisis protocols" />

      {/* Toggle */}
      <div className="bg-card rounded-xl border border-border p-6 card-shadow mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className={`w-6 h-6 ${crisisMode ? 'text-destructive animate-pulse-soft' : 'text-muted-foreground'}`} />
            <div>
              <h3 className="font-semibold text-foreground">Crisis Mode</h3>
              <p className="text-sm text-muted-foreground">Activate emergency protocols for the hospital</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{crisisMode ? 'Active' : 'Inactive'}</Label>
            <Switch checked={crisisMode} onCheckedChange={toggleCrisis} />
          </div>
        </div>
      </div>

      {crisisMode && (
        <div className="space-y-6 animate-fade-in">
          {/* Resource Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-border p-5 card-shadow">
              <div className="flex items-center gap-2 mb-3">
                <BedDouble className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">ICU Utilization</span>
              </div>
              <div className="space-y-2">
                <Progress value={icuPct} className="h-3" />
                <p className="text-2xl font-bold text-foreground">{icuPct}%</p>
                <p className="text-xs text-muted-foreground">{icu?.available || 0} beds available</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 card-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="w-4 h-4 text-info" />
                <span className="text-sm font-semibold text-foreground">Oxygen Usage</span>
              </div>
              <div className="space-y-2">
                <Progress value={oxyPct} className="h-3" />
                <p className="text-2xl font-bold text-foreground">{oxyPct}%</p>
                <p className="text-xs text-muted-foreground">{oxygen?.available || 0} units remaining</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 card-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-foreground">Critical Cases</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{criticalCases.length}</p>
              <p className="text-xs text-muted-foreground">High & Critical severity</p>
            </div>
          </div>

          {/* Severity Queue */}
          <div className="bg-card rounded-xl border border-border p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Priority Queue
            </h3>
            <div className="space-y-2">
              {emergencyCases
                .sort((a, b) => {
                  const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                  return order[a.severity] - order[b.severity];
                })
                .map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={e.severity} />
                      <span className="text-sm font-medium text-foreground">{e.patientName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={e.status} />
                      <span className="text-xs text-muted-foreground">{e.assignedResource}</span>
                      <Button size="sm" variant="outline">Allocate ICU</Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CrisisPanel;
