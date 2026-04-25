import { Filter, Plus, Trash2, X } from "lucide-react";
import type {
  AggregationPeriod,
  ConditionItem,
  Metric,
  Operator,
  OrgScope,
  RuleDraft
} from "../../types/rule";
import { formatNumber, parseNumberInput } from "../../utils/number";
import { SectionCard } from "./SectionCard";

interface BuilderSectionProps {
  value: RuleDraft;
  onChange: (next: RuleDraft) => void;
}

const METRIC_OPTIONS = [
  { value: "sales_count", label: "시리즈 판매건수" },
  { value: "lower_expert_count", label: "경력자 모집건수" },
  { value: "sales_set", label: "준경력자 모집건수" },
  { value: "직접 입력", label: "직접입력" }
];

export function BuilderSection({ value, onChange }: BuilderSectionProps) {
  const condition = value.condition;

  const updateRoot = <K extends keyof RuleDraft["condition"]>(
    key: K,
    nextValue: RuleDraft["condition"][K]
  ) => {
    onChange({ ...value, condition: { ...condition, [key]: nextValue } });
  };

  const updateItem = (index: number, nextItem: ConditionItem) => {
    const nextItems = [...condition.items];
    nextItems[index] = nextItem;
    updateRoot("items", nextItems);
  };

  const addItem = () => {
    const newItem: ConditionItem = {
      id: crypto.randomUUID(),
      metric: "sales_count" as Metric,
      aggregationScope: "self",
      aggregationPeriod: "week",
      operator: ">=",
      value1: 1,
      value2: null
    };
    updateRoot("items", [...condition.items, newItem]);
  };

  const removeItem = (index: number) => {
    if (condition.items.length <= 1) return;
    updateRoot(
      "items",
      condition.items.filter((_, idx) => idx !== index)
    );
  };

  const headerRight = (
    <div className="builder-header-options">
      <span className="label">승인조건</span>
      <span className="separator">|</span>
      <div className="checks">
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={condition.requireApproval}
            onChange={(e) => updateRoot("requireApproval", e.target.checked)}
          />
          승인 완료 건만 인정
        </label>
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={condition.excludeCanceled}
            onChange={(e) => updateRoot("excludeCanceled", e.target.checked)}
          />
          취소 제외
        </label>
      </div>
    </div>
  );

  return (
    <SectionCard title="조건 빌더" icon={<Filter className="mini-icon" />} headerRight={headerRight}>
      <div className="builder-container">
        {condition.items.map((item, idx) => {
          const isManualMetric = !METRIC_OPTIONS.some(opt => opt.value === item.metric) || item.metric === "직접 입력";
          
          return (
            <div key={item.id} className="condition-row-wrapper">
              {idx > 0 && (
                <div className="logic-selector">
                  <select 
                    className="logic-select"
                    value={condition.logic} 
                    onChange={(e) => updateRoot("logic", e.target.value as "AND" | "OR")}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                  <div className="logic-line"></div>
                </div>
              )}
              
              <div className="condition-grid-row">
                <label className="field-group">
                  <span className="field-label">적용항목</span>
                  {isManualMetric ? (
                    <div className="manual-input-group">
                      <input
                        type="text"
                        value={item.metric === "직접 입력" ? "" : item.metric}
                        onChange={(e) => updateItem(idx, { ...item, metric: e.target.value as Metric })}
                        placeholder="항목명 입력"
                        autoFocus
                      />
                      <button 
                        type="button" 
                        className="back-to-select"
                        onClick={() => updateItem(idx, { ...item, metric: "sales_count" as Metric })}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={item.metric} 
                      onChange={(e) => updateItem(idx, { ...item, metric: e.target.value as Metric })}
                    >
                      {METRIC_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </label>

                <label className="field-group">
                  <span className="field-label">집계대상</span>
                  <select
                    value={item.aggregationScope}
                    onChange={(e) => updateItem(idx, { ...item, aggregationScope: e.target.value as OrgScope })}
                  >
                    <option value="self">본인</option>
                    <option value="direct_lower">직접하위</option>
                    <option value="all_lower">전체하위</option>
                    <option value="team">팀전체</option>
                  </select>
                </label>

                <label className="field-group">
                  <span className="field-label">집계주기</span>
                  <select
                    value={item.aggregationPeriod}
                    onChange={(e) => updateItem(idx, { ...item, aggregationPeriod: e.target.value as AggregationPeriod })}
                  >
                    <option value="day">일</option>
                    <option value="week">주</option>
                    <option value="month">월</option>
                    <option value="project">프로젝트 전체</option>
                  </select>
                </label>

                <label className="field-group">
                  <span className="field-label">비교연산자</span>
                  <select 
                    value={item.operator} 
                    onChange={(e) => updateItem(idx, { ...item, operator: e.target.value as Operator })}
                  >
                    <option value=">=">≥</option>
                    <option value="<=">≤</option>
                    <option value="=">=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="between">BETWEEN</option>
                  </select>
                </label>

                <label className="field-group">
                  <span className="field-label">기준값</span>
                  <div className="value-input-group">
                    <input
                      inputMode="numeric"
                      value={formatNumber(item.value1)}
                      onChange={(e) => updateItem(idx, { ...item, value1: parseNumberInput(e.target.value) ?? 0 })}
                    />
                    {item.operator === "between" && (
                      <>
                        <span className="tilde">~</span>
                        <input
                          inputMode="numeric"
                          value={formatNumber(item.value2)}
                          onChange={(e) => updateItem(idx, { ...item, value2: parseNumberInput(e.target.value) })}
                          placeholder="최대"
                        />
                      </>
                    )}
                  </div>
                </label>

                <div className="row-delete-cell">
                  <button 
                    type="button" 
                    className="icon-btn delete-btn" 
                    onClick={() => removeItem(idx)}
                    disabled={condition.items.length <= 1} // 1개일 때는 비활성화하거나 초기화 로직 필요
                    style={{ opacity: condition.items.length <= 1 ? 0.4 : 1, cursor: condition.items.length <= 1 ? "not-allowed" : "pointer" }}
                  >
                    <Trash2 className="row-icon" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="builder-actions">
          <button type="button" className="add-condition-btn" onClick={addItem}>
            <Plus className="row-icon" />
            조건 추가
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
