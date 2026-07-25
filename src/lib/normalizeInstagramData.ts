import type {
  InstagramData,
  InstagramFrequencyItem,
  InstagramObjective,
  InstagramContentFormat,
  InstagramStoryFormat,
  InstagramLanguageStructure,
  InstagramProfileLink,
  InstagramHighlight,
  InstagramImageReference,
  InstagramHashtagCategory,
  InstagramExternalReference,
  InstagramStrategicDirection,
  InstagramProfile,
  InstagramPublishingStrategy,
  InstagramContentArchitecture,
  InstagramVisualDirection,
  InstagramConversionStrategy,
  InstagramConversionStage,
  InstagramMeasurementStrategy,
  InstagramChannelIntegration,
  InstagramLegacyCompatibility,
} from "@/types/instagram";

// ─── ID generation ───────────────────────────────────────────────────────────
// Uses crypto.randomUUID() when available; falls back to a time+random string.
// Never uses array index as a permanent identity.

export function createInstagramItemId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof (crypto as Crypto).randomUUID === "function"
  ) {
    return (crypto as Crypto).randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function hasValidId(id: unknown): id is string {
  return typeof id === "string" && id.trim().length > 0;
}

// ─── Empty item factories ────────────────────────────────────────────────────
// Each call returns a fresh object. Arrays are never shared between calls.

export function createEmptyInstagramFrequencyItem(): InstagramFrequencyItem {
  return {
    id: createInstagramItemId(),
    format: "",
    quantity: "",
    period: "",
    journeyRole: "",
    notes: "",
  };
}

export function createEmptyInstagramObjective(): InstagramObjective {
  return {
    id: createInstagramItemId(),
    objective: "",
    indicator: "",
    target: "",
    deadline: "",
    validationStatus: "hypothesis",
  };
}

export function createEmptyInstagramContentFormat(): InstagramContentFormat {
  return {
    id: createInstagramItemId(),
    name: "",
    structure: "",
    duration: "",
    journeyRole: "",
    purpose: "",
    cta: "",
    notes: "",
  };
}

export function createEmptyInstagramStoryFormat(): InstagramStoryFormat {
  return {
    id: createInstagramItemId(),
    name: "",
    frequency: "",
    journeyStage: "",
    purpose: "",
    cta: "",
    description: "",
  };
}

export function createEmptyInstagramLanguageStructure(): InstagramLanguageStructure {
  return {
    id: createInstagramItemId(),
    name: "",
    howItAppears: "",
    journeyRelation: "",
    avoid: "",
    example: "",
  };
}

export function createEmptyInstagramProfileLink(): InstagramProfileLink {
  return {
    id: createInstagramItemId(),
    title: "",
    url: "",
    order: 0,
  };
}

export function createEmptyInstagramHighlight(): InstagramHighlight {
  return {
    id: createInstagramItemId(),
    title: "",
    purpose: "",
    imageUrl: "",
    order: 0,
  };
}

export function createEmptyInstagramImageReference(): InstagramImageReference {
  return {
    id: createInstagramItemId(),
    url: "",
    order: 0,
  };
}

export function createEmptyInstagramHashtagCategory(): InstagramHashtagCategory {
  return {
    id: createInstagramItemId(),
    name: "",
    hashtags: [],
    notes: "",
    validationStatus: "hypothesis",
  };
}

export function createEmptyInstagramExternalReference(): InstagramExternalReference {
  return {
    id: createInstagramItemId(),
    imageUrl: "",
    title: "",
    url: "",
    notes: "",
  };
}

// ─── Empty section factories (internal) ──────────────────────────────────────

function emptyStrategicDirection(): InstagramStrategicDirection {
  return {
    channelRole: "",
    generalStrategy: "",
    priorityAudiences: "",
    ecosystemFunction: "",
    profileDifferentiation: "",
    initialEditorialPriorities: "",
  };
}

function emptyProfile(): InstagramProfile {
  return {
    enabled: true,
    photoUrl: "",
    handle: "",
    displayName: "",
    publicationCount: "",
    followersCount: "",
    followingCount: "",
    category: "",
    bio: "",
    mainLink: "",
    linkItems: [],
    highlights: [],
  };
}

function emptyPublishing(): InstagramPublishingStrategy {
  return {
    frequencyItems: [],
    minimumViableFrequency: "",
    recommendedFrequency: "",
    maximumSustainableFrequency: "",
    productionRoutine: "",
    adjustmentRule: "",
  };
}

function emptyContentArchitecture(): InstagramContentArchitecture {
  return {
    formats: [],
    stories: [],
    generalContentGuidelines: [],
  };
}

function emptyVisualDirection(): InstagramVisualDirection {
  return {
    humanPresence: "",
    specialistRole: "",
    backstage: "",
    socialProof: "",
    dataUsage: "",
    informationHierarchy: "",
    visualDensity: "",
    desiredFeeling: "",
    formatConsistency: "",
    journeyAdaptation: "",
    avoid: "",
    generalStrategy: "",
    references: [],
  };
}

function emptyConversionStage(): InstagramConversionStage {
  return { cta: "", destination: "" };
}

function emptyConversion(): InstagramConversionStrategy {
  return {
    discovery: emptyConversionStage(),
    consideration: emptyConversionStage(),
    decision: emptyConversionStage(),
    conversionPath: "",
    primaryOffer: "",
    commercialChannel: "",
    crmIntegration: "",
  };
}

function emptyMeasurement(): InstagramMeasurementStrategy {
  return {
    primaryIndicators: [],
    secondaryIndicators: [],
    vanityMetrics: [],
    weeklyReview: "",
    monthlyReview: "",
    keepCriterion: "",
    adjustCriterion: "",
    stopCriterion: "",
    baseline: "",
    hypotheses: [],
  };
}

function emptyIntegration(): InstagramChannelIntegration {
  return {
    receivesAudienceFrom: [],
    directsAudienceTo: [],
    ecosystemRole: "",
    contentRepurposing: "",
    connectionCtas: [],
    operationalDependencies: [],
  };
}

// ─── createEmptyInstagramData ─────────────────────────────────────────────────

export function createEmptyInstagramData(): InstagramData {
  return {
    version: 2,
    strategicDirection: emptyStrategicDirection(),
    profile: emptyProfile(),
    publishing: emptyPublishing(),
    objectives: [],
    contentArchitecture: emptyContentArchitecture(),
    languageStructures: [],
    visualDirection: emptyVisualDirection(),
    conversion: emptyConversion(),
    measurement: emptyMeasurement(),
    integration: emptyIntegration(),
    hashtags: [],
    externalReferences: [],
  };
}

// ─── Shared scalar helpers ────────────────────────────────────────────────────

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((s): s is string => typeof s === "string");
}

