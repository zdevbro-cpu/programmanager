import { Eye, Filter, Gift, ShieldCheck, Users } from "lucide-react";
import type { RuleDraft } from "../../types/rule";

interface PreviewPanelProps {
  value: RuleDraft;
}

const METRIC_LABEL: Record<RuleDraft["condition"]["metric"], string> = {
  lower_base_count: "하위 거점 수",
  lower_expert_count: "하위 전문가 수",
  sales_count: "판매건수",
  sales_set: "판매세트 수",
  sales_amount: "판매금액"
};

const SCOPE_LABEL: Record<RuleDraft["condition"]["aggregationScope"], string> = {
  self: "본인",
  direct_lower: "직접하위",
  all_lower: "전체하위",
  team: "팀전체"
};

const CYCLE_LABEL: Record<RuleDraft["result"]["payCycle"], string> = {
  once: "1회",
  month: "월",
  quarter: "분기"
};

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function formatCriteria(operator: RuleDraft["condition"]["operator"], value1: number, value2: number | null) {
  if (operator === "between") return `${value1} ~ ${value2 ?? "-"}`;
  if (operator === ">=") return `${value1} 이상`;
  if (operator === "<=") return `${value1} 이하`;
  if (operator === ">") return `${value1} 초과`;
  if (operator === "<") return `${value1} 미만`;
  return `${value1}`;
}

export function PreviewPanel({ value }: PreviewPanelProps) {
  const rewardText =
    value.result.rewardType === "fixed"
      ? `${formatWon(value.result.fixedAmount)}`
      : value.result.rewardType === "rate"
        ? `${value.result.ratePercent}%`
        : `${formatWon(value.result.fixedAmount)} + ${value.result.ratePercent}%`;

  const rolesText = value.target.targetRoles.length > 0 ? value.target.targetRoles.join(", ") : "미선택";
  const criteriaText = formatCriteria(value.condition.operator, value.condition.value1, value.condition.value2);

  return (
    <aside className="panel">
      <h3 className="panel-title">
        <Eye className="mini-icon blue" />
        조건 미리보기
      </h3>
      <p className="preview-text">
        선택된 역할({rolesText})에 대해 {SCOPE_LABEL[value.condition.aggregationScope]}{" "}
        {METRIC_LABEL[value.condition.metric]}를 {criteriaText} 충족하면 {rewardText}을(를){" "}
        {CYCLE_LABEL[value.result.payCycle]} 기준 {value.result.payCount}회 지급합니다.
      </p>
      <div className="meta-rows">
        <div className="meta-row">
          <Users className="mini-icon" />
          <span className="meta-label">적용대상</span>
          <strong>{rolesText}</strong>
        </div>
        <div className="meta-row">
          <Filter className="mini-icon" />
          <span className="meta-label">측정항목</span>
          <strong>{METRIC_LABEL[value.condition.metric]}</strong>
        </div>
        <div className="meta-row">
          <ShieldCheck className="mini-icon" />
          <span className="meta-label">판정기준</span>
          <strong>{criteriaText}</strong>
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
