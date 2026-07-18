"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { processImage } from "@/lib/image";
import { slugify } from "@/lib/slug";
import {
  dreamSchema,
  type DreamActionState,
  type DreamFields,
} from "@/lib/validation";

function readFields(formData: FormData): Record<keyof DreamFields, string> {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    status: String(formData.get("status") ?? ""),
  };
}

async function uniqueSlug(title: string) {
  const base = slugify(title) || "relato";
  let candidate = base;
  let suffix = 2;

  while (await prisma.dream.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base.slice(0, 75)}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function validationFailure(
  raw: ReturnType<typeof readFields>,
  issues: ReturnType<typeof dreamSchema.safeParse> & { success: false },
): DreamActionState {
  return {
    error: "Revise os campos destacados.",
    fieldErrors: issues.error.flatten().fieldErrors,
    values: {
      title: raw.title,
      description: raw.description,
      imageAlt: raw.imageAlt,
      status: raw.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    },
  };
}

export async function createDream(
  _state: DreamActionState,
  formData: FormData,
): Promise<DreamActionState> {
  await requireAdmin();
  const raw = readFields(formData);
  const parsed = dreamSchema.safeParse(raw);
  if (!parsed.success) return validationFailure(raw, parsed);

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return {
      error: "Adicione uma foto ao relato.",
      fieldErrors: { image: ["Selecione uma foto JPG, PNG ou WebP."] },
      values: parsed.data,
    };
  }

  let image;
  try {
    image = await processImage(file);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Não foi possível processar a foto.",
      fieldErrors: { image: ["Escolha outra foto e tente novamente."] },
      values: parsed.data,
    };
  }

  try {
    await prisma.dream.create({
      data: {
        ...parsed.data,
        slug: await uniqueSlug(parsed.data.title),
        imageData: image.data,
        imageMime: image.mime,
        imageWidth: image.width,
        imageHeight: image.height,
        imageSize: image.size,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
  } catch {
    return {
      error: "Não foi possível salvar o relato. Seus textos foram preservados.",
      values: parsed.data,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?sucesso=criado");
}

export async function updateDream(
  id: string,
  _state: DreamActionState,
  formData: FormData,
): Promise<DreamActionState> {
  await requireAdmin();
  const existing = await prisma.dream.findUnique({ where: { id } });
  if (!existing) return { error: "Relato não encontrado." };

  const raw = readFields(formData);
  const parsed = dreamSchema.safeParse(raw);
  if (!parsed.success) return validationFailure(raw, parsed);

  const file = formData.get("image");
  let imageData = {};
  if (file instanceof File && file.size > 0) {
    try {
      const image = await processImage(file);
      imageData = {
        imageData: image.data,
        imageMime: image.mime,
        imageWidth: image.width,
        imageHeight: image.height,
        imageSize: image.size,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Não foi possível processar a foto.",
        fieldErrors: { image: ["Escolha outra foto e tente novamente."] },
        values: parsed.data,
      };
    }
  }

  try {
    await prisma.dream.update({
      where: { id },
      data: {
        ...parsed.data,
        ...imageData,
        publishedAt:
          parsed.data.status === "PUBLISHED"
            ? existing.status === "PUBLISHED"
              ? existing.publishedAt
              : new Date()
            : null,
      },
    });
  } catch {
    return {
      error: "Não foi possível atualizar o relato. Seus textos foram preservados.",
      values: parsed.data,
    };
  }

  revalidatePath("/");
  revalidatePath(`/relatos/${existing.slug}`);
  revalidatePath("/admin");
  redirect("/admin?sucesso=atualizado");
}

export async function deleteDream(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dream = await prisma.dream.findUnique({ where: { id }, select: { slug: true } });
  if (!dream) redirect("/admin?erro=nao-encontrado");

  await prisma.dream.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath(`/relatos/${dream.slug}`);
  revalidatePath("/admin");
  redirect("/admin?sucesso=excluido");
}
