import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
    return (
        <section className="py-36 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 blur-3xl opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-gradient-card border border-white/10 rounded-3xl p-12 lg:p-24 text-center shadow-2xl overflow-hidden relative group">

                    {/* Animated Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-500" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-background/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 mb-8">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">No credit card required</span>
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            Ready to Transform Your <br />
                            <span className="bg-gradient-hero bg-clip-text text-transparent">Ad Strategy?</span>
                        </h2>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Join thousands of marketers creating high-performing campaigns 10x faster with AlphaAds using AI.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-glow hover:shadow-glow-lg transition-all">
                                Get Started for Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/20 bg-background/50 hover:bg-background/80">
                                Book a Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
