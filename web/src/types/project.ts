export type ProjectStatus = "planning" | "recruiting" | "running" | "settling" | "closed";

export interface ProjectItem {
  id: string;
  name: string;
  code: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  manager: string;
  participants: number;
  performanceRate: number;
  expectedReward: number;
}