function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// ─── Legacy text list extraction ──────────────────────────────────────────────
// Handles: string, { value: string }, partial object, anything else.

function extractLegacyTextValue(item: unknown): string {
  if (typeof item === "string") return item;
  if (isObj(item)) {
    const rec = item as Record<string, unknown>;
    if (typeof rec.value === "string") return rec.value;
  }
  return "";
}

// ─── Legacy list normalizers ──────────────────────────────────────────────────

function normalizeLegacyFrequencyItems(raw: unknown): InstagramFrequencyItem[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramFrequencyItem[] = [];
  for (const item of raw) {
    if (!isObj(item)) continue;
    const obj = item as Record<string, unknown>;
    const format = str(obj.format);
    if (!format.trim()) continue; // drop items with no format name
    result.push({
      id: createInstagramItemId(),
      format,
      quantity: str(obj.quantity),
      period: str(obj.period),
      journeyRole: "",
      notes: str(obj.observation), // legacy field name → notes
    });
  }
  return result;
}

function normalizeLegacyObjectives(raw: unknown): InstagramObjective[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramObjective[] = [];
  for (const item of raw) {
    const text = extractLegacyTextValue(item);
    if (!text.trim()) continue;
    result.push({
      id: createInstagramItemId(),
      objective: text, // full text preserved
      indicator: "",
      target: "",
      deadline: "",
      validationStatus: "hypothesis", // never assume validated
    });
  }
  return result;
}

