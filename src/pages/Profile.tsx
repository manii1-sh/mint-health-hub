import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, User, Shield, Bell, Activity } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [hospital] = useState(user?.hospital || '');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const save = () => {
    updateProfile({ name, phone });
    toast.success('Profile updated');
  };

  return (
    <DashboardLayout>
      <PageHeader title="Profile" subtitle="Manage your account settings" />

      {/* Profile Header Card */}
      <div className="bg-card rounded-xl border border-border card-shadow mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-primary/60" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-card border-4 border-card flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div className="pb-1">
              <h3 className="font-semibold text-lg text-foreground">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.role} • {user?.hospital}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="max-w-2xl">
        <TabsList className="mb-4">
          <TabsTrigger value="personal" className="gap-1.5"><User className="w-4 h-4" /> Personal</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Shield className="w-4 h-4" /> Security</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5"><Activity className="w-4 h-4" /> Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <div><Label>Email</Label><Input value={email} readOnly className="bg-muted" /></div>
              <div><Label>Hospital</Label><Input value={hospital} readOnly className="bg-muted" /></div>
              <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div><Label>Role</Label><Input value={user?.role || ''} readOnly className="bg-muted" /></div>
              <div><Label>Employee ID</Label><Input value={user?.id || ''} readOnly className="bg-muted" /></div>
            </div>
            <Button onClick={save}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-4">
            <h4 className="font-medium text-foreground">Change Password</h4>
            <div className="space-y-3 max-w-md">
              <div><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div><Label>Confirm New Password</Label><Input type="password" placeholder="••••••••" /></div>
            </div>
            <Button onClick={() => toast.success('Password updated')}>Update Password</Button>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Enable 2FA</p>
                  <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-4">
            <h4 className="font-medium text-foreground mb-2">Notification Preferences</h4>
            {[
              { label: 'Email Notifications', desc: 'Receive alerts via email' },
              { label: 'SMS Notifications', desc: 'Receive alerts via SMS' },
              { label: 'Crisis Alerts', desc: 'Get notified during emergencies' },
              { label: 'Appointment Reminders', desc: 'Reminders before appointments' },
              { label: 'Resource Alerts', desc: 'Low resource warnings' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            <h4 className="font-medium text-foreground mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {[
                { action: 'Logged in', time: '2 minutes ago' },
                { action: 'Updated profile picture', time: '1 hour ago' },
                { action: 'Created appointment for Patient #102', time: '3 hours ago' },
                { action: 'Activated crisis mode', time: 'Yesterday, 9:45 PM' },
                { action: 'Approved service request SR004', time: 'Yesterday, 4:30 PM' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Profile;
