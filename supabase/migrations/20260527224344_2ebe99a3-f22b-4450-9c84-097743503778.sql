
CREATE TYPE public.notification_type AS ENUM (
  'quote_received',
  'quote_accepted',
  'quote_rejected',
  'new_message',
  'order_completed',
  'review_received'
);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type public.notification_type NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Trigger: quote status changes → notify dentist
CREATE OR REPLACE FUNCTION public.notify_quote_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n_type public.notification_type;
  n_title text;
  n_body text;
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'accepted' THEN
    n_type := 'quote_accepted';
    n_title := 'Quote accepted';
    n_body := 'Your technician accepted your request.';
  ELSIF NEW.status = 'rejected' THEN
    n_type := 'quote_rejected';
    n_title := 'Quote rejected';
    n_body := 'Your technician could not accept this quote.';
  ELSIF NEW.status = 'completed' THEN
    n_type := 'order_completed';
    n_title := 'Order completed';
    n_body := 'Your order is complete. Leave a review.';
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (NEW.dentist_id, n_type, n_title, n_body, '/my-quotes');

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_quote_status_change
AFTER UPDATE OF status ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.notify_quote_status_change();

-- Trigger: new message → notify the other participant on the quote
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient uuid;
BEGIN
  SELECT q.dentist_id INTO recipient
  FROM public.quotes q
  WHERE q.id = NEW.quote_id;

  -- Only insert when the recipient is a real user and is not the sender
  IF recipient IS NOT NULL AND recipient <> NEW.sender_id THEN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      recipient,
      'new_message',
      'New message',
      LEFT(COALESCE(NEW.content, ''), 120),
      '/my-quotes'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_message();
