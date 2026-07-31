export type EditorialChannelFrequency = {
  channel: string;
  quantity: string;
  period: string;
};

export function normalizeEditorialTextList(value: unknown, legacyValue: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof legacyValue !== "string" || !legacyValue.trim()) return [];

  const listItems = Array.from(legacyValue.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
  if (listItems.length > 0) return listItems;

  const plainText = stripHtml(legacyValue);
  const lines = plainText
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return lines.length > 1 ? lines : [plainText].filter(Boolean);
}

export function normalizeEditorialChannelFrequencies(
  value: unknown
): EditorialChannelFrequency[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        channel: typeof record.channel === "string" ? record.channel : "",
        quantity: typeof record.quantity === "string" ? record.quantity : "",
        period: typeof record.period === "string" ? record.period : "",
      };
    })
    .filter((item): item is EditorialChannelFrequency => item !== null);
}

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}
