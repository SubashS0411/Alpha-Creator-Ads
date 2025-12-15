import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for testing the waters",
        features: ["50 AI Ad Generations/mo", "Basic Analytics", "1 User Seat", "Standard Templates"],
        cta: "Start for Free",
        popular: false
    },
    {
        name: "Pro",
        price: "$49",
        description: "For growing marketing teams",
        features: ["Unlimited AI Generations", "Advanced Analytics", "5 User Seats", "Custom Templates", "Priority Support"],
        cta: "Get Pro",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large scale organizations",
        features: ["Unlimited Everything", "Dedicated Account Manager", "API Access", "SSO & Security", "Custom AI Training"],
        cta: "Contact Sales",
        popular: false
    }
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-36 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-6"
                    >
                        Simple, Transparent{" "}
                        <span className="bg-gradient-hero bg-clip-text text-transparent">
                            Pricing
                        </span>
                    </motion.h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your growth needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 border ${plan.popular ? 'border-primary/50 shadow-glow bg-gradient-to-b from-primary/5 to-background' : 'border-border bg-card/40'} flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Zap className="w-3 h-3" /> Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Button className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-muted hover:bg-muted/80 text-foreground'}`}>
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
