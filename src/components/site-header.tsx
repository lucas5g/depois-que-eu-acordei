import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-guard";
import { signOut } from "@/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const initial = (user?.name || user?.email || "U").slice(0, 1).toUpperCase();

  return (
    <header className="site-header site-shell">
      <Link className="wordmark" href="/">
        depois que eu acordei
      </Link>
      <nav className="header-actions" aria-label="Navegação principal">
        {user?.role === "ADMIN" && (
          <Link className="quiet-link" href="/admin">
            Painel
          </Link>
        )}
        {user ? (
          <>
            <span className="user-mark" aria-hidden="true">
              {initial}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="text-button" type="submit">
                Sair
              </button>
            </form>
          </>
        ) : (
          <Link className="quiet-link" href="/entrar">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
