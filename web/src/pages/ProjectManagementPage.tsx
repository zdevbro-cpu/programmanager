import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ClipboardList,
  CircleDollarSign,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Clock4,
  Eye,
  FileText,
  Flag,
  FolderOpen,
  Gift,
  Info,
  Pencil,
  Percent,
  Plus,
  ShieldCheck,
  Search,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Users,
  Zap
} from "lucide-react";
import { ParticipantsManagementPage } from "./ParticipantsManagementPage";
import { ProgramBoardPage } from "./ProgramBoardPage";
import { mockRule } from "../data/mockCondition";
import { loadSavedRules, saveRule, type SavedRuleItem, updateSavedRule } from "../services/ruleStorage";
import type { RuleDraft } from "../types/rule";

// Performance Assets
import kpiCrown from "../assets/performance/kpi-crown.png";
import kpiRecruit from "../assets/performance/kpi-recruit.png";
import kpiSales from "../assets/performance/kpi-sales.png";
import kpiTarget from "../assets/performance/kpi-target.png";
import kpiUsers from "../assets/performance/kpi-users.png";
import trendChart from "../assets/performance/trend-card.png";

type SubMenu =
  | "basic"
  | "participants_org"
  | "rules"
  | "progress"
  | "performance"
  | "settlement"
  | "board"
  | "evidence"
  | "activity";

type ProjectItem = {
  id: string;
  name: string;
  type: string;
  period: string;
  status: "running" | "preparing" | "closed";
  pm: string;
  progress: number;
  participants: number;
  updatedAt: string;
};

const PROJECT_TABS: { key: SubMenu; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "participants_org", label: "참여자/조직" },
  { key: "rules", label: "조건/보상규칙" },
  { key: "progress", label: "진행관리" },
  { key: "performance", label: "실적" },
  { key: "settlement", label: "보상/정산" },
  { key: "board", label: "게시판" },
  { key: "evidence", label: "증빙자료" },
  { key: "activity", label: "활동로그" }
];

const PROJECTS: ProjectItem[] = [
  {
    id: "PRJ-2026-0001",
    name: "2026 유아도서 판매 프로모션",
    type: "판매 프로모션",
    period: "2026.01.01 ~ 2026.12.31",
    status: "running",
    pm: "김지훈",
    progress: 79.4,
    participants: 125,
    updatedAt: "2026.01.21"
  },
  {
    id: "PRJ-2026-0002",
    name: "중등 독서 연계 프로젝트",
    type: "콘텐츠 개발",
    period: "2026.02.01 ~ 2026.08.31",
    status: "preparing",
    pm: "이수진",
    progress: 15,
    participants: 12,
    updatedAt: "2026.01.20"
  },
  {
    id: "PRJ-2026-0003",
    name: "초등 신학기 학습패키지 캠페인",
    type: "판매 프로모션",
    period: "2026.03.01 ~ 2026.06.30",
    status: "running",
    pm: "박민수",
    progress: 62,
    participants: 84,
    updatedAt: "2026.01.19"
  },
  {
    id: "PRJ-2026-0004",
    name: "여름방학 독서챌린지 운영",
    type: "운영 프로젝트",
    period: "2026.06.15 ~ 2026.08.31",
    status: "preparing",
    pm: "최유리",
    progress: 8,
    participants: 31,
    updatedAt: "2026.01.18"
  },
  {
    id: "PRJ-2026-0005",
    name: "영업팀 지역별 특별프로모션",
    type: "판매 프로모션",
    period: "2026.04.01 ~ 2026.10.31",
    status: "running",
    pm: "정현우",
    progress: 47,
    participants: 96,
    updatedAt: "2026.01.17"
  },
  {
    id: "PRJ-2026-0006",
    name: "2025 연말 도서기획 회고",
    type: "회고/정리",
    period: "2025.10.01 ~ 2025.12.31",
    status: "closed",
    pm: "김서윤",
    progress: 100,
    participants: 22,
    updatedAt: "2026.01.15"
  }
];

const TAB_SUMMARY: Record<SubMenu, string> = {
  basic: "프로젝트의 기본정보를 확인합니다.",
  participants_org: "참여자와 조직 범위를 관리합니다.",
  rules: "조건과 보상 규칙을 관리합니다.",
  progress: "진행 단계와 과업을 관리합니다.",
  performance: "실적 현황과 추이를 확인합니다.",
  settlement: "보상/정산 현황을 관리합니다.",
  board: "프로젝트 게시판을 관리합니다.",
  evidence: "증빙자료 등록/검토 상태를 관리합니다.",
  activity: "프로젝트 활동 이력을 확인합니다."
};

function statusLabel(status: ProjectItem["status"]) {
  if (status === "running") return "운영중";
  if (status === "preparing") return "준비중";
  return "종료";
}

function statusClass(status: ProjectItem["status"]) {
  if (status === "running") return "status running";
  if (status === "preparing") return "status closed";
  return "status settling";
}

