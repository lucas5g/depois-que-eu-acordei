import { DreamCard } from "@/components/dream-card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dreams = await prisma.dream.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      imageAlt: true,
      imageWidth: true,
      imageHeight: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <>
      <section className="hero site-shell" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">Um diário de sonhos</p>
          <h1 id="hero-title">Depois que eu acordei</h1>
          <p className="hero-intro">
            Fragmentos do que permaneceu depois do despertar. Imagens, lugares e
            histórias que quase desapareceram pela manhã.
          </p>
        </div>
      </section>

      <section className="dream-feed site-shell" aria-labelledby="dreams-heading">
        <div className="section-heading">
          <h2 id="dreams-heading">Sonhos recentes</h2>
          <span>{dreams.length.toString().padStart(2, "0")} fragmentos</span>
        </div>
        {dreams.length > 0 ? (
          <div className="dream-grid">
            {dreams.map((dream, index) => (
              <DreamCard dream={dream} priority={index === 0} key={dream.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>A noite ainda está em silêncio.</strong>
            <span>O primeiro sonho aparecerá aqui quando for lembrado.</span>
          </div>
        )}
      </section>
    </>
  );
}
