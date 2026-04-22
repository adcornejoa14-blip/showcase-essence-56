import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TalentShowcase from "@/components/TalentShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
