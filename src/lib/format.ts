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
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= length) return normalized;
  return `${normalized.slice(0, length).trimEnd()}…`;
}

export function imageUrl(id: string, updatedAt: Date) {
  return `/images/${id}?v=${updatedAt.getTime()}`;
}
