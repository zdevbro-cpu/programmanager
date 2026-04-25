import type { RuleDraft } from "../types/rule";

export const mockRule: RuleDraft = {
  projectId: "PROJ-2026-001",
  ruleName: "PM 거점 확보 보상",
  ruleType: "achievement",
  effectiveFrom: "2026-05-01",
  effectiveTo: "2026-07-31",
  enabled: true,
  target: {
    targetType: "role",
    targetRoles: ["PM", "과차장", "점장"],
    orgScope: "direct_lower",
    allowDuplicate: false
  },
  condition: {
    logic: "AND",
    items: [
      {
        id: "cond-1",
        metric: "sales_count",
        aggregationScope: "self",
        aggregationPeriod: "week",
        operator: ">=",
        value1: 1,
        value2: null
      }
    ],
    requireApproval: true,
    excludeCanceled: true,
    maintainPeriod: ""
  },
  result: {
    resultType: "reward_scheduled",
    rewardType: "rate",
    fixedAmount: 0,
    ratePercent: 30,
    baseAmountMetric: "sales_amount",
    payCycle: "ad_hoc",
    payCount: 1,
    maxAmount: 0
  }
};
