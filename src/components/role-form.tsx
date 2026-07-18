"use client";

import { useActionState } from "react";
import { updateUserRole, type RoleActionState } from "@/app/admin/usuarios/actions";
import type { UserRole } from "@/generated/prisma/client";
import { SubmitButton } from "@/components/submit-button";

export function RoleForm({ userId, role }: { userId: string; role: UserRole }) {
  const [state, action] = useActionState<RoleActionState, FormData>(updateUserRole, {});

  return (
    <div>
      <form className="role-form" action={action}>
        <input name="userId" type="hidden" value={userId} />
        <select className="role-select" name="role" defaultValue={role} aria-label="Perfil do usuário">
          <option value="USER">Usuário</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <SubmitButton>Alterar</SubmitButton>
      </form>
      {state.error && <p className="role-feedback error" role="alert">{state.error}</p>}
      {state.success && <p className="role-feedback" role="status">{state.success}</p>}
    </div>
  );
}
