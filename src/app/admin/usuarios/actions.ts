"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export type RoleActionState = {
  error?: string;
  success?: string;
};

export async function updateUserRole(
  _state: RoleActionState,
  formData: FormData,
): Promise<RoleActionState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || (role !== "USER" && role !== "ADMIN")) {
    return { error: "Usuário ou perfil inválido." };
  }

  let target;
  try {
    target = await prisma.$transaction(
      async (transaction) => {
        const user = await transaction.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true, name: true, email: true },
        });
        if (!user) throw new Error("USER_NOT_FOUND");

        if (user.role === "ADMIN" && role === "USER") {
          const adminCount = await transaction.user.count({ where: { role: "ADMIN" } });
          if (adminCount <= 1) throw new Error("LAST_ADMIN");
        }

        await transaction.user.update({ where: { id: userId }, data: { role } });
        return user;
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return { error: "Usuário não encontrado." };
    }
    if (error instanceof Error && error.message === "LAST_ADMIN") {
      return { error: "O último administrador não pode perder o acesso." };
    }
    return { error: "Não foi possível alterar o perfil. Tente novamente." };
  }

  revalidatePath("/admin/usuarios");

  const label = target.name || target.email || (target.id === admin.id ? "Sua conta" : "Usuário");
  return { success: `${label} agora possui o perfil ${role}.` };
}
