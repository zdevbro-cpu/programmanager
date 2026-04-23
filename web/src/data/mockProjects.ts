import type { ProjectItem } from "../types/project";

export const mockProjects: ProjectItem[] = [
  {
    id: "PROJ-2026-001",
    name: "2026 유아도서 판매 프로모션",
    code: "P-BOOK-2601",
    status: "running",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    manager: "김서연 PM",
    participants: 49,
    performanceRate: 68,
    expectedReward: 18200000
  },
  {
    id: "PROJ-2026-002",
    name: "구독회원 확장 캠페인 2차",
    code: "P-SUB-2602",
    status: "recruiting",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    manager: "이진호 PM",
    participants: 21,
    performanceRate: 24,
    expectedReward: 7600000
  },
  {
    id: "PROJ-2026-003",
    name: "관리회원 리텐션 강화",
    code: "P-RET-2601",
    status: "planning",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    manager: "박다은 PM",
    participants: 0,
    performanceRate: 0,
    expectedReward: 0
  },
  {
    id: "PROJ-2026-004",
    name: "전문가 모집 집중 프로젝트",
    code: "P-REC-2601",
    status: "settling",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    manager: "한주형 PM",
    participants: 63,
    performanceRate: 91,
    expectedReward: 23600000
  }
];
