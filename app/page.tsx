import { OperationsService } from "@/lib/db/operations-service";
import { OpsDashboardView } from "@/components/ops/ops-dashboard-view";
import { OperationsQueryParams } from "@/lib/types/operations";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const page = searchParams.page ? Number(searchParams.page) : 1;
  const pageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 8;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const priority = typeof searchParams.priority === "string" ? searchParams.priority : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const orgId = typeof searchParams.orgId === "string" ? searchParams.orgId : undefined;
  const sortBy = (typeof searchParams.sortBy === "string" 
    ? searchParams.sortBy 
    : "created_at") as OperationsQueryParams["sortBy"];
  const sortOrder = (searchParams.sortOrder === "asc" ? "asc" : "desc") as "asc" | "desc";

  const queryParams: OperationsQueryParams = {
    page,
    pageSize,
    search,
    status,
    priority,
    category,
    orgId,
    sortBy,
    sortOrder,
  };

  // Queries paralelas no banco de dados
  const [paginatedData, metrics, organizations] = await Promise.all([
    OperationsService.getOperations(queryParams),
    OperationsService.getDashboardMetrics(),
    OperationsService.getOrganizations(),
  ]);

  // Lista de categorias distintas para filtros
  const categories = Array.from(
    new Set([
      "Infraestrutura TI",
      "Compliance & Jurídico",
      "Logística & Frotas",
      "Operações Comerciais",
      "Engenharia & IoT",
      "Segurança da Informação",
      ...metrics.categoryBreakdown.map((c) => c.category),
    ])
  );

  return (
    <OpsDashboardView
      initialData={paginatedData}
      metrics={metrics}
      organizations={organizations}
      categories={categories}
    />
  );
}
