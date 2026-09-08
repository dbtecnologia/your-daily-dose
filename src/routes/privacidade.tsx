import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageSection } from "@/components/site/page-shell";

const TITULO = "Política de privacidade — AUTO SHOP";
const DESC = "Como a AUTO SHOP coleta, usa e protege os dados enviados nos formulários do site.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <>
      <PageHero titulo="Política de privacidade" />
      <PageSection className="max-w-3xl space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Dados que coletamos</h2>
          <p className="mt-2">
            Nome, telefone, e-mail e as informações que você envia em formulários de interesse, avaliação de veículo,
            contato e financiamento.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Como usamos</h2>
          <p className="mt-2">
            Utilizamos os dados exclusivamente para responder ao seu contato, apresentar veículos e conduzir a
            negociação. Não vendemos seus dados a terceiros.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Seus direitos</h2>
          <p className="mt-2">
            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelos canais de
            atendimento.
          </p>
        </section>
      </PageSection>
    </>
  );
}
