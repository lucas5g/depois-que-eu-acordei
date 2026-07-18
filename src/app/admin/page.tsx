import { Edit3, ExternalLink, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteDreamButton } from "@/components/delete-dream-button";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatShortDate, imageUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

const successMessages: Record<string, string> = {
  criado: "Relato criado com sucesso.",
  atualizado: "Relato atualizado com sucesso.",
  excluido: "Relato excluído.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string; erro?: string }>;
}) {
  await requireAdmin();
  const dreams = await prisma.dream.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      imageAlt: true,
    },
  });
  const query = await searchParams;
  const message = query.sucesso ? successMessages[query.sucesso] : null;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Arquivo pessoal</p>
          <h1>Seus relatos</h1>
          <p>Edite rascunhos e acompanhe as experiências que decidiu compartilhar.</p>
        </div>
        <Link className="primary-button" href="/admin/relatos/novo">
          <Plus size={17} aria-hidden="true" /> Novo relato
        </Link>
      </div>
      {message && <p className="admin-notice" role="status">{message}</p>}
      {query.erro && <p className="form-error">Não foi possível concluir a operação.</p>}

      {dreams.length > 0 ? (
        <div className="admin-list">
          {dreams.map((dream) => (
            <article className="admin-dream-row" key={dream.id}>
              <div className="admin-thumb">
                <Image
                  src={imageUrl(dream.id, dream.updatedAt)}
                  alt=""
                  fill
                  sizes="92px"
                />
              </div>
              <div className="admin-dream-copy">
                <h2>{dream.title}</h2>
                <p>
                  <span className="status-badge">
                    {dream.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  </span>
                  {formatShortDate(dream.publishedAt ?? dream.createdAt)}
                </p>
              </div>
              <div className="admin-row-actions">
                {dream.status === "PUBLISHED" && (
                  <Link
                    className="icon-action"
                    href={`/relatos/${dream.slug}`}
                    aria-label={`Ver ${dream.title}`}
                  >
                    <ExternalLink size={17} aria-hidden="true" />
                  </Link>
                )}
                <Link
                  className="icon-action"
                  href={`/admin/relatos/${dream.id}/editar`}
                  aria-label={`Editar ${dream.title}`}
                >
                  <Edit3 size={17} aria-hidden="true" />
                </Link>
                <DeleteDreamButton id={dream.id} title={dream.title} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>Nenhum relato registrado.</strong>
          <span>Comece pela experiência que você deseja elaborar.</span>
        </div>
      )}
    </>
  );
}
