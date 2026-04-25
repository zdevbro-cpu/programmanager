import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Download, Eye, Info, Search, Trash2, Upload, UserPlus2 } from "lucide-react";

type ParticipantStatus = "활동중" | "승인대기" | "보류";

type ParticipantRow = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  projectCount: number;
  status: ParticipantStatus;
  recentActivity: string;
  projectIds: string[];
};

type ParticipantDraft = {
  role: string;
  name: string;
  email: string;
  phone: string;
  status: ParticipantStatus;
};

type ParticipantsManagementPageProps = {
  projectId?: string;
  projectName?: string;
};

const INITIAL_PARTICIPANTS: ParticipantRow[] = [
  { id: "PT-0001", role: "PM", name: "김지훈", email: "jihun.kim@las.co.kr", phone: "010-2384-1123", projectCount: 3, status: "활동중", recentActivity: "2026-06-03", projectIds: ["PRJ-2026-0001", "PRJ-2026-0005", "PRJ-2026-0006"] },
  { id: "PT-0002", role: "Admin", name: "박민지", email: "minji.park@las.co.kr", phone: "010-5512-4482", projectCount: 2, status: "활동중", recentActivity: "2026-06-02", projectIds: ["PRJ-2026-0001", "PRJ-2026-0003"] },
  { id: "PT-0003", role: "프로젝트팀원", name: "이서윤", email: "seoyun.lee@las.co.kr", phone: "010-8831-2901", projectCount: 1, status: "승인대기", recentActivity: "2026-06-01", projectIds: ["PRJ-2026-0002"] },
  { id: "PT-0004", role: "프로젝트팀원", name: "최유리", email: "yuri.choi@las.co.kr", phone: "010-7742-1108", projectCount: 2, status: "활동중", recentActivity: "2026-05-31", projectIds: ["PRJ-2026-0001", "PRJ-2026-0004"] },
  { id: "PT-0005", role: "프로젝트팀원", name: "정현우", email: "hyunwoo.jeong@las.co.kr", phone: "010-9124-7703", projectCount: 1, status: "보류", recentActivity: "2026-05-30", projectIds: ["PRJ-2026-0001"] },
  { id: "PT-0006", role: "Admin", name: "유다은", email: "daeun.yu@las.co.kr", phone: "010-6682-4419", projectCount: 4, status: "활동중", recentActivity: "2026-05-29", projectIds: ["PRJ-2026-0001", "PRJ-2026-0003", "PRJ-2026-0005", "PRJ-2026-0006"] }
];

function emptyDraft(): ParticipantDraft {
  return { role: "프로젝트팀원", name: "", email: "", phone: "", status: "활동중" };
}

function statusClass(status: ParticipantStatus) {
  if (status === "활동중") return "status running";
  if (status === "승인대기") return "status settling";
  return "status closed";
}

function toCsv(rows: ParticipantRow[]) {
  const header = ["기본역할", "이름", "이메일", "연락처", "참여프로젝트 수", "상태", "최근활동"];
  const lines = rows.map((row) => [row.role, row.name, row.email, row.phone, `${row.projectCount}`, row.status, row.recentActivity]);
  return [header, ...lines]
    .map((line) => line.map((field) => `"${String(field).replace(/"/g, "\"\"")}"`).join(","))
    .join("\n");
}

