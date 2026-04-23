import { Info, Search } from "lucide-react";

export function ProgramBoardPage() {
  return (
    <>
      <div className="page-head">
        <h1>프로그램 게시판</h1>
        <p>전체 프로그램 공지, 운영안내, 공통자료를 관리합니다.</p>
      </div>

      <div className="notice-box">
        <Info className="mini-icon blue" />
        프로그램 게시판은 전체 프로젝트 공통 커뮤니케이션 공간입니다.
      </div>

      <section className="section-card">
        <div className="participants-filters-row">
          <div className="search-box">
            <input placeholder="제목, 내용 검색" />
            <Search className="mini-icon" />
          </div>
          <select><option>분류: 전체</option></select>
          <select><option>작성자 선택</option></select>
          <select><option>기간 선택</option></select>
        </div>
      </section>

      <div className="stats-row four">
        <div className="stat-card"><span>전체 게시글</span><strong>236건</strong><small>전체 게시글 수</small></div>
        <div className="stat-card"><span>공지사항</span><strong>16건</strong><small>공지 등록 수</small></div>
        <div className="stat-card"><span>미답변 문의</span><strong>7건</strong><small>답변 대기 중</small></div>
        <div className="stat-card"><span>최근 업로드 자료</span><strong>24건</strong><small>최근 30일</small></div>
      </div>

      <div className="participants-actions">
        <button type="button" className="ghost">글쓰기</button>
        <button type="button" className="ghost">공지등록</button>
        <button type="button" className="primary">자료업로드</button>
      </div>

      <div className="project-grid">
        <section className="section-card">
          <table className="project-table">
            <thead>
              <tr><th>번호</th><th>분류</th><th>제목</th><th>프로그램/범위</th><th>작성자</th><th>작성일</th><th>조회수</th><th>상태</th></tr>
            </thead>
            <tbody>
              <tr><td>236</td><td><span className="chip">공지</span></td><td>[공지] 2026년 프로그램 일정 및 운영 안내</td><td>전체 프로그램</td><td>시스템관리자</td><td>2026-05-28</td><td>1,245</td><td><span className="status running">공지</span></td></tr>
              <tr><td>235</td><td><span className="chip">공지</span></td><td>[필독] 프로그램 운영 규정 및 유의사항 안내</td><td>전체 프로그램</td><td>시스템관리자</td><td>2026-05-20</td><td>982</td><td><span className="status running">공지</span></td></tr>
              <tr><td>234</td><td><span className="chip">운영공지</span></td><td>6월 운영일정 및 주요 변경사항 안내</td><td>전체 프로그램</td><td>운영관리자</td><td>2026-05-27</td><td>321</td><td><span className="status planning">일반</span></td></tr>
              <tr><td>233</td><td><span className="chip">정책안내</span></td><td>정부 지원사업 변경 지침(2026년) 안내</td><td>전체 프로그램</td><td>정책담당자</td><td>2026-05-26</td><td>412</td><td><span className="status planning">일반</span></td></tr>
            </tbody>
          </table>
        </section>

        <section className="right-col">
          <aside className="panel">
            <h3 className="panel-title">고정 공지</h3>
            <ul className="simple-list">
              <li><span>[공지] 2026년 프로그램 일정 및 운영...</span><strong>2026-05-28</strong></li>
              <li><span>[필독] 프로그램 운영 규정 및 유의사...</span><strong>2026-05-20</strong></li>
              <li><span>시스템 점검 안내 (5/31 00:00~02:00)</span><strong>2026-05-23</strong></li>
            </ul>
          </aside>
          <aside className="panel">
            <h3 className="panel-title">최근 댓글</h3>
            <ul className="simple-list">
              <li><span>6월 운영일정 및 주요 변경사항 안내</span><strong>4분 전</strong></li>
              <li><span>정부 지원사업 변경 지침(2026년) 안내</span><strong>1시간 전</strong></li>
              <li><span>정산 제출 서식 모음 (2026년 ver.)</span><strong>2시간 전</strong></li>
            </ul>
          </aside>
          <aside className="panel">
            <h3 className="panel-title">게시판 운영 가이드</h3>
            <ul className="guide-list">
              <li>공지사항은 중요 내용을 전체에 안내할 때 사용합니다.</li>
              <li>Q&A는 문의 후 답변을 받을 수 있습니다.</li>
              <li>자료실은 공용 자료를 공유합니다.</li>
              <li>부적절한 게시글은 관리자에 의해 삭제될 수 있습니다.</li>
            </ul>
          </aside>
        </section>
      </div>
    </>
  );
}
