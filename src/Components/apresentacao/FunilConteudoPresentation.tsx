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
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
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

const stageVisuals = [
  {
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    border: "border-t-sky-400",
    bar: "bg-sky-400",
    dot: "bg-sky-500",
  },
  {
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    border: "border-t-indigo-400",
    bar: "bg-indigo-400",
    dot: "bg-indigo-500",
  },
  {
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
    border: "border-t-violet-400",
    bar: "bg-violet-400",
    dot: "bg-violet-500",
  },
  {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    border: "border-t-emerald-400",
    bar: "bg-emerald-400",
    dot: "bg-emerald-500",
  },
  {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    border: "border-t-amber-400",
    bar: "bg-amber-400",
    dot: "bg-amber-500",
  },
];

function getDistributionPercentage(value: string): number {
  const text = value.replace(/<[^>]*>/g, "").replace(",", ".");
  const match = text.match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;

  const percentage = Number(match[0]);
  if (!Number.isFinite(percentage)) return 0;
  return Math.min(100, Math.max(0, percentage));
}

export default function FunilConteudoPresentation({ data }: { data: unknown }) {
  const d = isFunnelData(data) ? data : null;
  const stages = d?.stages ?? [];
  const overview = d?.overview?.trim() ?? "";
  const dist = d?.distribution;
  const metrics = d?.metrics;
  const references = d?.references ?? [];

  const distItems = dist
    ? [
        { label: "Atração", acronym: "TOFU", value: dist.attraction, stageIndex: 0 },
        { label: "Conexão", acronym: "MOFU", value: dist.connection, stageIndex: 1 },
        { label: "Vinculação", acronym: "FOFU", value: dist.bonding, stageIndex: 2 },
        { label: "Conversão", acronym: "COFU", value: dist.sales, stageIndex: 3 },
        { label: "Recompra", acronym: "REFU", value: dist.repurchase ?? "", stageIndex: 4 },
      ].filter((i) => i.value?.trim())
    : [];

  const metricsItems = metrics
    ? [
        { label: "Atração", acronym: "TOFU", value: metrics.attraction, stageIndex: 0 },
        { label: "Conexão", acronym: "MOFU", value: metrics.connection, stageIndex: 1 },
        { label: "Vinculação", acronym: "FOFU", value: metrics.bonding, stageIndex: 2 },
        { label: "Conversão", acronym: "COFU", value: metrics.sales, stageIndex: 3 },
        { label: "Recompra", acronym: "REFU", value: metrics.repurchase ?? "", stageIndex: 4 },
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
          <div className="border-l-2 border-slate-300 pl-5 sm:pl-7">
            <h2 className="font-serif text-xl font-semibold text-slate-950 sm:text-2xl">
              Visão geral
            </h2>
            <RichText
              content={overview}
              className="mt-4 max-w-4xl text-sm leading-7 text-slate-700 sm:text-base sm:leading-8"
            />
          </div>
        </section>
      )}

      {stages.map((stage, i) => {
        const meta = stageTitles[i];
        const formatItems = normalizeContentFunnelFormatItems(
          stage.formatItems,
          stage.themeItems,
          stage.themes
        );
        const strategy = stage.strategy ?? "";
        const objective = stage.objective ?? "";
        const nextStep = stage.nextStep ?? "";
        const ctas = stage.ctas ?? "";
        const hasStrategy = Boolean(strategy.trim());
        const hasObjective = Boolean(objective.trim());
        const hasNextStep = Boolean(nextStep.trim());
        const hasCtas = Boolean(ctas.trim());
        if (!hasStrategy && !hasObjective && !hasNextStep && !formatItems.length && !hasCtas) return null;
        const visual = stageVisuals[i] ?? stageVisuals[0];
        return (
          <section key={i} className="p-6 sm:p-8 lg:p-12">
            <div className={`overflow-hidden rounded-3xl border border-slate-200 border-t-2 bg-white ${visual.border}`}>
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ring-1 ${visual.badge}`}>
                      Etapa {i + 1}{meta?.acronym ? ` · ${meta.acronym}` : ""}
                    </span>
                    <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-950 sm:text-3xl">
                      {meta?.title ?? `Etapa ${i + 1}`}
                    </h2>
                    {meta?.sub && (
                      <p className="mt-2 text-sm font-medium text-slate-500">{meta.sub}</p>
                    )}
                  </div>
                  <span className="font-serif text-4xl text-slate-200" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-8 space-y-8">
                  {hasStrategy && (
                    <div className="max-w-4xl">
                      <FieldBlock label="Estratégia" value={strategy} />
                    </div>
                  )}

                  {(hasObjective || hasNextStep) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {hasObjective && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                          <FieldBlock label="Objetivo" value={objective} />
                        </div>
                      )}
                      {hasNextStep && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                          <FieldBlock label="Próximo passo" value={nextStep} />
                        </div>
                      )}
                    </div>
                  )}

                  {formatItems.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Exemplos de formatos
                      </p>
                      <div className="divide-y divide-slate-200 border-y border-slate-200">
                        {formatItems.map((item, formatIndex) => (
                          <div key={formatIndex} className="flex gap-3 py-4">
                            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${visual.dot}`} />
                            <p className="text-sm leading-7 text-slate-700">{item.format}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasCtas && (
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex gap-3">
                        <span className="mt-0.5 text-base text-slate-400" aria-hidden="true">→</span>
                        <div className="min-w-0 flex-1">
                          <FieldBlock label="CTAs" value={ctas} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {(distItems.length > 0 || metricsItems.length > 0) && (
        <SectionCard title="Distribuição e métricas">
          <div className="space-y-12">
            {distItems.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Distribuição por etapa
                </p>

                <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                  <div className="flex h-full w-full">
                    {distItems.map((item) => (
                      <div
                        key={item.label}
                        className={stageVisuals[item.stageIndex].bar}
                        style={{ flexBasis: `${getDistributionPercentage(item.value)}%` }}
                        title={`${item.label}: ${item.value}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {distItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${stageVisuals[item.stageIndex].dot}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700">
                          {item.label} · {item.acronym}
                        </p>
                        <RichText content={item.value} className="text-xs text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-5">
                  {distItems.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                        <RichText content={item.value} className="text-sm font-semibold text-slate-600" />
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${stageVisuals[item.stageIndex].bar}`}
                          style={{ width: `${getDistributionPercentage(item.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metricsItems.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Métricas do funil
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {metricsItems.map((item, index) => (
                    <div
                      key={item.label}
                      className={`rounded-2xl border border-slate-200 bg-white p-5 ${metricsItems.length % 2 === 1 && index === metricsItems.length - 1 ? "md:col-span-2" : ""}`}
                    >
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ${stageVisuals[item.stageIndex].badge}`}>
                        {item.acronym}
                      </span>
                      <h3 className="mt-3 font-serif text-lg font-semibold text-slate-950">
                        {item.label}
                      </h3>
                      <RichText content={item.value} className="mt-3 text-sm leading-7 text-slate-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ExternalRefList refs={references} />
          </div>
        </SectionCard>
      )}

      {!d && <EmptyState />}
    </article>
  );
}
