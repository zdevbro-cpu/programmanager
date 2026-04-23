import { useEffect, useMemo, useState } from "react";
import { BasicInfoSection } from "../components/condition/BasicInfoSection";
import { BuilderSection } from "../components/condition/BuilderSection";
import { PreviewPanel } from "../components/condition/PreviewPanel";
import { ResultSection } from "../components/condition/ResultSection";
import { SavedRulesPanel } from "../components/condition/SavedRulesPanel";
import { TargetSection } from "../components/condition/TargetSection";
import { ValidationPanel } from "../components/condition/ValidationPanel";
import { mockRule } from "../data/mockCondition";
import { loadDraft, loadSavedRules, saveDraft, saveRule, type SavedRuleItem } from "../services/ruleStorage";
import type { RuleDraft } from "../types/rule";

function validateRule(rule: RuleDraft): string[] {
  const errors: string[] = [];

  if (!rule.projectId.trim()) errors.push("프로젝트를 선택하세요.");
  if (rule.ruleName.trim().length < 3) errors.push("조건명은 3자 이상이어야 합니다.");
  if (!rule.effectiveFrom || !rule.effectiveTo) errors.push("적용기간을 입력하세요.");
  if (rule.effectiveFrom > rule.effectiveTo) errors.push("적용 시작일이 종료일보다 늦을 수 없습니다.");
  if (rule.target.targetType === "role" && rule.target.targetRoles.length === 0) {
    errors.push("적용 역할을 1개 이상 선택하세요.");
  }
  if (rule.condition.operator === "between" && rule.condition.value2 === null) {
    errors.push("BETWEEN 연산자는 기준값2가 필요합니다.");
  }
  if (rule.condition.operator === "between" && rule.condition.value2 !== null) {
    if (rule.condition.value1 > rule.condition.value2) {
      errors.push("기준값1은 기준값2보다 클 수 없습니다.");
    }
  }
  if (rule.result.payCount < 1) errors.push("지급횟수는 1 이상이어야 합니다.");

  if (rule.result.rewardType === "fixed" || rule.result.rewardType === "mixed") {
    if (rule.result.fixedAmount <= 0) errors.push("정액금액은 0보다 커야 합니다.");
  }
  if (rule.result.rewardType === "rate" || rule.result.rewardType === "mixed") {
    if (rule.result.ratePercent <= 0) errors.push("비율은 0보다 커야 합니다.");
  }

  return errors;
}

export function ConditionManagementPage({ projectName }: { projectName?: string }) {
  const [rule, setRule] = useState<RuleDraft>(mockRule);
  const [savedRules, setSavedRules] = useState<SavedRuleItem[]>([]);
  const [notice, setNotice] = useState("");
  const errors = useMemo(() => validateRule(rule), [rule]);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setRule(draft);
    setSavedRules(loadSavedRules());
  }, []);

  const onTempSave = () => {
    saveDraft(rule);
    setNotice("임시저장 완료");
  };

  const onPreview = () => {
    setNotice("현재 입력값 기준으로 우측 미리보기가 갱신되었습니다.");
  };

  const onSubmit = () => {
    if (errors.length > 0) {
      setNotice("검증 오류를 먼저 해결하세요.");
      return;
    }
    const next = saveRule(rule);
    setSavedRules(next);
    setNotice("조건 저장 완료");
  };

  const onSelectSavedRule = (item: SavedRuleItem) => {
    setRule(item.data);
    setNotice(`저장된 조건을 불러왔습니다: ${item.name}`);
  };

  return (
    <>
      <div className="page-head">
        <h1>
          <span className="logo-mark page-logo" aria-hidden="true">
            <span className="logo-dot" />
          </span>
          {projectName ? `${projectName} 조건 입력` : "프로젝트 조건 입력"}
        </h1>
        <p>프로젝트별 달성조건, 자격조건, 보상조건을 설정합니다.</p>
        {notice ? <div className="notice-bar">{notice}</div> : null}
      </div>

      <div className="content-grid">
        <section className="left-col">
          <BasicInfoSection value={rule} onChange={setRule} />
          <TargetSection value={rule} onChange={setRule} />
          <BuilderSection value={rule} onChange={setRule} />
          <ResultSection value={rule} onChange={setRule} />
        </section>

        <section className="right-col">
          <PreviewPanel value={rule} />
          <ValidationPanel errors={errors} />
          <SavedRulesPanel items={savedRules} onSelect={onSelectSavedRule} />
        </section>
      </div>

      <div className="actions">
        <button type="button" className="ghost" onClick={onTempSave}>
          임시저장
        </button>
        <button type="button" className="ghost" onClick={onPreview}>
          미리보기
        </button>
        <button type="button" className="primary" onClick={onSubmit}>
          조건 저장
        </button>
      </div>
    </>
  );
}
