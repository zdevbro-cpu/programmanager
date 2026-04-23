export type ParticipantRole = "PM" | "Admin" | "프로젝트팀원" | "거점" | "전문가";
export type ParticipantStatus = "approved" | "pending" | "rejected";

export interface ParticipantItem {
  id: string;
  name: string;
  phone: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  projectId: string;
  projectName: string;
  inviter: string;
  joinedAt: string;
  performanceCount: number;
}
