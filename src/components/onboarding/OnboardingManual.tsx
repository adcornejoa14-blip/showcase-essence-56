import logo from "@/assets/noma-logo-final.png";

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

const OnboardingManual = ({ onContinue, onBack }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <img src={logo} alt="NOMA" className="mb-12 w-48 select-none" draggable={false} />

      <h1 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
        Welcome to NOMA Digital Studio
      </h1>
      <p className="mt-4 text-sm font-light leading-relaxed text-foreground/60">
        A curated community of dentists and digital dental technicians. To join, we review
        every application to ensure the quality of the work.
      </p>

      <ol className="mt-12 w-full space-y-6 text-left">
        {[
          { n: "01", t: "Complete your application", d: "Basic info, specialty and profile photo." },
          { n: "02", t: "Upload examples of your work", d: "Between 3 and 10 representative photos." },
          { n: "03", t: "Wait for approval", d: "We'll contact you by email when your profile is approved." },
        ].map((s) => (
          <li key={s.n} className="flex gap-5 border-b border-foreground/10 pb-6">
            <span className="text-xs font-light tracking-[0.2em] text-foreground/40">{s.n}</span>
            <div>
              <p className="text-sm font-light text-foreground">{s.t}</p>
              <p className="mt-1 text-xs font-light text-foreground/50">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OnboardingManual;
