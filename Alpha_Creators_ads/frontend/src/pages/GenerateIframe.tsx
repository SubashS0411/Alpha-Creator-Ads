import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, ArrowLeft, Menu, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';
import AuthService from '@/services/authService';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GenerateIframe = () => {
  const [userInput, setUserInput] = useState('');
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser, isLoading: isUserLoading } = useUserStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUserData = AuthService.getStoredUser();
    if (currentUserData) {
      setUser(currentUserData);
    }
  }, []);

  const handleGeneratePrompt = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate a prompt",
        variant: "destructive",
      });
      return;
    }

    if (isUserLoading) {
      toast({
        title: "Loading user",
        description: "We are still loading your profile. Please try again in a moment.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedUrl(null);

    let userProfile: any = currentUser;

    if (!userProfile) {
      const storedUser = AuthService.getStoredUser ? AuthService.getStoredUser() : null;
      if (storedUser) {
        userProfile = storedUser;
      } else {
        try {
          const fetchedUser = await AuthService.getCurrentUser();
          if (fetchedUser) {
            userProfile = fetchedUser;
          }
        } catch (fetchErr) {
          console.error('Failed to fetch user profile:', fetchErr);
        }
      }
    }

    if (!userProfile) {
      setIsLoading(false);
      toast({
        title: "User not found",
        description: "Please log in to use this feature.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Construct the Opal URL directly, including user and company info
      const companyName = userProfile.companyName || '';
      const industry = userProfile.industry || '';

      console.log(`Generating URL with: UserInput='${userInput}', Company='${companyName}', Industry='${industry}', ProductName='${productName}'`);

      const opalBaseUrl = 'https://opal.google/?flow=drive:/1lcqFI1I3-EE_V1Th-2hv0qckv-PuPxDG&shared&mode=app';
      const queryParams = new URLSearchParams({
        prompt: userInput,
        companyName: companyName,
        industry: industry,
        productName: productName,
      });

      const opalUrl = `${opalBaseUrl}&${queryParams.toString()}`;

      console.log('Constructed Opal URL:', opalUrl);

      // Notify external workflow while we display the URL immediately
      const webhookEndpoint = new URL('http://localhost:5678/webhook-test/Prompt');
      webhookEndpoint.searchParams.set('userInput', userInput);
      webhookEndpoint.searchParams.set('companyName', companyName);
      webhookEndpoint.searchParams.set('industry', industry);
      webhookEndpoint.searchParams.set('productName', productName);

      try {
        const webhookResponse = await fetch(webhookEndpoint.toString(), {
          method: 'GET',
        });

        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.warn('Webhook responded with error status:', webhookResponse.status, errorText);
        } else {
          console.log('Webhook notified successfully');
        }
      } catch (webhookError) {
        console.warn('Webhook notification failed:', webhookError);
      }

      setGeneratedUrl(opalUrl);

      toast({
        title: "Success!",
        description: "Prompt generated! Click the button below to open.",
      });

    } catch (err: any) {
      console.error('Error generating prompt:', err);
      setError(err.message);

      toast({
        title: "Error",
        description: err.message || "Failed to generate prompt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground font-sans transition-colors duration-300">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 pointer-events-none dark:opacity-5 opacity-0" />
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-background pointer-events-none dark:block hidden" />

        <AppSidebar />

        <main className="flex-1 flex flex-col relative z-10 min-h-screen overflow-y-auto">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
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

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-12 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
              <Card className="w-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />

                <CardHeader className="text-center space-y-4 pb-8 pt-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg mb-4"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI Prompt Generator
                  </CardTitle>
                  <CardDescription className="text-lg max-w-lg mx-auto">
                    Enter your ideas and let our AI craft the perfect prompt for your content creation needs.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 px-8 pb-10">
                  <div className="space-y-3">
                    <Label htmlFor="productName" className="text-base font-semibold ml-1">
                      Product Name
                    </Label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <Input
                        id="productName"
                        type="text"
                        placeholder="E.g., SuperFast sneakers"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="relative h-14 text-lg px-4 bg-background border-border/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="userInput" className="text-base font-semibold ml-1">
                      What would you like to create?
                    </Label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <Input
                        id="userInput"
                        type="text"
                        placeholder="E.g., A futuristic city with flying cars..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                        className="relative h-14 text-lg px-4 bg-background border-border/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      onClick={handleGeneratePrompt}
                      disabled={isLoading || isUserLoading || !userInput.trim()}
                      size="lg"
                      className="w-full text-lg h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-6 w-6" />
                          Generate Prompt
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                    >
                      <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Error:</strong> {error}
                      </p>
                    </motion.div>
                  )}

                  {generatedUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 space-y-4"
                    >
                      <div className="flex items-center gap-3 text-green-800 dark:text-green-200">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-lg">Prompt generated successfully!</p>
                      </div>

                      <Button
                        onClick={() => window.open(generatedUrl, '_blank')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base shadow-md hover:shadow-lg transition-all"
                      >
                        Open in Google Opal
                      </Button>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-border/50">
                    <p className="text-xs text-center text-muted-foreground">
                      Powered by Alpha Creators AI Engine
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default GenerateIframe;

