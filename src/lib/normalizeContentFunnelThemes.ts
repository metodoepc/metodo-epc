export type ContentFunnelFormatItem = {
  format: string;
};

export function normalizeContentFunnelFormatItems(
  formatItems: unknown,
  themeItems: unknown,
  legacyThemes: unknown
): ContentFunnelFormatItem[] {
  if (Array.isArray(formatItems)) {
    return formatItems
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const value = item as Record<string, unknown>;
        const format = typeof value.format === "string" ? value.format.trim() : "";

        return format ? { format } : null;
      })
      .filter((item): item is ContentFunnelFormatItem => item !== null);
  }

  if (Array.isArray(themeItems)) {
    return themeItems
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const value = item as Record<string, unknown>;
        const theme = typeof value.theme === "string" ? value.theme.trim() : "";
        const legacyItemFormat =
          typeof value.format === "string" ? value.format.trim() : "";
        const format = theme || legacyItemFormat;

        return format ? { format } : null;
      })
      .filter((item): item is ContentFunnelFormatItem => item !== null);
  }

  if (typeof legacyThemes !== "string" || !legacyThemes.trim()) return [];

  return legacyThemes
    .split(/\r?\n|,/)
    .map((theme) => theme.trim())
    .filter(Boolean)
    .map((format) => ({ format }));
}
