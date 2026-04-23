import { ShieldCheck } from "lucide-react";

interface ValidationPanelProps {
  errors: string[];
}

export function ValidationPanel({ errors }: ValidationPanelProps) {
  const hasErrors = errors.length > 0;

  return (
    <aside className="panel">
      <h3 className="panel-title">
        <ShieldCheck className="mini-icon green" />
        검증 결과
      </h3>
      {hasErrors ? (
        <ul className="error-list">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : (
        <div className="ok-list">
          <div className="ok-item">필수값 입력 완료</div>
          <div className="ok-item">조건 충돌 없음</div>
          <div className="ok-item">지급 규칙 정상</div>
        </div>
      )}
    </aside>
  );
}
