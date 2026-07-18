import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { excerpt, formatPublishedAt, imageUrl } from "@/lib/format";

type DreamCardProps = {
  dream: {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    publishedAt: Date | null;
    updatedAt: Date;
  };
  priority?: boolean;
};

export function DreamCard({ dream, priority = false }: DreamCardProps) {
  if (!dream.publishedAt) return null;

  return (
    <article className="dream-card">
      <Link className="dream-card-link" href={`/sonhos/${dream.slug}`}>
        <div className="dream-card-image">
          <Image
            src={imageUrl(dream.id, dream.updatedAt)}
            alt={dream.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 760px) 100vw, 58vw"
          />
        </div>
        <div className="dream-card-copy">
          <time className="dream-card-date" dateTime={dream.publishedAt.toISOString()}>
            {formatPublishedAt(dream.publishedAt)}
          </time>
          <h3>{dream.title}</h3>
          <p>{excerpt(dream.description)}</p>
          <ArrowUpRight className="card-arrow" size={22} aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}
