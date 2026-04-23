import { GripVertical, Plus, Trash2, Users, X } from "lucide-react";
import type { OrgScope, RuleDraft, TargetType } from "../../types/rule";
import { SectionCard } from "./SectionCard";
import { ToggleSwitch } from "./ToggleSwitch";

interface TargetSectionProps {
  value: RuleDraft;
  onChange: (next: RuleDraft) => void;
}

const ROLE_OPTIONS = ["PM", "Admin", "프로젝트팀원", "거점", "전문가"];

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

  const isRoleType = target.targetType === "role";

  return (
    <SectionCard title="적용대상" icon={<Users className="mini-icon" />}>
      <div className="grid three">
        <label className="target-type">
          적용대상유형
          <div className="inline-options">
            <label className="inline-option">
              <input
                type="radio"
                name="targetType"
                checked={target.targetType === "role"}
                onChange={() => update("targetType", "role" as TargetType)}
              />
              역할
            </label>
            <label className="inline-option">
              <input
                type="radio"
                name="targetType"
                checked={target.targetType === "individual"}
                onChange={() => update("targetType", "individual" as TargetType)}
              />
              개인
            </label>
            <label className="inline-option">
              <input
                type="radio"
                name="targetType"
                checked={target.targetType === "organization"}
                onChange={() => update("targetType", "organization" as TargetType)}
              />
              조직
            </label>
          </div>
        </label>
      </div>

      <div className="target-layout">
        <div className="target-left">
          <label>적용역할</label>
          {isRoleType ? (
            <div className="role-builder">
              {target.targetRoles.map((role, idx) => (
                <div className="role-row" key={`${role}-${idx}`}>
                  <GripVertical className="row-icon grip" />
                  <select value={role} onChange={(e) => updateRoleAt(idx, e.target.value)}>
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="icon-btn" onClick={() => removeRoleAt(idx)}>
                    <Trash2 className="row-icon" />
                  </button>
                </div>
              ))}
              <button type="button" className="add-role-btn" onClick={addRole}>
                <Plus className="row-icon" />
                적용역할 추가
              </button>
            </div>
          ) : (
            <p className="helper-text">역할 기반 적용이 아닐 때는 개별/조직 대상을 API 연동 단계에서 확장합니다.</p>
          )}
        </div>

        <div className="target-right">
          <label>
            선택된 역할
            <div className="role-chips">
              {target.targetRoles.length > 0 ? (
                target.targetRoles.map((role, idx) => (
                  <span className="role-chip" key={`${role}-chip-${idx}`}>
                    {role}
                    <X className="chip-x" />
                  </span>
                ))
              ) : (
                <span className="empty-chip">선택 없음</span>
              )}
            </div>
          </label>

          <label>
            조직범위
            <select value={target.orgScope} onChange={(e) => update("orgScope", e.target.value as OrgScope)}>
              <option value="self">본인</option>
              <option value="direct_lower">직접하위</option>
              <option value="all_lower">전체하위</option>
              <option value="team">팀전체</option>
            </select>
          </label>

          <div className="toggle-field">
            <span>중복적용</span>
            <ToggleSwitch
              checked={!target.allowDuplicate}
              onChange={(next) => update("allowDuplicate", !next)}
              label="중복지급 불가"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