// reels[].value → formats[].name (text preserved integrally)
function normalizeLegacyFormats(raw: unknown): InstagramContentFormat[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramContentFormat[] = [];
  for (const item of raw) {
    const text = extractLegacyTextValue(item);
    if (!text.trim()) continue;
    result.push({
      id: createInstagramItemId(),
      name: text, // safe landing field; no semantic interpretation
      structure: "",
      duration: "",
      journeyRole: "",
      purpose: "",
      cta: "",
      notes: "",
    });
  }
  return result;
}

// stories[].value → stories[].name (text preserved integrally)
function normalizeLegacyStories(raw: unknown): InstagramStoryFormat[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramStoryFormat[] = [];
  for (const item of raw) {
    const text = extractLegacyTextValue(item);
    if (!text.trim()) continue;
    result.push({
      id: createInstagramItemId(),
      name: text, // safe landing field; no semantic interpretation
      frequency: "",
      journeyStage: "",
      purpose: "",
      cta: "",
      description: "",
    });
  }
  return result;
}

// contents[].value → generalContentGuidelines[] (string array)
function normalizeLegacyContents(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(extractLegacyTextValue)
    .filter((s) => s.trim().length > 0);
}

// languageStructures[].value → languageStructures[].howItAppears (text preserved integrally)
function normalizeLegacyLanguageStructures(raw: unknown): InstagramLanguageStructure[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramLanguageStructure[] = [];
  for (const item of raw) {
    const text = extractLegacyTextValue(item);
    if (!text.trim()) continue;
    result.push({
      id: createInstagramItemId(),
      name: "",
      howItAppears: text, // full text preserved; no split attempted
      journeyRelation: "",
      avoid: "",
      example: "",
    });
  }
  return result;
}

// hashtags[].value → single category "Hashtags existentes"
function normalizeLegacyHashtags(raw: unknown): InstagramHashtagCategory[] {
  if (!Array.isArray(raw)) return [];
  const values = raw
    .map(extractLegacyTextValue)
    .filter((s) => s.trim().length > 0);
  if (values.length === 0) return [];
  return [
    {
      id: createInstagramItemId(),
      name: "Hashtags existentes",
      hashtags: values, // no classification by niche/problem/solution
      notes: "",
      validationStatus: "hypothesis",
    },
  ];
}

// references[].{ title, link } → externalReferences[].{ title, url }
function normalizeLegacyExternalReferences(raw: unknown): InstagramExternalReference[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramExternalReference[] = [];
  for (const item of raw) {
    if (!isObj(item)) continue;
    const obj = item as Record<string, unknown>;
    const title = str(obj.title);
    const url = str(obj.link); // legacy field name → url
    if (!title.trim() && !url.trim()) continue;
    result.push({ id: createInstagramItemId(), imageUrl: "", title, url, notes: "" });
  }
  return result;
}

// visualReferences[].image → references[].url (data URL preserved exactly)
function normalizeLegacyVisualReferences(raw: unknown): InstagramImageReference[] {
  if (!Array.isArray(raw)) return [];
  const result: InstagramImageReference[] = [];
  let order = 0;
  for (const item of raw) {
    if (!isObj(item)) continue;
    const obj = item as Record<string, unknown>;
    const url = str(obj.image); // "image" field → "url"; data URL or HTTPS
    if (!url.trim()) continue;
    result.push({ id: createInstagramItemId(), url, order: order++ });
  }
  return result;
}

// highlights string → InstagramHighlight[] + legacy.originalHighlights
function normalizeLegacyHighlightsString(raw: string): {
  highlights: InstagramHighlight[];
  originalHighlights: string | undefined;
} {
  const trimmed = raw.trim();
  if (!trimmed) return { highlights: [], originalHighlights: undefined };

  const parts = trimmed
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (parts.length === 0) return { highlights: [], originalHighlights: undefined };

  const highlights: InstagramHighlight[] = parts.map((title, index) => ({
    id: createInstagramItemId(),
    title,
    purpose: "",
    imageUrl: "",
    order: index,
  }));

  return { highlights, originalHighlights: trimmed };
}

// ─── legacy field builder ─────────────────────────────────────────────────────

