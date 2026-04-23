import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ClipboardList,
  CircleDollarSign,
  CalendarDays,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
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
  MoreVertical,
  Pencil,
  Percent,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Search,
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
  { key: "participants_org", label: "참여자/조직관리" },
  { key: "rules", label: "규칙/조건설정" },
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
    participants: 128,
    updatedAt: "2026-01-21"
  },
  {
    id: "PRJ-2026-0002",
    name: "鴗炣𢲡 ?�� ?國� ?��?𠺝䂻",
    type: "儠属�鼽?穈嶅�",
    period: "2026.02.01 ~ 2026.08.31",
    status: "preparing",
    pm: "?渥�鴔?,"
    progress: 15,
    participants: 12,
    updatedAt: "2026.01.20"
  },
  {
    id: "PRJ-2026-0003",
    name: "黕�𢲡 ?𡥄�篣??軤𠽌?刮�鴔� 儥𡥄�??,"
    type: "?韒坐 ?��판매�",
    period: "2026.03.01 ~ 2026.06.30",
    status: "running",
    pm: "諻瑅???,"
    progress: 62,
    participants: 84,
    updatedAt: "2026.01.19"
  },
  {
    id: "PRJ-2026-0004",
    name: "?禺�諻拗� ?��麇𣕑旭鴔� ?渥�",
    type: "?渥� ?��?𠺝䂻",
    period: "2026.06.15 ~ 2026.08.31",
    status: "preparing",
    pm: "黖𨰰�謔?,"
    progress: 8,
    participants: 31,
    updatedAt: "2026.01.18"
  },
  {
    id: "PRJ-2026-0005",
    name: "?��?� 鴔�??� ?寨�?��판매�",
    type: "?韒坐 ?��판매�",
    period: "2026.04.01 ~ 2026.10.31",
    status: "running",
    pm: "?𤣿�??,"
    progress: 47,
    participants: 96,
    updatedAt: "2026.01.17"
  },
  {
    id: "PRJ-2026-0006",
    name: "2025 ?圉� ?��篣堅� ?㴒�",
    type: "?㴒�/?瑅收",
    period: "2025.10.01 ~ 2025.12.31",
    status: "closed",
    pm: "篧�?𨰰𧇍",
    progress: 100,
    participants: 22,
    updatedAt: "2026.01.15"
  }
];

const TAB_SUMMARY: Record<SubMenu, string> = {
  basic: "?��?𠺝䂻??관리雩?瑅陷諝??㻂𥘵?拘�??",
  participants_org: "麆賄𤩐?韠? 魽域� 貒䇹�諝?窵�謔秒襔?�𠹻.",
  rules: "조건探窸?보상� 篞𨰰�??窵�謔秒襔?�𠹻.",
  progress: "鴔�� ?刷�?� 窸潰�??窵�謔秒襔?�𠹻.",
  performance: "?木� ?�埯窸?黺䇹𦚯諝??㻂𥘵?拘�??",
  settlement: "보상�/?㻂� ?�埯??窵�謔秒襔?�𠹻.",
  board: "?��?𠺝䂻 窶嵸�?韠� 窵�謔秒襔?�𠹻.",
  evidence: "鴞噃�?韒� ?梵�/窶�???��諝?窵�謔秒襔?�𠹻.",
  activity: "?��?𠺝䂻 ?嶅� ?渠�???㻂𥘵?拘�??"
};

