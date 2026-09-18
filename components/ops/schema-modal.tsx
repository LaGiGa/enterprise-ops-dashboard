"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  FileCode, 
  Copy, 
  Check, 
  Compass, 
  Layers, 
  Search, 
  Sparkles,
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";

interface SchemaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SchemaModal({ open, onOpenChange }: SchemaModalProps) {
  const [activeTab, setActiveTab] = useState<"sql" | "prisma" | "architecture">("sql");
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- PostgreSQL / Supabase Migration
create table if not exists public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Índices otimizados para busca e paginação
create index idx_operations_org_id on public.operations(org_id);
create index idx_operations_status on public.operations(status);
create index idx_operations_category on public.operations(category);
create index idx_operations_created_at on public.operations(created_at desc);
create index idx_operations_status_created_at on public.operations(status, created_at desc);`;

  const prismaCode = `// Prisma Schema (prisma/schema.prisma)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum OperationStatus {
  em_andamento
  concluido
  pendente
}

enum OperationPriority {
  baixa
  media
  alta
}

model Organization {
  id         String      @id @default(uuid()) @db.Uuid
  name       String      @unique
  created_at DateTime    @default(now()) @db.Timestamptz(6)
  operations Operation[]

  @@index([name])
  @@map("organizations")
}

model Operation {
  id           String            @id @default(uuid()) @db.Uuid
  org_id       String            @db.Uuid
  title        String
  category     String
  status       OperationStatus   @default(pendente)
  priority     OperationPriority @default(media)
  amount       Decimal           @db.Decimal(12, 2)
  due_date     DateTime          @db.Date
  created_at   DateTime          @default(now()) @db.Timestamptz(6)

  organization Organization      @relation(fields: [org_id], references: [id], onDelete: Cascade)

  @@index([org_id])
  @@index([status])
  @@index([category])
  @@index([priority])
  @@index([due_date])
  @@index([created_at(sort: Desc)])
  @@index([status, created_at(sort: Desc)])
  @@map("operations")
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Código copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6 bg-white sm:rounded-xl border border-zinc-200 shadow-xl max-h-[88vh] flex flex-col">
        <DialogHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Database className="h-5 w-5 text-zinc-700" />
              Arquitetura de Dados & Engenharia
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500">
            Modelagem relacional corporativa, índices de performance e decisões de arquitetura full-stack.
          </DialogDescription>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-3 pt-1">
            <button
              onClick={() => setActiveTab("sql")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "sql"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              PostgreSQL DDL (Supabase)
            </button>
            <button
              onClick={() => setActiveTab("prisma")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "prisma"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Prisma ORM Schema
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Decisões de Engenharia & URL Params
            </button>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {activeTab === "sql" && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-500">supabase/schema.sql</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(sqlCode)}
                  className="h-7 text-xs gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copiado" : "Copiar SQL"}</span>
                </Button>
              </div>
              <pre className="p-4 bg-zinc-950 text-zinc-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
                {sqlCode}
              </pre>
            </div>
          )}

          {activeTab === "prisma" && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-500">prisma/schema.prisma</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(prismaCode)}
                  className="h-7 text-xs gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copiado" : "Copiar Prisma"}</span>
                </Button>
              </div>
              <pre className="p-4 bg-zinc-950 text-zinc-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
                {prismaCode}
              </pre>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-zinc-700" />
                  1. Paginação e Filtros Persistidos na URL (URLSearchParams)
                </h4>
                <p>
                  Diferente de dashboards amadores que armazenam o estado de paginação apenas no estado do React (`useState`), 
                  esta aplicação sincroniza cada filtro (busca, status, prioridade, categoria, ordenação e página) diretamente nos 
                  <strong> Query Parameters da URL</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-zinc-600">
                  <li><strong>Deep Linking & Compartilhamento:</strong> Permite que gestores compartilhem links exatos com filtros ativos por e-mail ou Slack.</li>
                  <li><strong>Preservação de Histórico:</strong> Usuários podem utilizar os botões de Avançar e Voltar do navegador sem perda do estado de busca.</li>
                  <li><strong>SEO & Server-Side Compatibility:</strong> No Next.js App Router, permite SSR direto com os parâmetros de consulta.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-zinc-700" />
                  2. Queries Otimizadas com LIMIT e OFFSET
                </h4>
                <p>
                  A tabela nunca trafega a base inteira para o cliente. As consultas utilizam cálculo preciso de 
                  <code>LIMIT pageSize OFFSET (page - 1) * pageSize</code>, reduzindo o tráfego de rede e o uso de memória 
                  mesmo em tabelas com centenas de milhares de linhas.
                </p>
                <p>
                  O índice composto <code>idx_operations_status_created_at</code> no PostgreSQL garante que a ordenação e 
                  filtragem mais comum ocorram em <strong>O(log N)</strong> direto nos nós do índice B-Tree, evitando 
                  Seq Scans custosos.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-zinc-700" />
                  3. Mutação Server Actions com revalidatePath
                </h4>
                <p>
                  Todas as operações de criação, edição e exclusão são disparadas via <strong>Next.js Server Actions</strong> com 
                  validação estrita do <strong>Zod</strong>. Ao concluir, <code>revalidatePath(&apos;/&apos;)</code> invalida o cache do 
                  App Router, mantendo a consistência transacional e atualizando métricas e tabela em tempo real sem reload de página.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
