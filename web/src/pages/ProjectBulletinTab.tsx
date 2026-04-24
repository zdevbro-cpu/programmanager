import React, { useState } from 'react';
import { 
  Search, Plus, Bell, Paperclip, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Info, Clock, PenTool, 
  CalendarDays, User, Users, RefreshCcw, Download, Calendar, FileText,
  ChevronRight as ChevronRightIcon, X, Upload, Check
} from 'lucide-react';

export const ProjectBulletinTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allPosts = [
    { id: 102, category: "공지사항", title: "2026 유아도서 판매 프로모션 오리엔테이션 안내", author: "김지훈(PM)", date: "2026-06-01 10:30", views: 256, comments: 8, files: 2, color: "blue-light" },
    { id: 101, category: "공지사항", title: "프로모션 보상조건 및 지급 기준 안내", author: "김지훈(PM)", date: "2026-05-29 14:12", views: 189, comments: 4, files: 1, color: "blue-light" },
    { id: 100, category: "업무지시", title: "진행 매장 담당자 연락처 및 담당 지역 안내", author: "김지훈(PM)", date: "2026-05-28 09:15", views: 132, comments: 2, files: 1, color: "red-light" },
    { id: 99, category: "공지사항", title: "5월 실적 집계 일정 및 제출 안내", author: "김지훈(PM)", date: "2026-05-27 16:45", views: 118, comments: 3, files: 1, color: "blue-light" },
    { id: 98, category: "질의응답", title: "FAQ 업데이트 안내 (프로모션 자주 묻는 질문)", author: "김지훈(PM)", date: "2026-05-26 11:22", views: 204, comments: 6, files: 0, color: "orange-light" },
    { id: 97, category: "활동보고", title: "활동보고 작성 가이드 및 유의사항", author: "김지훈(PM)", date: "2026-05-22 17:00", views: 167, comments: 1, files: 1, color: "purple-light" },
    { id: 96, category: "자료실", title: "프로모션 교재 및 POP 배포 일정 안내", author: "운영팀", date: "2026-05-20 13:40", views: 93, comments: 0, files: 2, color: "green-light" },
    { id: 95, category: "자료실", title: "교육 세션 일정 및 참석 링크 안내", author: "운영팀", date: "2026-05-18 10:05", views: 156, comments: 3, files: 1, color: "green-light" },
    { id: 94, category: "공지사항", title: "프로모션 슬로건 및 핵심 메시지 공유", author: "김지훈(PM)", date: "2026-05-15 16:20", views: 211, comments: 2, files: 1, color: "blue-light" },
    { id: 93, category: "공지사항", title: "프로모션 일정 변경 안내 (5/30 -> 6/1)", author: "김지훈(PM)", date: "2026-05-14 09:50", views: 273, comments: 7, files: 1, color: "blue-light" },
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
      {/* 활동로그 탭과 동일한 Hero Section */}
      <section className="section-card basic-hero-card" style={{ marginBottom: '24px' }}>
        <div className="basic-title-row">
          <h2 style={{ fontSize: '20px' }}>2026 유아도서 판매 프로모션</h2>
          <div className="basic-owner">
            <span className="status running">운영중</span>
            <strong style={{ fontSize: '13px' }}>PM 김지훈</strong>
          </div>
        </div>

        <div className="basic-top-cards" style={{ gap: '12px' }}>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon blue" style={{ width: '32px', height: '32px' }}><FileText size={16} /></div>
            <div>
              <span style={{ fontSize: '12px' }}>전체 게시글</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>236건</strong>
            </div>
          </div>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon green" style={{ width: '32px', height: '32px' }}><CalendarDays size={16} /></div>
            <div>
              <span style={{ fontSize: '12px' }}>오늘 활동</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>24건</strong>
            </div>
          </div>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon orange" style={{ width: '32px', height: '32px' }}><Bell size={16} /></div>
            <div>
              <span style={{ fontSize: '12px' }}>승인 이벤트</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>158건</strong>
            </div>
          </div>
          <div className="basic-top-card" style={{ padding: '12px' }}>
            <div className="basic-icon purple" style={{ width: '32px', height: '32px' }}><RefreshCcw size={16} /></div>
            <div>
              <span style={{ fontSize: '12px' }}>변경 이력</span>
              <strong style={{ fontSize: '20px', display: 'block' }}>386건</strong>
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
              {/* 🚨 네비게이션(페이지 번호) 개수 5개로 확장 */}
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
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>프로젝트 게시판 안내</h3>
            </div>
            <ul className="guide-list" style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: '4px' }}>
              {categories.map((item, idx) => (
                <li key={idx} style={{ fontSize: '12px', display: 'flex', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <b style={{ color: '#334155' }}>{item.label}:</b> <span style={{ color: '#64748b' }}>프로젝트 관련 내용을 확인합니다.</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="section-card" style={{ padding: '16px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#1e293b' }}>최근 활동보고</h3>
              <button style={{ border: 0, background: 'transparent', fontSize: '11px', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>더보기 <ChevronRightIcon size={12} /></button>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { status: "활동보고", title: "6월 1주차 활동보고", user: "이지연(서울 강남점)", date: "2026-06-02", color: "purple-light" },
                { status: "공지사항", title: "5월 4주차 활동보고", user: "박민수(부산 해운대점)", date: "2026-06-01", color: "blue-light" },
                { status: "업무지시", title: "6월 1주차 활동보고", user: "최수빈(대구 수성점)", date: "2026-06-01", color: "red-light" },
                { status: "질의응답", title: "5월 3주차 활동보고", user: "김현우(광주 상무점)", date: "2026-05-31", color: "orange-light" },
                { status: "자료실", title: "5월 4주차 활동보고", user: "정유진(인천 부평점)", date: "2026-05-31", color: "green-light" },
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
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#1e293b' }}>주요 일정</h3>
              <button style={{ border: 0, background: 'transparent', fontSize: '11px', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>전체 <ChevronRightIcon size={12} /></button>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { title: "5월 실적 제출 마감", date: "2026-06-05" },
                { title: "보상 신청 기간", date: "06-10 ~ 06-16" },
                { title: "6월 중간 점검 회의", date: "06-15 14:00" },
                { title: "프로모션 최종 성과 보고", date: "2026-06-30" },
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
                        whiteSpace: 'nowrap',
                        padding: '0 4px',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
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


