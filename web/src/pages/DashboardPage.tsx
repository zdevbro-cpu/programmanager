import React from 'react';
import { 
  TrendingUp, Users, Package, Target, Clock, AlertCircle, 
  ChevronRight, ExternalLink, PlusCircle, UserPlus, Bell, 
  BarChart3, Calendar, MoreVertical, Info, CheckCircle2,
  Trophy, ArrowUpRight, ArrowDownRight, FileText, LayoutDashboard,
  Settings, Briefcase, Zap, X, MessageSquare, AlertTriangle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container" style={{ padding: '16px 20px', maxWidth: '1600px', margin: '0 auto', background: '#f4f6fb', minHeight: '100vh', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      
      {/* 1. Header Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a2438', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>대시보드</h1>
          <p style={{ margin: 0, color: '#5f6c87', fontSize: '13px' }}>전체 프로그램과 프로젝트 운영 현황을 한눈에 확인합니다.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select style={{ height: '34px', padding: '0 10px', borderRadius: '6px', border: '1px solid #dfe6f3', background: '#fff', fontSize: '13px', color: '#1a2438', outline: 'none', cursor: 'pointer' }}>
            <option>기간: 이번 달</option>
            <option>기간: 지난 달</option>
            <option>기간: 최근 3개월</option>
          </select>
        </div>
      </header>

      {/* 2. Top Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '12px' }}>
        {[
          { label: "전체 프로젝트", value: "18", unit: "개", desc: "전체 프로젝트 수", icon: <Package size={20} />, iconBg: "#eff6ff", iconColor: "#2563eb" },
          { label: "진행중 프로젝트", value: "12", unit: "개", desc: "전체의 66.7%", icon: <Zap size={20} />, iconBg: "#f0fdf4", iconColor: "#16a34a" },
          { label: "총 참여자", value: "428", unit: "명", desc: "전월 대비 +5.2%", icon: <Users size={20} />, iconBg: "#eff6ff", iconColor: "#2563eb" },
          { label: "이번달 모집 실적", value: "1,245", unit: "명", desc: "목표 1,500명", icon: <UserPlus size={20} />, iconBg: "#faf5ff", iconColor: "#9333ea" },
          { label: "이번달 판매 실적", value: "2,860", unit: "세트", desc: "목표 3,600세트", icon: <BarChart3 size={20} />, iconBg: "#eff6ff", iconColor: "#2563eb" },
          { label: "평균 목표 달성률", value: "79.4", unit: "%", desc: "전월 대비 +3.1%", icon: <Target size={20} />, iconBg: "#f0fdf4", iconColor: "#16a34a" },
        ].map((stat, idx) => (
          <div key={idx} className="section-card" style={{ padding: '12px 14px', borderRadius: '10px', background: '#fff', border: '1px solid #dfe6f3', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: stat.iconBg, color: stat.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#5f6c87', display: 'block', marginBottom: '1px' }}>{stat.label}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <strong style={{ fontSize: '18px', fontWeight: 800, color: '#1a2438' }}>{stat.value}</strong>
                <span style={{ fontSize: '12px', color: '#1a2438', fontWeight: 500 }}>{stat.unit}</span>
              </div>
              <small style={{ fontSize: '10px', color: stat.desc.includes('+') ? '#16a34a' : '#7a869f', display: 'block' }}>{stat.desc}</small>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Alert Info Bar */}
      <div style={{ background: '#f4f8ff', border: '1px solid #d8e3fb', borderRadius: '8px', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e5cc8', fontSize: '12px', fontWeight: 500 }}>
          <Info size={14} />
          <span>실적은 공개되며, 개인별 보상액은 보상/정산 메뉴에서 권한에 따라 별도로 관리됩니다.</span>
        </div>
        <button style={{ border: 0, background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></button>
      </div>

      {/* 4. Middle Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '16px', marginBottom: '16px', alignItems: 'stretch' }}>
        
        {/* Left: Project Progress Table */}
        <section className="section-card" style={{ padding: '14px 18px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', height: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a2438', margin: 0, display: 'flex', alignItems: 'center' }}>프로젝트 진행 현황</h3>
            <MoreVertical size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
          </header>
          <div style={{ flex: 1, maxHeight: '325px', overflowY: 'auto', borderBottom: '1px solid #f1f5f9' }}>
            <table className="activity-table-std" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8fafc' }}>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ width: '32px', padding: '6px', textAlign: 'center' }}></th>
                  <th style={{ padding: '6px', textAlign: 'left', color: '#64748b' }}>프로젝트명</th>
                  <th style={{ width: '70px', padding: '6px', textAlign: 'center', color: '#64748b' }}>PM</th>
                  <th style={{ width: '80px', padding: '6px', textAlign: 'center', color: '#64748b' }}>단계</th>
                  <th style={{ width: '180px', padding: '6px', textAlign: 'center', color: '#64748b' }}>기간</th>
                  <th style={{ width: '120px', padding: '6px', textAlign: 'center', color: '#64748b' }}>달성률</th>
                  <th style={{ width: '70px', padding: '6px', textAlign: 'center', color: '#64748b' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: "2026 유아도서 판매 프로모션", pm: "김민수", step: "4단계", period: "2026-05-01 ~ 2026-07-31", progress: 79.4, status: "진행중", color: "running" },
                  { id: 2, name: "시니어 독서 리더 양성 프로젝트", pm: "한상혁", step: "3단계", period: "2026-05-10 ~ 2026-08-15", progress: 62.8, status: "진행중", color: "running" },
                  { id: 3, name: "월간 구독회원 모집 프로젝트", pm: "이지은", step: "2단계", period: "2026-06-01 ~ 2026-06-30", progress: 48.2, status: "모집중", color: "planning" },
                  { id: 4, name: "관리회원 전환 캠페인", pm: "박민수", step: "5단계", period: "2026-04-20 ~ 2026-06-25", progress: 91.1, status: "정산중", color: "waiting" },
                  { id: 5, name: "지역 거점 확보 프로젝트", pm: "최유진", step: "1단계", period: "2026-06-01 ~ 2026-08-31", progress: 22.5, status: "준비중", color: "planning" },
                  { id: 6, name: "유아전집 체험단 모집", pm: "오지은", step: "6단계", period: "2026-04-01 ~ 2026-05-30", progress: 100, status: "완료", color: "completed" },
                  { id: 7, name: "독서 코칭 프로그램", pm: "강동원", step: "2단계", period: "2026-07-01 ~ 2026-09-30", progress: 15.0, status: "준비중", color: "planning" },
                  { id: 8, name: "북클럽 멤버십 강화", pm: "정우성", step: "3단계", period: "2026-06-15 ~ 2026-08-15", progress: 38.5, status: "진행중", color: "running" },
                  { id: 9, name: "신규 관리자 교육 캠페인", pm: "김하늘", step: "1단계", period: "2026-07-15 ~ 2026-10-15", progress: 5.0, status: "준비중", color: "planning" },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px', textAlign: 'center' }}><span style={{ display: 'inline-flex', width: '18px', height: '18px', borderRadius: '4px', background: row.id === 1 ? '#eff6ff' : '#f1f5f9', color: row.id === 1 ? '#2563eb' : '#94a3b8', fontSize: '10px', fontWeight: 700, alignItems: 'center', justifyContent: 'center' }}>{row.id}</span></td>
                    <td style={{ padding: '6px', fontWeight: 600, color: '#1e293b' }}>{row.name}</td>
                    <td style={{ padding: '6px', textAlign: 'center' }}>{row.pm}</td>
                    <td style={{ padding: '6px', textAlign: 'center' }}>{row.step}</td>
                    <td style={{ padding: '6px', textAlign: 'center', color: '#64748b', fontSize: '11px' }}>{row.period}</td>
                    <td style={{ padding: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.progress}%`, height: '100%', background: row.progress === 100 ? '#16a34a' : '#2563eb' }}></div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 600, width: '30px', textAlign: 'right' }}>{row.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center' }}><span className={`status ${row.color}`} style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: 🚨 긴급 알림 & 실적 TOP 프로젝트 (최신 스크린샷 스타일로 전면 개편) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 긴급 알림 */}
          <section className="section-card" style={{ padding: '16px 20px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a2438', margin: 0 }}>긴급 알림</h3>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </header>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: "지연 프로젝트", count: "2", unit: "건", icon: <AlertTriangle size={16} />, color: "#ef4444", bg: "#fef2f2" },
                { label: "승인대기", count: "9", unit: "건", icon: <Clock size={16} />, color: "#f59e0b", bg: "#fffbeb" },
                { label: "오늘 마감", count: "3", unit: "건", icon: <Clock size={16} />, color: "#2563eb", bg: "#eff6ff" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: idx === 2 ? 0 : '1px solid #f1f5f9' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{item.label}</span>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    <strong style={{ fontSize: '18px', fontWeight: 800, color: item.color }}>{item.count}</strong>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 실적 TOP 프로젝트 */}
          <section className="section-card" style={{ padding: '16px 20px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a2438', margin: 0 }}>실적 TOP 프로젝트</h3>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: "2026 유아도서 판매 프로모션", sales: "2,860세트", rec: "1,245명", rank: 1, color: "#fbbf24", bg: "#fffbeb" },
                { name: "시니어 독서 리더 양성 프로젝트", sales: "1,320세트", rec: "842명", rank: 2, color: "#cbd5e1", bg: "#f8fafc" },
                { name: "관리회원 전환 캠페인", sales: "1,028세트", rec: "715명", rank: 3, color: "#f97316", bg: "#fff7ed" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: item.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>{item.rank}</div>
                  <div style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    판매 <span style={{ fontWeight: 700, color: '#475569' }}>{item.sales}</span> / 모집 <span style={{ fontWeight: 700, color: '#475569' }}>{item.rec}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 5. Bottom Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
        
        {/* Left: Monthly Performance Chart */}
        <section className="section-card" style={{ padding: '16px 20px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', height: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a2438', margin: 0, display: 'flex', alignItems: 'center' }}>월별 성과 추이</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#2563eb' }}></div><span style={{ fontSize: '11px' }}>판매</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #38bdf8' }}></div><span style={{ fontSize: '11px' }}>달성</span></div>
            </div>
          </header>
          <div style={{ flex: 1, position: 'relative', marginTop: '15px', padding: '10px 40px 30px 45px' }}>
            <div style={{ position: 'absolute', left: 0, top: -5, fontSize: '11px', color: '#94a3b8' }}>(세트)</div>
            <div style={{ position: 'absolute', right: 0, top: -5, fontSize: '11px', color: '#94a3b8' }}>(%)</div>
            <div style={{ position: 'absolute', left: 0, top: 10, bottom: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '10px', color: '#94a3b8' }}><span>4,000</span><span>3,000</span><span>2,000</span><span>1,000</span><span>0</span></div>
            <div style={{ position: 'absolute', right: 0, top: 10, bottom: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4].map(i => <line key={i} x1="0" y1={40 * i} x2="300" y2={40 * i} stroke="#f1f5f9" strokeWidth="1" />)}
              {[40, 55, 70, 85, 100, 120].map((h, idx) => <rect key={idx} x={20 + idx * 50} y={160 - h} width="16" height={h} fill="#2563eb" rx="2" />)}
              <path d="M28,140 L78,125 L128,110 L178,95 L228,80 L278,65" fill="none" stroke="#38bdf8" strokeWidth="2" />
              {[
                { x: 28, y: 140, v: "45.2%" }, { x: 78, y: 125, v: "52.1%" }, { x: 128, y: 110, v: "58.7%" }, 
                { x: 178, y: 95, v: "64.3%" }, { x: 228, y: 80, v: "72.8%" }, { x: 278, y: 65, v: "79.4%" }
              ].map((p, idx) => <g key={idx}><circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#38bdf8" strokeWidth="2" /><text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">{p.v}</text></g>)}
              {["1월", "2월", "3월", "4월", "5월", "6월"].map((m, idx) => <text key={idx} x={28 + idx * 50} y="175" textAnchor="middle" fontSize="10" fill="#94a3b8">{m}</text>)}
            </svg>
          </div>
        </section>

        {/* Center: Participants by Role */}
        <section className="section-card" style={{ padding: '16px 20px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <header style={{ marginBottom: '10px', height: '24px', display: 'flex', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a2438', margin: 0 }}>역할별 참여자 현황</h3>
          </header>
          
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0', position: 'relative', marginTop: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', paddingTop: '5px' }}>
              {["PM", "간사", "프로젝트팀원"].map(label => (
                <span key={label} style={{ fontSize: '13px', fontWeight: 600, color: '#475569', height: '24px', display: 'flex', alignItems: 'center' }}>{label}</span>
              ))}
            </div>
            <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '35px', paddingTop: '5px' }}>
              {[{ w: '15%', v: "12명" }, { w: '35%', v: "36명" }, { w: '85%', v: "380명" }].map((row, idx) => (
                <div key={idx} style={{ height: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: row.w, height: '16px', background: '#2563eb', borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{ gridColumn: '2', display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
              <span style={{ marginLeft: '-5px' }}>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500 (명)</span>
            </div>
          </div>
        </section>

        {/* Right: Recent Activities */}
        <section className="section-card" style={{ padding: '16px 20px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', height: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a2438', margin: 0, display: 'flex', alignItems: 'center' }}>최근 활동</h3>
            <button style={{ border: 0, background: 'transparent', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>더보기 <ChevronRight size={14} /></button>
          </header>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            {[
              { text: "김하늘님이 참여자로 등록되었습니다.", time: "10분 전", icon: <UserPlus size={16} />, color: "#2563eb" },
              { text: "2026 유아도서 판매 실적이 승인되었습니다.", time: "32분 전", icon: <CheckCircle2 size={16} />, color: "#16a34a" },
              { text: "프로그램 운영 공지가 등록되었습니다.", time: "1시간 전", icon: <Bell size={16} />, color: "#2563eb" },
              { text: "이규민님이 참여자로 등록되었습니다.", time: "2시간 전", icon: <UserPlus size={16} />, color: "#2563eb" },
              { text: "월간 구독회원 모집 프로젝트가 생성되었습니다.", time: "3시간 전", icon: <PlusCircle size={16} />, color: "#ef4444" },
              { text: "신규 관리 지침이 공지되었습니다.", time: "5시간 전", icon: <FileText size={16} />, color: "#64748b" },
            ].map((activity, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #f1f5f9', color: activity.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{activity.icon}</div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activity.text}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', flexShrink: 0, width: '50px', textAlign: 'right' }}>{activity.time}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. Footer */}
      <footer className="section-card" style={{ padding: '16px 24px', borderRadius: '12px', background: '#fff', border: '1px solid #dfe6f3', display: 'flex', alignItems: 'center', gap: '40px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, minWidth: '150px' }}>프로그램 게시판 요약</h4>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', gap: '60px' }}>
          {[{ icon: <Bell size={18} />, label: "공지사항", val: "16", color: "#0ea5e9" }, { icon: <MessageSquare size={18} />, label: "미답변 문의", val: "7", color: "#8b5cf6" }, { icon: <FileText size={18} />, label: "최근 업로드 자료", val: "24", color: "#2563eb" }].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f8fafc', color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
              <span style={{ fontSize: '14px' }}>{item.label}</span>
              <strong style={{ fontSize: '18px' }}>{item.val}</strong>
              <span style={{ fontSize: '13px', color: '#64748b' }}>건</span>
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
};