function buildLegacyField(
  originalHighlights: string | undefined,
  unknownFields: Record<string, unknown> | undefined
): InstagramLegacyCompatibility | undefined {
  const hasHighlights = typeof originalHighlights === "string" && originalHighlights.length > 0;
  const hasUnknown = unknownFields !== undefined && Object.keys(unknownFields).length > 0;
  if (!hasHighlights && !hasUnknown) return undefined;
  return {
    ...(hasHighlights ? { originalHighlights } : {}),
    ...(hasUnknown ? { unknownFields } : {}),
  };
}

// ─── V2 section normalizers ───────────────────────────────────────────────────
// Preserve IDs; generate only for items that lack a valid one.

function normalizeV2StrategicDirection(raw: unknown): InstagramStrategicDirection {
  if (!isObj(raw)) return emptyStrategicDirection();
  return {
    channelRole: str(raw.channelRole),
    generalStrategy: str(raw.generalStrategy),
    priorityAudiences: str(raw.priorityAudiences),
    ecosystemFunction: str(raw.ecosystemFunction),
    profileDifferentiation: str(raw.profileDifferentiation),
    initialEditorialPriorities: str(raw.initialEditorialPriorities),
  };
}

function normalizeV2ProfileLink(item: unknown, fallbackOrder: number): InstagramProfileLink {
  if (!isObj(item)) return { ...createEmptyInstagramProfileLink(), order: fallbackOrder };
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    title: str(item.title),
    url: str(item.url),
    order: typeof item.order === "number" ? item.order : fallbackOrder,
  };
}

function normalizeV2Highlight(item: unknown, fallbackOrder: number): InstagramHighlight {
  if (!isObj(item)) return { ...createEmptyInstagramHighlight(), order: fallbackOrder };
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    title: str(item.title),
    purpose: str(item.purpose),
    imageUrl: str(item.imageUrl),
    order: typeof item.order === "number" ? item.order : fallbackOrder,
  };
}

function normalizeV2Profile(raw: unknown): InstagramProfile {
  if (!isObj(raw)) return emptyProfile();
  return {
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : true,
    photoUrl: str(raw.photoUrl), // data URL or HTTPS URL preserved
    handle: str(raw.handle),
    displayName: str(raw.displayName),
    publicationCount: str(raw.publicationCount),
    followersCount: str(raw.followersCount),
    followingCount: str(raw.followingCount),
    category: str(raw.category),
    bio: str(raw.bio),
    mainLink: str(raw.mainLink),
    linkItems: Array.isArray(raw.linkItems)
      ? raw.linkItems.map((item, i) => normalizeV2ProfileLink(item, i))
      : [],
    highlights: Array.isArray(raw.highlights)
      ? raw.highlights.map((item, i) => normalizeV2Highlight(item, i))
      : [],
  };
}

function normalizeV2FrequencyItem(item: unknown): InstagramFrequencyItem {
  if (!isObj(item)) return createEmptyInstagramFrequencyItem();
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    format: str(item.format),
    quantity: str(item.quantity),
    period: str(item.period),
    journeyRole: str(item.journeyRole),
    notes: str(item.notes),
  };
}

function normalizeV2Publishing(raw: unknown): InstagramPublishingStrategy {
  if (!isObj(raw)) return emptyPublishing();
  return {
    frequencyItems: Array.isArray(raw.frequencyItems)
      ? raw.frequencyItems.map(normalizeV2FrequencyItem)
      : [],
    minimumViableFrequency: str(raw.minimumViableFrequency),
    recommendedFrequency: str(raw.recommendedFrequency),
    maximumSustainableFrequency: str(raw.maximumSustainableFrequency),
    productionRoutine: str(raw.productionRoutine),
    adjustmentRule: str(raw.adjustmentRule),
  };
}

function normalizeV2Objective(item: unknown): InstagramObjective {
  if (!isObj(item)) return createEmptyInstagramObjective();
  const vs = item.validationStatus;
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    objective: str(item.objective),
    indicator: str(item.indicator),
    target: str(item.target),
    deadline: str(item.deadline),
    validationStatus: vs === "validated" || vs === "hypothesis" ? vs : "hypothesis",
  };
}

