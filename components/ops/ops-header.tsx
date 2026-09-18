"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Plus, 
  Database, 
  RotateCcw, 
  FileCode2,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface OpsHeaderProps {
  onOpenCreateModal: () => void;
  onOpenSchemaModal: () => void;
  onResetData: () => void;
  isResetting: boolean;
  totalCount: number;
}

export function OpsHeader({
  onOpenCreateModal,
  onOpenSchemaModal,
  onResetData,
  isResetting,
  totalCount,
}: OpsHeaderProps) {
  return (
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900">
                Enterprise Ops Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                PostgreSQL Core
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              CRUD relacional, paginação server-side via URL e métricas analíticas Recharts
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSchemaModal}
            className="text-xs h-8 gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            title="Visualizar Schema SQL (Supabase) e Prisma ORM"
          >
            <FileCode2 className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden md:inline">Schema</span> SQL & Prisma
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetData}
            disabled={isResetting}
            className="text-xs h-8 gap-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            title="Restaurar base com dados de exemplo"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Restaurar Amostras</span>
          </Button>

          <Button
            onClick={onOpenCreateModal}
            size="sm"
            className="text-xs h-8 gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs font-medium"
          >
            <Plus className="h-4 w-4" />
            Nova Operação
          </Button>
        </div>
      </div>
    </header>
  );
}
