"use client";

import { ChangeEvent, useState, ReactNode } from "react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import RichTextEditor from "@/Components/RichTextEditor";
import type { InstagramData } from "@/types/instagram";
import {
  createEmptyInstagramFrequencyItem,
  createEmptyInstagramObjective,
  createEmptyInstagramStoryFormat,
  createEmptyInstagramContentFormat,
  createEmptyInstagramLanguageStructure,
  createEmptyInstagramHashtagCategory,
  createEmptyInstagramImageReference,
  createEmptyInstagramExternalReference,
  createEmptyInstagramHighlight,
} from "@/lib/normalizeInstagramData";
import { uploadPlanningMedia } from "@/lib/uploadPlanningMedia";

// ─── Navigation ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Direção estratégica", id: "instagram-strategic-direction" },
  { label: "Perfil", id: "instagram-profile" },
  { label: "Frequência e objetivos", id: "instagram-frequency-objectives" },
  { label: "Conteúdo", id: "instagram-content" },
  { label: "Linguagem", id: "instagram-language" },
  { label: "Identidade visual", id: "instagram-visual" },
  { label: "Conversão", id: "instagram-conversion" },
  { label: "Integração", id: "instagram-integration" },
  { label: "Referências", id: "instagram-references" },
];

// ─── FormSection ──────────────────────────────────────────────────────────────

function FormSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-slate-100 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      <div className="space-y-10">{children}</div>
    </section>
  );
}

// ─── SubSection ───────────────────────────────────────────────────────────────

function SubSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

// ─── InstagramProfilePreview ──────────────────────────────────────────────────

type InstagramProfilePreviewProps = {
  profile: InstagramData["profile"];
};

