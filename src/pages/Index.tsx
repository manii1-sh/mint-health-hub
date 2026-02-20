import DashboardLayout from '@/components/layout/DashboardLayout';
import KPICard from '@/components/shared/KPICard';
import { useApp } from '@/context/AppContext';
import { CalendarDays, BedDouble, Activity, Wind, Droplets, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const patientInflow = [
  { name: 'Mon', patients: 45 }, { name: 'Tue', patients: 52 }, { name: 'Wed', patients: 38 },
  { name: 'Thu', patients: 65 }, { name: 'Fri', patients: 48 }, { name: 'Sat', patients: 72 }, { name: 'Sun', patients: 30 },
];

const appointmentStatus = [
  { name: 'Scheduled', value: 35 }, { name: 'Completed', value: 45 },
  { name: 'Cancelled', value: 12 }, { name: 'No-Show', value: 8 },
];
const PIE_COLORS = ['hsl(205,85%,55%)', 'hsl(152,52%,44%)', 'hsl(0,72%,51%)', 'hsl(38,92%,50%)'];

const bedOccupancy = [
  { name: 'General', occupied: 95, available: 25 },
  { name: 'ICU', occupied: 27, available: 3 },
  { name: 'Private', occupied: 32, available: 8 },
  { name: 'Pediatric', occupied: 18, available: 12 },
];

const oxygenUsage = [
  { name: 'Week 1', usage: 120 }, { name: 'Week 2', usage: 145 },
  { name: 'Week 3', usage: 160 }, { name: 'Week 4', usage: 155 },
];

const Dashboard = () => {
  const { appointments, resources, emergencyCases, notifications } = useApp();
  const todayApps = appointments.filter(a => a.status === 'Scheduled').length;
  const beds = resources.filter(r => r.type === 'bed');
  const availableBeds = beds.reduce((s, b) => s + b.available, 0);
  const icu = resources.find(r => r.name === 'ICU');
  const icuPct = icu ? Math.round((icu.occupied / icu.total) * 100) : 0;
  const oxygen = resources.find(r => r.type === 'oxygen');
  const blood = resources.filter(r => r.type === 'blood');
  const totalBlood = blood.reduce((s, b) => s + b.available, 0);

  const alerts = notifications.filter(n => !n.read);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's today's overview.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard title="Appointments Today" value={todayApps} icon={CalendarDays} trend="12% vs yesterday" trendUp />
          <KPICard title="Available Beds" value={availableBeds} icon={BedDouble} trend="5 less" />
          <KPICard title="ICU Occupancy" value={`${icuPct}%`} icon={Activity} variant={icuPct > 85 ? 'danger' : 'default'} />
          <KPICard title="Oxygen Units" value={oxygen?.available || 0} icon={Wind} variant={oxygen && oxygen.available < (oxygen.threshold || 30) ? 'warning' : 'default'} />
          <KPICard title="Blood Units" value={totalBlood} icon={Droplets} variant={totalBlood < 30 ? 'danger' : 'default'} />
          <KPICard title="Emergency Cases" value={emergencyCases.filter(e => e.status !== 'Resolved').length} icon={AlertTriangle} variant="warning" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Patient Inflow
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={patientInflow}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220,10%,45%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,45%)" />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="hsl(152,52%,44%)" strokeWidth={2} dot={{ fill: 'hsl(152,52%,44%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" /> Appointment Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={appointmentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                  {appointmentStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary" /> Bed Occupancy
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bedOccupancy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220,10%,45%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,45%)" />
                <Tooltip />
                <Bar dataKey="occupied" fill="hsl(152,52%,44%)" radius={[4,4,0,0]} />
                <Bar dataKey="available" fill="hsl(152,40%,80%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wind className="w-4 h-4 text-primary" /> Oxygen Usage Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={oxygenUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220,10%,45%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,45%)" />
                <Tooltip />
                <Area type="monotone" dataKey="usage" stroke="hsl(205,85%,55%)" fill="hsl(205,85%,55%,0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        {alerts.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Active Alerts
            </h3>
            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <Users className="w-4 h-4 text-warning flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
