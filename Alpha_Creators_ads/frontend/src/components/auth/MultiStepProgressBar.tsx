import { Check } from "lucide-react";

interface MultiStepProgressBarProps {
    steps: string[];
    currentStep: number;
}

const MultiStepProgressBar = ({ steps, currentStep }: MultiStepProgressBarProps) => {
    return (
        <div className="w-full py-4">
            <div className="relative flex justify-between">
                {/* Progress Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 z-0" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300
                  ${isActive
                                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-glow"
                                        : isCompleted
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "bg-background border-muted-foreground/30 text-muted-foreground"
                                    }
                `}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                            </div>
                            <span
                                className={`
                  text-xs font-medium transition-colors duration-300 absolute -bottom-6 w-32 text-center
                  ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}
                `}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="h-6" /> {/* Spacer for labels */}
        </div>
    );
};

export default MultiStepProgressBar;
