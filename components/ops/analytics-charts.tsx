"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetrics } from "@/lib/types/operations";
import { formatCurrency } from "@/lib/formatters";
import { BarChart3, TrendingUp } from "lucide-react";

interface AnalyticsChartsProps {
  metrics: DashboardMetrics | null;
  isLoading?: boolean;
}

// Tooltips customizados declarados no nível do módulo (evita recreação a cada render)
function CustomCategoryTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 text-white text-xs p-3 rounded-lg shadow-xl border border-zinc-800">
        <p className="font-semibold text-zinc-200 mb-1">{label}</p>
        <div className="space-y-1">
          <p className="flex justify-between gap-4 text-emerald-400 font-mono">
            <span>Volume Total:</span>
            <span>{formatCurrency(data.totalAmount)}</span>
          </p>
          <p className="flex justify-between gap-4 text-zinc-300">
            <span>Operações:</span>
            <span>{data.count} {data.count === 1 ? 'item' : 'itens'}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function CustomMonthlyTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 text-white text-xs p-3 rounded-lg shadow-xl border border-zinc-800">
        <p className="font-semibold text-zinc-200 mb-1">{data.month}</p>
        <div className="space-y-1">
          <p className="flex justify-between gap-4 text-emerald-400 font-mono">
            <span>Volume Financeiro:</span>
            <span>{formatCurrency(data.amount)}</span>
          </p>
          <p className="flex justify-between gap-4 text-blue-400">
            <span>Total de Operações:</span>
            <span>{data.count} ({data.completedCount} concluídas)</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function AnalyticsCharts({ metrics, isLoading = false }: AnalyticsChartsProps) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border-zinc-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Gráfico 1: Barras por Categoria */}
      <Card className="border-zinc-200/80 shadow-xs bg-white">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-zinc-600" />
              Volume e Distribuição por Categoria
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 mt-1">
              Alocação financeira e densidade operacional agrupadas por área de negócio
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[280px] w-full">
            {metrics.categoryBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                Nenhum dado disponível para as categorias selecionadas.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.categoryBreakdown}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                    height={35}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                    width={65}
                  />
                  <Tooltip content={<CustomCategoryTooltip />} />
                  <Bar
                    dataKey="totalAmount"
                    fill="#18181b"
                    radius={[4, 4, 0, 0]}
                    name="Volume Financeiro (R$)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico 2: Linha / Área de Evolução Mensal */}
      <Card className="border-zinc-200/80 shadow-xs bg-white">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-zinc-600" />
              Evolução Mensal de Operações
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 mt-1">
              Curva temporal de novos compromissos e execução ao longo dos meses
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[280px] w-full">
            {metrics.monthlyEvolution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                Nenhum dado temporal disponível.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.monthlyEvolution}
                  margin={{ top: 10, right: 15, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                    width={65}
                  />
                  <Tooltip content={<CustomMonthlyTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    name="Volume (R$)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
