"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetrics } from "@/lib/types/operations";
import { formatCurrency } from "@/lib/formatters";
import { 
  Briefcase, 
  CheckCircle2, 
  Target, 
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight
} from "lucide-react";

interface KpiCardsProps {
  metrics: DashboardMetrics | null;
  isLoading?: boolean;
}

export function KpiCards({ metrics, isLoading = false }: KpiCardsProps) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-200/80 shadow-xs bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-24 my-2" />
              <Skeleton className="h-3.5 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Operações",
      value: metrics.totalOperations.toString(),
      subtext: `${metrics.inProgressOperations} em andamento · ${metrics.pendingOperations} pendentes`,
      icon: Briefcase,
      iconColor: "text-zinc-700 bg-zinc-100",
      accent: "text-zinc-900",
    },
    {
      title: "Concluídas",
      value: metrics.completedOperations.toString(),
      subtext: `${metrics.totalOperations > 0 ? Math.round((metrics.completedOperations / metrics.totalOperations) * 100) : 0}% de conclusão sobre a base`,
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50 border border-emerald-100",
      accent: "text-emerald-700",
    },
    {
      title: "Taxa de Resolução",
      value: `${metrics.resolutionRate}%`,
      subtext: `${metrics.highPriorityCount} em alta criticidade`,
      icon: Target,
      iconColor: "text-blue-700 bg-blue-50 border border-blue-100",
      accent: "text-blue-700",
      progress: metrics.resolutionRate,
    },
    {
      title: "Volume Financeiro",
      value: formatCurrency(metrics.totalFinancialVolume),
      subtext: `Média: ${formatCurrency(metrics.avgOperationValue)} por operação`,
      icon: DollarSign,
      iconColor: "text-teal-700 bg-teal-50 border border-teal-100",
      accent: "text-teal-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card 
            key={idx} 
            className="border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all duration-150 bg-white"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-1">
                <div className="text-2xl font-bold tracking-tight text-zinc-900">
                  {card.value}
                </div>
                
                {card.progress !== undefined && (
                  <div className="w-full bg-zinc-100 rounded-full h-1.5 my-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center text-xs text-zinc-500 mt-1">
                  <span>{card.subtext}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