function ProjectBasicInfoTab({ project }: { project: ProjectItem }) {
  return (
    <div className="basic-info-page">
      <section className="section-card basic-hero-card">
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className={statusClass(project.status)}>{statusLabel(project.status)}</span>
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><CalendarDays className="mini-icon" /></div>
            <div>
              <span>프로젝트 기간</span>
              <strong>{project.period}</strong>
              <small>(366일)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><Tag className="mini-icon" /></div>
            <div>
              <span>프로젝트 유형</span>
              <strong>{project.type}</strong>
              <small>(인센티브형)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><BookOpen className="mini-icon" /></div>
            <div>
              <span>대상 상품</span>
              <strong>유아도서 전 품목</strong>
              <small>(1,256개)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock3 className="mini-icon" /></div>
            <div>
              <span>운영 상태</span>
              <strong>{statusLabel(project.status)}</strong>
              <small>(2026.01.01 시작)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon blue"><Target className="mini-icon" /></div>
            <div>
              <span>진척율</span>
              <strong>{project.progress}%</strong>
              <small>(진행률 기준)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="basic-mid-grid">
        <section className="section-card">
          <h3 className="panel-title">프로젝트 기본 정보</h3>
          <table className="project-table basic-info-table">
            <tbody>
              <tr><td>프로젝트명</td><td>{project.name}</td></tr>
              <tr><td>프로젝트목적</td><td>유아도서 판매 확대 및 고객 충성도 향상</td></tr>
              <tr><td>시작일</td><td>2026.01.01</td></tr>
              <tr><td>종료일</td><td>2026.12.31</td></tr>
              <tr><td>운영부서</td><td>마케팅본부 영업기획팀</td></tr>
              <tr><td>대상회원</td><td>전국 서점 및 온라인 판매처 (일반 회원 포함)</td></tr>
              <tr><td>프로젝트코드</td><td>{project.id}</td></tr>
              <tr><td>프로젝트 설명</td><td>2026년 한 해 동안 유아도서 판매 활성화를 위해 진행되는 인센티브 기반 프로모션입니다.</td></tr>
              <tr><td>프로젝트 코드</td><td>{project.id}</td></tr>
              <tr><td>프로그램명</td><td>{project.name}</td></tr>
              <tr><td>시작일</td><td>2026.01.01</td></tr>
              <tr><td>종료일</td><td>2026.12.31</td></tr>
              <tr><td>운영 조직</td><td>마케팅기획팀</td></tr>
            </tbody>
          </table>
        </section>
        <section className="section-card">
          <h3 className="panel-title">운영 요약</h3>
          <div className="basic-summary-grid">
            <div className="basic-summary-item"><Users className="mini-icon" /><div><span>참여자 수</span><strong>356명</strong></div></div>
            <div className="basic-summary-item"><Flag className="mini-icon" /><div><span>진행 단계</span><strong>1단계</strong></div></div>
            <div className="basic-summary-item"><Target className="mini-icon" /><div><span>모집 목표</span><strong>500명</strong></div></div>
            <div className="basic-summary-item"><Target className="mini-icon" /><div><span>판매 목표</span><strong>1,200,000,000원</strong></div></div>
            <div className="basic-summary-item"><BookOpen className="mini-icon" /><div><span>게시글</span><strong>12건</strong></div></div>
            <div className="basic-summary-item"><FolderOpen className="mini-icon" /><div><span>증빙자료</span><strong>87건</strong></div></div>
          </div>
        </section>
      </div>

      <div className="basic-bottom-grid">
        <section className="section-card">
          <h3 className="panel-title">프로젝트 일정</h3>
          <ul className="basic-timeline">
            <li className="done">
              <span className="tl-dot">✓</span>
              <b>프로젝트 준비</b>
              <span>2025.11.01 ~ 2025.12.31</span>
              <em className="status running">완료</em>
              <small>프로모션 기획 및 시스템 세팅 완료</small>
            </li>
            <li className="active">
              <span className="tl-dot">1</span>
              <b>1단계 프로모션</b>
              <span>2026.01.01 ~ 2026.03.31</span>
              <em className="status running">진행중</em>
              <small>초기 판매 활성화 및 참여자 확대</small>
            </li>
            <li>
              <span className="tl-dot">2</span>
              <b>2단계 프로모션</b>
              <span>2026.04.01 ~ 2026.06.30</span>
              <em className="status planning">예정</em>
              <small>판매 확대 및 중간 성과 점검</small>
            </li>
            <li>
              <span className="tl-dot">3</span>
              <b>3단계 프로모션</b>
              <span>2026.07.01 ~ 2026.09.30</span>
              <em className="status planning">예정</em>
              <small>하반기 집중 프로모션</small>
            </li>
            <li>
              <span className="tl-dot">4</span>
              <b>최종 정산 및 평가</b>
              <span>2026.10.01 ~ 2026.12.31</span>
              <em className="status planning">예정</em>
              <small>최종 성과 확인 및 보상 정산</small>
            </li>
          </ul>
        </section>

        <section className="section-card">
          <div className="basic-memo-head">
            <h3 className="panel-title">프로젝트 메모</h3>
            <button type="button" className="ghost">
              <Pencil className="mini-icon" />
              편집
            </button>
          </div>
          <ul className="simple-list">
            <li><span>1단계 프로모션 시작 전 가이드라인 배포 완료</span><small>2025.12.28</small></li>
            <li><span>참여자 대상 온보딩 웨비나 2026.01.02 진행 예정</span><small>2025.12.28</small></li>
            <li><span>신규 인센티브 상품 검토 중 (상위 10% 추가 포상)</span><small>2026.01.03</small></li>
            <li><span>2단계 목표 조정 검토 (시장 상황 반영)</span><small>2026.01.05</small></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function ProjectRulesTab({ project }: { project: ProjectItem }) {
  const [savedRules, setSavedRules] = useState<SavedRuleItem[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [editing, setEditing] = useState<RuleDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedRule = useMemo(
    () => savedRules.find((item) => item.id === selectedRuleId) ?? null,
    [savedRules, selectedRuleId]
  );

  useEffect(() => {
    const next = loadSavedRules();
    setSavedRules(next);
    if (next.length > 0) {
      setSelectedRuleId(next[0].id);
    }
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setEditing({
      ...mockRule,
      projectId: project.id,
      ruleName: `${project.name} 표준조건`
    });
  };

  const openEdit = () => {
    if (!selectedRule) return;
    setEditingId(selectedRule.id);
    setEditing({ ...selectedRule.data, projectId: project.id });
  };

  const saveEditing = () => {
    if (!editing) return;
    const next = editingId ? updateSavedRule(editingId, editing) : saveRule(editing);
    setSavedRules(next);
    const targetId = editingId ?? next[0]?.id ?? "";
    setSelectedRuleId(targetId);
    setEditing(null);
    setEditingId(null);
  };

  return (
    <section className="section-card proj-rules-tab">
      <h2 className="proj-rules-project-name">{project.name}</h2>
      <div className="proj-rules-head">
        <label>
          표준조건
          <select value={selectedRuleId} onChange={(e) => setSelectedRuleId(e.target.value)}>
            {savedRules.length === 0 ? <option value="">저장된 조건 없음</option> : null}
            {savedRules.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="proj-rules-actions">
          <button type="button" className="ghost" onClick={openAdd}>조건추가</button>
          <button type="button" className="primary" onClick={openEdit} disabled={!selectedRule}>조건수정</button>
        </div>
      </div>

      {editing ? (
        <div className="proj-rules-editor">
          <label>
            조건명
            <input
              value={editing.ruleName}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, ruleName: e.target.value } : prev))}
            />
          </label>
          <label>
            적용시작일
            <input
              type="date"
              value={editing.effectiveFrom}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveFrom: e.target.value } : prev))}
            />
          </label>
          <label>
            적용종료일
            <input
              type="date"
              value={editing.effectiveTo}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveTo: e.target.value } : prev))}
            />
          </label>
          <label>
            사용여부
            <select
              value={editing.enabled ? "Y" : "N"}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, enabled: e.target.value === "Y" } : prev))}
            >
              <option value="Y">활성</option>
              <option value="N">비활성</option>
            </select>
          </label>
          <label>
            기준값
            <input
              type="number"
              value={editing.condition.value1}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, condition: { ...prev.condition, value1: Number(e.target.value) || 0 } } : prev
                )
              }
            />
          </label>
          <label>
            보상금액
            <input
              type="number"
              value={editing.result.fixedAmount}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, result: { ...prev.result, fixedAmount: Number(e.target.value) || 0 } } : prev
                )
              }
            />
          </label>
          <div className="proj-rules-editor-actions">
            <button type="button" className="primary" onClick={saveEditing}>저장</button>
            <button type="button" className="ghost" onClick={() => { setEditing(null); setEditingId(null); }}>취소</button>
          </div>
        </div>
      ) : (
        <div className="proj-rules-summary">
          {selectedRule ? (
            <>
              <p><strong>조건명:</strong> {selectedRule.data.ruleName}</p>
              <p><strong>적용기간:</strong> {selectedRule.data.effectiveFrom} ~ {selectedRule.data.effectiveTo}</p>
              <p><strong>기준값:</strong> {selectedRule.data.condition.value1}</p>
              <p><strong>보상금액:</strong> {selectedRule.data.result.fixedAmount.toLocaleString()}</p>
            </>
          ) : (
            <p>드롭다운에서 표준조건을 선택하거나 조건추가를 진행하세요.</p>
          )}
        </div>
      )}
    </section>
  );
}

