import Link from "next/link";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="admin-shell site-shell">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-label">Administração</p>
        <nav className="admin-nav" aria-label="Navegação administrativa">
          <Link href="/admin">Sonhos</Link>
          <Link href="/admin/sonhos/novo">Novo sonho</Link>
          <Link href="/admin/usuarios">Usuários</Link>
          <Link href="/">Ver o blog</Link>
        </nav>
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  );
}
