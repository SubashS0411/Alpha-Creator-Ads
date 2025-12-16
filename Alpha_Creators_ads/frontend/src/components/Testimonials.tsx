import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        content: "The AI targeting precision is unmatched. We've seen a 40% increase in conversions since switching to AlphaAds.",
        author: "Subash s",
        role: "CEO Amazon",
        initials: "SS"
    },
    {
        content: "Finally, a platform that understands creative nuance. The generated ad copies are indistinguishable from human-written text.",
        author: "Naresh D",
        role: "CEO Google",
        initials: "ND"
    },
    {
        content: "The analytics dashboard is a game-changer. Real-time emotion detection helps us pivot our strategy instantly.",
        author: "Ruthuvarshan",
        role: "Co founder, NASA",
        initials: "R"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-36 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-6"
                    >
                        Loved by{" "}
                        <span className="bg-gradient-hero bg-clip-text text-transparent">
                            Market Leaders
                        </span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 relative"
                        >
                            <Quote className="absolute top-8 right-8 text-primary/10 w-12 h-12" />

                            <p className="text-lg text-muted-foreground mb-8 relative z-10 italic">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-primary/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.initials}`} />
                                    <AvatarFallback className="bg-primary/10 text-primary">{item.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-foreground">{item.author}</div>
                                    <div className="text-sm text-muted-foreground">{item.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