function ProjectRulesTabEnhanced({ project }: { project: ProjectItem }) {
  const [savedRules, setSavedRules] = useState<SavedRuleItem[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<RuleDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [notice, setNotice] = useState("");

  const sampleRules: SavedRuleItem[] = useMemo(
    () => [
      {
        id: "sample-1",
        name: "PM 거점 확보 보상",
        projectId: project.id,
        savedAt: "2026-05-14T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "PM 거점 확보 보상",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["PM"], orgScope: "direct_lower" },
          condition: { ...mockRule.condition, metric: "lower_base_count", value1: 3, operator: ">=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 50000 }
        }
      },
      {
        id: "sample-2",
        name: "거점 전문가 모집 보상",
        projectId: project.id,
        savedAt: "2026-05-10T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "거점 전문가 모집 보상",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["Admin"], orgScope: "all_lower" },
          condition: { ...mockRule.condition, metric: "lower_expert_count", value1: 5, operator: ">=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 80000 }
        }
      },
      {
        id: "sample-3",
        name: "유아도서 1세트 판매 보상",
        projectId: project.id,
        savedAt: "2026-05-05T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "유아도서 1세트 판매 보상",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["프로젝트팀원"], orgScope: "self" },
          condition: { ...mockRule.condition, metric: "sales_set", value1: 1, operator: "=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 12000 }
        }
      }
    ],
    [project.id]
  );

  const rulesForProject = useMemo(() => {
    const projectRules = savedRules.filter((item) => item.projectId === project.id);
    return projectRules.length > 0 ? projectRules : sampleRules;
  }, [savedRules, sampleRules, project.id]);

  const filteredRules = useMemo(() => {
    if (statusFilter === "enabled") return rulesForProject.filter((item) => item.data.enabled);
    if (statusFilter === "disabled") return rulesForProject.filter((item) => !item.data.enabled);
    return rulesForProject;
  }, [rulesForProject, statusFilter]);

  const selectedRule = useMemo(() => {
    const lastId = selectedRuleIds[selectedRuleIds.length - 1];
    return filteredRules.find((item) => item.id === lastId) ?? null;
  }, [filteredRules, selectedRuleIds]);

  useEffect(() => {
    setSavedRules(loadSavedRules());
  }, []);

  useEffect(() => {
    if (filteredRules.length === 0) {
      setSelectedRuleIds([]);
      return;
    }
    if (selectedRuleIds.length === 0) {
      setSelectedRuleIds([filteredRules[0].id]);
    }
  }, [filteredRules]);

  const toggleRule = (id: string) => {
    setSelectedRuleIds(prev => 
      prev.includes(id) 
        ? prev.filter(rid => rid !== id) 
        : [...prev, id]
    );
  };

  const metricLabel = (metric: RuleDraft["condition"]["metric"]) => {
    if (metric === "lower_base_count") return "거점 확보 수";
    if (metric === "lower_expert_count") return "전문가 등록 수";
    if (metric === "sales_count") return "판매 건수";
    if (metric === "sales_set") return "판매 세트 수";
    return "매출액";
  };

  const targetLabel = (targetType: RuleDraft["target"]["targetType"]) => {
    if (targetType === "role") return "참여자";
    if (targetType === "individual") return "개인";
    return "조직";
  };

  const operatorLabel = (operator: RuleDraft["condition"]["operator"]) => {
    if (operator === ">=") return "이상";
    if (operator === "<=") return "이하";
    if (operator === "=") return "동일";
    if (operator === ">") return "초과";
    if (operator === "<") return "미만";
    return "구간";
  };

  const resultSummary = (rule: RuleDraft) => {
    if (rule.result.rewardType === "fixed") return "조건 충족 시 보상 지급";
    if (rule.result.rewardType === "rate") return "조건 충족 시 비율 지급";
    return "조건 충족 시 혼합 보상 지급";
  };

  const [showTemplates, setShowTemplates] = useState(false);
  const [templateItems, setTemplateItems] = useState<SavedRuleItem[]>([]);

  const openAdd = () => {
    onLoadTemplate();
  };

  const onLoadTemplate = () => {
    const all = loadSavedRules();
    // 상위 조건관리에서 생성된 룰들만 필터링 (여기서는 예시로 전체 노출)
    if (all.length === 0) {
      setNotice("상위 '조건 관리' 메뉴에서 먼저 마스터 규칙을 등록해 주세요.");
      return;
    }
    setTemplateItems(all);
    setShowTemplates(true);
  };

  const onSelectTemplate = (item: SavedRuleItem) => {
    setEditingId(null); // 신규 등록 모드
    setEditing({
      ...item.data,
      projectId: project.id,
      ruleName: item.name // 마스터 규칙 명칭을 그대로 가져옴
    });
    setShowTemplates(false);
    setNotice("마스터 규칙을 불러왔습니다. 프로젝트에 맞게 조건을 수정하여 적용해 주세요.");
  };

  const onValidate = () => {
    setNotice("규칙의 유효성 및 충돌 검증이 완료되었습니다.");
  };

  const saveEditing = () => {
    if (!editing) return;
    if (editingId) {
      const next = updateSavedRule(editingId, editing);
      setAllRules(next);
      setNotice("규칙이 수정되었습니다.");
    } else {
      const next = saveRule(editing);
      setAllRules(next);
      setNotice("새 규칙이 프로젝트에 추가되었습니다.");
    }
    setEditing(null);
    setEditingId(null);
  };

  const totalCount = rulesForProject.length;
  const activeCount = rulesForProject.filter((r) => r.data.enabled).length;
  const rewardTypeCount = new Set(rulesForProject.map((r) => r.data.result.rewardType)).size;
  const approvalRequiredCount = 0; // 향후 승인 프로세스 연동 시 업데이트

  const policySummary = [
    { icon: <BookOpen className="mini-icon" />, title: "정액 보상", left: `${rulesForProject.filter(r => r.data.result.rewardType === 'fixed').length}개 규칙`, rightLabel: "총 예산", rightValue: "실적 연동 계산", tone: "blue" },
    { icon: <Target className="mini-icon" />, title: "비율 보상", left: `${rulesForProject.filter(r => r.data.result.rewardType === 'rate').length}개 규칙`, rightLabel: "지급 기준", rightValue: "매출/실적 대비", tone: "green" },
    { icon: <Tag className="mini-icon" />, title: "혼합 보상", left: `${rulesForProject.filter(r => r.data.result.rewardType === 'mixed').length}개 규칙`, rightLabel: "구성", rightValue: "정액 + 비율", tone: "purple" },
    { icon: <CalendarDays className="mini-icon" />, title: "지급주기", left: "월 단위 지급", rightLabel: "지급일", rightValue: "익월 15일", tone: "orange" }
  ] as const;

  const previewText = selectedRule
    ? `참여자가 월 동안 ${metricLabel(selectedRule.data.condition.metric)}가 ${selectedRule.data.condition.value1}${operatorLabel(
        selectedRule.data.condition.operator
      )}이면, 해당 월에 ${selectedRule.name}(정액 ₩${selectedRule.data.result.fixedAmount.toLocaleString()})을 지급합니다.`
    : "선택된 규칙이 없습니다.";

  const toneClass = (tone: "blue" | "green" | "purple" | "orange") => `proj-rules-tone-${tone}`;

  return (
    <section className="basic-info-page proj-rules-tab-wrapper">
      <section className="section-card basic-hero-card">
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className={statusClass(project.status)}>{statusLabel(project.status)}</span>
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><ClipboardList className="mini-icon" /></div>
            <div>
              <span>조건 수</span>
              <strong>{totalCount}건</strong>
              <small>(전체 등록)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CheckCircle2 className="mini-icon" /></div>
            <div>
              <span>활성 규칙 수</span>
              <strong>{activeCount}건</strong>
              <small>(KPI 반영)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><Gift className="mini-icon" /></div>
            <div>
              <span>보상 유형 수</span>
              <strong>{rewardTypeCount}개</strong>
              <small>(정액/비율/혼합)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><AlertTriangle className="mini-icon" /></div>
            <div>
              <span>승인 필요 규칙</span>
              <strong>{approvalRequiredCount}건</strong>
              <small>(검토 대기)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon blue"><Clock3 className="mini-icon" /></div>
            <div>
              <span>운영 상태</span>
              <strong>운영중</strong>
              <small>(현재 프로젝트)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="proj-rules-content-layout">
        <div className="proj-rules-left-column">
          <section className="proj-rules-list-card">
            <header className="proj-rules-card-head">
              <div className="head-left">
                <h3>프로젝트 적용 조건</h3>
                <span className="count-badge">{totalCount}건</span>
              </div>
              <div className="head-right">
                <button type="button" className="primary mini-btn" onClick={openAdd}>
                  <Plus className="mini-icon" /> 규칙 추가
                </button>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "enabled" | "disabled")}>
                  <option value="all">전체</option>
                  <option value="enabled">활성</option>
                  <option value="disabled">비활성</option>
                </select>
              </div>
            </header>

            <div className="proj-rules-info-box">
              <Info className="mini-icon blue" />
              <span>이 프로젝트에 최종 적용된 조건 목록입니다. 우측 <b>관리 액션</b>이나 헤더의 <b>추가</b> 버튼으로 새 조건을 등록할 수 있습니다.</span>
            </div>

            <div className="proj-rules-list">
              {filteredRules.length === 0 ? (
                <div className="proj-rules-empty">
                  <p>등록된 조건이 없습니다. 새 규칙을 추가해 주세요.</p>
                </div>
              ) : (
                filteredRules.map((item) => {
                  const isSelected = selectedRuleIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={isSelected ? "proj-rules-item active" : "proj-rules-item"}
                      onClick={() => toggleRule(item.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="proj-rules-item-top">
                        <div className={isSelected ? "proj-rules-check checked" : "proj-rules-check"}>
                          {isSelected && <Check className="mini-icon" />}
                        </div>
                        <strong>{item.name}</strong>
                        <div className="proj-rules-item-status-col">
                          <small>상태</small>
                          <span className={item.data.enabled ? "status running" : "status closed"}>{item.data.enabled ? "활성" : "비활성"}</span>
                        </div>
                      </div>
                      <div className="proj-rules-item-meta">
                        <div><small>적용대상</small><b>{targetLabel(item.data.target.targetType)}</b></div>
                        <div><small>측정항목</small><b>{metricLabel(item.data.condition.metric)}</b></div>
                        <div><small>판정기준</small><b>{item.data.condition.operator} {item.data.condition.value1}{operatorLabel(item.data.condition.operator)}</b></div>
                        <div><small>결과정의</small><b>{resultSummary(item.data)}</b></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="proj-rules-preview-card">
            <header className="proj-rules-card-head">
              <h3>조건 미리보기</h3>
            </header>
            <div className="proj-rules-preview-box">
              <FileText className="mini-icon" />
              <p>{previewText}</p>
            </div>
            <p className="proj-rules-preview-help">※ 위 내용은 선택 조건 기준으로 미리보기한 내용입니다.</p>
          </section>
        </div>

        <div className="proj-rules-right-column">
          <section className="proj-rules-policy-card">
            <header className="proj-rules-card-head">
              <h3>보상 정책 요약</h3>
            </header>
            <div className="proj-rules-policy-list">
              {policySummary.map((row) => (
                <article key={row.title} className="proj-rules-policy-item">
                  <div className={`proj-rules-policy-icon ${toneClass(row.tone)}`}>{row.icon}</div>
                  <div className="proj-rules-policy-text">
                    <div>
                      <small>{row.title}</small>
                      <strong>{row.left}</strong>
                    </div>
                    <div>
                      <small>{row.rightLabel}</small>
                      <strong>{row.rightValue}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="proj-rules-action-card">
            <header className="proj-rules-card-head">
              <h3>관리 액션</h3>
            </header>
            <div className="proj-rules-action-grid">
              <div className="proj-rules-action-btn" onClick={openAdd} role="button" tabIndex={0}>
                <div className="icon-wrapper"><Plus /></div>
                <div>
                  <strong>규칙 추가</strong>
                  <span>새 규칙을 등록합니다.</span>
                </div>
              </div>
              <div className="proj-rules-action-btn" onClick={onLoadTemplate} role="button" tabIndex={0}>
                <div className="icon-wrapper"><Upload /></div>
                <div>
                  <strong>템플릿 불러오기</strong>
                  <span>저장된 템플릿을 불러옵니다.</span>
                </div>
              </div>
              <div className="proj-rules-action-btn" onClick={onValidate} role="button" tabIndex={0}>
                <div className="icon-wrapper"><ShieldCheck /></div>
                <div>
                  <strong>검증 실행</strong>
                  <span>규칙의 유효성 및 충돌을 검증합니다.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>


      {notice ? <div className="notice-bar">{notice}</div> : null}

      {showTemplates ? (
        <div className="proj-rules-modal-overlay">
          <div className="proj-rules-modal templates-modal">
            <header className="proj-rules-modal-head">
              <h3>조건 템플릿 불러오기</h3>
              <button type="button" className="ghost" onClick={() => setShowTemplates(false)}>×</button>
            </header>
            <div className="proj-rules-modal-body">
              <p className="helper-text">불러올 조건을 선택하세요. 프로젝트의 성격에 맞게 수정하여 적용할 수 있습니다.</p>
              <div className="proj-rules-template-list">
                {templateItems.map((item) => (
                  <button key={item.id} type="button" className="proj-rules-template-item" onClick={() => onSelectTemplate(item)}>
                    <div className="template-icon"><FileText /></div>
                    <div className="template-info">
                      <strong>{item.name}</strong>
                      <span>{item.data.target.targetType === "role" ? "참여자 대상" : "조직 대상"} | {metricLabel(item.data.condition.metric)}</span>
                    </div>
                    <ChevronRight className="mini-icon" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editing ? (
        <div className="proj-rules-modal-overlay">
          <div className="proj-rules-modal editor-modal">
            <header className="proj-rules-modal-head">
              <h3>조건 설정 및 수정</h3>
              <button type="button" className="ghost" onClick={() => { setEditing(null); setEditingId(null); }}>×</button>
            </header>
            <div className="proj-rules-modal-body">
              <div className="proj-rules-editor-grid">
                <label className="span-all">
                  <small>조건명</small>
                  <input
                    value={editing.ruleName}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, ruleName: e.target.value } : prev))}
                    placeholder="규칙 이름을 입력하세요"
                  />
                </label>
                <label>
                  <small>적용 시작일</small>
                  <input
                    type="date"
                    value={editing.effectiveFrom}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveFrom: e.target.value } : prev))}
                  />
                </label>
                <label>
                  <small>적용 종료일</small>
                  <input
                    type="date"
                    value={editing.effectiveTo}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveTo: e.target.value } : prev))}
                  />
                </label>
                <label>
                  <small>상태</small>
                  <select
                    value={editing.enabled ? "Y" : "N"}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, enabled: e.target.value === "Y" } : prev))}
                  >
                    <option value="Y">활성 (KPI 반영)</option>
                    <option value="N">비활성 (미반영)</option>
                  </select>
                </label>
                <label>
                  <small>기준값 ({metricLabel(editing.condition.metric)})</small>
                  <input
                    type="number"
                    value={editing.condition.value1}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, condition: { ...prev.condition, value1: Number(e.target.value) || 0 } } : prev
                      )
                    }
                  />
                </label>
                <label className="span-all">
                  <small>보상 정의 (정액 보상 기준)</small>
                  <div className="reward-input-row">
                    <span>₩</span>
                    <input
                      type="number"
                      value={editing.result.fixedAmount}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, result: { ...prev.result, fixedAmount: Number(e.target.value) || 0 } } : prev
                        )
                      }
                    />
                    <span>원 지급</span>
                  </div>
                </label>
              </div>
            </div>
            <footer className="proj-rules-modal-foot">
              <button type="button" className="ghost" onClick={() => { setEditing(null); setEditingId(null); }}>취소</button>
              <button type="button" className="primary" onClick={saveEditing}>프로젝트 규칙 저장</button>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProjectTabContent({ tab, project }: { tab: SubMenu; project: ProjectItem }) {
  if (tab === "participants_org") return <ParticipantsManagementPage projectId={project.id} projectName={project.name} />;
  if (tab === "rules") return <ProjectRulesTabEnhanced project={project} />;
  if (tab === "progress") return <ProjectProgressTab project={project} />;
  if (tab === "performance") return <ProjectPerformanceTab project={project} />;
  if (tab === "board") return <ProgramBoardPage />;
  if (tab === "basic") return <ProjectBasicInfoTab project={project} />;
  return (
    <section className="section-card proj-mgmt-related-content">
      <h3 className="panel-title">{PROJECT_TABS.find((t) => t.key === tab)?.label}</h3>
      <p className="helper-text">{TAB_SUMMARY[tab]}</p>
    </section>
  );
}

