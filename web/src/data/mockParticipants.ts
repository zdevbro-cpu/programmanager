import type { ParticipantItem } from "../types/participant";

export const mockParticipants: ParticipantItem[] = [
  {
    id: "PT-0001",
    name: "김서연",
    phone: "010-1234-1111",
    role: "PM",
    status: "approved",
    projectId: "PROJ-2026-001",
    projectName: "2026 유아도서 판매 프로모션",
    inviter: "시스템관리자",
    joinedAt: "2026-04-25",
    performanceCount: 18
  },
  {
    id: "PT-0002",
    name: "이진호",
    phone: "010-2234-2222",
    role: "Admin",
    status: "approved",
    projectId: "PROJ-2026-001",
    projectName: "2026 유아도서 판매 프로모션",
    inviter: "김서연",
    joinedAt: "2026-04-28",
    performanceCount: 9
  },
  {
    id: "PT-0003",
    name: "박다은",
    phone: "010-3333-3333",
    role: "전문가",
    status: "pending",
    projectId: "PROJ-2026-002",
    projectName: "구독회원 확장 캠페인 2차",
    inviter: "이진호",
    joinedAt: "2026-05-02",
    performanceCount: 0
  },
  {
    id: "PT-0004",
    name: "최민준",
    phone: "010-4444-4444",
    role: "거점",
    status: "approved",
    projectId: "PROJ-2026-001",
    projectName: "2026 유아도서 판매 프로모션",
    inviter: "김서연",
    joinedAt: "2026-05-04",
    performanceCount: 6
  },
  {
    id: "PT-0005",
    name: "정예린",
    phone: "010-5555-5555",
    role: "프로젝트팀원",
    status: "rejected",
    projectId: "PROJ-2026-002",
    projectName: "구독회원 확장 캠페인 2차",
    inviter: "이진호",
    joinedAt: "2026-05-05",
    performanceCount: 1
  }
];
