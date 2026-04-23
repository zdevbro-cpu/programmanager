import { Gift } from "lucide-react";
import type { Metric, PayCycle, ResultType, RewardType, RuleDraft } from "../../types/rule";
import { formatNumber, parseNumberInput } from "../../utils/number";
import { SectionCard } from "./SectionCard";

interface ResultSectionProps {
  value: RuleDraft;
  onChange: (next: RuleDraft) => void;
}

export function ResultSection({ value, onChange }: ResultSectionProps) {
  const result = value.result;

  const update = <K extends keyof RuleDraft["result"]>(key: K, nextValue: RuleDraft["result"][K]) => {
    onChange({ ...value, result: { ...result, [key]: nextValue } });
  };

  const isFixed = result.rewardType === "fixed" || result.rewardType === "mixed";
  const isRate = result.rewardType === "rate" || result.rewardType === "mixed";

  return (
    <SectionCard title="결과 설정" icon={<Gift className="mini-icon" />}>
      <div className="grid four">
        <label>
          결과유형
          <select
            value={result.resultType}
            onChange={(e) => update("resultType", e.target.value as ResultType)}
          >
            <option value="reward_scheduled">보상예정 생성</option>
            <option value="qualification_grant">자격부여</option>
            <option value="qualification_keep">자격유지</option>
            <option value="payment_restrict">지급제한</option>
          </select>
        </label>
        <label>
          보상유형
          <select
            value={result.rewardType}
            onChange={(e) => update("rewardType", e.target.value as RewardType)}
          >
            <option value="fixed">정액</option>
            <option value="rate">비율</option>
            <option value="mixed">혼합</option>
          </select>
        </label>
        <label>
          지급주기
          <select value={result.payCycle} onChange={(e) => update("payCycle", e.target.value as PayCycle)}>
            <option value="once">1회</option>
            <option value="month">월</option>
            <option value="quarter">분기</option>
          </select>
        </label>
        <label>
          지급횟수
          <input
            inputMode="numeric"
            min={1}
            value={formatNumber(result.payCount)}
            onChange={(e) => update("payCount", parseNumberInput(e.target.value) ?? 0)}
          />
        </label>
      </div>

      <div className="grid four">
        <label>
          정액금액(원)
          <input
            inputMode="numeric"
            disabled={!isFixed}
            value={formatNumber(result.fixedAmount)}
            onChange={(e) => update("fixedAmount", parseNumberInput(e.target.value) ?? 0)}
          />
        </label>
        <label>
          비율(%)
          <input
            inputMode="numeric"
            disabled={!isRate}
            value={formatNumber(result.ratePercent)}
            onChange={(e) => update("ratePercent", parseNumberInput(e.target.value) ?? 0)}
          />
        </label>
        <label>
          기준금액항목
          <select
            disabled={!isRate}
            value={result.baseAmountMetric}
            onChange={(e) => update("baseAmountMetric", e.target.value as Metric)}
          >
            <option value="sales_amount">판매금액</option>
            <option value="sales_count">판매건수</option>
            <option value="sales_set">판매세트 수</option>
          </select>
        </label>
        <label>
          최대지급한도(원)
          <input
            inputMode="numeric"
            value={formatNumber(result.maxAmount)}
            onChange={(e) => update("maxAmount", parseNumberInput(e.target.value) ?? 0)}
          />
        </label>
      </div>
    </SectionCard>
  );
}
