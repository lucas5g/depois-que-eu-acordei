import { notFound } from "next/navigation";
import { DreamForm } from "@/components/dream-form";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { imageUrl } from "@/lib/format";
import { updateDream } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditDreamPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const dream = await prisma.dream.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      imageAlt: true,
      status: true,
      updatedAt: true,
    },
  });
  if (!dream) notFound();

  const action = updateDream.bind(null, dream.id);

  return (
    <div className="form-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Revisitar experiência</p>
          <h1>Editar relato</h1>
          <p>Altere o texto, substitua a foto ou mude o estado da publicação.</p>
        </div>
      </div>
      <DreamForm
        action={action}
        mode="edit"
        initial={{
          title: dream.title,
          description: dream.description,
          imageAlt: dream.imageAlt,
          status: dream.status,
        }}
        initialImage={imageUrl(dream.id, dream.updatedAt)}
      />
    </div>
  );
}
