import type { RuleDraft } from "../types/rule";

const DRAFT_KEY = "programmanager.rule.draft.v1";
const RULES_KEY = "programmanager.rule.saved.v1";

export interface SavedRuleItem {
  id: string;
  name: string;
  projectId: string;
  savedAt: string;
  isDraft?: boolean;
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

// Fixed: saveDraft now also adds to the saved list with [isDraft: true]
const generateId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }
};

export function saveDraft(rule: RuleDraft): SavedRuleItem[] {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(rule));

  const nextItem: SavedRuleItem = {
    id: generateId(),
    name: rule.ruleName || "제목 없는 임시저장",
    projectId: rule.projectId,
    savedAt: new Date().toISOString(),
    isDraft: true,
    data: rule
  };

  const current = loadSavedRules();
  const next = [nextItem, ...current].slice(0, 50);
  localStorage.setItem(RULES_KEY, JSON.stringify(next));
  return next;
}

export function loadSavedRules(): SavedRuleItem[] {
  const raw = localStorage.getItem(RULES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as SavedRuleItem[];
    if (!Array.isArray(parsed)) return [];
    
    let needsUpdate = false;
    const fixed = parsed.map(item => {
      if (!item.id) {
        needsUpdate = true;
        return { ...item, id: generateId() };
      }
      return item;
    });

    if (needsUpdate) {
      localStorage.setItem(RULES_KEY, JSON.stringify(fixed));
    }
    return fixed;
  } catch {
    return [];
  }
}

export function saveRule(rule: RuleDraft): SavedRuleItem[] {
  const nextItem: SavedRuleItem = {
    id: generateId(),
    name: rule.ruleName,
    projectId: rule.projectId,
    savedAt: new Date().toISOString(),
    isDraft: false,
    data: rule
  };

  const current = loadSavedRules();
  const next = [nextItem, ...current].slice(0, 50);
  localStorage.setItem(RULES_KEY, JSON.stringify(next));
  return next;
}

export function updateSavedRule(id: string, rule: RuleDraft): SavedRuleItem[] {
  const current = loadSavedRules();
  const next = current.map((item) =>
    item.id === id
      ? {
          ...item,
          name: rule.ruleName,
          savedAt: new Date().toISOString(),
          isDraft: false, // Update makes it a non-draft
          data: rule
        }
      : item
  );
  localStorage.setItem(RULES_KEY, JSON.stringify(next));
  return next;
}

export function deleteSavedRule(id: string): SavedRuleItem[] {
  const current = loadSavedRules();
  const next = current.filter((item) => item.id !== id);
  
  localStorage.setItem(RULES_KEY, JSON.stringify(next));
  return next;
}
