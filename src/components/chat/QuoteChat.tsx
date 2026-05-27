import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getTechnicianBySlug } from "@/data/technicians";
import { technicians as techniciansList } from "@/data/technicians";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Attachment = { url: string; name: string };

type Message = {
  id: string;
  quote_id: string;
  sender_id: string;
  sender_role: "dentist" | "technician";
  content: string;
  attachments: Attachment[] | null;
  read: boolean;
  created_at: string;
};

type Props = {
  quoteId: string;
  technicianSlug: string;
  onClose?: () => void;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const QuoteChat = ({ quoteId, technicianSlug, onClose }: Props) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const technician = useMemo(() => {
    const profile = getTechnicianBySlug(technicianSlug);
    const image = techniciansList.find((t) => t.slug === technicianSlug)?.image;
    return { profile, image };
  }, [technicianSlug]);

  // Load + subscribe
  useEffect(() => {
    let mounted = true;
    supabase
      .from("messages")
      .select("*")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (mounted && data) setMessages(data as unknown as Message[]);
      });

    const channel = supabase
      .channel(`messages:${quoteId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `quote_id=eq.${quoteId}` },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as Message).id)
              ? prev
              : [...prev, payload.new as Message],
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `quote_id=eq.${quoteId}` },
        (payload) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === (payload.new as Message).id ? (payload.new as Message) : m)),
          );
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [quoteId]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Mark incoming as read
  useEffect(() => {
    if (!user) return;
    const unread = messages.filter((m) => !m.read && m.sender_id !== user.id).map((m) => m.id);
    if (unread.length === 0) return;
    supabase.from("messages").update({ read: true }).in("id", unread).then(() => {});
  }, [messages, user]);

  const send = useCallback(
    async (content: string, attachments: Attachment[] | null = null) => {
      if (!user) return;
      if (!content.trim() && !attachments?.length) return;
      setSending(true);
      const { error } = await supabase.from("messages").insert({
        quote_id: quoteId,
        sender_id: user.id,
        sender_role: "dentist",
        content: content.trim(),
        attachments: attachments as never,
      });
      if (!error) setDraft("");
      setSending(false);
    },
    [quoteId, user],
  );

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${quoteId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("chat-attachments")
      .upload(path, file, { upsert: false });
    if (!upErr) {
      const { data } = supabase.storage.from("chat-attachments").getPublicUrl(path);
      await send("", [{ url: data.publicUrl, name: file.name }]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const techName = technician.profile?.name ?? technicianSlug;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-6">
        <Avatar className="h-10 w-10">
          {technician.image ? <AvatarImage src={technician.image} alt={techName} /> : null}
          <AvatarFallback>{techName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-light">{techName}</p>
          <p className="flex items-center gap-1.5 text-xs font-light text-foreground/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-foreground/60 hover:bg-muted hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {messages.length === 0 ? (
          <p className="text-center text-sm font-light text-foreground/40">
            Start the conversation
          </p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm font-light ${
                        mine
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {m.content && <p className="whitespace-pre-wrap">{m.content}</p>}
                      {m.attachments?.map((a, i) => (
                        <a
                          key={i}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-1 block truncate text-xs underline ${
                            mine ? "text-background/80" : "text-foreground/70"
                          }`}
                        >
                          {a.name}
                        </a>
                      ))}
                    </div>
                    <p
                      className={`mt-1 px-1 text-[10px] font-light text-foreground/40 ${
                        mine ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(m.created_at)}
                      {mine && m.read ? " · Read" : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="flex items-center gap-2 border-t border-border bg-background px-4 py-3 md:px-6"
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-full p-2 text-foreground/60 hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={uploading ? "Uploading…" : "Message"}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm font-light placeholder:text-foreground/40 focus:border-foreground/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || (!draft.trim() && !uploading)}
          className="rounded-full bg-foreground p-2 text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default QuoteChat;
