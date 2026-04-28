import { Check } from "lucide-react";

interface Props {
  onContinue: () => void;
}

const OnboardingSubmitted = ({ onContinue }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-foreground/20">
        <Check strokeWidth={1.25} className="h-7 w-7 text-foreground/70" />
      </div>

      <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
        Solicitud recibida
      </h2>
      <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-foreground/60">
        Gracias por aplicar a NOMA Digital Studio. Revisaremos tu perfil y te contactaremos
        por email cuando seas aceptado.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-12 border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
      >
        Continuar
      </button>
    </div>
  );
};

export default OnboardingSubmitted;
