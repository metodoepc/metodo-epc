import { PresentationHeader } from "./PresentationHeader";
import {
  ExternalRefList,
  FieldBlock,
  EmptyState,
  SectionCard,
} from "./ChannelPresentationShared";
import {
  normalizeEditorialChannelFrequencies,
  normalizeEditorialTextList,
} from "@/lib/normalizeEditorialLineData";

type EditorialLineItem = {
  title: string;
  objective: string;
  description: string;
  targetAudience: string;
  contentPillars: string;
  formats: string;
  frequency: string;
  examples: string;
  notes: string;
  lineType?: string;
  priority?: string;
  channelFrequencies?: { channel: string; quantity: string; period: string }[];
  priorityPersonas?: string[];
  journeyRoles?: string[];
  mainPillars?: string[];
  priorityFormats?: string[];
  contentExamples?: string[];
  relatedOffers?: string[];
  conductionMoment?: string;
  primaryIndicators?: string[];
};

type EditorialLinesData = {
  lines: EditorialLineItem[];
  generalGuidelines: string;
  references: { title: string; link: string }[];
};

function isEditorialLinesData(v: unknown): v is EditorialLinesData {
  return typeof v === "object" && v !== null && "lines" in v;
}

function PlainList({ label, items }: { label: string; items: string[] }) {
  const filledItems = items.filter((item) => item.trim());
  if (!filledItems.length) return null;
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="space-y-2">
        {filledItems.map((item, index) => (
          <div key={index} className="flex gap-3 text-sm leading-7 text-slate-700">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            <span className="whitespace-pre-wrap">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LinhasEditoriaisPresentation({ data }: { data: unknown }) {
  const d = isEditorialLinesData(data) ? data : null;
  const lines = (d?.lines ?? []).filter(
    (line) =>
      line.title?.trim() ||
      line.description?.trim() ||
      line.objective?.trim() ||
      line.targetAudience?.trim() ||
      line.contentPillars?.trim() ||
      line.formats?.trim() ||
      line.frequency?.trim() ||
      line.examples?.trim() ||
      line.lineType?.trim() ||
      line.priority?.trim() ||
      line.conductionMoment?.trim() ||
      line.channelFrequencies?.some((item) => item.channel || item.quantity || item.period) ||
      line.priorityPersonas?.some((item) => item.trim()) ||
      line.journeyRoles?.some((item) => item.trim()) ||
      line.mainPillars?.some((item) => item.trim()) ||
      line.priorityFormats?.some((item) => item.trim()) ||
      line.contentExamples?.some((item) => item.trim()) ||
      line.relatedOffers?.some((item) => item.trim()) ||
      line.primaryIndicators?.some((item) => item.trim())
  );
  const generalGuidelines = d?.generalGuidelines?.trim() ?? "";
  const references = d?.references ?? [];

  return (
    <article className="divide-y divide-slate-100 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
      <PresentationHeader
        area="Estratégia Editorial e Distribuição de Conteúdo"
        title="Linhas Editoriais"
        slug="linhas-editoriais"
      />

      {lines.map((line, i) => {
        const frequencies = normalizeEditorialChannelFrequencies(line.channelFrequencies).filter(
          (item) => item.channel || item.quantity || item.period
        );
        const personas = normalizeEditorialTextList(line.priorityPersonas, "");
        const journeyRoles = normalizeEditorialTextList(line.journeyRoles, "");
        const pillars = normalizeEditorialTextList(line.mainPillars, line.contentPillars);
        const formats = normalizeEditorialTextList(line.priorityFormats, line.formats);
        const examples = normalizeEditorialTextList(line.contentExamples, line.examples);
        const offers = normalizeEditorialTextList(line.relatedOffers, "");
        const indicators = normalizeEditorialTextList(line.primaryIndicators, "");
        return (
          <section
            key={i}
            className="p-8 lg:p-12"
          >
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Linha {i + 1}
              </span>
              <h3 className="mt-1 text-2xl font-light tracking-[-0.03em] text-slate-950">
                {line.title || `Linha Editorial ${i + 1}`}
              </h3>
              {(line.lineType?.trim() || line.priority?.trim()) && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {[line.lineType, line.priority].filter((value) => value?.trim()).join(" · ")}
                </p>
              )}
            </div>
            <div className="space-y-6">
              <FieldBlock label="Objetivo" value={line.objective} />
              <FieldBlock label="Descrição resumida" value={line.description} />
              {personas.length > 0 ? (
                <PlainList label="Personas prioritárias" items={personas} />
              ) : (
                <FieldBlock label="Público-alvo" value={line.targetAudience} />
              )}
              <PlainList label="Papel na jornada" items={journeyRoles} />
              {frequencies.length > 0 ? (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Frequência por canal</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {frequencies.map((item, index) => (
                      <div key={index} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        {item.channel && <p className="text-sm font-semibold text-slate-900">{item.channel}</p>}
                        {(item.quantity || item.period) && <p className="mt-1 text-sm text-slate-600">{[item.quantity, item.period].filter(Boolean).join(" ")}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <FieldBlock label="Frequência" value={line.frequency} />
              )}
              <PlainList label="Pilares principais" items={pillars} />
              <PlainList label="Formatos prioritários" items={formats} />
              <PlainList label="Exemplos de conteúdo" items={examples} />
              <PlainList label="Ofertas relacionadas" items={offers} />
              <FieldBlock label="Momento de condução" value={line.conductionMoment ?? ""} />
              <PlainList label="Indicadores principais" items={indicators} />
            </div>
          </section>
        );
      })}

      {(generalGuidelines || references.length > 0) && (
        <SectionCard title="Diretrizes gerais">
          {generalGuidelines && (
            <FieldBlock label="Orientações gerais" value={generalGuidelines} />
          )}
          <ExternalRefList refs={references} />
        </SectionCard>
      )}

      {!d && <EmptyState />}
    </article>
  );
}
