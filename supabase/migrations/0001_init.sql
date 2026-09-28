-- PJ's Premium Transportation — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push`). Safe to re-run.
-- All access goes through the server with the service-role key; RLS is enabled with
-- no policies so the anon/public key cannot read or write anything.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- settings (singleton)
create table if not exists site_settings (
  id                        int primary key default 1 check (id = 1),
  business_name             text not null default 'PJ''s Premium Transportation',
  phone                     text not null default '(940) 277-9099',
  email                     text not null default 'pjspremiumtransportation@gmail.com',
  facebook_url              text not null default 'https://www.facebook.com/profile.php?id=61591566692936',
  service_area              text not null default 'Myra & Cooke County · Gainesville · DFW Metroplex · WinStar',
  availability_status       text not null default 'accepting'
                            check (availability_status in ('accepting','by_appointment','fully_booked')),
  availability_note         text not null default '',
  hours_text                text not null default 'Reservations only. Early-morning airport runs and late-night pickups available by request.',
  reviews_require_approval  boolean not null default false,
  updated_at                timestamptz not null default now()
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------- bookings
create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  status           text not null default 'new' check (status in ('new','confirmed','completed','cancelled')),
  service_type     text not null check (service_type in ('airport','medical','winstar','metroplex','local','hourly','other')),
  pickup_address   text not null,
  dropoff_address  text not null,
  pickup_at        timestamptz not null,
  passengers       int not null default 1 check (passengers between 1 and 6),
  name             text not null,
  phone            text not null,
  email            text,
  notes            text,
  ip_hash          text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists bookings_created_idx on bookings (created_at desc);
create index if not exists bookings_status_idx  on bookings (status);
create index if not exists bookings_ip_idx      on bookings (ip_hash, created_at desc);

-- ---------------------------------------------------------------- reviews
create table if not exists reviews (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  rating        smallint not null check (rating between 1 and 5),
  comment       text not null,
  service_type  text check (service_type in ('airport','medical','winstar','metroplex','local','hourly','other')),
  status        text not null default 'approved' check (status in ('pending','approved','hidden')),
  owner_reply   text,
  ip_hash       text,
  created_at    timestamptz not null default now()
);
create index if not exists reviews_public_idx on reviews (status, created_at desc);
create index if not exists reviews_ip_idx     on reviews (ip_hash, created_at desc);

-- ---------------------------------------------------------------- driver applications (hiring)
create table if not exists driver_applications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text not null,
  email          text,
  license_plate  text not null,
  vehicle        text not null,
  years_driving  int,
  city           text,
  message        text,
  status         text not null default 'new' check (status in ('new','contacted','approved','declined')),
  admin_notes    text,
  ip_hash        text,
  created_at     timestamptz not null default now()
);
create index if not exists driver_applications_created_idx on driver_applications (created_at desc);
create index if not exists driver_applications_ip_idx      on driver_applications (ip_hash, created_at desc);

-- ---------------------------------------------------------------- drivers (approved, can share trips)
create table if not exists drivers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text,
  vehicle        text not null,
  license_plate  text not null,
  pin_hash       text not null,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------- trips (live location sharing sessions)
create table if not exists trips (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  driver_id       uuid not null references drivers (id) on delete cascade,
  booking_id      uuid references bookings (id) on delete set null,
  passenger_name  text,
  status          text not null default 'active' check (status in ('active','ended')),
  consent_at      timestamptz not null default now(),
  started_at      timestamptz not null default now(),
  ended_at        timestamptz
);
create index if not exists trips_driver_active_idx on trips (driver_id, status);
create index if not exists trips_started_idx       on trips (started_at desc);

-- ---------------------------------------------------------------- trip locations (purged 24h after a trip ends)
create table if not exists trip_locations (
  id           bigserial primary key,
  trip_id      uuid not null references trips (id) on delete cascade,
  lat          double precision not null,
  lng          double precision not null,
  accuracy_m   real,
  heading_deg  real,
  speed_mps    real,
  recorded_at  timestamptz not null default now()
);
create index if not exists trip_locations_trip_idx on trip_locations (trip_id, recorded_at desc);

-- ---------------------------------------------------------------- lock everything down (server-only access)
alter table site_settings       enable row level security;
alter table bookings            enable row level security;
alter table reviews             enable row level security;
alter table driver_applications enable row level security;
alter table drivers             enable row level security;
alter table trips               enable row level security;
alter table trip_locations      enable row level security;
