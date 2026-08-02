"use client";

import { useId, useState } from "react";
import { normalizeInstagramData } from "@/lib/normalizeInstagramData";
import { PresentationHeader } from "./PresentationHeader";
import { RichText } from "./RichText";
import { ModuleIcon } from "./ModuleIcon";
import { SectionCard, EmptyState } from "./ChannelPresentationShared";

type InstagramPresentationProps = { data: unknown };

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validPercentage(value: string): number | null {
  if (!hasText(value)) return null;
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function isSafeLink(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const segmentColors = [
  "bg-slate-900",
  "bg-slate-600",
  "bg-slate-400",
  "bg-slate-300",
  "bg-slate-500",
];

function PercentageDistribution({
  items,
}: {
  items: Array<{ id: string; name: string; percentage: string }>;
}) {
  const segments = items
    .map((item, index) => ({ ...item, number: validPercentage(item.percentage), index }))
    .filter((item) => item.number !== null && item.number > 0);

  if (segments.length === 0) return null;

  return (
    <div className="space-y-3" aria-label="Distribuição percentual">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {segments.map((item) => (
          <span
            key={item.id}
            className={segmentColors[item.index % segmentColors.length]}
            style={{ width: `${Math.min(item.number ?? 0, 100)}%` }}
            title={`${item.name || "Item"}: ${item.percentage}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
        {segments.map((item) => (
          <span key={item.id} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${segmentColors[item.index % segmentColors.length]}`} />
            {item.name || "Item"} · {item.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
}

type SimulationTab = "carousel" | "card" | "reel";

function VisualSimulations({
  carousel,
  card,
  reel,
}: {
  carousel: Array<{ id: string; imageUrl: string; pageType: string; title: string; order: number }>;
  card: { imageUrl: string; title: string; description: string };
  reel: { imageUrl: string; title: string; description: string };
}) {
  const tabsId = useId();
  const sortedCarousel = [...carousel]
    .sort((a, b) => a.order - b.order)
    .filter((item) => hasText(item.imageUrl) || hasText(item.title) || hasText(item.pageType));
  const hasCard = hasText(card.imageUrl) || hasText(card.title) || hasText(card.description);
  const hasReel = hasText(reel.imageUrl) || hasText(reel.title) || hasText(reel.description);
  const available: Array<{ id: SimulationTab; label: string }> = [
    ...(sortedCarousel.length > 0 ? [{ id: "carousel" as const, label: "Carrossel" }] : []),
    ...(hasCard ? [{ id: "card" as const, label: "Card" }] : []),
    ...(hasReel ? [{ id: "reel" as const, label: "Reel" }] : []),
  ];
  const [selected, setSelected] = useState<SimulationTab>(available[0]?.id ?? "carousel");
  const active = available.some((tab) => tab.id === selected) ? selected : available[0]?.id;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const activePage = sortedCarousel[Math.min(carouselIndex, Math.max(sortedCarousel.length - 1, 0))];

  if (!active) return null;

  function moveTab(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? available.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + available.length) % available.length;
    const next = available[nextIndex];
    setSelected(next.id);
    document.getElementById(`${tabsId}-${next.id}-tab`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Formatos das simulações visuais" className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {available.map((tab, index) => (
          <button
            key={tab.id}
            id={`${tabsId}-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${tabsId}-${tab.id}-panel`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setSelected(tab.id)}
            onKeyDown={(event) => moveTab(event, index)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${active === tab.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "carousel" && activePage && (
        <div id={`${tabsId}-carousel-panel`} role="tabpanel" aria-labelledby={`${tabsId}-carousel-tab`} className="pt-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {hasText(activePage.imageUrl) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activePage.imageUrl} alt={activePage.title || `${activePage.pageType} do carrossel`} className="aspect-square w-full object-cover" />
              )}
              {(hasText(activePage.pageType) || hasText(activePage.title)) && (
                <div className="p-5">
                  {hasText(activePage.pageType) && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{activePage.pageType}</p>}
                  {hasText(activePage.title) && <p className="mt-2 font-serif text-xl font-semibold text-slate-950">{activePage.title}</p>}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 self-start sm:grid-cols-5 lg:grid-cols-2">
              {sortedCarousel.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`Ver página ${index + 1}: ${page.title || page.pageType}`}
                  aria-pressed={index === carouselIndex}
                  className={`overflow-hidden rounded-xl border bg-slate-50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${index === carouselIndex ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200"}`}
                >
                  {hasText(page.imageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={page.imageUrl} alt="" className="aspect-square w-full object-cover" />
                  ) : (
                    <span className="flex aspect-square items-center justify-center p-2 text-center text-xs text-slate-500">{page.title || page.pageType}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {active === "card" && (
        <SingleSimulation id={`${tabsId}-card-panel`} labelledBy={`${tabsId}-card-tab`} value={card} alt="Simulação de card estático" />
      )}
      {active === "reel" && (
        <SingleSimulation id={`${tabsId}-reel-panel`} labelledBy={`${tabsId}-reel-tab`} value={reel} alt="Simulação de capa de Reel" portrait />
      )}
    </div>
  );
}

function SingleSimulation({ id, labelledBy, value, alt, portrait = false }: {
  id: string;
  labelledBy: string;
  value: { imageUrl: string; title: string; description: string };
  alt: string;
  portrait?: boolean;
}) {
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="pt-6">
      <div className={`mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${portrait ? "max-w-sm" : "max-w-2xl"}`}>
        {hasText(value.imageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.imageUrl} alt={value.title || alt} className={`${portrait ? "aspect-[4/5]" : "aspect-square"} w-full object-cover`} />
        )}
        {(hasText(value.title) || hasText(value.description)) && (
          <div className="p-5 sm:p-6">
            {hasText(value.title) && <h3 className="font-serif text-xl font-semibold text-slate-950">{value.title}</h3>}
            {hasText(value.description) && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{value.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstagramPresentation({ data }: InstagramPresentationProps) {
  const d = normalizeInstagramData(data);
  const audiences = (d.priorityAudiences ?? []).filter((item) => hasText(item.name) || hasText(item.percentage) || hasText(item.description));
  const objectives = d.objectives.filter((item) => hasText(item.objective));
  const bioPaths = (d.bioPaths ?? []).filter((item) => hasText(item.name) || hasText(item.destination) || hasText(item.description));
  const highlights = [...d.profile.highlights].sort((a, b) => a.order - b.order).filter((item) => hasText(item.title) || hasText(item.purpose) || hasText(item.imageUrl));
  const pinnedPosts = (d.pinnedPosts ?? []).filter((item) => hasText(item.imageUrl) || hasText(item.title) || hasText(item.strategicRole));
  const visualElements = (d.visualElements ?? []).filter((item) => hasText(item.value));
  const visualAvoidItems = (d.visualAvoidItems ?? []).filter((item) => hasText(item.value));
  const visualReferences = [...d.visualDirection.references].sort((a, b) => a.order - b.order).filter((item) => hasText(item.url) || hasText(item.title) || hasText(item.description));
  const carousel = d.carouselSimulation ?? [];
  const staticCard = d.staticCardSimulation ?? { imageUrl: "", title: "", description: "" };
  const reelCover = d.reelCoverSimulation ?? { imageUrl: "", title: "", description: "" };
  const contentFronts = (d.contentFronts ?? []).filter((item) => hasText(item.name) || hasText(item.percentage) || hasText(item.description));
  const frequencies = d.publishing.frequencyItems.filter((item) => hasText(item.format) || hasText(item.quantity) || hasText(item.period));
  const conversionStages = [
    { name: "Descoberta", description: "Primeiro contato e progressão para um próximo conteúdo ou ponto de interesse.", ...d.conversion.discovery },
    { name: "Consideração", description: "Aprofundamento do problema, da solução ou do método.", ...d.conversion.consideration },
    { name: "Decisão", description: "Encaminhamento para a ação comercial ou conversa qualificada.", ...d.conversion.decision },
  ].filter((item) => hasText(item.cta) || hasText(item.destination));
  const conversionRoutes = (d.conversionRoutes ?? []).map((route) => ({ ...route, steps: route.steps.filter((step) => hasText(step.value)) })).filter((route) => hasText(route.name) || hasText(route.audience) || route.steps.length > 0);
  const hashtagCategories = d.hashtags.map((category) => ({ ...category, hashtags: category.hashtags.filter(hasText) })).filter((category) => hasText(category.name) || category.hashtags.length > 0);
  const receives = d.integration.receivesAudienceFrom.filter(hasText);
  const directs = d.integration.directsAudienceTo.filter(hasText);
  const connectionCtas = d.integration.connectionCtas.filter(hasText);
  const indicators = (d.indicatorCategories ?? []).map((category) => ({ ...category, indicators: category.indicators.filter((item) => hasText(item.name)) })).filter((category) => hasText(category.name) || category.indicators.length > 0);
  const externalReferences = d.externalReferences.filter((item) => hasText(item.imageUrl) || hasText(item.title) || hasText(item.url) || hasText(item.notes));

  const hasProfile = [d.profile.photoUrl, d.profile.handle, d.profile.displayName, d.profile.publicationCount, d.profile.followersCount, d.profile.followingCount, d.profile.category, d.profile.bio, d.profile.mainLink].some(hasText);
  const hasStrategy = hasText(d.strategicDirection.channelRole) || objectives.length > 0 || audiences.length > 0;
  const hasProfileWorld = hasProfile || bioPaths.length > 0 || highlights.length > 0 || pinnedPosts.length > 0;
  const hasVisual = hasText(d.visualGuideline) || visualElements.length > 0 || visualAvoidItems.length > 0 || visualReferences.length > 0;
  const hasSimulations = carousel.some((item) => hasText(item.imageUrl) || hasText(item.title)) || [staticCard, reelCover].some((item) => hasText(item.imageUrl) || hasText(item.title) || hasText(item.description));
  const hasConversion = conversionStages.length > 0 || conversionRoutes.length > 0;
  const hasIntegration = receives.length > 0 || directs.length > 0 || connectionCtas.length > 0 || hasText(d.integration.ecosystemRole);
  const hasAny = hasStrategy || hasProfileWorld || hasVisual || hasSimulations || contentFronts.length > 0 || frequencies.length > 0 || hasConversion || hashtagCategories.length > 0 || hasText(d.hashtagUsageGuidance) || hasIntegration || indicators.length > 0 || externalReferences.length > 0;

  return (
    <article className="divide-y divide-slate-100 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
      <PresentationHeader area="Estratégia Editorial e Distribuição de Conteúdo" title="Instagram" slug="instagram" />

      {hasStrategy && (
        <SectionCard title="Visão estratégica">
          <div className="space-y-10">
            {hasText(d.strategicDirection.channelRole) && (
              <div className="max-w-4xl border-l-2 border-slate-900 pl-5 sm:pl-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Papel estratégico do Instagram</p>
                <RichText content={d.strategicDirection.channelRole} className="mt-4 text-base leading-8 text-slate-700" />
              </div>
            )}
            {objectives.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-semibold text-slate-950">Objetivos principais</h3>
                <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
                  {objectives.map((item) => <div key={item.id} className="flex items-start gap-3"><span className="mt-0.5 shrink-0 text-slate-500"><ModuleIcon slug="objetivos-do-projeto" /></span><p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.objective}</p></div>)}
                </div>
              </div>
            )}
            {audiences.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-semibold text-slate-950">Público prioritário</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {audiences.map((item) => <div key={item.id} className="border-t border-slate-300 pt-4">{hasText(item.percentage) && <p className="text-2xl font-semibold text-slate-950">{item.percentage}%</p>}{hasText(item.name) && <h4 className="mt-2 font-semibold text-slate-900">{item.name}</h4>}{hasText(item.description) && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>}</div>)}
                </div>
                <div className="mt-6"><PercentageDistribution items={audiences} /></div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {hasProfileWorld && (
        <SectionCard title="Perfil do Instagram">
          <div className="space-y-10">
            {hasProfile && (
              <div className="max-w-4xl">
                <div className="flex items-start gap-5 sm:gap-8">
                  {hasText(d.profile.photoUrl) && <img src={d.profile.photoUrl} alt={d.profile.displayName || "Foto do perfil do Instagram"} className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-slate-200 sm:h-24 sm:w-24" />}
                  <div className="min-w-0 flex-1">
                    {hasText(d.profile.displayName) && <p className="text-lg font-semibold text-slate-950">{d.profile.displayName}</p>}
                    {hasText(d.profile.handle) && <p className="mt-0.5 break-words text-sm text-slate-500">{d.profile.handle.startsWith("@") ? d.profile.handle : `@${d.profile.handle}`}</p>}
                    {[d.profile.publicationCount, d.profile.followersCount, d.profile.followingCount].some(hasText) && <div className="mt-5 grid max-w-md grid-flow-col auto-cols-fr gap-3 text-center">{[[d.profile.publicationCount, "publicações"], [d.profile.followersCount, "seguidores"], [d.profile.followingCount, "seguindo"]].map(([value, label]) => hasText(value) && <div key={label}><p className="text-lg font-semibold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div>}
                  </div>
                </div>
                {[d.profile.category, d.profile.bio, d.profile.mainLink].some(hasText) && <div className="mt-6 space-y-2">{hasText(d.profile.category) && <p className="text-sm text-slate-500">{d.profile.category}</p>}{hasText(d.profile.bio) && <RichText content={d.profile.bio} className="whitespace-pre-wrap text-sm leading-6 text-slate-800" />}{hasText(d.profile.mainLink) && <a href={d.profile.mainLink} target="_blank" rel="noopener noreferrer" className="block break-all text-sm font-medium text-slate-600 hover:text-slate-950">{d.profile.mainLink}</a>}</div>}
              </div>
            )}
            {highlights.length > 0 && <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Destaques no perfil</p><div className="flex flex-wrap gap-5">{highlights.map((item) => <div key={item.id} className="w-20 text-center">{hasText(item.imageUrl) && <img src={item.imageUrl} alt={item.title || "Destaque do Instagram"} className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-slate-200 ring-offset-2" />}{hasText(item.title) && <p className="mt-3 break-words text-xs font-medium text-slate-700">{item.title}</p>}</div>)}</div></div>}
            {bioPaths.length > 0 && <div className="max-w-4xl border-t border-slate-200 pt-6"><h3 className="font-serif text-xl font-semibold text-slate-950">Caminhos da página de bio</h3><div className="mt-4 divide-y divide-slate-200">{bioPaths.map((item) => <div key={item.id} className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]"><div>{hasText(item.name) && <p className="font-semibold text-slate-900">{item.name}</p>}</div><div>{hasText(item.destination) && (isSafeLink(item.destination) ? <a href={item.destination} target="_blank" rel="noopener noreferrer" className="break-all text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4">{item.destination}</a> : <p className="break-words text-sm font-medium text-slate-700">{item.destination}</p>)}{hasText(item.description) && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-500">{item.description}</p>}</div></div>)}</div></div>}
            {(highlights.length > 0 || pinnedPosts.length > 0) && <div className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">{highlights.length > 0 && <div><h3 className="font-serif text-xl font-semibold text-slate-950">Função dos Destaques</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{highlights.map((item) => <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 p-4">{hasText(item.imageUrl) && <img src={item.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />}<div>{hasText(item.title) && <p className="font-semibold text-slate-900">{item.title}</p>}{hasText(item.purpose) && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.purpose}</p>}</div></div>)}</div></div>}{pinnedPosts.length > 0 && <div><h3 className="font-serif text-xl font-semibold text-slate-950">Publicações fixadas</h3><div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">{pinnedPosts.map((item, index) => <div key={item.id} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">{hasText(item.imageUrl) && <img src={item.imageUrl} alt={item.title || `Publicação fixada ${index + 1}`} className="aspect-square w-full object-cover" />}<div className="p-2.5 sm:p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fixado {index + 1}</p>{hasText(item.title) && <p className="mt-1 break-words text-xs font-semibold text-slate-900 sm:text-sm">{item.title}</p>}{hasText(item.strategicRole) && <p className="mt-1 hidden whitespace-pre-wrap text-xs leading-5 text-slate-500 sm:block">{item.strategicRole}</p>}</div></div>)}</div>{pinnedPosts.some((item) => hasText(item.strategicRole)) && <div className="mt-4 space-y-2 sm:hidden">{pinnedPosts.map((item, index) => hasText(item.strategicRole) && <p key={item.id} className="text-xs leading-5 text-slate-600"><span className="font-semibold">Fixado {index + 1}:</span> {item.strategicRole}</p>)}</div>}</div>}</div>}
          </div>
        </SectionCard>
      )}

      {(hasVisual || hasSimulations) && (
        <SectionCard title="Direção e simulações visuais">
          <div className="space-y-12">
            {hasVisual && <div><h3 className="font-serif text-2xl font-semibold text-slate-950">Direção visual</h3>{hasText(d.visualGuideline) && <div className="mt-5 max-w-4xl border-l-2 border-slate-400 pl-5"><p className="whitespace-pre-wrap text-base leading-7 text-slate-700">{d.visualGuideline}</p></div>}<div className="mt-7 grid gap-7 md:grid-cols-2">{visualElements.length > 0 && <div><p className="text-sm font-semibold text-slate-900">Elementos visuais</p><div className="mt-3 flex flex-wrap gap-2">{visualElements.map((item) => <span key={item.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700"><span aria-hidden="true">◇</span>{item.value}</span>)}</div></div>}{visualAvoidItems.length > 0 && <div><p className="text-sm font-semibold text-red-600">O que evitar</p><div className="mt-3 space-y-2">{visualAvoidItems.map((item) => <div key={item.id} className="flex items-start gap-2"><span className="font-semibold text-red-500" aria-hidden="true">×</span><p className="text-sm leading-6 text-slate-700">{item.value}</p></div>)}</div></div>}</div>{visualReferences.length > 0 && <div className="mt-9"><h4 className="font-serif text-xl font-semibold text-slate-950">Referências visuais</h4><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visualReferences.map((item) => <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200">{hasText(item.url) && <img src={item.url} alt={item.title || "Referência visual do Instagram"} className="aspect-square w-full object-cover" />}{(hasText(item.title) || hasText(item.description)) && <div className="p-4">{hasText(item.title) && <p className="font-semibold text-slate-900">{item.title}</p>}{hasText(item.description) && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>}</div>}</div>)}</div></div>}</div>}
            {hasSimulations && <div className={hasVisual ? "border-t border-slate-200 pt-10" : ""}><h3 className="font-serif text-2xl font-semibold text-slate-950">Simulações visuais de conteúdo</h3><div className="mt-6"><VisualSimulations carousel={carousel} card={staticCard} reel={reelCover} /></div></div>}
          </div>
        </SectionCard>
      )}

      {contentFronts.length > 0 && <SectionCard title="Estratégia de conteúdo"><PercentageDistribution items={contentFronts} /><div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{contentFronts.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-5">{hasText(item.percentage) && <p className="text-2xl font-semibold text-slate-950">{item.percentage}%</p>}{hasText(item.name) && <h3 className="mt-2 font-serif text-xl font-semibold text-slate-950">{item.name}</h3>}{hasText(item.description) && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>}</div>)}</div></SectionCard>}

      {frequencies.length > 0 && <SectionCard title="Formatos e frequência"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{frequencies.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">{hasText(item.format) && <h3 className="text-lg font-semibold text-slate-950">{item.format}</h3>}{(hasText(item.quantity) || hasText(item.period)) && <div className="mt-3 flex flex-wrap items-baseline gap-1.5">{hasText(item.quantity) && <p className="text-2xl font-semibold leading-none text-slate-950">{item.quantity}{hasText(item.period) && "×"}</p>}{hasText(item.period) && <p className="text-sm text-slate-500">{item.period}</p>}</div>}</div>)}</div></SectionCard>}

      {(hasConversion || hasIntegration) && <SectionCard title="Conversão e circulação"><div className="space-y-12">{hasConversion && <div><h3 className="font-serif text-2xl font-semibold text-slate-950">Conversão</h3>{conversionStages.length > 0 && <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{conversionStages.map((stage, index) => <div key={stage.name} className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-semibold tracking-widest text-slate-400">{String(index + 1).padStart(2, "0")}</p><h4 className="mt-2 font-serif text-lg font-semibold text-slate-950">{stage.name}</h4><p className="mt-3 text-sm leading-6 text-slate-600">{stage.description}</p>{hasText(stage.cta) && <div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">CTA</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{stage.cta}</p></div>}{hasText(stage.destination) && <div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Destino</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{stage.destination}</p></div>}</div>)}</div>}{conversionRoutes.length > 0 && <div className="mt-9"><h4 className="font-serif text-xl font-semibold text-slate-950">Rotas de conversão</h4><div className="mt-5 space-y-5">{conversionRoutes.map((route) => <div key={route.id} className="rounded-2xl border border-slate-200 p-5 sm:p-6"><div className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">{hasText(route.name) && <h5 className="font-semibold text-slate-950">{route.name}</h5>}{hasText(route.audience) && <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-700">Para quem:</span> {route.audience}</p>}</div>{route.steps.length > 0 && <div className="mt-5 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">{route.steps.map((step, index) => <div key={step.id} className="contents"><div className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200"><span className="mr-2 text-xs font-semibold text-slate-400">{index + 1}</span>{step.value}</div>{index < route.steps.length - 1 && <span className="self-center text-slate-400"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></span>}</div>)}</div>}</div>)}</div></div>}</div>}{hasIntegration && <div className={hasConversion ? "border-t border-slate-200 pt-10" : ""}><h3 className="font-serif text-2xl font-semibold text-slate-950">Integração com outros canais</h3><div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr] lg:items-stretch">{receives.length > 0 && <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recebe de</p><ul className="mt-3 space-y-2">{receives.map((item, index) => <li key={index} className="text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>} {receives.length > 0 && (hasText(d.integration.ecosystemRole) || directs.length > 0) && <span className="self-center text-center text-slate-400"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></span>}{hasText(d.integration.ecosystemRole) && <div className="rounded-2xl bg-slate-950 p-5 text-white"><p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Instagram no ecossistema</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">{d.integration.ecosystemRole}</p></div>}{directs.length > 0 && hasText(d.integration.ecosystemRole) && <span className="self-center text-center text-slate-400"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></span>}{directs.length > 0 && <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Direciona para</p><ul className="mt-3 space-y-2">{directs.map((item, index) => <li key={index} className="text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>}</div>{connectionCtas.length > 0 && <div className="mt-7"><p className="font-semibold text-slate-900">CTAs de conexão entre canais</p><div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">{connectionCtas.map((item, index) => <div key={index} className="flex gap-3 py-3"><span className="text-xs font-semibold text-slate-400">{String(index + 1).padStart(2, "0")}</span><p className="text-sm leading-6 text-slate-700">{item}</p></div>)}</div></div>}</div>}</div></SectionCard>}

      {(hashtagCategories.length > 0 || hasText(d.hashtagUsageGuidance)) && <SectionCard title="Banco de hashtags"><div className="grid gap-6 md:grid-cols-2">{hashtagCategories.map((category) => <div key={category.id} className="border-t border-slate-300 pt-4">{hasText(category.name) && <h3 className="font-serif text-lg font-semibold text-slate-950">{category.name}</h3>}<div className="mt-3 flex flex-wrap gap-2">{category.hashtags.map((hashtag, index) => <span key={index} className="max-w-full break-words rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700">{hashtag}</span>)}</div></div>)}</div>{hasText(d.hashtagUsageGuidance) && <div className="mt-8 max-w-4xl border-l-2 border-slate-300 pl-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Orientação de uso</p><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{d.hashtagUsageGuidance}</p></div>}</SectionCard>}

      {indicators.length > 0 && <SectionCard title="Indicadores principais"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{indicators.map((category) => <div key={category.id} className="rounded-2xl border border-slate-200 p-5">{hasText(category.name) && <h3 className="font-serif text-lg font-semibold text-slate-950">{category.name}</h3>}<ul className="mt-4 space-y-3">{category.indicators.map((item) => <li key={item.id} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />{item.name}</li>)}</ul></div>)}</div></SectionCard>}

      {externalReferences.length > 0 && <SectionCard title="Referências externas"><div className="grid gap-4 md:grid-cols-2">{externalReferences.map((item) => <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 sm:p-5">{hasText(item.imageUrl) && <img src={item.imageUrl} alt={item.title || "Referência externa"} className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-slate-200" />}<div className="min-w-0">{hasText(item.title) && <h3 className="font-semibold text-slate-950">{item.title}</h3>}{hasText(item.url) && (isSafeLink(item.url) ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm text-slate-500 underline decoration-slate-300 underline-offset-4">{item.url}</a> : <p className="mt-1 break-all text-sm text-slate-500">{item.url}</p>)}{hasText(item.notes) && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.notes}</p>}</div></div>)}</div></SectionCard>}

      {!hasAny && <EmptyState />}
    </article>
  );
}
