import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MultiStepProgressBar from "@/components/auth/MultiStepProgressBar";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import signupBg from "@/assets/images/signup-bg.png";
import authService from "@/services/authService";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,

    // Step 2: Business
    companyName: "",
    companySize: "",
    industry: "",
    monthlyAdSpend: "",

    // Step 3: Integration
    integrations: [] as string[]
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
      
      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast({ 
          title: "Weak Password", 
          description: "Password must be at least 8 characters and contain uppercase, lowercase, and numbers.", 
          variant: "destructive" 
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
      if (!formData.agreeToTerms) {
        toast({ title: "Agreement Required", description: "Please agree to the Terms of Service.", variant: "destructive" });
        return;
      }
    }

    if (step === 2) {
      if (!formData.companyName || !formData.companySize || !formData.industry) {
        toast({ title: "Missing Fields", description: "Please tell us about your business.", variant: "destructive" });
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      // Split full name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // Generate username from email (sanitize)
      const emailPrefix = formData.email.split('@')[0];
      const sanitizedPrefix = emailPrefix.replace(/[^a-zA-Z0-9_.]/g, '_');
      const username = sanitizedPrefix + Math.floor(Math.random() * 1000);

      await authService.register({
        email: formData.email,
        username,
        password: formData.password,
        firstName,
        lastName,
        companyName: formData.companyName,
        companySize: formData.companySize,
        industry: formData.industry,
        monthlyAdSpend: formData.monthlyAdSpend,
        integrations: formData.integrations
      });

      toast({
        title: "Account Created!",
        description: "Welcome to Next-Gen Target Marketing.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIntegration = (platform: string) => {
    setFormData(prev => {
      const exists = prev.integrations.includes(platform);
      return {
        ...prev,
        integrations: exists
          ? prev.integrations.filter(p => p !== platform)
          : [...prev.integrations, platform]
      };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 z-10" />
        <img src={signupBg} alt="Background" className="w-full h-full object-cover opacity-20" />
      </div>

      <Card className="w-full max-w-2xl p-8 shadow-2xl bg-card/80 backdrop-blur-xl border-white/10 relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Start Your Free 14-Day Trial</h1>
          <p className="text-muted-foreground">
            No credit card required • Cancel anytime • Full access to all features
          </p>
        </div>

        <MultiStepProgressBar
          steps={["Account Details", "Business Info", "Integration Setup"]}
          currentStep={step}
        />

        <div className="mt-8">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                />
                <PasswordStrengthMeter password={formData.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed font-normal text-muted-foreground">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>

            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Inc."
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(val) => updateFormData("companySize", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me</SelectItem>
                      <SelectItem value="2-10">2-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201+">201+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={formData.industry} onValueChange={(val) => updateFormData("industry", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="b2b">B2B Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Monthly Ad Spend</Label>
                <Select value={formData.monthlyAdSpend} onValueChange={(val) => updateFormData("monthlyAdSpend", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select monthly spend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1k">Less than $1,000</SelectItem>
                    <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5k-25k">$5,000 - $25,000</SelectItem>
                    <SelectItem value="25k+">$25,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Integration Setup */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Connect Your Marketing Channels</h3>
                <p className="text-sm text-muted-foreground">Select the platforms you want to monitor and advertise on</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Twitter", "Facebook", "Instagram", "LinkedIn", "Google Ads", "TikTok"].map((platform) => (
                  <div
                    key={platform}
                    className={`
                      cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200
                      ${formData.integrations.includes(platform)
                        ? "border-primary bg-primary/5 shadow-[0_0_24px_rgba(59,130,246,0.45)] hover:shadow-[0_0_30px_rgba(59,130,246,0.65)]"
                        : "border-border hover:border-primary/60 hover:bg-secondary/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
                      }
                    `}
                    onClick={() => toggleIntegration(platform)}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${formData.integrations.includes(platform) ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}
                    `}>
                      {platform[0]}
                    </div>
                    <span className="text-sm font-medium">{platform}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-4 justify-center">
                <Checkbox id="updates" defaultChecked />
                <Label htmlFor="updates" className="text-sm font-normal text-muted-foreground">
                  Send me product updates and marketing tips
                </Label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div /> /* Spacer */
            )}

            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSignup}
                className="bg-gradient-hero shadow-lg shadow-primary/25 transition-all hover:shadow-[0_0_28px_rgba(59,130,246,0.55)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Start My Free Trial <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;