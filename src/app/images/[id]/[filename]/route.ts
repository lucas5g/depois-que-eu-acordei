import { type NextRequest } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> },
) {
  const { id, filename } = await params;
  const image = await prisma.dream.findUnique({
    where: { id },
    select: { imageData: true, updatedAt: true, status: true },
  });

  const expectedFilename = image ? `social-v2-${image.updatedAt.getTime()}.jpg` : "";
  if (!image || image.status !== "PUBLISHED" || filename !== expectedFilename) {
    return new Response("Imagem não encontrada.", { status: 404 });
  }

  const etag = `"${id}-${image.updatedAt.getTime()}-social"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  const data = await sharp(Buffer.from(image.imageData))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .flatten({ background: "#171918" })
    .jpeg({ quality: 86, progressive: false, chromaSubsampling: "4:2:0" })
    .toBuffer();

  return new Response(data, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(data.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
