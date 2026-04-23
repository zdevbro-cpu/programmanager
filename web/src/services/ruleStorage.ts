import type { RuleDraft } from "../types/rule";

const DRAFT_KEY = "programmanager.rule.draft.v1";
const RULES_KEY = "programmanager.rule.saved.v1";

export interface SavedRuleItem {
  id: string;
  name: string;
  projectId: string;
  savedAt: string;
  data: RuleDraft;
}

export function loadDraft(): RuleDraft | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RuleDraft;
  } catch {
    return null;
  }
}

export function saveDraft(rule: RuleDraft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(rule));
}

export function loadSavedRules(): SavedRuleItem[] {
  const raw = localStorage.getItem(RULES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as SavedRuleItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRule(rule: RuleDraft): SavedRuleItem[] {
  const nextItem: SavedRuleItem = {
    id: crypto.randomUUID(),
    name: rule.ruleName,
    projectId: rule.projectId,
    savedAt: new Date().toISOString(),
    data: rule
  };

  const current = loadSavedRules();
  const next = [nextItem, ...current].slice(0, 30);
  localStorage.setItem(RULES_KEY, JSON.stringify(next));
  return next;
}
