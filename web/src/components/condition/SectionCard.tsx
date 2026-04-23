import type { PropsWithChildren, ReactNode } from "react";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  icon?: ReactNode;
}

export function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <h3 className="card-title">
        {icon ? <span className="card-icon">{icon}</span> : null}
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}
