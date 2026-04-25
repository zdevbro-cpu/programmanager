import { GripVertical, Plus, Trash2, Users, X } from "lucide-react";
import type { OrgScope, RuleDraft, TargetType } from "../../types/rule";
import { SectionCard } from "./SectionCard";
import { ToggleSwitch } from "./ToggleSwitch";

interface TargetSectionProps {
  value: RuleDraft;
  onChange: (next: RuleDraft) => void;
}

const ROLE_OPTIONS = ["PM", "과차장", "점장", "점주", "레벨 1", "레벨 2", "직접 입력"];

export function TargetSection({ value, onChange }: TargetSectionProps) {
  const target = value.target;

  const update = <K extends keyof RuleDraft["target"]>(
    key: K,
    nextValue: RuleDraft["target"][K]
  ) => {
    onChange({ ...value, target: { ...target, [key]: nextValue } });
  };

  const updateRoleAt = (index: number, nextRole: string) => {
    const nextRoles = [...target.targetRoles];
    nextRoles[index] = nextRole;
    update("targetRoles", nextRoles);
  };

  const addRole = () => {
    update("targetRoles", [...target.targetRoles, ROLE_OPTIONS[0]]);
  };

  const removeRoleAt = (index: number) => {
    update(
      "targetRoles",
      target.targetRoles.filter((_, idx) => idx !== index)
    );
  };

  const headerRight = (
    <div className="target-type-selector">
      <span className="label">유형</span>
      <span className="separator">|</span>
      <div className="inline-options">
        <label className="inline-option radio-btn">
          <input
            type="radio"
            name="targetType"
            checked={target.targetType === "role"}
            onChange={() => update("targetType", "role" as TargetType)}
          />
          <span className="radio-mark" />
          역할
        </label>
        <label className="inline-option radio-btn">
          <input
            type="radio"
            name="targetType"
            checked={target.targetType === "organization"}
            onChange={() => update("targetType", "organization" as TargetType)}
          />
          <span className="radio-mark" />
          조직
        </label>
        <label className="inline-option radio-btn">
          <input
            type="radio"
            name="targetType"
            checked={target.targetType === "individual"}
            onChange={() => update("targetType", "individual" as TargetType)}
          />
          <span className="radio-mark" />
          개인
        </label>
      </div>
    </div>
  );

  return (
    <SectionCard title="적용대상" icon={<Users className="mini-icon" />} headerRight={headerRight}>
      <div className="target-layout">
        <div className="target-left">
          <label className="field-label">적용역할</label>
          <div className="role-builder">
            {target.targetRoles.map((role, idx) => {
              const isManual = !ROLE_OPTIONS.includes(role) || role === "직접 입력";
              return (
                <div className="role-row" key={`role-row-${idx}`}>
                  <GripVertical className="row-icon grip" />
                  {isManual ? (
                    <div className="manual-input-group">
                      <input
                        type="text"
                        value={role === "직접 입력" ? "" : role}
                        onChange={(e) => updateRoleAt(idx, e.target.value)}
                        placeholder="역할명 입력"
                        autoFocus
                      />
                      <button 
                        type="button" 
                        className="back-to-select"
                        onClick={() => updateRoleAt(idx, ROLE_OPTIONS[0])}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <select value={role} onChange={(e) => updateRoleAt(idx, e.target.value)}>
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="icon-btn delete-btn"
                    onClick={() => removeRoleAt(idx)}
                    disabled={target.targetRoles.length <= 1}
                    style={{ opacity: target.targetRoles.length <= 1 ? 0.4 : 1, cursor: target.targetRoles.length <= 1 ? "not-allowed" : "pointer" }}
                  >
                    <Trash2 className="row-icon" />
                  </button>
                </div>
              );
            })}
            <button type="button" className="add-role-btn" onClick={addRole}>
              <Plus className="row-icon" />
              적용역할 추가
            </button>
          </div>
        </div>

        <div className="target-right">
          <label className="field-label">선택된 역할</label>
          <div className="role-chips">
            {target.targetRoles.length > 0 ? (
              target.targetRoles.map((role, idx) => (
                <span className="role-chip" key={`${role}-chip-${idx}`}>
                  {role === "직접 입력" ? "입력 중..." : role}
                  <X className="chip-x" onClick={() => removeRoleAt(idx)} />
                </span>
              ))
            ) : (
              <span className="empty-chip">선택 없음</span>
            )}
          </div>

          <label className="field-label">조직범위</label>
          <select value={target.orgScope} onChange={(e) => update("orgScope", e.target.value as OrgScope)}>
            <option value="self">본인</option>
            <option value="direct_lower">직접하위</option>
            <option value="all_lower">전체하위</option>
            <option value="team">팀전체</option>
          </select>

          <div className="toggle-field inline">
            <div className="toggle-field inline-group">
              <span className="field-label">중복적용</span>
              <ToggleSwitch
                checked={target.allowDuplicate}
                onChange={(next) => update("allowDuplicate", next)}
                label={target.allowDuplicate ? "중복지급 가능" : "중복지급 불가"}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
