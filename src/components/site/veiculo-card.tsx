import { Link } from "@tanstack/react-router";
import { Fuel, Gauge, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBRL, formatKm } from "@/lib/format";
import { fotoCapa, precoFinal, tituloVeiculo, type VeiculoComFotos } from "@/lib/catalogo";

export function VeiculoCard({ veiculo }: { veiculo: VeiculoComFotos }) {
  const promo = veiculo.preco_promocional !== null;

  return (
    <Link
      to="/veiculos/$id"
      params={{ id: veiculo.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={fotoCapa(veiculo)}
          alt={tituloVeiculo(veiculo)}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {veiculo.status !== "disponivel" && (
            <Badge variant="secondary">{veiculo.status === "reservado" ? "Reservado" : "Vendido"}</Badge>
          )}
          {promo && <Badge>Oferta</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground">{tituloVeiculo(veiculo)}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {veiculo.ano}
          {veiculo.ano_modelo ? `/${veiculo.ano_modelo}` : ""} · {veiculo.cor ?? "-"}
        </p>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1"><Gauge className="size-3.5" aria-hidden />{formatKm(veiculo.km)}</li>
          <li className="flex items-center gap-1"><Settings2 className="size-3.5" aria-hidden />{veiculo.cambio}</li>
          <li className="flex items-center gap-1"><Fuel className="size-3.5" aria-hidden />{veiculo.combustivel}</li>
        </ul>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            {promo && (
              <span className="block text-xs text-muted-foreground line-through">
                {formatBRL(Number(veiculo.preco))}
              </span>
            )}
            <span className="text-xl font-bold text-primary">{formatBRL(precoFinal(veiculo))}</span>
          </div>
          <span className="text-xs font-medium text-primary group-hover:underline">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
}