export function ProjectManagementPage() {
  const [subMenu, setSubMenu] = useState<SubMenu>("basic");
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [isDetailView, setIsDetailView] = useState(false);
  const selectedProject = PROJECTS.find((project) => project.id === selectedProjectId) ?? PROJECTS[0];
  const detailTabOrder: SubMenu[] = ["basic", "participants_org", "rules", "progress", "performance", "settlement", "evidence", "activity", "board"];

  const openDetail = (project: ProjectItem) => {
    setSelectedProjectId(project.id);
    setIsDetailView(true);
  };

  if (isDetailView) {
    return (
      <div className="proj-mgmt-page proj-mgmt-detail-compact">
        <div className="proj-breadcrumb">
          <span>프로젝트관리</span>
          <ChevronRight className="mini-icon" />
          <span>{selectedProject.name}</span>
          <ChevronRight className="mini-icon" />
          <span>{PROJECT_TABS.find(t => t.key === subMenu)?.label}</span>
        </div>

        <section className="section-card proj-mgmt-selected">
          <div className="perf-tabs proj-mgmt-tabs">
            {detailTabOrder.map((tabKey) => {
              const tab = PROJECT_TABS.find((item) => item.key === tabKey);
              if (!tab) return null;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={subMenu === tab.key ? "perf-tab active" : "perf-tab"}
                  onClick={() => setSubMenu(tab.key)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button type="button" className="ghost proj-mgmt-back-btn" onClick={() => setIsDetailView(false)}>
            <ArrowLeft className="mini-icon" />
            목록으로
          </button>
        </section>

        <ProjectTabContent tab={subMenu} project={selectedProject} />
      </div>
    );
  }

  return (
    <div className="proj-mgmt-page">
      <div className="proj-breadcrumb">
        <span>프로젝트관리</span>
        <ChevronRight className="mini-icon" />
        <span>프로젝트 목록</span>
      </div>

      <div className="page-head">
        <h1>프로젝트관리</h1>
        <p>프로젝트 목록에서 선택한 프로젝트의 상세 정보를 확인합니다.</p>
      </div>

      <div className="proj-mgmt-stats">
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon blue"><FolderOpen className="mini-icon" /></div><div><span>전체 프로젝트</span><strong>12개</strong></div></div>
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon green"><CheckCircle2 className="mini-icon" /></div><div><span>운영중</span><strong>7개</strong></div></div>
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon purple"><Clock3 className="mini-icon" /></div><div><span>준비중</span><strong>2개</strong></div></div>
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon orange"><Clock4 className="mini-icon" /></div><div><span>종료</span><strong>3개</strong></div></div>
      </div>

      <section className="section-card proj-mgmt-filter">
        <div className="proj-mgmt-filter-grid">
          <label>
            프로젝트명
            <div className="search-box proj-mgmt-search">
              <input placeholder="프로젝트 검색..." />
              <Search className="mini-icon" />
            </div>
          </label>
          <label>상태<select><option>전체</option></select></label>
          <label>PM<select><option>전체</option></select></label>
          <label>기간<input type="text" value="시작일 ~ 종료일" readOnly /></label>
          <div className="proj-mgmt-filter-actions">
            <button type="button" className="primary">검색</button>
            <button type="button" className="ghost">초기화</button>
            <button type="button" className="primary"><Plus className="mini-icon" /> 프로젝트 등록</button>
          </div>
        </div>
      </section>

      <div className="proj-mgmt-guide">
        <Info className="mini-icon blue" />
        <strong>프로젝트를 선택하면 상세 탭으로 이동합니다.</strong>
        <span>목록 행을 클릭하면 해당 프로젝트 상세 화면이 표시됩니다.</span>
      </div>

      <section className="section-card">
        <table className="project-table proj-mgmt-table">
          <thead>
            <tr>
              <th>프로젝트명</th>
              <th>유형</th>
              <th>기간</th>
              <th>상태</th>
              <th>PM</th>
              <th>진척율</th>
              <th>참여자</th>
              <th>수정일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((project) => (
              <tr key={project.id} className={project.id === selectedProjectId ? "selected" : undefined} onClick={() => openDetail(project)}>
                <td><strong>{project.name}</strong></td>
                <td>{project.type}</td>
                <td>{project.period}</td>
                <td><span className={statusClass(project.status)}>{statusLabel(project.status)}</span></td>
                <td>{project.pm}</td>
                <td><div className="proj-mgmt-progress-cell"><span>{project.progress}%</span><div className="bar"><i style={{ width: `${project.progress}%` }} /></div></div></td>
                <td>{project.participants}</td>
                <td>{project.updatedAt}</td>
                <td>
                  <div className="proj-mgmt-action-buttons">
                    <button type="button" className="proj-mgmt-action-btn" onClick={(e) => { e.stopPropagation(); openDetail(project); }}><Eye className="mini-icon" /></button>
                    <button type="button" className="proj-mgmt-action-btn" onClick={(e) => { e.stopPropagation(); openDetail(project); }}><Pencil className="mini-icon" /></button>
                    <button type="button" className="proj-mgmt-action-btn danger" onClick={(e) => { e.stopPropagation(); setSelectedProjectId(project.id); }}><Trash2 className="mini-icon" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ProjectProgressTab({ project }: { project: ProjectItem }) {
  const steps = [
    { id: 1, title: "리더 선발", period: "2026.01.01 ~ 2026.01.09", status: "완료", statusClass: "closed" },
    { id: 2, title: "팀장 구성", period: "2026.01.10 ~ 2026.01.23", status: "진행중", statusClass: "running" },
    { id: 3, title: "발대식 및 활동비 개시", period: "2026.01.24 ~ 2026.01.30", status: "예정", statusClass: "pending" },
    { id: 4, title: "주간 모임 운영", period: "2026.02.01 ~ 2026.11.30", status: "예정", statusClass: "pending" },
    { id: 5, title: "수련생 초대 달성", period: "2026.12.01 ~ 2026.12.15", status: "지연", statusClass: "delayed" },
    { id: 6, title: "선언식/최종 전환", period: "2026.12.16 ~ 2026.12.31", status: "예정", statusClass: "pending" },
  ];

  const currentStep = steps[1];

  return (
    <section className="basic-info-page proj-progress-tab">
      <section className="section-card basic-hero-card">
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className={statusClass(project.status)}>{statusLabel(project.status)}</span>
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><CalendarDays className="mini-icon" /></div>
            <div>
              <span>현재 단계</span>
              <strong>{currentStep.id}단계</strong>
              <small>{currentStep.title}</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><ClipboardList className="mini-icon" /></div>
            <div>
              <span>전체 단계 수</span>
              <strong>{steps.length}단계</strong>
              <small>(프로토콜 기준)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CheckCircle2 className="mini-icon" /></div>
            <div>
              <span>완료 단계</span>
              <strong>1단계</strong>
              <small>(승인 완료)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock4 className="mini-icon" /></div>
            <div>
              <span>지연 단계</span>
              <strong>1단계</strong>
              <small>(일정 초과)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="proj-progress-content">
        <div className="proj-progress-left">
          <section className="section-card timeline-card">
            <header className="card-header">
              <h3>절차 관리 / 단계 타임라인</h3>
            </header>
            <div className="vertical-timeline">
              {steps.map((step) => (
                <div key={step.id} className={`timeline-item ${step.statusClass}`}>
                  <div className="timeline-marker">
                    {step.status === "완료" ? <Check className="mini-icon" /> : <span>{step.id}</span>}
                  </div>
                  <div className="timeline-info">
                    <strong>{step.title}</strong>
                    <span>{step.period}</span>
                  </div>
                  <span className={`status-badge ${step.statusClass}`}>{step.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="proj-progress-right">
          <section className="section-card detail-card">
            <header className="card-header">
              <h3>현재 단계 상세</h3>
              <div className="header-actions">
                <button type="button" className="ghost mini-btn">완료요청</button>
                <button type="button" className="primary mini-btn">단계 승인</button>
              </div>
            </header>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>단계명</th>
                  <td>{currentStep.title}</td>
                </tr>
                <tr>
                  <th>목표/완료 기준</th>
                  <td>팀장을 구성하고 팀원 정보를 등록하여 승인 완료</td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td>한지은 매니저 (마케팅본부)</td>
                </tr>
                <tr>
                  <th>마감일</th>
                  <td>2026.01.23 (금)</td>
                </tr>
                <tr>
                  <th>진행률</th>
                  <td>
                    <div className="progress-row">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: "65%" }} />
                      </div>
                      <span className="percent">65%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section-card checklist-card">
            <header className="card-header">
              <h3>체크리스트</h3>
              <button type="button" className="ghost mini-btn">체크리스트 관리</button>
            </header>
            <div className="checklist-list">
              <label><input type="checkbox" defaultChecked /> 팀장 후보자 명단 제출</label>
              <label><input type="checkbox" defaultChecked /> 팀원 구성 및 역할 배정</label>
              <label><input type="checkbox" /> 팀 정보 시스템 등록</label>
              <label><input type="checkbox" /> 팀장 구성 완료 보고 및 승인 요청</label>
            </div>
          </section>
        </div>
      </div>

      <section className="section-card approval-table-card">
        <header className="card-header">
          <h3>단계별 승인 및 증빙 현황</h3>
          <button type="button" className="primary mini-btn">다음 단계 개방</button>
        </header>
        <div className="table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>단계</th>
                <th>증빙자료</th>
                <th>승인상태</th>
                <th>요청일</th>
                <th>승인자</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. 리더 선발</td>
                <td>리더 선발 명단.pdf <FileText className="inline-icon" /></td>
                <td><span className="status closed">승인완료</span></td>
                <td>2026.01.09</td>
                <td>이수진 팀장</td>
                <td>
                  <div className="btn-group">
                    <button type="button" className="ghost mini-btn">상세보기</button>
                  </div>
                </td>
              </tr>
              <tr className="active">
                <td>2. 팀장 구성</td>
                <td>팀 구성 계획서.pdf <FileText className="inline-icon" /></td>
                <td><span className="status running">승인요청</span></td>
                <td>2026.01.21</td>
                <td>-</td>
                <td>
                  <div className="btn-group">
                    <button type="button" className="ghost mini-btn">상세보기</button>
                    <button type="button" className="primary mini-btn">승인</button>
                  </div>
                </td>
              </tr>
              {steps.slice(2).map(s => (
                <tr key={s.id} className="dimmed">
                  <td>{s.id}. {s.title}</td>
                  <td>-</td>
                  <td><span className="status pending">대기</span></td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function ProjectPerformanceTab({ project }: { project: ProjectItem }) {
  const rankingData = [
    { rank: 1, name: "김민수", role: "PM", recruit: 412, sales: 942, achievement: 104.7, status: "우수", avatar: "https://i.pravatar.cc/150?u=1" },
    { rank: 2, name: "이지은", role: "간사", recruit: 326, sales: 783, achievement: 97.9, status: "우수", avatar: "https://i.pravatar.cc/150?u=2" },
    { rank: 3, name: "박준형", role: "프로젝트팀원", recruit: 298, sales: 657, achievement: 91.3, status: "우수", avatar: "https://i.pravatar.cc/150?u=3" },
    { rank: 4, name: "최유리", role: "프로젝트팀원", recruit: 221, sales: 484, achievement: 67.2, status: "보통", avatar: "https://i.pravatar.cc/150?u=4" },
    { rank: 5, name: "정현우", role: "프로젝트팀원", recruit: 198, sales: 412, achievement: 57.2, status: "보통", avatar: "https://i.pravatar.cc/150?u=5" },
  ];

  const recentApprovals = [
    { user: "김연우", action: "판매 실적 28세트", date: "2026-05-14 15:32" },
    { user: "영업1팀", action: "모집 실적 35명", date: "2026-05-14 14:21" },
    { user: "이수빈", action: "판매 실적 22세트", date: "2026-05-14 11:07" },
    { user: "정현우", action: "판매 실적 18세트", date: "2026-05-14 09:48" },
    { user: "박지호", action: "모집 실적 12명", date: "2026-05-14 09:15" },
  ];

  const roleStats = [
    { role: "PM", count: 8, record: "1,132세트", achievement: 94.3 },
    { role: "간사", count: 24, record: "1,028세트", achievement: 85.7 },
    { role: "프로젝트팀원", count: 96, record: "700세트", achievement: 72.2 },
  ];

  // Circular Progress Circle Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (project.progress / 100) * circumference;

  return (
    <div className="perf-tab-container">
      {/* 5 KPI Cards Row */}
      <div className="perf-stats-row">
        <div className="perf-stat-card">
          <div className="perf-stat-icon"><img src={kpiUsers} alt="" /></div>
          <div className="perf-stat-info">
            <span>총 참여자</span>
            <strong>128명</strong>
            <small>활성 116명</small>
          </div>
        </div>
        <div className="perf-stat-card">
          <div className="perf-stat-icon"><img src={kpiRecruit} alt="" /></div>
          <div className="perf-stat-info">
            <span>모집 실적</span>
            <strong>1,245명</strong>
            <small>목표 1,500명</small>
          </div>
        </div>
        <div className="perf-stat-card">
          <div className="perf-stat-icon"><img src={kpiSales} alt="" /></div>
          <div className="perf-stat-info">
            <span>판매 실적</span>
            <strong>2,860세트</strong>
            <small>목표 3,600세트</small>
          </div>
        </div>
        <div className="perf-stat-card">
          <div className="perf-stat-icon"><img src={kpiTarget} alt="" /></div>
          <div className="perf-stat-info">
            <span>목표 달성률</span>
            <strong>79.4%</strong>
            <div className="achieve-bar-bg" style={{ width: '60px', marginTop: '4px' }}>
              <div className="achieve-bar-fill" style={{ width: '79.4%' }} />
            </div>
          </div>
        </div>
        <div className="perf-stat-card">
          <div className="perf-stat-icon"><img src={kpiCrown} alt="" /></div>
          <div className="perf-stat-info">
            <span>이번 주 TOP 팀</span>
            <strong>영업1팀</strong>
            <small>판매 628세트</small>
          </div>
        </div>
      </div>

      {/* Notice Box */}
      <div className="perf-notice-box">
        <div className="notice-content">
          <Info className="mini-icon" />
          실적은 공개되며, 개인별 보상액은 보상/정산 메뉴에서 권한에 따라 별도로 관리됩니다.
        </div>
        <button type="button" className="ghost mini-btn">×</button>
      </div>

      {/* Main Content Layout */}
      <div className="perf-main-grid">
        <div className="perf-left-col">
          {/* Performance Board Table */}
          <section className="perf-board-card">
            <header className="perf-card-head">
              <h3>실적 공개 보드 <Info className="mini-icon" style={{ opacity: 0.4 }} /></h3>
            </header>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th className="rank-cell">순위</th>
                  <th>이름/역할</th>
                  <th>모집수</th>
                  <th>판매세트</th>
                  <th className="achievement-cell">달성률</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((item) => (
                  <tr key={item.rank}>
                    <td className="rank-cell">
                      {item.rank <= 3 ? (
                        <div className="rank-medal-wrap">
                          <span style={{ fontSize: '18px' }}>{item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}</span>
                        </div>
                      ) : (
                        item.rank
                      )}
                    </td>
                    <td>
                      <div className="user-cell">
                        <img src={item.avatar} alt="" className="user-avatar" />
                        <div className="user-info">
                          <strong>{item.name}</strong>
                          <small>{item.role}</small>
                        </div>
                      </div>
                    </td>
                    <td>{item.recruit}명</td>
                    <td>{item.sales}세트</td>
                    <td className="achievement-cell">
                      <div className="achieve-bar-wrap">
                        <span>{item.achievement}%</span>
                        <div className="achieve-bar-bg">
                          <div className="achieve-bar-fill" style={{ width: `${Math.min(item.achievement, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={item.status === "우수" ? "status-chip excel" : "status-chip normal"}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="view-all-btn">
              전체 순위 보기 <ChevronRight className="mini-icon" />
            </button>
          </section>

          {/* Bottom Grid: Trend & Activity */}
          <div className="perf-bottom-grid">
            <section className="perf-board-card">
              <header className="perf-card-head">
                <h3>실적 추이</h3>
                <div className="legend" style={{ fontSize: '11px', display: 'flex', gap: '8px', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }} /> 판매세트</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i style={{ width: '8px', height: '8px', border: '1px solid #2563eb', borderRadius: '50%' }} /> 달성률(%)</span>
                </div>
              </header>
              <img src={trendChart} alt="실적 추이 그래프" className="trend-img" />
            </section>

            <section className="perf-board-card">
              <header className="perf-card-head">
                <h3>최근 승인 실적</h3>
                <button type="button" className="ghost mini-btn" style={{ fontSize: '11px' }}>더보기 &gt;</button>
              </header>
              <div className="approval-list">
                {recentApprovals.map((item, idx) => (
                  <div key={idx} className="approval-item">
                    <div className="approval-icon"><CheckCircle2 className="mini-icon" /></div>
                    <div className="approval-text">
                      <p><b>{item.user}</b>님이 {item.action}를 등록했습니다.</p>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="perf-right-col">
          {/* Circular Progress Side Card */}
          <section className="perf-board-card">
            <header className="perf-card-head">
              <h3>프로젝트 진행률</h3>
            </header>
            <div className="circular-progress-wrap">
              <svg className="progress-circle-svg">
                <circle className="progress-circle-bg" cx="80" cy="80" r={radius} />
                <circle
                  className="progress-circle-fill"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="progress-text-overlay">
                <strong>{project.progress}%</strong>
                <span>달성</span>
              </div>
            </div>
            <div className="progress-stats-list">
              <div className="prog-stat-item"><label>판매 실적</label><b>2,860 / 3,600세트</b></div>
              <div className="prog-stat-item"><label>모집 실적</label><b>1,245 / 1,500명</b></div>
              <div className="prog-stat-item" style={{ borderTop: '1px solid #f8fafc', paddingTop: '10px', marginTop: '4px' }}>
                <label>남은 기간</label><b>61일</b>
              </div>
            </div>
          </section>

          {/* Role Summary Side Card */}
          <section className="perf-board-card">
            <header className="perf-card-head">
              <h3>역할별 실적 요약</h3>
            </header>
            <div className="role-summary-list">
              {roleStats.map((item) => (
                <div key={item.role} className="role-stat-item">
                  <div className="role-stat-head">
                    <span>{item.role} <b>{item.count}명</b></span>
                    <b>{item.record}</b>
                  </div>
                  <div className="role-bar-group">
                    <div className="role-bar-bg">
                      <div className="role-bar-fill" style={{ width: `${item.achievement}%` }} />
                    </div>
                    <span className="percent">{item.achievement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Performer Side Card */}
          <section className="perf-board-card">
            <header className="perf-card-head">
              <h3>TOP 성과자</h3>
            </header>
            <table className="top-performer-table">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '8px', fontSize: '11px', color: '#94a3b8' }}>구분</th>
                  <th style={{ textAlign: 'left', paddingBottom: '8px', fontSize: '11px', color: '#94a3b8' }}>이름</th>
                  <th style={{ textAlign: 'right', paddingBottom: '8px', fontSize: '11px', color: '#94a3b8' }}>기록</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="category-cell"><User className="mini-icon" /> 최다 판매</div></td>
                  <td className="performer-name">김민수</td>
                  <td className="performer-record">942세트</td>
                </tr>
                <tr>
                  <td><div className="category-cell"><Users className="mini-icon" /> 최다 모집</div></td>
                  <td className="performer-name">김민수</td>
                  <td className="performer-record">412명</td>
                </tr>
                <tr>
                  <td><div className="category-cell"><TrendingUp className="mini-icon" /> 최고 달성률</div></td>
                  <td className="performer-name">김민수</td>
                  <td className="performer-record">104.7%</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
