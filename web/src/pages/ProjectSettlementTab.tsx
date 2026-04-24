import React from "react";
import {
  CircleDollarSign,
  CheckCircle2,
  Clock3,
  PauseCircle,
  Search,
  Filter,
  Download,
  Check,
  MoreHorizontal,
  Info,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  Calendar,
  Eye,
  Trash2,
  X
} from "lucide-react";

interface ProjectSettlementTabProps {
  project: {
    id: string;
    name: string;
    pm: string;
  };
}

export const ProjectSettlementTab: React.FC<ProjectSettlementTabProps> = ({ project }) => {
  const [data, setData] = React.useState([
    { id: 1, name: "김지은", role: "PM", basis: "직접하위 실적", expected: 8000000, confirmed: 0, status: "waiting", date: "2026-06-05" },
    { id: 2, name: "박민수", role: "간사", basis: "프로젝트팀원 실적", expected: 5200000, confirmed: 0, status: "waiting", date: "2026-06-05" },
    { id: 3, name: "이서연", role: "프로젝트팀원", basis: "프로젝트팀원 실적", expected: 2100000, confirmed: 2100000, status: "completed", date: "2026-05-29" },
    { id: 4, name: "최영준", role: "프로젝트팀원", basis: "프로젝트팀원 실적", expected: 1800000, confirmed: 1800000, status: "completed", date: "2026-05-29" },
    { id: 5, name: "정민아", role: "프로젝트팀원", basis: "프로젝트팀원 실적", expected: 1450000, confirmed: 0, status: "hold", date: "-" },
    { id: 6, name: "한상혁", role: "간사", basis: "직접하위 실적", expected: 6500000, confirmed: 0, status: "waiting", date: "2026-06-05" },
    { id: 7, name: "오지훈", role: "프로젝트팀원", basis: "프로젝트팀원 실적", expected: 1250000, confirmed: 1250000, status: "completed", date: "2026-05-29" },
    { id: 8, name: "조유진", role: "프로젝트팀원", basis: "프로젝트팀원 실적", expected: 1200000, confirmed: 0, status: "waiting", date: "2026-06-05" },
  ]);

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const [history, setHistory] = React.useState([
    { date: "2026-05-29", time: "15:20", title: "지급 완료 (24건)", amount: "총 23,150,000 원", color: "#10b981" },
    { date: "2026-05-22", time: "14:10", title: "지급 완료 (18건)", amount: "총 12,450,000 원", color: "#10b981" },
    { date: "2026-05-15", time: "11:35", title: "지급 완료 (21건)", amount: "총 20,100,000 원", color: "#10b981" },
    { date: "2026-05-08", time: "10:05", title: "지급 완료 (19건)", amount: "총 18,400,000 원", color: "#10b981" },
  ]);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return value.toLocaleString() + " 원";
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleApprove = () => {
    if (selectedIds.length === 0) {
      alert("항목을 선택해주세요.");
      return;
    }
    setData(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, status: "requested", confirmed: item.expected } : item
    ));
    alert(`${selectedIds.length}건이 지급요청 상태로 변경되었습니다.`);
    setSelectedIds([]);
  };

  const handleRegisterPayment = () => {
    if (selectedIds.length === 0) {
      alert("항목을 선택해주세요.");
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    
    const newLog = {
      date: dateStr,
      time: timeStr,
      title: `지급 완료 (${selectedIds.length}건)`,
      amount: `총 ${totalConfirmed.toLocaleString()} 원`,
      color: "#10b981"
    };

    setData(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, status: "completed" } : item
    ));
    
    setHistory(prev => [newLog, ...prev]);

    alert(`${selectedIds.length}건이 지급완료 처리되었으며 이력에 기록되었습니다.`);
    setSelectedIds([]);
  };

  const selectedData = data.filter(item => selectedIds.includes(item.id));
  const totalExpected = selectedData.reduce((sum, item) => sum + item.expected, 0);
  const totalConfirmed = selectedData.reduce((sum, item) => sum + item.confirmed, 0);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "waiting": return "승인대기";
      case "requested": return "지급요청";
      case "completed": return "지급완료";
      case "hold": return "보류";
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "waiting": return "status-waiting";
      case "requested": return "status-requested";
      case "completed": return "status-completed";
      case "hold": return "status-hold";
      default: return "";
    }
  };
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="settlement-tab-container" style={{ gap: '8px' }}>
      <section className="section-card basic-hero-card" style={{ marginBottom: '8px' }}>
        <div className="basic-title-row">
          <h2>{project.name}</h2>
          <div className="basic-owner">
            <span className="status running">운영중</span>
            <strong>PM {project.pm}</strong>
          </div>
        </div>

        <div className="basic-top-cards" style={{ marginTop: '24px' }}>
          <div className="basic-top-card">
            <div className="basic-icon blue"><CircleDollarSign size={24} /></div>
            <div className="stat-info-compact">
              <span>지급예정 총액</span>
              <strong>₩ 48,750,000</strong>
              <small>예정 집계 기준</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon green"><CheckCircle2 size={24} /></div>
            <div className="stat-info-compact">
              <span>지급완료 건수</span>
              <strong>24 건</strong>
              <small>지급완료 35.3%</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon orange"><Clock3 size={24} /></div>
            <div className="stat-info-compact">
              <span>승인대기</span>
              <strong>9 건</strong>
              <small>총액 12,350,000 원</small>
            </div>
          </div>
          <div className="basic-top-card">
            <div className="basic-icon purple"><PauseCircle size={24} /></div>
            <div className="stat-info-compact">
              <span>보류 건수</span>
              <strong>2 건</strong>
              <small>총액 2,400,000 원</small>
            </div>
          </div>
        </div>
      </section>

      <div className="settlement-main-layout">
        <div className="settlement-left-col">

          {/* Main Table Card */}
          <section className="section-card settlement-table-card">
            <header className="table-header">
              <div className="header-left">
                <h3>개인별 보상 내역 <span className="confidential-small-badge"><Lock size={12} /> 대외비</span></h3>
              </div>
              <div className="header-right">
                <select className="form-select">
                  <option>전체 상태</option>
                </select>
                <div className="search-box">
                  <input type="text" placeholder="이름, 역할 검색" />
                  <Search size={16} />
                </div>
                <button type="button" className="filter-btn">
                  <Filter size={16} /> 필터
                </button>
              </div>
            </header>

            <div className="table-wrapper">
              <table className="settlement-table">
                <thead>
                  <tr>
                    <th className="check-cell">
                      <input 
                        type="checkbox" 
                        onChange={handleToggleSelectAll} 
                        checked={selectedIds.length === data.length && data.length > 0}
                      />
                    </th>
                    <th>대상자</th>
                    <th>역할</th>
                    <th>실적기준</th>
                    <th>지급예정액</th>
                    <th>지급확정액</th>
                    <th>상태</th>
                    <th>지급예정일</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className={selectedIds.includes(item.id) ? "selected-row" : ""}>
                      <td className="check-cell">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(item.id)} 
                          onChange={() => handleToggleSelect(item.id)}
                        />
                      </td>
                      <td className="name-cell">{item.name}</td>
                      <td>{item.role}</td>
                      <td>{item.basis}</td>
                      <td className="amount-cell">{formatCurrency(item.expected)}</td>
                      <td className="amount-cell">{formatCurrency(item.confirmed)}</td>
                      <td>
                        <span className={`status-capsule ${getStatusClass(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td>{item.date}</td>
                      <td className="action-cell">
                      <div className="btn-group">
                        <button type="button" className="action-btn-std blue" onClick={() => handleOpenModal(item)}><Eye size={18} /></button>
                        <button type="button" className="action-btn-std red" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-footer">
              <span className="total-count">전체 35건</span>
              <div className="pagination-controls">
                <button type="button" className="page-nav-btn"><ChevronLeft size={16} /></button>
                <button type="button" className="page-num-btn active">1</button>
                <button type="button" className="page-num-btn">2</button>
                <button type="button" className="page-num-btn">3</button>
                <button type="button" className="page-num-btn">4</button>
                <button type="button" className="page-nav-btn"><ChevronRight size={16} /></button>
              </div>
              <select className="form-select mini">
                <option>10 / 페이지</option>
              </select>
            </div>
          </section>

          {/* Bottom Approval Panel */}
          <section className="settlement-approval-panel">
            <div className="approval-header-row">
              <div className="panel-title">
                <h3>정산 승인 패널 <Info size={16} className="info-icon" /></h3>
              </div>
              <div className="summary-group">
                <div className="summary-item">
                  <span>선택된 항목 <strong>{selectedIds.length} 건</strong></span>
                </div>
                <div className="summary-item">
                  <span className="divider">|</span>
                  <span>총 지급예정액 <strong>{formatCurrency(totalExpected)}</strong></span>
                </div>
                <div className="summary-item">
                  <span className="divider">|</span>
                  <span>총 지급확정액 <strong>{formatCurrency(totalConfirmed)}</strong></span>
                </div>
              </div>
            </div>
            
            <div className="approval-action-row">
              <div className="action-btns-left">
                <button type="button" className="outline-btn" onClick={handleApprove}><Check size={16} /> 승인</button>
                <button type="button" className="outline-btn purple" onClick={() => alert('보류 처리되었습니다.')}><PauseCircle size={16} /> 보류</button>
                <button type="button" className="outline-btn" onClick={() => alert('엑셀 다운로드를 시작합니다.')}><Download size={16} /> 엑셀다운로드</button>
              </div>
              <button type="button" className="primary-btn settlement-final-btn" onClick={handleRegisterPayment}>지급완료</button>
            </div>
            
            <div className="panel-footer-note">
               <Info size={14} /> 승인 시 '지급확정액'이 확정되며, 이후 지급등록을 통해 실제 지급이 진행됩니다.
            </div>
          </section>
        </div>

        <div className="settlement-right-col">
          {/* Permission Guide */}
          <section className="section-card sidebar-card">
            <header className="card-header">
              <div className="header-title">
                <CheckCircle2 size={18} className="blue" />
                <h3>권한 안내</h3>
              </div>
            </header>
            <div className="permission-list">
              <div className="permission-item">
                <span className="p-label">프로그램<br/>매니저</span>
                <span className="p-desc">모든 보상 정보 조회/관리</span>
              </div>
              <div className="permission-item">
                <span className="p-label">PM</span>
                <span className="p-desc">담당 조직원 보상 조회/관리</span>
              </div>
              <div className="permission-item">
                <span className="p-label">본인</span>
                <span className="p-desc">본인 보상 정보 조회</span>
              </div>
            </div>
          </section>

          {/* Payment Rule Summary */}
          <section className="section-card sidebar-card">
            <header className="card-header">
              <div className="header-title">
                <Lock size={18} className="blue" />
                <h3>지급 규칙 요약</h3>
              </div>
            </header>
            <div className="rule-summary">
              <div className="rule-item"><span>지급 기준</span><strong>조건 달성 시</strong></div>
              <div className="rule-item"><span>지급 방식</span><strong>역할별 정액 지급</strong></div>
              <div className="rule-item"><span>지급 주기</span><strong>월 단위 지급</strong></div>
              <div className="rule-item"><span>정산 통화</span><strong>KRW (원)</strong></div>
              <div className="rule-item"><span>세금 처리</span><strong>원천징수 후 지급</strong></div>
              <div className="rule-info-box">
                <Info size={14} /> 상세 규칙은 조건/보상규칙 탭에서 확인하세요.
              </div>
            </div>
          </section>

          {/* Recent History */}
          <section className="section-card sidebar-card">
            <header className="card-header">
              <div className="header-title">
                <h3>최근 정산 이력</h3>
              </div>
              <button type="button" className="text-btn" onClick={() => setIsHistoryModalOpen(true)}>더보기 &gt;</button>
            </header>
            <div className="history-list">
              {history.slice(0, 3).map((log, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-dot" style={{ backgroundColor: log.color }}></div>
                  <div className="history-content">
                    <div className="history-top">
                      <span className="history-date">{log.date} <small>{log.time}</small></span>
                    </div>
                    <div className="history-bottom">
                      <strong>{log.title}</strong>
                      <span className="history-amount">{log.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Detail Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content settlement-detail-modal">
            <header className="modal-header">
              <h3>보상 내역 상세</h3>
              <button type="button" className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </header>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>대상자</label>
                  <span>{selectedItem?.name} ({selectedItem?.role})</span>
                </div>
                <div className="detail-item">
                  <label>실적기준</label>
                  <span>{selectedItem?.basis}</span>
                </div>
                <div className="detail-item">
                  <label>지급예정액</label>
                  <strong className="amount">{formatCurrency(selectedItem?.expected)}</strong>
                </div>
                <div className="detail-item">
                  <label>상태 수정</label>
                  <select className="form-select" defaultValue={selectedItem?.status}>
                    <option value="waiting">승인대기</option>
                    <option value="requested">지급요청</option>
                    <option value="completed">지급완료</option>
                    <option value="hold">보류</option>
                  </select>
                </div>
                <div className="detail-item full">
                  <label>비고</label>
                  <textarea className="form-control" placeholder="상세 내용을 입력하세요" defaultValue="정상 달성에 따른 지급 예정"></textarea>
                </div>
              </div>
            </div>
            <footer className="modal-footer">
              <button type="button" className="outline-btn" onClick={handleCloseModal}>취소</button>
              <button type="button" className="primary-btn">수정</button>
            </footer>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content settlement-history-modal">
            <header className="modal-header header-with-filters">
              <h3>기간별 정산목록</h3>
              <div className="modal-filter-group">
                <div className="filter-inputs">
                  <input type="date" className="form-select sm" defaultValue="2026-05-01" />
                  <span>~</span>
                  <input type="date" className="form-select sm" defaultValue="2026-05-31" />
                </div>
                <button type="button" className="primary-btn sm">조회</button>
              </div>
            </header>
            <div className="modal-body">
              <div className="history-info-row compact">
                <div className="info-left">
                  <span>총 <strong className="black">{history.reduce((sum, log) => {
                    const match = log.title.match(/\((\d+)건\)/);
                    return sum + (match ? parseInt(match[1]) : 0);
                  }, 0)}</strong> 건</span>
                </div>
                <div className="info-right">
                  <span>누적 지급액 <strong className="blue">{history.reduce((sum, log) => {
                    const val = parseInt(log.amount.replace(/[^0-9]/g, ""));
                    return sum + (isNaN(val) ? 0 : val);
                  }, 0).toLocaleString()}</strong> 원</span>
                </div>
              </div>

              <table className="compact-table">
                <thead>
                  <tr>
                    <th className="text-left">날짜/시간</th>
                    <th className="text-center">구분</th>
                    <th className="text-left">내역</th>
                    <th className="text-right">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((log, idx) => (
                    <tr key={idx}>
                      <td className="text-left">{log.date} {log.time}</td>
                      <td className="text-center"><span className="status-capsule status-completed">지급완료</span></td>
                      <td className="text-left">{log.title}</td>
                      <td className="text-right"><strong>{log.amount}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="modal-footer">
              <button type="button" className="primary-btn" onClick={() => setIsHistoryModalOpen(false)}>닫기</button>
            </footer>
          </div>
        </div>
      )}
    </div>
      </div>
    </div>
  );
};
