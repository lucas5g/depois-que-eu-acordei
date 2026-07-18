import { z } from "zod";

export const dreamSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "A descrição deve ter pelo menos 10 caracteres.")
    .max(10_000, "A descrição deve ter no máximo 10.000 caracteres."),
  imageAlt: z
    .string()
    .trim()
    .min(3, "Descreva a imagem em pelo menos 3 caracteres.")
    .max(180, "O texto alternativo deve ter no máximo 180 caracteres."),
  status: z.enum(["DRAFT", "PUBLISHED"], {
    error: "Selecione um status válido.",
  }),
});

export type DreamFields = z.infer<typeof dreamSchema>;

export type DreamActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof DreamFields | "image", string[]>>;
  values?: Partial<DreamFields>;
};
