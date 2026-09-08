import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageSection } from "@/components/site/page-shell";

const TITULO = "Termos de uso — AUTO SHOP";
const DESC = "Condições de uso do site da AUTO SHOP, anúncios de veículos e envio de propostas.";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <>
      <PageHero titulo="Termos de uso" />
      <PageSection className="max-w-3xl space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Anúncios de veículos</h2>
          <p className="mt-2">
            As informações de preço, quilometragem e itens dos veículos são atualizadas com frequência, mas podem sofrer
            alteração sem aviso prévio. A confirmação final ocorre no atendimento presencial.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Simulações de financiamento</h2>
          <p className="mt-2">
            Toda simulação exibida no site é uma estimativa. Não constitui proposta, promessa ou aprovação de crédito.
            A condição definitiva depende de análise da instituição financeira.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Cadastro e conta</h2>
          <p className="mt-2">
            O usuário é responsável por manter seus dados corretos e por preservar a confidencialidade das credenciais
            de acesso.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Contato</h2>
          <p className="mt-2">Dúvidas sobre estes termos podem ser enviadas pelos canais de atendimento da loja.</p>
        </section>
      </PageSection>
    </>
  );
}
