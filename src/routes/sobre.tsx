import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, HandCoins, ShieldCheck, Wrench } from "lucide-react";
import { PageHero, PageSection } from "@/components/site/page-shell";
import { useConfiguracoes } from "@/hooks/use-configuracoes";

const TITULO = "Sobre a AUTO SHOP — Concessionária de seminovos";
const DESC = "Conheça a AUTO SHOP: seminovos vistoriados, procedência garantida e atendimento próximo do começo ao fim.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: SobrePage,
});

const PILARES = [
  { icon: ShieldCheck, titulo: "Procedência garantida", texto: "Histórico consultado e documentação conferida antes da venda." },
  { icon: Wrench, titulo: "Vistoria completa", texto: "Cada veículo passa por checagem mecânica e estrutural." },
  { icon: HandCoins, titulo: "Financiamento facilitado", texto: "Trabalhamos com os principais bancos para achar a melhor condição." },
  { icon: BadgeCheck, titulo: "Troca com avaliação justa", texto: "Avaliamos seu usado com transparência e preço de mercado." },
];

function SobrePage() {
  const { config } = useConfiguracoes();

  return (
    <>
      <PageHero titulo="Sobre a AUTO SHOP" descricao="Seminovos selecionados com curadoria rigorosa." />
      <PageSection>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{config.sobre_texto}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p) => (
            <div key={p.titulo} className="rounded-xl border border-border bg-card p-6">
              <p.icon className="size-6 text-primary" aria-hidden />
              <h2 className="mt-4 font-semibold text-foreground">{p.titulo}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-secondary p-6">
          <h2 className="font-semibold text-foreground">Onde estamos</h2>
          <p className="mt-2 text-sm text-muted-foreground">{config.endereco}</p>
          <p className="text-sm text-muted-foreground">{config.horario}</p>
        </div>
      </PageSection>
    </>
  );
}
