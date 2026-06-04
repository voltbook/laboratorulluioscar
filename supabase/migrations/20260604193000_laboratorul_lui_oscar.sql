create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  short_description text not null,
  technical_description text not null,
  category text not null,
  difficulty text not null check (difficulty in ('Începător', 'Mediu', 'Avansat')),
  estimated_cost_ron integer not null default 0,
  tags text[] not null default '{}',
  assumptions text[] not null default '{}',
  required_tools text[] not null default '{}',
  safety_warnings text[] not null default '{}',
  supplier_suggestions text[] not null default '{}',
  image_url text,
  is_public boolean not null default false,
  source_project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_parts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  quantity numeric not null default 1,
  estimated_price_ron integer not null default 0,
  supplier text,
  product_url text,
  notes text,
  sort_order integer not null default 0
);

create table if not exists public.project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section text not null default 'assembly',
  body text not null,
  sort_order integer not null default 0
);

create table if not exists public.project_code_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  filename text not null,
  language text not null,
  code text not null,
  sort_order integer not null default 0
);

create table if not exists public.project_stars (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_diagrams (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  diagram_type text not null default 'mermaid',
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_models (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  model_type text not null default 'simplified-threejs',
  description text not null,
  source jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.project_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  export_type text not null default 'pdf',
  storage_path text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_parts enable row level security;
alter table public.project_steps enable row level security;
alter table public.project_code_files enable row level security;
alter table public.project_stars enable row level security;
alter table public.project_comments enable row level security;
alter table public.project_diagrams enable row level security;
alter table public.project_models enable row level security;
alter table public.project_exports enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "public or owned projects readable" on public.projects for select using (is_public or owner_id = auth.uid());
create policy "users create own projects" on public.projects for insert with check (owner_id = auth.uid());
create policy "users update own projects" on public.projects for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "users delete own projects" on public.projects for delete using (owner_id = auth.uid());

create policy "parts readable with project" on public.project_parts for select using (exists (select 1 from public.projects p where p.id = project_id and (p.is_public or p.owner_id = auth.uid())));
create policy "parts editable by owner" on public.project_parts for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "steps readable with project" on public.project_steps for select using (exists (select 1 from public.projects p where p.id = project_id and (p.is_public or p.owner_id = auth.uid())));
create policy "steps editable by owner" on public.project_steps for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "code readable with project" on public.project_code_files for select using (exists (select 1 from public.projects p where p.id = project_id and (p.is_public or p.owner_id = auth.uid())));
create policy "code editable by owner" on public.project_code_files for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "diagrams readable with project" on public.project_diagrams for select using (exists (select 1 from public.projects p where p.id = project_id and (p.is_public or p.owner_id = auth.uid())));
create policy "diagrams editable by owner" on public.project_diagrams for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "models readable with project" on public.project_models for select using (exists (select 1 from public.projects p where p.id = project_id and (p.is_public or p.owner_id = auth.uid())));
create policy "models editable by owner" on public.project_models for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "users star public projects" on public.project_stars for insert with check (user_id = auth.uid() and exists (select 1 from public.projects p where p.id = project_id and p.is_public));
create policy "stars readable" on public.project_stars for select using (true);
create policy "users unstar own stars" on public.project_stars for delete using (user_id = auth.uid());

create policy "comments readable on public projects" on public.project_comments for select using (exists (select 1 from public.projects p where p.id = project_id and p.is_public));
create policy "users comment as self" on public.project_comments for insert with check (user_id = auth.uid());
create policy "users delete own comments" on public.project_comments for delete using (user_id = auth.uid());

create policy "exports visible to owner" on public.project_exports for select using (user_id = auth.uid());
create policy "exports created by user" on public.project_exports for insert with check (user_id = auth.uid());

create index if not exists projects_public_created_idx on public.projects (is_public, created_at desc);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists project_parts_project_idx on public.project_parts (project_id);
create index if not exists project_steps_project_idx on public.project_steps (project_id);
create index if not exists project_stars_project_idx on public.project_stars (project_id);

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.projects, public.project_parts, public.project_steps, public.project_code_files, public.project_diagrams, public.project_models, public.project_stars, public.project_comments to anon, authenticated;
grant insert, update, delete on public.profiles, public.projects, public.project_parts, public.project_steps, public.project_code_files, public.project_diagrams, public.project_models, public.project_stars, public.project_comments, public.project_exports to authenticated;

insert into public.projects (title, slug, short_description, technical_description, category, difficulty, estimated_cost_ron, tags, assumptions, required_tools, safety_warnings, supplier_suggestions, image_url, is_public)
values
('Robot Wall-E DIY', 'robot-wall-e-diy', 'Robot educațional cu șasiu printat 3D și senzori ultrasonici.', 'Robot mobil cu ESP32, driver motoare și carcasă inspirată de roboți educaționali.', 'Robotică', 'Avansat', 680, array['ESP32','robot','3D'], array['alimentare 7.4V cu BMS'], array['letcon','multimetru'], array['Folosește BMS pentru baterii litiu.'], array['eMAG','TME','Robofun','OptimusDigital'], '/api/placeholder?title=Robot%20Wall-E%20DIY', true),
('Stație meteo ESP32', 'statie-meteo-esp32', 'Stație meteo Wi-Fi cu BME280 și afișaj OLED.', 'Monitorizare temperatură, umiditate și presiune cu dashboard local.', 'IoT', 'Începător', 245, array['ESP32','meteo'], array['Wi-Fi disponibil'], array['laptop','cabluri'], array['Protejează senzorii de umezeală directă.'], array['Robofun','OptimusDigital','TME'], '/api/placeholder?title=Sta%C8%9Bie%20meteo%20ESP32', true),
('Seră inteligentă', 'sera-inteligenta', 'Automatizare irigații și ventilație pentru seră mică.', 'Control pompă 12V, senzori de sol și praguri configurabile.', 'Automatizări', 'Mediu', 410, array['irigații','ESP32'], array['sursă 12V izolată'], array['clește','multimetru'], array['Nu combina 230V cu zona umedă fără electrician.'], array['Dedeman','Leroy Merlin','Robofun','Mivarom'], '/api/placeholder?title=Ser%C4%83%20inteligent%C4%83', true),
('Mini CNC desktop', 'mini-cnc-desktop', 'CNC mic educațional pentru gravare ușoară.', 'Cadru compact, stepper drivers, endstop-uri și firmware GRBL.', 'Fabricație', 'Avansat', 1450, array['CNC','GRBL'], array['ochelari protecție'], array['chei imbus','multimetru'], array['Poartă ochelari și nu lăsa scula nesupravegheată.'], array['TME','eMAG','Hornbach'], '/api/placeholder?title=Mini%20CNC%20desktop', true),
('Uscător filament 3D', 'uscator-filament-3d', 'Cutie controlată termic pentru filament PLA/PETG.', 'Control temperatură cu senzor DS18B20 și ventilator.', 'Printare 3D', 'Mediu', 320, array['3D print','filament'], array['element PTC joasă tensiune'], array['letcon'], array['Nu folosi încălzitoare improvizate la 230V.'], array['eMAG','Conex Electronic','Mivarom'], '/api/placeholder?title=Usc%C4%83tor%20filament%203D', true),
('Ochelari AR DIY', 'ochelari-ar-diy', 'Wearable cu microdisplay și IMU pentru experimente AR.', 'Prototip optic simplificat cu citire orientare și overlay text.', 'Wearables', 'Avansat', 890, array['AR','wearable'], array['prototip educațional'], array['imprimantă 3D'], array['Nu folosi în trafic sau activități riscante.'], array['TME','eMAG','OptimusDigital'], '/api/placeholder?title=Ochelari%20AR%20DIY', true),
('Robot braț SCARA', 'robot-brat-scara', 'Braț robotic SCARA cu servomotoare și cinematică simplă.', 'Platformă educațională pentru pick-and-place ușor.', 'Robotică', 'Avansat', 1250, array['SCARA','robot'], array['servouri metalice'], array['chei','letcon'], array['Ține degetele departe de articulații în test.'], array['TME','Robofun','OptimusDigital'], '/api/placeholder?title=Robot%20bra%C8%9B%20SCARA', true),
('Dronă educațională', 'drona-educationala', 'Dronă mică pentru învățare control zbor.', 'Cadru ușor, IMU, ESC-uri și limitări software.', 'Educație', 'Avansat', 980, array['dronă','IMU'], array['spațiu legal de test'], array['ochelari protecție'], array['Respectă legislația și testează fără elice la început.'], array['TME','eMAG','Robofun'], '/api/placeholder?title=Dron%C4%83%20educa%C8%9Bional%C4%83', true),
('Sistem solar off-grid mic', 'sistem-solar-off-grid-mic', 'Kit solar mic pentru senzori și iluminat LED.', 'Panou solar, controller încărcare, baterie și monitorizare curent.', 'Energie', 'Mediu', 760, array['solar','off-grid'], array['siguranțe dimensionate'], array['multimetru'], array['Bateriile necesită BMS și protecții la scurtcircuit.'], array['Leroy Merlin','Hornbach','eMAG'], '/api/placeholder?title=Sistem%20solar%20off-grid%20mic', true),
('Companion desktop bot', 'companion-desktop-bot', 'Bot de birou cu OLED, servouri și răspunsuri simple.', 'Dispozitiv expresiv cu animații, microfon și conectivitate Wi-Fi.', 'AI Hardware', 'Mediu', 540, array['bot','AI'], array['OpenAI API opțional'], array['laptop','letcon'], array['Nu înregistra audio fără consimțământ.'], array['Robofun','OptimusDigital','TME'], '/api/placeholder?title=Companion%20desktop%20bot', true),
('Sistem irigații automat', 'sistem-irigatii-automat', 'Irigare automată pentru plante de balcon.', 'ESP32, senzor umiditate sol, pompă peristaltică și rezervor.', 'Grădină', 'Începător', 285, array['irigații','plante'], array['pompă 12V'], array['cutter','multimetru'], array['Ține electronica departe de apă.'], array['Dedeman','Leroy Merlin','Mivarom'], '/api/placeholder?title=Sistem%20iriga%C8%9Bii%20automat', true),
('Smart home energy monitor', 'smart-home-energy-monitor', 'Monitor energie pentru circuite casnice cu clește CT.', 'Măsurare neinvazivă curent și dashboard local.', 'Smart Home', 'Avansat', 620, array['energie','smart home'], array['senzor CT neinvaziv'], array['multimetru'], array['Pentru tabloul electric cere electrician autorizat.'], array['TME','Conex Electronic','eMAG'], '/api/placeholder?title=Smart%20home%20energy%20monitor', true)
on conflict (slug) do nothing;