export function ParticipantsManagementPage({ projectId, projectName }: ParticipantsManagementPageProps) {
  const isProjectScoped = Boolean(projectId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rows, setRows] = useState<ParticipantRow[]>(INITIAL_PARTICIPANTS);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState<"전체" | ParticipantStatus>("전체");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState<ParticipantDraft>(emptyDraft());

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailDraft, setDetailDraft] = useState<ParticipantDraft | null>(null);

  const filteredRows = useMemo(() => {
    const base = isProjectScoped ? rows.filter((item) => item.projectIds.includes(projectId as string)) : rows;
    return base.filter((item) => {
      const byKeyword =
        !keyword.trim() ||
        item.name.includes(keyword.trim()) ||
        item.email.includes(keyword.trim()) ||
        item.phone.includes(keyword.trim());
      const byRole = roleFilter === "전체" || item.role === roleFilter;
      const byStatus = statusFilter === "전체" || item.status === statusFilter;
      return byKeyword && byRole && byStatus;
    });
  }, [isProjectScoped, keyword, projectId, roleFilter, rows, statusFilter]);

  const roleOptions = useMemo(() => ["전체", ...Array.from(new Set(rows.map((item) => item.role)))], [rows]);
  const detailRow = useMemo(() => (detailId ? rows.find((item) => item.id === detailId) ?? null : null), [detailId, rows]);

  const onAddParticipant = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newParticipant.name.trim();
    const email = newParticipant.email.trim();
    const phone = newParticipant.phone.trim();
    if (!name || !email || !phone) return;

    const nextId = `PT-${String(rows.length + 1).padStart(4, "0")}`;
    const today = new Date().toISOString().slice(0, 10);
    const next: ParticipantRow = {
      id: nextId,
      role: newParticipant.role,
      name,
      email,
      phone,
      projectCount: isProjectScoped ? 1 : 0,
      status: newParticipant.status,
      recentActivity: today,
      projectIds: isProjectScoped && projectId ? [projectId] : []
    };

    setRows((prev) => [next, ...prev]);
    setNewParticipant(emptyDraft());
    setShowAddForm(false);
  };

  const onBulkRegister = () => fileInputRef.current?.click();

  const onBulkFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const parsed = lines
        .map((line) => line.split(",").map((cell) => cell.trim()))
        .filter((cells) => cells.length >= 4)
        .map((cells, index) => {
          const status = cells[5] as ParticipantStatus | undefined;
          const safeStatus: ParticipantStatus =
            status === "활동중" || status === "승인대기" || status === "보류" ? status : "활동중";
          return {
            id: `PT-${String(rows.length + index + 1).padStart(4, "0")}`,
            role: cells[0] || "프로젝트팀원",
            name: cells[1] || "",
            email: cells[2] || "",
            phone: cells[3] || "",
            projectCount: Number.parseInt(cells[4] || "0", 10) || (isProjectScoped ? 1 : 0),
            status: safeStatus,
            recentActivity: cells[6] || new Date().toISOString().slice(0, 10),
            projectIds: isProjectScoped && projectId ? [projectId] : []
          } as ParticipantRow;
        })
        .filter((item) => item.name && item.email && item.phone);

      if (parsed.length > 0) {
        setRows((prev) => [...parsed, ...prev]);
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  const onExcelDownload = () => {
    const blob = new Blob([`\uFEFF${toCsv(filteredRows)}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `participants_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const onDelete = (id: string) => {
    setRows((prev) => prev.filter((item) => item.id !== id));
    if (detailId === id) {
      setDetailId(null);
      setDetailDraft(null);
    }
  };

  const onOpenDetail = (row: ParticipantRow) => {
    setDetailId(row.id);
    setDetailDraft({ role: row.role, name: row.name, email: row.email, phone: row.phone, status: row.status });
  };

  const onCancelDetail = () => {
    setDetailId(null);
    setDetailDraft(null);
  };

  const onSaveDetail = () => {
    if (!detailId || !detailDraft) return;
    const name = detailDraft.name.trim();
    const email = detailDraft.email.trim();
    const phone = detailDraft.phone.trim();
    if (!name || !email || !phone) return;

    setRows((prev) =>
      prev.map((item) =>
        item.id === detailId
          ? { ...item, role: detailDraft.role, name, email, phone, status: detailDraft.status }
          : item
      )
    );
    onCancelDetail();
  };

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
        {isProjectScoped ? "선택한 프로젝트 참여자만 표시됩니다." : "전체 프로젝트 참여자 목록을 표시합니다."}
      </div>

      <section className="section-card">
        <div className="participants-top-row">
          <h2 className="participants-project-title">
            {isProjectScoped ? (projectName ?? "프로젝트 참여자") : "참여자 관리"}
          </h2>
          <div className="participants-actions">
            <button type="button" className="ghost icon-btn-inline" onClick={onExcelDownload}>
              <Download className="mini-icon" />
              엑셀다운로드
            </button>
            <button type="button" className="ghost icon-btn-inline" onClick={onBulkRegister}>
              <Upload className="mini-icon" />
              일괄등록
            </button>
            <button type="button" className="primary icon-btn-inline" onClick={() => setShowAddForm((prev) => !prev)}>
              <UserPlus2 className="mini-icon" />
              참여자 추가
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: "none" }}
            onChange={onBulkFileChange}
          />
        </div>

        {showAddForm ? (
          <form className="participants-add-form" onSubmit={onAddParticipant}>
            <select value={newParticipant.role} onChange={(e) => setNewParticipant((p) => ({ ...p, role: e.target.value }))}>
              <option>PM</option>
              <option>Admin</option>
              <option>프로젝트팀원</option>
            </select>
            <input value={newParticipant.name} placeholder="이름" onChange={(e) => setNewParticipant((p) => ({ ...p, name: e.target.value }))} />
            <input value={newParticipant.email} placeholder="이메일" onChange={(e) => setNewParticipant((p) => ({ ...p, email: e.target.value }))} />
            <input value={newParticipant.phone} placeholder="연락처" onChange={(e) => setNewParticipant((p) => ({ ...p, phone: e.target.value }))} />
            <select value={newParticipant.status} onChange={(e) => setNewParticipant((p) => ({ ...p, status: e.target.value as ParticipantStatus }))}>
              <option>활동중</option>
              <option>승인대기</option>
              <option>보류</option>
            </select>
            <button type="submit" className="primary-btn-premium">저장</button>
          </form>
        ) : null}

        <div className="participants-filters-row participants-filters-simple">
          <div className="search-box">
            <input value={keyword} placeholder="이름, 이메일, 연락처 검색" onChange={(e) => setKeyword(e.target.value)} />
            <Search className="mini-icon" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {roleOptions.map((option) => (
              <option key={option} value={option}>기본역할: {option}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "전체" | ParticipantStatus)}>
            <option value="전체">상태: 전체</option>
            <option value="활동중">상태: 활동중</option>
            <option value="승인대기">상태: 승인대기</option>
            <option value="보류">상태: 보류</option>
          </select>
          <button type="button" className="primary-btn-premium">검색</button>
        </div>
      </section>

      <section className="section-card">
        <h3 className="panel-title">참여자 목록</h3>
        <div className="project-table-wrap">
          <table className="project-table participants-table">
            <colgroup>
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "11%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>기본역할</th>
                <th>이름</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>참여프로젝트 수</th>
                <th>상태</th>
                <th>최근활동</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td><span className="chip">{row.role}</span></td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{row.projectCount}개</td>
                  <td><span className={statusClass(row.status)}>{row.status}</span></td>
                  <td>{row.recentActivity}</td>
                  <td>
                    <div className="proj-mgmt-action-buttons">
                      <button type="button" className="proj-mgmt-action-btn danger" title="삭제" onClick={() => onDelete(row.id)}>
                        <Trash2 className="mini-icon" />
                      </button>
                      <button type="button" className="proj-mgmt-action-btn" title="상세" onClick={() => onOpenDetail(row)}>
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

      {detailRow && detailDraft ? (
        <div className="participants-modal-overlay" role="dialog" aria-modal="true">
          <div className="participants-modal">
            <h3>참여자 상세</h3>
            <div className="participants-modal-grid">
              <label>
                기본역할
                <select value={detailDraft.role} onChange={(e) => setDetailDraft((p) => (p ? { ...p, role: e.target.value } : p))}>
                  <option>PM</option>
                  <option>Admin</option>
                  <option>프로젝트팀원</option>
                </select>
              </label>
              <label>
                이름
                <input value={detailDraft.name} onChange={(e) => setDetailDraft((p) => (p ? { ...p, name: e.target.value } : p))} />
              </label>
              <label>
                연락처
                <input value={detailDraft.phone} onChange={(e) => setDetailDraft((p) => (p ? { ...p, phone: e.target.value } : p))} />
              </label>
              <label>
                이메일
                <input value={detailDraft.email} onChange={(e) => setDetailDraft((p) => (p ? { ...p, email: e.target.value } : p))} />
              </label>
              <label>
                상태
                <select value={detailDraft.status} onChange={(e) => setDetailDraft((p) => (p ? { ...p, status: e.target.value as ParticipantStatus } : p))}>
                  <option>활동중</option>
                  <option>승인대기</option>
                  <option>보류</option>
                </select>
              </label>
              <label>
                참여프로젝트 수
                <input value={`${detailRow.projectCount}개`} readOnly />
              </label>
              <label>
                최근활동
                <input value={detailRow.recentActivity} readOnly />
              </label>
            </div>
            <div className="participants-modal-actions">
              <button type="button" className="primary-btn-premium" onClick={onSaveDetail}>수정</button>
              <button type="button" className="ghost" onClick={onCancelDetail}>취소</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
