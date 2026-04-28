import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TalentShowcase from "@/components/TalentShowcase";
import WelcomeScreen from "@/components/WelcomeScreen";

const Index = () => {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <WelcomeScreen onEnter={() => setEntered(true)} />;
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
