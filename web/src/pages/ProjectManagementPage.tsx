import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Clock4,
  Download,
  Eye,
  FileText,
  Files,
  Flag,
  Folder,
  FolderOpen,
  Gift,
  Info,
  Pencil,
  Percent,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  User,
  UserPlus,
  Users,
  Zap,
  CheckCircle,
  MoreVertical,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft
} from "lucide-react";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ParticipantsManagementPage } from "./ParticipantsManagementPage";
import { ProgramBoardPage } from "./ProgramBoardPage";
import { ProjectSettlementTab } from "./ProjectSettlementTab";
import { ProjectBulletinTab } from "./ProjectBulletinTab";
import { mockRule } from "../data/mockCondition";
import { loadSavedRules, saveRule, type SavedRuleItem, updateSavedRule, deleteSavedRule } from "../services/ruleStorage";
import type { RuleDraft } from "../types/rule";

// Performance Assets
import kpiCrown from "../assets/performance/kpi-crown.png";
import kpiRecruit from "../assets/performance/kpi-recruit.png";
import kpiSales from "../assets/performance/kpi-sales.png";
import kpiTarget from "../assets/performance/kpi-target.png";
import kpiUsers from "../assets/performance/kpi-users.png";
import trendChart from "../assets/performance/trend-card.png";
import bookIcon from "../assets/performance/book.png";

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
          <button type="button" className="primary-btn-premium" onClick={openEdit} disabled={!selectedRule}>조건수정</button>
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
            <button type="button" className="primary-btn-premium" onClick={saveEditing}>저장</button>
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
        name: "PM 시리즈 판매 보상",
        projectId: project.id,
        savedAt: "2026-05-14T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "PM 시리즈 판매 보상",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["PM"], orgScope: "direct_lower" },
          condition: { ...mockRule.condition, metric: "sales_count", value1: 3, operator: ">=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 50000 }
        }
      },
      {
        id: "sample-2",
        name: "경력자 모집 보상",
        projectId: project.id,
        savedAt: "2026-05-10T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "경력자 모집 보상",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["Admin"], orgScope: "all_lower" },
          condition: { ...mockRule.condition, metric: "lower_expert_count", value1: 5, operator: ">=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 80000 }
        }
      },
      {
        id: "sample-3",
        name: "준경력자 모집 보상",
        projectId: project.id,
        savedAt: "2026-05-05T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "준경력자 모집 보상",
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
    const loaded = loadSavedRules();
    const projectRules = loaded.filter(r => r.projectId === project.id);
    
    // Check if this project has already been initialized to prevent re-seeding after deletion
    const isInitialized = localStorage.getItem(`programmanager.init.${project.id}`);
    
    if (projectRules.length === 0 && !isInitialized) {
      let current = loaded;
      sampleRules.forEach(sr => {
        if (!current.find(c => c.name === sr.name && c.projectId === project.id)) {
          current = saveRule({ ...sr.data, projectId: project.id });
        }
      });
      localStorage.setItem(`programmanager.init.${project.id}`, "true");
      setSavedRules(current);
    } else {
      setSavedRules(loaded);
    }
  }, [project.id, sampleRules]);

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
    if (metric === "sales_count") return "시리즈 판매건수";
    if (metric === "lower_expert_count") return "경력자 모집건수";
    if (metric === "sales_set") return "준경력자 모집건수";
    if (metric === "lower_base_count") return "하위 거점 수";
    return "판매금액";
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

  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string }>({ show: false, id: "" });

  const resultSummary = (rule: RuleDraft) => {
    if (rule.result.rewardType === "fixed") return "조건 충족 시 보상 지급";
    if (rule.result.rewardType === "rate") return "조건 충족 시 비율 지급";
    return "조건 충족 시 혼합 보상 지급";
  };

  const handleToggleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const target = savedRules.find(r => r.id === id);
    if (!target) return;
    const next = updateSavedRule(id, { ...target.data, enabled: !target.data.enabled });
    setSavedRules(next);
    setNotice(`${!target.data.enabled ? '활성' : '비활성'} 상태로 변경되었습니다.`);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    // alert("삭제 버튼이 클릭되었습니다. ID: " + id); // 임시 확인용 alert (작동 확인용)
    setDeleteModal({ show: true, id });
  };

  const confirmDelete = () => {
    const next = deleteSavedRule(deleteModal.id);
    setSavedRules(next);
    setDeleteModal({ show: false, id: "" });
    setNotice("조건이 프로젝트에서 삭제되었습니다.");
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
    setEditingId(null);
    setEditing({
      ...item.data,
      projectId: project.id,
      ruleName: item.name,
      enabled: true // Default to enabled when loading template
    });
    setShowTemplates(false);
  };

  const onValidate = () => {
    setNotice("규칙의 유효성 및 충돌 검증이 완료되었습니다.");
  };

  const saveEditing = () => {
    if (!editing) return;
    if (editingId) {
      const next = updateSavedRule(editingId, editing);
      setSavedRules(next);
      setNotice("규칙이 수정되었습니다.");
    } else {
      const next = saveRule(editing);
      setSavedRules(next);
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
                <button 
                  type="button" 
                  className="primary-btn-premium" 
                  onClick={openAdd}
                >
                  <Plus size={16} /> 조건 추가
                </button>
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
                        <strong>{item.name}</strong>
                        <div className="proj-rules-item-actions">
                          <div 
                            className={item.data.enabled ? "premium-toggle active" : "premium-toggle"}
                            onClick={(e) => handleToggleStatus(e, item.id)}
                            title={item.data.enabled ? "비활성화" : "활성화"}
                          >
                            <div className="toggle-handle"></div>
                            <span className="toggle-label">{item.data.enabled ? "활성" : "비활성"}</span>
                          </div>
                          <button 
                            className="premium-delete-icon-btn"
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
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
                  <strong>조건 추가</strong>
                  <span>새 조건을 등록합니다.</span>
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


      {deleteModal.show && (
        <ConfirmModal
          title="조건 삭제 확인"
          message="선택한 조건을 프로젝트에서 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
          confirmLabel="삭제하기"
          cancelLabel="취소"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ show: false, id: "" })}
          type="danger"
        />
      )}

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
              <button type="button" className="primary-btn-premium" onClick={saveEditing}>프로젝트 규칙 저장</button>
            </footer>
          </div>
        </div>
      ) : null}

      {deleteModal.show && (
        <ConfirmModal
          isOpen={deleteModal.show}
          title="조건 삭제 확인"
          message="선택한 조건을 프로젝트에서 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ show: false, id: "" })}
        />
      )}
    </section>
  );
}

