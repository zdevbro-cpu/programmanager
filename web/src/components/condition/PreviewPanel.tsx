import { Eye, Filter, Gift, ShieldCheck, Users } from "lucide-react";
import type { RuleDraft } from "../../types/rule";

interface PreviewPanelProps {
  value: RuleDraft;
}

const METRIC_LABEL: Record<string, string> = {
  lower_base_count: "하위 거점 수",
  lower_expert_count: "하위 전문가 수",
  sales_count: "판매건수",
  sales_set: "판매세트 수",
  sales_amount: "판매금액"
};

const SCOPE_LABEL: Record<string, string> = {
  self: "본인",
  direct_lower: "직접하위",
  all_lower: "전체하위",
  team: "팀전체"
};

const CYCLE_LABEL: Record<string, string> = {
  once: "1회",
  month: "월",
  quarter: "분기"
};

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function formatCriteria(operator: string, value1: number, value2: number | null) {
  if (operator === "between") return `${value1} ~ ${value2 ?? "-"}`;
  if (operator === ">=") return `${value1} 이상`;
  if (operator === "<=") return `${value1} 이하`;
  if (operator === ">") return `${value1} 초과`;
  if (operator === "<") return `${value1} 미만`;
  return `${value1}`;
}

export function PreviewPanel({ value }: PreviewPanelProps) {
  const { condition, result, target } = value;
  
  const rewardText =
    result.rewardType === "fixed"
      ? `${formatWon(result.fixedAmount)}`
      : result.rewardType === "rate"
        ? `${result.ratePercent}%`
        : `${formatWon(result.fixedAmount)} + ${result.ratePercent}%`;

  const rolesText = target.targetRoles.length > 0 ? target.targetRoles.join(", ") : "미선택";
  
  const conditionTexts = condition.items.map(item => {
    const criteria = formatCriteria(item.operator, item.value1, item.value2);
    return `[${SCOPE_LABEL[item.aggregationScope]}] ${METRIC_LABEL[item.metric]} ${criteria}`;
  });

  const fullConditionText = conditionTexts.join(` ${condition.logic} `);

  return (
    <aside className="panel">
      <h3 className="panel-title">
        <Eye className="mini-icon blue" />
        조건 미리보기
      </h3>
      <div className="preview-content">
        <p className="preview-summary">
          <strong>{rolesText}</strong>에게 아래 조건을 충족 시 <strong>{rewardText}</strong>을(를) {CYCLE_LABEL[result.payCycle]} 기준 {result.payCount}회 지급합니다.
        </p>
        <div className="preview-logic-box">
          {conditionTexts.map((text, idx) => (
            <div key={idx} className="preview-cond-item">
              {idx > 0 && <span className="preview-logic-badge">{condition.logic}</span>}
              <span className="preview-cond-text">{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="meta-rows">
        <div className="meta-row">
          <Users className="mini-icon" />
          <span className="meta-label">적용대상</span>
          <strong>{rolesText}</strong>
        </div>
        <div className="meta-row">
          <Filter className="mini-icon" />
          <span className="meta-label">조건수</span>
          <strong>{condition.items.length}건 ({condition.logic})</strong>
        </div>
        <div className="meta-row">
          <Gift className="mini-icon" />
          <span className="meta-label">보상</span>
          <strong>{rewardText}</strong>
        </div>
      </div>
    </aside>
  );
}
