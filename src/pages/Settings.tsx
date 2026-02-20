import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [hospitalName, setHospitalName] = useState('City General Hospital');
  const [icuThreshold, setIcuThreshold] = useState(85);
  const [oxygenThreshold, setOxygenThreshold] = useState(30);
  const [crisisTrigger, setCrisisTrigger] = useState(90);

  const save = () => toast.success('Settings saved');

  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Configure hospital parameters" />

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Hospital Info</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow max-w-lg space-y-4">
            <div><Label>Hospital Name</Label><Input value={hospitalName} onChange={e => setHospitalName(e.target.value)} /></div>
            <div><Label>Address</Label><Input defaultValue="123 Medical Street, City" /></div>
            <div><Label>Contact</Label><Input defaultValue="+91 11 2345 6789" /></div>
            <Button onClick={save}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="thresholds">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow max-w-lg space-y-4">
            <div><Label>ICU Alert Threshold (%)</Label><Input type="number" value={icuThreshold} onChange={e => setIcuThreshold(+e.target.value)} /></div>
            <div><Label>Oxygen Alert Threshold (units)</Label><Input type="number" value={oxygenThreshold} onChange={e => setOxygenThreshold(+e.target.value)} /></div>
            <div><Label>Crisis Trigger (%)</Label><Input type="number" value={crisisTrigger} onChange={e => setCrisisTrigger(+e.target.value)} /></div>
            <Button onClick={save}>Save Thresholds</Button>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow max-w-lg space-y-4">
            <div><Label>SMS API Key</Label><Input placeholder="Enter API key..." type="password" /></div>
            <div><Label>WhatsApp Business ID</Label><Input placeholder="Enter Business ID..." /></div>
            <div><Label>Email SMTP Server</Label><Input placeholder="smtp.example.com" /></div>
            <Button onClick={save}>Save Integrations</Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;
