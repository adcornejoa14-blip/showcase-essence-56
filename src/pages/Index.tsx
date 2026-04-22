import Header from "@/components/Header";
import TalentShowcase from "@/components/TalentShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <h1 className="sr-only">Talent Showcase — Técnicos dentales</h1>
        <TalentShowcase />
      </main>
    </div>
  );
};

export default Index;