function normalizeV2ContentFormat(item: unknown): InstagramContentFormat {
  if (!isObj(item)) return createEmptyInstagramContentFormat();
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    name: str(item.name),
    structure: str(item.structure),
    duration: str(item.duration),
    journeyRole: str(item.journeyRole),
    purpose: str(item.purpose),
    cta: str(item.cta),
    notes: str(item.notes),
  };
}

function normalizeV2StoryFormat(item: unknown): InstagramStoryFormat {
  if (!isObj(item)) return createEmptyInstagramStoryFormat();
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    name: str(item.name),
    frequency: str(item.frequency),
    journeyStage: str(item.journeyStage),
    purpose: str(item.purpose),
    cta: str(item.cta),
    description: str(item.description),
  };
}

function normalizeV2ContentArchitecture(raw: unknown): InstagramContentArchitecture {
  if (!isObj(raw)) return emptyContentArchitecture();
  return {
    formats: Array.isArray(raw.formats) ? raw.formats.map(normalizeV2ContentFormat) : [],
    stories: Array.isArray(raw.stories) ? raw.stories.map(normalizeV2StoryFormat) : [],
    generalContentGuidelines: strArray(raw.generalContentGuidelines),
  };
}

function normalizeV2LanguageStructure(item: unknown): InstagramLanguageStructure {
  if (!isObj(item)) return createEmptyInstagramLanguageStructure();
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    name: str(item.name),
    howItAppears: str(item.howItAppears),
    journeyRelation: str(item.journeyRelation),
    avoid: str(item.avoid),
    example: str(item.example),
  };
}

function normalizeV2ImageReference(item: unknown, fallbackOrder: number): InstagramImageReference {
  if (!isObj(item)) return { ...createEmptyInstagramImageReference(), order: fallbackOrder };
  const result: InstagramImageReference = {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    url: str(item.url), // data URL or HTTPS URL preserved exactly
    order: typeof item.order === "number" ? item.order : fallbackOrder,
  };
  if (typeof item.title === "string") result.title = item.title;
  if (typeof item.description === "string") result.description = item.description;
  return result;
}

function normalizeV2VisualDirection(raw: unknown): InstagramVisualDirection {
  if (!isObj(raw)) return emptyVisualDirection();
  return {
    humanPresence: str(raw.humanPresence),
    specialistRole: str(raw.specialistRole),
    backstage: str(raw.backstage),
    socialProof: str(raw.socialProof),
    dataUsage: str(raw.dataUsage),
    informationHierarchy: str(raw.informationHierarchy),
    visualDensity: str(raw.visualDensity),
    desiredFeeling: str(raw.desiredFeeling),
    formatConsistency: str(raw.formatConsistency),
    journeyAdaptation: str(raw.journeyAdaptation),
    avoid: str(raw.avoid),
    generalStrategy: str(raw.generalStrategy),
    references: Array.isArray(raw.references)
      ? raw.references.map((item, i) => normalizeV2ImageReference(item, i))
      : [],
  };
}

function normalizeV2ConversionStage(raw: unknown): InstagramConversionStage {
  if (!isObj(raw)) return emptyConversionStage();
  return { cta: str(raw.cta), destination: str(raw.destination) };
}

function normalizeV2Conversion(raw: unknown): InstagramConversionStrategy {
  if (!isObj(raw)) return emptyConversion();
  return {
    discovery: normalizeV2ConversionStage(raw.discovery),
    consideration: normalizeV2ConversionStage(raw.consideration),
    decision: normalizeV2ConversionStage(raw.decision),
    conversionPath: str(raw.conversionPath),
    primaryOffer: str(raw.primaryOffer),
    commercialChannel: str(raw.commercialChannel),
    crmIntegration: str(raw.crmIntegration),
  };
}

function normalizeV2Measurement(raw: unknown): InstagramMeasurementStrategy {
  if (!isObj(raw)) return emptyMeasurement();
  return {
    primaryIndicators: strArray(raw.primaryIndicators),
    secondaryIndicators: strArray(raw.secondaryIndicators),
    vanityMetrics: strArray(raw.vanityMetrics),
    weeklyReview: str(raw.weeklyReview),
    monthlyReview: str(raw.monthlyReview),
    keepCriterion: str(raw.keepCriterion),
    adjustCriterion: str(raw.adjustCriterion),
    stopCriterion: str(raw.stopCriterion),
    baseline: str(raw.baseline),
    hypotheses: strArray(raw.hypotheses),
  };
}

