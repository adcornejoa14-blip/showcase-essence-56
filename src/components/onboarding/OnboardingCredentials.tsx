import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/noma-logo-final.png";

interface Props {
  onCreated: () => void;
  onBack: () => void;
}

const OnboardingCredentials = ({ onCreated, onBack }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass =
    "w-full border-0 border-b border-foreground/15 bg-transparent px-0 py-2 text-sm font-light text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none";

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    onCreated();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-16 animate-fade-in">
      <img src={logo} alt="NOMA" className="mb-12 w-40 select-none" draggable={false} />

      <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
        Create your account
      </h2>
      <p className="mt-3 text-sm font-light text-foreground/50">
        Last step to access NOMA Digital Studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-12 w-full space-y-8" noValidate>
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@email.com"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="At least 6 characters"
          />
        </div>

        {error && <p className="text-xs font-light text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground disabled:opacity-40"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="mt-10 flex w-full items-center justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default OnboardingCredentials;
