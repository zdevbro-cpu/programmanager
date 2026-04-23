import type { RuleDraft } from "../types/rule";

export const mockRule: RuleDraft = {
  projectId: "PROJ-2026-001",
  ruleName: "PM 거점 확보 보상",
  ruleType: "reward",
  effectiveFrom: "2026-05-01",
  effectiveTo: "2026-07-31",
  enabled: true,
  target: {
    targetType: "role",
    targetRoles: ["PM", "간사", "프로젝트팀원"],
    orgScope: "direct_lower",
    allowDuplicate: false
  },
  condition: {
    metric: "lower_base_count",
    aggregationScope: "direct_lower",
    aggregationPeriod: "project",
    operator: ">=",
    value1: 12,
    value2: null,
    requireApproval: true,
    excludeCanceled: true,
    maintainPeriod: ""
  },
  result: {
    resultType: "reward_scheduled",
    rewardType: "fixed",
    fixedAmount: 2000000,
    ratePercent: 0,
    baseAmountMetric: "sales_amount",
    payCycle: "month",
    payCount: 3,
    maxAmount: 6000000
  }
};
