export type OperationStatus = 'em_andamento' | 'concluido' | 'pendente';
export type OperationPriority = 'baixa' | 'media' | 'alta';

export interface Organization {
  id: string;
  name: string;
  created_at?: string;
}

export interface Operation {
  id: string;
  org_id: string;
  title: string;
  category: string;
  status: OperationStatus;
  priority: OperationPriority;
  amount: number;
  due_date: string;
  created_at: string;
  organization?: Organization;
}

export interface OperationsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
  orgId?: string;
  sortBy?: 'created_at' | 'due_date' | 'amount' | 'title' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface PaginatedOperations {
  operations: Operation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
  totalAmount: number;
}

export interface MonthlyEvolutionMetric {
  monthKey: string; // e.g. "2025-01"
  month: string; // e.g. "Jan", "Fev"
  amount: number;
  count: number;
  completedCount: number;
}

export interface DashboardMetrics {
  totalOperations: number;
  completedOperations: number;
  inProgressOperations: number;
  pendingOperations: number;
  resolutionRate: number; // percentage, e.g. 72.4
  totalFinancialVolume: number; // sum of amount
  avgOperationValue: number;
  highPriorityCount: number;
  categoryBreakdown: CategoryMetric[];
  monthlyEvolution: MonthlyEvolutionMetric[];
}
