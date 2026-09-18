"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Operation, 
  Organization, 
  PaginatedOperations, 
  DashboardMetrics 
} from "@/lib/types/operations";
import { OpsHeader } from "./ops-header";
import { KpiCards } from "./kpi-cards";
import { AnalyticsCharts } from "./analytics-charts";
import { OperationsTable } from "./operations-table";
import { OperationModal } from "./operation-modal";
import { DeleteDialog } from "./delete-dialog";
import { SchemaModal } from "./schema-modal";
import { resetDemoDataAction } from "@/app/actions/operations";
import { toast } from "sonner";

interface OpsDashboardViewProps {
  initialData: PaginatedOperations;
  metrics: DashboardMetrics;
  organizations: Organization[];
  categories: string[];
}

export function OpsDashboardView({
  initialData,
  metrics,
  organizations,
  categories,
}: OpsDashboardViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [deletingOperation, setDeletingOperation] = useState<Operation | null>(null);
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Refresh server component route
  const handleDataRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Reset demo sample data
  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      const res = await resetDemoDataAction();
      if (res.success) {
        toast.success(res.message);
        handleDataRefresh();
      } else {
        toast.error(res.error || "Erro ao restaurar dados.");
      }
    } catch {
      toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 text-zinc-900 font-sans antialiased">
      {/* 1. Header Corporativo com Status e Ações */}
      <OpsHeader
        totalCount={metrics.totalOperations}
        onOpenCreateModal={() => {
          setEditingOperation(null);
          setCreateModalOpen(true);
        }}
        onOpenSchemaModal={() => setSchemaModalOpen(true)}
        onResetData={handleResetDemoData}
        isResetting={isResetting}
      />

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top 4 KPI Cards */}
        <KpiCards metrics={metrics} isLoading={isPending} />

        {/* 2 Gráficos Analíticos Recharts */}
        <AnalyticsCharts metrics={metrics} isLoading={isPending} />

        {/* Tabela de Dados Server-Side com Filtros e Paginação Real */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Gestão de Operações Corporativas
            </h2>
            <span className="text-xs text-zinc-500">
              Paginação real com LIMIT e OFFSET no banco
            </span>
          </div>

          <OperationsTable
            data={initialData}
            organizations={organizations}
            categories={categories}
            isLoading={isPending}
            onEditOperation={(op) => {
              setEditingOperation(op);
              setCreateModalOpen(true);
            }}
            onDeleteOperation={(op) => {
              setDeletingOperation(op);
            }}
          />
        </div>
      </main>

      {/* Footer do Portfólio */}
      <footer className="mt-auto border-t border-zinc-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800">Enterprise Ops Dashboard</span>
            <span>•</span>
            <span>Projeto do Portfólio Full-Stack</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-600">
            <span>Next.js 15 • React 19 • TypeScript • PostgreSQL • Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Modal / Sheet CRUD (Criar e Editar) com React Hook Form + Zod */}
      <OperationModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditingOperation(null);
        }}
        operationToEdit={editingOperation}
        organizations={organizations}
        categories={categories}
        onSuccess={handleDataRefresh}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteDialog
        operation={deletingOperation}
        open={Boolean(deletingOperation)}
        onOpenChange={(open) => {
          if (!open) setDeletingOperation(null);
        }}
        onSuccess={handleDataRefresh}
      />

      {/* Modal de Arquitetura Técnica, SQL DDL e Prisma Schema */}
      <SchemaModal
        open={schemaModalOpen}
        onOpenChange={setSchemaModalOpen}
      />
    </div>
  );
}
