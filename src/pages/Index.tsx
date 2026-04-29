import { useState } from "react";
import Header from "@/components/Header";
import ServiceSearch from "@/components/ServiceSearch";
import WorldMap from "@/components/WorldMap";
import TalentShowcase from "@/components/TalentShowcase";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import LoginScreen from "@/components/onboarding/LoginScreen";

type Phase = "welcome" | "onboarding" | "login" | "app";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");

  if (phase === "welcome") {
    return (
      <WelcomeScreen
        onCreateAccount={() => setPhase("onboarding")}
        onLogin={() => setPhase("login")}
      />
    );
  }

  if (phase === "onboarding") {
    return (
      <OnboardingFlow
        onComplete={() => setPhase("app")}
        onBack={() => setPhase("welcome")}
      />
    );
  }

  if (phase === "login") {
    return (
      <LoginScreen
        onLogin={() => setPhase("app")}
        onBack={() => setPhase("welcome")}
        onCreateAccount={() => setPhase("onboarding")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        <h1 className="sr-only">NOMA Digital Studio — Talent Showcase</h1>
        <ServiceSearch />
        <WorldMap />
        <TalentShowcase />
      </main>
    </div>
  );
};

export default Index;
