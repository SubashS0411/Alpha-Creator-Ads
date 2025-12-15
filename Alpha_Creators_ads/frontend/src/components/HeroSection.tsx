import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-ai-bg.jpg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStartCreating = () => {
    navigate("/generate");
  };

  const handleWatchDemo = () => {
    toast({
      title: "Coming Soon!",
      description: "The demo video is not yet available.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => console.log("Video loaded successfully")}
          onError={(e) => console.error("Video error:", e)}
        >
          {/* Prioritize Local File */}
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          {/* External Fallback */}
          <source src="https://cdn.pixabay.com/video/2019/05/19/23696-339233636_large.mp4" type="video/mp4" />
        </video>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-transparent to-background/80 relative z-10" />

        {/* Light Mode Specific Fog - Fade out in dark mode */}
        <div className="absolute inset-0 bg-white/80 dark:bg-transparent dark:opacity-0 transition-all duration-1000 z-0 pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/10 blur-[100px] rounded-full transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full transform translate-y-1/3 translate-x-1/3" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
      </div>

      {/* Video Control */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:block">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm text-muted-foreground hover:text-foreground border border-white/5"
          onClick={togglePlay}
        >
          {isPlaying ? <span className="text-xl">⏸</span> : <span className="text-xl">▶</span>}
        </Button>
      </div>

      <div className="relative container mx-auto px-4 py-32 lg:py-48 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Next-Gen AI Advertising</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Create{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Personalized Ads
              </span>{" "}
              <br />
              <span className="relative inline-block">
                with AI
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-md">
              Transform your advertising workflow with intelligent personalization. Generate compelling,
              high-converting ads in seconds using our advanced AI engine.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <Button variant="premium" size="lg" className="group h-12 px-8 text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300" onClick={handleStartCreating}>
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-primary/20 hover:bg-primary/5 backdrop-blur-sm" onClick={handleWatchDemo}>
                Watch Demo
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 border-t border-border/50 pt-8 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Faster Production</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-foreground">3x</div>
                <div className="text-sm text-muted-foreground mt-1">Higher CTR</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-foreground">10k+</div>
                <div className="text-sm text-muted-foreground mt-1">Ads Generated</div>
              </div>
            </motion.div>
          </motion.div>


        </div>
      </div>
    </section>
  );
};
