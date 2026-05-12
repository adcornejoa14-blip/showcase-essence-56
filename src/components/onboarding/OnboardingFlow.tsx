import { useState } from "react";
import OnboardingManual from "./OnboardingManual";
import OnboardingRoleStep, { type OnboardingRole } from "./OnboardingRole";
import OnboardingForm from "./OnboardingForm";
import OnboardingCredentials from "./OnboardingCredentials";
import OnboardingSubmitted from "./OnboardingSubmitted";

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const OnboardingFlow = ({ onComplete, onBack }: Props) => {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<OnboardingRole | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {step === 1 && (
        <OnboardingManual onContinue={() => setStep(2)} onBack={onBack} />
      )}
      {step === 2 && (
        <OnboardingRoleStep
          onSelect={(r) => {
            setRole(r);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && role && (
        <OnboardingForm
          role={role}
          onSubmit={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <OnboardingCredentials
          onCreated={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && <OnboardingSubmitted onContinue={onComplete} />}
    </div>
  );
};

export default OnboardingFlow;
