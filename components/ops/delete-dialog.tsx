"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Operation } from "@/lib/types/operations";
import { formatCurrency } from "@/lib/formatters";
import { deleteOperationAction } from "@/app/actions/operations";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteDialogProps {
  operation: Operation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteDialog({
  operation,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!operation) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteOperationAction(operation.id);
      if (result.success) {
        toast.success(result.message || "Operação removida com sucesso.");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || "Não foi possível excluir a operação.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro inesperado ao excluir a operação.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white sm:rounded-xl border border-zinc-200 shadow-xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Esta ação é definitiva e removerá a operação do banco de dados relacional.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs space-y-1.5">
          <div className="font-semibold text-zinc-900">{operation.title}</div>
          <div className="flex items-center justify-between text-zinc-600">
            <span>Organização:</span>
            <span className="font-medium text-zinc-800">{operation.organization?.name || "Empresa"}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600">
            <span>Volume Financeiro:</span>
            <span className="font-mono font-medium text-zinc-900">{formatCurrency(operation.amount)}</span>
          </div>
        </div>

        <DialogFooter className="pt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-xs h-9"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs h-9 gap-1.5 bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Excluir Operação</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
