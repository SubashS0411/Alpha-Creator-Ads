import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Contains number", valid: /[0-9]/.test(password) },
    { label: "Contains special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const validCount = requirements.filter((r) => r.valid).length;
  const score = (validCount / requirements.length) * 100;

  const getStrengthLabel = () => {
    if (score < 40) return "Weak";
    if (score < 80) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (score < 40) return "bg-destructive";
    if (score < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={`font-medium ${
          score < 40 ? "text-destructive" : score < 80 ? "text-yellow-500" : "text-green-500"
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getStrengthColor()}`} 
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.valid ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={req.valid ? "text-foreground" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
