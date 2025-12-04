import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import loginVisual from "@/assets/images/login-visual.png";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login(email, password, rememberMe);
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Visuals (40%) */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
        <img
          src={loginVisual}
          alt="AI Marketing Intelligence"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-md border border-primary/30">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Next Gen Target Marketing</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold leading-tight">
                Transform Emotions Into <span className="text-primary-glow">Conversions</span>
              </h2>
              <p className="text-white/70 text-lg">
                Your campaigns are waiting. Access real-time sentiment intelligence and AI-powered ad generation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Sparkles key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-white/90 italic mb-4">
                "This platform increased our ROI by 250% in just 3 months! The emotion detection is a game changer."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold text-sm">Sarah Johnson</p>
                  <p className="text-xs text-white/60">Marketing Director at TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (60%) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-hero hover:opacity-90 transition-opacity text-white shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or sign in with</span>
              </div>
            </div>

            <SocialLoginButtons isLoading={isLoading} />

            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="font-semibold text-primary hover:underline">
                Sign up for free
              </Link>
            </p>
          </form>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-8">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Secure 256-bit SSL</span>
            </div>
            <span>•</span>
            <span>GDPR Compliant</span>
            <span>•</span>
            <span>SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;