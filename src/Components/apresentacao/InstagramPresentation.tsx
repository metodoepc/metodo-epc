import {
  normalizeInstagramData,
  hasMeaningfulInstagramContent,
} from "@/lib/normalizeInstagramData";
import { PresentationHeader } from "./PresentationHeader";
import { RichText } from "./RichText";
import { ModuleIcon } from "./ModuleIcon";
import {
  TextList,
  FieldBlock,
  SectionCard,
  EmptyState,
  TextItem,
} from "./ChannelPresentationShared";

type InstagramPresentationProps = {
  data: unknown;
};

// ─── Local helpers ────────────────────────────────────────────────────────────

/** True only when value is a non-empty string after trim. Does not strip HTML. */
function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Returns only the strings in arr that pass hasText; preserves order. */
function filterFilledStrings(arr: string[]): string[] {
  return arr.filter((s) => hasText(s));
}

// ─────────────────────────────────────────────────────────────────────────────

const VALIDATION_STATUS_LABELS: Record<"hypothesis" | "validated", string> = {
  hypothesis: "Hipótese",
  validated: "Validado",
};

function PlainTextField({ label, value }: { label: string; value: string }) {
  if (!hasText(value)) return null;
  return (
    <div>
      <p className="text-base font-semibold text-slate-950">{label}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{value}</p>
    </div>
  );
}