function ProjectTabContent({ tab, project }: { tab: SubMenu; project: ProjectItem }) {
  if (tab === "participants_org") return <ParticipantsManagementPage projectId={project.id} projectName={project.name} />;
  if (tab === "rules") return <ProjectRulesTabEnhanced project={project} />;
  if (tab === "progress") return <ProjectProgressTab project={project} />;
  if (tab === "performance") return <ProjectPerformanceTab project={project} />;
  if (tab === "settlement") return <ProjectSettlementTab project={project} />;
  if (tab === "evidence") return <ProjectEvidenceTab project={project} />;
  if (tab === "activity") return <ProjectActivityLogTab project={project} />;
  if (tab === "board") return <ProjectBulletinTab project={project} />;
  if (tab === "basic") return <ProjectBasicInfoTab project={project} />;
  return (
    <section className="section-card proj-mgmt-related-content">
      <h3 className="panel-title">{PROJECT_TABS.find((t) => t.key === tab)?.label}</h3>
      <p className="helper-text">{TAB_SUMMARY[tab]}</p>
    </section>
  );
}

function ProjectActivityLogTab({ project }: { project: ProjectItem }) {
  const [logs] = useState([
    { id: 1, date: "2026.05.14 15:42:18", user: "김지훈 (PM)", type: "참여자 등록", detail: "협력사 '책마을(주)' 참여자 5명 등록", menu: "참여자/조직", result: "성공" },
    { id: 2, date: "2026.05.14 15:30:02", user: "이수빈 (매니저)", type: "실적 승인", detail: "참여자 '홍길동' 4월 실적 승인", menu: "실적", result: "성공" },
    { id: 3, date: "2026.05.14 14:58:31", user: "이수빈 (매니저)", type: "조건 수정", detail: "1단계 목표 판매액을 500백만원 -> 550백만원으로 수정", menu: "조건/보상규칙", result: "성공" },
    { id: 4, date: "2026.05.14 14:12:07", user: "박현우 (운영자)", type: "증빙자료 업로드", detail: "참여자 '정소연' 4월 증빙자료 3건 업로드", menu: "증빙자료", result: "성공" },
    { id: 5, date: "2026.05.14 13:45:20", user: "김지훈 (PM)", type: "게시판 공지 등록", detail: "공지사항 '5월 프로모션 안내' 게시", menu: "게시판", result: "성공" },
    { id: 6, date: "2026.05.14 11:20:11", user: "이수빈 (매니저)", type: "단계 승인", detail: "참여자 '홍길동' 1단계(진행 중) 승인", menu: "진행관리", result: "성공" },
    { id: 7, date: "2026.05.14 10:05:44", user: "박현우 (운영자)", type: "조건 수정", detail: "2단계 추가 보상률을 10% -> 12%로 수정", menu: "조건/보상규칙", result: "성공" },
    { id: 8, date: "2026.05.14 09:33:27", user: "이수빈 (매니저)", type: "실적 승인", detail: "참여자 '김유나' 4월 실적 승인", menu: "실적", result: "성공" },
    { id: 9, date: "2026.05.14 09:10:55", user: "박현우 (운영자)", type: "참여자 등록", detail: "참여자 '최민수' 등록", menu: "참여자/조직", result: "성공" },
    { id: 10, date: "2026.05.14 08:52:13", user: "김지훈 (PM)", type: "증빙자료 업로드", detail: "참여자 '이영희' 3월 증빙자료 2건 업로드", menu: "증빙자료", result: "성공" },
    { id: 11, date: "2026.05.14 08:30:15", user: "박현우 (운영자)", type: "단계 승인", detail: "참여자 '박서준' 2단계 완료 승인", menu: "진행관리", result: "성공" },
    { id: 12, date: "2026.05.14 08:15:42", user: "이수빈 (매니저)", type: "게시판 공지 등록", detail: "긴급공지 '정산 일정 변경 안내' 게시", menu: "게시판", result: "성공" },
  ]);

  const stats = [
    { label: "실적 승인", count: 412, percent: 32.8, color: "#3b82f6" },
    { label: "조건 수정", count: 286, percent: 22.8, color: "#10b981" },
    { label: "참여자 등록", count: 214, percent: 17.0, color: "#8b5cf6" },
    { label: "증빙자료 업로드", count: 168, percent: 13.4, color: "#f59e0b" },
    { label: "게시판 공지 등록", count: 96, percent: 7.6, color: "#06b6d4" },
    { label: "단계 승인", count: 80, percent: 6.4, color: "#ec4899" },
  ];

  return (
    <div className="activity-tab-container">
      <section className="section-card basic-hero-card" style={{ marginBottom: '24px' }}>
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className="status running">운영중</span>
            <strong>PM 김지훈</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><FileText className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '12px' }}>총 로그 수</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>1,256건</strong>
              <small style={{ fontSize: '10px', color: '#94a3b8' }}>전체 기간 누적</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CalendarDays className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '14px' }}>오늘 활동</span>
              <strong style={{ fontSize: '26px', display: 'block', margin: '4px 0' }}>24건</strong>
              <small style={{ fontSize: '12px' }}>2026.05.14 기준</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><CheckCircle2 className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '14px' }}>승인 이벤트</span>
              <strong style={{ fontSize: '26px', display: 'block', margin: '4px 0' }}>158건</strong>
              <small style={{ fontSize: '12px' }}>전체 기간 누적</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><RefreshCcw className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '14px' }}>변경 이력</span>
              <strong style={{ fontSize: '26px', display: 'block', margin: '4px 0' }}>386건</strong>
              <small style={{ fontSize: '12px' }}>전체 기간 누적</small>
            </div>
          </div>
        </div>
      </section>

      <div className="activity-main-grid">
        <div className="activity-left-col">
          <section className="section-card">
            <header className="table-header">
              <div className="header-left">
                <h3>활동 로그</h3>
              </div>
              <div className="header-right">
                <button type="button" className="evidence-outline-btn" style={{ height: '34px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={16} /> 내보내기</button>
                <button type="button" className="ghost mini-btn" style={{ width: '34px', height: '34px', padding: 0, border: '1px solid #dfe6f3', borderRadius: '6px' }}><RefreshCcw size={16} /></button>
              </div>
            </header>

            <table className="activity-table-std" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '150px' }}>일시</th>
                  <th className="text-center" style={{ width: '120px' }}>사용자</th>
                  <th className="text-center" style={{ width: '120px' }}>활동유형</th>
                  <th className="text-center">상세내용</th>
                  <th className="text-center" style={{ width: '120px' }}>관련 메뉴</th>
                  <th className="text-center" style={{ width: '80px' }}>결과</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="text-center-force gray-text">{log.date}</td>
                    <td className="text-center-force font-600">{log.user}</td>
                    <td className="text-center-force">{log.type}</td>
                    <td className="text-left">{log.detail}</td>
                    <td className="text-center-force">{log.menu}</td>
                    <td className="text-center-force">
                      <span className="status-badge-mini green">{log.result}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-wrap-std">
              <div className="pagination-left">
                <span className="total-count">전체 1,256건</span>
                <select className="form-select sm" style={{ width: '90px' }}>
                  <option>12개씩</option>
                  <option>50개씩</option>
                  <option>100개씩</option>
                </select>
              </div>
              <div className="page-numbers-std">
                <button type="button" className="page-btn-sq"><ChevronsLeft size={14} /></button>
                <button type="button" className="page-btn-sq"><ChevronLeft size={14} /></button>
                <button type="button" className="page-btn-sq active">1</button>
                <button type="button" className="page-btn-sq">2</button>
                <button type="button" className="page-btn-sq">3</button>
                <button type="button" className="page-btn-sq">4</button>
                <button type="button" className="page-btn-sq">5</button>
                <button type="button" className="page-btn-sq"><ChevronRight size={14} /></button>
                <button type="button" className="page-btn-sq"><ChevronsRight size={14} /></button>
              </div>
            </div>
          </section>
        </div>

        <div className="activity-right-col">
          <section className="section-card">
            <header className="side-card-header">
              <h3>활동유형 분포</h3>
              <button type="button" className="text-btn">자세히 보기</button>
            </header>
            <div className="dist-list">
              {stats.map((stat, idx) => (
                <div key={idx} className="dist-item-row">
                  <span className="dist-label">{stat.label}</span>
                  <div className="dist-bar-container">
                    <div className="dist-bar-fill" style={{ width: `${stat.percent}%`, background: stat.color }} />
                  </div>
                  <div className="dist-values-inline">
                    <strong>{stat.count}건</strong>
                    <span className="percent">({stat.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card">
            <header className="side-card-header">
              <h3>필터</h3>
              <button type="button" className="ghost mini-btn" style={{ border: '1px solid #dfe6f3', borderRadius: '6px', height: '30px', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCcw size={14} /> 초기화</button>
            </header>
            <div className="filter-grid-2col">
              <div className="filter-group full">
                <label>기간</label>
                <div className="date-range-iconic">
                  <div className="date-input-wrap">
                    <input type="text" value="2026.04.14" readOnly />
                    <Calendar size={14} className="input-icon" />
                  </div>
                  <span>~</span>
                  <div className="date-input-wrap">
                    <input type="text" value="2026.05.14" readOnly />
                    <Calendar size={14} className="input-icon" />
                  </div>
                </div>
              </div>
              <div className="filter-group">
                <label>사용자</label>
                <select className="form-select sm"><option>전체 사용자</option></select>
              </div>
              <div className="filter-group">
                <label>관련 메뉴</label>
                <select className="form-select sm"><option>전체 메뉴</option></select>
              </div>
              <div className="filter-group">
                <label>활동유형</label>
                <select className="form-select sm"><option>전체 활동유형</option></select>
              </div>
              <div className="filter-group">
                <label>결과</label>
                <select className="form-select sm"><option>전체 결과</option></select>
              </div>
              <div className="filter-actions-row">
                <button type="button" className="primary-btn-sm full"><Search size={14} /> 필터 적용</button>
                <button type="button" className="outline-btn-sm full">필터 해제</button>
              </div>
            </div>
          </section>

          <section className="section-card guide-card">
            <header className="side-card-header">
              <h3>감사 메모 <Info size={16} /></h3>
            </header>
            <ul className="audit-guide-list">
              <li>모든 변경 및 승인 이력은 자동으로 기록되며, 삭제할 수 없습니다.</li>
              <li>로그 보관 기간: 5년 (2026.01.01 ~ 2031.12.31)</li>
              <li>개인정보가 포함된 로그는 보안 정책에 따라 암호화되어 보관됩니다.</li>
              <li>로그 내보내기는 엑셀(.xlsx) 형식으로 제공됩니다.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
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
          <span className="breadcrumb-link" onClick={() => setIsDetailView(false)}>프로젝트관리</span>
          <ChevronRight className="mini-icon" />
          <span className="breadcrumb-link" onClick={() => setSubMenu("basic")}>{selectedProject.name}</span>
          <ChevronRight className="mini-icon" />
          <span>{PROJECT_TABS.find(t => t.key === subMenu)?.label}</span>
        </div>

        <section className="section-card proj-mgmt-selected" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', gap: '20px' }}>
          <div className="perf-tabs proj-mgmt-tabs" style={{ display: 'flex', flex: 1, gap: '4px', borderBottom: 0, marginBottom: 0, overflowX: 'auto' }}>
            {detailTabOrder.map((tabKey) => {
              const tab = PROJECT_TABS.find((item) => item.key === tabKey);
              if (!tab) return null;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={subMenu === tab.key ? "perf-tab active" : "perf-tab"}
                  onClick={() => setSubMenu(tab.key)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button 
            type="button" 
            className="ghost proj-mgmt-back-btn" 
            onClick={() => setIsDetailView(false)}
            style={{ flexShrink: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #dfe6f3', borderRadius: '6px', background: '#fff', fontSize: '13px', cursor: 'pointer' }}
          >
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
      <style>{`
        .proj-mgmt-table th {
          text-align: center !important;
        }
        .proj-mgmt-table td {
          text-align: left !important;
        }
      `}</style>
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
            <button type="button" className="primary-btn-premium">검색</button>
            <button type="button" className="ghost">초기화</button>
            <button type="button" className="primary-btn-premium"><Plus className="mini-icon" /> 프로젝트 등록</button>
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
              <th className="text-center">프로젝트명</th>
              <th className="text-center">유형</th>
              <th className="text-center">기간</th>
              <th className="text-center">상태</th>
              <th className="text-center">PM</th>
              <th className="text-center">진척율</th>
              <th className="text-center">참여자</th>
              <th className="text-center">수정일</th>
              <th className="text-center">액션</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((project) => (
              <tr key={project.id} className={project.id === selectedProjectId ? "selected" : undefined} onClick={() => openDetail(project)}>
                <td className="text-center"><strong>{project.name}</strong></td>
                <td className="text-center">{project.type}</td>
                <td className="text-center">{project.period}</td>
                <td className="text-center"><span className={statusClass(project.status)}>{statusLabel(project.status)}</span></td>
                <td className="text-center">{project.pm}</td>
                <td className="text-center"><div className="proj-mgmt-progress-cell"><span>{project.progress}%</span><div className="bar"><i style={{ width: `${project.progress}%` }} /></div></div></td>
                <td className="text-center">{project.participants}</td>
                <td className="text-center">{project.updatedAt}</td>
                <td className="text-center">
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
  const [steps, setSteps] = useState([
    { id: 1, title: "리더 선발", period: "2026.01.01 ~ 2026.01.09", status: "완료", statusClass: "closed" },
    { id: 2, title: "팀장 구성", period: "2026.01.10 ~ 2026.01.23", status: "진행중", statusClass: "running" },
    { id: 3, title: "발대식 및 활동비 개시", period: "2026.01.24 ~ 2026.01.30", status: "예정", statusClass: "pending" },
    { id: 4, title: "주간 모임 운영", period: "2026.02.01 ~ 2026.11.30", status: "예정", statusClass: "pending" },
    { id: 5, title: "수련생 초대 달성", period: "2026.12.01 ~ 2026.12.15", status: "지연", statusClass: "delayed" },
    { id: 6, title: "선언식/최종 전환", period: "2026.12.16 ~ 2026.12.31", status: "예정", statusClass: "pending" },
    { id: 7, title: "결과 보고 및 회고", period: "2027.01.01 ~ 2027.01.15", status: "예정", statusClass: "pending" },
    { id: 8, title: "프로젝트 최종 마감", period: "2027.01.16 ~ 2027.01.31", status: "예정", statusClass: "pending" },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const currentStep = steps.find(s => s.status === "진행중") || steps[0];

  const handleAddStep = () => {
    const nextId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: nextId, title: `신규 단계 ${nextId}`, period: "2027.01.01 ~ 2027.01.31", status: "예정", statusClass: "pending" }]);
  };

  const handleEditClick = (step: any) => {
    setEditingStep({ ...step });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingStep) {
      setSteps(steps.map(s => s.id === editingStep.id ? editingStep : s));
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId !== null) {
      setSteps(steps.filter(s => s.id !== deletingId));
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <section className="basic-info-page proj-progress-tab compact-mode">
      {/* Edit Modal Implementation */}
      {isEditModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3>단계 정보 수정</h3>
            <div className="form-group">
              <label>단계명</label>
              <input 
                type="text" 
                value={editingStep.title} 
                onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>기간</label>
              <input 
                type="text" 
                value={editingStep.period} 
                onChange={(e) => setEditingStep({ ...editingStep, period: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>상태</label>
              <select 
                value={editingStep.status} 
                onChange={(e) => {
                  const status = e.target.value;
                  const statusClass = status === "완료" ? "closed" : status === "진행중" ? "running" : status === "지연" ? "delayed" : "pending";
                  setEditingStep({ ...editingStep, status, statusClass });
                }}
              >
                <option value="완료">완료</option>
                <option value="진행중">진행중</option>
                <option value="지연">지연</option>
                <option value="예정">예정</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost" onClick={() => setIsEditModalOpen(false)}>취소</button>
              <button type="button" className="primary" onClick={handleSaveEdit}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="단계 삭제 확인"
        message="정말로 이 단계를 삭제하시겠습니까? 삭제된 정보는 복구할 수 없습니다."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

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
              <strong>{steps.filter(s => s.status === "완료").length}단계</strong>
              <small>(승인 완료)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock4 className="mini-icon" /></div>
            <div>
              <span>지연 단계</span>
              <strong>{steps.filter(s => s.status === "지연").length}단계</strong>
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
              <button type="button" className="primary mini-btn" onClick={handleAddStep}>
                <Plus size={14} /> 단계 추가
              </button>
            </header>
            <div className="table-wrapper">
              <table className="project-table excel-table-view timeline-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: '50px' }}>구분</th>
                    <th className="text-center">단계명</th>
                    <th className="text-center">기간</th>
                    <th className="text-center" style={{ width: '80px' }}>상태</th>
                    <th className="text-center" style={{ width: '80px' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step) => (
                    <tr key={step.id} className={step.statusClass}>
                      <td className="text-center">
                        <div className={`timeline-marker-mini ${step.statusClass}`}>
                          {step.status === "완료" ? <Check size={12} /> : step.id}
                        </div>
                      </td>
                      <td className="text-left font-bold">{step.title}</td>
                      <td className="text-center text-gray">{step.period}</td>
                      <td className="text-center">
                        <span className={`status-badge ${step.statusClass}`}>{step.status}</span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" style={{ justifyContent: 'center', gap: '0', display: 'flex' }}>
                          <button 
                            type="button" 
                            className="text-btn mini" 
                            style={{ padding: '0 2px', minWidth: 'auto' }}
                            onClick={() => handleEditClick(step)}
                            title="수정"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="text-btn danger mini" 
                            style={{ padding: '0 2px', minWidth: 'auto' }}
                            onClick={() => handleDeleteClick(step.id)}
                            title="삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="proj-progress-right detail-col">
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
          <table className="project-table excel-table-view">
            <thead>
              <tr>
                <th className="text-center">단계</th>
                <th className="text-center">증빙자료</th>
                <th className="text-center">승인상태</th>
                <th className="text-center">요청일</th>
                <th className="text-center">승인자</th>
                <th className="text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. 리더 선발</td>
                <td>리더 선발 명단.pdf <FileText className="inline-icon" /></td>
                <td className="text-center"><span className="status closed">승인완료</span></td>
                <td className="text-center">2026.01.09</td>
                <td className="text-center">이수진 팀장</td>
                <td>
                  <div className="btn-group">
                    <button type="button" className="ghost mini-btn">상세보기</button>
                  </div>
                </td>
              </tr>
              <tr className="active">
                <td>2. 팀장 구성</td>
                <td>팀 구성 계획서.pdf <FileText className="inline-icon" /></td>
                <td className="text-center"><span className="status running">승인요청</span></td>
                <td className="text-center">2026.01.21</td>
                <td className="text-center">-</td>
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
                  <td className="text-center">-</td>
                  <td className="text-center"><span className="status pending">대기</span></td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
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
      {/* Performance Header Mockup Matching */}
      <section className="section-card basic-hero-card" style={{ marginBottom: '20px' }}>
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className="status running">운영중</span>
            <strong>PM 김지훈</strong>
          </div>
        </div>

        <div className="perf-stats-row" style={{ marginTop: '20px', marginBottom: '0' }}>
          <div className="perf-stat-card">
            <div className="basic-icon blue"><Users className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>총 참여자</span>
              <strong>128명</strong>
              <small>활성 116명</small>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon purple"><UserPlus className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>모집 실적</span>
              <strong>1,245명</strong>
              <small>목표 1,500명</small>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon blue"><ShoppingCart className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>판매 실적</span>
              <strong>2,860세트</strong>
              <small>목표 3,600세트</small>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon green"><Target className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>목표 달성률</span>
              <strong>79.4%</strong>
              <div className="achieve-bar-bg" style={{ width: '60px', marginTop: '4px' }}>
                <div className="achieve-bar-fill" style={{ width: '79.4%' }} />
              </div>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon orange"><Trophy className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>이번 주 TOP 팀</span>
              <strong>영업1팀</strong>
              <small>판매 628세트</small>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Box */}

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

function ProjectEvidenceTab({ project }: { project: ProjectItem }) {
  const [evidenceList, setEvidenceList] = useState([
    { id: 1, name: "발대식 참석명단_20260101", type: "참석명단", step: "1단계 (진행중)", uploader: "홍길동 (영업기획팀)", date: "2026.01.01 11:24", status: "approved" },
    { id: 2, name: "발대식 현장사진", type: "사진자료", step: "1단계 (진행중)", uploader: "홍길동 (영업기획팀)", date: "2026.01.01 11:28", status: "approved" },
    { id: 3, name: "1주차 주간모임 회의록", type: "회의록", step: "1단계 (진행중)", uploader: "김수연 (영업기획팀)", date: "2026.01.08 14:35", status: "review" },
    { id: 4, name: "판매실적 증빙_1주차", type: "판매실적", step: "1단계 (진행중)", uploader: "김수연 (영업기획팀)", date: "2026.01.08 14:40", status: "review" },
    { id: 5, name: "매장 디스플레이 사진_1주차", type: "사진자료", step: "1단계 (진행중)", uploader: "이영희 (영업기획팀)", date: "2026.01.09 10:12", status: "approved" },
    { id: 6, name: "2주차 주간모임 회의록", type: "회의록", step: "2단계 (예정)", uploader: "박지훈 (영업기획팀)", date: "2026.01.15 16:05", status: "pending" },
    { id: 7, name: "판매실적 증빙_2주차", type: "판매실적", step: "2단계 (예정)", uploader: "박지훈 (영업기획팀)", date: "2026.01.15 16:08", status: "pending" },
    { id: 8, name: "프로모션 홍보물 이미지", type: "기타", step: "3단계 (예정)", uploader: "최은지 (영업기획팀)", date: "2026.01.16 09:22", status: "pending" },
  ]);

  const handleDelete = (id: number) => {
    if (window.confirm("해당 증빙자료를 삭제하시겠습니까?")) {
      setEvidenceList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleView = (name: string) => {
    alert(`${name} 자료를 조회합니다.`);
  };

  const typeStats = [
    { type: "판매실적", count: 28, percent: 32.2 },
    { type: "사진자료", count: 22, percent: 25.3 },
    { type: "회의록", count: 14, percent: 16.1 },
    { type: "참석명단", count: 10, percent: 11.5 },
    { type: "기타", count: 13, percent: 14.9 },
  ];

  return (
    <div className="evidence-tab-container">
      <section className="section-card basic-hero-card" style={{ marginBottom: '24px' }}>
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className="status running">운영중</span>
            <strong>PM 김지훈</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><Files className="mini-icon" /></div>
            <div>
               <span>전체 자료 수</span>
               <strong>87건</strong>
               <small>(전체 기간 누적)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CheckCircle className="mini-icon" /></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '12px' }}>승인완료 자료</span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>66.7%</span>
              </div>
              <strong style={{ fontSize: '20px', display: 'block' }}>58건</strong>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock3 className="mini-icon" /></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '12px' }}>검토중 자료</span>
                <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 700 }}>24.1%</span>
              </div>
              <strong style={{ fontSize: '20px', display: 'block' }}>21건</strong>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><Folder className="mini-icon" /></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '12px' }}>미분류 자료</span>
                <span style={{ fontSize: '11px', color: '#9333ea', fontWeight: 700 }}>9.2%</span>
              </div>
              <strong style={{ fontSize: '20px', display: 'block' }}>8건</strong>
              <small>(분류 필요)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="evidence-main-layout">
        <div className="evidence-left-col">
          <section className="section-card">
            <header className="evidence-list-header">
              <h3>증빙자료 목록</h3>
              <div className="evidence-header-actions">
                <button type="button" className="primary-btn-premium"><Plus size={16} /> 자료 업로드</button>
                <button type="button" className="evidence-outline-btn"><Download size={16} /> 일괄 다운로드</button>
                <button type="button" className="evidence-outline-btn"><RefreshCcw size={16} /> 승인 요청</button>
              </div>
            </header>

            <div className="evidence-filters">
              <select className="form-select"><option>전체 단계</option></select>
              <select className="form-select"><option>전체 유형</option></select>
              <select className="form-select"><option>전체 상태</option></select>
              <div className="search-box">
                <input type="text" placeholder="자료명 검색" />
                <Search size={16} />
              </div>
              <button type="button" className="reset-btn">초기화</button>
            </div>

            <table className="evidence-table">
              <thead>
                <tr>
                  <th>자료명</th>
                  <th>자료유형</th>
                  <th>연결 단계</th>
                  <th>업로드자</th>
                  <th>업로드일</th>
                  <th>승인상태</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((item) => (
                  <tr key={item.id}>
                    <td className="evidence-name-cell" style={{ textAlign: 'left !important' }}>
                      <FileText size={16} className="file-icon" />
                      {item.name}
                    </td>
                    <td className="text-left">{item.type}</td>
                    <td className="text-left">
                      <div className="two-line-cell" style={{ alignItems: 'flex-start' }}>
                        <span className="first-line">{item.step.split(' ')[0]}</span>
                        <small className="second-line blue">{item.step.split(' ')[1]}</small>
                      </div>
                    </td>
                    <td className="text-left">
                      <div className="two-line-cell" style={{ alignItems: 'flex-start' }}>
                        <span className="first-line">{item.uploader.split(' ')[0]}</span>
                        <small className="second-line gray">{item.uploader.split(' ')[1]}</small>
                      </div>
                    </td>
                    <td className="text-center-force">
                      <div className="two-line-cell" style={{ alignItems: 'center' }}>
                        <span className="first-line">{item.date.split(' ')[0]}</span>
                        <small className="second-line gray">{item.date.split(' ')[1]}</small>
                      </div>
                    </td>
                    <td className="text-center-force">
                      <span className={`status-capsule ${item.status}`}>
                        {item.status === 'approved' ? '승인완료' : item.status === 'review' ? '검토중' : '미분류'}
                      </span>
                    </td>
                    <td className="text-center-force">
                      <div className="btn-group" style={{ justifyContent: 'center' }}>
                        <button type="button" className="proj-mgmt-action-btn" onClick={() => handleView(item.name)}><Eye className="mini-icon" /></button>
                        <button type="button" className="proj-mgmt-action-btn danger" onClick={() => handleDelete(item.id)}><Trash2 className="mini-icon" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-wrap">
              <div className="page-numbers">
                <button type="button" className="page-btn active">1</button>
                <button type="button" className="page-btn">2</button>
                <button type="button" className="page-btn">3</button>
                <button type="button" className="page-btn">4</button>
                <button type="button" className="page-btn">5</button>
                <ChevronRight size={16} />
              </div>
              <select className="form-select mini">
                <option>10개씩 보기</option>
              </select>
            </div>
          </section>
        </div>

        <div className="evidence-right-col">
          <section className="section-card">
            <header className="side-card-header">
              <h3>자료 유형별 현황</h3>
              <button type="button" className="text-btn">자세히 보기</button>
            </header>
            <div className="type-stats-list">
              {typeStats.map(stat => (
                <div key={stat.type} className="type-stat-item">
                  <div className="stat-label-row">
                    <label>{stat.type}</label>
                    <div className="stat-values">
                      <strong>{stat.count}건</strong>
                      <span>({stat.percent}%)</span>
                    </div>
                  </div>
                  <div className="type-progress-bg">
                    <div className="type-progress-fill" style={{ width: `${stat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card">
            <header className="side-card-header">
              <h3>최근 업로드 자료</h3>
              <button type="button" className="text-btn">자세히 보기</button>
            </header>
            <div className="recent-files-list">
              {evidenceList.slice(0, 5).map(file => (
                <div key={file.id} className="recent-file-item">
                  <FileText size={16} className="file-icon" />
                  <div className="file-info">
                    <strong>{file.name}</strong>
                    <div className="file-meta">
                      <span>{file.uploader.split(' ')[0]}</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card guide-card">
            <header className="side-card-header">
              <h3>업로드 가이드</h3>
            </header>
            <ul className="guide-list">
              <li>허용 파일 형식: PDF, JPG, JPEG, PNG, XLS, XLSX, DOC, DOCX, PPT, PPTX (파일당 최대 50MB)</li>
              <li>파일명 규칙: [단계]_[유형]_[내용]_[날짜] 형식 권장</li>
              <li>필수 증빙 안내:
                <ul>
                  <li>1단계: 발대식 참석명단, 주간모임 회의록, 판매실적 증빙, 사진자료</li>
                  <li>2단계: 판매실적 증빙, 매장 디스플레이 사진, 프로모션 반응 설문</li>
                  <li>3단계: 최종 실적 보고서, 결산 증빙, 우수사례 자료</li>
                </ul>
              </li>
              <li>승인이 완료된 자료는 수정이 불가능합니다.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

