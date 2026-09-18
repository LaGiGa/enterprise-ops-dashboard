'use server';

import { revalidatePath } from 'next/cache';
import { OperationsService } from '@/lib/db/operations-service';
import { operationFormSchema, OperationFormData } from '@/lib/validations/operation';

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Server Action: Criar nova operação
 */
export async function createOperationAction(
  rawData: unknown
): Promise<ActionResult> {
  try {
    const parseResult = operationFormSchema.safeParse(rawData);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || 'Dados inválidos.';
      return { success: false, error: firstError };
    }

    const created = await OperationsService.createOperation(parseResult.data);
    revalidatePath('/');
    return {
      success: true,
      message: `Operação "${created.title}" cadastrada com sucesso!`,
      data: created,
    };
  } catch (err: any) {
    console.error('Erro em createOperationAction:', err);
    return {
      success: false,
      error: err?.message || 'Falha ao cadastrar a operação no banco de dados.',
    };
  }
}

/**
 * Server Action: Atualizar operação existente
 */
export async function updateOperationAction(
  id: string,
  rawData: unknown
): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'Identificador da operação não fornecido.' };
    }

    const parseResult = operationFormSchema.safeParse(rawData);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || 'Dados inválidos.';
      return { success: false, error: firstError };
    }

    const updated = await OperationsService.updateOperation(id, parseResult.data);
    revalidatePath('/');
    return {
      success: true,
      message: `Operação "${updated.title}" atualizada com sucesso!`,
      data: updated,
    };
  } catch (err: any) {
    console.error('Erro em updateOperationAction:', err);
    return {
      success: false,
      error: err?.message || 'Falha ao atualizar a operação no banco de dados.',
    };
  }
}

/**
 * Server Action: Excluir operação
 */
export async function deleteOperationAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'Identificador da operação não fornecido.' };
    }

    const success = await OperationsService.deleteOperation(id);
    if (!success) {
      return { success: false, error: 'Operação não encontrada ou já removida.' };
    }

    revalidatePath('/');
    return {
      success: true,
      message: 'Operação removida com sucesso.',
    };
  } catch (err: any) {
    console.error('Erro em deleteOperationAction:', err);
    return {
      success: false,
      error: err?.message || 'Falha ao excluir a operação.',
    };
  }
}

/**
 * Server Action: Restaurar dados de demonstração
 */
export async function resetDemoDataAction(): Promise<ActionResult> {
  try {
    await OperationsService.resetDefaultOperations();
    revalidatePath('/');
    return {
      success: true,
      message: 'Base de dados restaurada com os dados de demonstração corporativa.',
    };
  } catch (err: any) {
    console.error('Erro em resetDemoDataAction:', err);
    return {
      success: false,
      error: 'Falha ao restaurar dados de demonstração.',
    };
  }
}
