import { useEffect, useRef, useState } from "react";
import { Upload, X, Camera } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { OnboardingRole } from "./OnboardingRole";

interface Props {
  role: OnboardingRole;
  onSubmit: () => void;
  onBack: () => void;
}

type Errors = Partial<Record<
  "name" | "birthDate" | "email" | "specialty" | "password" | "passwordRepeat" | "profilePhoto" | "workPhotos",
  string
>>;

const calculateAge = (isoDate: string): number => {
  const dob = new Date(isoDate);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};

const OnboardingForm = ({ role, onSubmit, onBack }: Props) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [isDraggingWork, setIsDraggingWork] = useState(false);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);

  const setProfilePhotoWithToast = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    setProfilePhoto(file);
    toast.success("Profile photo added");
  };

  const addWorkPhotos = (files: FileList | File[] | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const images = arr.filter((f) => f.type.startsWith("image/"));
    const rejected = arr.length - images.length;
    if (rejected > 0) {
      toast.error(`${rejected} file${rejected > 1 ? "s" : ""} ignored (only images).`);
    }
    if (images.length === 0) return;
    setWorkPhotos((prev) => {
      const remaining = 10 - prev.length;
      if (remaining <= 0) {
        toast.error("Maximum 10 photos.");
        return prev;
      }
      const toAdd = images.slice(0, remaining);
      if (images.length > remaining) {
        toast.error(`Only ${remaining} more photo${remaining > 1 ? "s" : ""} allowed.`);
      }
      toast.success(`${toAdd.length} photo${toAdd.length > 1 ? "s" : ""} added`);
      return [...prev, ...toAdd];
    });
  };

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

  const specialtyLabel =
    role === "dentist" ? "Dental specialty" : "Technical specialty";
  const specialtyPlaceholder =
    role === "dentist" ? "e.g. Aesthetics, Implantology…" : "e.g. CAD/CAM, Ceramics…";

  const validate = (): boolean => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Enter your full name.";
    if (!birthDate) {
      e.birthDate = "Please enter your date of birth.";
    } else {
      const age = calculateAge(birthDate);
      if (Number.isNaN(age) || age < 18 || age > 99)
        e.birthDate = "You must be over 18.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email.";
    if (specialty.trim().length < 2) e.specialty = "Enter your specialty.";
    if (password.length < 6) e.password = "At least 6 characters.";
    if (password !== passwordRepeat) e.passwordRepeat = "Passwords do not match.";
    if (!profilePhoto) e.profilePhoto = "Upload a profile photo.";
    if (workPhotos.length < 3) e.workPhotos = "Upload at least 3 photos of your work.";
    if (workPhotos.length > 10) e.workPhotos = "Maximum 10 photos.";
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
          {role === "dentist" ? "Dentist" : "Dental Technician"}
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-tight text-foreground md:text-3xl">
          Your application
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Profile photo */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => profileRef.current?.click()}
            className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-dashed border-foreground/30 bg-foreground/5 transition-colors hover:border-foreground/60"
          >
            {profilePreview ? (
              <img src={profilePreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Camera strokeWidth={1.25} className="h-6 w-6 text-foreground/50" />
            )}
          </button>
          <span className="text-xs font-light text-foreground/50">
            {profilePhoto ? "Change profile photo" : "Profile photo"}
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

        {/* Name */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="Your first and last name"
          />
          {errors.name && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Date of birth */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Date of birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            min="1900-01-01"
            className={fieldClass}
          />
          {errors.birthDate && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.birthDate}</p>
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
            placeholder="you@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Specialty */}
        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            {specialtyLabel}
          </label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className={fieldClass}
            placeholder={specialtyPlaceholder}
          />
          {errors.specialty && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.specialty}</p>
          )}
        </div>

        {/* Password */}
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
          {errors.password && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-light tracking-wide text-foreground/50">
            Repeat password
          </label>
          <input
            type="password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            className={fieldClass}
            placeholder="Repeat your password"
          />
          {errors.passwordRepeat && (
            <p className="mt-1 text-xs font-light text-destructive">{errors.passwordRepeat}</p>
          )}
        </div>

        {/* Work photos */}
        <div className="space-y-3 pt-4">
          <div className="flex items-baseline justify-between">
            <label className="text-xs font-light tracking-wide text-foreground/50">
              Photos of your work
            </label>
            <span className="text-[10px] font-light text-foreground/40">
              {workPhotos.length} / 10
            </span>
          </div>

          <button
            type="button"
            onClick={() => worksRef.current?.click()}
            className="block w-full cursor-pointer border border-dashed border-foreground/20 px-4 py-8 text-center transition-colors hover:border-foreground/50 hover:bg-foreground/5"
          >
            <Upload className="mx-auto h-5 w-5 text-foreground/50" />
            <p className="mt-2 text-xs font-light text-foreground/60">
              Click to upload (3 to 10)
            </p>
          </button>
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

          {workPreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {workPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square">
                  <img
                    src={src}
                    alt={`Work ${i + 1}`}
                    className="h-full w-full border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setWorkPhotos((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-foreground"
                    aria-label="Remove photo"
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
            Back
          </button>
          <button
            type="submit"
            className="border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
          >
            Submit application
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
