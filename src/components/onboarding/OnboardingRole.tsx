export type OnboardingRole = "dentist" | "technician";

interface Props {
  onSelect: (role: OnboardingRole) => void;
  onBack: () => void;
}

const OnboardingRoleStep = ({ onSelect, onBack }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16 animate-fade-in">
      <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
        ¿Cómo te unes?
      </h2>
      <p className="mt-3 text-sm font-light text-foreground/50">
        Elige el perfil que mejor te describe.
      </p>

      <div className="mt-12 grid w-full gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("dentist")}
          className="group flex flex-col items-start gap-3 border border-foreground/15 p-8 text-left transition-colors hover:border-foreground/50 hover:bg-foreground/5"
        >
          <span className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40">
            Dentista
          </span>
          <span className="text-lg font-light text-foreground">
            Soy dentista y busco técnicos
          </span>
          <span className="text-xs font-light text-foreground/50">
            Encuentra técnicos dentales digitales para tus casos.
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("technician")}
          className="group flex flex-col items-start gap-3 border border-foreground/15 p-8 text-left transition-colors hover:border-foreground/50 hover:bg-foreground/5"
        >
          <span className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40">
            Técnico
          </span>
          <span className="text-lg font-light text-foreground">
            Soy técnico dental
          </span>
          <span className="text-xs font-light text-foreground/50">
            Muestra tu trabajo y conecta con dentistas.
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-12 text-xs font-light tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70"
      >
        Atrás
      </button>
    </div>
  );
};

export default OnboardingRoleStep;
