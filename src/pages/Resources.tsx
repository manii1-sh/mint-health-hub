import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { Column } from '@/components/shared/DataTable';
import ModalForm from '@/components/shared/ModalForm';
import PageHeader from '@/components/shared/PageHeader';
import { useApp, Resource } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, MapPin, Building2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface NearbyHospital {
  id: string;
  name: string;
  distance: string;
  city: string;
  resources: { type: string; name: string; total: number; available: number }[];
}

const nearbyHospitals: NearbyHospital[] = [
  {
    id: 'h1', name: 'City General Hospital', distance: '2.3 km', city: 'Mumbai',
    resources: [
      { type: 'bed', name: 'General Ward', total: 80, available: 12 },
      { type: 'bed', name: 'ICU', total: 20, available: 4 },
      { type: 'oxygen', name: 'Oxygen Cylinders', total: 150, available: 40 },
      { type: 'blood', name: 'O+', total: 45, available: 20 },
      { type: 'ventilator', name: 'Ventilators', total: 30, available: 6 },
    ],
  },
  {
    id: 'h2', name: 'Metro Care Hospital', distance: '4.8 km', city: 'Mumbai',
    resources: [
      { type: 'bed', name: 'General Ward', total: 100, available: 30 },
      { type: 'bed', name: 'ICU', total: 15, available: 1 },
      { type: 'oxygen', name: 'Oxygen Cylinders', total: 100, available: 25 },
      { type: 'blood', name: 'A+', total: 30, available: 10 },
      { type: 'ventilator', name: 'Ventilators', total: 20, available: 3 },
    ],
  },
  {
    id: 'h3', name: 'Apollo Multispeciality', distance: '6.1 km', city: 'Thane',
    resources: [
      { type: 'bed', name: 'General Ward', total: 200, available: 55 },
      { type: 'bed', name: 'ICU', total: 40, available: 8 },
      { type: 'oxygen', name: 'Oxygen Cylinders', total: 300, available: 90 },
      { type: 'blood', name: 'B+', total: 35, available: 15 },
      { type: 'ventilator', name: 'Ventilators', total: 60, available: 18 },
    ],
  },
  {
    id: 'h4', name: 'Sunshine Hospital', distance: '8.5 km', city: 'Navi Mumbai',
    resources: [
      { type: 'bed', name: 'General Ward', total: 60, available: 8 },
      { type: 'bed', name: 'ICU', total: 10, available: 0 },
      { type: 'oxygen', name: 'Oxygen Cylinders', total: 80, available: 10 },
      { type: 'blood', name: 'AB-', total: 15, available: 3 },
      { type: 'ventilator', name: 'Ventilators', total: 15, available: 2 },
    ],
  },
  {
    id: 'h5', name: 'Fortis Healthcare', distance: '11.2 km', city: 'Thane',
    resources: [
      { type: 'bed', name: 'General Ward', total: 150, available: 40 },
      { type: 'bed', name: 'ICU', total: 35, available: 10 },
      { type: 'oxygen', name: 'Oxygen Cylinders', total: 250, available: 100 },
      { type: 'blood', name: 'O+', total: 50, available: 25 },
      { type: 'ventilator', name: 'Ventilators', total: 45, available: 12 },
    ],
  },
];

const Resources = () => {
  const { resources, setResources, addAuditLog } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState('bed');
  const [form, setForm] = useState({ name: '', type: 'bed', total: 0, occupied: 0, available: 0, threshold: 0 });

  // Nearby hospitals state
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', type: activeTab === 'nearby' ? 'bed' : activeTab, total: 0, occupied: 0, available: 0, threshold: 0 });
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

  const filteredHospitals = useMemo(() => {
    return nearbyHospitals.filter(h => {
      const matchesSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase());
      const dist = parseFloat(h.distance);
      const matchesDistance = distanceFilter === 'all' ||
        (distanceFilter === '5' && dist <= 5) ||
        (distanceFilter === '10' && dist <= 10) ||
        (distanceFilter === '15' && dist <= 15);
      return matchesSearch && matchesDistance;
    });
  }, [searchQuery, distanceFilter]);

  const tabs = [
    { value: 'bed', label: 'Beds' },
    { value: 'oxygen', label: 'Oxygen' },
    { value: 'blood', label: 'Blood Bank' },
    { value: 'ventilator', label: 'Ventilators' },
    { value: 'nearby', label: 'Nearby Hospitals' },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Resources" subtitle="Manage hospital resources" actionLabel={activeTab !== 'nearby' ? 'Add Resource' : undefined} onAction={activeTab !== 'nearby' ? openAdd : undefined} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map(t => (
            <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
              {t.value === 'nearby' && <Building2 className="w-3.5 h-3.5" />}
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.filter(t => t.value !== 'nearby').map(t => (
          <TabsContent key={t.value} value={t.value}>
            <DataTable columns={makeColumns()} data={resources.filter(r => r.type === t.value)} />
          </TabsContent>
        ))}

        <TabsContent value="nearby">
          {/* Search & Filter Bar */}
          <div className="bg-card rounded-xl border border-border p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search hospitals by name or city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <MapPin className="w-4 h-4 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="5">Within 5 km</SelectItem>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="15">Within 15 km</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Resource type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="bed">Beds</SelectItem>
                <SelectItem value="oxygen">Oxygen</SelectItem>
                <SelectItem value="blood">Blood Bank</SelectItem>
                <SelectItem value="ventilator">Ventilators</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hospital Cards */}
          <div className="grid gap-4">
            {filteredHospitals.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                No hospitals found matching your criteria.
              </div>
            )}
            {filteredHospitals.map(hospital => {
              const displayResources = resourceTypeFilter === 'all'
                ? hospital.resources
                : hospital.resources.filter(r => r.type === resourceTypeFilter);

              return (
                <div key={hospital.id} className="bg-card rounded-xl border border-border p-5 card-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-base">{hospital.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{hospital.city} • {hospital.distance} away</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.success(`Service request sent to ${hospital.name}`)}>
                      Request Resources
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {displayResources.map((res, i) => {
                      const pct = Math.round(((res.total - res.available) / res.total) * 100);
                      const isLow = res.available <= Math.ceil(res.total * 0.1);
                      return (
                        <div key={i} className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{res.name}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-foreground">{res.available}</span>
                            <span className="text-xs text-muted-foreground">/ {res.total}</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                          {isLow && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Low</Badge>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
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
