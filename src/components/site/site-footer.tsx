import { Link } from "@tanstack/react-router";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useConfiguracoes } from "@/hooks/use-configuracoes";

export function SiteFooter() {
  const { config } = useConfiguracoes();
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-lg font-bold">{config.nome}</h2>
          <p className="mt-3 text-sm text-navy-foreground/70">
            Seminovos selecionados, vistoriados e com procedência garantida.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">Navegação</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/veiculos" className="hover:underline">Veículos</Link></li>
            <li><Link to="/financiamento" className="hover:underline">Financiamento</Link></li>
            <li><Link to="/avalie-seu-carro" className="hover:underline">Avalie seu carro</Link></li>
            <li><Link to="/sobre" className="hover:underline">Sobre nós</Link></li>
            <li><Link to="/contato" className="hover:underline">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">Contato</h3>
          <ul className="mt-3 space-y-2 text-sm text-navy-foreground/85">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 size-4 shrink-0" aria-hidden />{config.telefone}</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 size-4 shrink-0" aria-hidden />{config.email}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />{config.endereco}</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 size-4 shrink-0" aria-hidden />{config.horario}</li>
            {config.instagram && (
              <li className="flex items-start gap-2">
                <Instagram className="mt-0.5 size-4 shrink-0" aria-hidden />
                <a href={config.instagram} target="_blank" rel="noreferrer" className="hover:underline">
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/termos" className="hover:underline">Termos de uso</Link></li>
            <li><Link to="/privacidade" className="hover:underline">Política de privacidade</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-soft py-5 text-center text-xs text-navy-foreground/60">
        © {ano} {config.nome}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
