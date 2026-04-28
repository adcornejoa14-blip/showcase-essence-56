import { useEffect, useRef, useState } from "react";
import { Upload, X, Camera } from "lucide-react";
import type { OnboardingRole } from "./OnboardingRole";

interface Props {
  role: OnboardingRole;
  onSubmit: () => void;
  onBack: () => void;
}

type Errors = Partial<Record<
  "nombre" | "edad" | "email" | "especialidad" | "password" | "passwordRepeat" | "profilePhoto" | "workPhotos",
  string
>>;

const OnboardingForm = ({ role, onSubmit, onBack }: Props) => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  const profileRef = useRef<HTMLInputElement>(null);
  const worksRef = useRef<HTMLInputElement>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [workPreviews, setWorkPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!profilePhoto) {
      setProfilePreview(null);
      return;
    }
    const url = URL.createObjectURL(profilePhoto);
    setProfilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  useEffect(() => {
    const urls = workPhotos.map((f) => URL.createObjectURL(f));
    setWorkPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [workPhotos]);

  const especialidadLabel =
    role === "dentist" ? "Especialidad odontológica" : "Especialidad técnica";
  const especialidadPlaceholder =
    role === "dentist" ? "Ej. Estética, Implantología…" : "Ej. CAD/CAM, Cerámica…";

  const validate = (): boolean => {
    const e: Errors = {};
    if (nombre.trim().length < 2) e.nombre = "Introduce tu nombre completo.";
    const edadNum = Number(edad);
    if (!edad || Number.isNaN(edadNum) || edadNum < 18 || edadNum > 99)
      e.edad = "Edad entre 18 y 99.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email no válido.";
    if (especialidad.trim().length < 2) e.especialidad = "Indica tu especialidad.";
    if (password.length < 6) e.password = "Mínimo 6 caracteres.";
    if (password !== passwordRepeat) e.passwordRepeat = "Las contraseñas no coinciden.";
    if (!profilePhoto) e.profilePhoto = "Sube una foto de perfil.";
    if (workPhotos.length < 3) e.workPhotos = "Sube al menos 3 fotos de tu trabajo.";
    if (workPhotos.length > 10) e.workPhotos = "Máximo 10 fotos.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onSubmit();
  };

  const fieldClass =
    "w-full border-0 border-b border-foreground/15 bg-transparent px-0 py-2 text-sm font-light text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-16 animate-fade-in">
      <div className="mb-10">
        <p className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40">
          {role === "dentist" ? "Dentista" : "Técnico dental"}
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-tight text-foreground md:text-3xl">
          Tu solicitud
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Foto de perfil */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => profileRef.current?.click()}
            className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-dashed border-foreground/30 bg-foreground/5 transition-colors hover:border-foreground/60"
          >
            {profilePreview ? (
              <img src={profilePreview} alt="Perfil" className="h-full w-full object-cover" />
            ) : (
              <Camera strokeWidth={1.25} className="h-6 w-6 text-foreground/50" />
            )}
          </button>
          <span className="text-xs font-light text-foreground/50">
            {profilePhoto ? "Cambiar foto de perfil" : "Foto de perfil"}
          </span>
          <input
            ref={profileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setProfilePhoto(f);
              e.target.value = "";
            }}
          />
          {errors.profilePhoto && (
            <p className="text-xs font-light text-destructive">{errors.profilePhoto}</p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Nombre completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={fieldClass}
            placeholder="Tu nombre y apellidos"
          />
          {errors.nombre && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.nombre}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">Edad</label>
          <input
            type="number"
            min={18}
            max={99}
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className={fieldClass}
            placeholder="28"
          />
          {errors.edad && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.edad}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Especialidad */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            {especialidadLabel}
          </label>
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className={fieldClass}
            placeholder={especialidadPlaceholder}
          />
          {errors.especialidad && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.especialidad}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Repetir contraseña
          </label>
          <input
            type="password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            className={fieldClass}
            placeholder="Repite tu contraseña"
          />
          {errors.passwordRepeat && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.passwordRepeat}</p>
          )}
        </div>

        {/* Trabajos */}
        <div className="space-y-3 pt-4">
          <div className="flex items-baseline justify-between">
            <label className="text-xs font-light tracking-wide text-foreground/50">
              Fotos de tus trabajos
            </label>
            <span className="text-[10px] font-light text-foreground/40">
              {workPhotos.length} / 10
            </span>
          </div>

          <div
            onClick={() => worksRef.current?.click()}
            className="cursor-pointer border border-dashed border-foreground/20 px-4 py-8 text-center transition-colors hover:border-foreground/50 hover:bg-foreground/5"
          >
            <Upload className="mx-auto h-5 w-5 text-foreground/50" />
            <p className="mt-2 text-xs font-light text-foreground/60">
              Arrastra o haz clic para subir (3 a 10)
            </p>
            <input
              ref={worksRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const list = e.target.files;
                if (list) {
                  setWorkPhotos((prev) => [...prev, ...Array.from(list)].slice(0, 10));
                }
                e.target.value = "";
              }}
            />
          </div>

          {workPreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {workPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square">
                  <img
                    src={src}
                    alt={`Trabajo ${i + 1}`}
                    className="h-full w-full border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setWorkPhotos((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-foreground"
                    aria-label="Quitar foto"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.workPhotos && (
            <p className="text-xs font-light text-destructive">{errors.workPhotos}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
          >
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
