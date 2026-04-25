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
  const isNoLimit = result.maxAmount === 0;

  return (
    <SectionCard title="결과 설정" icon={<Gift className="mini-icon" />}>
      <div className="grid four">
        <label>
          결과유형
          <select
            value={result.resultType}
            onChange={(e) => update("resultType", e.target.value as ResultType)}
          >
            <option value="reward_scheduled">보상</option>
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
            <option value="ad_hoc">수시</option>
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
            onChange={(e) => update("payCount", parseNumberInput(e.target.value) ?? 1)}
          />
        </label>
      </div>

      <div className="grid four">
        <label>
          <div className="label-with-action">
            <span>정액금액(원)</span>
          </div>
          <input
            inputMode="numeric"
            disabled={result.rewardType === "rate"}
            value={result.rewardType === "rate" ? 0 : formatNumber(result.fixedAmount)}
            onChange={(e) => update("fixedAmount", parseNumberInput(e.target.value) ?? 0)}
            className={result.rewardType === "rate" ? "input-disabled-text" : ""}
          />
        </label>
        <label>
          <div className="label-with-action">
            <span>비율(%)</span>
          </div>
          <input
            inputMode="numeric"
            disabled={result.rewardType === "fixed"}
            value={result.rewardType === "fixed" ? 0 : result.ratePercent}
            onChange={(e) => update("ratePercent", parseNumberInput(e.target.value) ?? 0)}
            className={result.rewardType === "fixed" ? "input-disabled-text" : ""}
          />
        </label>
        <label>
          <div className="label-with-action">
            <span>기준금액항목</span>
          </div>
          <select
            value={result.baseAmountMetric}
            onChange={(e) => update("baseAmountMetric", e.target.value as Metric)}
          >
            <option value="sales_amount">판매금액</option>
            <option value="sales_count">판매건수</option>
            <option value="lower_base_count">하위거점수</option>
          </select>
        </label>
        <label className="max-limit-col">
          <div className="label-with-action">
            <span>지급한도(원)</span>
            <div className="checkbox-item mini">
              <input 
                type="checkbox" 
                id="no-limit-check"
                checked={isNoLimit} 
                onChange={(e) => update("maxAmount", e.target.checked ? 0 : 1000000)}
              />
              <label htmlFor="no-limit-check">한도 없음</label>
            </div>
          </div>
          <input
            inputMode="numeric"
            disabled={isNoLimit}
            value={isNoLimit ? "무제한" : formatNumber(result.maxAmount)}
            onChange={(e) => update("maxAmount", parseNumberInput(e.target.value) ?? 0)}
            className={isNoLimit ? "input-disabled-text" : ""}
          />
        </label>
      </div>
    </SectionCard>
  );
}
