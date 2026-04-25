export type RuleType = "qualification" | "achievement" | "reward";
export type TargetType = "role" | "individual" | "organization";
export type OrgScope = "self" | "direct_lower" | "all_lower" | "team";
export type Metric =
  | "lower_base_count"
  | "lower_expert_count"
  | "sales_count"
  | "sales_set"
  | "sales_amount";
export type AggregationPeriod = "day" | "week" | "month" | "project";
export type Operator = ">=" | "<=" | "=" | ">" | "<" | "between";
export type ResultType =
  | "reward_scheduled"
  | "qualification_grant"
  | "qualification_keep"
  | "payment_restrict";
export type RewardType = "fixed" | "rate" | "mixed";
export type PayCycle = "once" | "month" | "quarter" | "ad_hoc";

export interface ConditionItem {
  id: string;
  metric: Metric;
  aggregationScope: OrgScope;
  aggregationPeriod: AggregationPeriod;
  operator: Operator;
  value1: number;
  value2: number | null;
}

export interface RuleDraft {
  projectId: string;
  ruleName: string;
  ruleType: RuleType;
  effectiveFrom: string;
  effectiveTo: string;
  enabled: boolean;
  target: {
    targetType: TargetType;
    targetRoles: string[];
    orgScope: OrgScope;
    allowDuplicate: boolean;
  };
  condition: {
    logic: "AND" | "OR";
    items: ConditionItem[];
    requireApproval: boolean;
    excludeCanceled: boolean;
    maintainPeriod: string;
  };
  result: {
    resultType: ResultType;
    rewardType: RewardType;
    fixedAmount: number;
    ratePercent: number;
    baseAmountMetric: Metric;
    payCycle: PayCycle;
    payCount: number;
    maxAmount: number;
  };
}
