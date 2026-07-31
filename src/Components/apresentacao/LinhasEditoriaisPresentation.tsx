"use client";

import { useState } from "react";
import { PresentationHeader } from "./PresentationHeader";
import { ExternalRefList, EmptyState } from "./ChannelPresentationShared";
import { RichText } from "./RichText";
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

function isEditorialLinesData(value: unknown): value is EditorialLinesData {
  return typeof value === "object" && value !== null && "lines" in value;
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d={expanded ? "m5 12.5 5-5 5 5" : "m5 7.5 5 5 5-5"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TextSection({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <RichText content={value} className="text-sm leading-7 text-slate-700" />
    </div>
  );
}

function EditorialList({ label, items }: { label: string; items: string[] }) {
  const filledItems = items.filter((item) => item.trim());
  if (!filledItems.length) return null;
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <ul className="space-y-2.5">
        {filledItems.map((item, index) => (
          <li key={index} className="flex gap-3 text-sm leading-6 text-slate-700">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span className="whitespace-pre-wrap">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  const filledItems = items.filter((item) => item.trim());
  if (!filledItems.length) return null;
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {filledItems.map((item, index) => (
          <span
            key={index}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs leading-5 text-slate-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function priorityStyle(priority?: string) {
  if (priority === "Principal") return "bg-slate-900 text-white";
  if (priority === "Complementar") return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-500";
}

function hasPositiveQuantity(quantity: string) {
  return Number(quantity.replace(",", ".")) > 0;
}

function getPlainTextPreview(value: string) {
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

export default function LinhasEditoriaisPresentation({ data }: { data: unknown }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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

  const toggleLine = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
      <PresentationHeader
        area="Estratégia Editorial e Distribuição de Conteúdo"
        title="Linhas Editoriais"
        slug="linhas-editoriais"
      >
        {lines.length > 0 && (
          <div className="mt-6 max-w-2xl border-t border-slate-100 pt-5">
            <p className="text-sm leading-6 text-slate-500">
              Selecione uma linha editorial para visualizar sua estratégia completa.
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {lines.length} {lines.length === 1 ? "linha editorial definida" : "linhas editoriais definidas"}
            </p>
          </div>
        )}
      </PresentationHeader>

      {lines.length > 0 && (
        <section className="border-t border-slate-100 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {lines.map((line, index) => {
              const expanded = expandedIndex === index;
              const detailsId = `editorial-line-${index}-details`;
              const frequencies = normalizeEditorialChannelFrequencies(line.channelFrequencies).filter(
                (item) => item.channel.trim() && item.quantity.trim()
              );
              const summaryFrequencies = frequencies.filter((item) =>
                hasPositiveQuantity(item.quantity)
              );
              const personas = normalizeEditorialTextList(line.priorityPersonas, line.targetAudience);
              const journeyRoles = normalizeEditorialTextList(line.journeyRoles, "");
              const pillars = normalizeEditorialTextList(line.mainPillars, line.contentPillars);
              const formats = normalizeEditorialTextList(line.priorityFormats, line.formats);
              const examples = normalizeEditorialTextList(line.contentExamples, line.examples);
              const offers = normalizeEditorialTextList(line.relatedOffers, "");
              const indicators = normalizeEditorialTextList(line.primaryIndicators, "");
              const visibleFrequencies = summaryFrequencies.slice(0, 4);
              const visibleOffers = offers.filter((item) => item.trim()).slice(0, 2);

              return (
                <article
                  key={index}
                  className={`overflow-hidden rounded-3xl border bg-white transition-colors duration-200 ${
                    expanded
                      ? "border-slate-300 md:col-span-2"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={detailsId}
                    onClick={() => toggleLine(index)}
                    className="block w-full cursor-pointer p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Linha {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 font-serif text-xl leading-tight tracking-[-0.02em] text-slate-950 sm:text-2xl">
                          {line.title?.trim() || `Linha Editorial ${index + 1}`}
                        </h3>
                      </div>
                      <span className="mt-1 shrink-0 text-slate-400">
                        <Chevron expanded={expanded} />
                      </span>
                    </div>

                    {(line.lineType?.trim() || line.priority?.trim()) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {line.lineType?.trim() && (
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                            {line.lineType}
                          </span>
                        )}
                        {line.priority?.trim() && (
                          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${priorityStyle(line.priority)}`}>
                            {line.priority}
                          </span>
                        )}
                      </div>
                    )}

                    {journeyRoles.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Jornada
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {journeyRoles.filter((item) => item.trim()).map((item, itemIndex) => (
                            <span key={itemIndex} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {line.objective?.trim() && (
                      <p className="mt-5 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {getPlainTextPreview(line.objective)}
                      </p>
                    )}

                    {visibleFrequencies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
                        {visibleFrequencies.map((item, itemIndex) => (
                          <span key={itemIndex} className="text-xs text-slate-600">
                            <strong className="font-semibold text-slate-800">{item.channel}</strong>
                            {" · "}{item.quantity} {item.period}
                          </span>
                        ))}
                        {summaryFrequencies.length > 4 && (
                          <span className="text-xs font-semibold text-slate-400">
                            +{summaryFrequencies.length - 4} canais
                          </span>
                        )}
                      </div>
                    )}

                    {visibleOffers.length > 0 && (
                      <p className="mt-4 text-xs leading-5 text-slate-500">
                        <span className="font-semibold text-slate-700">Conexão:</span>{" "}
                        {visibleOffers.join(", ")}
                        {offers.filter((item) => item.trim()).length > 2 && (
                          <> +{offers.filter((item) => item.trim()).length - 2}</>
                        )}
                      </p>
                    )}

                    {!expanded && (
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                        <span>Ver detalhes</span>
                        <Chevron expanded={false} />
                      </div>
                    )}
                  </button>

                  {expanded && (
                    <div id={detailsId} className="border-t border-slate-200">
                      <div className="space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
                        <section>
                          <h4 className="font-serif text-lg text-slate-950">Estratégia</h4>
                          <div className="mt-5 space-y-7 border-t border-slate-100 pt-6">
                            <TextSection label="Objetivo estratégico" value={line.objective} />
                            <TextSection label="Descrição resumida" value={line.description} />
                            <div className="grid gap-7 md:grid-cols-2">
                              <ChipList label="Personas prioritárias" items={personas} />
                              <ChipList label="Papel na jornada" items={journeyRoles} />
                            </div>
                          </div>
                        </section>

                        {(pillars.length > 0 || formats.length > 0 || examples.length > 0) && (
                          <section>
                            <h4 className="font-serif text-lg text-slate-950">Conteúdo</h4>
                            <div className="mt-5 space-y-8 border-t border-slate-100 pt-6">
                              <div className="grid gap-8 md:grid-cols-2">
                                <EditorialList label="Pilares principais" items={pillars} />
                                <EditorialList label="Formatos prioritários" items={formats} />
                              </div>
                              <EditorialList label="Exemplos de conteúdo" items={examples} />
                            </div>
                          </section>
                        )}

                        {(offers.length > 0 || line.conductionMoment?.trim() || indicators.length > 0) && (
                          <section>
                            <h4 className="font-serif text-lg text-slate-950">Conversão</h4>
                            <div className="mt-5 grid gap-8 border-t border-slate-100 pt-6 md:grid-cols-2">
                              <ChipList label="Ofertas relacionadas" items={offers} />
                              <TextSection label="Momento de condução" value={line.conductionMoment} />
                              <EditorialList label="Indicadores principais" items={indicators} />
                            </div>
                          </section>
                        )}

                        {frequencies.length > 0 && (
                          <section>
                            <h4 className="font-serif text-lg text-slate-950">Distribuição por canal</h4>
                            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                              {frequencies.map((item, itemIndex) => (
                                <div key={itemIndex} className="rounded-2xl border border-slate-200 px-4 py-3.5">
                                  <p className="text-sm font-semibold text-slate-900">{item.channel}</p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {item.quantity} {item.period}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>

                      <button
                        type="button"
                        aria-expanded="true"
                        aria-controls={detailsId}
                        onClick={() => toggleLine(index)}
                        className="flex w-full cursor-pointer items-center justify-between border-t border-slate-100 px-5 py-4 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500 sm:px-6 lg:px-8"
                      >
                        <span>Recolher detalhes</span>
                        <Chevron expanded />
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {(generalGuidelines || references.length > 0) && (
        <section className="border-t border-slate-200 px-8 py-10 lg:px-12 lg:py-12">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Orientação transversal
            </p>
            <h3 className="mt-2 font-serif text-2xl tracking-[-0.02em] text-slate-950">
              Diretrizes gerais
            </h3>
            {generalGuidelines && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <RichText content={generalGuidelines} className="text-sm leading-7 text-slate-700" />
              </div>
            )}
            <ExternalRefList refs={references} />
          </div>
        </section>
      )}

      {!d && <EmptyState />}
    </article>
  );
}
