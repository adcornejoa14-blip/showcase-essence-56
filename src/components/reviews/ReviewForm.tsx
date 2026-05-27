import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  technicianSlug: string;
  technicianName?: string;
  onSubmitted?: () => void;
};

const Row = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-sm font-light text-foreground/70">{label}</span>
    <StarRating value={value} onChange={onChange} size={18} />
  </div>
);

const ReviewForm = ({
  open,
  onOpenChange,
  quoteId,
  technicianSlug,
  technicianName,
  onSubmitted,
}: Props) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [quality, setQuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const valid = rating > 0 && quality > 0 && communication > 0 && delivery > 0;

  const handleSubmit = async () => {
    if (!user || !valid) return;
    setSubmitting(true);

    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const fullName =
      (meta.full_name as string) ||
      (meta.name as string) ||
      user.email?.split("@")[0] ||
      "Dentist";
    const parts = fullName.trim().split(/\s+/);
    const dentistName =
      parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];

    const { error } = await supabase.from("reviews").insert({
      quote_id: quoteId,
      technician_slug: technicianSlug,
      dentist_id: user.id,
      dentist_name: dentistName,
      rating,
      quality_rating: quality,
      communication_rating: communication,
      delivery_rating: delivery,
      comment: comment.trim(),
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit review", description: error.message });
      return;
    }
    toast({ title: "Review submitted", description: "Thanks for your feedback." });
    onSubmitted?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">
            Review {technicianName ?? "technician"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-2">
          <p className="text-xs font-light uppercase tracking-[0.15em] text-foreground/50">
            Overall
          </p>
          <div className="mt-2">
            <StarRating value={rating} onChange={setRating} size={32} />
          </div>
        </div>

        <div className="divide-y divide-border border-y border-border">
          <Row label="Quality" value={quality} onChange={setQuality} />
          <Row label="Communication" value={communication} onChange={setCommunication} />
          <Row label="Delivery" value={delivery} onChange={setDelivery} />
        </div>

        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={4}
          className="font-light"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-light text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
