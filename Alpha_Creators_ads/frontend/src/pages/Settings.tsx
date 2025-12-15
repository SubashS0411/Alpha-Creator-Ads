import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import AuthService from "@/services/authService";
import { 
  User, 
  Settings as SettingsIcon,
  CreditCard,
  Shield,
  Bell,
  Palette
} from "lucide-react";

const Settings = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { currentUser, updateProfile } = useUserStore();
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    companyName: "",
    industry: ""
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.name || "",
        email: currentUser.email || "",
        companyName: currentUser.companyName || "",
        industry: currentUser.industry || ""
      });
    }
  }, [currentUser]);

  const handleProfileChange = (key: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileSave = () => {
    updateProfile({
      name: profileForm.fullName,
      email: profileForm.email,
      companyName: profileForm.companyName,
      industry: profileForm.industry
    });

    const storedUser = AuthService.getStoredUser();
    if (storedUser) {
      const updatedUser = {
        ...storedUser,
        name: profileForm.fullName,
        email: profileForm.email,
        companyName: profileForm.companyName,
        industry: profileForm.industry
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    toast({
      title: "Profile updated",
      description: "Your settings were saved successfully."
    });
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and AI configuration
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Profile</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profileForm.fullName}
                    onChange={(e) => handleProfileChange("fullName", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={profileForm.companyName}
                    onChange={(e) => handleProfileChange("companyName", e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input
                    value={profileForm.industry}
                    onChange={(e) => handleProfileChange("industry", e.target.value)}
                    placeholder="e.g. Healthcare, Fintech"
                  />
                </div>
                <Button size="sm" onClick={handleProfileSave}>Update Profile</Button>
              </div>
            </Card>

            {/* Theme Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Appearance</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{theme} Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Customize your interface theme
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Choose between light, dark, or system theme preference
                </div>
              </div>
            </Card>

            {/* AI Preferences */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <SettingsIcon className="h-5 w-5 text-accent-orange" />
                <h3 className="font-semibold">AI Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Generation Style</Label>
                  <Input defaultValue="Professional" />
                </div>
                <div className="space-y-2">
                  <Label>Automation Level</Label>
                  <Input defaultValue="AI with Review" />
                </div>
                <Button size="sm">Save Preferences</Button>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Billing */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Billing</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Current Plan</div>
                  <div className="font-medium">Pro Plan - $49/month</div>
                </div>
                <Button size="sm" variant="outline">Manage Billing</Button>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive campaign updates</div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;