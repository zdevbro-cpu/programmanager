import { Trash2 } from "lucide-react";
import type { SavedRuleItem } from "../../services/ruleStorage";

interface SavedRulesPanelProps {
  items: SavedRuleItem[];
  onSelect: (item: SavedRuleItem) => void;
  onDelete: (id: string) => void;
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

export function SavedRulesPanel({ items, onSelect, onDelete }: SavedRulesPanelProps) {
  return (
    <aside className="panel">
      <h3 className="panel-title">저장된 조건</h3>
      {items.length === 0 ? (
        <p className="empty-message">저장된 조건이 없습니다.</p>
      ) : (
        <ul className="saved-list">
          {items.map((item) => (
            <li key={item.id || item.name} className={`saved-list-item ${item.isDraft ? "is-draft" : ""}`}>
              <div className="saved-item-content" onClick={() => onSelect(item)}>
                <div className="saved-item-main">
                  <span className="rule-name">
                    {item.isDraft && <span className="draft-tag">임시</span>}
                    {item.name || "이름 없는 조건"}
                  </span>
                  <span className="save-date">{new Date(item.savedAt).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
              <button 
                type="button" 
                className="item-delete-btn" 
                title="삭제"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
