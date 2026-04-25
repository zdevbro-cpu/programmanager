import { useEffect, useMemo, useState, useRef } from "react";
import { BasicInfoSection } from "../components/condition/BasicInfoSection";
import { BuilderSection } from "../components/condition/BuilderSection";
import { PreviewPanel } from "../components/condition/PreviewPanel";
import { ResultSection } from "../components/condition/ResultSection";
import { SavedRulesPanel } from "../components/condition/SavedRulesPanel";
import { TargetSection } from "../components/condition/TargetSection";
import { ValidationPanel } from "../components/condition/ValidationPanel";
import { mockRule } from "../data/mockCondition";
import { loadDraft, loadSavedRules, saveDraft, saveRule, updateSavedRule, deleteSavedRule, type SavedRuleItem } from "../services/ruleStorage";
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
  if (rule.condition.items.length === 0) {
    errors.push("조건을 1개 이상 추가하세요.");
  }

  rule.condition.items.forEach((item, idx) => {
    const label = `조건 ${idx + 1}`;
    if (item.operator === "between") {
      if (item.value2 === null) {
        errors.push(`${label}: BETWEEN 연산자는 기준값2가 필요합니다.`);
      } else if (item.value1 > item.value2) {
        errors.push(`${label}: 기준값1은 기준값2보다 클 수 없습니다.`);
      }
    }
  });
  if (rule.result.payCount < 1) errors.push("지급횟수는 1 이상이어야 합니다.");

  if (rule.result.rewardType === "fixed" || rule.result.rewardType === "mixed") {
    if (rule.result.fixedAmount <= 0) errors.push("정액금액은 0보다 커야 합니다.");
  }
  if (rule.result.rewardType === "rate" || rule.result.rewardType === "mixed") {
    if (rule.result.ratePercent <= 0) errors.push("비율은 0보다 커야 합니다.");
  }

  return errors;
}

import { ConfirmModal } from "../components/common/ConfirmModal";

export function ConditionManagementPage({ projectName }: { projectName?: string }) {
  const [rule, setRule] = useState<RuleDraft>(mockRule);
  const [savedRules, setSavedRules] = useState<SavedRuleItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const errors = useMemo(() => validateRule(rule), [rule]);

  useEffect(() => {
    // Force the new defaults from mockRule, ignoring old local storage drafts for now
    setRule(mockRule);
    
    const saved = loadSavedRules();
    setSavedRules(saved);
    
    // Clear any potentially confusing old draft
    localStorage.removeItem("programmanager.rule.draft.v1");
  }, []);

  const onNewTemplate = () => {
    setRule(mockRule);
    setEditingId(null);
    setNotice("새 템플릿 작성 모드로 전환되었습니다.");
  };

  const onTempSave = () => {
    const next = saveDraft(rule);
    setSavedRules(next);
    setNotice("임시저장 완료 (목록에서 [임시] 항목으로 확인 가능)");
  };

  const onSubmit = () => {
    if (errors.length > 0) {
      setNotice("검증 오류를 먼저 해결하세요.");
      return;
    }
    
    if (editingId) {
      const next = updateSavedRule(editingId, rule);
      setSavedRules(next);
      setNotice("템플릿 업데이트 완료");
    } else {
      const next = saveRule(rule);
      setSavedRules(next);
      setNotice("새 템플릿 저장 완료");
      if (next.length > 0) setEditingId(next[0].id);
    }
  };

  const onSelectSavedRule = (item: SavedRuleItem) => {
    setRule(item.data);
    setEditingId(item.id);
    setNotice(`템플릿을 불러왔습니다: ${item.name}`);
  };

  // Double-check with a ref to avoid any state closure issues during deletion
  const deleteTargetRef = useRef<string | null>(null);

  const onDeleteRequest = (id: string) => {
    deleteTargetRef.current = id;
    setDeleteModal({ isOpen: true, id });
  };

  const onConfirmDelete = () => {
    const targetId = deleteTargetRef.current || deleteModal.id;
    
    if (targetId) {
      try {
        // 1. Direct Storage Action
        const nextRules = deleteSavedRule(targetId);
        
        // 2. Update state to trigger re-render without reload
        setSavedRules([...nextRules]);
        
        // 3. Reset editing if we deleted the current one
        if (editingId === targetId) {
          onNewTemplate();
        }

        setNotice("템플릿이 삭제되었습니다.");
      } catch (err: any) {
        console.error("삭제 중 에러:", err);
      }
    }
    
    // 4. Close modal and clean up
    deleteTargetRef.current = null;
    setDeleteModal({ isOpen: false, id: null });
  };

  return (
    <>
      <div className="page-head">
        <div className="title-row">
          <h1>
            <span className="logo-mark page-logo" aria-hidden="true">
              <span className="logo-dot" />
            </span>
            {projectName ? `${projectName} 프로모션 템플릿` : "프로모션 템플릿"}
          </h1>
          {editingId && <span className="edit-badge">수정 중</span>}
        </div>
        <p>프로모션별 달성조건, 자격조건, 보상조건 템플릿을 설정합니다.</p>
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
          <SavedRulesPanel items={savedRules} onSelect={onSelectSavedRule} onDelete={onDeleteRequest} />
        </section>
      </div>

      <div className="actions">
        <div className="action-left">
          <button type="button" className="ghost" onClick={onTempSave}>
            임시저장
          </button>
        </div>
        <div className="action-right">
          <button type="button" className="secondary-btn" onClick={onNewTemplate}>
            새 템플릿 작성
          </button>
          <button type="button" className="primary-btn-premium" onClick={onSubmit}>
            {editingId ? "템플릿 업데이트" : "새 템플릿 저장"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="템플릿 삭제"
        message="정말로 이 템플릿을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </>
  );
}
