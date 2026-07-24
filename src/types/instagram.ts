// Instagram module — v2 type definitions
// No React, Supabase, or project-specific imports.

// ─── Primitives ──────────────────────────────────────────────────────────────

export type InstagramImageReference = {
  id: string;
  url: string; // data URL (legacy) or HTTPS URL (new uploads)
  title?: string;
  description?: string;
  order: number;
};

export type InstagramProfileLink = {
  id: string;
  title: string;
  url: string;
  order: number;
};

export type InstagramHighlight = {
  id: string;
  title: string;
  purpose: string;
  imageUrl: string;
  order: number;
};

// ─── Strategic Direction ─────────────────────────────────────────────────────

export type InstagramStrategicDirection = {
  channelRole: string;
  generalStrategy: string;
  priorityAudiences: string;
  ecosystemFunction: string;
  profileDifferentiation: string;
  initialEditorialPriorities: string;
};

// ─── Profile ─────────────────────────────────────────────────────────────────

export type InstagramProfile = {
  enabled: boolean;
  photoUrl: string; // data URL (legacy) or HTTPS URL (new uploads)
  handle: string;
  displayName: string;
  publicationCount: string;
  followersCount: string;
  followingCount: string;
  category: string;
  bio: string; // Rich Text HTML
  mainLink: string;
  linkItems: InstagramProfileLink[];
  highlights: InstagramHighlight[];
};

// ─── Publishing ──────────────────────────────────────────────────────────────

export type InstagramFrequencyItem = {
  id: string;
  format: string;
  quantity: string;
  period: string;
  journeyRole: string;
  notes: string; // was "observation" in legacy
};

export type InstagramPublishingStrategy = {
  frequencyItems: InstagramFrequencyItem[];
  minimumViableFrequency: string;
  recommendedFrequency: string;
  maximumSustainableFrequency: string;
  productionRoutine: string;
  adjustmentRule: string;
};

// ─── Objectives ──────────────────────────────────────────────────────────────

export type InstagramObjective = {
  id: string;
  objective: string;
  indicator: string;
  target: string;
  deadline: string;
  validationStatus: "validated" | "hypothesis";
};

// ─── Content Architecture ────────────────────────────────────────────────────

export type InstagramContentFormat = {
  id: string;
  name: string; // legacy "reels[].value" lands here
  structure: string;
  duration: string;
  journeyRole: string;
  purpose: string;
  cta: string;
  notes: string;
};

export type InstagramStoryFormat = {
  id: string;
  name: string; // legacy "stories[].value" lands here
  frequency: string;
  journeyStage: string;
  purpose: string;
  cta: string;
  description: string;
};

export type InstagramContentArchitecture = {
  formats: InstagramContentFormat[];
  stories: InstagramStoryFormat[];
  generalContentGuidelines: string[]; // legacy "contents[].value" lands here
};

// ─── Language Structures ─────────────────────────────────────────────────────

export type InstagramLanguageStructure = {
  id: string;
  name: string;
  howItAppears: string; // legacy "languageStructures[].value" lands here
  journeyRelation: string;
  avoid: string;
  example: string;
};

// ─── Visual Direction ────────────────────────────────────────────────────────

export type InstagramVisualDirection = {
  humanPresence: string;
  specialistRole: string;
  backstage: string;
  socialProof: string;
  dataUsage: string;
  informationHierarchy: string;
  visualDensity: string;
  desiredFeeling: string;
  formatConsistency: string;
  journeyAdaptation: string;
  avoid: string;
  generalStrategy: string; // legacy "visualStrategy" (Rich Text HTML) lands here
  references: InstagramImageReference[]; // legacy "visualReferences[].image" lands in .url
};

// ─── Conversion ──────────────────────────────────────────────────────────────

export type InstagramConversionStage = {
  cta: string;
  destination: string;
};

export type InstagramConversionStrategy = {
  discovery: InstagramConversionStage;
  consideration: InstagramConversionStage;
  decision: InstagramConversionStage;
  conversionPath: string;
  primaryOffer: string;
  commercialChannel: string;
  crmIntegration: string;
};

// ─── Measurement ─────────────────────────────────────────────────────────────

export type InstagramMeasurementStrategy = {
  primaryIndicators: string[];
  secondaryIndicators: string[];
  vanityMetrics: string[];
  weeklyReview: string;
  monthlyReview: string;
  keepCriterion: string;
  adjustCriterion: string;
  stopCriterion: string;
  baseline: string;
  hypotheses: string[];
};

// ─── Integration ─────────────────────────────────────────────────────────────

export type InstagramChannelIntegration = {
  receivesAudienceFrom: string[];
  directsAudienceTo: string[];
  ecosystemRole: string;
  contentRepurposing: string;
  connectionCtas: string[];
  operationalDependencies: string[];
};

// ─── Hashtags ────────────────────────────────────────────────────────────────

export type InstagramHashtagCategory = {
  id: string;
  name: string;
  hashtags: string[];
  notes: string;
  validationStatus: "validated" | "hypothesis";
};

// ─── External References ─────────────────────────────────────────────────────

export type InstagramExternalReference = {
  id: string;
  title: string;
  url: string; // was "link" in legacy
  notes: string;
};

// ─── Legacy Compatibility ────────────────────────────────────────────────────

export type InstagramLegacyCompatibility = {
  originalHighlights?: string; // original comma-separated highlights string
  unknownFields?: Record<string, unknown>; // unrecognized root-level keys
};

// ─── Root ────────────────────────────────────────────────────────────────────

export type InstagramData = {
  version: 2;
  strategicDirection: InstagramStrategicDirection;
  profile: InstagramProfile;
  publishing: InstagramPublishingStrategy;
  objectives: InstagramObjective[];
  contentArchitecture: InstagramContentArchitecture;
  languageStructures: InstagramLanguageStructure[];
  visualDirection: InstagramVisualDirection;
  conversion: InstagramConversionStrategy;
  measurement: InstagramMeasurementStrategy;
  integration: InstagramChannelIntegration;
  hashtags: InstagramHashtagCategory[];
  externalReferences: InstagramExternalReference[];
  legacy?: InstagramLegacyCompatibility;
};
