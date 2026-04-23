import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Clock4,
  Eye,
  Flag,
  FolderOpen,
  Info,
  Pencil,
  Plus,
  Search,
  Tag,
  Target,
  Trash2,
  Users
} from "lucide-react";
import { ConditionManagementPage } from "./ConditionManagementPage";
import { ParticipantsManagementPage } from "./ParticipantsManagementPage";
import { ProgramBoardPage } from "./ProgramBoardPage";

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
  { key: "participants_org", label: "참여자·조직" },
  { key: "rules", label: "조건·보상규칙" },
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

function ProjectTabContent({ tab, project }: { tab: SubMenu; project: ProjectItem }) {
  if (tab === "participants_org") return <ParticipantsManagementPage projectId={project.id} />;
  if (tab === "rules") return <ConditionManagementPage />;
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
  const [subMenu, setSubMenu] = useState<SubMenu>("board");
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
          <span>상세</span>
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
