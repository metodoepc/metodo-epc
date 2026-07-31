import { PresentationHeader } from "./PresentationHeader";
import {
  ExternalRefList,
  EmptyState,
  SectionCard,
} from "./ChannelPresentationShared";
import { RichText } from "./RichText";
import { normalizeContentFunnelFormatItems } from "@/lib/normalizeContentFunnelThemes";

function FieldBlock({ label, value }: { label: string; value: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <p className="mb-3 mt-8 text-base font-semibold uppercase tracking-[0.22em] text-[#5f6f8a]">
        {label}
      </p>
      <RichText content={value} className="text-sm leading-7 text-slate-700" />
    </div>
  );
}

type ContentFunnelStageData = {
  strategy: string;
  objective: string;
  nextStep: string;
  themes: string;
  recommendedFormat: string;
  themeItems?: { theme: string; format: string }[];
  formatItems?: { format: string }[];
  ctas: string;
};

type ContentFunnelData = {
  stages: ContentFunnelStageData[];
  overview: string;
  distribution: { attraction: string; connection: string; bonding: string; sales: string; repurchase?: string };
  metrics: { attraction: string; connection: string; bonding: string; sales: string; repurchase?: string };
  references: { title: string; link: string }[];
};

function isFunnelData(v: unknown): v is ContentFunnelData {
  return typeof v === "object" && v !== null && "stages" in v;
}

const stageTitles = [
  { acronym: "TOFU", title: "Conteúdos de atração", sub: "Usuário vira seguidor" },
  { acronym: "MOFU", title: "Conteúdos de conexão", sub: "Seguidor vira fã" },
  { acronym: "FOFU", title: "Conteúdos de vinculação", sub: "Fã vira lead" },
  { acronym: "COFU", title: "Conteúdos de conversão", sub: "Lead vira cliente" },
  { acronym: "REFU", title: "Conteúdos de recompra", sub: "Cliente volta a comprar" },
];

type ContentFunnelTextFieldKey =
  | "strategy"
  | "objective"
  | "nextStep"
  | "ctas";

const stageFields: { key: ContentFunnelTextFieldKey; label: string }[] = [
  { key: "strategy", label: "Estratégia" },
  { key: "objective", label: "Objetivo" },
  { key: "nextStep", label: "Próximo passo" },
  { key: "ctas", label: "CTAs" },
];

const funnelColors = [
  "bg-blue-50 ring-blue-200 text-blue-700",
  "bg-violet-50 ring-violet-200 text-violet-700",
  "bg-slate-50 ring-slate-200 text-slate-600",
  "bg-emerald-50 ring-emerald-200 text-emerald-700",
  "bg-slate-50 ring-slate-200 text-slate-700",
];

export default function FunilConteudoPresentation({ data }: { data: unknown }) {
  const d = isFunnelData(data) ? data : null;
  const stages = d?.stages ?? [];
  const overview = d?.overview?.trim() ?? "";
  const dist = d?.distribution;
  const metrics = d?.metrics;
  const references = d?.references ?? [];

  const distItems = dist
    ? [
        { label: "Atração", value: dist.attraction },
        { label: "Conexão", value: dist.connection },
        { label: "Vinculação", value: dist.bonding },
        { label: "Conversão", value: dist.sales },
        { label: "Recompra", value: dist.repurchase ?? "" },
      ].filter((i) => i.value?.trim())
    : [];

  const metricsItems = metrics
    ? [
        { label: "Atração", value: metrics.attraction },
        { label: "Conexão", value: metrics.connection },
        { label: "Vinculação", value: metrics.bonding },
        { label: "Conversão", value: metrics.sales },
        { label: "Recompra", value: metrics.repurchase ?? "" },
      ].filter((i) => i.value?.trim())
    : [];

  return (
    <article className="divide-y divide-slate-100 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
      <PresentationHeader
        area="Estratégia Editorial e Distribuição de Conteúdo"
        title="Funil de Conteúdo"
        slug="funil-de-conteudo"
      />

      {overview && (
        <section className="p-8 lg:p-12">
          <FieldBlock label="Visão geral" value={overview} />
        </section>
      )}

      {stages.map((stage, i) => {
        const meta = stageTitles[i];
        const formatItems = normalizeContentFunnelFormatItems(
          stage.formatItems,
          stage.themeItems,
          stage.themes
        );
        const fieldsBeforeThemes = stageFields.filter(
          (field) => field.key !== "ctas" && stage[field.key]?.trim()
        );
        const ctas = stage.ctas?.trim() ?? "";
        if (!fieldsBeforeThemes.length && !formatItems.length && !ctas) return null;
        return (
          <section
            key={i}
            className="p-8 lg:p-12"
          >
            <div className={`mb-6 inline-flex rounded-2xl px-4 py-2 ring-1 ${funnelColors[i] ?? "bg-slate-50 ring-slate-200 text-slate-700"}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]">
                  Etapa {i + 1}{meta?.acronym ? ` · ${meta.acronym}` : ""}
                </p>
                <p className="text-sm font-semibold">{meta?.title ?? `Etapa ${i + 1}`}</p>
                {meta?.sub && <p className="text-xs opacity-70">{meta.sub}</p>}
              </div>
            </div>
            <div className="space-y-6">
              {fieldsBeforeThemes.map((f) => (
                <FieldBlock key={f.key} label={f.label} value={stage[f.key]} />
              ))}
              {formatItems.length > 0 && (
                <div>
                  <p className="mb-3 mt-8 text-base font-semibold uppercase tracking-[0.22em] text-[#5f6f8a]">
                    Exemplos de formatos
                  </p>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {formatItems.map((item, formatIndex) => (
                      <div
                        key={formatIndex}
                        className="flex gap-3 py-4"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <p className="text-sm leading-7 text-slate-700">{item.format}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {ctas && <FieldBlock label="CTAs" value={ctas} />}
            </div>
          </section>
        );
      })}

      {(distItems.length > 0 || metricsItems.length > 0) && (
        <SectionCard title="Distribuição e métricas">
          {distItems.length > 0 && (
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Distribuição por etapa
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {distItems.map((item, i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="mb-1 text-xs font-bold text-slate-500">{item.label}</p>
                    <RichText content={item.value} className="text-sm text-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {metricsItems.length > 0 && (
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Métricas por etapa
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {metricsItems.map((item, i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="mb-1 text-xs font-bold text-slate-500">{item.label}</p>
                    <RichText content={item.value} className="text-sm text-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <ExternalRefList refs={references} />
        </SectionCard>
      )}

      {!d && <EmptyState />}
    </article>
  );
}
