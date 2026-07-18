import { type NextRequest } from "next/server";
import sharp from "sharp";
import { getCurrentUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await prisma.dream.findUnique({
    where: { id },
    select: {
      imageData: true,
      imageMime: true,
      updatedAt: true,
      status: true,
    },
  });

  if (!image) return new Response("Imagem não encontrada.", { status: 404 });
  const isPublic = image.status === "PUBLISHED";
  if (!isPublic) {
    const user = await getCurrentUser();
    if (user?.role !== "ADMIN") {
      return new Response("Imagem não encontrada.", { status: 404 });
    }
  }

  const format = request.nextUrl.searchParams.get("format");
  const wantsJpeg = format === "jpeg";
  const etag = `"${id}-${image.updatedAt.getTime()}${wantsJpeg ? "-jpeg" : ""}"`;
  if (isPublic && request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  const source = Buffer.from(image.imageData);
  const data = wantsJpeg ? await sharp(source).jpeg({ quality: 86 }).toBuffer() : source;

  return new Response(data, {
    headers: {
      "Content-Type": wantsJpeg ? "image/jpeg" : image.imageMime,
      "Content-Length": String(data.byteLength),
      "Cache-Control": isPublic ? "public, max-age=0, must-revalidate" : "private, no-store",
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
