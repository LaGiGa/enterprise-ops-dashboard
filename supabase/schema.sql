-- ==========================================================
-- PROJETO 03: Enterprise Ops Dashboard (Full Stack Core)
-- Database Migration Script (PostgreSQL / Supabase / Prisma)
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================================
-- 1. ORGANIZATIONS TABLE
-- ==========================================================
create table if not exists public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for organization lookup
create index if not exists idx_organizations_name on public.organizations(name);

-- ==========================================================
-- 2. OPERATIONS TABLE
-- ==========================================================
-- Status enum check: 'em_andamento' | 'concluido' | 'pendente'
-- Priority enum check: 'baixa' | 'media' | 'alta'
create table if not exists public.operations (
  id uuid default gen_random_uuid() primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null,
  status text not null check (status in ('em_andamento', 'concluido', 'pendente')) default 'pendente',
  priority text not null check (priority in ('baixa', 'media', 'alta')) default 'media',
  amount numeric(12, 2) not null check (amount >= 0),
  due_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 3. OPTIMIZED INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==========================================================
-- Foreign key index for relational joins with organizations
create index if not exists idx_operations_org_id on public.operations(org_id);

-- Filter indexes for Status and Category lookups
create index if not exists idx_operations_status on public.operations(status);
create index if not exists idx_operations_category on public.operations(category);
create index if not exists idx_operations_priority on public.operations(priority);

-- Temporal and sorting indexes for due_date and created_at
create index if not exists idx_operations_due_date on public.operations(due_date);
create index if not exists idx_operations_created_at on public.operations(created_at desc);

-- Composite index for fast dashboard filtering by status + pagination
create index if not exists idx_operations_status_created_at on public.operations(status, created_at desc);

-- ==========================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================================
alter table public.organizations enable row level security;
alter table public.operations enable row level security;

-- Permite operações de leitura no dashboard corporativo
create policy "Allow public read organizations"
  on public.organizations for select using (true);

create policy "Allow public insert organizations"
  on public.organizations for insert with check (true);

create policy "Allow public read operations"
  on public.operations for select using (true);

create policy "Allow public insert operations"
  on public.operations for insert with check (true);

create policy "Allow public update operations"
  on public.operations for update using (true);

create policy "Allow public delete operations"
  on public.operations for delete using (true);

-- ==========================================================
-- 5. INITIAL SEED DATA
-- ==========================================================
insert into public.organizations (id, name) values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TechCorp Global Brasil'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'LogiFlow Logística Inteligente'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Fintech Nova Pagamentos'),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Varejo Prime Distribuidora'),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'NeoEnergy Renováveis')
on conflict (id) do update set name = excluded.name;

insert into public.operations (id, org_id, title, category, status, priority, amount, due_date, created_at) values
  ('11111111-aaaa-4111-8111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Migração de Cluster Kubernetes Multi-Cloud', 'Infraestrutura TI', 'concluido', 'alta', 78450.00, '2025-03-20', '2025-01-15 10:00:00+00'),
  ('22222222-bbbb-4222-8222-222222222222', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Otimização de Roteirização de Frotas Sudeste', 'Logística & Frotas', 'concluido', 'media', 42300.00, '2025-03-25', '2025-01-28 14:30:00+00'),
  ('33333333-cccc-4333-8333-333333333333', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Auditoria Regulatória de Pagamentos BACEN', 'Compliance & Jurídico', 'concluido', 'alta', 125000.00, '2025-04-05', '2025-02-02 09:15:00+00'),
  ('44444444-dddd-4444-8444-444444444444', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Rollout de PDV Cloud em 45 Unidades de Varejo', 'Operações Comerciais', 'em_andamento', 'alta', 94200.00, '2025-04-30', '2025-02-12 11:45:00+00'),
  ('55555555-eeee-4555-8555-555555555555', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Instalação de Telemetria IoT em Usina Solar', 'Engenharia & IoT', 'em_andamento', 'media', 158900.00, '2025-05-15', '2025-02-20 16:20:00+00'),
  ('66666666-ffff-4666-8666-666666666666', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Renovação de Licenciamento Enterprise Datadog', 'Infraestrutura TI', 'concluido', 'baixa', 31500.00, '2025-03-10', '2025-02-24 13:10:00+00'),
  ('77777777-aaaa-4777-8777-777777777777', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Homologação de Novos Fornecedores de Last-Mile', 'Logística & Frotas', 'pendente', 'media', 28700.00, '2025-05-02', '2025-03-01 08:30:00+00'),
  ('88888888-bbbb-4888-8888-888888888888', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Implementação de Gateway Antifraude Biométrica', 'Segurança da Informação', 'em_andamento', 'alta', 112000.00, '2025-05-20', '2025-03-05 15:40:00+00'),
  ('99999999-cccc-4999-8999-999999999999', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Inventário Geral Automatizado por RFID', 'Operações Comerciais', 'pendente', 'baixa', 19400.00, '2025-05-28', '2025-03-08 17:00:00+00'),
  ('aaaaaaaa-dddd-4aaa-8aaa-aaaaaaaaaaaa', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Manutenção Preventiva Preditiva de Turbinas', 'Engenharia & IoT', 'concluido', 'alta', 67800.00, '2025-03-18', '2025-03-10 10:20:00+00'),
  ('bbbbbbbb-eeee-4bbb-8bbb-bbbbbbbbbbbb', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Adequação Arquitetural à LGPD / SOC 2 Type II', 'Compliance & Jurídico', 'em_andamento', 'alta', 88500.00, '2025-06-10', '2025-03-12 11:00:00+00'),
  ('cccccccc-ffff-4ccc-8ccc-cccccccccccc', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Implantação de Hub Logístico em Cajamar', 'Logística & Frotas', 'pendente', 'alta', 230000.00, '2025-06-30', '2025-03-14 14:15:00+00')
on conflict (id) do nothing;
