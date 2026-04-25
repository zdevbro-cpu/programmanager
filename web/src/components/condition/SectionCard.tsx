import type { PropsWithChildren, ReactNode } from "react";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  icon?: ReactNode;
  headerRight?: ReactNode;
}

export function SectionCard({ title, icon, headerRight, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="card-header">
        <h3 className="card-title">
          {icon ? <span className="card-icon">{icon}</span> : null}
          <span>{title}</span>
        </h3>
        {headerRight ? <div className="card-header-right">{headerRight}</div> : null}
      </div>
      {children}
    </section>
  );
}
