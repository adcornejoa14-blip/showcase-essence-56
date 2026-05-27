import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "./StarRating";

type Review = {
  id: string;
  rating: number;
  quality_rating: number;
  communication_rating: number;
  delivery_rating: number;
  comment: string;
  dentist_name: string;
  created_at: string;
};

type Ratings = {
  avg_rating: number;
  avg_quality: number;
  avg_communication: number;
  avg_delivery: number;
  review_count: number;
};

type Props = { slug: string };

const Bar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between text-xs font-light text-foreground/70">
      <span>{label}</span>
      <span className="tabular-nums">{value.toFixed(1)}</span>
    </div>
    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full bg-foreground"
        style={{ width: `${(Math.max(0, Math.min(5, value)) / 5) * 100}%` }}
      />
    </div>
  </div>
);

const TechnicianReviews = ({ slug }: Props) => {
  const [ratings, setRatings] = useState<Ratings | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    supabase
      .from("technician_ratings")
      .select("*")
      .eq("technician_slug", slug)
      .maybeSingle()
      .then(({ data }) => setRatings(data as unknown as Ratings | null));

    supabase
      .from("reviews")
      .select("id,rating,quality_rating,communication_rating,delivery_rating,comment,dentist_name,created_at")
      .eq("technician_slug", slug)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data ?? []) as Review[]));
  }, [slug]);

  if (!ratings || ratings.review_count === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, 5);

  return (
    <section aria-label="Reviews" className="mx-auto mt-16 max-w-3xl px-4 md:px-6">
      <h2 className="text-xs font-light uppercase tracking-[0.2em] text-foreground/50">Reviews</h2>

      <div className="mt-6 grid gap-8 border-b border-border pb-8 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-6xl font-light tabular-nums">
            {Number(ratings.avg_rating).toFixed(1)}
          </p>
          <StarRating value={Number(ratings.avg_rating)} size={20} readOnly className="mt-2" />
          <p className="mt-2 text-sm font-light text-foreground/60">
            {ratings.review_count} {ratings.review_count === 1 ? "review" : "reviews"}
          </p>
        </div>
        <div className="space-y-3">
          <Bar label="Quality" value={Number(ratings.avg_quality)} />
          <Bar label="Communication" value={Number(ratings.avg_communication)} />
          <Bar label="Delivery" value={Number(ratings.avg_delivery)} />
        </div>
      </div>

      <ul className="mt-6 space-y-6">
        {visible.map((r) => (
          <li key={r.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-light">{r.dentist_name || "Dentist"}</p>
              <p className="text-xs font-light text-foreground/50">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
            <StarRating value={r.rating} size={14} readOnly className="mt-1" />
            {r.comment && (
              <p className="mt-2 text-sm font-light text-foreground/80">{r.comment}</p>
            )}
          </li>
        ))}
      </ul>

      {reviews.length > 5 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm font-light text-foreground/70 underline hover:text-foreground"
        >
          View all reviews
        </button>
      )}
    </section>
  );
};

export default TechnicianReviews;
