import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  excerpt,
  formatPublishedAt,
  imageUrl,
  parseFormattedText,
  socialImageUrl,
} from "@/lib/format";

export const dynamic = "force-dynamic";

type DreamPageProps = { params: Promise<{ slug: string }> };

async function getDream(slug: string) {
  return prisma.dream.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { not: null } },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      imageAlt: true,
      imageWidth: true,
      imageHeight: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

export async function generateMetadata({ params }: DreamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dream = await getDream(slug);
  if (!dream) return { title: "Relato não encontrado" };
  const image = socialImageUrl(dream.id, dream.updatedAt);

  return {
    title: dream.title,
    description: excerpt(dream.description, 155),
    alternates: { canonical: `/relatos/${dream.slug}` },
    openGraph: {
      type: "article",
      title: dream.title,
      description: excerpt(dream.description, 155),
      url: `/relatos/${dream.slug}`,
      publishedTime: dream.publishedAt?.toISOString(),
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: dream.imageAlt,
        type: "image/jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: dream.title,
      description: excerpt(dream.description, 155),
      images: [image],
    },
  };
}

export default async function DreamPage({ params }: DreamPageProps) {
  const { slug } = await params;
  const dream = await getDream(slug);
  if (!dream || !dream.publishedAt) notFound();

  return (
    <article className="dream-article">
      <div className="dream-cover">
        <Image
          src={imageUrl(dream.id, dream.updatedAt)}
          alt={dream.imageAlt}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <header className="dream-header site-shell">
        <h1>{dream.title}</h1>
        <time className="dream-date" dateTime={dream.publishedAt.toISOString()}>
          {formatPublishedAt(dream.publishedAt)}
        </time>
      </header>
      <div className="dream-body site-shell">
        {parseFormattedText(dream.description).map((part, index) =>
          part.bold ? <strong key={index}>{part.text}</strong> : part.text,
        )}
      </div>
      <Link className="back-link" href="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar aos relatos
      </Link>
    </article>
  );
}