function statusLabel(status: ProjectItem["status"]) { if (status === "running") return "운영중"; if (status === "preparing") return "준비중"; return "종료"; }
  if (status === "running") return "?渥�鴗?;"
  if (status === "preparing") return "鴗�赬��";
  return "鮈��";
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
function statusLabel(status: ProjectItem["status"]) { if (status === "running") return "운영중"; if (status === "preparing") return "준비중"; return "종료"; }
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><CalendarDays className="mini-icon" /></div>
            <div>
              <span>?��?𠺝䂻 篣國�</span>
              <strong>{project.period}</strong>
              <small>(366??</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><Tag className="mini-icon" /></div>
            <div>
              <span>?��?𠺝䂻 ?𡥄�</span>
              <strong>{project.type}</strong>
              <small>(?賄�?圉�??</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><BookOpen className="mini-icon" /></div>
            <div>
              <span>?�???��</span>
              <strong>?𥔱�?�� ???�版</strong>
              <small>(1,256穈?</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock3 className="mini-icon" /></div>
            <div>
              <span>?渥� ?��</span>
function statusLabel(status: ProjectItem["status"]) { if (status === "running") return "운영중"; if (status === "preparing") return "준비중"; return "종료"; }
              <small>(2026.01.01 ?𨰰�)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon blue"><Target className="mini-icon" /></div>
            <div>
              <span>鴔��??/span>
              <strong>{project.progress}%</strong>
              <small>(鴔��諝?篣域?)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="basic-mid-grid">
        <section className="section-card">
          <h3 className="panel-title">?��?𠺝䂻 관리雩 ?瑅陷</h3>
          <table className="project-table basic-info-table">
            <tbody>
              <tr><td>?��?𠺝䂻諈?/td><td>{project.name}</td></tr>
              <tr><td>?��?𠺝䂻諈拖�</td><td>?𥔱�?�� ?韒坐 ?瑅? 諻?窸𥻗� 黺拖�???伊�</td></tr>
              <tr><td>?𨰰�??/td><td>2026.01.01</td></tr>
              <tr><td>鮈��??/td><td>2026.12.31</td></tr>
              <tr><td>?渥�賱�??/td><td>諤�??�雩賱� ?��篣堅�?�</td></tr>
              <tr><td>?�?��??/td><td>?�筏 ?𨰰� 諻??刺𦉘???韒坐麮?(?潺� ?嵸� ?秒𥚃)</td></tr>
              <tr><td>?��?𠺝䂻儠竾�</td><td>{project.id}</td></tr>
              <tr><td>?��?𠺝䂻 ?月�</td><td>2026???????軤� ?𥔱�?�� ?韒坐 ?𨰰�?竾? ?�㟲 鴔��?䁪� ?賄�?圉� 관리� ?��판매�?��??</td></tr>
              <tr><td>?��?𠺝䂻 儠竾�</td><td>{project.id}</td></tr>
              <tr><td>?��차트𠸊諈?/td><td>{project.name}</td></tr>
              <tr><td>?𨰰�??/td><td>2026.01.01</td></tr>
              <tr><td>鮈��??/td><td>2026.12.31</td></tr>
              <tr><td>?渥� 魽域�</td><td>諤�??�萼?澁?</td></tr>
            </tbody>
          </table>
        </section>
        <section className="section-card">
          <h3 className="panel-title">?渥� ?䇹烄</h3>
          <div className="basic-summary-grid">
            <div className="basic-summary-item"><Users className="mini-icon" /><div><span>麆賄𤩐????/span><strong>356諈?/strong></div></div>
            <div className="basic-summary-item"><Flag className="mini-icon" /><div><span>鴔�� ?刷�</span><strong>1?刷�</strong></div></div>
            <div className="basic-summary-item"><Target className="mini-icon" /><div><span>판매� 諈拗�</span><strong>500諈?/strong></div></div>
            <div className="basic-summary-item"><Target className="mini-icon" /><div><span>?韒坐 諈拗�</span><strong>1,200,000,000??/strong></div></div>
            <div className="basic-summary-item"><BookOpen className="mini-icon" /><div><span>窶嵸�篣�</span><strong>12穇?/strong></div></div>
            <div className="basic-summary-item"><FolderOpen className="mini-icon" /><div><span>鴞噃�?韒�</span><strong>87穇?/strong></div></div>
          </div>
        </section>
      </div>

      <div className="basic-bottom-grid">
        <section className="section-card">
          <h3 className="panel-title">?��?𠺝䂻 ?潰�</h3>
          <ul className="basic-timeline">
            <li className="done">
              <span className="tl-dot">??/span>
              <b>?��?𠺝䂻 鴗�赬?/b>
              <span>2025.11.01 ~ 2025.12.31</span>
              <em className="status running">?��</em>
              <small>?��판매� 篣堅� 諻??𨰰擪???貲� ?��</small>
            </li>
            <li className="active">
              <span className="tl-dot">1</span>
              <b>1?刷� ?��판매�</b>
              <span>2026.01.01 ~ 2026.03.31</span>
              <em className="status running">鴔��鴗?/em>
              <small>黕�萼 ?韒坐 ?𨰰�??諻?麆賄𤩐???瑅?</small>
            </li>
            <li>
              <span className="tl-dot">2</span>
              <b>2?刷� ?��판매�</b>
              <span>2026.04.01 ~ 2026.06.30</span>
              <em className="status planning">?��</em>
              <small>?韒坐 ?瑅? 諻?鴗𡟯� ?퍼포머 ?韀?</small>
            </li>
            <li>
              <span className="tl-dot">3</span>
              <b>3?刷� ?��판매�</b>
              <span>2026.07.01 ~ 2026.09.30</span>
              <em className="status planning">?��</em>
              <small>?䁪�篣?鴔𡢾� ?��판매�</small>
            </li>
            <li>
              <span className="tl-dot">4</span>
              <b>黖𨰰� ?㻂� 諻??㕓?</b>
              <span>2026.10.01 ~ 2026.12.31</span>
              <em className="status planning">?��</em>
              <small>黖𨰰� ?퍼포머 ?㻂𥘵 諻?보상� ?㻂�</small>
            </li>
          </ul>
        </section>

        <section className="section-card">
          <div className="basic-memo-head">
            <h3 className="panel-title">?��?𠺝䂻 諰竾爸</h3>
            <button type="button" className="ghost">
              <Pencil className="mini-icon" />
              ?賄�
            </button>
          </div>
          <ul className="simple-list">
            <li><span>1?刷� ?��판매� ?𨰰� ??穈�?渠�?潰𥘵 諻堅𡢢 ?��</span><small>2025.12.28</small></li>
            <li><span>麆賄𤩐???�???刺陷???刺�??2026.01.02 鴔�� ?��</span><small>2025.12.28</small></li>
            <li><span>?𥻗� ?賄�?圉� ?�� 窶�??鴗?(?�� 10% 黺𥯆? ?科�)</span><small>2026.01.03</small></li>
            <li><span>2?刷� 諈拗� 魽域� 窶�??(?𨰰𤟠 ?�埯 諻䁯�)</span><small>2026.01.05</small></li>
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
      ruleName: `${project.name} ?𨰰?조건探`
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
          ?𨰰?조건探
          <select value={selectedRuleId} onChange={(e) => setSelectedRuleId(e.target.value)}>
            {savedRules.length === 0 ? <option value="">?�?伙� 조건探 ?��</option> : null}
            {savedRules.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="proj-rules-actions">
          <button type="button" className="ghost" onClick={openAdd}>조건探黺𥯆?</button>
          <button type="button" className="primary" onClick={openEdit} disabled={!selectedRule}>조건探?䁯�</button>
        </div>
      </div>

      {editing ? (
        <div className="proj-rules-editor">
          <label>
            조건探諈?            <input
              value={editing.ruleName}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, ruleName: e.target.value } : prev))}
            />
          </label>
          <label>
            ?�鹻?𨰰�??            <input
              type="date"
              value={editing.effectiveFrom}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveFrom: e.target.value } : prev))}
            />
          </label>
          <label>
            ?�鹻鮈��??            <input
              type="date"
              value={editing.effectiveTo}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveTo: e.target.value } : prev))}
            />
          </label>
          <label>
            ?科鹻?禺?
            <select
              value={editing.enabled ? "Y" : "N"}
              onChange={(e) => setEditing((prev) => (prev ? { ...prev, enabled: e.target.value === "Y" } : prev))}
            >
              <option value="Y">?𨰰�</option>
              <option value="N">赬��??/option>
            </select>
          </label>
          <label>
            篣域?穈?            <input
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
            보상�篣�衮
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
            <button type="button" className="primary" onClick={saveEditing}>?�??/button>
            <button type="button" className="ghost" onClick={() => { setEditing(null); setEditingId(null); }}>鼒到�</button>
          </div>
        </div>
      ) : (
        <div className="proj-rules-summary">
          {selectedRule ? (
            <>
              <p><strong>조건探諈?</strong> {selectedRule.data.ruleName}</p>
              <p><strong>?�鹻篣國�:</strong> {selectedRule.data.effectiveFrom} ~ {selectedRule.data.effectiveTo}</p>
              <p><strong>篣域?穈?</strong> {selectedRule.data.condition.value1}</p>
              <p><strong>보상�篣�衮:</strong> {selectedRule.data.result.fixedAmount.toLocaleString()}</p>
            </>
          ) : (
            <p>?嶅＃?木𠂔?韠� ?𨰰?조건探???𡥄�?瞘掠??조건探黺𥯆?諝?鴔��?䁯�??</p>
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
        name: "PM 穇域� ?瑅陷 보상�",
        projectId: project.id,
        savedAt: "2026-05-14T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "PM 穇域� ?瑅陷 보상�",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["PM"], orgScope: "direct_lower" },
          condition: { ...mockRule.condition, metric: "lower_base_count", value1: 3, operator: ">=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 50000 }
        }
      },
      {
        id: "sample-2",
        name: "穇域� ?�爰穈� 판매� 보상�",
        projectId: project.id,
        savedAt: "2026-05-10T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "穇域� ?�爰穈� 판매� 보상�",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["Admin"], orgScope: "all_lower" },
          condition: { ...mockRule.condition, metric: "lower_expert_count", value1: 5, operator: ">=" },
          result: { ...mockRule.result, rewardType: "fixed", fixedAmount: 80000 }
        }
      },
      {
        id: "sample-3",
        name: "?𥔱�?�� 1?貲䂻 ?韒坐 보상�",
        projectId: project.id,
        savedAt: "2026-05-05T00:00:00.000Z",
        data: {
          ...mockRule,
          projectId: project.id,
          ruleName: "?𥔱�?�� 1?貲䂻 ?韒坐 보상�",
          enabled: true,
          target: { ...mockRule.target, targetType: "role", targetRoles: ["?��?𠺝䂻?�??], orgScope: "self" },"
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
    if (metric === "lower_base_count") return "穇域� ?瑅陷 ??;"
    if (metric === "lower_expert_count") return "?�爰穈� ?梵� ??;"
    if (metric === "sales_count") return "?韒坐 穇渥�";
    if (metric === "sales_set") return "?韒坐 ?貲䂻 ??;"
    return "諤木�??;"
  };

  const targetLabel = (targetType: RuleDraft["target"]["targetType"]) => {
    if (targetType === "role") return "麆賄𤩐??;"
    if (targetType === "individual") return "穈𨰰𥘵";
    return "魽域�";
  };

  const operatorLabel = (operator: RuleDraft["condition"]["operator"]) => {
    if (operator === ">=") return "?渥�";
    if (operator === "<=") return "?渣�";
    if (operator === "=") return "?軤𦉘";
    if (operator === ">") return "黕�頃";
    if (operator === "<") return "諯賈�";
    return "窱禹�";
  };

  const resultSummary = (rule: RuleDraft) => {
    if (rule.result.rewardType === "fixed") return "조건探 黺拖§ ??보상� 鴔�篣?;"
    if (rule.result.rewardType === "rate") return "조건探 黺拖§ ??赬�銁 鴔�篣?;"
    return "조건探 黺拖§ ???潤襔 보상� 鴔�篣?;"
  };

  const [showTemplates, setShowTemplates] = useState(false);
  const [templateItems, setTemplateItems] = useState<SavedRuleItem[]>([]);

  const openAdd = () => {
    onLoadTemplate();
  };

  const onLoadTemplate = () => {
    const all = loadSavedRules();
    // ?�� 조건探窵�謔科�???吖�??諴圉㨩諤??��諤?(?禹萼?嶅� ?��諢??�眼 ?賄�)
    if (all.length === 0) {
      setNotice("?�� '조건探 窵�謔? 諰竾�?韠� 諟潰? 諤�擪??篞𨰰�???梵�??鴥潰�??");
      return;
    }
    setTemplateItems(all);
    setShowTemplates(true);
  };

  const onSelectTemplate = (item: SavedRuleItem) => {
    setEditingId(null); // ?𥻗� ?梵� 諈刺�
    setEditing({
      ...item.data,
      projectId: project.id,
      ruleName: item.name // 諤�擪??篞𨰰� 諈�僮??차트?諢?穈�?賄狍
    });
    setShowTemplates(false);
    setNotice("諤�擪??篞𨰰�??賱�剳?䇹𠽌?�𠹻. ?��?𠺝䂻??諤嵴� 조건探???䁯�?䁯𤩐 ?�鹻??鴥潰�??");
  };

  const onValidate = () => {
    setNotice("篞𨰰�???𡥄辶??諻?黺拘� 窶�鴞吖𦚯 ?��?䁯�?蛟�??");
  };

  const saveEditing = () => {
    if (!editing) return;
    if (editingId) {
      const next = updateSavedRule(editingId, editing);
      setAllRules(next);
      setNotice("篞𨰰�???䁯�?䁯�?蛟�??");
    } else {
      const next = saveRule(editing);
      setAllRules(next);
      setNotice("??篞𨰰�???��?𠺝䂻??黺𥯆??䁯�?蛟�??");
    }
    setEditing(null);
    setEditingId(null);
  };

  const totalCount = rulesForProject.length;
  const activeCount = rulesForProject.filter((r) => r.data.enabled).length;
  const rewardTypeCount = new Set(rulesForProject.map((r) => r.data.result.rewardType)).size;
  const approvalRequiredCount = 0; // ?伕� ?寢𥘵 ?��?賄擪 ?圉� ???�㫲?渣䂻

  const policySummary = [
    { icon: <BookOpen className="mini-icon" />, title: "?㻂衮 보상�", left: `${rulesForProject.filter(r => r.data.result.rewardType === 'fixed').length}穈?篞𨰰�`, rightLabel: "黕??��", rightValue: "?木� ?圉� 窸��", tone: "blue" },
    { icon: <Target className="mini-icon" />, title: "赬�銁 보상�", left: `${rulesForProject.filter(r => r.data.result.rewardType === 'rate').length}穈?篞𨰰�`, rightLabel: "鴔�篣?篣域?", rightValue: "諤木�/?木� ?�赬?, tone: "green" },"
    { icon: <Tag className="mini-icon" />, title: "?潤襔 보상�", left: `${rulesForProject.filter(r => r.data.result.rewardType === 'mixed').length}穈?篞𨰰�`, rightLabel: "窱科�", rightValue: "?㻂衮 + 赬�銁", tone: "purple" },
    { icon: <CalendarDays className="mini-icon" />, title: "鴔�篣吣ˉ篣?, left: "???到� 鴔�篣?, rightLabel: "鴔�篣吣𦉘", rightValue: "?蛙� 15??, tone: "orange" }"
  ] as const;

  const previewText = selectedRule
    ? `麆賄𤩐?韀? ???軤� ${metricLabel(selectedRule.data.condition.metric)}穈� ${selectedRule.data.condition.value1}${operatorLabel(
        selectedRule.data.condition.operator
      )}?渠庖, ?渠鰟 ?䇹� ${selectedRule.name}(?㻂衮 ??{selectedRule.data.result.fixedAmount.toLocaleString()})??鴔�篣㕭襔?�𠹻.`
    : "?𡥄�??篞𨰰�???�𠽌?�𠹻.";

  const toneClass = (tone: "blue" | "green" | "purple" | "orange") => `proj-rules-tone-${tone}`;

  return (
    <section className="basic-info-page proj-rules-tab-wrapper">
      <section className="section-card basic-hero-card">
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
function statusLabel(status: ProjectItem["status"]) { if (status === "running") return "운영중"; if (status === "preparing") return "준비중"; return "종료"; }
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><ClipboardList className="mini-icon" /></div>
            <div>
              <span>조건探 ??/span>
              <strong>{totalCount}穇?/strong>
              <small>(?�眼 ?梵�)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CheckCircle2 className="mini-icon" /></div>
            <div>
              <span>?𨰰� 篞𨰰� ??/span>
              <strong>{activeCount}穇?/strong>
              <small>(KPI 諻䁯�)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><Gift className="mini-icon" /></div>
            <div>
              <span>보상� ?𡥄� ??/span>
              <strong>{rewardTypeCount}穈?/strong>
              <small>(?㻂衮/赬�銁/?潤襔)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><AlertTriangle className="mini-icon" /></div>
            <div>
              <span>?寢𥘵 ?�� 篞𨰰�</span>
              <strong>{approvalRequiredCount}穇?/strong>
              <small>(窶�???�篣?</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon blue"><Clock3 className="mini-icon" /></div>
            <div>
              <span>?渥� ?��</span>
              <strong>?渥�鴗?/strong>
              <small>(?�� ?��?𠺝䂻)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="proj-rules-content-layout">
        <div className="proj-rules-left-column">
          <section className="proj-rules-list-card">
            <header className="proj-rules-card-head">
              <div className="head-left">
                <h3>?��?𠺝䂻 ?�鹻 조건探</h3>
                <span className="count-badge">{totalCount}穇?/span>
              </div>
              <div className="head-right">
                <button type="button" className="primary mini-btn" onClick={openAdd}>
                  <Plus className="mini-icon" /> 篞𨰰� 黺𥯆?
                </button>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "enabled" | "disabled")}>
                  <option value="all">?�眼</option>
                  <option value="enabled">?𨰰�</option>
                  <option value="disabled">赬��??/option>
                </select>
              </div>
            </header>

            <div className="proj-rules-info-box">
              <Info className="mini-icon blue" />
              <span>???��?𠺝䂻??黖𨰰� ?�鹻??조건探 諈拘�?��?? ?域腹 <b>窵�謔??∫�</b>?渠� ?月�??<b>黺𥯆?</b> 貒�𢩦?潺� ??조건探???梵�?????�𠽌?�𠹻.</span>
            </div>

            <div className="proj-rules-list">
              {filteredRules.length === 0 ? (
                <div className="proj-rules-empty">
                  <p>?梵�??조건探???�𠽌?�𠹻. ??篞𨰰�??黺𥯆???鴥潰�??</p>
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
                          <small>?��</small>
                          <span className={item.data.enabled ? "status running" : "status closed"}>{item.data.enabled ? "?𨰰�" : "赬��??}</span>"
                        </div>
                      </div>
                      <div className="proj-rules-item-meta">
                        <div><small>?�鹻?�??/small><b>{targetLabel(item.data.target.targetType)}</b></div>
                        <div><small>鼽∫�??版</small><b>{metricLabel(item.data.condition.metric)}</b></div>
                        <div><small>?韠�篣域?</small><b>{item.data.condition.operator} {item.data.condition.value1}{operatorLabel(item.data.condition.operator)}</b></div>
                        <div><small>窶國頃?㻂�</small><b>{resultSummary(item.data)}</b></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="proj-rules-preview-card">
            <header className="proj-rules-card-head">
              <h3>조건探 諯賈收貐湊萼</h3>
            </header>
            <div className="proj-rules-preview-box">
              <FileText className="mini-icon" />
              <p>{previewText}</p>
            </div>
            <p className="proj-rules-preview-help">?????渥鹻?� ?𡥄� 조건探 篣域??潺� 諯賈收貐湊萼???渥鹻?��??</p>
          </section>
        </div>

        <div className="proj-rules-right-column">
          <section className="proj-rules-policy-card">
            <header className="proj-rules-card-head">
              <h3>보상� ?㻂� ?䇹烄</h3>
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
              <h3>窵�謔??∫�</h3>
            </header>
            <div className="proj-rules-action-grid">
              <div className="proj-rules-action-btn" onClick={openAdd} role="button" tabIndex={0}>
                <div className="icon-wrapper"><Plus /></div>
                <div>
                  <strong>篞𨰰� 黺𥯆?</strong>
                  <span>??篞𨰰�???梵�?拘�??</span>
                </div>
              </div>
              <div className="proj-rules-action-btn" onClick={onLoadTemplate} role="button" tabIndex={0}>
                <div className="icon-wrapper"><Upload /></div>
                <div>
                  <strong>?𨂃�謔?賱�剳?曰萼</strong>
                  <span>?�?伙� ?𨂃�謔辦� 賱�剳?蛟�??</span>
                </div>
              </div>
              <div className="proj-rules-action-btn" onClick={onValidate} role="button" tabIndex={0}>
                <div className="icon-wrapper"><ShieldCheck /></div>
                <div>
                  <strong>窶�鴞??欠�</strong>
                  <span>篞𨰰�???𡥄辶??諻?黺拘�??窶�鴞𠺝襔?�𠹻.</span>
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
              <h3>조건探 ?𨂃�謔?賱�剳?曰萼</h3>
              <button type="button" className="ghost" onClick={() => setShowTemplates(false)}>�</button>
            </header>
            <div className="proj-rules-modal-body">
              <p className="helper-text">賱�剳??조건探???𡥄�?䁯�?? ?��?𠺝䂻???梓痔??諤嵴� ?䁯�?䁯𤩐 ?�鹻?????�𠽌?�𠹻.</p>
              <div className="proj-rules-template-list">
                {templateItems.map((item) => (
                  <button key={item.id} type="button" className="proj-rules-template-item" onClick={() => onSelectTemplate(item)}>
                    <div className="template-icon"><FileText /></div>
                    <div className="template-info">
                      <strong>{item.name}</strong>
                      <span>{item.data.target.targetType === "role" ? "麆賄𤩐???�?? : "魽域� ?�??} | {metricLabel(item.data.condition.metric)}</span>
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
              <h3>조건探 ?木� 諻??䁯�</h3>
              <button type="button" className="ghost" onClick={() => { setEditing(null); setEditingId(null); }}>�</button>
            </header>
            <div className="proj-rules-modal-body">
              <div className="proj-rules-editor-grid">
                <label className="span-all">
                  <small>조건探諈?/small>
                  <input
                    value={editing.ruleName}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, ruleName: e.target.value } : prev))}
                    placeholder="篞𨰰� ?渠�???��?䁯�??"
                  />
                </label>
                <label>
                  <small>?�鹻 ?𨰰�??/small>
                  <input
                    type="date"
                    value={editing.effectiveFrom}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveFrom: e.target.value } : prev))}
                  />
                </label>
                <label>
                  <small>?�鹻 鮈��??/small>
                  <input
                    type="date"
                    value={editing.effectiveTo}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, effectiveTo: e.target.value } : prev))}
                  />
                </label>
                <label>
                  <small>?��</small>
                  <select
                    value={editing.enabled ? "Y" : "N"}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, enabled: e.target.value === "Y" } : prev))}
                  >
                    <option value="Y">?𨰰� (KPI 諻䁯�)</option>
                    <option value="N">赬��??(諯賈�??</option>
                  </select>
                </label>
                <label>
                  <small>篣域?穈?({metricLabel(editing.condition.metric)})</small>
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
                  <small>보상� ?㻂� (?㻂衮 보상� 篣域?)</small>
                  <div className="reward-input-row">
                    <span>??/span>
                    <input
                      type="number"
                      value={editing.result.fixedAmount}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, result: { ...prev.result, fixedAmount: Number(e.target.value) || 0 } } : prev
                        )
                      }
                    />
                    <span>??鴔�篣?/span>
                  </div>
                </label>
              </div>
            </div>
            <footer className="proj-rules-modal-foot">
              <button type="button" className="ghost" onClick={() => { setEditing(null); setEditingId(null); }}>鼒到�</button>
              <button type="button" className="primary" onClick={saveEditing}>?��?𠺝䂻 篞𨰰� ?�??/button>
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
  if (tab === "evidence") return <ProjectEvidenceTab project={project} />;
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
          <span>?��?𠺝䂻窵�謔?/span>
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
            諈拘�?潺�
          </button>
        </section>

        <ProjectTabContent tab={subMenu} project={selectedProject} />
      </div>
    );
  }

  return (
    <div className="proj-mgmt-page">
      <div className="proj-breadcrumb">
        <span>?��?𠺝䂻窵�謔?/span>
        <ChevronRight className="mini-icon" />
        <span>?��?𠺝䂻 諈拘�</span>
      </div>

      <div className="page-head">
        <h1>?��?𠺝䂻窵�謔?/h1>
        <p>?��?𠺝䂻 諈拘�?韠� ?𡥄�???��?𠺝䂻???�� ?瑅陷諝??㻂𥘵?拘�??</p>
      </div>

      <div className="proj-mgmt-stats">
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon blue"><FolderOpen className="mini-icon" /></div><div><span>?�眼 ?��?𠺝䂻</span><strong>12穈?/strong></div></div>
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon green"><CheckCircle2 className="mini-icon" /></div><div><span>?渥�鴗?/span><strong>7穈?/strong></div></div>
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon purple"><Clock3 className="mini-icon" /></div><div><span>鴗�赬��</span><strong>2穈?/strong></div></div>
        <div className="section-card proj-mgmt-stat"><div className="proj-mgmt-stat-icon orange"><Clock4 className="mini-icon" /></div><div><span>鮈��</span><strong>3穈?/strong></div></div>
      </div>

      <section className="section-card proj-mgmt-filter">
        <div className="proj-mgmt-filter-grid">
          <label>
            ?��?𠺝䂻諈?            <div className="search-box proj-mgmt-search">
              <input placeholder="?��?𠺝䂻 窶�??.." />
              <Search className="mini-icon" />
            </div>
          </label>
          <label>?��<select><option>?�眼</option></select></label>
          <label>PM<select><option>?�眼</option></select></label>
          <label>篣國�<input type="text" value="?𨰰�??~ 鮈��?? readOnly /></label>"
          <div className="proj-mgmt-filter-actions">
            <button type="button" className="primary">窶�??/button>
            <button type="button" className="ghost">黕�萼??/button>
            <button type="button" className="primary"><Plus className="mini-icon" /> ?��?𠺝䂻 ?梵�</button>
          </div>
        </div>
      </section>

      <div className="proj-mgmt-guide">
        <Info className="mini-icon blue" />
        <strong>?��?𠺝䂻諝??𡥄�?䁪庖 ?�� ??尐諢??渠�?拘�??</strong>
        <span>諈拘� ?吣� ?渠早?䁪庖 ?渠鰟 ?��?𠺝䂻 ?�� ?竾庖???𨰰�?拘�??</span>
      </div>

      <section className="section-card">
        <table className="project-table proj-mgmt-table">
          <thead>
            <tr>
              <th>?��?𠺝䂻諈?/th>
              <th>?𡥄�</th>
              <th>篣國�</th>
              <th>?��</th>
              <th>PM</th>
              <th>鴔��??/th>
              <th>麆賄𤩐??/th>
              <th>?䁯�??/th>
              <th>?∫�</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((project) => (
              <tr key={project.id} className={project.id === selectedProjectId ? "selected" : undefined} onClick={() => openDetail(project)}>
                <td><strong>{project.name}</strong></td>
                <td>{project.type}</td>
                <td>{project.period}</td>
function statusLabel(status: ProjectItem["status"]) { if (status === "running") return "운영중"; if (status === "preparing") return "준비중"; return "종료"; }
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
    { id: 1, title: "謔禺� ?𧙖�", period: "2026.01.01 ~ 2026.01.09", status: "?��", statusClass: "closed" },
    { id: 2, title: "?�??窱科�", period: "2026.01.10 ~ 2026.01.23", status: "鴔��鴗?, statusClass: "running" },"
    { id: 3, title: "諻嶅???諻??嶅�赬?穈𨰰�", period: "2026.01.24 ~ 2026.01.30", status: "?��", statusClass: "pending" },
    { id: 4, title: "鴥澎� 판매� ?渥�", period: "2026.02.01 ~ 2026.11.30", status: "?��", statusClass: "pending" },
    { id: 5, title: "?䁪礆??黕�? ?科�", period: "2026.12.01 ~ 2026.12.15", status: "鴔�??, statusClass: "delayed" },"
    { id: 6, title: "?𥔱鴡??黖𨰰� ?��", period: "2026.12.16 ~ 2026.12.31", status: "?��", statusClass: "pending" },
  ];

  const currentStep = steps[1];

  return (
    <section className="basic-info-page proj-progress-tab">
      <section className="section-card basic-hero-card">
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
function statusLabel(status: ProjectItem["status"]) { if (status === "running") return "운영중"; if (status === "preparing") return "준비중"; return "종료"; }
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards">
          <div className="basic-top-card">
            <div className="basic-icon blue"><CalendarDays className="mini-icon" /></div>
            <div>
              <span>?�� ?刷�</span>
              <strong>{currentStep.id}?刷�</strong>
              <small>{currentStep.title}</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><ClipboardList className="mini-icon" /></div>
            <div>
              <span>?�眼 ?刷� ??/span>
              <strong>{steps.length}?刷�</strong>
              <small>(?��?𥔱� 篣域?)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CheckCircle2 className="mini-icon" /></div>
            <div>
              <span>?�� ?刷�</span>
              <strong>1?刷�</strong>
              <small>(?寢𥘵 ?��)</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock4 className="mini-icon" /></div>
            <div>
              <span>鴔�???刷�</span>
              <strong>1?刷�</strong>
              <small>(?潰� 黕�頃)</small>
            </div>
          </div>
        </div>
      </section>

      <div className="proj-progress-content">
        <div className="proj-progress-left">
          <section className="section-card timeline-card">
            <header className="card-header">
              <h3>?�馬 窵�謔?/ ?刷� ?�?�𦉘??/h3>
            </header>
            <div className="vertical-timeline">
              {steps.map((step) => (
                <div key={step.id} className={`timeline-item ${step.statusClass}`}>
                  <div className="timeline-marker">
                    {step.status === "?��" ? <Check className="mini-icon" /> : <span>{step.id}</span>}
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
              <h3>?�� ?刷� ?��</h3>
              <div className="header-actions">
                <button type="button" className="ghost mini-btn">?��?䇹痍</button>
                <button type="button" className="primary mini-btn">?刷� ?寢𥘵</button>
              </div>
            </header>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>?刷�諈?/th>
                  <td>{currentStep.title}</td>
                </tr>
                <tr>
                  <th>諈拗�/?�� 篣域?</th>
                  <td>?�?伊� 窱科�?瞘� ?�???瑅陷諝??梵�?䁯𤩐 ?寢𥘵 ?��</td>
                </tr>
                <tr>
                  <th>?渠鰟??/th>
                  <td>?𨰰??� 諤月�?� (諤�??�雩賱�)</td>
                </tr>
                <tr>
                  <th>諤��??/th>
                  <td>2026.01.23 (篣?</td>
                </tr>
                <tr>
                  <th>鴔��諝?/th>
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
              <h3>麮渣�謔科擪??/h3>
              <button type="button" className="ghost mini-btn">麮渣�謔科擪??窵�謔?/button>
            </header>
            <div className="checklist-list">
              <label><input type="checkbox" defaultChecked /> ?�???�陷??諈�𡆀 ?𨰰�</label>
              <label><input type="checkbox" defaultChecked /> ?�??窱科� 諻???� 諻域�</label>
              <label><input type="checkbox" /> ?� ?瑅陷 ?𨰰擪???梵�</label>
              <label><input type="checkbox" /> ?�??窱科� ?�� 貐湊� 諻??寢𥘵 ?䇹痍</label>
            </div>
          </section>
        </div>
      </div>

      <section className="section-card approval-table-card">
        <header className="card-header">
          <h3>?刷�貐??寢𥘵 諻?鴞噃� ?�埯</h3>
          <button type="button" className="primary mini-btn">?木� ?刷� 穈嶅骨</button>
        </header>
        <div className="table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>?刷�</th>
                <th>鴞噃�?韒�</th>
                <th>?寢𥘵?��</th>
                <th>?䇹痍??/th>
                <th>?寢𥘵??/th>
                <th>?𡢾�</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. 謔禺� ?𧙖�</td>
                <td>謔禺� ?𧙖� 諈�𡆀.pdf <FileText className="inline-icon" /></td>
                <td><span className="status closed">?寢𥘵?��</span></td>
                <td>2026.01.09</td>
                <td>?渥�鴔??�??/td>
                <td>
                  <div className="btn-group">
                    <button type="button" className="ghost mini-btn">?��貐湊萼</button>
                  </div>
                </td>
              </tr>
              <tr className="active">
                <td>2. ?�??窱科�</td>
                <td>?� 窱科� 窸��??pdf <FileText className="inline-icon" /></td>
                <td><span className="status running">?寢𥘵?䇹痍</span></td>
                <td>2026.01.21</td>
                <td>-</td>
                <td>
                  <div className="btn-group">
                    <button type="button" className="ghost mini-btn">?��貐湊萼</button>
                    <button type="button" className="primary mini-btn">?寢𥘵</button>
                  </div>
                </td>
              </tr>
              {steps.slice(2).map(s => (
                <tr key={s.id} className="dimmed">
                  <td>{s.id}. {s.title}</td>
                  <td>-</td>
                  <td><span className="status pending">?�篣?/span></td>
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
    { rank: 1, name: "篧�諯潰�", role: "PM", recruit: 412, sales: 942, achievement: 104.7, status: "?域�", avatar: "https://i.pravatar.cc/150?u=1" },
    { rank: 2, name: "?渥??�", role: "穈��", recruit: 326, sales: 783, achievement: 97.9, status: "?域�", avatar: "https://i.pravatar.cc/150?u=2" },
    { rank: 3, name: "諻㻂???, role: "?��?𠺝䂻?�??, recruit: 298, sales: 657, achievement: 91.3, status: "?域�", avatar: "https://i.pravatar.cc/150?u=3" },
    { rank: 4, name: "黖𨰰�謔?, role: "?��?𠺝䂻?�??, recruit: 221, sales: 484, achievement: 67.2, status: "貐渣�", avatar: "https://i.pravatar.cc/150?u=4" },
    { rank: 5, name: "?𤣿�??, role: "?��?𠺝䂻?�??, recruit: 198, sales: 412, achievement: 57.2, status: "貐渣�", avatar: "https://i.pravatar.cc/150?u=5" },
  ];

  const recentApprovals = [
    { user: "篧�?域黱", action: "?韒坐 ?木� 28?貲䂻", date: "2026-05-14 15:32" },
    { user: "?��1?�", action: "판매� ?木� 35諈?, date: "2026-05-14 14:21" },"
    { user: "?渥�赬?, action: "?韒坐 ?木� 22?貲䂻", date: "2026-05-14 11:07" },"
    { user: "?𤣿�??, action: "?韒坐 ?木� 18?貲䂻", date: "2026-05-14 09:48" },"
    { user: "諻㻂???, action: "판매� ?木� 12諈?, date: "2026-05-14 09:15" },
  ];

  const roleStats = [
    { role: "PM", count: 8, record: "1,132?貲䂻", achievement: 94.3 },
    { role: "穈��", count: 24, record: "1,028?貲䂻", achievement: 85.7 },
    { role: "?��?𠺝䂻?�??, count: 96, record: "700?貲䂻", achievement: 72.2 },"
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
            <span className="status running">?渥�鴗?/span>
            <strong>PM 篧�鴔�??/strong>
          </div>
        </div>

        <div className="perf-stats-row" style={{ marginTop: '20px', marginBottom: '0' }}>
          <div className="perf-stat-card">
            <div className="basic-icon blue"><Users className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>黕?麆賄𤩐??/span>
              <strong>128諈?/strong>
              <small>?𨰰� 116諈?/small>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon purple"><UserPlus className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>판매� ?木�</span>
              <strong>1,245諈?/strong>
              <small>諈拗� 1,500諈?/small>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon blue"><ShoppingCart className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>?韒坐 ?木�</span>
              <strong>2,860?貲䂻</strong>
              <small>諈拗� 3,600?貲䂻</small>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon green"><Target className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>諈拗� ?科�諝?/span>
              <strong>79.4%</strong>
              <div className="achieve-bar-bg" style={{ width: '60px', marginTop: '4px' }}>
                <div className="achieve-bar-fill" style={{ width: '79.4%' }} />
              </div>
            </div>
          </div>
          <div className="perf-stat-card">
            <div className="basic-icon orange"><Trophy className="mini-icon" /></div>
            <div className="perf-stat-info">
              <span>?渠� 鴥?TOP ?�</span>
              <strong>?��1?�</strong>
              <small>?韒坐 628?貲䂻</small>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Box */}

      {/* Notice Box */}
      <div className="perf-notice-box">
        <div className="notice-content">
          <Info className="mini-icon" />
          ?木�?� 窸虛�?䁪庚, 穈𨰰𥘵貐?보상�?∫? 보상�/?㻂� 諰竾�?韠� 窷龲�???圉𦉘 貐��諢?窵�謔禺𨫥?�𠹻.
        </div>
        <button type="button" className="ghost mini-btn">�</button>
      </div>

      {/* Main Content Layout */}
      <div className="perf-main-grid">
        <div className="perf-left-col">
          {/* Performance Board Table */}
          <section className="perf-board-card">
            <header className="perf-card-head">
              <h3>?木� 窸虛� 貐渠� <Info className="mini-icon" style={{ opacity: 0.4 }} /></h3>
            </header>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th className="rank-cell">?𨰰�</th>
                  <th>?渠�/??�</th>
                  <th>판매�??/th>
                  <th>?韒坐?貲䂻</th>
                  <th className="achievement-cell">?科�諝?/th>
                  <th>?��</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((item) => (
                  <tr key={item.rank}>
                    <td className="rank-cell">
                      {item.rank <= 3 ? (
                        <div className="rank-medal-wrap">
                          <span style={{ fontSize: '18px' }}>{item.rank === 1 ? '?�' : item.rank === 2 ? '?�' : '?�'}</span>
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
                    <td>{item.recruit}諈?/td>
                    <td>{item.sales}?貲䂻</td>
                    <td className="achievement-cell">
                      <div className="achieve-bar-wrap">
                        <span>{item.achievement}%</span>
                        <div className="achieve-bar-bg">
                          <div className="achieve-bar-fill" style={{ width: `${Math.min(item.achievement, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={item.status === "?域�" ? "status-chip excel" : "status-chip normal"}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="view-all-btn">
              ?�眼 ?𨰰� 貐湊萼 <ChevronRight className="mini-icon" />
            </button>
          </section>

          {/* Bottom Grid: Trend & Activity */}
          <div className="perf-bottom-grid">
            <section className="perf-board-card">
              <header className="perf-card-head">
                <h3>?木� 黺䇹𦚯</h3>
                <h3>?木 黺䇹𦚯</h3>
                <div className="legend" style={{ fontSize: '11px', display: 'flex', gap: '8px', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }} /> ?韒坐?貲䂻</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i style={{ width: '8px', height: '8px', border: '1px solid #2563eb', borderRadius: '50%' }} /> ?성과?%)</span>
                </div>
              </header>
              <img src={trendChart} alt="이미지" className="trend-img" />
            </section>

            <section className="perf-board-card">
              <header className="perf-card-head">
                <h3>黖𨁈滂 ?寢𥘵 ?木</h3>
                <button type="button" className="ghost mini-btn" style={{ fontSize: '11px' }}>?竾陷篣?&gt;</button>
              </header>
              <div className="approval-list">
                {recentApprovals.map((item, idx) => (
                  <div key={idx} className="approval-item">
                    <div className="approval-icon"><CheckCircle2 className="mini-icon" /></div>
                    <div className="approval-text">
                      <p><b>{item.user}</b>?䁯𦚯 {item.action}諝??梵?𠽌?𠹻.</p>
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
              <h3>??𠺝䂻 鴔諝?/h3>
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
                <span>?科</span>
              </div>
            </div>
            <div className="progress-stats-list">
              <div className="prog-stat-item"><label>?韒坐 ?木</label><b>2,860 / 3,600?貲䂻</b></div>
              <div className="prog-stat-item"><label>판매 ?木</label><b>1,245 / 1,500諈?/b></div>
              <div className="prog-stat-item" style={{ borderTop: '1px solid #f8fafc', paddingTop: '10px', marginTop: '4px' }}>
                <label>?到? 篣國</label><b>61??/b>
              </div>
            </div>
          </section>

          {/* Role Summary Side Card */}
          <section className="perf-board-card">
            <header className="perf-card-head">
              <h3>??貐??木 ?䇹烄</h3>
            </header>
            <div className="role-summary-list">
              {roleStats.map((item) => (
                <div key={item.role} className="role-stat-item">
                  <div className="role-stat-head">
                    <span>{item.role} <b>{item.count}諈?/b></span>
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
              <h3>TOP ?퍼포머??/h3>
            </header>
            <table className="top-performer-table">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '8px', fontSize: '11px', color: '#94a3b8' }}>窱禺</th>
                  <th style={{ textAlign: 'left', paddingBottom: '8px', fontSize: '11px', color: '#94a3b8' }}>?渠</th>
                  <th style={{ textAlign: 'right', paddingBottom: '8px', fontSize: '11px', color: '#94a3b8' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="category-cell"><User className="mini-icon" /> 카테고리𠹻 ?韒坐</div></td>
                  <td className="performer-name">篧諯潰</td>
                  <td className="performer-record">942?貲䂻</td>
                </tr>
                <tr>
                  <td><div className="category-cell"><Users className="mini-icon" /> 카테고리𠹻 판매</div></td>
                  <td className="performer-name">篧諯潰</td>
                  <td className="performer-record">412諈?/td>
                </tr>
                <tr>
                  <td><div className="category-cell"><TrendingUp className="mini-icon" /> 黖𨁈 ?성과?/div></td>
                  <td className="performer-name">篧諯潰</td>
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
  const evidenceList = [
    { id: 1, name: '발대식 참석명단_20260101', type: '참석명단', step: '1단계 (진행중)', uploader: '홍길동 (영업기획팀)', date: '2026.01.01 11:24', status: 'approved' },
    { id: 2, name: '발대식 현장사진', type: '사진자료', step: '1단계 (진행중)', uploader: '홍길동 (영업기획팀)', date: '2026.01.01 11:28', status: 'approved' },
    { id: 3, name: '1주차 주간모임 회의록', type: '회의록', step: '1단계 (진행중)', uploader: '김수연 (영업기획팀)', date: '2026.01.08 14:35', status: 'review' },
    { id: 4, name: '판매실적 증빙_1주차', type: '판매실적', step: '1단계 (진행중)', uploader: '김수연 (영업기획팀)', date: '2026.01.08 14:40', status: 'review' },
    { id: 5, name: '매장 디스플레이 사진_1주차', type: '사진자료', step: '1단계 (진행중)', uploader: '이영희 (영업기획팀)', date: '2026.01.09 10:12', status: 'approved' },
    { id: 6, name: '2주차 주간모임 회의록', type: '회의록', step: '2단계 (예정)', uploader: '박지훈 (영업기획팀)', date: '2026.01.15 16:05', status: 'pending' },
    { id: 7, name: '판매실적 증빙_2주차', type: '판매실적', step: '2단계 (예정)', uploader: '박지훈 (영업기획팀)', date: '2026.01.15 16:08', status: 'pending' },
    { id: 8, name: '프로모션 홍보물 이미지', type: '기타', step: '3단계 (예정)', uploader: '최은지 (영업기획팀)', date: '2026.01.16 09:22', status: 'pending' },
  ];

  const typeStats = [
    { type: '판매실적', count: 28, percent: 32.2 },
    { type: '사진자료', count: 22, percent: 25.3 },
    { type: '회의록', count: 14, percent: 16.1 },
    { type: '참석명단', count: 10, percent: 11.5 },
    { type: '기타', count: 13, percent: 14.9 },
  ];

  return (
    <div className='evidence-tab-container'>
      <section className='section-card basic-hero-card' style={{ marginBottom: '24px' }}>
        <div className='basic-title-row'>
          <h2>{project.name}</h2>
          <div className='basic-owner'>
            <span className='status running'>운영중</span>
            <strong>PM 김지훈</strong>
          </div>
        </div>

        <div className='basic-top-cards'>
          <div className='basic-top-card'>
            <div className='basic-icon blue'><Files className='mini-icon' /></div>
            <div>
              <span>전체 자료 수</span>
              <strong>87건</strong>
            </div>
          </div>
          <div className='basic-top-card'>
            <div className='basic-icon green'><CheckCircle className='mini-icon' /></div>
            <div>
              <span>승인완료 자료</span>
              <strong>58건</strong>
              <small>(66.7%)</small>
            </div>
          </div>
          <div className='basic-top-card'>
            <div className='basic-icon orange'><Clock3 className='mini-icon' /></div>
            <div>
              <span>검토중 자료</span>
              <strong>21건</strong>
              <small>(24.1%)</small>
            </div>
          </div>
          <div className='basic-top-card'>
            <div className='basic-icon purple'><Folder className='mini-icon' /></div>
            <div>
              <span>미분류 자료</span>
              <strong>8건</strong>
              <small>(9.2%)</small>
            </div>
          </div>
        </div>
      </section>

      <div className='evidence-main-layout'>
        <div className='evidence-left-col'>
          <section className='section-card'>
            <header className='evidence-list-header'>
              <h3>증빙자료 목록</h3>
              <div className='evidence-header-actions'>
                <button type='button' className='primary-btn'><Plus size={16} /> 자료 업로드</button>
                <button type='button' className='outline-btn'><Download size={16} /> 일괄 다운로드</button>
                <button type='button' className='outline-btn'><RefreshCcw size={16} /> 승인 요청</button>
              </div>
            </header>

            <div className='evidence-filters'>
              <select className='form-select'><option>瞪羹 欽啗</option></select>
              <select className='form-select'><option>瞪羹 嶸И</option></select>
              <select className='form-select'><option>瞪羹 鼻鷓</option></select>
              <div className='search-box'>
                <input type='text' placeholder='濠猿貲 匐儀' />
                <Search size={16} />
              </div>
              <button type='button' className='reset-btn'>蟾晦�</button>
            </div>

            <table className='evidence-table'>
              <thead>
                <tr>
                  <th>濠猿貲</th>
                  <th>濠猿嶸И</th>
                  <th>翱唸 欽啗</th>
                  <th>機煎渦</th>
                  <th>機煎萄橾</th>
                  <th>蝓檣鼻鷓</th>
                  <th>擋暮</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((item) => (
                  <tr key={item.id}>
                    <td className='evidence-name-cell'>
                      <FileText size={16} className='file-icon' />
                      {item.name}
                    </td>
                    <td>{item.type}</td>
                    <td><span className='step-badge'>{item.step}</span></td>
                    <td>{item.uploader}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={'status-badge ' + item.status}>
                        {item.status === 'approved' ? '蝓檣諫猿' : item.status === 'review' ? '匐饜醞' : '嘐碟盟'}
                      </span>
                    </td>
                    <td className='action-cell'>
                      <div className='btn-group'>
                        <button type='button' className='ghost mini-btn'><Eye size={18} /></button>
                        <button type='button' className='ghost mini-btn'><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='pagination-wrap'>
              <div className='page-numbers'>
                <button type='button' className='page-btn active'>1</button>
                <button type='button' className='page-btn'>2</button>
                <button type='button' className='page-btn'>3</button>
                <button type='button' className='page-btn'>4</button>
                <button type='button' className='page-btn'>5</button>
                <ChevronRight size={16} />
              </div>
              <select className='form-select mini'>
                <option>10偃噶 爾晦</option>
              </select>
            </div>
          </section>
        </div>

        <div className='evidence-right-col'>
          <section className='section-card'>
            <header className='side-card-header'>
              <h3>濠猿 嶸И滌 Г�</h3>
              <button type='button' className='text-btn'>濠撮ɛ 爾晦</button>
            </header>
            <div className='type-stats-list'>
              {typeStats.map(stat => (
                <div key={stat.type} className='type-stat-item'>
                  <div className='stat-label-row'>
                    <label>{stat.type}</label>
                    <div className='stat-values'>
                      <strong>{stat.count}勒</strong>
                      <span>({stat.percent}%)</span>
                    </div>
                  </div>
                  <div className='type-progress-bg'>
                    <div className='type-progress-fill' style={{ width: stat.percent + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='section-card'>
            <header className='side-card-header'>
              <h3>譆斬 機煎萄 濠猿</h3>
              <button type='button' className='text-btn'>濠撮ɛ 爾晦</button>
            </header>
            <div className='recent-files-list'>
              {evidenceList.slice(0, 5).map(file => (
                <div key={file.id} className='recent-file-item'>
                  <FileText size={16} className='file-icon' />
                  <div className='file-info'>
                    <strong>{file.name}</strong>
                    <div className='file-meta'>
                      <span>{file.uploader.split(' ')[0]}</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='section-card guide-card'>
            <header className='side-card-header'>
              <h3>機煎萄 陛檜萄</h3>
            </header>
            <ul className='guide-list'>
              <li>ョ辨 冖橾 И衝: PDF, JPG, JPEG, PNG, XLS, XLSX, DOC, DOCX, PPT, PPTX (冖橾渡 譆渠 50MB)</li>
              <li>冖橾貲 敘罌: [欽啗]_[嶸И]_[頂辨]_[陳瞼] И衝 掏濰</li>
              <li>ノ熱 隸綵 寰頂:
                <ul>
                  <li>1欽啗: 嫦渠衝 霤戮貲欽, 輿除賅歜 �曖煙, 匸衙褒瞳 隸綵, 餌霞濠猿</li>
                  <li>2欽啗: 匸衙褒瞳 隸綵, 衙濰 蛤蝶デ溯檜 餌霞, ヅ煎賅暮 奩擬 撲僥</li>
                  <li>3欽啗: 譆謙 褒瞳 爾堅憮, 唸骯 隸綵, 辦熱餌滔 濠猿</li>
                </ul>
              </li>
              <li>蝓檣檜 諫猿脹 濠猿朝 熱薑檜 碳陛棟ベ棲棻.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

