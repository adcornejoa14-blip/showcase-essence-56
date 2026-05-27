import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

type QuoteItem = {
  service_slug: string;
  service_name: string;
  quantity: number;
  unit_price: number;
};

type Quote = {
  id: string;
  technician_slug: string;
  items: QuoteItem[];
  subtotal: number;
  platform_fee: number;
  total: number;
  status: "pending" | "accepted" | "rejected" | "paid" | "completed";
  notes: string | null;
  created_at: string;
};

const STATUSES: Array<Quote["status"] | "all"> = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "paid",
  "completed",
];

const statusColor: Record<Quote["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  paid: "bg-emerald-100 text-emerald-800",
  completed: "bg-foreground text-background",
};

const MyQuotes = () => {
  const { session, loading } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filter, setFilter] = useState<Quote["status"] | "all">("all");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    document.title = "My quotes";
  }, []);

  useEffect(() => {
    if (!session) return;
    setFetching(true);
    supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setQuotes(data as unknown as Quote[]);
        setFetching(false);
      });
  }, [session]);

  if (!loading && !session) return <Navigate to="/" replace />;

  const filtered = filter === "all" ? quotes : quotes.filter((q) => q.status === filter);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-light text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="mt-6 text-3xl font-light tracking-tight md:text-4xl">My quotes</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs font-light uppercase tracking-wider transition-colors ${
                filter === s
                  ? "border-foreground text-foreground"
                  : "border-border text-foreground/60 hover:border-foreground/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {fetching ? (
            <p className="text-sm font-light text-foreground/50">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm font-light text-foreground/50">No quotes yet.</p>
          ) : (
            filtered.map((q) => (
              <article
                key={q.id}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-light uppercase tracking-[0.15em] text-foreground/50">
                      {new Date(q.created_at).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/technician/${q.technician_slug}`}
                      className="mt-1 inline-block text-lg font-light hover:underline"
                    >
                      {q.technician_slug}
                    </Link>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-light uppercase tracking-wider ${statusColor[q.status]}`}
                  >
                    {q.status}
                  </span>
                </div>

                <ul className="mt-4 space-y-1 text-sm font-light text-foreground/80">
                  {q.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>
                        {it.service_name}{" "}
                        <span className="text-foreground/40">× {it.quantity}</span>
                      </span>
                      <span className="tabular-nums">
                        ${(it.unit_price * it.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-end gap-6 border-t border-border pt-3 text-sm font-light">
                  <div className="text-foreground/60">
                    Subtotal{" "}
                    <span className="tabular-nums text-foreground">
                      ${Number(q.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-foreground/60">
                    Fee{" "}
                    <span className="tabular-nums text-foreground">
                      ${Number(q.platform_fee).toFixed(2)}
                    </span>
                  </div>
                  <div className="font-normal">
                    Total{" "}
                    <span className="tabular-nums">${Number(q.total).toFixed(2)}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default MyQuotes;
