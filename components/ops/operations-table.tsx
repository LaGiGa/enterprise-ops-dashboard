"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Operation, 
  OperationStatus, 
  OperationPriority, 
  PaginatedOperations,
  Organization 
} from "@/lib/types/operations";
import { 
  formatCurrency, 
  formatDate, 
  STATUS_CONFIG, 
  PRIORITY_CONFIG 
} from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  X, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Share2,
  Calendar,
  Building2,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface OperationsTableProps {
  data: PaginatedOperations;
  organizations: Organization[];
  categories: string[];
  isLoading?: boolean;
  onEditOperation: (op: Operation) => void;
  onDeleteOperation: (op: Operation) => void;
}

export function OperationsTable({
  data,
  organizations,
  categories,
  isLoading = false,
  onEditOperation,
  onDeleteOperation,
}: OperationsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Current query params
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "todos";
  const currentPriority = searchParams.get("priority") || "todas";
  const currentCategory = searchParams.get("category") || "todas";
  const currentOrgId = searchParams.get("orgId") || "todas";
  const currentSortBy = searchParams.get("sortBy") || "created_at";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentPageSize = Number(searchParams.get("pageSize")) || 8;

  // Atualiza os Query Params na URL de forma reativa e atômica
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "todos" || value === "todas") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Se a alteração não for especificamente de página, reseta para a página 1
    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Alterna ordenação de coluna
  const handleSort = (column: string) => {
    if (currentSortBy === column) {
      // Alterna ordem
      updateUrlParams({
        sortBy: column,
        sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      updateUrlParams({
        sortBy: column,
        sortOrder: "desc",
      });
    }
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  // Copiar link com filtros aplicados
  const handleShareFilterLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link com filtros e página atual copiado para a área de transferência!");
    }
  };

  const hasActiveFilters = Boolean(
    currentSearch ||
    currentStatus !== "todos" ||
    currentPriority !== "todas" ||
    currentCategory !== "todas" ||
    currentOrgId !== "todas"
  );

  const startRecord = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const endRecord = Math.min(data.page * data.pageSize, data.total);

  const renderSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400 opacity-60" />;
    }
    return currentSortOrder === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-zinc-900" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-zinc-900" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
      {/* Barra de Filtros e Busca */}
      <div className="p-4 border-b border-zinc-200/80 space-y-3 bg-zinc-50/50">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Busca por texto */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar por título, categoria ou organização..."
              value={currentSearch}
              onChange={(e) => updateUrlParams({ search: e.target.value })}
              className="pl-9 h-9 text-xs bg-white border-zinc-200"
            />
            {currentSearch && (
              <button
                onClick={() => updateUrlParams({ search: null })}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filtros em Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <div className="w-[140px]">
              <Select
                value={currentStatus}
                onValueChange={(val) => updateUrlParams({ status: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="w-[140px]">
              <Select
                value={currentPriority}
                onValueChange={(val) => updateUrlParams({ priority: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-white">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className="w-[155px]">
              <Select
                value={currentCategory}
                onValueChange={(val) => updateUrlParams({ category: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Organização */}
            <div className="w-[165px]">
              <Select
                value={currentOrgId}
                onValueChange={(val) => updateUrlParams({ orgId: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-white">
                  <SelectValue placeholder="Organização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Empresas</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Compartilhar URL / Deep Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareFilterLink}
              className="h-9 text-xs bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 gap-1.5"
              title="Copiar link com parâmetros de busca persistidos na URL"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>
        </div>

        {/* Chips de Filtros Ativos & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500 font-medium">Filtros aplicados:</span>
            {currentSearch && (
              <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-zinc-200/80">
                Busca: &ldquo;{currentSearch}&rdquo;
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900" 
                  onClick={() => updateUrlParams({ search: null })}
                />
              </Badge>
            )}
            {currentStatus !== "todos" && (
              <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-zinc-200/80">
                Status: {STATUS_CONFIG[currentStatus as OperationStatus]?.label || currentStatus}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900" 
                  onClick={() => updateUrlParams({ status: null })}
                />
              </Badge>
            )}
            {currentPriority !== "todas" && (
              <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-zinc-200/80">
                Prioridade: {PRIORITY_CONFIG[currentPriority as OperationPriority]?.label || currentPriority}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900" 
                  onClick={() => updateUrlParams({ priority: null })}
                />
              </Badge>
            )}
            {currentCategory !== "todas" && (
              <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-zinc-200/80">
                Categoria: {currentCategory}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900" 
                  onClick={() => updateUrlParams({ category: null })}
                />
              </Badge>
            )}
            {currentOrgId !== "todas" && (
              <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-zinc-200/80">
                Org: {organizations.find((o) => o.id === currentOrgId)?.name || currentOrgId}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-zinc-900" 
                  onClick={() => updateUrlParams({ orgId: null })}
                />
              </Badge>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-red-600 hover:text-red-700 font-medium underline ml-1 cursor-pointer"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Indicador de Transição URL */}
      {isPending && (
        <div className="h-0.5 w-full bg-zinc-100 overflow-hidden">
          <div className="h-full bg-zinc-900 animate-pulse w-full" />
        </div>
      )}

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-600 text-xs font-semibold select-none">
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-zinc-100/80 transition-colors"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Operação / Título</span>
                  {renderSortIcon("title")}
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-zinc-100/80 transition-colors hidden md:table-cell"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Categoria</span>
                  {renderSortIcon("category")}
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-zinc-100/80 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-zinc-100/80 transition-colors hidden sm:table-cell"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Prioridade</span>
                  {renderSortIcon("priority")}
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-zinc-100/80 transition-colors text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Volume (R$)</span>
                  {renderSortIcon("amount")}
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-zinc-100/80 transition-colors hidden lg:table-cell"
                onClick={() => handleSort("due_date")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Vencimento</span>
                  {renderSortIcon("due_date")}
                </div>
              </th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 text-zinc-800">
            {isLoading || isPending ? (
              // Skeletons de linhas de tabela conforme solicitado pelo PRD
              Array.from({ length: currentPageSize }).map((_, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-48 mb-1.5" />
                    <Skeleton className="h-3 w-32" />
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Skeleton className="h-8 w-16 ml-auto rounded" />
                  </td>
                </tr>
              ))
            ) : data.operations.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800">
                      Nenhuma operação encontrada
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">
                      Tente alterar os termos da busca ou redefinir os filtros aplicados.
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs"
                      >
                        Limpar Filtros
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.operations.map((op) => {
                const statusInfo = STATUS_CONFIG[op.status];
                const priorityInfo = PRIORITY_CONFIG[op.priority];

                return (
                  <tr 
                    key={op.id} 
                    className="hover:bg-zinc-50/80 transition-colors group"
                  >
                    {/* Título e Organização */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-900 line-clamp-1">
                        {op.title}
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3 w-3 text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {op.organization?.name || "Organização Corporativa"}
                        </span>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">
                        {op.category}
                      </span>
                    </td>

                    {/* Status com Badge estilizado */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${statusInfo.badgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Prioridade */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${priorityInfo.badgeClass}`}>
                        {priorityInfo.label}
                      </span>
                    </td>

                    {/* Volume Financeiro */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-zinc-900">
                      {formatCurrency(op.amount)}
                    </td>

                    {/* Data de Vencimento */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-zinc-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{formatDate(op.due_date)}</span>
                      </div>
                    </td>

                    {/* Ações CRUD */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditOperation(op)}
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
                          title="Editar Operação"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteOperation(op)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Excluir Operação"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação Server-Side via URLSearchParams */}
      <div className="p-4 border-t border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Info de Registros e Items por página */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
          <div>
            Mostrando <span className="font-semibold text-zinc-900">{startRecord}</span> a{" "}
            <span className="font-semibold text-zinc-900">{endRecord}</span> de{" "}
            <span className="font-semibold text-zinc-900">{data.total}</span> operações
          </div>

          <div className="flex items-center gap-1.5">
            <span>Itens por página:</span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(val) => updateUrlParams({ pageSize: val, page: "1" })}
            >
              <SelectTrigger className="h-7 w-16 text-xs bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões de Navegação de Página */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateUrlParams({ page: "1" })}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 w-8 bg-white border-zinc-200 text-zinc-700 disabled:opacity-40"
            title="Primeira Página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateUrlParams({ page: (currentPage - 1).toString() })}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 w-8 bg-white border-zinc-200 text-zinc-700 disabled:opacity-40"
            title="Página Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Numeração de Páginas */}
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Mostra a primeira, a última e até 1 vizinho da página atual
                return (
                  p === 1 ||
                  p === data.totalPages ||
                  Math.abs(p - currentPage) <= 1
                );
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span className="px-1 text-xs text-zinc-400 select-none">...</span>
                    )}
                    <Button
                      variant={currentPage === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateUrlParams({ page: p.toString() })}
                      className={`h-8 w-8 p-0 text-xs font-medium ${
                        currentPage === p
                          ? "bg-zinc-900 text-white hover:bg-zinc-800"
                          : "bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </Button>
                  </React.Fragment>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateUrlParams({ page: (currentPage + 1).toString() })}
            disabled={currentPage >= data.totalPages || isLoading}
            className="h-8 w-8 bg-white border-zinc-200 text-zinc-700 disabled:opacity-40"
            title="Próxima Página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateUrlParams({ page: data.totalPages.toString() })}
            disabled={currentPage >= data.totalPages || isLoading}
            className="h-8 w-8 bg-white border-zinc-200 text-zinc-700 disabled:opacity-40"
            title="Última Página"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
