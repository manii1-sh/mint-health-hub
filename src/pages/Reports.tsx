import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const monthlyInflow = [
  { month: 'Jan', patients: 420 }, { month: 'Feb', patients: 480 }, { month: 'Mar', patients: 510 },
  { month: 'Apr', patients: 390 }, { month: 'May', patients: 450 }, { month: 'Jun', patients: 530 },
  { month: 'Jul', patients: 620 }, { month: 'Aug', patients: 580 }, { month: 'Sep', patients: 490 },
  { month: 'Oct', patients: 540 }, { month: 'Nov', patients: 610 }, { month: 'Dec', patients: 550 },
];

const icuTrend = [
  { week: 'W1', utilization: 75 }, { week: 'W2', utilization: 82 }, { week: 'W3', utilization: 88 },
  { week: 'W4', utilization: 90 }, { week: 'W5', utilization: 85 }, { week: 'W6', utilization: 92 },
];

const oxygenConsumption = [
  { day: 'Mon', units: 28 }, { day: 'Tue', units: 32 }, { day: 'Wed', units: 25 },
  { day: 'Thu', units: 38 }, { day: 'Fri', units: 30 }, { day: 'Sat', units: 22 }, { day: 'Sun', units: 18 },
];

const emergencyFreq = [
  { month: 'Jan', cases: 12 }, { month: 'Feb', cases: 18 }, { month: 'Mar', cases: 15 },
  { month: 'Apr', cases: 22 }, { month: 'May', cases: 10 }, { month: 'Jun', cases: 28 },
];

const Reports = () => {
  const handleExport = (format: string) => toast.success(`Report exported as ${format}`);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Hospital performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="w-4 h-4 mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}><Download className="w-4 h-4 mr-1" /> CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Patient Inflow</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyInflow}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Bar dataKey="patients" fill="hsl(152,52%,44%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-4">ICU Usage Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={icuTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip /><Line type="monotone" dataKey="utilization" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={{ fill: 'hsl(0,72%,51%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-4">Oxygen Consumption</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={oxygenConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Area type="monotone" dataKey="units" stroke="hsl(205,85%,55%)" fill="hsl(205,85%,55%,0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-4">Emergency Frequency</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={emergencyFreq}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Bar dataKey="cases" fill="hsl(38,92%,50%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
