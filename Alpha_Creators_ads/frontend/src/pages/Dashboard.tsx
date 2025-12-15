import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SocialMediaFeed from "@/components/dashboard/SocialMediaFeed";
import EmotionGauge from "@/components/dashboard/EmotionGauge";
import AdPerformanceChart from "@/components/dashboard/AdPerformanceChart";
import CustomerProfileCards from "@/components/dashboard/CustomerProfileCards";
import CampaignWidgets from "@/components/dashboard/CampaignWidgets";
import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthService from "@/services/authService";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = AuthService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground font-sans transition-colors duration-300">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

        <AppSidebar />

        <main className="flex-1 flex flex-col relative z-10 min-h-screen overflow-y-auto w-full">
          {/* Top Header */}
          <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Centered Search/Status (Optional Enhancement) */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-muted/30 rounded-full border border-border/50">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-medium text-foreground/80">AI System Active</span>
              <span className="text-xs text-muted-foreground ml-2">Real-time analysis running...</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="w-64 pl-9 h-9 bg-muted/20 border-border/50 focus-visible:ring-primary/20" placeholder="Search analytics or campaigns..." />
              </div>

              <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse ring-2 ring-background" />
              </Button>

              <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none text-foreground">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.companyName || 'Pro Plan'}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-background shadow-md flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:shadow-glow transition-all">
                  {user?.firstName ? user.firstName[0] : 'U'}
                </div>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <motion.div
            className="flex-1 p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-[1600px] mx-auto">
              {/* Welcome Message */}
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Monitor your AI-driven marketing performance in real-time.</p>
              </motion.div>

              <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Social Feed */}
                <motion.div variants={itemVariants} className="col-span-12 lg:col-span-3">
                  <SocialMediaFeed />
                </motion.div>

                {/* Middle Column: Emotion & Widgets */}
                <motion.div variants={itemVariants} className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                  <div className="min-h-[300px]">
                    <EmotionGauge />
                  </div>
                  <div>
                    <CampaignWidgets />
                  </div>
                </motion.div>

                {/* Right Column: Charts & Profiles */}
                <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                  <div className="min-h-[200px]">
                    <AdPerformanceChart />
                  </div>
                  <div>
                    <CustomerProfileCards />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
