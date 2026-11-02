-- Newsletter subscribers
--
-- Stores explicit marketing opt-ins collected at checkout, on the order
-- confirmation page, and from any future footer signup form.
--
-- The app writes with the service role key, so RLS is enabled with no anon
-- policies. Rows can only be read/written from server routes.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text not null default 'footer'
    check (source in ('checkout', 'order-confirmation', 'footer', 'admin')),
  marketing_consent boolean not null default true,
  consent_text text,
  consent_at timestamptz not null default now(),
  order_reference text,
  unsubscribe_token uuid not null default gen_random_uuid(),
  unsubscribed_at timestamptz,
  resend_contact_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_lowercase check (email = lower(email))
);

comment on table public.newsletter_subscribers is
  'Explicit marketing opt-ins. RLS is enabled with no anon policies; server routes use the service role key.';

comment on column public.newsletter_subscribers.consent_text is
  'The consent wording shown to the subscriber when they opted in.';

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

create index if not exists newsletter_subscribers_active_idx
  on public.newsletter_subscribers (created_at desc)
  where unsubscribed_at is null;

alter table public.newsletter_subscribers enable row level security;

create or replace function public.touch_newsletter_subscriber_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletter_subscribers_touch_updated_at
  on public.newsletter_subscribers;

create trigger newsletter_subscribers_touch_updated_at
before update on public.newsletter_subscribers
for each row execute function public.touch_newsletter_subscriber_updated_at();