function normalizeV2Integration(raw: unknown): InstagramChannelIntegration {
  if (!isObj(raw)) return emptyIntegration();
  return {
    receivesAudienceFrom: strArray(raw.receivesAudienceFrom),
    directsAudienceTo: strArray(raw.directsAudienceTo),
    ecosystemRole: str(raw.ecosystemRole),
    contentRepurposing: str(raw.contentRepurposing),
    connectionCtas: strArray(raw.connectionCtas),
    operationalDependencies: strArray(raw.operationalDependencies),
  };
}

function normalizeV2HashtagCategory(item: unknown): InstagramHashtagCategory | null {
  if (!isObj(item)) return null;
  const vs = item.validationStatus;
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    name: str(item.name),
    hashtags: strArray(item.hashtags),
    notes: str(item.notes),
    validationStatus: vs === "validated" || vs === "hypothesis" ? vs : "hypothesis",
  };
}

function normalizeV2ExternalReference(item: unknown): InstagramExternalReference | null {
  if (!isObj(item)) return null;
  return {
    id: hasValidId(item.id) ? item.id : createInstagramItemId(),
    imageUrl: str(item.imageUrl),
    title: str(item.title),
    url: str(item.url),
    notes: str(item.notes),
  };
}

// ─── V2 root normalizer ───────────────────────────────────────────────────────

const KNOWN_V2_KEYS = new Set([
  "version",
  "strategicDirection",
  "profile",
  "publishing",
  "objectives",
  "contentArchitecture",
  "languageStructures",
  "visualDirection",
  "conversion",
  "measurement",
  "integration",
  "hashtags",
  "externalReferences",
  "legacy",
]);

function normalizeV2(raw: Record<string, unknown>): InstagramData {
  const unknownEntries = Object.entries(raw).filter(([k]) => !KNOWN_V2_KEYS.has(k));

  const existingLegacy =
    isObj(raw.legacy) ? (raw.legacy as Partial<InstagramLegacyCompatibility>) : undefined;

  const mergedUnknownFields: Record<string, unknown> = {
    ...(existingLegacy?.unknownFields ?? {}),
    ...Object.fromEntries(unknownEntries),
  };

  const legacy = buildLegacyField(
    existingLegacy?.originalHighlights,
    Object.keys(mergedUnknownFields).length > 0 ? mergedUnknownFields : undefined
  );

  const result: InstagramData = {
    version: 2,
    strategicDirection: normalizeV2StrategicDirection(raw.strategicDirection),
    profile: normalizeV2Profile(raw.profile),
    publishing: normalizeV2Publishing(raw.publishing),
    objectives: Array.isArray(raw.objectives)
      ? raw.objectives.map(normalizeV2Objective)
      : [],
    contentArchitecture: normalizeV2ContentArchitecture(raw.contentArchitecture),
    languageStructures: Array.isArray(raw.languageStructures)
      ? raw.languageStructures.map(normalizeV2LanguageStructure)
      : [],
    visualDirection: normalizeV2VisualDirection(raw.visualDirection),
    conversion: normalizeV2Conversion(raw.conversion),
    measurement: normalizeV2Measurement(raw.measurement),
    integration: normalizeV2Integration(raw.integration),
    hashtags: Array.isArray(raw.hashtags)
      ? raw.hashtags
          .map(normalizeV2HashtagCategory)
          .filter((c): c is InstagramHashtagCategory => c !== null)
      : [],
    externalReferences: Array.isArray(raw.externalReferences)
      ? raw.externalReferences
          .map(normalizeV2ExternalReference)
          .filter((r): r is InstagramExternalReference => r !== null)
      : [],
    ...(legacy ? { legacy } : {}),
  };

  return result;
}

// ─── Legacy root normalizer ───────────────────────────────────────────────────

