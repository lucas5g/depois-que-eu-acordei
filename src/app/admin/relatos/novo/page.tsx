import { DreamForm } from "@/components/dream-form";
import { requireAdmin } from "@/lib/auth-guard";
import { createDream } from "../actions";

export default async function NewDreamPage() {
  await requireAdmin();
  return (
    <div className="form-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Novo relato</p>
          <h1>Registrar uma experiência</h1>
          <p>Comece pela imagem e escreva com honestidade sobre o que viveu por dentro.</p>
        </div>
      </div>
      <DreamForm action={createDream} mode="create" />
    </div>
  );
}
