const timeZone = process.env.APP_TIME_ZONE ?? "America/Sao_Paulo";

export function formatPublishedAt(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone,
  }).format(date);
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(date);
}

export function excerpt(text: string, length = 180) {
  const normalized = text
    .replace(/\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g, (_match, double, single) => double ?? single)
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length <= length) return normalized;
  return `${normalized.slice(0, length).trimEnd()}…`;
}

export function parseFormattedText(text: string) {
  return text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g).filter(Boolean).map((part) => {
    const markerLength = part.startsWith("**") && part.endsWith("**") ? 2
      : part.startsWith("*") && part.endsWith("*") ? 1
        : 0;

    return {
      text: markerLength ? part.slice(markerLength, -markerLength) : part,
      bold: markerLength > 0,
    };
  });
}

export function imageUrl(id: string, updatedAt: Date, format?: "jpeg") {
  const query = new URLSearchParams({ v: String(updatedAt.getTime()) });
  if (format) query.set("format", format);
  return `/images/${id}?${query}`;
}

export function socialImageUrl(id: string, updatedAt: Date) {
  return `/images/${id}/social-v2-${updatedAt.getTime()}.jpg`;
}
