import type { ReactNode } from "react";

export function PageHero({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-navy py-14 text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{titulo}</h1>
        {descricao && <p className="mt-3 max-w-2xl text-navy-foreground/75">{descricao}</p>}
        {children}
      </div>
    </section>
  );
}

export function PageSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 ${className}`}>{children}</div>;
}

export function EmptyState({ titulo, descricao }: { titulo: string; descricao?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="font-medium text-foreground">{titulo}</p>
      {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
    </div>
  );
}
