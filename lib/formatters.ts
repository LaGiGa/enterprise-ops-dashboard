import { OperationPriority, OperationStatus } from "./types/operations";

export function formatCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("pt-BR");
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export const STATUS_CONFIG: Record<
  OperationStatus,
  {
    label: string;
    variant: "success" | "warning" | "secondary" | "default" | "outline";
    badgeClass: string;
    dotClass: string;
  }
> = {
  em_andamento: {
    label: "Em Andamento",
    variant: "warning",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80 font-medium",
    dotClass: "bg-amber-500 animate-pulse",
  },
  concluido: {
    label: "Concluído",
    variant: "success",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium",
    dotClass: "bg-emerald-600",
  },
  pendente: {
    label: "Pendente",
    variant: "secondary",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200 font-medium",
    dotClass: "bg-zinc-400",
  },
};

export const PRIORITY_CONFIG: Record<
  OperationPriority,
  {
    label: string;
    badgeClass: string;
  }
> = {
  alta: {
    label: "Alta",
    badgeClass: "bg-red-50 text-red-700 border-red-200 font-medium",
  },
  media: {
    label: "Média",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 font-medium",
  },
  baixa: {
    label: "Baixa",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 font-medium",
  },
};
