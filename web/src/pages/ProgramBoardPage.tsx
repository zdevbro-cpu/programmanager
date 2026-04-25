import React, { useState } from 'react';
import { 
  Search, Plus, Bell, Paperclip, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Info, Clock, PenTool, 
  CalendarDays, User, Users, RefreshCcw, Download, Calendar, FileText,
  ChevronRight as ChevronRightIcon, X, Upload, Check
} from 'lucide-react';

export const ProgramBoardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allPosts = [
    { id: 236, category: "공지사항", title: "[공지] 2026년 LAS 프로그램 일정 및 통합 운영 안내", author: "시스템관리자", date: "2026-06-01 10:30", views: 1245, comments: 12, files: 3, color: "blue-light" },
    { id: 235, category: "공지사항", title: "[필독] LAS 프로그램 운영 규정 및 유의사항 개정 안내", author: "시스템관리자", date: "2026-05-29 14:12", views: 982, comments: 8, files: 2, color: "blue-light" },
    { id: 234, category: "업무지시", title: "6월 프로그램 운영일정 및 주요 변경사항 준수 요청", author: "운영관리자", date: "2026-05-28 09:15", views: 321, comments: 4, files: 1, color: "red-light" },
    { id: 233, category: "공지사항", title: "정부 지원사업 변경 지침(2026년) 프로그램 적용 안내", author: "정책담당자", date: "2026-05-27 16:45", views: 412, comments: 2, files: 1, color: "blue-light" },
    { id: 232, category: "질의응답", title: "프로그램 정산 증빙 서류 제출 관련 FAQ 업데이트", author: "운영팀", date: "2026-05-26 11:22", views: 204, comments: 15, files: 0, color: "orange-light" },
    { id: 231, category: "활동보고", title: "상반기 프로그램 활동 우수 사례 공유 및 시상 안내", author: "운영관리자", date: "2026-05-22 17:00", views: 167, comments: 5, files: 2, color: "purple-light" },
    { id: 230, category: "자료실", title: "LAS 프로그램 브랜딩 가이드 및 로고 데이터 배포", author: "디자인팀", date: "2026-05-20 13:40", views: 93, comments: 0, files: 5, color: "green-light" },
    { id: 229, category: "자료실", title: "2026년 프로그램 운영 매뉴얼 (최종본) 다운로드", author: "시스템관리자", date: "2026-05-18 10:05", views: 156, comments: 3, files: 1, color: "green-light" },
    { id: 228, category: "공지사항", title: "LAS 프로그램 핵심 가치 및 슬로건 공유", author: "운영관리자", date: "2026-05-15 16:20", views: 211, comments: 1, files: 1, color: "blue-light" },
    { id: 227, category: "공지사항", title: "차세대 프로그램 지원 시스템 고도화 일정 안내", author: "IT팀", date: "2026-05-14 09:50", views: 273, comments: 6, files: 1, color: "blue-light" },
  ];

  const categories = [
    { label: "공지사항", color: "blue-light" },
    { label: "업무지시", color: "red-light" },
    { label: "질의응답", color: "orange-light" },
    { label: "활동보고", color: "purple-light" },
    { label: "자료실", color: "green-light" },
  ];

  return (
    <div className="activity-tab-container">
      {/* 🚨 타이틀: LAS 프로그램 게시판 */}
      <section className="section-card basic-hero-card" style={{ marginBottom: '24px' }}>
        <div className="basic-title-row">
          <h2 style={{ fontSize: '20px' }}>LAS 프로그램 게시판</h2>
          <div className="basic-owner">
            <span className="status running">운영중</span>
            <strong style={{ fontSize: '13px' }}>Admin 시스템관리자</strong>
          </div>
        </div>

        <div className="basic-top-cards" style={{ gap: '12px' }}>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon blue"><FileText className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '12px' }}>전체 게시글</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>1,248건</strong>
            </div>
          </div>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon green"><CalendarDays className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '12px' }}>오늘 활동</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>42건</strong>
            </div>
          </div>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon orange"><Bell className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '12px' }}>공지 등록</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>16건</strong>
            </div>
          </div>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon purple"><RefreshCcw className="mini-icon" /></div>
            <div>
              <span style={{ fontSize: '12px' }}>최근 업데이트</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>85건</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="activity-main-grid" style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '24px', alignItems: 'stretch' }}>
        <div className="activity-left-col" style={{ display: 'flex', flexDirection: 'column' }}>
          <section className="section-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <header className="table-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button 
                type="button" 
                className="pboard-btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 18px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 0, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} /> 게시물 등록
              </button>
            </header>

            <div style={{ flex: 1 }}>
              <table className="activity-table-std" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center', padding: '8px' }}>번호</th>
                    <th style={{ width: '85px', textAlign: 'center', padding: '8px' }}>유형</th>
                    <th className="text-left" style={{ textAlign: 'center', padding: '8px' }}>제목</th>
                    <th style={{ width: '110px', textAlign: 'center', padding: '8px' }}>작성자</th>
                    <th style={{ width: '120px', textAlign: 'center', padding: '8px' }}>작성일</th>
                    <th style={{ width: '60px', textAlign: 'center', padding: '8px' }}>댓글수</th>
                    <th style={{ width: '50px', textAlign: 'center', padding: '8px' }}>첨부</th>
                    <th style={{ width: '60px', textAlign: 'center', padding: '8px' }}>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="text-center gray-text" style={{ padding: '8px' }}>{post.id}</td>
                      <td className="text-center" style={{ padding: '8px' }}>
                        <span className={`chip-std ${post.color}`} style={{ width: '68px', display: 'inline-flex', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{post.category}</span>
                      </td>
                      <td className="text-left font-600" style={{ color: '#1e293b', cursor: 'pointer', padding: '8px' }}>{post.title}</td>
                      <td className="text-center" style={{ padding: '8px' }}>{post.author}</td>
                      <td className="text-center gray-text" style={{ padding: '8px' }}>{post.date.split(' ')[0]}</td>
                      <td className="text-center" style={{ padding: '8px' }}>{post.comments || "-"}</td>
                      <td className="text-center gray-text" style={{ padding: '8px' }}>
                        {post.files > 0 ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}><Paperclip size={11} />{post.files}</div> : "-"}
                      </td>
                      <td className="text-center gray-text" style={{ padding: '8px' }}>{post.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-wrap-std" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div className="pagination-left">
                <span className="total-count" style={{ fontSize: '12px', color: '#64748b' }}>총 {allPosts.length}건</span>
              </div>
              <div className="page-numbers-std">
                <button type="button" className="page-btn-sq" style={{ width: '28px', height: '28px' }}><ChevronLeft size={12} /></button>
                <button type="button" className="page-btn-sq active" style={{ width: '28px', height: '28px' }}>1</button>
                <button type="button" className="page-btn-sq" style={{ width: '28px', height: '28px' }}>2</button>
                <button type="button" className="page-btn-sq" style={{ width: '28px', height: '28px' }}>3</button>
                <button type="button" className="page-btn-sq" style={{ width: '28px', height: '28px' }}>4</button>
                <button type="button" className="page-btn-sq" style={{ width: '28px', height: '28px' }}>5</button>
                <button type="button" className="page-btn-sq" style={{ width: '28px', height: '28px' }}><ChevronRight size={12} /></button>
              </div>
            </div>
          </section>
        </div>

        <div className="activity-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section className="section-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#3b82f6' }}>
              <Info size={16} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>프로그램 게시판 안내</h3>
            </div>
            <ul className="guide-list" style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: '4px' }}>
              {categories.map((item, idx) => (
                <li key={idx} style={{ fontSize: '12px', display: 'flex', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <b style={{ color: '#334155' }}>{item.label}:</b> <span style={{ color: '#64748b' }}>전체 프로그램 관련 내용을 확인합니다.</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="section-card" style={{ padding: '16px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#1e293b' }}>최근 프로그램 활동</h3>
              <button style={{ border: 0, background: 'transparent', fontSize: '11px', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>더보기 <ChevronRightIcon size={12} /></button>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { status: "활동보고", title: "6월 프로그램 운영 보고", user: "운영팀", date: "2026-06-02", color: "purple-light" },
                { status: "공지사항", title: "LAS 지원 시스템 고도화", user: "IT개발팀", date: "2026-06-01", color: "blue-light" },
                { status: "업무지시", title: "분기별 정산 서류 제출 건", author: "시스템관리자", user: "관리부", date: "2026-06-01", color: "red-light" },
                { status: "질의응답", title: "FAQ 추가 업데이트 안내", author: "운영팀", user: "운영관리자", date: "2026-05-31", color: "orange-light" },
                { status: "자료실", title: "브랜딩 가이드 최종 배포", author: "디자인팀", user: "디자인팀", date: "2026-05-31", color: "green-light" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '2px 0' }}>
                  <span className={`chip-std ${item.color}`} style={{ width: '68px', fontSize: '9px', padding: '2px 0', display: 'inline-flex', justifyContent: 'center', fontWeight: 700 }}>{item.status}</span>
                  <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.user}</div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>{item.date.split('-').slice(1).join('-')}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card" style={{ padding: '16px', flex: 1 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#1e293b' }}>통합 일정</h3>
              <button style={{ border: 0, background: 'transparent', fontSize: '11px', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>전체 <ChevronRightIcon size={12} /></button>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { title: "상반기 성과 보고회", date: "2026-06-15" },
                { title: "LAS 프로그램 만족도 조사", date: "06-20 ~ 06-30" },
                { title: "통합 운영 시스템 점검", date: "06-25 23:00" },
                { title: "하반기 운영안내 오리엔테이션", date: "2026-07-01" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={12} style={{ color: '#94a3b8' }} />
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.date}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 게시물 등록 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content section-card" style={{ width: '600px', padding: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'hsl(217, 91%, 95%)', color: 'hsl(217, 91%, 60%)', padding: '8px', borderRadius: '8px' }}><PenTool size={20} /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>게시물 등록</h3>
              </div>
              <button style={{ border: 0, background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </header>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>게시글 유형</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {categories.map((cat, idx) => (
                    <button 
                      key={idx} 
                      style={{ 
                        flex: 1, height: '38px', borderRadius: '6px', border: '1px solid #e2e8f0', 
                        background: idx === 0 ? '#eff6ff' : '#fff', 
                        color: idx === 0 ? '#2563eb' : '#64748b',
                        borderColor: idx === 0 ? '#3b82f6' : '#e2e8f0',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        whiteSpace: 'nowrap', padding: '0 4px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>제목</label>
                <input 
                  type="text" 
                  placeholder="제목을 입력해 주세요" 
                  style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>내용</label>
                <textarea 
                  placeholder="내용을 입력해 주세요" 
                  style={{ width: '100%', height: '180px', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>첨부파일</label>
                <div style={{ width: '100%', height: '80px', border: '2px dashed #e2e8f0', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc' }}>
                  <Upload size={20} style={{ color: '#94a3b8' }} />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>파일을 드래그하거나 클릭하여 업로드 (최대 20MB)</span>
                </div>
              </div>
            </div>

            <footer style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                style={{ height: '40px', padding: '0 20px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button 
                style={{ height: '40px', padding: '0 24px', borderRadius: '6px', border: 0, background: '#2563eb', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setIsModalOpen(false)}
              >
                <Check size={18} /> 저장하기
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* 스타일 오버라이드 */}
      <style>{`
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};