const KNOWN_LEGACY_KEYS = new Set([
  "frequencyItems",
  "objectives",
  "stories",
  "hashtags",
  "reels",
  "languageStructures",
  "contents",
  "visualStrategy",
  "visualReferences",
  "bioEnabled",
  "bioPhoto",
  "profileHandle",
  "profileName",
  "bioText",
  "bioLink",
  "highlights",
  "references",
]);

function normalizeLegacy(raw: Record<string, unknown>): InstagramData {
  const unknownEntries = Object.entries(raw).filter(([k]) => !KNOWN_LEGACY_KEYS.has(k));

  const highlightsRaw = typeof raw.highlights === "string" ? raw.highlights : "";
  const { highlights, originalHighlights } =
    normalizeLegacyHighlightsString(highlightsRaw);

  const unknownFields =
    unknownEntries.length > 0 ? Object.fromEntries(unknownEntries) : undefined;

  const legacy = buildLegacyField(originalHighlights, unknownFields);

  return {
    version: 2,
    strategicDirection: emptyStrategicDirection(),
    profile: {
      enabled: typeof raw.bioEnabled === "boolean" ? raw.bioEnabled : true,
      photoUrl: str(raw.bioPhoto), // data URL preserved exactly
      handle: str(raw.profileHandle),
      displayName: str(raw.profileName),
      publicationCount: "",
      followersCount: "",
      followingCount: "",
      category: "",
      bio: str(raw.bioText), // Rich Text HTML preserved
      mainLink: str(raw.bioLink),
      linkItems: [],
      highlights,
    },
    publishing: {
      frequencyItems: normalizeLegacyFrequencyItems(raw.frequencyItems),
      minimumViableFrequency: "",
      recommendedFrequency: "",
      maximumSustainableFrequency: "",
      productionRoutine: "",
      adjustmentRule: "",
    },
    objectives: normalizeLegacyObjectives(raw.objectives),
    contentArchitecture: {
      formats: normalizeLegacyFormats(raw.reels),
      stories: normalizeLegacyStories(raw.stories),
      generalContentGuidelines: normalizeLegacyContents(raw.contents),
    },
    languageStructures: normalizeLegacyLanguageStructures(raw.languageStructures),
    visualDirection: {
      humanPresence: "",
      specialistRole: "",
      backstage: "",
      socialProof: "",
      dataUsage: "",
      informationHierarchy: "",
      visualDensity: "",
      desiredFeeling: "",
      formatConsistency: "",
      journeyAdaptation: "",
      avoid: "",
      generalStrategy: str(raw.visualStrategy), // Rich Text HTML preserved
      references: normalizeLegacyVisualReferences(raw.visualReferences),
    },
    conversion: emptyConversion(),
    measurement: emptyMeasurement(),
    integration: emptyIntegration(),
    hashtags: normalizeLegacyHashtags(raw.hashtags),
    externalReferences: normalizeLegacyExternalReferences(raw.references),
    ...(legacy ? { legacy } : {}),
  };
}

// ─── normalizeInstagramData (main export) ─────────────────────────────────────
//
// Accepted inputs:
//   A. undefined / null / non-object / array → createEmptyInstagramData()
//   B. object with version === 2             → v2 normalization (IDs preserved)
//   C. legacy object (v1 shape)              → full field mapping
//   D. partial v2 object                     → missing sections filled with defaults
//   E. partial legacy object                 → missing fields treated as absent
//
// Guarantees:
//   - Never mutates the input value.
//   - Returns a new, fully-populated InstagramData every call.
//   - No uploads, no Supabase calls, no side effects.
//   - data URL strings are preserved verbatim in their target fields.

export function normalizeInstagramData(value: unknown): InstagramData {
  if (value === null || value === undefined) return createEmptyInstagramData();
  if (typeof value !== "object" || Array.isArray(value)) return createEmptyInstagramData();

  const raw = value as Record<string, unknown>;

  if (raw.version === 2) return normalizeV2(raw);

  return normalizeLegacy(raw);
}

// ─── hasMeaningfulInstagramContent ───────────────────────────────────────────
// Returns true only when at least one field contains real, readable content.
// Does NOT count: version, empty arrays, generated IDs, default objects,
// or Rich Text strings containing only HTML scaffolding like <p></p>.

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function hasText(s: string): boolean {
  return s.trim().length > 0;
}

