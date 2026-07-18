import { RoleForm } from "@/components/role-form";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Acessos</p>
          <h1>Usuários</h1>
          <p>Contas Google cadastradas. Apenas administradores podem editar e publicar relatos.</p>
        </div>
      </div>

      <div className="user-table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Cadastro</th>
              <th>Permissão</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-identity">
                  <strong>{user.name || "Sem nome"}</strong>
                  <span>{user.email}</span>
                </td>
                <td>{formatShortDate(user.createdAt)}</td>
                <td><RoleForm userId={user.id} role={user.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
