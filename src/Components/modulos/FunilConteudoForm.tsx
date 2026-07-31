"use client";

import Link from "next/link";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import RichTextEditor from "@/Components/RichTextEditor";

export type ContentFunnelStageData = {
  strategy: string;
  objective: string;
  nextStep: string;
  themes: string;
  recommendedFormat: string;
  ctas: string;
};

export type ContentFunnelReference = {
  title: string;
  link: string;
};

export type ContentFunnelData = {
  stages: ContentFunnelStageData[];
  overview: string;
  distribution: {
    attraction: string;
    connection: string;
    bonding: string;
    sales: string;
    repurchase: string;
  };
  metrics: {
    attraction: string;
    connection: string;
    bonding: string;
    sales: string;
    repurchase: string;
  };
  references: ContentFunnelReference[];
};

export const funnelStages = [
  {
    acronym: "TOFU",
    title: "Conteúdos de atração",
    subtitle: "Usuário vira seguidor",
    description:
      "Defina conteúdos criados para atrair novas pessoas, gerar alcance, despertar interesse inicial e fazer o público conhecer o especialista, a empresa ou o projeto.",
    placeholder:
      "Ex: Conteúdos educativos simples, bastidores leves, tendências, temas populares, dúvidas comuns, erros frequentes, mitos, listas, curiosidades e conteúdos de descoberta.",
  },
  {
    acronym: "MOFU",
    title: "Conteúdos de conexão",
    subtitle: "Seguidor vira fã",
    description:
      "Defina conteúdos que aproximam o público da marca, geram identificação, aumentam confiança e criam vínculo emocional com o especialista ou empresa.",
    placeholder:
      "Ex: História, bastidores, posicionamentos, crenças, valores, vulnerabilidades, rotina, causas, opiniões, experiências pessoais e visão de mundo.",
  },
  {
    acronym: "FOFU",
    title: "Conteúdos de vinculação",
    subtitle: "Fã vira lead",
    description:
      "Defina conteúdos que fazem o público avançar na relação, demonstrar interesse, entrar em uma lista, baixar um material, responder, clicar ou pedir mais informações.",
    placeholder:
      "Ex: Conteúdos com convite para material gratuito, diagnóstico, checklist, aula, formulário, grupo, newsletter, WhatsApp, evento, comunidade ou conversa inicial.",
  },
  {
    acronym: "COFU",
    title: "Conteúdos de conversão",
    subtitle: "Lead vira cliente",
    description:
      "Defina conteúdos que conduzem o lead para a decisão de compra, quebram objeções, apresentam provas, reforçam valor e direcionam para uma oferta.",
    placeholder:
      "Ex: Depoimentos, estudos de caso, antes e depois, provas sociais, comparação, demonstração, bastidores da entrega, oferta, bônus, garantia, urgência e chamada para ação.",
  },
  {
    acronym: "REFU",
    title: "Conteúdos de recompra",
    subtitle: "Cliente volta a comprar",
    description:
      "Defina conteúdos que mantêm o relacionamento após a compra, reforçam a experiência, estimulam novas necessidades e conduzem o cliente para uma nova compra.",
    placeholder:
      "Ex: Novidades, atualizações, conteúdos de uso, resultados de clientes, ofertas complementares, lançamentos, benefícios exclusivos, renovação e chamada para recompra.",
  },
];

export const contentTypes = [
  "Reels",
  "Carrossel",
  "Stories",
  "Live",
  "Post estático",
  "Vídeo longo",
  "Blog",
  "E-mail",
  "WhatsApp",
  "Podcast",
  "Material educativo",
  "Anúncio",
];

function createEmptyStage(): ContentFunnelStageData {
  return {
    strategy: "",
    objective: "",
    nextStep: "",
    themes: "",
    recommendedFormat: contentTypes[0],
    ctas: "",
  };
}

export const initialContentFunnelData: ContentFunnelData = {
  stages: funnelStages.map(() => createEmptyStage()),
  overview: "",
  distribution: {
    attraction: "",
    connection: "",
    bonding: "",
    sales: "",
    repurchase: "",
  },
  metrics: {
    attraction: "",
    connection: "",
    bonding: "",
    sales: "",
    repurchase: "",
  },
  references: [
    {
      title: "",
      link: "",
    },
  ],
};

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>

      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      ) : null}

      <div className="mt-6">{children}</div>
    </section>
  );
}

