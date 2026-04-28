import { useState } from "react";
import logo from "@/assets/noma-logo-final.png";

interface Props {
  onLogin: () => void;
  onBack: () => void;
  onCreateAccount: () => void;
}

const LoginScreen = ({ onLogin, onBack, onCreateAccount }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fieldClass =
    "w-full border-0 border-b border-foreground/15 bg-transparent px-0 py-2 text-sm font-light text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none";

  const VALID_USERS: { email: string; password: string }[] = [
    { email: "santiagoguerragoes@gmail.com", password: "Goes2002" },
  ];

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email no válido.");
      return;
    }
    const match = VALID_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    setError(null);
    onLogin();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-16 animate-fade-in">
      <img src={logo} alt="NOMA" className="mb-12 w-40 select-none" draggable={false} />

      <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
        Iniciar sesión
      </h2>
      <p className="mt-3 text-sm font-light text-foreground/50">
        Accede con tu cuenta de NOMA Digital Studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-12 w-full space-y-8" noValidate>
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="tu@email.com"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="Tu contraseña"
          />
        </div>

        {error && <p className="text-xs font-light text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
        >
          Entrar
        </button>
      </form>

      <div className="mt-10 flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={onCreateAccount}
          className="text-xs font-light tracking-wide text-foreground/40 hover:text-foreground/70"
        >
          ¿No tienes cuenta? <span className="underline">Crear cuenta</span>
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
