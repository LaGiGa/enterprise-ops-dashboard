import { 
  Operation, 
  Organization, 
  OperationsQueryParams, 
  PaginatedOperations, 
  DashboardMetrics, 
  CategoryMetric, 
  MonthlyEvolutionMetric 
} from "@/lib/types/operations";
import { OperationFormData } from "@/lib/validations/operation";
import { getServerSupabase } from "@/lib/supabase/server";

// Default Organizations Seed
export const DEFAULT_ORGANIZATIONS: Organization[] = [
  { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'TechCorp Global Brasil', created_at: '2025-01-01T00:00:00Z' },
  { id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', name: 'LogiFlow Logística Inteligente', created_at: '2025-01-01T00:00:00Z' },
  { id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', name: 'Fintech Nova Pagamentos', created_at: '2025-01-01T00:00:00Z' },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', name: 'Varejo Prime Distribuidora', created_at: '2025-01-01T00:00:00Z' },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', name: 'NeoEnergy Renováveis', created_at: '2025-01-01T00:00:00Z' },
];

// Default Initial Operations Seed (14 operations with diverse categories, statuses and dates)
export const DEFAULT_OPERATIONS: Operation[] = [
  {
    id: '11111111-aaaa-4111-8111-111111111111',
    org_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Migração de Cluster Kubernetes Multi-Cloud',
    category: 'Infraestrutura TI',
    status: 'concluido',
    priority: 'alta',
    amount: 78450.00,
    due_date: '2025-03-20',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '22222222-bbbb-4222-8222-222222222222',
    org_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'Otimização de Roteirização de Frotas Sudeste',
    category: 'Logística & Frotas',
    status: 'concluido',
    priority: 'media',
    amount: 42300.00,
    due_date: '2025-03-25',
    created_at: '2025-01-28T14:30:00Z',
  },
  {
    id: '33333333-cccc-4333-8333-333333333333',
    org_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'Auditoria Regulatória de Pagamentos BACEN',
    category: 'Compliance & Jurídico',
    status: 'concluido',
    priority: 'alta',
    amount: 125000.00,
    due_date: '2025-04-05',
    created_at: '2025-02-02T09:15:00Z',
  },
  {
    id: '44444444-dddd-4444-8444-444444444444',
    org_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    title: 'Rollout de PDV Cloud em 45 Unidades de Varejo',
    category: 'Operações Comerciais',
    status: 'em_andamento',
    priority: 'alta',
    amount: 94200.00,
    due_date: '2025-04-30',
    created_at: '2025-02-12T11:45:00Z',
  },
  {
    id: '55555555-eeee-4555-8555-555555555555',
    org_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    title: 'Instalação de Telemetria IoT em Usina Solar',
    category: 'Engenharia & IoT',
    status: 'em_andamento',
    priority: 'media',
    amount: 158900.00,
    due_date: '2025-05-15',
    created_at: '2025-02-20T16:20:00Z',
  },
  {
    id: '66666666-ffff-4666-8666-666666666666',
    org_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Renovação de Licenciamento Enterprise Datadog',
    category: 'Infraestrutura TI',
    status: 'concluido',
    priority: 'baixa',
    amount: 31500.00,
    due_date: '2025-03-10',
    created_at: '2025-02-24T13:10:00Z',
  },
  {
    id: '77777777-aaaa-4777-8777-777777777777',
    org_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'Homologação de Novos Fornecedores de Last-Mile',
    category: 'Logística & Frotas',
    status: 'pendente',
    priority: 'media',
    amount: 28700.00,
    due_date: '2025-05-02',
    created_at: '2025-03-01T08:30:00Z',
  },
  {
    id: '88888888-bbbb-4888-8888-888888888888',
    org_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'Implementação de Gateway Antifraude Biométrica',
    category: 'Segurança da Informação',
    status: 'em_andamento',
    priority: 'alta',
    amount: 112000.00,
    due_date: '2025-05-20',
    created_at: '2025-03-05T15:40:00Z',
  },
  {
    id: '99999999-cccc-4999-8999-999999999999',
    org_id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    title: 'Inventário Geral Automatizado por RFID',
    category: 'Operações Comerciais',
    status: 'pendente',
    priority: 'baixa',
    amount: 19400.00,
    due_date: '2025-05-28',
    created_at: '2025-03-08T17:00:00Z',
  },
  {
    id: 'aaaaaaaa-dddd-4aaa-8aaa-aaaaaaaaaaaa',
    org_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    title: 'Manutenção Preventiva Preditiva de Turbinas',
    category: 'Engenharia & IoT',
    status: 'concluido',
    priority: 'alta',
    amount: 67800.00,
    due_date: '2025-03-18',
    created_at: '2025-03-10T10:20:00Z',
  },
  {
    id: 'bbbbbbbb-eeee-4bbb-8bbb-bbbbbbbbbbbb',
    org_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Adequação Arquitetural à LGPD / SOC 2 Type II',
    category: 'Compliance & Jurídico',
    status: 'em_andamento',
    priority: 'alta',
    amount: 88500.00,
    due_date: '2025-06-10',
    created_at: '2025-03-12T11:00:00Z',
  },
  {
    id: 'cccccccc-ffff-4ccc-8ccc-cccccccccccc',
    org_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'Implantação de Hub Logístico em Cajamar',
    category: 'Logística & Frotas',
    status: 'pendente',
    priority: 'alta',
    amount: 230000.00,
    due_date: '2025-06-30',
    created_at: '2025-03-14T14:15:00Z',
  },
  {
    id: 'dddddddd-aaaa-4ddd-8ddd-dddddddddddd',
    org_id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'Integração de Pix Automático e Boleto Híbrido',
    category: 'Operações Comerciais',
    status: 'concluido',
    priority: 'media',
    amount: 54000.00,
    due_date: '2025-03-15',
    created_at: '2025-03-02T16:00:00Z',
  },
  {
    id: 'eeeeeeee-bbbb-4eee-8eee-eeeeeeeeeeee',
    org_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Upgrade de Firewall e Proteção DDoS Cloudflare',
    category: 'Segurança da Informação',
    status: 'concluido',
    priority: 'alta',
    amount: 47600.00,
    due_date: '2025-03-22',
    created_at: '2025-02-18T08:00:00Z',
  }
];

// In-memory memory store state with global caching for Node.js lifecycle
declare global {
  var __globalOperationsStore: {
    organizations: Organization[];
    operations: Operation[];
  } | undefined;
}

function getGlobalStore() {
  if (!globalThis.__globalOperationsStore) {
    globalThis.__globalOperationsStore = {
      organizations: [...DEFAULT_ORGANIZATIONS],
      operations: [...DEFAULT_OPERATIONS],
    };
  }
  return globalThis.__globalOperationsStore;
}

export class OperationsService {
  /**
   * Retorna todas as organizações cadastradas para vínculos relacionais
   */
  static async getOrganizations(): Promise<Organization[]> {
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) {
          return data as Organization[];
        }
      } catch (err) {
        console.warn('Supabase getOrganizations fallback to memory:', err);
      }
    }
    const store = getGlobalStore();
    return [...store.organizations];
  }

  /**
   * Busca paginada com ordenação, filtros complexos e LIMIT/OFFSET
   */
  static async getOperations(params: OperationsQueryParams = {}): Promise<PaginatedOperations> {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(params.pageSize) || 8));
    const search = params.search?.trim().toLowerCase() || '';
    const status = params.status && params.status !== 'todos' ? params.status : undefined;
    const category = params.category && params.category !== 'todas' ? params.category : undefined;
    const priority = params.priority && params.priority !== 'todas' ? params.priority : undefined;
    const orgId = params.orgId && params.orgId !== 'todas' ? params.orgId : undefined;
    const sortBy = params.sortBy || 'created_at';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
    const startDate = params.startDate || undefined;
    const endDate = params.endDate || undefined;

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        let query = supabase
          .from('operations')
          .select('*, organization:organizations(*)', { count: 'exact' });

        if (status) query = query.eq('status', status);
        if (category) query = query.eq('category', category);
        if (priority) query = query.eq('priority', priority);
        if (orgId) query = query.eq('org_id', orgId);
        if (startDate) query = query.gte('due_date', startDate);
        if (endDate) query = query.lte('due_date', endDate);
        if (search) {
          query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
        }

        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Real LIMIT & OFFSET in PostgreSQL
        const offset = (page - 1) * pageSize;
        query = query.range(offset, offset + pageSize - 1);

        const { data, count, error } = await query;
        if (!error && data !== null && count !== null) {
          return {
            operations: data as Operation[],
            total: count,
            page,
            pageSize,
            totalPages: Math.ceil(count / pageSize) || 1,
          };
        }
      } catch (err) {
        console.warn('Supabase getOperations fallback to relational engine:', err);
      }
    }

    // Engine Relacional Local (In-memory com ordenação, joins e paginação real)
    const store = getGlobalStore();
    const orgMap = new Map(store.organizations.map((org) => [org.id, org]));

    let filtered = store.operations.map((op) => ({
      ...op,
      organization: orgMap.get(op.org_id),
    }));

    if (status) {
      filtered = filtered.filter((op) => op.status === status);
    }
    if (category) {
      filtered = filtered.filter((op) => op.category.toLowerCase() === category.toLowerCase());
    }
    if (priority) {
      filtered = filtered.filter((op) => op.priority === priority);
    }
    if (orgId) {
      filtered = filtered.filter((op) => op.org_id === orgId);
    }
    if (startDate) {
      filtered = filtered.filter((op) => op.due_date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((op) => op.due_date <= endDate);
    }
    if (search) {
      filtered = filtered.filter((op) =>
        op.title.toLowerCase().includes(search) ||
        op.category.toLowerCase().includes(search) ||
        (op.organization?.name || '').toLowerCase().includes(search)
      );
    }

    // Dynamic Column Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'due_date') {
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (sortBy === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === 'priority') {
        const priorityWeight = { alta: 3, media: 2, baixa: 1 };
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(offset, offset + pageSize);

    return {
      operations: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Calcula as 4 métricas analíticas e datasets dos 2 gráficos Recharts
   */
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = getServerSupabase();
    let allOps: Operation[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase.from('operations').select('*');
        if (!error && data) {
          allOps = data as Operation[];
        }
      } catch (err) {
        console.warn('Supabase getDashboardMetrics fallback to memory:', err);
      }
    }

    if (allOps.length === 0) {
      const store = getGlobalStore();
      allOps = store.operations;
    }

    const totalOperations = allOps.length;
    const completedOperations = allOps.filter((op) => op.status === 'concluido').length;
    const inProgressOperations = allOps.filter((op) => op.status === 'em_andamento').length;
    const pendingOperations = allOps.filter((op) => op.status === 'pendente').length;
    const resolutionRate = totalOperations > 0 
      ? Number(((completedOperations / totalOperations) * 100).toFixed(1)) 
      : 0;
    const totalFinancialVolume = allOps.reduce((acc, op) => acc + Number(op.amount || 0), 0);
    const avgOperationValue = totalOperations > 0 
      ? totalFinancialVolume / totalOperations 
      : 0;
    const highPriorityCount = allOps.filter((op) => op.priority === 'alta').length;

    // Gráfico 1: Barras por Categoria (Volume financeiro e quantidade)
    const categoryMap = new Map<string, { count: number; totalAmount: number }>();
    allOps.forEach((op) => {
      const existing = categoryMap.get(op.category) || { count: 0, totalAmount: 0 };
      categoryMap.set(op.category, {
        count: existing.count + 1,
        totalAmount: existing.totalAmount + Number(op.amount || 0),
      });
    });

    const categoryBreakdown: CategoryMetric[] = Array.from(categoryMap.entries())
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        totalAmount: stats.totalAmount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    // Gráfico 2: Linha de Evolução Mensal (Agrupado por Mês)
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyMap = new Map<string, { monthKey: string; month: string; amount: number; count: number; completedCount: number }>();

    // Inicializa meses recentes de 2025 para gráfico consistente
    ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'].forEach((mKey) => {
      const monthIdx = parseInt(mKey.split('-')[1], 10) - 1;
      monthlyMap.set(mKey, {
        monthKey: mKey,
        month: `${monthNames[monthIdx]}/25`,
        amount: 0,
        count: 0,
        completedCount: 0,
      });
    });

    allOps.forEach((op) => {
      const date = new Date(op.created_at || op.due_date);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const mKey = `${year}-${m}`;
        const monthLabel = `${monthNames[date.getMonth()]}/${String(year).slice(2)}`;

        const existing = monthlyMap.get(mKey) || {
          monthKey: mKey,
          month: monthLabel,
          amount: 0,
          count: 0,
          completedCount: 0,
        };

        existing.amount += Number(op.amount || 0);
        existing.count += 1;
        if (op.status === 'concluido') existing.completedCount += 1;
        monthlyMap.set(mKey, existing);
      }
    });

    const monthlyEvolution: MonthlyEvolutionMetric[] = Array.from(monthlyMap.values())
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    return {
      totalOperations,
      completedOperations,
      inProgressOperations,
      pendingOperations,
      resolutionRate,
      totalFinancialVolume,
      avgOperationValue,
      highPriorityCount,
      categoryBreakdown,
      monthlyEvolution,
    };
  }

  /**
   * CRUD: Cria nova operação
   */
  static async createOperation(data: OperationFormData): Promise<Operation> {
    const newId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const newOp: Operation = {
      id: newId,
      org_id: data.org_id,
      title: data.title.trim(),
      category: data.category.trim(),
      status: data.status,
      priority: data.priority,
      amount: Number(data.amount),
      due_date: data.due_date,
      created_at: createdAt,
    };

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('operations')
          .insert(newOp)
          .select('*, organization:organizations(*)')
          .single();
        if (!error && inserted) {
          return inserted as Operation;
        }
      } catch (err) {
        console.warn('Supabase createOperation fallback to memory:', err);
      }
    }

    const store = getGlobalStore();
    const org = store.organizations.find((o) => o.id === data.org_id);
    const opWithOrg: Operation = { ...newOp, organization: org };
    store.operations.unshift(opWithOrg);
    return opWithOrg;
  }

  /**
   * CRUD: Atualiza operação existente
   */
  static async updateOperation(id: string, data: OperationFormData): Promise<Operation> {
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data: updated, error } = await supabase
          .from('operations')
          .update({
            org_id: data.org_id,
            title: data.title.trim(),
            category: data.category.trim(),
            status: data.status,
            priority: data.priority,
            amount: Number(data.amount),
            due_date: data.due_date,
          })
          .eq('id', id)
          .select('*, organization:organizations(*)')
          .single();

        if (!error && updated) {
          return updated as Operation;
        }
      } catch (err) {
        console.warn('Supabase updateOperation fallback to memory:', err);
      }
    }

    const store = getGlobalStore();
    const index = store.operations.findIndex((op) => op.id === id);
    if (index === -1) {
      throw new Error(`Operação com ID ${id} não encontrada.`);
    }

    const org = store.organizations.find((o) => o.id === data.org_id);
    const existing = store.operations[index];
    const updatedOp: Operation = {
      ...existing,
      org_id: data.org_id,
      title: data.title.trim(),
      category: data.category.trim(),
      status: data.status,
      priority: data.priority,
      amount: Number(data.amount),
      due_date: data.due_date,
      organization: org,
    };

    store.operations[index] = updatedOp;
    return updatedOp;
  }

  /**
   * CRUD: Remove operação
   */
  static async deleteOperation(id: string): Promise<boolean> {
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('operations').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deleteOperation fallback to memory:', err);
      }
    }

    const store = getGlobalStore();
    const initialLen = store.operations.length;
    store.operations = store.operations.filter((op) => op.id !== id);
    return store.operations.length < initialLen;
  }

  /**
   * Reset / Restaurar dados de demonstração
   */
  static async resetDefaultOperations(): Promise<void> {
    const store = getGlobalStore();
    store.organizations = [...DEFAULT_ORGANIZATIONS];
    store.operations = [...DEFAULT_OPERATIONS];
  }
}
