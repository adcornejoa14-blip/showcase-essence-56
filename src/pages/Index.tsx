import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TalentShowcase from "@/components/TalentShowcase";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

type Phase = "welcome" | "onboarding" | "app";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");

  if (phase === "welcome") {
    return <WelcomeScreen onEnter={() => setPhase("onboarding")} />;
  }

  if (phase === "onboarding") {
    return (
      <OnboardingFlow
        onComplete={() => setPhase("app")}
        onBack={() => setPhase("welcome")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        <h1 className="sr-only">NOMA Digital Studio — Talent Showcase</h1>
        <Hero />
        <TalentShowcase />
      </main>
    </div>
  );
};

export default Index;