function InstagramProfilePreview({ profile }: InstagramProfilePreviewProps) {
  const initials = profile.displayName
    ? profile.displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "";

  const sortedHighlights = [...profile.highlights]
    .sort((a, b) => a.order - b.order)
    .filter((h) => h.title.trim() || h.purpose.trim() || h.imageUrl.trim());

  return (
    <div className="lg:sticky lg:top-8">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Pré-visualização do perfil
      </p>
      <p className="mb-3 text-xs text-slate-400">
        A visualização é atualizada conforme os campos são preenchidos.
      </p>

      <div
        aria-label="Pré-visualização do perfil do Instagram"
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Profile header */}
        <div className="p-5">
          <div className="flex items-center gap-4">
            {/* Photo */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.displayName || "Foto do perfil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-400">
                  {initials || "?"}
                </span>
              )}
            </div>

            {/* Name + handle */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {profile.displayName || (
                  <span className="font-normal text-slate-300">Nome do perfil</span>
                )}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {profile.handle || (
                  <span className="text-slate-300">@nomedoperfil</span>
                )}
              </p>
            </div>
          </div>

          {(profile.publicationCount ||
            profile.followersCount ||
            profile.followingCount) && (
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
              {profile.publicationCount && (
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {profile.publicationCount}
                  </p>
                  <p className="text-[11px] text-slate-500">publicações</p>
                </div>
              )}
              {profile.followersCount && (
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {profile.followersCount}
                  </p>
                  <p className="text-[11px] text-slate-500">seguidores</p>
                </div>
              )}
              {profile.followingCount && (
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {profile.followingCount}
                  </p>
                  <p className="text-[11px] text-slate-500">seguindo</p>
                </div>
              )}
            </div>
          )}

          {/* Bio-dependent content */}
          {profile.enabled ? (
            <div className="mt-4 space-y-3">
              {profile.category && (
                <p className="text-xs font-semibold text-slate-500">
                  {profile.category}
                </p>
              )}

              {/* Bio HTML */}
              {profile.bio ? (
                <div
                  className="text-xs leading-5 text-slate-700 [&_em]:italic [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4"
                  dangerouslySetInnerHTML={{ __html: profile.bio }}
                />
              ) : (
                <p className="text-xs italic text-slate-300">
                  A descrição estratégica do perfil aparecerá aqui.
                </p>
              )}

              {/* Main link */}
              {profile.mainLink && (
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Link: </span>
                  <span className="break-all">{profile.mainLink}</span>
                </p>
              )}

            </div>
          ) : (
            <p className="mt-4 text-xs italic text-slate-400">
              A bio está desativada neste planejamento.
            </p>
          )}
        </div>

        {/* Highlights */}
        {profile.enabled && sortedHighlights.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="flex gap-4 overflow-x-auto pb-1">
              {sortedHighlights.map((h) => (
                <div
                  key={h.id}
                  aria-label={
                    h.purpose
                      ? `${h.title || "Destaque"} — ${h.purpose}`
                      : h.title || "Destaque"
                  }
                  className="flex flex-shrink-0 flex-col items-center gap-1.5"
                >
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
                    {h.imageUrl ? (
                      <img
                        src={h.imageUrl}
                        alt={h.title || "Destaque"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        {h.title ? h.title[0].toUpperCase() : "•"}
                      </span>
                    )}
                  </div>
                  <span className="w-14 truncate text-center text-xs text-slate-600">
                    {h.title || "Destaque"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type InstagramFormProps = {
  data: InstagramData;
  setData: Dispatch<SetStateAction<InstagramData>>;
  clientSlug: string;
  presentationHref: string;
  isSaving: boolean;
  isDisabled: boolean;
  onSave: () => void;
  planningProjectId: string;
};

export default function InstagramForm({
  data,
  setData,
  clientSlug,
  presentationHref,
  isSaving,
  isDisabled,
  onSave,
  planningProjectId,
}: InstagramFormProps) {
  // ─── Upload states ──────────────────────────────────────────────────────────

  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState("");
  const [uploadingRefId, setUploadingRefId] = useState<string | null>(null);
  const [refUploadErrors, setRefUploadErrors] = useState<Record<string, string>>({});
  const [uploadingHighlightId, setUploadingHighlightId] = useState<string | null>(null);
  const [highlightUploadErrors, setHighlightUploadErrors] = useState<Record<string, string>>({});

  // ─── Frequency handlers ─────────────────────────────────────────────────────

  function updateFrequencyItem(
    id: string,
    key: "format" | "quantity" | "period" | "journeyRole" | "notes",
    value: string
  ) {
    setData((current) => ({
      ...current,
      publishing: {
        ...current.publishing,
        frequencyItems: current.publishing.frequencyItems.map((item) =>
          item.id === id ? { ...item, [key]: value } : item
        ),
      },
    }));
  }

  function addFrequencyItem() {
    setData((current) => ({
      ...current,
      publishing: {
        ...current.publishing,
        frequencyItems: [
          ...current.publishing.frequencyItems,
          { ...createEmptyInstagramFrequencyItem(), period: "por semana" },
        ],
      },
    }));
  }

  function removeFrequencyItem(id: string) {
    setData((current) => ({
      ...current,
      publishing: {
        ...current.publishing,
        frequencyItems: current.publishing.frequencyItems.filter(
          (item) => item.id !== id
        ),
      },
    }));
  }

  function updatePublishing(
    key:
      | "minimumViableFrequency"
      | "recommendedFrequency"
      | "maximumSustainableFrequency"
      | "productionRoutine"
      | "adjustmentRule",
    value: string
  ) {
    setData((current) => ({
      ...current,
      publishing: { ...current.publishing, [key]: value },
    }));
  }

  // ─── Objectives handlers ─────────────────────────────────────────────────────

  function updateObjective(
    id: string,
    key: "objective" | "indicator" | "target" | "deadline" | "validationStatus",
    value: string
  ) {
    setData((current) => ({
      ...current,
      objectives: current.objectives.map((o) =>
        o.id === id ? { ...o, [key]: value } : o
      ),
    }));
  }

  function addObjective() {
    setData((current) => ({
      ...current,
      objectives: [...current.objectives, createEmptyInstagramObjective()],
    }));
  }

  function removeObjective(id: string) {
    setData((current) => ({
      ...current,
      objectives: current.objectives.filter((o) => o.id !== id),
    }));
  }

  // ─── Stories handlers ────────────────────────────────────────────────────────

  function updateStory(
    id: string,
    key: "name" | "frequency" | "journeyStage" | "purpose" | "cta" | "description",
    value: string
  ) {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        stories: current.contentArchitecture.stories.map((s) =>
          s.id === id ? { ...s, [key]: value } : s
        ),
      },
    }));
  }

  function addStory() {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        stories: [
          ...current.contentArchitecture.stories,
          createEmptyInstagramStoryFormat(),
        ],
      },
    }));
  }

  function removeStory(id: string) {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        stories: current.contentArchitecture.stories.filter((s) => s.id !== id),
      },
    }));
  }

  function moveStory(id: string, direction: "up" | "down") {
    setData((current) => {
      const arr = [...current.contentArchitecture.stories];
      const index = arr.findIndex((s) => s.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return {
        ...current,
        contentArchitecture: { ...current.contentArchitecture, stories: arr },
      };
    });
  }

  // ─── Hashtags handlers ────────────────────────────────────────────────────────
  // All categories are flattened into a single list for display.
  // Setters traverse the nested structure using a cursor to find the correct
  // (catIndex, tagIndex) from the flat index.

  function updateHashtag(flatIndex: number, value: string) {
    setData((current) => {
      let cursor = 0;
      const nextHashtags = current.hashtags.map((cat) => ({
        ...cat,
        hashtags: cat.hashtags.map((h) => {
          const result = cursor === flatIndex ? value : h;
          cursor++;
          return result;
        }),
      }));
      return { ...current, hashtags: nextHashtags };
    });
  }

  function addHashtag() {
    setData((current) => {
      if (current.hashtags.length === 0) {
        return {
          ...current,
          hashtags: [{ ...createEmptyInstagramHashtagCategory(), hashtags: [""] }],
        };
      }
      const nextHashtags = [...current.hashtags];
      nextHashtags[0] = {
        ...nextHashtags[0],
        hashtags: [...nextHashtags[0].hashtags, ""],
      };
      return { ...current, hashtags: nextHashtags };
    });
  }

  function removeHashtag(flatIndex: number) {
    setData((current) => {
      let cursor = 0;
      const nextHashtags = current.hashtags
        .map((cat) => ({
          ...cat,
          hashtags: cat.hashtags.filter(() => {
            const keep = cursor !== flatIndex;
            cursor++;
            return keep;
          }),
        }))
        .filter((cat) => cat.hashtags.length > 0);

      if (nextHashtags.length === 0) {
        const base =
          current.hashtags.length > 0
            ? current.hashtags[0]
            : createEmptyInstagramHashtagCategory();
        return { ...current, hashtags: [{ ...base, hashtags: [""] }] };
      }
      return { ...current, hashtags: nextHashtags };
    });
  }

  const flatHashtags = data.hashtags.flatMap((cat) => cat.hashtags);

  // ─── Formats (content formats) handlers ──────────────────────────────────────

  function updateFormat(
    id: string,
    key: "name" | "structure" | "duration" | "journeyRole" | "purpose" | "cta" | "notes",
    value: string
  ) {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        formats: current.contentArchitecture.formats.map((f) =>
          f.id === id ? { ...f, [key]: value } : f
        ),
      },
    }));
  }

  function addFormat() {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        formats: [
          ...current.contentArchitecture.formats,
          createEmptyInstagramContentFormat(),
        ],
      },
    }));
  }

  function removeFormat(id: string) {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        formats: current.contentArchitecture.formats.filter((f) => f.id !== id),
      },
    }));
  }

  function moveFormat(id: string, direction: "up" | "down") {
    setData((current) => {
      const arr = [...current.contentArchitecture.formats];
      const index = arr.findIndex((f) => f.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return {
        ...current,
        contentArchitecture: { ...current.contentArchitecture, formats: arr },
      };
    });
  }

  // ─── Language structures handlers ─────────────────────────────────────────────

  function updateLanguageStructure(
    id: string,
    key: "name" | "howItAppears" | "journeyRelation" | "avoid" | "example",
    value: string
  ) {
    setData((current) => ({
      ...current,
      languageStructures: current.languageStructures.map((l) =>
        l.id === id ? { ...l, [key]: value } : l
      ),
    }));
  }

  function addLanguageStructure() {
    setData((current) => ({
      ...current,
      languageStructures: [
        ...current.languageStructures,
        createEmptyInstagramLanguageStructure(),
      ],
    }));
  }

  function removeLanguageStructure(id: string) {
    setData((current) => ({
      ...current,
      languageStructures: current.languageStructures.filter((l) => l.id !== id),
    }));
  }

  function moveLanguageStructure(id: string, direction: "up" | "down") {
    setData((current) => {
      const arr = [...current.languageStructures];
      const index = arr.findIndex((l) => l.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return { ...current, languageStructures: arr };
    });
  }

  // ─── Contents handlers ────────────────────────────────────────────────────────

  function updateContent(index: number, value: string) {
    setData((current) => {
      const nextItems = [
        ...current.contentArchitecture.generalContentGuidelines,
      ];
      nextItems[index] = value;
      return {
        ...current,
        contentArchitecture: {
          ...current.contentArchitecture,
          generalContentGuidelines: nextItems,
        },
      };
    });
  }

  function addContent() {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        generalContentGuidelines: [
          ...current.contentArchitecture.generalContentGuidelines,
          "",
        ],
      },
    }));
  }

  function removeContent(index: number) {
    setData((current) => ({
      ...current,
      contentArchitecture: {
        ...current.contentArchitecture,
        generalContentGuidelines: current.contentArchitecture.generalContentGuidelines.filter(
          (_, i) => i !== index
        ),
      },
    }));
  }

  function moveContent(index: number, direction: "up" | "down") {
    setData((current) => {
      const arr = [...current.contentArchitecture.generalContentGuidelines];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return {
        ...current,
        contentArchitecture: {
          ...current.contentArchitecture,
          generalContentGuidelines: arr,
        },
      };
    });
  }

  // ─── Visual reference handlers ────────────────────────────────────────────────

  function updateVisualDirection(
    key: Exclude<keyof InstagramData["visualDirection"], "references">,
    value: string
  ) {
    setData((current) => ({
      ...current,
      visualDirection: { ...current.visualDirection, [key]: value },
    }));
  }

  function updateVisualReference(
    id: string,
    key: "title" | "description",
    value: string
  ) {
    setData((current) => ({
      ...current,
      visualDirection: {
        ...current.visualDirection,
        references: current.visualDirection.references.map((ref) =>
          ref.id === id ? { ...ref, [key]: value } : ref
        ),
      },
    }));
  }

  async function uploadVisualReference(
    id: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingRefId(id);
    setRefUploadErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    try {
      const { url } = await uploadPlanningMedia({
        file,
        planningProjectId,
        category: "references",
      });

      setData((current) => ({
        ...current,
        visualDirection: {
          ...current.visualDirection,
          references: current.visualDirection.references.map((ref) =>
            ref.id === id ? { ...ref, url } : ref
          ),
        },
      }));
    } catch (err) {
      setRefUploadErrors((current) => ({
        ...current,
        [id]: err instanceof Error ? err.message : "Erro ao enviar imagem.",
      }));
    } finally {
      setUploadingRefId(null);
      event.target.value = "";
    }
  }

  function removeVisualReference(id: string) {
    setData((current) => {
      const reordered = current.visualDirection.references
        .filter((ref) => ref.id !== id)
        .map((ref, i) => ({ ...ref, order: i }));
      return {
        ...current,
        visualDirection: { ...current.visualDirection, references: reordered },
      };
    });
  }

  function addVisualReferenceSlot() {
    setData((current) => {
      const newRef = {
        ...createEmptyInstagramImageReference(),
        order: current.visualDirection.references.length,
      };
      return {
        ...current,
        visualDirection: {
          ...current.visualDirection,
          references: [...current.visualDirection.references, newRef],
        },
      };
    });
  }

  function moveVisualReference(id: string, direction: "up" | "down") {
    setData((current) => {
      const sorted = [...current.visualDirection.references].sort(
        (a, b) => a.order - b.order
      );
      const index = sorted.findIndex((ref) => ref.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return current;
      [sorted[index], sorted[targetIndex]] = [sorted[targetIndex], sorted[index]];
      const reordered = sorted.map((ref, i) => ({ ...ref, order: i }));
      return {
        ...current,
        visualDirection: { ...current.visualDirection, references: reordered },
      };
    });
  }

  // ─── Bio photo handlers ───────────────────────────────────────────────────────

  async function uploadBioPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingProfilePhoto(true);
    setProfilePhotoError("");

    try {
      const { url } = await uploadPlanningMedia({
        file,
        planningProjectId,
        category: "profile",
      });

      setData((current) => ({
        ...current,
        profile: { ...current.profile, photoUrl: url },
      }));
    } catch (err) {
      setProfilePhotoError(
        err instanceof Error ? err.message : "Erro ao enviar foto."
      );
    } finally {
      setUploadingProfilePhoto(false);
      event.target.value = "";
    }
  }

  function removeBioPhoto() {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, photoUrl: "" },
    }));
  }

  // ─── Conversion handlers ─────────────────────────────────────────────────────

  function updateConversionStage(
    stage: "discovery" | "consideration" | "decision",
    key: "cta" | "destination",
    value: string
  ) {
    setData((current) => ({
      ...current,
      conversion: {
        ...current.conversion,
        [stage]: {
          ...current.conversion[stage],
          [key]: value,
        },
      },
    }));
  }

  function updateConversion(
    key: "conversionPath" | "primaryOffer" | "commercialChannel" | "crmIntegration",
    value: string
  ) {
    setData((current) => ({
      ...current,
      conversion: {
        ...current.conversion,
        [key]: value,
      },
    }));
  }

  // ─── Measurement handlers ────────────────────────────────────────────────────

  function updateMeasurement(
    key:
      | "weeklyReview"
      | "monthlyReview"
      | "keepCriterion"
      | "adjustCriterion"
      | "stopCriterion"
      | "baseline",
    value: string
  ) {
    setData((current) => ({
      ...current,
      measurement: {
        ...current.measurement,
        [key]: value,
      },
    }));
  }

  function updateMeasurementListItem(
    list:
      | "primaryIndicators"
      | "secondaryIndicators"
      | "vanityMetrics"
      | "hypotheses",
    index: number,
    value: string
  ) {
    setData((current) => {
      const arr = [...current.measurement[list]];
      arr[index] = value;
      return {
        ...current,
        measurement: {
          ...current.measurement,
          [list]: arr,
        },
      };
    });
  }

  function addMeasurementListItem(
    list:
      | "primaryIndicators"
      | "secondaryIndicators"
      | "vanityMetrics"
      | "hypotheses"
  ) {
    setData((current) => ({
      ...current,
      measurement: {
        ...current.measurement,
        [list]: [...current.measurement[list], ""],
      },
    }));
  }

  function removeMeasurementListItem(
    list:
      | "primaryIndicators"
      | "secondaryIndicators"
      | "vanityMetrics"
      | "hypotheses",
    index: number
  ) {
    setData((current) => ({
      ...current,
      measurement: {
        ...current.measurement,
        [list]: current.measurement[list].filter((_, i) => i !== index),
      },
    }));
  }

  function moveMeasurementListItem(
    list:
      | "primaryIndicators"
      | "secondaryIndicators"
      | "vanityMetrics"
      | "hypotheses",
    index: number,
    direction: "up" | "down"
  ) {
    setData((current) => {
      const arr = [...current.measurement[list]];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return {
        ...current,
        measurement: {
          ...current.measurement,
          [list]: arr,
        },
      };
    });
  }

  // ─── Integration handlers ────────────────────────────────────────────────────

  function updateIntegration(
    key: "ecosystemRole" | "contentRepurposing",
    value: string
  ) {
    setData((current) => ({
      ...current,
      integration: {
        ...current.integration,
        [key]: value,
      },
    }));
  }

  function updateIntegrationListItem(
    list:
      | "receivesAudienceFrom"
      | "directsAudienceTo"
      | "connectionCtas"
      | "operationalDependencies",
    index: number,
    value: string
  ) {
    setData((current) => {
      const arr = [...current.integration[list]];
      arr[index] = value;
      return {
        ...current,
        integration: {
          ...current.integration,
          [list]: arr,
        },
      };
    });
  }

  function addIntegrationListItem(
    list:
      | "receivesAudienceFrom"
      | "directsAudienceTo"
      | "connectionCtas"
      | "operationalDependencies"
  ) {
    setData((current) => ({
      ...current,
      integration: {
        ...current.integration,
        [list]: [...current.integration[list], ""],
      },
    }));
  }

  function removeIntegrationListItem(
    list:
      | "receivesAudienceFrom"
      | "directsAudienceTo"
      | "connectionCtas"
      | "operationalDependencies",
    index: number
  ) {
    setData((current) => ({
      ...current,
      integration: {
        ...current.integration,
        [list]: current.integration[list].filter((_, i) => i !== index),
      },
    }));
  }

  function moveIntegrationListItem(
    list:
      | "receivesAudienceFrom"
      | "directsAudienceTo"
      | "connectionCtas"
      | "operationalDependencies",
    index: number,
    direction: "up" | "down"
  ) {
    setData((current) => {
      const arr = [...current.integration[list]];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return {
        ...current,
        integration: {
          ...current.integration,
          [list]: arr,
        },
      };
    });
  }

  // ─── External references handlers ─────────────────────────────────────────────

  function updateExternalReference(
    id: string,
    key: "title" | "url" | "notes",
    value: string
  ) {
    setData((current) => ({
      ...current,
      externalReferences: current.externalReferences.map((ref) =>
        ref.id === id ? { ...ref, [key]: value } : ref
      ),
    }));
  }

  function addExternalReference() {
    setData((current) => ({
      ...current,
      externalReferences: [
        ...current.externalReferences,
        createEmptyInstagramExternalReference(),
      ],
    }));
  }

  function removeExternalReference(id: string) {
    setData((current) => ({
      ...current,
      externalReferences: current.externalReferences.filter((ref) => ref.id !== id),
    }));
  }

  function moveExternalReference(id: string, direction: "up" | "down") {
    setData((current) => {
      const arr = [...current.externalReferences];
      const index = arr.findIndex((ref) => ref.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return current;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return { ...current, externalReferences: arr };
    });
  }

  // ─── Strategic direction handler ─────────────────────────────────────────────

  function updateStrategicDirection(
    key: keyof InstagramData["strategicDirection"],
    value: string
  ) {
    setData((current) => ({
      ...current,
      strategicDirection: {
        ...current.strategicDirection,
        [key]: value,
      },
    }));
  }

  // ─── Highlights handlers ──────────────────────────────────────────────────────

  function updateHighlight(id: string, key: "title" | "purpose", value: string) {
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        highlights: current.profile.highlights.map((h) =>
          h.id === id ? { ...h, [key]: value } : h
        ),
      },
    }));
  }

  function addHighlight() {
    setData((current) => {
      const newHighlight = {
        ...createEmptyInstagramHighlight(),
        order: current.profile.highlights.length,
      };
      return {
        ...current,
        profile: {
          ...current.profile,
          highlights: [...current.profile.highlights, newHighlight],
        },
      };
    });
  }

  function removeHighlight(id: string) {
    setData((current) => {
      const reordered = current.profile.highlights
        .filter((h) => h.id !== id)
        .map((h, i) => ({ ...h, order: i }));
      return {
        ...current,
        profile: { ...current.profile, highlights: reordered },
      };
    });
    setHighlightUploadErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    if (uploadingHighlightId === id) {
      setUploadingHighlightId(null);
    }
  }

  function moveHighlight(id: string, direction: "up" | "down") {
    setData((current) => {
      const sorted = [...current.profile.highlights].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((h) => h.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return current;
      [sorted[index], sorted[targetIndex]] = [sorted[targetIndex], sorted[index]];
      const reordered = sorted.map((h, i) => ({ ...h, order: i }));
      return { ...current, profile: { ...current.profile, highlights: reordered } };
    });
  }

  async function uploadHighlightImage(
    id: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingHighlightId(id);
    setHighlightUploadErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    try {
      const { url } = await uploadPlanningMedia({
        file,
        planningProjectId,
        category: "highlights",
      });

      setData((current) => ({
        ...current,
        profile: {
          ...current.profile,
          highlights: current.profile.highlights.map((h) =>
            h.id === id ? { ...h, imageUrl: url } : h
          ),
        },
      }));
    } catch (err) {
      setHighlightUploadErrors((current) => ({
        ...current,
        [id]: err instanceof Error ? err.message : "Erro ao enviar imagem.",
      }));
    } finally {
      setUploadingHighlightId(null);
      event.target.value = "";
    }
  }

  function removeHighlightImage(id: string) {
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        highlights: current.profile.highlights.map((h) =>
          h.id === id ? { ...h, imageUrl: "" } : h
        ),
      },
    }));
  }

  // ─── InlineList ───────────────────────────────────────────────────────────────

  function InlineList({
    items,
    onChangeItem,
    onAddItem,
    onRemoveItem,
    placeholder,
    buttonLabel,
  }: {
    items: string[];
    onChangeItem: (index: number, value: string) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    placeholder: string;
    buttonLabel: string;
  }) {
    return (
      <div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item}
                onChange={(event) => onChangeItem(index, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddItem}
          className="mt-4 cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-950 hover:border-slate-950 hover:text-white"
        >
          + {buttonLabel}
        </button>
      </div>
    );
  }

  // Derived flat lists

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="mt-6">
      {/* ── Navegação interna ── */}
      <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── 0. Direção estratégica ── */}
      <FormSection
        id="instagram-strategic-direction"
        title="Direção estratégica"
        description="Defina o papel do Instagram dentro da estratégia."
      >
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">
              Papel estratégico do Instagram
            </label>
            <p className="mb-2 text-sm leading-5 text-slate-500">
              Explique por que o Instagram existe dentro desta estratégia e qual função principal deverá cumprir.
            </p>
            <RichTextEditor
              value={data.strategicDirection.channelRole}
              onChange={(value) =>
                updateStrategicDirection("channelRole", value)
              }
            />
          </div>
        </div>
      </FormSection>

      {/* ── 1. Perfil do Instagram ── */}
      <FormSection
        id="instagram-profile"
        title="Perfil do Instagram"
        description="Configure como o perfil será apresentado visualmente ao público."
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
          <div className="space-y-10">
        {/* SubSection 1: Identificação */}
        <SubSection
          title="Identificação do perfil"
          description="Dados básicos de identificação do perfil no Instagram."
        >
          <div className="mb-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={data.profile.enabled}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    profile: { ...current.profile, enabled: event.target.checked },
                  }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Ativar bio
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-[150px_minmax(0,1fr)] md:items-start">
            <div className="flex flex-col items-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-xs font-semibold text-white">
                {data.profile.photoUrl ? (
                  <img
                    src={data.profile.photoUrl}
                    alt="Foto do perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Foto"
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="w-full cursor-pointer rounded-full bg-slate-950 px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800">
                  {uploadingProfilePhoto ? "Enviando..." : "Escolher foto"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={uploadBioPhoto}
                    disabled={uploadingProfilePhoto}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={removeBioPhoto}
                  className="w-full cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Remover
                </button>

                {profilePhotoError && (
                  <p className="text-xs text-red-500">{profilePhotoError}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Arroba do perfil
                </label>
                <input
                  type="text"
                  value={data.profile.handle}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      profile: { ...current.profile, handle: event.target.value },
                    }))
                  }
                  placeholder="Ex: @nomedoperfil"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Nome do perfil
                </label>
                <input
                  type="text"
                  value={data.profile.displayName}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      profile: { ...current.profile, displayName: event.target.value },
                    }))
                  }
                  placeholder="Ex: Nome do especialista ou da marca"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Quantidade de publicações
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.profile.publicationCount}
                  onChange={(event) => {
                    if (event.target.value === "" || Number(event.target.value) >= 0) {
                      setData((current) => ({
                        ...current,
                        profile: {
                          ...current.profile,
                          publicationCount: event.target.value,
                        },
                      }));
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Quantidade de seguidores
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.profile.followersCount}
                  onChange={(event) => {
                    if (event.target.value === "" || Number(event.target.value) >= 0) {
                      setData((current) => ({
                        ...current,
                        profile: {
                          ...current.profile,
                          followersCount: event.target.value,
                        },
                      }));
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Quantidade seguindo
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.profile.followingCount}
                  onChange={(event) => {
                    if (event.target.value === "" || Number(event.target.value) >= 0) {
                      setData((current) => ({
                        ...current,
                        profile: {
                          ...current.profile,
                          followingCount: event.target.value,
                        },
                      }));
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Categoria do perfil
                </label>
                <input
                  type="text"
                  value={data.profile.category}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        category: event.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>
          </div>
        </SubSection>

        {/* SubSection 2: Biografia */}
        <SubSection
          title="Biografia"
          description="Texto da bio e link principal exibido no perfil."
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Conteúdo da bio
              </label>
              <RichTextEditor
                value={data.profile.bio}
                onChange={(value) =>
                  setData((current) => ({
                    ...current,
                    profile: { ...current.profile, bio: value },
                  }))
                }
                placeholder="Escreva uma sugestão de bio para o Instagram."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Link principal
              </label>
              <input
                type="url"
                value={data.profile.mainLink}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    profile: { ...current.profile, mainLink: event.target.value },
                  }))
                }
                placeholder="https://..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>
        </SubSection>

        {/* SubSection 3: Destaques */}
        <SubSection
          title="Destaques"
          description="Destaques fixos exibidos no perfil do Instagram."
        >
          {data.profile.highlights.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Nenhum destaque cadastrado.</p>
              <button
                type="button"
                onClick={addHighlight}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar destaque
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.profile.highlights
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((highlight, index, sorted) => (
                  <div
                    key={highlight.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                          {highlight.imageUrl ? (
                            <img
                              src={highlight.imageUrl}
                              alt={highlight.title || "Destaque"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">Sem imagem</span>
                          )}
                        </div>
                      </div>

                      <div className="grid flex-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Nome do destaque
                          </label>
                          <input
                            type="text"
                            value={highlight.title}
                            onChange={(event) =>
                              updateHighlight(highlight.id, "title", event.target.value)
                            }
                            placeholder="Ex: Sobre, Serviços, Depoimentos..."
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Função
                          </label>
                          <input
                            type="text"
                            value={highlight.purpose}
                            onChange={(event) =>
                              updateHighlight(highlight.id, "purpose", event.target.value)
                            }
                            placeholder="Ex: Apresentar o especialista, mostrar serviços..."
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          />
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 flex-col items-end justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => moveHighlight(highlight.id, "up")}
                          disabled={index === 0}
                          className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHighlight(highlight.id, "down")}
                          disabled={index === sorted.length - 1}
                          className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHighlight(highlight.id)}
                          className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label
                        className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition ${
                          uploadingHighlightId === highlight.id
                            ? "bg-slate-200 text-slate-500"
                            : "bg-slate-950 text-white hover:bg-slate-800"
                        }`}
                      >
                        {uploadingHighlightId === highlight.id
                          ? "Enviando..."
                          : "Enviar imagem"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => uploadHighlightImage(highlight.id, event)}
                          disabled={uploadingHighlightId === highlight.id}
                          className="hidden"
                        />
                      </label>

                      {highlight.imageUrl && (
                        <button
                          type="button"
                          onClick={() => removeHighlightImage(highlight.id)}
                          className="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                          Remover imagem
                        </button>
                      )}

                      {highlightUploadErrors[highlight.id] && (
                        <p className="text-xs text-red-500">
                          {highlightUploadErrors[highlight.id]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              <button
                type="button"
                onClick={addHighlight}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar destaque
              </button>
            </div>
          )}
        </SubSection>
          </div>
          <div>
            <InstagramProfilePreview profile={data.profile} />
          </div>
        </div>
      </FormSection>

      {/* ── 2. Frequência e objetivos ── */}
      <FormSection
        id="instagram-frequency-objectives"
        title="Frequência e objetivos"
        description="Defina a cadência de publicação e os resultados esperados para o canal."
      >
        {/* SubSection 1: Cadência por formato */}
        <SubSection
          title="Cadência por formato"
          description="Defina a frequência de publicação por formato de conteúdo."
        >
          {data.publishing.frequencyItems.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Nenhuma frequência por formato cadastrada.
              </p>
              <button
                type="button"
                onClick={addFrequencyItem}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar formato
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.publishing.frequencyItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Formato {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFrequencyItem(item.id)}
                      className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_140px_180px]">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Formato
                      </label>
                      <input
                        type="text"
                        value={item.format}
                        onChange={(event) =>
                          updateFrequencyItem(item.id, "format", event.target.value)
                        }
                        placeholder="Reels, Carrossel, Stories, Live..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Quantidade
                      </label>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(event) =>
                          updateFrequencyItem(item.id, "quantity", event.target.value)
                        }
                        placeholder="3, diário..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Período
                      </label>
                      <select
                        value={item.period}
                        onChange={(event) =>
                          updateFrequencyItem(item.id, "period", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      >
                        {!["por dia", "por semana", "por mês"].includes(item.period) &&
                          item.period && (
                            <option value={item.period}>{item.period}</option>
                          )}
                        <option value="por dia">por dia</option>
                        <option value="por semana">por semana</option>
                        <option value="por mês">por mês</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFrequencyItem}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar formato
              </button>
            </div>
          )}
        </SubSection>

        {/* SubSection 2: Objetivos do canal */}
        <SubSection
          title="Objetivos do canal"
          description="Registre os objetivos estratégicos do Instagram."
        >
          {data.objectives.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Nenhum objetivo cadastrado.</p>
              <button
                type="button"
                onClick={addObjective}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar objetivo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.objectives.map((obj, index) => (
                <div
                  key={obj.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Objetivo {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeObjective(obj.id)}
                      className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Objetivo
                      </label>
                      <textarea
                        value={obj.objective}
                        onChange={(event) =>
                          updateObjective(obj.id, "objective", event.target.value)
                        }
                        rows={3}
                        placeholder="Ex: Gerar contatos qualificados para o atendimento."
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar objetivo
              </button>
            </div>
          )}
        </SubSection>
      </FormSection>

      {/* ── 3. Arquitetura de conteúdo ── */}
      <FormSection
        id="instagram-content"
        title="Arquitetura de conteúdo"
        description="Organize os formatos, temas e possibilidades editoriais do Instagram."
      >
        {/* SubSection 1: Stories estratégicos */}
        <SubSection
          title="Stories estratégicos"
          description="Registre os tipos de Stories utilizados estrategicamente, com frequência, etapa da jornada e CTA."
        >
          {data.contentArchitecture.stories.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Nenhum Story estratégico cadastrado.</p>
              <button
                type="button"
                onClick={addStory}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar Story estratégico
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.contentArchitecture.stories.map((story, index) => (
                <div
                  key={story.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Story {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveStory(story.id, "up")}
                        disabled={index === 0}
                        aria-label="Mover Story para cima"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStory(story.id, "down")}
                        disabled={index === data.contentArchitecture.stories.length - 1}
                        aria-label="Mover Story para baixo"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStory(story.id)}
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_160px_180px]">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Nome do Story estratégico
                      </label>
                      <input
                        type="text"
                        value={story.name}
                        onChange={(event) =>
                          updateStory(story.id, "name", event.target.value)
                        }
                        placeholder="Ex.: Bastidor de raciocínio, Enquete de identificação ou Caixa de perguntas"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Frequência
                      </label>
                      <input
                        type="text"
                        value={story.frequency}
                        onChange={(event) =>
                          updateStory(story.id, "frequency", event.target.value)
                        }
                        placeholder="Diário, semanal..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Etapa da jornada
                      </label>
                      <input
                        type="text"
                        value={story.journeyStage}
                        onChange={(event) =>
                          updateStory(story.id, "journeyStage", event.target.value)
                        }
                        placeholder="Descoberta, consciência, consideração ou decisão"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        CTA
                      </label>
                      <input
                        type="text"
                        value={story.cta}
                        onChange={(event) =>
                          updateStory(story.id, "cta", event.target.value)
                        }
                        placeholder="Responder à enquete, enviar uma dúvida..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStory}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar Story estratégico
              </button>
            </div>
          )}
        </SubSection>

        {/* SubSection 2: Hashtags */}
        <SubSection
          title="Hashtags"
          description="Registre hashtags importantes para descoberta, nicho, localização, autoridade e temas recorrentes."
        >
          <InlineList
            items={flatHashtags}
            onChangeItem={updateHashtag}
            onAddItem={addHashtag}
            onRemoveItem={removeHashtag}
            placeholder="Ex: #marketingdigital, #estrategiadeconteudo..."
            buttonLabel="Nova hashtag"
          />
        </SubSection>
      </FormSection>

      {/* ── 4. Estrutura de linguagem ── */}
      <FormSection
        id="instagram-language"
        title="Estrutura de linguagem"
        description="Registre como a comunicação deve aparecer nos conteúdos do canal."
      >
        <SubSection
          title="Diretrizes de linguagem"
          description="Defina os padrões de comunicação que devem orientar a produção dos conteúdos no Instagram."
        >
          {data.languageStructures.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Nenhuma estrutura de linguagem cadastrada.</p>
              <button
                type="button"
                onClick={addLanguageStructure}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar estrutura de linguagem
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.languageStructures.map((lang, index) => (
                <div
                  key={lang.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Estrutura {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveLanguageStructure(lang.id, "up")}
                        disabled={index === 0}
                        aria-label="Mover estrutura para cima"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLanguageStructure(lang.id, "down")}
                        disabled={index === data.languageStructures.length - 1}
                        aria-label="Mover estrutura para baixo"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLanguageStructure(lang.id)}
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Nome da estrutura
                      </label>
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(event) =>
                          updateLanguageStructure(lang.id, "name", event.target.value)
                        }
                        placeholder="Ex.: Investigativa, Didática ou Contestadora com fundamento"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-semibold text-slate-600">
                      O que evitar
                    </label>
                    <p className="mb-2 text-xs leading-5 text-slate-500">
                      Registre excessos, erros de tom ou comportamentos que contradizem essa estrutura.
                    </p>
                    <textarea
                      value={lang.avoid}
                      onChange={(event) =>
                        updateLanguageStructure(lang.id, "avoid", event.target.value)
                      }
                      rows={2}
                      placeholder="Ex.: Perguntas retóricas sem conclusão ou recomendações genéricas."
                      className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>

                </div>
              ))}
              <button
                type="button"
                onClick={addLanguageStructure}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar estrutura de linguagem
              </button>
            </div>
          )}
        </SubSection>
      </FormSection>

      {/* ── 5. Identidade visual ── */}
      <FormSection
        id="instagram-visual"
        title="Identidade visual"
        description="Organize as referências visuais do Instagram."
      >
        {/* SubSection 1: Referências visuais */}
        <SubSection
          title="Referências visuais"
          description="Adicione imagens que inspirem a direção visual do canal."
        >
          {data.visualDirection.references.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Nenhuma referência visual cadastrada.</p>
              <button
                type="button"
                onClick={addVisualReferenceSlot}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar referência visual
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {[...data.visualDirection.references]
                .sort((a, b) => a.order - b.order)
                .map((reference, index, sorted) => (
                  <div
                    key={reference.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                      {/* Image preview + upload */}
                      <div className="flex flex-col gap-3">
                        <label className="flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white text-center text-sm font-semibold text-slate-500 transition hover:bg-slate-100">
                          {uploadingRefId === reference.id ? (
                            <span className="text-xs">Enviando...</span>
                          ) : reference.url ? (
                            <img
                              src={reference.url}
                              alt={reference.title || "Referência visual"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">
                              +<br />
                              Enviar imagem
                            </span>
                          )}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) =>
                              uploadVisualReference(reference.id, event)
                            }
                            disabled={uploadingRefId !== null}
                            className="hidden"
                          />
                        </label>
                        {refUploadErrors[reference.id] && (
                          <p className="text-xs text-red-500">
                            {refUploadErrors[reference.id]}
                          </p>
                        )}
                      </div>

                      {/* Fields + actions */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                              Título da referência
                            </label>
                            <input
                              type="text"
                              value={reference.title ?? ""}
                              onChange={(event) =>
                                updateVisualReference(reference.id, "title", event.target.value)
                              }
                              placeholder="Ex.: Perfil de referência, post inspirador..."
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-1 pt-8">
                            <button
                              type="button"
                              onClick={() => moveVisualReference(reference.id, "up")}
                              disabled={index === 0}
                              aria-label="Mover referência para cima"
                              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveVisualReference(reference.id, "down")}
                              disabled={index === sorted.length - 1}
                              aria-label="Mover referência para baixo"
                              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeVisualReference(reference.id)}
                              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-600">
                            Descrição da referência
                          </label>
                          <p className="mb-2 text-xs leading-5 text-slate-500">
                            Explique o que deve ser observado ou aproveitado nesta referência.
                          </p>
                          <textarea
                            value={reference.description ?? ""}
                            onChange={(event) =>
                              updateVisualReference(reference.id, "description", event.target.value)
                            }
                            rows={3}
                            className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={addVisualReferenceSlot}
                  className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                >
                  + Adicionar referência visual
                </button>
                <p className="text-xs text-slate-500">
                  Formatos aceitos: JPEG, PNG ou WebP. Limite de 5 MB.
                </p>
              </div>
            </div>
          )}
        </SubSection>
      </FormSection>

      {/* ── Conversão ── */}
      <FormSection
        id="instagram-conversion"
        title="Conversão"
        description="Defina como os conteúdos do Instagram conduzirão o público da descoberta até a ação comercial."
      >
        <SubSection title="Conversão por etapa da jornada">
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            {/* Descoberta */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">01</span>
                <span className="text-sm font-semibold text-slate-700">Descoberta</span>
              </div>
              <p className="mb-4 text-xs leading-5 text-slate-500">
                Para conteúdos que alcançam pessoas ainda no início da jornada.
              </p>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="conversion-discovery-cta"
                    className="mb-1 block text-sm font-semibold text-slate-600"
                  >
                    CTA de descoberta
                  </label>
                  <textarea
                    id="conversion-discovery-cta"
                    value={data.conversion.discovery.cta}
                    onChange={(event) =>
                      updateConversionStage("discovery", "cta", event.target.value)
                    }
                    rows={3}
                    placeholder="Seguir o perfil, consumir outro conteúdo ou salvar a publicação"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="conversion-discovery-destination"
                    className="mb-1 block text-sm font-semibold text-slate-600"
                  >
                    Destino de descoberta
                  </label>
                  <textarea
                    id="conversion-discovery-destination"
                    value={data.conversion.discovery.destination}
                    onChange={(event) =>
                      updateConversionStage("discovery", "destination", event.target.value)
                    }
                    rows={3}
                    placeholder="Perfil, Reel relacionado, carrossel ou conteúdo complementar"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 items-center text-slate-300 md:flex">→</div>

            {/* Consideração */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">02</span>
                <span className="text-sm font-semibold text-slate-700">Consideração</span>
              </div>
              <p className="mb-4 text-xs leading-5 text-slate-500">
                Para conteúdos que aprofundam o problema, a solução ou o método.
              </p>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="conversion-consideration-cta"
                    className="mb-1 block text-sm font-semibold text-slate-600"
                  >
                    CTA de consideração
                  </label>
                  <textarea
                    id="conversion-consideration-cta"
                    value={data.conversion.consideration.cta}
                    onChange={(event) =>
                      updateConversionStage("consideration", "cta", event.target.value)
                    }
                    rows={3}
                    placeholder="Conhecer o Diagnóstico ou salvar o material"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="conversion-consideration-destination"
                    className="mb-1 block text-sm font-semibold text-slate-600"
                  >
                    Destino de consideração
                  </label>
                  <textarea
                    id="conversion-consideration-destination"
                    value={data.conversion.consideration.destination}
                    onChange={(event) =>
                      updateConversionStage("consideration", "destination", event.target.value)
                    }
                    rows={3}
                    placeholder="Página do Diagnóstico, destaque, aula ou conteúdo aprofundado"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 items-center text-slate-300 md:flex">→</div>

            {/* Decisão */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">03</span>
                <span className="text-sm font-semibold text-slate-700">Decisão</span>
              </div>
              <p className="mb-4 text-xs leading-5 text-slate-500">
                Para conteúdos direcionados a pessoas próximas da ação comercial.
              </p>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="conversion-decision-cta"
                    className="mb-1 block text-sm font-semibold text-slate-600"
                  >
                    CTA de decisão
                  </label>
                  <textarea
                    id="conversion-decision-cta"
                    value={data.conversion.decision.cta}
                    onChange={(event) =>
                      updateConversionStage("decision", "cta", event.target.value)
                    }
                    rows={3}
                    placeholder="Falar no WhatsApp ou solicitar uma conversa"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="conversion-decision-destination"
                    className="mb-1 block text-sm font-semibold text-slate-600"
                  >
                    Destino de decisão
                  </label>
                  <textarea
                    id="conversion-decision-destination"
                    value={data.conversion.decision.destination}
                    onChange={(event) =>
                      updateConversionStage("decision", "destination", event.target.value)
                    }
                    rows={3}
                    placeholder="WhatsApp, formulário ou página comercial"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </SubSection>

      </FormSection>

      {/* ── Indicadores e mensuração ── */}
      {false && <FormSection
        id="instagram-measurement"
        title="Indicadores e mensuração"
        description="Defina como o desempenho do Instagram será acompanhado, interpretado e utilizado nas decisões estratégicas."
      >
        {/* ── 1. Indicadores de desempenho ── */}
        <SubSection title="Indicadores de desempenho">
          <div className="space-y-8">
            {/* Indicadores principais */}
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                Indicadores principais
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre as métricas mais diretamente ligadas aos objetivos estratégicos e comerciais do canal.
              </p>
              {data.measurement.primaryIndicators.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Nenhum indicador principal cadastrado.
                  </p>
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("primaryIndicators")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar indicador principal
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.measurement.primaryIndicators.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Principal {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("primaryIndicators", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover indicador para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("primaryIndicators", index, "down")
                            }
                            disabled={
                              index === data.measurement.primaryIndicators.length - 1
                            }
                            aria-label="Mover indicador para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeMeasurementListItem("primaryIndicators", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateMeasurementListItem(
                            "primaryIndicators",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: Cliques no link da bio, mensagens iniciadas ou oportunidades originadas pelo Instagram"
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("primaryIndicators")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar indicador principal
                  </button>
                </div>
              )}
            </div>

            {/* Indicadores secundários */}
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                Indicadores secundários
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre sinais complementares que ajudam a interpretar interesse, relevância e qualidade do conteúdo.
              </p>
              {data.measurement.secondaryIndicators.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Nenhum indicador secundário cadastrado.
                  </p>
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("secondaryIndicators")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar indicador secundário
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.measurement.secondaryIndicators.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Secundário {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("secondaryIndicators", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover indicador para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("secondaryIndicators", index, "down")
                            }
                            disabled={
                              index === data.measurement.secondaryIndicators.length - 1
                            }
                            aria-label="Mover indicador para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeMeasurementListItem("secondaryIndicators", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateMeasurementListItem(
                            "secondaryIndicators",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: Salvamentos, compartilhamentos ou comentários com dúvidas reais"
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("secondaryIndicators")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar indicador secundário
                  </button>
                </div>
              )}
            </div>

            {/* Métricas de vaidade */}
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                Métricas de vaidade
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre métricas que não devem ser analisadas isoladamente nem tratadas automaticamente como resultado estratégico.
              </p>
              {data.measurement.vanityMetrics.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Nenhuma métrica de vaidade cadastrada.
                  </p>
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("vanityMetrics")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar métrica de vaidade
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.measurement.vanityMetrics.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Métrica {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("vanityMetrics", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover métrica para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("vanityMetrics", index, "down")
                            }
                            disabled={
                              index === data.measurement.vanityMetrics.length - 1
                            }
                            aria-label="Mover métrica para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeMeasurementListItem("vanityMetrics", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateMeasurementListItem(
                            "vanityMetrics",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: Número total de seguidores ou curtidas sem relação com conversão"
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("vanityMetrics")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar métrica de vaidade
                  </button>
                </div>
              )}
            </div>
          </div>
        </SubSection>

        {/* ── 2. Rotina de análise ── */}
        <SubSection title="Rotina de análise">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="measurement-weekly-review"
                className="mb-1 block text-sm font-semibold text-slate-600"
              >
                Revisão semanal
              </label>
              <p className="mb-2 text-xs leading-5 text-slate-500">
                Defina quais sinais devem ser observados semanalmente e como essa análise deve orientar ajustes rápidos.
              </p>
              <textarea
                id="measurement-weekly-review"
                value={data.measurement.weeklyReview}
                onChange={(event) =>
                  updateMeasurement("weeklyReview", event.target.value)
                }
                rows={4}
                placeholder="Ex.: Revisar alcance, retenção, salvamentos, compartilhamentos e cliques dos conteúdos publicados na semana."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="measurement-monthly-review"
                className="mb-1 block text-sm font-semibold text-slate-600"
              >
                Revisão mensal
              </label>
              <p className="mb-2 text-xs leading-5 text-slate-500">
                Defina quais resultados acumulados devem ser analisados mensalmente e como serão relacionados aos objetivos do canal.
              </p>
              <textarea
                id="measurement-monthly-review"
                value={data.measurement.monthlyReview}
                onChange={(event) =>
                  updateMeasurement("monthlyReview", event.target.value)
                }
                rows={4}
                placeholder="Ex.: Avaliar contatos, oportunidades, Diagnósticos e vendas originadas pelo Instagram."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>
        </SubSection>

        {/* ── 3. Critérios de decisão ── */}
        <SubSection title="Critérios de decisão">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="measurement-keep-criterion"
                className="mb-1 block text-sm font-semibold text-slate-600"
              >
                Critério para manter
              </label>
              <p className="mb-2 text-xs leading-5 text-slate-500">
                Defina quais sinais justificam manter um formato, tema ou abordagem.
              </p>
              <textarea
                id="measurement-keep-criterion"
                value={data.measurement.keepCriterion}
                onChange={(event) =>
                  updateMeasurement("keepCriterion", event.target.value)
                }
                rows={3}
                placeholder="Ex.: Manter quando houver retenção consistente e geração de ações qualificadas."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="measurement-adjust-criterion"
                className="mb-1 block text-sm font-semibold text-slate-600"
              >
                Critério para ajustar
              </label>
              <p className="mb-2 text-xs leading-5 text-slate-500">
                Defina quando o conteúdo deve ter tema, formato, distribuição ou abordagem modificados.
              </p>
              <textarea
                id="measurement-adjust-criterion"
                value={data.measurement.adjustCriterion}
                onChange={(event) =>
                  updateMeasurement("adjustCriterion", event.target.value)
                }
                rows={3}
                placeholder="Ex.: Ajustar quando houver alcance, mas nenhuma progressão para conversa ou clique qualificado."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="measurement-stop-criterion"
                className="mb-1 block text-sm font-semibold text-slate-600"
              >
                Critério para interromper
              </label>
              <p className="mb-2 text-xs leading-5 text-slate-500">
                Defina em quais condições um formato ou iniciativa deve ser encerrado após um ciclo adequado de testes.
              </p>
              <textarea
                id="measurement-stop-criterion"
                value={data.measurement.stopCriterion}
                onChange={(event) =>
                  updateMeasurement("stopCriterion", event.target.value)
                }
                rows={3}
                placeholder="Ex.: Interromper somente após um ciclo completo sem sinais de retenção, interesse ou conversão."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>
        </SubSection>

        {/* ── 4. Linha de base e hipóteses ── */}
        <SubSection title="Linha de base e hipóteses">
          <div className="space-y-8">
            <div>
              <label
                htmlFor="measurement-baseline"
                className="mb-1 block text-sm font-semibold text-slate-600"
              >
                Linha de base
              </label>
              <p className="mb-2 text-xs leading-5 text-slate-500">
                Registre o ponto inicial de comparação ou explique como e quando ele será estabelecido.
              </p>
              <textarea
                id="measurement-baseline"
                value={data.measurement.baseline}
                onChange={(event) =>
                  updateMeasurement("baseline", event.target.value)
                }
                rows={3}
                placeholder="Ex.: Estabelecer após os primeiros 30 dias, pois ainda não há histórico documentado."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                Hipóteses a testar
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre suposições estratégicas que devem ser verificadas por meio dos dados e do comportamento do público.
              </p>
              {data.measurement.hypotheses.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Nenhuma hipótese cadastrada.</p>
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("hypotheses")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar hipótese
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.measurement.hypotheses.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Hipótese {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("hypotheses", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover hipótese para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveMeasurementListItem("hypotheses", index, "down")
                            }
                            disabled={index === data.measurement.hypotheses.length - 1}
                            aria-label="Mover hipótese para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeMeasurementListItem("hypotheses", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateMeasurementListItem(
                            "hypotheses",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: Reels de reenquadramento geram mais conversas qualificadas do que carrosséis educativos."
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMeasurementListItem("hypotheses")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar hipótese
                  </button>
                </div>
              )}
            </div>
          </div>
        </SubSection>
      </FormSection>}

      {/* ── Integração com outros canais ── */}
      <FormSection
        id="instagram-integration"
        title="Integração com outros canais"
        description="Defina como o Instagram se conecta aos demais canais, conteúdos e pontos de contato da estratégia."
      >
        {/* ── 1. Papel no ecossistema ── */}
        <SubSection title="Papel no ecossistema">
          <label
            htmlFor="integration-ecosystem-role"
            className="mb-1 block text-sm font-semibold text-slate-600"
          >
            Papel do Instagram no ecossistema
          </label>
          <p className="mb-2 text-xs leading-5 text-slate-500">
            Explique qual função o Instagram cumpre em relação aos demais canais e etapas da estratégia.
          </p>
          <textarea
            id="integration-ecosystem-role"
            value={data.integration.ecosystemRole}
            onChange={(event) =>
              updateIntegration("ecosystemRole", event.target.value)
            }
            rows={4}
            placeholder="Ex.: Funcionar como canal público de descoberta, autoridade e relacionamento, conduzindo parte da audiência para conteúdos aprofundados e canais comerciais."
            className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </SubSection>

        {/* ── 2. Fluxo de audiência ── */}
        <SubSection title="Fluxo de audiência">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Recebe audiência de */}
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                Recebe audiência de
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre os canais, campanhas ou pontos de contato que podem levar pessoas até o Instagram.
              </p>
              {data.integration.receivesAudienceFrom.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Nenhuma origem de audiência cadastrada.
                  </p>
                  <button
                    type="button"
                    onClick={() => addIntegrationListItem("receivesAudienceFrom")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar origem de audiência
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.integration.receivesAudienceFrom.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Origem {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveIntegrationListItem("receivesAudienceFrom", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover origem para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveIntegrationListItem("receivesAudienceFrom", index, "down")
                            }
                            disabled={
                              index === data.integration.receivesAudienceFrom.length - 1
                            }
                            aria-label="Mover origem para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeIntegrationListItem("receivesAudienceFrom", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateIntegrationListItem(
                            "receivesAudienceFrom",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: YouTube, evento presencial ou campanha de tráfego pago"
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addIntegrationListItem("receivesAudienceFrom")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar origem de audiência
                  </button>
                </div>
              )}
            </div>

            {/* Direciona audiência para */}
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                Direciona audiência para
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre os canais, páginas e ambientes para os quais o Instagram deve conduzir o público.
              </p>
              {data.integration.directsAudienceTo.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Nenhum destino de audiência cadastrado.
                  </p>
                  <button
                    type="button"
                    onClick={() => addIntegrationListItem("directsAudienceTo")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar destino de audiência
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.integration.directsAudienceTo.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Destino {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveIntegrationListItem("directsAudienceTo", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover destino para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveIntegrationListItem("directsAudienceTo", index, "down")
                            }
                            disabled={
                              index === data.integration.directsAudienceTo.length - 1
                            }
                            aria-label="Mover destino para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeIntegrationListItem("directsAudienceTo", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateIntegrationListItem(
                            "directsAudienceTo",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: WhatsApp, canal no YouTube, página do Diagnóstico ou lista de e-mails"
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addIntegrationListItem("directsAudienceTo")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar destino de audiência
                  </button>
                </div>
              )}
            </div>
          </div>
        </SubSection>

        {/* ── 3. CTAs de conexão entre canais ── */}
        <SubSection title="CTAs de conexão entre canais">
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                CTAs de conexão entre canais
              </p>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Registre chamadas que conduzam o público do Instagram para outro canal ou tragam audiência de volta para o perfil.
              </p>
              {data.integration.connectionCtas.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Nenhum CTA de conexão cadastrado.
                  </p>
                  <button
                    type="button"
                    onClick={() => addIntegrationListItem("connectionCtas")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar CTA de conexão
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.integration.connectionCtas.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          CTA {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveIntegrationListItem("connectionCtas", index, "up")
                            }
                            disabled={index === 0}
                            aria-label="Mover CTA para cima"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveIntegrationListItem("connectionCtas", index, "down")
                            }
                            disabled={
                              index === data.integration.connectionCtas.length - 1
                            }
                            aria-label="Mover CTA para baixo"
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              removeIntegrationListItem("connectionCtas", index)
                            }
                            className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateIntegrationListItem(
                            "connectionCtas",
                            index,
                            event.target.value
                          )
                        }
                        rows={2}
                        placeholder="Ex.: Assista à análise completa no YouTube"
                        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addIntegrationListItem("connectionCtas")}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    + Adicionar CTA de conexão
                  </button>
                </div>
              )}
            </div>
          </div>
        </SubSection>

        {/* ── 4. Dependências operacionais ── */}
        {false && <SubSection title="Dependências operacionais">
          <p className="mb-3 text-xs leading-5 text-slate-500">
            Registre recursos, processos, pessoas ou entregas necessárias para que a integração entre canais funcione.
          </p>
          {data.integration.operationalDependencies.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Nenhuma dependência operacional cadastrada.
              </p>
              <button
                type="button"
                onClick={() => addIntegrationListItem("operationalDependencies")}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar dependência
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {data.integration.operationalDependencies.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Dependência {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          moveIntegrationListItem("operationalDependencies", index, "up")
                        }
                        disabled={index === 0}
                        aria-label="Mover dependência para cima"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          moveIntegrationListItem("operationalDependencies", index, "down")
                        }
                        disabled={
                          index === data.integration.operationalDependencies.length - 1
                        }
                        aria-label="Mover dependência para baixo"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeIntegrationListItem("operationalDependencies", index)
                        }
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={item}
                    onChange={(event) =>
                      updateIntegrationListItem(
                        "operationalDependencies",
                        index,
                        event.target.value
                      )
                    }
                    rows={2}
                    placeholder="Ex.: Vídeo longo aprovado antes da produção dos cortes para Reels"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addIntegrationListItem("operationalDependencies")}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar dependência
              </button>
            </div>
          )}
        </SubSection>}
      </FormSection>

      {/* ── 6. Referências externas ── */}
      <FormSection
        id="instagram-references"
        title="Referências externas"
        description="Centralize links e materiais que apoiam a estratégia do Instagram."
      >
        <SubSection
          title="Links e materiais de apoio"
          description="Registre páginas, documentos, perfis e conteúdos usados como referência para a estratégia do canal."
        >
          {data.externalReferences.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Nenhuma referência externa cadastrada.</p>
              <button
                type="button"
                onClick={addExternalReference}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar referência
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.externalReferences.map((reference, index) => (
                <div
                  key={reference.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Referência {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExternalReference(reference.id, "up")}
                        disabled={index === 0}
                        aria-label="Mover referência para cima"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          moveExternalReference(reference.id, "down")
                        }
                        disabled={index === data.externalReferences.length - 1}
                        aria-label="Mover referência para baixo"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExternalReference(reference.id)}
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        Título da referência
                      </label>
                      <input
                        type="text"
                        value={reference.title}
                        onChange={(event) =>
                          updateExternalReference(
                            reference.id,
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="Ex.: Perfil de referência, artigo, estudo ou página de concorrente"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">
                        URL
                      </label>
                      <input
                        type="url"
                        value={reference.url}
                        onChange={(event) =>
                          updateExternalReference(
                            reference.id,
                            "url",
                            event.target.value
                          )
                        }
                        placeholder="https://"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-semibold text-slate-600">
                      Observações
                    </label>
                    <p className="mb-2 text-xs leading-5 text-slate-500">
                      Explique por que essa referência é relevante e o que deve ser analisado ou aproveitado.
                    </p>
                    <textarea
                      value={reference.notes}
                      onChange={(event) =>
                        updateExternalReference(
                          reference.id,
                          "notes",
                          event.target.value
                        )
                      }
                      rows={3}
                      placeholder="Ex.: Observar a organização dos destaques e a clareza da proposta na bio."
                      className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExternalReference}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              >
                + Adicionar referência
              </button>
            </div>
          )}
        </SubSection>
      </FormSection>

      {/* ── Sticky save bar ── */}
      <div className="sticky bottom-0 rounded-[1.5rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/admin/planejamentos/${clientSlug}`}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voltar para módulos
          </Link>

          <Link
            href={presentationHref}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver apresentação
          </Link>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isDisabled}
            className="cursor-pointer rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar módulo"}
          </button>
        </div>
      </div>
    </div>
  );
}
