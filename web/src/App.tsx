import { useState } from "react";
import {
  Bell,
  Filter,
  Folder,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Users
} from "lucide-react";
import { ConditionManagementPage } from "./pages/ConditionManagementPage";
import { ParticipantsManagementPage } from "./pages/ParticipantsManagementPage";
import { ProgramBoardPage } from "./pages/ProgramBoardPage";
import { ProjectManagementPage } from "./pages/ProjectManagementPage";
import logoImg from "./assets/logo.png";

type MenuKey = "dashboard" | "projects" | "participants" | "conditions" | "program_board";

const MENUS: { key: MenuKey; label: string; icon: JSX.Element }[] = [
  { key: "dashboard", label: "대시보드", icon: <LayoutDashboard className="nav-icon" /> },
  { key: "projects", label: "프로젝트관리", icon: <Folder className="nav-icon" /> },
  { key: "participants", label: "참여자관리", icon: <Users className="nav-icon" /> },
  { key: "conditions", label: "조건 관리", icon: <Filter className="nav-icon" /> },
  { key: "program_board", label: "프로그램 게시판", icon: <MessageSquare className="nav-icon" /> }
];

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="page-head">
      <h1>
        <span className="logo-mark page-logo" aria-hidden="true">
          <span className="logo-dot" />
        </span>
        {title}
      </h1>
      <p>이 화면은 다음 단계에서 구현 예정입니다.</p>
    </div>
  );
}

export default function App() {
  const [currentMenu, setCurrentMenu] = useState<MenuKey>("projects");

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="top-left">
          <button type="button" className="menu-btn" aria-label="메뉴">
            <Menu className="top-icon" />
          </button>
          <img src={logoImg} alt="" className="brand-logo-img" />
          <strong className="brand">LAS 프로그램매니저</strong>
        </div>
        <div className="top-right">
          <button type="button" className="menu-btn" aria-label="알림">
            <Bell className="top-icon" />
          </button>
          <div className="user-pill">
            <span className="avatar">관</span>
            <span>시스템관리자</span>
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav>
            {MENUS.map((menu) => (
              <button
                key={menu.key}
                type="button"
                className={currentMenu === menu.key ? "nav-btn active" : "nav-btn"}
                onClick={() => setCurrentMenu(menu.key)}
              >
                {menu.icon}
                {menu.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main">
          {currentMenu === "conditions" ? <ConditionManagementPage /> : null}
          {currentMenu === "projects" ? <ProjectManagementPage /> : null}
          {currentMenu === "dashboard" ? <ComingSoonPage title="대시보드" /> : null}
          {currentMenu === "participants" ? <ParticipantsManagementPage /> : null}
          {currentMenu === "program_board" ? <ProgramBoardPage /> : null}
        </main>
      </div>
    </div>
  );
}
