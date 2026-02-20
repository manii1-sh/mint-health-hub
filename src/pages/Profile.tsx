import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';
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
      <PageHeader title="Profile" subtitle="Manage your account" />

      <div className="bg-card rounded-xl border border-border p-6 card-shadow max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
          <div>
            <h3 className="font-semibold text-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input value={email} readOnly className="bg-muted" /></div>
          <div><Label>Hospital</Label><Input value={hospital} readOnly className="bg-muted" /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>

          <div className="pt-2 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Change Password</h4>
            <div className="space-y-3">
              <div><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
            </div>
          </div>

          <Button onClick={save} className="w-full">Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
