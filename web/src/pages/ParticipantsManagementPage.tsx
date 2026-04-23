import { Eye, Info, Pencil, Search, Trash2 } from "lucide-react";

type ParticipantStatus = "활동중" | "승인대기" | "보류";

type ParticipantRow = {
  id: string;
  role: string;
  name: string;
  phone: string;
  projectCount: number;
  status: ParticipantStatus;
  recentActivity: string;
  projectIds: string[];
};

type ParticipantsManagementPageProps = {
  projectId?: string;
};

const PARTICIPANTS: ParticipantRow[] = [
  {
    id: "PT-0001",
    role: "PM",
    name: "김지훈",
    phone: "010-2384-1123",
    projectCount: 3,
    status: "활동중",
    recentActivity: "2026-06-03",
    projectIds: ["PRJ-2026-0001", "PRJ-2026-0005", "PRJ-2026-0006"]
  },
  {
    id: "PT-0002",
    role: "간사",
    name: "박민지",
    phone: "010-5512-4482",
    projectCount: 2,
    status: "활동중",
    recentActivity: "2026-06-02",
    projectIds: ["PRJ-2026-0001", "PRJ-2026-0003"]
  },
  {
    id: "PT-0003",
    role: "프로젝트팀원",
    name: "이서윤",
    phone: "010-8831-2901",
    projectCount: 1,
    status: "승인대기",
    recentActivity: "2026-06-01",
    projectIds: ["PRJ-2026-0002"]
  },
  {
    id: "PT-0004",
    role: "프로젝트팀원",
    name: "최유리",
    phone: "010-7742-1108",
    projectCount: 2,
    status: "활동중",
    recentActivity: "2026-05-31",
    projectIds: ["PRJ-2026-0001", "PRJ-2026-0004"]
  },
  {
    id: "PT-0005",
    role: "프로젝트팀원",
    name: "정현우",
    phone: "010-9124-7703",
    projectCount: 1,
    status: "보류",
    recentActivity: "2026-05-30",
    projectIds: ["PRJ-2026-0001"]
  },
  {
    id: "PT-0006",
    role: "간사",
    name: "유다은",
    phone: "010-6682-4419",
    projectCount: 4,
    status: "활동중",
    recentActivity: "2026-05-29",
    projectIds: ["PRJ-2026-0001", "PRJ-2026-0003", "PRJ-2026-0005", "PRJ-2026-0006"]
  }
];

function statusClass(status: ParticipantStatus) {
  if (status === "활동중") return "status running";
  if (status === "승인대기") return "status settling";
  return "status closed";
}

export function ParticipantsManagementPage({ projectId }: ParticipantsManagementPageProps) {
  const isProjectScoped = Boolean(projectId);
  const rows = isProjectScoped
    ? PARTICIPANTS.filter((item) => item.projectIds.includes(projectId as string))
    : PARTICIPANTS;

  return (
    <>
      {!isProjectScoped ? (
        <div className="page-head">
          <h1>참여자관리</h1>
          <p>프로젝트 참여자와 참여 상태를 목록으로 관리합니다.</p>
        </div>
      ) : null}

      <div className="notice-box">
        <Info className="mini-icon blue" />
        {isProjectScoped
          ? "선택한 프로젝트 참여자만 표시됩니다."
          : "전체 프로젝트 참여자 목록을 표시합니다."}
      </div>

      <section className="section-card">
        <div className="participants-filters-row participants-filters-simple">
          <div className="search-box">
            <input placeholder="이름, 연락처 검색" />
            <Search className="mini-icon" />
          </div>
          <select>
            <option>기본역할: 전체</option>
          </select>
          <select>
            <option>상태: 전체</option>
          </select>
          <button type="button" className="primary">검색</button>
        </div>
      </section>

      <section className="section-card">
        <h3 className="panel-title">참여자 목록</h3>
        <div className="project-table-wrap">
          <table className="project-table participants-table">
            <colgroup>
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>기본역할</th>
                <th>이름</th>
                <th>연락처</th>
                <th>참여프로젝트 수</th>
                <th>상태</th>
                <th>최근활동</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><span className="chip">{row.role}</span></td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.projectCount}개</td>
                  <td><span className={statusClass(row.status)}>{row.status}</span></td>
                  <td>{row.recentActivity}</td>
                  <td>
                    <div className="proj-mgmt-action-buttons">
                      <button type="button" className="proj-mgmt-action-btn" title="수정">
                        <Pencil className="mini-icon" />
                      </button>
                      <button type="button" className="proj-mgmt-action-btn danger" title="삭제">
                        <Trash2 className="mini-icon" />
                      </button>
                      <button type="button" className="proj-mgmt-action-btn" title="상세">
                        <Eye className="mini-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
