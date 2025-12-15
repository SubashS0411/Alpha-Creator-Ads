import { motion } from "framer-motion";

const companies = [
    { name: "TechCorp", opacity: 0.7 },
    { name: "InnovateLabs", opacity: 0.6 },
    { name: "FutureStudio", opacity: 0.8 },
    { name: "NextGen Media", opacity: 0.6 },
    { name: "AlphaStream", opacity: 0.7 },
];

export const TrustedBy = () => {
    return (
        <section className="py-24 border-y border-white/5 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Trusted by innovative teams worldwide
                    </span>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: company.opacity }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-xl md:text-2xl font-bold text-foreground grayscale hover:grayscale-0 transition-all duration-300 cursor-default"
                        >
                            {company.name}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