export default function InstagramPresentation({ data }: InstagramPresentationProps) {
  // Server component — normalize once per render; no hooks needed.
  const d = normalizeInstagramData(data);

  // ─── Frequência ─────────────────────────────────────────────────────────────
  const visibleFreqItems = d.publishing.frequencyItems.filter(
    (item) =>
      hasText(item.format) ||
      hasText(item.quantity) ||
      hasText(item.period)
  );

  // ─── Objetivos ──────────────────────────────────────────────────────────────
  const objectiveItems = d.objectives.filter(
    (item) => hasText(item.objective)
  );

  // ─── Stories estratégicos ───────────────────────────────────────────────────
  // name (v2) ← stories[].value (v1 legacy) via normalization
  const strategicStories = d.contentArchitecture.stories.filter(
    (item) =>
      hasText(item.name) ||
      hasText(item.frequency) ||
      hasText(item.journeyStage) ||
      hasText(item.cta)
  );

  // ─── Estruturas de linguagem ────────────────────────────────────────────────
  // howItAppears (v2) ← languageStructures[].value (v1 legacy)
  const languageStructureItems = d.languageStructures.filter(
    (item) => hasText(item.name)
  );

  // ─── Hashtags ───────────────────────────────────────────────────────────────
  // hashtags (v2) ← legacy hashtags grouped under single category via normalization
  const hashtagCategories = d.hashtags.filter(
    (cat) =>
      hasText(cat.name) ||
      hasText(cat.notes) ||
      filterFilledStrings(cat.hashtags).length > 0
  );

  // spread before sort to avoid mutating d.visualDirection.references
  // url (v2) ← visualReferences[].image (v1 legacy)
  const visualReferenceItems = [...d.visualDirection.references]
    .sort((a, b) => a.order - b.order)
    .filter(
      (ref) => hasText(ref.url) || hasText(ref.title) || hasText(ref.description)
    );

  // ─── Indicadores e mensuração ───────────────────────────────────────────────
  const primaryIndicators: TextItem[] = filterFilledStrings(
    d.measurement.primaryIndicators
  ).map((s) => ({ value: s }));
  const secondaryIndicators: TextItem[] = filterFilledStrings(
    d.measurement.secondaryIndicators
  ).map((s) => ({ value: s }));
  const vanityMetrics: TextItem[] = filterFilledStrings(d.measurement.vanityMetrics).map(
    (s) => ({ value: s })
  );
  const measurementHypotheses: TextItem[] = filterFilledStrings(d.measurement.hypotheses).map(
    (s) => ({ value: s })
  );

  // ─── Integração com outros canais ───────────────────────────────────────────
  const receivesAudienceFrom: TextItem[] = filterFilledStrings(
    d.integration.receivesAudienceFrom
  ).map((s) => ({ value: s }));
  const directsAudienceTo: TextItem[] = filterFilledStrings(
    d.integration.directsAudienceTo
  ).map((s) => ({ value: s }));
  const connectionCtas: TextItem[] = filterFilledStrings(d.integration.connectionCtas).map(
    (s) => ({ value: s })
  );
  // ─── Perfil ─────────────────────────────────────────────────────────────────
  const profilePhotoUrl = d.profile.photoUrl;
  const profileHandle = d.profile.handle;
  const profileName = d.profile.displayName;
  const profilePublicationCount = d.profile.publicationCount;
  const profileFollowersCount = d.profile.followersCount;
  const profileFollowingCount = d.profile.followingCount;
  const profileCategory = d.profile.category;
  const bioText = d.profile.bio;
  const bioLink = d.profile.mainLink;
  // highlights[].title (v2) ← highlights CSV string (v1 legacy); now structured
  // spread before sort to avoid mutating d.profile.highlights
  const profileHighlights = [...d.profile.highlights]
    .sort((a, b) => a.order - b.order)
    .filter((item) => hasText(item.title) || hasText(item.purpose) || hasText(item.imageUrl));

  // ─── Referências externas ───────────────────────────────────────────────────
  // url (v2) ← references[].link (v1 legacy)
  const externalReferenceItems = d.externalReferences.filter(
    (ref) =>
      hasText(ref.imageUrl) ||
      hasText(ref.title) ||
      hasText(ref.url) ||
      hasText(ref.notes)
  );

  // ─── Condições de seção ─────────────────────────────────────────────────────

  const hasStrategicDirectionSection = hasText(
    d.strategicDirection.channelRole
  );

  const hasFrequencySection = visibleFreqItems.length > 0;

  const hasContentAndLanguageSection =
    objectiveItems.length > 0 ||
    strategicStories.length > 0 ||
    languageStructureItems.length > 0 ||
    hashtagCategories.length > 0;

  const hasVisualDirectionSection = visualReferenceItems.length > 0;

  const hasDiscoveryConversion =
    hasText(d.conversion.discovery.cta) ||
    hasText(d.conversion.discovery.destination);

  const hasConsiderationConversion =
    hasText(d.conversion.consideration.cta) ||
    hasText(d.conversion.consideration.destination);

  const hasDecisionConversion =
    hasText(d.conversion.decision.cta) ||
    hasText(d.conversion.decision.destination);

  const hasConversionSection =
    hasDiscoveryConversion ||
    hasConsiderationConversion ||
    hasDecisionConversion;

  const hasMeasurementSection =
    primaryIndicators.length > 0 ||
    secondaryIndicators.length > 0 ||
    vanityMetrics.length > 0 ||
    measurementHypotheses.length > 0 ||
    hasText(d.measurement.weeklyReview) ||
    hasText(d.measurement.monthlyReview) ||
    hasText(d.measurement.keepCriterion) ||
    hasText(d.measurement.adjustCriterion) ||
    hasText(d.measurement.stopCriterion) ||
    hasText(d.measurement.baseline);

  const hasIntegrationSection =
    receivesAudienceFrom.length > 0 ||
    directsAudienceTo.length > 0 ||
    connectionCtas.length > 0 ||
    hasText(d.integration.ecosystemRole);

  const hasExternalReferencesSection = externalReferenceItems.length > 0;

  // profile.enabled intentionally not used — section shows based on content presence
  const hasProfileSection =
    hasText(profilePhotoUrl) ||
    hasText(profileHandle) ||
    hasText(profileName) ||
    hasText(profilePublicationCount) ||
    hasText(profileFollowersCount) ||
    hasText(profileFollowingCount) ||
    hasText(profileCategory) ||
    hasText(bioText) ||
    hasText(bioLink) ||
    profileHighlights.length > 0;

  const hasVisibleInstagramContent =
    hasMeaningfulInstagramContent(d) ||
    hasFrequencySection ||
    hasContentAndLanguageSection ||
    hasVisualDirectionSection ||
    hasConversionSection ||
    hasIntegrationSection ||
    hasProfileSection ||
    hasExternalReferencesSection;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <article className="divide-y divide-slate-100 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
      <PresentationHeader
        area="Estratégia Editorial e Distribuição de Conteúdo"
        title="Instagram"
        slug="instagram"
      />

      {hasProfileSection && (
        <SectionCard title="Apresentação visual do Instagram">
          <div className="space-y-6">
            {(hasText(profilePhotoUrl) ||
              hasText(profileName) ||
              hasText(profileHandle) ||
              hasText(profilePublicationCount) ||
              hasText(profileFollowersCount) ||
              hasText(profileFollowingCount)) && (
              <div className="flex items-start gap-5 sm:gap-8">
                {hasText(profilePhotoUrl) && (
                  // img used intentionally: photoUrl may be a base64 data URL (legacy) or HTTPS URL
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePhotoUrl}
                    alt={hasText(profileName) ? profileName : "Foto do perfil do Instagram"}
                    className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-slate-200 sm:h-24 sm:w-24"
                  />
                )}

                <div className="min-w-0 flex-1">
                  {hasText(profileName) && (
                    <p className="text-lg font-semibold text-slate-950">{profileName}</p>
                  )}
                  {hasText(profileHandle) && (
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {profileHandle.startsWith("@") ? profileHandle : `@${profileHandle}`}
                    </p>
                  )}

                  {(hasText(profilePublicationCount) ||
                    hasText(profileFollowersCount) ||
                    hasText(profileFollowingCount)) && (
                    <div className="mt-5 grid max-w-md grid-flow-col auto-cols-fr gap-3 text-center">
                      {hasText(profilePublicationCount) && (
                        <div>
                          <p className="text-lg font-semibold text-slate-950">
                            {profilePublicationCount}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">publicações</p>
                        </div>
                      )}
                      {hasText(profileFollowersCount) && (
                        <div>
                          <p className="text-lg font-semibold text-slate-950">
                            {profileFollowersCount}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">seguidores</p>
                        </div>
                      )}
                      {hasText(profileFollowingCount) && (
                        <div>
                          <p className="text-lg font-semibold text-slate-950">
                            {profileFollowingCount}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">seguindo</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {(hasText(profileCategory) || hasText(bioText) || hasText(bioLink)) && (
              <div className="space-y-2">
                {hasText(profileCategory) && (
                  <p className="text-sm text-slate-500">{profileCategory}</p>
                )}
                {hasText(bioText) && (
                  <RichText
                    content={bioText}
                    className="whitespace-pre-wrap text-sm leading-6 text-slate-800"
                  />
                )}
                {hasText(bioLink) && (
                  <a
                    href={bioLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-sm font-medium text-slate-600 hover:text-slate-950"
                  >
                    {bioLink}
                  </a>
                )}
              </div>
            )}
          </div>

          {profileHighlights.length > 0 && (
            <div>
              <p className="mb-3 mt-8 text-base font-semibold uppercase tracking-[0.22em] text-[#5f6f8a]">
                Destaques
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profileHighlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    {hasText(highlight.imageUrl) && (
                      // img used intentionally: imageUrl may be a base64 data URL (legacy) or HTTPS URL
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={highlight.imageUrl}
                        alt={hasText(highlight.title) ? highlight.title : "Imagem do destaque do Instagram"}
                        className="mb-3 h-16 w-16 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    )}
                    {hasText(highlight.title) && (
                      <p className="text-sm font-medium text-slate-950">{highlight.title}</p>
                    )}
                    {hasText(highlight.purpose) && (
                      <p className="mt-1 text-xs leading-5 text-slate-500">{highlight.purpose}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {hasStrategicDirectionSection && (
        <SectionCard title="Direção estratégica">
          <div className="space-y-4">
            {hasText(d.strategicDirection.channelRole) && (
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h3 className="text-base font-semibold text-slate-950">
                  Papel estratégico do Instagram
                </h3>
                <RichText
                  content={d.strategicDirection.channelRole}
                  className="mt-3 text-sm leading-7 text-slate-700"
                />
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {hasFrequencySection && (
        <SectionCard title="Frequência de publicação">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {visibleFreqItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
              >
                {hasText(item.format) && (
                  <h3 className="text-lg font-semibold text-slate-950">{item.format}</h3>
                )}
                {(hasText(item.quantity) || hasText(item.period)) && (
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                    {hasText(item.quantity) && (
                      <p className="whitespace-pre-wrap text-2xl font-semibold leading-none text-slate-950">
                        {item.quantity}
                        {hasText(item.period) && "×"}
                      </p>
                    )}
                    {hasText(item.period) && (
                      <p className="whitespace-pre-wrap text-sm text-slate-500">
                        {item.period}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {hasContentAndLanguageSection && (
        <SectionCard title="Conteúdo e linguagem">
          <div className="space-y-10">
            {objectiveItems.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Objetivos do canal
                  </h3>
                </div>
                <div className="space-y-5">
                  {objectiveItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 shrink-0 text-slate-500">
                        <ModuleIcon slug="objetivos-do-projeto" />
                      </div>
                      <p className="whitespace-pre-wrap text-base leading-7 text-slate-800">
                        {item.objective}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {strategicStories.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Stories estratégicos
                  </h3>
                </div>
                <div className="space-y-4">
                  {strategicStories.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200"
                    >
                      {hasText(item.name) && (
                        <div>
                          <p className="text-sm font-medium text-slate-500">Nome do Story estratégico</p>
                          <h4 className="mt-2 text-xl font-semibold text-slate-950">{item.name}</h4>
                        </div>
                      )}
                      {(hasText(item.frequency) || hasText(item.journeyStage)) && (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <PlainTextField label="Frequência" value={item.frequency} />
                        <PlainTextField label="Etapa da jornada" value={item.journeyStage} />
                        </div>
                      )}
                      {hasText(item.cta) && (
                        <div className="mt-5 border-t border-slate-200 pt-5">
                          <PlainTextField label="CTA" value={item.cta} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languageStructureItems.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Estruturas de linguagem
                  </h3>
                </div>
                <div className="space-y-6">
                  {languageStructureItems.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0 text-slate-500">
                          <ModuleIcon slug="tom-de-voz" />
                        </div>
                        <h4 className="text-lg font-semibold leading-7 text-slate-950">
                          {item.name}
                        </h4>
                      </div>
                      {hasText(item.avoid) && (
                        <div className="flex items-start gap-4 pl-1">
                          <span className="shrink-0 text-xl leading-7 text-slate-400" aria-hidden="true">
                            ×
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-600">O que evitar</p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                              {item.avoid}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hashtagCategories.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Hashtags
                  </h3>
                </div>
                <div className="space-y-4">
                  {hashtagCategories.map((cat) => {
                    const filledHashtags: TextItem[] = filterFilledStrings(cat.hashtags).map(
                      (h) => ({ value: h })
                    );
                    return (
                      <div
                        key={cat.id}
                        className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200"
                      >
                        <PlainTextField label="Categoria" value={cat.name} />
                        {filledHashtags.length > 0 && (
                          <div>
                            <h4 className="text-base font-semibold text-slate-950">
                              Hashtags da categoria
                            </h4>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {filledHashtags.map((hashtag, index) => (
                                <span
                                  key={`${cat.id}-${index}`}
                                  className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                                >
                                  {hashtag.value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <PlainTextField label="Observações" value={cat.notes} />
                        <PlainTextField
                          label="Status de validação"
                          value={VALIDATION_STATUS_LABELS[cat.validationStatus]}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {hasVisualDirectionSection && (
        <SectionCard title="Identidade visual">
          <div className="space-y-4">
          {visualReferenceItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-950">
                Referências visuais
              </h3>
              <div className="space-y-4">
                {visualReferenceItems.map((ref) => (
                  <div
                    key={ref.id}
                    className="overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200"
                  >
                    {hasText(ref.url) && (
                      // img used intentionally: url may be a base64 data URL (legacy) or HTTPS URL
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ref.url}
                        alt={hasText(ref.title) ? ref.title : "Referência visual do Instagram"}
                        className="aspect-square w-full object-cover"
                      />
                    )}
                    {(hasText(ref.title) || hasText(ref.description)) && (
                      <div className="p-6">
                        {hasText(ref.title) && (
                          <p className="text-base font-semibold text-slate-950">{ref.title}</p>
                        )}
                        {hasText(ref.description) && (
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {ref.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </SectionCard>
      )}

      {hasConversionSection && (
        <SectionCard title="Conversão">
          <div className="space-y-10">
            {(hasDiscoveryConversion || hasConsiderationConversion || hasDecisionConversion) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Etapas de conversão
                  </h3>
                </div>
                <div className="space-y-4">
                  {hasDiscoveryConversion && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <h4 className="text-xl font-semibold text-slate-950">Descoberta</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Primeiro contato e progressão para um próximo conteúdo ou ponto de interesse.
                      </p>
                      <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
                        <PlainTextField label="CTA" value={d.conversion.discovery.cta} />
                        <PlainTextField label="Destino" value={d.conversion.discovery.destination} />
                      </div>
                    </div>
                  )}
                  {hasConsiderationConversion && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <h4 className="text-xl font-semibold text-slate-950">Consideração</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Aprofundamento do problema, da solução ou do método.
                      </p>
                      <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
                        <PlainTextField label="CTA" value={d.conversion.consideration.cta} />
                        <PlainTextField label="Destino" value={d.conversion.consideration.destination} />
                      </div>
                    </div>
                  )}
                  {hasDecisionConversion && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <h4 className="text-xl font-semibold text-slate-950">Decisão</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Encaminhamento para a ação comercial ou conversa qualificada.
                      </p>
                      <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
                        <PlainTextField label="CTA" value={d.conversion.decision.cta} />
                        <PlainTextField label="Destino" value={d.conversion.decision.destination} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </SectionCard>
      )}

      {false && hasMeasurementSection && (
        <SectionCard title="Indicadores e mensuração">
          <div className="space-y-10">
            {(primaryIndicators.length > 0 ||
              secondaryIndicators.length > 0 ||
              vanityMetrics.length > 0) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Indicadores de desempenho
                  </h3>
                </div>
                <div className="space-y-4">
                  {primaryIndicators.length > 0 && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                        <TextList items={primaryIndicators} label="Indicadores principais" />
                      </div>
                    </div>
                  )}
                  {secondaryIndicators.length > 0 && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                        <TextList items={secondaryIndicators} label="Indicadores secundários" />
                      </div>
                    </div>
                  )}
                  {vanityMetrics.length > 0 && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                        <TextList items={vanityMetrics} label="Métricas de vaidade" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(hasText(d.measurement.weeklyReview) || hasText(d.measurement.monthlyReview)) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Rotina de análise
                  </h3>
                </div>
                <div className="space-y-4">
                  {hasText(d.measurement.weeklyReview) && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <PlainTextField label="Revisão semanal" value={d.measurement.weeklyReview} />
                    </div>
                  )}
                  {hasText(d.measurement.monthlyReview) && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <PlainTextField label="Revisão mensal" value={d.measurement.monthlyReview} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {(hasText(d.measurement.keepCriterion) ||
              hasText(d.measurement.adjustCriterion) ||
              hasText(d.measurement.stopCriterion)) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Critérios de decisão
                  </h3>
                </div>
                <div className="space-y-4">
                  {hasText(d.measurement.keepCriterion) && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <PlainTextField
                        label="Critério para manter"
                        value={d.measurement.keepCriterion}
                      />
                    </div>
                  )}
                  {hasText(d.measurement.adjustCriterion) && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <PlainTextField
                        label="Critério para ajustar"
                        value={d.measurement.adjustCriterion}
                      />
                    </div>
                  )}
                  {hasText(d.measurement.stopCriterion) && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <PlainTextField
                        label="Critério para interromper"
                        value={d.measurement.stopCriterion}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {(hasText(d.measurement.baseline) || measurementHypotheses.length > 0) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    Linha de base e hipóteses
                  </h3>
                </div>
                <div className="space-y-4">
                  {hasText(d.measurement.baseline) && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <PlainTextField label="Linha de base" value={d.measurement.baseline} />
                    </div>
                  )}
                  {measurementHypotheses.length > 0 && (
                    <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                      <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                        <TextList items={measurementHypotheses} label="Hipóteses a testar" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {hasIntegrationSection && (
        <SectionCard title="Integração com outros canais">
          <div className="space-y-4">
            {hasText(d.integration.ecosystemRole) && (
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <PlainTextField
                  label="Papel do Instagram no ecossistema"
                  value={d.integration.ecosystemRole}
                />
              </div>
            )}
            {receivesAudienceFrom.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                  <TextList items={receivesAudienceFrom} label="Recebe audiência de" />
                </div>
              </div>
            )}
            {directsAudienceTo.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                  <TextList items={directsAudienceTo} label="Direciona audiência para" />
                </div>
              </div>
            )}
            {connectionCtas.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="[&>div>p]:mb-3 [&>div>p]:mt-0 [&>div>p]:text-base [&>div>p]:font-semibold [&>div>p]:normal-case [&>div>p]:tracking-normal [&>div>p]:text-slate-950">
                  <TextList items={connectionCtas} label="CTAs de conexão entre canais" />
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}
      
      {hasExternalReferencesSection && (
        <SectionCard title="Referências externas">
          <div className="space-y-4">
            {externalReferenceItems.map((ref) => (
              <div
                key={ref.id}
                className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200"
              >
                {hasText(ref.imageUrl) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ref.imageUrl}
                    alt={hasText(ref.title) ? ref.title : "Imagem da referência externa"}
                    className="mb-5 aspect-video w-full rounded-2xl object-cover"
                  />
                )}
                {hasText(ref.title) && (
                  <h3 className="text-base font-semibold text-slate-950">{ref.title}</h3>
                )}
                {hasText(ref.url) && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block break-all text-sm text-slate-500 hover:text-slate-950"
                  >
                    {ref.url}
                  </a>
                )}
                <PlainTextField label="Observações" value={ref.notes} />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {!hasVisibleInstagramContent && <EmptyState />}
    </article>
  );
}