function TextAreaInput({
  label,
  value,
  placeholder,
  rows: _rows,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-600">
        {label}
      </label>
      <RichTextEditor value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

type FunilConteudoFormProps = {
  data: ContentFunnelData;
  setData: Dispatch<SetStateAction<ContentFunnelData>>;
  clientSlug: string;
  presentationHref: string;
  isSaving: boolean;
  isDisabled: boolean;
  onSave: () => void;
};

export default function FunilConteudoForm({
  data,
  setData,
  clientSlug,
  presentationHref,
  isSaving,
  isDisabled,
  onSave,
}: FunilConteudoFormProps) {
  function updateStage(
    stageIndex: number,
    key: keyof ContentFunnelStageData,
    value: string
  ) {
    setData((current) => {
      const nextStages = [...current.stages];

      nextStages[stageIndex] = {
        ...(nextStages[stageIndex] || createEmptyStage()),
        [key]: value,
      };

      return {
        ...current,
        stages: nextStages,
      };
    });
  }

  function updateDistribution(
    key: keyof ContentFunnelData["distribution"],
    value: string
  ) {
    setData((current) => ({
      ...current,
      distribution: {
        ...current.distribution,
        [key]: value,
      },
    }));
  }

  function updateMetric(key: keyof ContentFunnelData["metrics"], value: string) {
    setData((current) => ({
      ...current,
      metrics: {
        ...current.metrics,
        [key]: value,
      },
    }));
  }

  function updateReference(
    index: number,
    key: keyof ContentFunnelReference,
    value: string
  ) {
    setData((current) => {
      const nextReferences = [...current.references];

      nextReferences[index] = {
        ...nextReferences[index],
        [key]: value,
      };

      return {
        ...current,
        references: nextReferences,
      };
    });
  }

  function addReference() {
    setData((current) => ({
      ...current,
      references: [
        ...current.references,
        {
          title: "",
          link: "",
        },
      ],
    }));
  }

  function removeReference(index: number) {
    setData((current) => ({
      ...current,
      references:
        current.references.length > 1
          ? current.references.filter((_, itemIndex) => itemIndex !== index)
          : [
              {
                title: "",
                link: "",
              },
            ],
    }));
  }

  return (
    <div className="mt-6 space-y-6">
      {funnelStages.map((stage, index) => {
        const stageData = data.stages[index] || createEmptyStage();

        return (
          <SectionCard key={stage.title} title={`Etapa ${index + 1}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {stage.acronym}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {stage.title}
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {stage.subtitle}
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                {stage.description}
              </p>
            </div>

            <div className="mt-5">
              <TextAreaInput
                label="Estratégia de conteúdo para esta etapa"
                value={stageData.strategy}
                placeholder={stage.placeholder}
                rows={7}
                onChange={(value) => updateStage(index, "strategy", value)}
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <TextAreaInput
                label="Objetivo da etapa"
                value={stageData.objective}
                placeholder="Explique qual resultado essa etapa precisa gerar no comportamento do público."
                rows={4}
                onChange={(value) => updateStage(index, "objective", value)}
              />

              <TextAreaInput
                label="Próximo passo desejado"
                value={stageData.nextStep}
                placeholder="Explique para onde o público deve ser conduzido após consumir esses conteúdos."
                rows={4}
                onChange={(value) => updateStage(index, "nextStep", value)}
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_240px]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Exemplos de temas
                </label>

                <input
                  type="text"
                  value={stageData.themes}
                  onChange={(event) =>
                    updateStage(index, "themes", event.target.value)
                  }
                  placeholder="Ex: tema 1, tema 2, tema 3, tema 4..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Formato recomendado
                </label>

                <select
                  value={stageData.recommendedFormat}
                  onChange={(event) =>
                    updateStage(index, "recommendedFormat", event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <TextAreaInput
                label="Chamadas para ação"
                value={stageData.ctas}
                placeholder="Liste CTAs adequados para esta etapa do funil."
                rows={4}
                onChange={(value) => updateStage(index, "ctas", value)}
              />
            </div>
          </SectionCard>
        );
      })}

      <SectionCard
        title="Visão geral do funil"
        description="Explique como as cinco etapas se conectam e como o conteúdo deve conduzir o público de uma fase para a próxima."
      >
        <RichTextEditor
          value={data.overview}
          onChange={(value) =>
            setData((current) => ({ ...current, overview: value }))
          }
          placeholder="Ex: Primeiro os conteúdos de atração ampliam o alcance. Depois os conteúdos de conexão geram identificação. Em seguida, os conteúdos de vinculação levam o público para uma lista, conversa ou material. Os conteúdos de conversão apresentam prova, oferta e chamada para decisão. Por fim, os conteúdos de recompra mantêm o relacionamento e estimulam uma nova compra."
        />
      </SectionCard>

      <SectionCard
        title="Distribuição entre as etapas"
        description="Defina a proporção recomendada de conteúdos para cada etapa do funil."
      >
        <div className="grid gap-4 md:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Atração
            </label>

            <input
              type="text"
              value={data.distribution.attraction}
              onChange={(event) =>
                updateDistribution("attraction", event.target.value)
              }
              placeholder="Ex: 40%"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Conexão
            </label>

            <input
              type="text"
              value={data.distribution.connection}
              onChange={(event) =>
                updateDistribution("connection", event.target.value)
              }
              placeholder="Ex: 30%"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Vinculação
            </label>

            <input
              type="text"
              value={data.distribution.bonding}
              onChange={(event) =>
                updateDistribution("bonding", event.target.value)
              }
              placeholder="Ex: 20%"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Conversão
            </label>

            <input
              type="text"
              value={data.distribution.sales}
              onChange={(event) =>
                updateDistribution("sales", event.target.value)
              }
              placeholder="Ex: 10%"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Recompra
            </label>

            <input
              type="text"
              value={data.distribution.repurchase}
              onChange={(event) =>
                updateDistribution("repurchase", event.target.value)
              }
              placeholder="Ex: 10%"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Métricas do funil de conteúdo"
        description="Liste quais indicadores ajudam a medir se cada etapa do funil está funcionando."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaInput
            label="Atração"
            value={data.metrics.attraction}
            placeholder="Atração: alcance, impressões, visualizações, visitas ao perfil, novos seguidores..."
            onChange={(value) => updateMetric("attraction", value)}
          />

          <TextAreaInput
            label="Conexão"
            value={data.metrics.connection}
            placeholder="Conexão: comentários, respostas, compartilhamentos, salvamentos, retenção, mensagens..."
            onChange={(value) => updateMetric("connection", value)}
          />

          <TextAreaInput
            label="Vinculação"
            value={data.metrics.bonding}
            placeholder="Vinculação: cliques, cadastros, downloads, respostas, entrada no WhatsApp, leads gerados..."
            onChange={(value) => updateMetric("bonding", value)}
          />

          <TextAreaInput
            label="Conversão"
            value={data.metrics.sales}
            placeholder="Conversão: reuniões, propostas, conversões, vendas, custo por compra, taxa de fechamento, receita..."
            onChange={(value) => updateMetric("sales", value)}
          />

          <TextAreaInput
            label="Recompra"
            value={data.metrics.repurchase}
            placeholder="Recompra: novas compras, renovações, recorrência, retenção, frequência de compra, receita por cliente..."
            onChange={(value) => updateMetric("repurchase", value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Anexos e referências externas"
        description="Referências externas são opcionais, mas ajudam quem está visualizando o planejamento a entender melhor o funil de conteúdo."
      >
        <div className="space-y-4">
          {data.references.map((reference, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Título da referência
                </label>

                <input
                  type="text"
                  value={reference.title}
                  onChange={(event) =>
                    updateReference(index, "title", event.target.value)
                  }
                  placeholder="Ex: Funil, exemplo de conteúdo, post, campanha, aula, referência ou documento"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Link
                </label>

                <input
                  type="url"
                  value={reference.link}
                  onChange={(event) =>
                    updateReference(index, "link", event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="cursor-pointer rounded-full px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addReference}
          className="mt-5 cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-950 hover:border-slate-950 hover:text-white"
        >
          + Nova referência
        </button>
      </SectionCard>

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
