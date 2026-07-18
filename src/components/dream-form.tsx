"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import type { DreamActionState, DreamFields } from "@/lib/validation";
import { SubmitButton } from "@/components/submit-button";

type DreamFormProps = {
  action: (state: DreamActionState, formData: FormData) => Promise<DreamActionState>;
  initial?: DreamFields;
  initialImage?: string;
  mode: "create" | "edit";
};

const emptyState: DreamActionState = {};

export function DreamForm({ action, initial, initialImage, mode }: DreamFormProps) {
  const [state, formAction] = useActionState(action, emptyState);
  const [preview, setPreview] = useState(initialImage ?? "");
  const objectUrl = useRef<string | null>(null);

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  const values = state.values ?? initial;
  const fieldError = (field: keyof NonNullable<DreamActionState["fieldErrors"]>) =>
    state.fieldErrors?.[field]?.[0];

  return (
    <form className="dream-form" action={formAction} encType="multipart/form-data">
      {state.error && <p className="form-error" role="alert">{state.error}</p>}

      <div className="form-field">
        <span className="field-label">Foto</span>
        <div className="upload-control">
          <div className="image-preview">
            {preview ? (
              // Object URLs and authenticated previews are intentionally rendered directly.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Pré-visualização da foto selecionada" />
            ) : (
              <span className="image-preview-empty">A prévia aparecerá aqui</span>
            )}
          </div>
          <div>
            <input
              className="file-input"
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={mode === "create"}
              aria-describedby="image-hint image-error"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
                objectUrl.current = URL.createObjectURL(file);
                setPreview(objectUrl.current);
              }}
            />
            <p className="field-hint" id="image-hint">
              JPG, PNG ou WebP, até 5 MB. A imagem será otimizada para WebP.
            </p>
            {fieldError("image") && <p className="field-error" id="image-error">{fieldError("image")}</p>}
          </div>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="imageAlt">Texto alternativo</label>
        <input
          id="imageAlt"
          name="imageAlt"
          type="text"
          minLength={3}
          maxLength={180}
          required
          defaultValue={values?.imageAlt ?? ""}
          aria-invalid={Boolean(fieldError("imageAlt"))}
        />
        <p className="field-hint">Descreva objetivamente o que aparece na foto.</p>
        {fieldError("imageAlt") && <p className="field-error">{fieldError("imageAlt")}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          minLength={3}
          maxLength={100}
          required
          defaultValue={values?.title ?? ""}
          aria-invalid={Boolean(fieldError("title"))}
        />
        {fieldError("title") && <p className="field-error">{fieldError("title")}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          minLength={10}
          maxLength={10_000}
          required
          defaultValue={values?.description ?? ""}
          aria-invalid={Boolean(fieldError("description"))}
        />
        <p className="field-hint">
          Os parágrafos serão preservados. Use *texto* para escrever em negrito.
        </p>
        {fieldError("description") && <p className="field-error">{fieldError("description")}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={values?.status ?? "DRAFT"}>
          <option value="DRAFT">Rascunho</option>
          <option value="PUBLISHED">Publicado</option>
        </select>
        {fieldError("status") && <p className="field-error">{fieldError("status")}</p>}
      </div>

      <div className="form-footer">
        <Link className="secondary-button" href="/admin">Cancelar</Link>
        <SubmitButton>{mode === "create" ? "Salvar relato" : "Salvar alterações"}</SubmitButton>
      </div>
    </form>
  );
}
