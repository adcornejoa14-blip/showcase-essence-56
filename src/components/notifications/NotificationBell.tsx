import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
};

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  const unreadCount = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setItems((data ?? []) as Notification[]));

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setItems((prev) => [payload.new as Notification, ...prev].slice(0, 10));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleOpenChange = async (next: boolean) => {
    setOpen(next);
    if (next && unreadCount > 0 && user) {
      const ids = items.filter((n) => !n.read).map((n) => n.id);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      await supabase.from("notifications").update({ read: true }).in("id", ids);
    }
  };

  const handleClick = (n: Notification) => {
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-foreground/60 transition-colors hover:text-foreground"
        >
          <Bell strokeWidth={1.25} className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-light uppercase tracking-[0.15em] text-foreground/50">
            Notifications
          </p>
        </div>
        <ul className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm font-light text-foreground/40">
              No notifications yet
            </li>
          ) : (
            items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => handleClick(n)}
                  className="flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted"
                >
                  <span className="text-sm font-light text-foreground">{n.title}</span>
                  {n.body && (
                    <span className="line-clamp-2 text-xs font-light text-foreground/60">
                      {n.body}
                    </span>
                  )}
                  <span className="mt-1 text-[10px] font-light uppercase tracking-wider text-foreground/40">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
