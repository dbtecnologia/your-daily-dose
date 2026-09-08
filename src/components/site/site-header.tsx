import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Car, Heart, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/hooks/use-auth";
import { useConfiguracoes } from "@/hooks/use-configuracoes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/veiculos", label: "Veículos" },
  { to: "/financiamento", label: "Financiamento" },
  { to: "/avalie-seu-carro", label: "Avalie seu carro" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const { user } = useSession();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const { config } = useConfiguracoes();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-navy text-navy-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Car className="size-5 text-primary-foreground" aria-hidden />
          </span>
          <span className="text-lg">{config.nome}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/80 transition-colors hover:bg-navy-soft hover:text-navy-foreground"
              activeProps={{ className: "bg-navy-soft text-navy-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="secondary" size="sm">
                  <Link to="/admin">
                    <ShieldCheck className="size-4" aria-hidden /> Admin
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm" className="text-navy-foreground hover:bg-navy-soft">
                <Link to="/minha-conta">
                  <Heart className="size-4" aria-hidden /> Minha conta
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-navy-foreground hover:bg-navy-soft" onClick={sair}>
                <LogOut className="size-4" aria-hidden />
                <span className="sr-only">Sair</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-navy-foreground hover:bg-navy-soft">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-navy-foreground lg:hidden"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div className={cn("border-t border-navy-soft lg:hidden", aberto ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Navegação móvel">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setAberto(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/85 hover:bg-navy-soft"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Button asChild variant="secondary" size="sm" onClick={() => setAberto(false)}>
                    <Link to="/admin">Painel administrativo</Link>
                  </Button>
                )}
                <Button asChild variant="secondary" size="sm" onClick={() => setAberto(false)}>
                  <Link to="/minha-conta">
                    <User className="size-4" aria-hidden /> Minha conta
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAberto(false);
                    void sair();
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="secondary" size="sm" onClick={() => setAberto(false)}>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm" onClick={() => setAberto(false)}>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
