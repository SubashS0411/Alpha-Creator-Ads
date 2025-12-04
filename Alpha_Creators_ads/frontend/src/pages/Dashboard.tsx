import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SocialMediaFeed from "@/components/dashboard/SocialMediaFeed";
import EmotionGauge from "@/components/dashboard/EmotionGauge";
import AdPerformanceChart from "@/components/dashboard/AdPerformanceChart";
import CustomerProfileCards from "@/components/dashboard/CustomerProfileCards";
import CampaignWidgets from "@/components/dashboard/CampaignWidgets";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthService from "@/services/authService";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = AuthService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground font-sans transition-colors duration-300">
        {/* Background Effects - Dark Mode Only */}
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 pointer-events-none dark:opacity-5 opacity-0" />
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-background pointer-events-none dark:block hidden" />

        <AppSidebar />

        <main className="flex-1 flex flex-col relative z-10 min-h-screen overflow-y-auto">
          {/* Top Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold tracking-wide text-foreground/90 uppercase hidden md:block">
                Sophisticated Marketing Dashboard - Real-Time Sentiment Analysis
              </h1>
              <h1 className="text-lg font-semibold tracking-wide text-foreground/90 uppercase md:hidden">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none text-foreground">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.companyName || 'Pro Plan'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-border flex items-center justify-center text-xs font-bold text-white">
                  {user?.firstName ? user.firstName[0] : 'U'}
                </div>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <div className="flex-1 p-8">
            <div className="grid grid-cols-12 gap-8">

              {/* Left Column: Social Feed (3 cols) */}
              <div className="col-span-12 lg:col-span-3">
                <SocialMediaFeed />
              </div>

              {/* Middle Column: Emotion Gauge (5 cols) */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                <div className="min-h-[300px]">
                  <EmotionGauge />
                </div>
                <div>
                  <CampaignWidgets />
                </div>
              </div>

              {/* Right Column: Charts & Profiles (4 cols) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                <div className="min-h-[200px]">
                  <AdPerformanceChart />
                </div>
                <div>
                  <CustomerProfileCards />
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;