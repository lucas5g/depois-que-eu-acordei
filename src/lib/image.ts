import sharp, { type Metadata } from "sharp";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

export type ProcessedImage = {
  data: Uint8Array<ArrayBuffer>;
  mime: "image/webp";
  width: number;
  height: number;
  size: number;
};

export async function processImage(file: File): Promise<ProcessedImage> {
  if (file.size === 0) throw new Error("Selecione uma foto.");
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("A foto deve ter no máximo 5 MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  let metadata: Metadata;
  try {
    metadata = await sharp(input).metadata();
  } catch {
    throw new Error("O arquivo enviado não é uma imagem válida.");
  }

  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    throw new Error("Use uma imagem JPG, PNG ou WebP.");
  }

  const { data, info } = await sharp(input)
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  const bytes = new Uint8Array(data.byteLength);
  bytes.set(data);

  return {
    data: bytes,
    mime: "image/webp",
    width: info.width,
    height: info.height,
    size: info.size,
  };
}
