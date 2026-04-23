import type { SavedRuleItem } from "../../services/ruleStorage";

interface SavedRulesPanelProps {
  items: SavedRuleItem[];
  onSelect: (item: SavedRuleItem) => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function SavedRulesPanel({ items, onSelect }: SavedRulesPanelProps) {
  return (
    <aside className="panel">
      <h3 className="panel-title">저장된 조건</h3>
      {items.length === 0 ? (
        <p className="empty-message">저장된 조건이 없습니다.</p>
      ) : (
        <ul className="saved-list">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="saved-item-btn" onClick={() => onSelect(item)}>
                <strong>{item.name || "이름 없는 조건"}</strong>
                <span>{item.projectId || "-"}</span>
                <span>{formatTime(item.savedAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
