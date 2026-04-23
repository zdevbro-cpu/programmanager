import { Folder } from "lucide-react";
import type { RuleDraft, RuleType } from "../../types/rule";
import { SectionCard } from "./SectionCard";
import { ToggleSwitch } from "./ToggleSwitch";

interface BasicInfoSectionProps {
  value: RuleDraft;
  onChange: (next: RuleDraft) => void;
}

export function BasicInfoSection({ value, onChange }: BasicInfoSectionProps) {
  const setField = <K extends keyof RuleDraft>(key: K, nextValue: RuleDraft[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <SectionCard title="기본정보" icon={<Folder className="mini-icon" />}>
      <div className="grid two">
        <label>
          프로젝트 선택
          <input
            value={value.projectId}
            onChange={(e) => setField("projectId", e.target.value)}
            placeholder="PROJ-2026-001"
          />
        </label>
        <label>
          조건명
          <input
            value={value.ruleName}
            onChange={(e) => setField("ruleName", e.target.value)}
            placeholder="조건명을 입력하세요"
          />
        </label>
      </div>

      <div className="grid four">
        <label>
          조건구분
          <select
            value={value.ruleType}
            onChange={(e) => setField("ruleType", e.target.value as RuleType)}
          >
            <option value="qualification">자격조건</option>
            <option value="achievement">달성조건</option>
            <option value="reward">보상조건</option>
          </select>
        </label>
        <label>
          적용 시작일
          <input
            type="date"
            value={value.effectiveFrom}
            onChange={(e) => setField("effectiveFrom", e.target.value)}
          />
        </label>
        <label>
          적용 종료일
          <input
            type="date"
            value={value.effectiveTo}
            onChange={(e) => setField("effectiveTo", e.target.value)}
          />
        </label>
        <div className="toggle-field inline">
          <span>사용여부</span>
          <ToggleSwitch
            checked={value.enabled}
            onChange={(next) => setField("enabled", next)}
            label={value.enabled ? "활성" : "비활성"}
          />
        </div>
      </div>
    </SectionCard>
  );
}
