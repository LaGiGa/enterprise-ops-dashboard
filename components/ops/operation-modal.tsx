"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { operationFormSchema, OperationFormData } from "@/lib/validations/operation";
import { Operation, Organization } from "@/lib/types/operations";
import { createOperationAction, updateOperationAction } from "@/app/actions/operations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Edit3, DollarSign, Calendar, Building2, Tag } from "lucide-react";

interface OperationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operationToEdit: Operation | null;
  organizations: Organization[];
  categories: string[];
  onSuccess: () => void;
}

export function OperationModal({
  open,
  onOpenChange,
  operationToEdit,
  organizations,
  categories,
  onSuccess,
}: OperationModalProps) {
  const isEditing = Boolean(operationToEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OperationFormData>({
    resolver: zodResolver(operationFormSchema) as any,
    defaultValues: {
      title: "",
      org_id: organizations[0]?.id || "",
      category: "Infraestrutura TI",
      status: "em_andamento",
      priority: "media",
      amount: 15000,
      due_date: new Date().toISOString().split("T")[0],
    },
  });

  // Atualiza os valores do formulário quando o modal abre ou a operação muda
  useEffect(() => {
    if (open) {
      if (operationToEdit) {
        reset({
          title: operationToEdit.title,
          org_id: operationToEdit.org_id,
          category: operationToEdit.category,
          status: operationToEdit.status,
          priority: operationToEdit.priority,
          amount: Number(operationToEdit.amount),
          due_date: operationToEdit.due_date.split("T")[0],
        });
      } else {
        // Modo criação
        reset({
          title: "",
          org_id: organizations[0]?.id || "",
          category: "Infraestrutura TI",
          status: "em_andamento",
          priority: "media",
          amount: 25000,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        });
      }
    }
  }, [open, operationToEdit, organizations, reset]);

  const onSubmit = async (data: OperationFormData) => {
    try {
      if (isEditing && operationToEdit) {
        const result = await updateOperationAction(operationToEdit.id, data);
        if (result.success) {
          toast.success(result.message || "Operação atualizada com sucesso!");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(result.error || "Erro ao atualizar a operação.");
        }
      } else {
        const result = await createOperationAction(data);
        if (result.success) {
          toast.success(result.message || "Operação cadastrada com sucesso!");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(result.error || "Erro ao criar a operação.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Ocorreu uma falha inesperada na Server Action.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 bg-white sm:rounded-xl border border-zinc-200 shadow-xl">
        <DialogHeader className="pb-3 border-b border-zinc-100">
          <DialogTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="h-5 w-5 text-zinc-700" />
                Editar Operação Corporativa
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-zinc-700" />
                Nova Operação Operacional
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            {isEditing
              ? "Atualize os parâmetros da operação. As alterações serão validadas com Zod e salvas via Server Action."
              : "Preencha os dados da nova operação corporativa. Validação em tempo real com React Hook Form + Zod."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Título da Operação <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("title")}
              placeholder="Ex: Auditoria de Segurança e Penetration Test SOC 2"
              className={`text-sm h-9 bg-white ${errors.title ? "border-red-500 focus-visible:ring-red-400" : ""}`}
            />
            {errors.title && (
              <p className="text-[11px] text-red-600 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Organização & Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Organização Responsável */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                Organização Responsável <span className="text-red-500">*</span>
              </label>
              <Controller
                name="org_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-white">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id} className="text-xs">
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.org_id && (
                <p className="text-[11px] text-red-600 font-medium">{errors.org_id.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-zinc-400" />
                Categoria <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("category")}
                placeholder="Ex: Infraestrutura TI, Compliance, Logística..."
                className={`text-sm h-9 bg-white ${errors.category ? "border-red-500 focus-visible:ring-red-400" : ""}`}
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.category && (
                <p className="text-[11px] text-red-600 font-medium">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Status & Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Status Operacional <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-white">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_andamento" className="text-xs">
                        Em Andamento
                      </SelectItem>
                      <SelectItem value="concluido" className="text-xs">
                        Concluído
                      </SelectItem>
                      <SelectItem value="pendente" className="text-xs">
                        Pendente
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-[11px] text-red-600 font-medium">{errors.status.message}</p>
              )}
            </div>

            {/* Prioridade */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Criticidade / Prioridade <span className="text-red-500">*</span>
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-xs bg-white">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta" className="text-xs text-red-700 font-medium">
                        Alta Criticidade
                      </SelectItem>
                      <SelectItem value="media" className="text-xs text-amber-700 font-medium">
                        Média Criticidade
                      </SelectItem>
                      <SelectItem value="baixa" className="text-xs text-blue-700 font-medium">
                        Baixa Criticidade
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-[11px] text-red-600 font-medium">{errors.priority.message}</p>
              )}
            </div>
          </div>

          {/* Valor Financeiro & Data de Vencimento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount / Valor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                Volume Financeiro (R$) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
                className={`text-sm h-9 font-mono bg-white ${errors.amount ? "border-red-500 focus-visible:ring-red-400" : ""}`}
              />
              {errors.amount && (
                <p className="text-[11px] text-red-600 font-medium">{errors.amount.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Data Limite / Vencimento <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("due_date")}
                className={`text-sm h-9 bg-white ${errors.due_date ? "border-red-500 focus-visible:ring-red-400" : ""}`}
              />
              {errors.due_date && (
                <p className="text-[11px] text-red-600 font-medium">{errors.due_date.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs h-9 border-zinc-200"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 bg-zinc-900 hover:bg-zinc-800 text-white gap-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando via Server Action...</span>
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Cadastrar Operação"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
