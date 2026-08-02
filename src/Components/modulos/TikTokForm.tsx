"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import RichTextEditor from "@/Components/RichTextEditor";
import { uploadPlanningMedia } from "@/lib/uploadPlanningMedia";

export type TikTokListItem = { id: string; value: string };
export type TikTokFrequencyItem = { id: string; format: string; quantity: string; period: string; observation: string };
export type TikTokContentFront = { id: string; name: string; percentage: string; description: string };
export type TikTokVisualReference = { id: string; image: string };
export type TikTokExternalReference = { id: string; title: string; link: string };
export type TikTokConversionStage = { action: string; destination: string };
export type TikTokIndicator = { id: string; name: string };
export type TikTokIndicatorCategory = { id: string; name: string; indicators: TikTokIndicator[] };

export type TikTokData = {
  strategicRole: string;
  objectives: TikTokListItem[];
  profileImageUrl: string;
  username: string;
  profileName: string;
  bio: string;
  followingCount: string;
  followersCount: string;
  likesCount: string;
  mainLink: string;
  frequencyItems: TikTokFrequencyItem[];
  contentFronts: TikTokContentFront[];
  mainFormats: string;
  editorialTerritories: string;
  videoStructure: string;
  languageAndRetention: string;
  visualGuideline: string;
  visualElements: TikTokListItem[];
  visualAvoidItems: TikTokListItem[];
  visualReferences: TikTokVisualReference[];
  conversion: { discovery: TikTokConversionStage; consideration: TikTokConversionStage; decision: TikTokConversionStage };
  ctaGuideline: string;
  ecosystemRole: string;
  receivesFrom: TikTokListItem[];
  directsTo: TikTokListItem[];
  indicatorCategories: TikTokIndicatorCategory[];
  references: TikTokExternalReference[];
  languageStructures: TikTokListItem[];
  contents: TikTokListItem[];
  contentSeries: string;
  visualStrategy: string;
  openingHooks: string;
  retentionResources: string;
};

