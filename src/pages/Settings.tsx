import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Database,
  Moon,
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <AdminLayout
      title="Settings"
      subtitle="Configure Silent Masjid admin panel and app settings."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">General Settings</h3>
              <p className="text-sm text-muted-foreground">Basic app configuration</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="app-name">App Name</Label>
              <Input id="app-name" defaultValue="Silent Masjid" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                defaultValue="Connect to Allah. Disconnect from Dunyah."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                defaultValue="support@silentmasjid.com"
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
              <Bell className="h-5 w-5 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Push notification preferences
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Geofencing Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Notify users when entering a mosque
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Prayer Time Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send prayer time notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Streak Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Celebrate user achievements
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">
                Admin security settings
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin login
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">
                  Auto logout after inactivity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Label htmlFor="session-duration">Session Duration (hours)</Label>
              <Input
                id="session-duration"
                type="number"
                defaultValue="24"
                className="mt-1 max-w-[100px]"
              />
            </div>
          </div>
        </Card>

        {/* Geofencing Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Globe className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Geofencing</h3>
              <p className="text-sm text-muted-foreground">
                Location detection settings
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="geofence-radius">Default Radius (meters)</Label>
              <Input
                id="geofence-radius"
                type="number"
                defaultValue="100"
                className="mt-1 max-w-[120px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">High Accuracy Mode</p>
                <p className="text-sm text-muted-foreground">
                  Uses more battery but more precise
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Background Location</p>
                <p className="text-sm text-muted-foreground">
                  Track location when app is closed
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Payment Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
              <CreditCard className="h-5 w-5 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Payments</h3>
              <p className="text-sm text-muted-foreground">
                Donation payment configuration
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stripe Integration</p>
                <p className="text-sm text-muted-foreground">Accept card payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">PayPal Integration</p>
                <p className="text-sm text-muted-foreground">Accept PayPal donations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Label htmlFor="donation-goal">Funding Goal ($)</Label>
              <Input
                id="donation-goal"
                type="number"
                defaultValue="50000"
                className="mt-1 max-w-[150px]"
              />
            </div>
          </div>
        </Card>

        {/* Database Settings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Database</h3>
              <p className="text-sm text-muted-foreground">
                Data management options
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-sm text-muted-foreground">Daily automatic backups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex gap-3">
              <Button variant="outline">Export Data</Button>
              <Button variant="outline">Import Data</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="islamic" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Settings;
