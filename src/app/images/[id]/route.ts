import { type NextRequest } from "next/server";
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
  if (image.status !== "PUBLISHED") {
    const user = await getCurrentUser();
    if (user?.role !== "ADMIN") {
      return new Response("Imagem não encontrada.", { status: 404 });
    }

    return new Response(Buffer.from(image.imageData), {
      headers: {
        "Content-Type": image.imageMime,
        "Content-Length": String(image.imageData.byteLength),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const etag = `"${id}-${image.updatedAt.getTime()}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(Buffer.from(image.imageData), {
    headers: {
      "Content-Type": image.imageMime,
      "Content-Length": String(image.imageData.byteLength),
      "Cache-Control": "public, max-age=0, must-revalidate",
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
