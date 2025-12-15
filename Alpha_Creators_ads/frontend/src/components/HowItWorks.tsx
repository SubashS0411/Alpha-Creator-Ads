import { motion } from "framer-motion";
import { Database, Wand2, Rocket, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: Database,
        title: "1. Connect Your Data",
        description: "Integrate your existing marketing data and define your target audience parameters.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Wand2,
        title: "2. Generate with AI",
        description: "Our advanced AI engine creates hundreds of personalized ad variations in seconds.",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        icon: Rocket,
        title: "3. Launch & Optimize",
        description: "Deploy top-performing ads instantly and let our system optimize for ROI in real-time.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export const HowItWorks = () => {
    return (
        <section className="py-36 bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-6"
                    >
                        How It{" "}
                        <span className="bg-gradient-hero bg-clip-text text-transparent">
                            Works
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        From raw data to high-converting campaigns in three simple steps.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform duration-300 border border-white/5`}>
                                <step.icon className={`w-8 h-8 ${step.color}`} />
                            </div>

                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                {step.description}
                            </p>

                            {/* Mobile Arrow */}
                            {index < steps.length - 1 && (
                                <ArrowRight className="md:hidden mt-8 text-muted-foreground/30 rotate-90" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