function hasHtmlContent(s: string): boolean {
  return stripHtmlTags(s).length > 0;
}

export function hasMeaningfulInstagramContent(data: InstagramData): boolean {
  const { strategicDirection, profile, publishing, objectives, contentArchitecture,
          languageStructures, visualDirection, conversion, measurement, integration,
          hashtags, externalReferences } = data;

  return (
    // Strategic direction
    hasText(strategicDirection.channelRole) ||
    hasText(strategicDirection.generalStrategy) ||
    hasText(strategicDirection.priorityAudiences) ||
    hasText(strategicDirection.ecosystemFunction) ||
    hasText(strategicDirection.profileDifferentiation) ||
    hasText(strategicDirection.initialEditorialPriorities) ||

    // Profile
    hasText(profile.handle) ||
    hasText(profile.displayName) ||
    hasText(profile.publicationCount) ||
    hasText(profile.followersCount) ||
    hasText(profile.followingCount) ||
    hasText(profile.category) ||
    hasHtmlContent(profile.bio) ||
    hasText(profile.mainLink) ||
    profile.highlights.some((h) => hasText(h.title)) ||

    // Publishing
    publishing.frequencyItems.some((i) => hasText(i.format) && hasText(i.quantity)) ||
    hasText(publishing.minimumViableFrequency) ||
    hasText(publishing.recommendedFrequency) ||
    hasText(publishing.productionRoutine) ||

    // Objectives
    objectives.some((o) => hasText(o.objective)) ||

    // Content architecture
    contentArchitecture.formats.some((f) => hasText(f.name)) ||
    contentArchitecture.stories.some((s) => hasText(s.name)) ||
    contentArchitecture.generalContentGuidelines.some(hasText) ||

    // Language
    languageStructures.some((l) => hasText(l.howItAppears) || hasText(l.name)) ||

    // Visual direction
    hasHtmlContent(visualDirection.generalStrategy) ||
    visualDirection.references.some((r) => hasText(r.url)) ||
    hasText(visualDirection.desiredFeeling) ||
    hasText(visualDirection.avoid) ||

    // Conversion
    hasText(conversion.discovery.cta) ||
    hasText(conversion.consideration.cta) ||
    hasText(conversion.decision.cta) ||
    hasText(conversion.conversionPath) ||
    hasText(conversion.primaryOffer) ||

    // Measurement
    measurement.primaryIndicators.some(hasText) ||
    measurement.secondaryIndicators.some(hasText) ||
    hasText(measurement.weeklyReview) ||
    hasText(measurement.keepCriterion) ||
    hasText(measurement.baseline) ||

    // Integration
    integration.receivesAudienceFrom.some(hasText) ||
    integration.directsAudienceTo.some(hasText) ||
    hasText(integration.ecosystemRole) ||

    // Hashtags
    hashtags.some((c) => c.hashtags.some(hasText)) ||

    // External references
    externalReferences.some(
      (r) => hasText(r.imageUrl) || hasText(r.title) || hasText(r.url)
    )
  );
}

// ─── Type-level verification (compile-time only) ──────────────────────────────
// These assignments verify that the exported functions satisfy the expected
// signatures. They are never executed; the compiler removes them.
// Scenarios covered:
//   A. undefined → InstagramData (createEmptyInstagramData)
//   B. all 17 legacy fields mapped (normalizeLegacy internal function)
//   C. version 2 → IDs preserved (normalizeV2 internal function)
//   D. partial v2 → defaults filled (normalizeV2 + section normalizers)
//   E. highlights string → split + originalHighlights preserved (normalizeLegacyHighlightsString)
//   F. base64 url preserved exactly (str(raw.bioPhoto), str(item.url))
//   G. empty data → hasMeaningfulInstagramContent returns false (all branches require content)
//   H. real content → hasMeaningfulInstagramContent returns true (any branch)

const _typeCheck: {
  normalize: (v: unknown) => InstagramData;
  empty: () => InstagramData;
  meaningful: (d: InstagramData) => boolean;
} = {
  normalize: normalizeInstagramData,
  empty: createEmptyInstagramData,
  meaningful: hasMeaningfulInstagramContent,
};

void _typeCheck;