const emptyStage = (): TikTokConversionStage => ({ action: "", destination: "" });
const uid = (prefix: string) => `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;

export const initialTikTokFrequencyItems: TikTokFrequencyItem[] = [];
export const initialTikTokData: TikTokData = {
  strategicRole: "", objectives: [], profileImageUrl: "", username: "", profileName: "", bio: "",
  followingCount: "", followersCount: "", likesCount: "", mainLink: "", frequencyItems: [], contentFronts: [],
  mainFormats: "", editorialTerritories: "", videoStructure: "", languageAndRetention: "", visualGuideline: "",
  visualElements: [], visualAvoidItems: [], visualReferences: [],
  conversion: { discovery: emptyStage(), consideration: emptyStage(), decision: emptyStage() },
  ctaGuideline: "", ecosystemRole: "", receivesFrom: [], directsTo: [], indicatorCategories: [], references: [],
  languageStructures: [], contents: [], contentSeries: "", visualStrategy: "", openingHooks: "", retentionResources: "",
};

const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};
const str = (value: unknown): string => typeof value === "string" ? value : typeof value === "number" && Number.isFinite(value) ? String(value) : "";
const stableId = (value: unknown, fallback: string): string => str(record(value).id) || fallback;

export function normalizeTikTokTextList(value: unknown, prefix = "item"): TikTokListItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => ({ id: stableId(item, `${prefix}-${index}`), value: typeof item === "string" ? item : str(record(item).value) }));
}

export function normalizeTikTokData(value: unknown): TikTokData {
  const raw = record(value);
  const legacyLanguage = normalizeTikTokTextList(raw.languageStructures, "legacy-language");
  const legacyContents = normalizeTikTokTextList(raw.contents, "legacy-content");
  const conversion = record(raw.conversion);
  const stage = (key: string): TikTokConversionStage => ({ action: str(record(conversion[key]).action || record(conversion[key]).cta), destination: str(record(conversion[key]).destination) });
  const refs = Array.isArray(raw.visualReferences) ? raw.visualReferences.map((item, index) => ({ id: stableId(item, `visual-reference-${index}`), image: str(record(item).image) })).slice(0, 3) : [];
  const frequencies = Array.isArray(raw.frequencyItems) ? raw.frequencyItems.map((item, index) => { const x = record(item); return { id: stableId(item, `frequency-${index}`), format: str(x.format), quantity: str(x.quantity), period: str(x.period), observation: str(x.observation) }; }) : [];
  return {
    strategicRole: str(raw.strategicRole), objectives: normalizeTikTokTextList(raw.objectives, "objective"),
    profileImageUrl: str(raw.profileImageUrl), username: str(raw.username), profileName: str(raw.profileName), bio: str(raw.bio),
    followingCount: str(raw.followingCount), followersCount: str(raw.followersCount), likesCount: str(raw.likesCount), mainLink: str(raw.mainLink),
    frequencyItems: frequencies,
    contentFronts: Array.isArray(raw.contentFronts) ? raw.contentFronts.map((item, index) => { const x = record(item); return { id: stableId(item, `content-front-${index}`), name: str(x.name), percentage: str(x.percentage), description: str(x.description) }; }) : legacyContents.filter((item) => item.value.trim()).map((item) => ({ id: `front-${item.id}`, name: item.value, percentage: "", description: "" })),
    mainFormats: str(raw.mainFormats), editorialTerritories: str(raw.editorialTerritories) || str(raw.contentSeries),
    videoStructure: str(raw.videoStructure) || str(raw.openingHooks),
    languageAndRetention: str(raw.languageAndRetention) || str(raw.retentionResources) || legacyLanguage.find((item) => item.value.trim())?.value || "",
    visualGuideline: str(raw.visualGuideline) || str(raw.visualStrategy),
    visualElements: normalizeTikTokTextList(raw.visualElements, "visual-element"), visualAvoidItems: normalizeTikTokTextList(raw.visualAvoidItems, "visual-avoid"), visualReferences: refs,
    conversion: { discovery: stage("discovery"), consideration: stage("consideration"), decision: stage("decision") },
    ctaGuideline: str(raw.ctaGuideline), ecosystemRole: str(raw.ecosystemRole), receivesFrom: normalizeTikTokTextList(raw.receivesFrom, "origin"), directsTo: normalizeTikTokTextList(raw.directsTo, "destination"),
    indicatorCategories: Array.isArray(raw.indicatorCategories) ? raw.indicatorCategories.map((item, index) => { const x = record(item); return { id: stableId(item, `indicator-category-${index}`), name: str(x.name), indicators: Array.isArray(x.indicators) ? x.indicators.map((indicator, indicatorIndex) => ({ id: stableId(indicator, `indicator-${index}-${indicatorIndex}`), name: str(record(indicator).name) })) : [] }; }) : [],
    references: Array.isArray(raw.references) ? raw.references.map((item, index) => { const x = record(item); return { id: stableId(item, `reference-${index}`), title: str(x.title), link: str(x.link) }; }) : [],
    languageStructures: legacyLanguage, contents: legacyContents, contentSeries: str(raw.contentSeries), visualStrategy: str(raw.visualStrategy), openingHooks: str(raw.openingHooks), retentionResources: str(raw.retentionResources),
  };
}

const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";
const buttonClass = "rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2";
const deleteClass = "rounded-full px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-base font-semibold text-slate-950">{title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p><div className="mt-6 space-y-6">{children}</div></section>;
}
function Label({ children }: { children: ReactNode }) { return <label className="mb-2 block text-sm font-semibold text-slate-600">{children}</label>; }
function ProfilePreview({ data, placeholders }: { data: TikTokData; placeholders: boolean }) {
  const username = data.username ? (data.username.startsWith("@") ? data.username : `@${data.username}`) : placeholders ? "@usuario" : "";
  const name = data.profileName || (placeholders ? "Nome do perfil" : "");
  const bio = data.bio || (placeholders ? "Sua bio aparecerá aqui." : "");
  const metrics = [[data.followingCount || (placeholders ? "0" : ""), "Seguindo"], [data.followersCount || (placeholders ? "0" : ""), "Seguidores"], [data.likesCount || (placeholders ? "0" : ""), "Curtidas"]];
  return <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white"><div className="p-5 sm:p-7"><div className="flex items-start gap-4">{data.profileImageUrl ? <img src={data.profileImageUrl} alt={name ? `Foto de ${name}` : "Foto do perfil do TikTok"} className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-slate-200 sm:h-24 sm:w-24" /> : <div aria-hidden="true" className="h-20 w-20 shrink-0 rounded-full bg-slate-100 ring-1 ring-slate-200 sm:h-24 sm:w-24" />}<div className="min-w-0 flex-1"><p className="break-words text-lg font-bold text-slate-950">{name}</p><p className="mt-0.5 break-words text-sm text-slate-500">{username}</p><div aria-hidden="true" className="mt-4 flex gap-2"><span className="rounded-md bg-slate-950 px-7 py-2 text-sm font-semibold text-white">Seguir</span><span className="rounded-md border border-slate-200 px-3 py-2 text-slate-600">↗</span></div></div></div><div className="mt-5 grid grid-cols-3 gap-2 text-center">{metrics.map(([value, label]) => <div key={label}><p className="font-bold text-slate-950">{value}</p><p className="text-xs text-slate-500">{label}</p></div>)}</div>{bio && <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{bio}</p>}{data.mainLink && <p className="mt-2 max-w-full truncate text-sm font-semibold text-slate-700">↗ {data.mainLink}</p>}</div><div aria-hidden="true" className="grid grid-cols-3 gap-0.5 border-t border-slate-200 bg-slate-200">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[9/14] bg-slate-100"><div className="h-full bg-[linear-gradient(145deg,#f8fafc,#e2e8f0)]" /></div>)}</div></div>;
}

type TikTokFormProps = { data: TikTokData; setData: Dispatch<SetStateAction<TikTokData>>; clientSlug: string; presentationHref: string; planningProjectId: string; isSaving: boolean; isDisabled: boolean; onSave: () => void };

export default function TikTokForm({ data, setData, clientSlug, presentationHref, planningProjectId, isSaving, isDisabled, onSave }: TikTokFormProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const set = <K extends keyof TikTokData>(key: K, value: TikTokData[K]) => setData((current) => ({ ...current, [key]: value }));
  const updateList = (key: "objectives" | "visualElements" | "visualAvoidItems" | "receivesFrom" | "directsTo", id: string, value: string) => set(key, data[key].map((item) => item.id === id ? { ...item, value } : item));
  const addList = (key: "objectives" | "visualElements" | "visualAvoidItems" | "receivesFrom" | "directsTo") => set(key, [...data[key], { id: uid(key), value: "" }]);
  const removeList = (key: "objectives" | "visualElements" | "visualAvoidItems" | "receivesFrom" | "directsTo", id: string) => set(key, data[key].filter((item) => item.id !== id));
  async function upload(file: File, target: "profile" | string) { setUploading(target); setUploadError(""); try { const result = await uploadPlanningMedia({ file, planningProjectId, category: target === "profile" ? "profile" : "references" }); if (target === "profile") set("profileImageUrl", result.url); else set("visualReferences", data.visualReferences.map((item) => item.id === target ? { ...item, image: result.url } : item)); } catch (error) { setUploadError(error instanceof Error ? error.message : "Não foi possível enviar a imagem."); } finally { setUploading(null); } }

  return <div className="mt-6 space-y-6">
    <Section title="Visão estratégica do TikTok" description="Concentre o papel do canal, seus objetivos centrais e a função do TikTok no ecossistema."><div><Label>Papel estratégico do TikTok</Label><RichTextEditor value={data.strategicRole} onChange={(value) => set("strategicRole", value)} placeholder="" /></div><div><Label>Objetivos principais</Label><p className="mb-3 text-xs text-slate-500">Priorize até três objetivos centrais para o canal.</p><div className="space-y-3">{data.objectives.map((item) => <div key={item.id} className="flex gap-2"><input value={item.value} onChange={(e) => updateList("objectives", item.id, e.target.value)} className={inputClass} /><button type="button" onClick={() => removeList("objectives", item.id)} className={deleteClass}>Excluir</button></div>)}</div><button type="button" onClick={() => addList("objectives")} className={`${buttonClass} mt-4`}>+ Adicionar objetivo</button></div></Section>

    <Section title="Perfil do TikTok" description="Configure as principais informações do perfil e visualize como elas serão apresentadas no canal."><ProfilePreview data={data} placeholders /><div><Label>Foto do perfil</Label><div className="flex flex-wrap items-center gap-4">{data.profileImageUrl ? <img src={data.profileImageUrl} alt="Foto atual do perfil" className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200" /> : <div className="h-24 w-24 rounded-full bg-slate-100 ring-1 ring-slate-200" />}<label className={buttonClass}>{uploading === "profile" ? "Enviando..." : "Escolher imagem"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading !== null} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file, "profile"); e.currentTarget.value = ""; }} className="sr-only" /></label>{data.profileImageUrl && <button type="button" onClick={() => set("profileImageUrl", "")} className={deleteClass}>Remover imagem</button>}</div>{uploadError && <p role="alert" className="mt-2 text-sm text-red-600">{uploadError}</p>}</div><div className="grid gap-4 sm:grid-cols-2"><div><Label>Username</Label><input value={data.username} onChange={(e) => set("username", e.target.value)} placeholder="@usuario" className={inputClass} /></div><div><Label>Nome do perfil</Label><input value={data.profileName} onChange={(e) => set("profileName", e.target.value)} className={inputClass} /></div></div><div><Label>Bio do TikTok</Label><textarea rows={4} value={data.bio} onChange={(e) => set("bio", e.target.value)} className={`${inputClass} resize-y`} /></div><div><Label>Métricas da simulação</Label><p className="mb-3 text-xs text-slate-500">Os números são utilizados apenas na simulação visual do perfil e não representam metas estratégicas.</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{[["followingCount", "Seguindo"], ["followersCount", "Seguidores"], ["likesCount", "Curtidas"]].map(([key, label]) => <div key={key}><Label>{label}</Label><input type="number" min="0" value={data[key as "followingCount"]} onChange={(e) => set(key as "followingCount", e.target.value)} className={inputClass} /></div>)}</div></div><div><Label>Link principal</Label><input value={data.mainLink} onChange={(e) => set("mainLink", e.target.value)} className={inputClass} /></div></Section>

    <Section title="Formatos e frequência" description="Defina a cadência de publicação por formato."><div className="space-y-4">{data.frequencyItems.map((item) => <div key={item.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_120px_170px_1fr_auto]">{[["format", "Formato"], ["quantity", "Quantidade"]].map(([key,label]) => <div key={key}><Label>{label}</Label><input type={key === "quantity" ? "number" : "text"} min={key === "quantity" ? "0" : undefined} value={item[key as "format"]} onChange={(e) => set("frequencyItems", data.frequencyItems.map((x) => x.id === item.id ? { ...x, [key]: e.target.value } : x))} className={inputClass} /></div>)}<div><Label>Período</Label><select value={item.period} onChange={(e) => set("frequencyItems", data.frequencyItems.map((x) => x.id === item.id ? { ...x, period: e.target.value } : x))} className={inputClass}><option value="">Selecione</option>{["por dia","por semana","por quinzena","por mês","por ciclo","outro"].map((value) => <option key={value}>{value}</option>)}</select></div><div><Label>Observação</Label><input value={item.observation} onChange={(e) => set("frequencyItems", data.frequencyItems.map((x) => x.id === item.id ? { ...x, observation: e.target.value } : x))} className={inputClass} /></div><button type="button" onClick={() => set("frequencyItems", data.frequencyItems.filter((x) => x.id !== item.id))} className={`${deleteClass} self-end`}>Excluir</button></div>)}</div><button type="button" onClick={() => set("frequencyItems", [...data.frequencyItems, { id: uid("frequency"), format: "", quantity: "", period: "", observation: "" }])} className={buttonClass}>+ Adicionar formato</button></Section>

    <Section title="Estratégia de conteúdo" description="Distribua a estratégia entre frentes claras e complementares."><div><Label>Frentes da estratégia de conteúdo</Label>{data.contentFronts.length > 0 && <p className={`mb-3 text-xs ${data.contentFronts.reduce((sum,item) => sum + (Number(item.percentage) || 0), 0) === 100 ? "text-slate-500" : "text-amber-700"}`}>A soma atual é {data.contentFronts.reduce((sum,item) => sum + (Number(item.percentage) || 0), 0)}%.</p>}<div className="space-y-4">{data.contentFronts.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="grid gap-4 sm:grid-cols-[1fr_130px_auto]"><input value={item.name} onChange={(e) => set("contentFronts", data.contentFronts.map((x) => x.id === item.id ? { ...x, name: e.target.value } : x))} placeholder="Nome da frente" className={inputClass} /><input type="number" min="0" max="100" value={item.percentage} onChange={(e) => set("contentFronts", data.contentFronts.map((x) => x.id === item.id ? { ...x, percentage: e.target.value } : x))} placeholder="Percentual" className={inputClass} /><button type="button" onClick={() => set("contentFronts", data.contentFronts.filter((x) => x.id !== item.id))} className={deleteClass}>Excluir</button></div><textarea rows={2} value={item.description} onChange={(e) => set("contentFronts", data.contentFronts.map((x) => x.id === item.id ? { ...x, description: e.target.value } : x))} placeholder="Descrição" className={`${inputClass} mt-4 resize-y`} /></div>)}</div><button type="button" onClick={() => set("contentFronts", [...data.contentFronts, { id: uid("front"), name: "", percentage: "", description: "" }])} className={`${buttonClass} mt-4`}>+ Adicionar frente</button></div></Section>

    <Section title="Formatos e territórios editoriais" description="Organize os formatos recorrentes e os principais territórios de conteúdo do canal."><div className="grid gap-5 md:grid-cols-2"><div><Label>Formatos principais</Label><RichTextEditor value={data.mainFormats} onChange={(value) => set("mainFormats", value)} placeholder="" /></div><div><Label>Territórios editoriais</Label><RichTextEditor value={data.editorialTerritories} onChange={(value) => set("editorialTerritories", value)} placeholder="" /></div></div></Section>
    <Section title="Estrutura, linguagem e retenção" description="Defina como os vídeos devem começar, desenvolver o raciocínio e manter a atenção."><div className="grid gap-5 md:grid-cols-2"><div><Label>Estrutura dos vídeos</Label><RichTextEditor value={data.videoStructure} onChange={(value) => set("videoStructure", value)} placeholder="" /></div><div><Label>Direção de linguagem e retenção</Label><RichTextEditor value={data.languageAndRetention} onChange={(value) => set("languageAndRetention", value)} placeholder="" /></div></div></Section>

    <Section title="Direção visual do TikTok" description="Registre a diretriz visual, os elementos recorrentes, as restrições e as referências do canal."><div><Label>Diretriz visual central</Label><RichTextEditor value={data.visualGuideline} onChange={(value) => set("visualGuideline", value)} placeholder="" /></div>{[["Elementos visuais", "visualElements", "Adicionar elemento"], ["O que evitar", "visualAvoidItems", "Adicionar orientação"]].map(([label,key,button]) => <div key={key}><Label>{label}</Label><div className="space-y-2">{data[key as "visualElements"].map((item) => <div key={item.id} className="flex gap-2"><input value={item.value} onChange={(e) => updateList(key as "visualElements", item.id, e.target.value)} className={inputClass} /><button type="button" onClick={() => removeList(key as "visualElements", item.id)} className={deleteClass}>Excluir</button></div>)}</div><button type="button" onClick={() => addList(key as "visualElements")} className={`${buttonClass} mt-3`}>+ {button}</button></div>)}<div><Label>Referências visuais</Label><div className="grid gap-4 sm:grid-cols-3">{data.visualReferences.map((item) => <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200">{item.image && <img src={item.image} alt="Referência visual do TikTok" className="aspect-[9/16] w-full object-cover" />}<div className="p-3"><label className={buttonClass}>{uploading === item.id ? "Enviando..." : item.image ? "Trocar" : "Enviar imagem"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading !== null} onChange={(e) => { const file=e.target.files?.[0]; if(file) void upload(file,item.id); e.currentTarget.value=""; }} className="sr-only" /></label>{item.image && <button type="button" onClick={() => set("visualReferences", data.visualReferences.map((x) => x.id === item.id ? { ...x, image: "" } : x))} className={`${deleteClass} mt-2`}>Remover</button>}</div></div>)}</div>{data.visualReferences.length < 3 && <button type="button" onClick={() => set("visualReferences", [...data.visualReferences, { id: uid("visual-reference"), image: "" }])} className={`${buttonClass} mt-4`}>+ Adicionar referência</button>}</div></Section>

    <Section title="Conversão e integração" description="Registre como o TikTok conduz o público e se conecta aos demais canais."><div><Label>Conversão por etapa</Label><div className="grid gap-4 lg:grid-cols-3">{[["Descoberta","discovery"],["Consideração","consideration"],["Decisão","decision"]].map(([label,key]) => <div key={key} className="rounded-2xl border border-slate-200 p-4"><p className="mb-3 font-semibold text-slate-900">{label}</p><div className="space-y-3"><input value={data.conversion[key as "discovery"].action} onChange={(e) => set("conversion", { ...data.conversion, [key]: { ...data.conversion[key as "discovery"], action: e.target.value } })} placeholder="Ação esperada" className={inputClass} /><input value={data.conversion[key as "discovery"].destination} onChange={(e) => set("conversion", { ...data.conversion, [key]: { ...data.conversion[key as "discovery"], destination: e.target.value } })} placeholder="Destino ou continuidade" className={inputClass} /></div></div>)}</div></div><div className="grid gap-5 md:grid-cols-2"><div><Label>Diretriz de CTA</Label><textarea rows={3} value={data.ctaGuideline} onChange={(e) => set("ctaGuideline", e.target.value)} className={`${inputClass} resize-y`} /></div><div><Label>Papel no ecossistema</Label><textarea rows={3} value={data.ecosystemRole} onChange={(e) => set("ecosystemRole", e.target.value)} className={`${inputClass} resize-y`} /></div></div>{[["Recebe audiência ou conteúdo de","receivesFrom","Adicionar origem"],["Direciona audiência para","directsTo","Adicionar destino"]].map(([label,key,button]) => <div key={key}><Label>{label}</Label><div className="space-y-2">{data[key as "receivesFrom"].map((item) => <div key={item.id} className="flex gap-2"><input value={item.value} onChange={(e) => updateList(key as "receivesFrom", item.id, e.target.value)} className={inputClass} /><button type="button" onClick={() => removeList(key as "receivesFrom", item.id)} className={deleteClass}>Excluir</button></div>)}</div><button type="button" onClick={() => addList(key as "receivesFrom")} className={`${buttonClass} mt-3`}>+ {button}</button></div>)}</Section>

    <Section title="Indicadores principais" description="Agrupe apenas os indicadores relevantes para acompanhar a estratégia."><div className="space-y-4">{data.indicatorCategories.map((category) => <div key={category.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex gap-2"><input value={category.name} onChange={(e) => set("indicatorCategories", data.indicatorCategories.map((x) => x.id === category.id ? { ...x, name: e.target.value } : x))} placeholder="Nome da categoria" className={inputClass} /><button type="button" onClick={() => set("indicatorCategories", data.indicatorCategories.filter((x) => x.id !== category.id))} className={deleteClass}>Excluir categoria</button></div><div className="mt-4 space-y-2">{category.indicators.map((indicator) => <div key={indicator.id} className="flex gap-2"><input value={indicator.name} onChange={(e) => set("indicatorCategories", data.indicatorCategories.map((x) => x.id === category.id ? { ...x, indicators: x.indicators.map((i) => i.id === indicator.id ? { ...i, name: e.target.value } : i) } : x))} className={inputClass} /><button type="button" onClick={() => set("indicatorCategories", data.indicatorCategories.map((x) => x.id === category.id ? { ...x, indicators: x.indicators.filter((i) => i.id !== indicator.id) } : x))} className={deleteClass}>Excluir</button></div>)}</div><button type="button" onClick={() => set("indicatorCategories", data.indicatorCategories.map((x) => x.id === category.id ? { ...x, indicators: [...x.indicators, { id: uid("indicator"), name: "" }] } : x))} className={`${buttonClass} mt-3`}>+ Adicionar indicador</button></div>)}</div><button type="button" onClick={() => set("indicatorCategories", [...data.indicatorCategories, { id: uid("indicator-category"), name: "", indicators: [] }])} className={buttonClass}>+ Adicionar categoria</button></Section>

    <Section title="Referências internas" description="Uso interno. Estas referências não aparecem na apresentação ao cliente."><div className="space-y-3">{data.references.map((item) => <div key={item.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[1fr_1fr_auto]"><input value={item.title} onChange={(e) => set("references", data.references.map((x) => x.id === item.id ? { ...x, title: e.target.value } : x))} placeholder="Título" className={inputClass} /><input value={item.link} onChange={(e) => set("references", data.references.map((x) => x.id === item.id ? { ...x, link: e.target.value } : x))} placeholder="Link" className={inputClass} /><button type="button" onClick={() => set("references", data.references.filter((x) => x.id !== item.id))} className={deleteClass}>Excluir</button></div>)}</div><button type="button" onClick={() => set("references", [...data.references, { id: uid("reference"), title: "", link: "" }])} className={buttonClass}>+ Nova referência</button></Section>

    <div className="sticky bottom-0 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur"><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href={`/admin/planejamentos/${clientSlug}`} className={buttonClass}>Voltar para módulos</Link><Link href={presentationHref} className={buttonClass}>Ver apresentação</Link><button type="button" onClick={onSave} disabled={isSaving || isDisabled} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Salvando..." : "Salvar módulo"}</button></div></div>
  </div>;
}
