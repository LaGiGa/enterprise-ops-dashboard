import { z } from "zod";

export const operationFormSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres.")
    .max(120, "O título deve ter no máximo 120 caracteres."),
  org_id: z
    .string()
    .min(1, "Selecione uma organização responsável."),
  category: z
    .string()
    .min(2, "A categoria deve ter pelo menos 2 caracteres."),
  status: z.enum(["em_andamento", "concluido", "pendente"], {
    message: "Selecione um status válido.",
  }),
  priority: z.enum(["baixa", "media", "alta"], {
    message: "Selecione uma prioridade válida.",
  }),
  amount: z.coerce
    .number({ message: "Informe um valor numérico válido." })
    .positive("O valor deve ser maior que zero.")
    .max(99999999, "O valor ultrapassa o limite permitido."),
  due_date: z
    .string()
    .min(10, "Informe uma data de vencimento válida (AAAA-MM-DD).")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (AAAA-MM-DD)."),
});

export type OperationFormData = z.infer<typeof operationFormSchema>;
