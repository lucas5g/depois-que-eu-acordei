import { Chrome } from "lucide-react";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { getCurrentUser } from "@/lib/auth-guard";

export const metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/");
  const { error } = await searchParams;

  return (
    <section className="login-page site-shell">
      <div className="login-card">
        <p className="eyebrow">Área reservada</p>
        <h1>Entre para continuar</h1>
        <p>
          Use sua conta Google. Novos perfis podem ler os relatos; apenas
          administradores acessam o painel.
        </p>
        {error && <p className="form-error">Não foi possível entrar com essa conta.</p>}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button className="google-button" type="submit">
            <Chrome size={18} aria-hidden="true" />
            Entrar com Google
          </button>
        </form>
      </div>
    </section>
  );
}
