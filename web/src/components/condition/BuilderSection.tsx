import { Filter } from "lucide-react";
import type {
  AggregationPeriod,
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

export function BuilderSection({ value, onChange }: BuilderSectionProps) {
  const condition = value.condition;

  const update = <K extends keyof RuleDraft["condition"]>(
    key: K,
    nextValue: RuleDraft["condition"][K]
  ) => {
    onChange({ ...value, condition: { ...condition, [key]: nextValue } });
  };

  return (
    <SectionCard title="조건 빌더" icon={<Filter className="mini-icon" />}>
      <div className="grid five">
        <label>
          적용항목
          <select value={condition.metric} onChange={(e) => update("metric", e.target.value as Metric)}>
            <option value="lower_base_count">하위 거점 수</option>
            <option value="lower_expert_count">하위 전문가 수</option>
            <option value="sales_count">판매건수</option>
            <option value="sales_set">판매세트 수</option>
            <option value="sales_amount">판매금액</option>
          </select>
        </label>
        <label>
          집계대상
          <select
            value={condition.aggregationScope}
            onChange={(e) => update("aggregationScope", e.target.value as OrgScope)}
          >
            <option value="self">본인</option>
            <option value="direct_lower">직접하위</option>
            <option value="all_lower">전체하위</option>
            <option value="team">팀전체</option>
          </select>
        </label>
        <label>
          집계주기
          <select
            value={condition.aggregationPeriod}
            onChange={(e) => update("aggregationPeriod", e.target.value as AggregationPeriod)}
          >
            <option value="day">일</option>
            <option value="week">주</option>
            <option value="month">월</option>
            <option value="project">프로젝트 전체</option>
          </select>
        </label>
        <label>
          비교연산자
          <select value={condition.operator} onChange={(e) => update("operator", e.target.value as Operator)}>
            <option value=">=">≥</option>
            <option value="<=">≤</option>
            <option value="=">=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value="between">BETWEEN</option>
          </select>
        </label>
        <label>
          기준값
          <input
            inputMode="numeric"
            value={formatNumber(condition.value1)}
            onChange={(e) => update("value1", parseNumberInput(e.target.value) ?? 0)}
          />
        </label>
      </div>

      <div className="builder-row2">
        <div className="builder-col">
          <span className="field-label">승인조건</span>
          <div className="checks">
            <label className="switch-row">
              <input
                type="checkbox"
                checked={condition.requireApproval}
                onChange={(e) => update("requireApproval", e.target.checked)}
              />
              승인 완료 건만 인정
            </label>
            <label className="switch-row">
              <input
                type="checkbox"
                checked={condition.excludeCanceled}
                onChange={(e) => update("excludeCanceled", e.target.checked)}
              />
              취소/탈락 제외
            </label>
          </div>
        </div>

        <label className="builder-col maintain-field">
          <span className="field-label">유지기간</span>
          <input
            value={condition.maintainPeriod}
            onChange={(e) => update("maintainPeriod", e.target.value)}
            placeholder="없음"
          />
        </label>
      </div>

      {condition.operator === "between" ? (
        <div className="builder-between">
          <label>
            기준값2(BETWEEN 전용)
            <input
              inputMode="numeric"
              value={formatNumber(condition.value2)}
              onChange={(e) => update("value2", parseNumberInput(e.target.value))}
              placeholder="선택"
            />
          </label>
        </div>
      ) : null}
    </SectionCard>
  );
}
