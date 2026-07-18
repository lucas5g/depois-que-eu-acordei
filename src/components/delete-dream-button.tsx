"use client";

import { Trash2 } from "lucide-react";
import { deleteDream } from "@/app/admin/sonhos/actions";

export function DeleteDreamButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteDream}
      onSubmit={(event) => {
        if (!window.confirm(`Excluir “${title}” permanentemente?`)) event.preventDefault();
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="icon-action danger" type="submit" aria-label={`Excluir ${title}`}>
        <Trash2 size={17} aria-hidden="true" />
      </button>
    </form>
  );
}
