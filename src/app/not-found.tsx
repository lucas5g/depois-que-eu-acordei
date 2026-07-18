import Link from "next/link";

export default function NotFound() {
  return (
    <section className="login-page site-shell">
      <div className="login-card">
        <p className="eyebrow">404</p>
        <h1>Esse fragmento se perdeu.</h1>
        <p>O relato não existe, ainda é um rascunho ou não está mais disponível.</p>
        <Link className="secondary-button" href="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
