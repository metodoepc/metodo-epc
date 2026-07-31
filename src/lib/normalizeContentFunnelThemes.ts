export type ContentFunnelThemeItem = {
  theme: string;
  format: string;
};

export function normalizeContentFunnelThemeItems(
  themeItems: unknown,
  legacyThemes: unknown,
  legacyFormat: unknown
): ContentFunnelThemeItem[] {
  if (Array.isArray(themeItems)) {
    return themeItems
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const value = item as Record<string, unknown>;
        const theme = typeof value.theme === "string" ? value.theme.trim() : "";
        const format = typeof value.format === "string" ? value.format : "";

        return theme ? { theme, format } : null;
      })
      .filter((item): item is ContentFunnelThemeItem => item !== null);
  }

  if (typeof legacyThemes !== "string" || !legacyThemes.trim()) return [];

  const format = typeof legacyFormat === "string" ? legacyFormat : "";

  return legacyThemes
    .split(/\r?\n|,/)
    .map((theme) => theme.trim())
    .filter(Boolean)
    .map((theme) => ({ theme, format }));
}
