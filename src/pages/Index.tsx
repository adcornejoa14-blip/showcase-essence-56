import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ServiceSearch from "@/components/ServiceSearch";
import WorldMap from "@/components/WorldMap";
import TalentShowcase from "@/components/TalentShowcase";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import LoginScreen from "@/components/onboarding/LoginScreen";
import { useAuth } from "@/hooks/useAuth";

type Intent = "welcome" | "onboarding" | "login";

const Index = () => {
  const { session, loading } = useAuth();
  const [intent, setIntent] = useState<Intent>("welcome");

  // Clean up legacy localStorage key from previous fake-auth flow
  useEffect(() => {
    try {
      window.localStorage.removeItem("noma:phase");
    } catch {
      // ignore
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!session) {
    if (intent === "onboarding") {
      return (
        <OnboardingFlow
          onComplete={() => setIntent("welcome")}
          onBack={() => setIntent("welcome")}
        />
      );
    }

    if (intent === "login") {
      return (
        <LoginScreen
          onLogin={() => setIntent("welcome")}
          onBack={() => setIntent("welcome")}
          onCreateAccount={() => setIntent("onboarding")}
        />
      );
    }

    return (
      <WelcomeScreen
        onCreateAccount={() => setIntent("onboarding")}
        onLogin={() => setIntent("login")}
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
