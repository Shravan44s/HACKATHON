export type Phase = 'enrollment' | 'ideation' | 'development' | 'hackathon' | 'results';

export type UserRole = 'admin' | 'participant';

export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'feedback_received' | 'approved' | 'rejected';

export type TeamStatus = 'enrolled' | 'active' | 'submitted' | 'completed';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Team {
  id: string;
  teamName: string;
  leader: {
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;
  };
  members: TeamMember[];
  domain: string;
  problemStatement: string;
  status: TeamStatus;
  enrolledAt: string;
  teamSize: number;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // base64 or blob url
  thumbnail?: string;
}

export interface Submission {
  id: string;
  teamId: string;
  phase: Phase;
  content: {
    projectTitle?: string;
    problemStatement?: string;
    proposedSolution?: string;
    targetAudience?: string;
    techStack?: string[];
    videoPitchUrl?: string;
    githubRepoUrl?: string;
    progressUpdate?: string;
    blockers?: string;
    nextSteps?: string;
    milestones?: { id: string; text: string; completed: boolean }[];
    demoLink?: string;
    isFinalSubmission?: boolean;
    whatChanged?: string;
    whatsWorking?: string;
    whatsBroken?: string;
  };
  files: FileAttachment[];
  status: SubmissionStatus;
  adminComment?: string;
  adminNotes?: string; // private admin notes
  judgeComments?: { id: string; judge: string; comment: string; timestamp: string }[];
  submittedAt: string;
  updatedAt: string;
}

export interface ScoreCriteria {
  [key: string]: number; // e.g., innovation: 8, feasibility: 7
}

export interface Score {
  id: string;
  teamId: string;
  phase: Phase;
  round: number;
  criteria: ScoreCriteria;
  total: number;
  released: boolean;
  notes?: string;
  evaluator?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  target: 'all' | 'specific_team' | 'specific_phase';
  targetId?: string; // team id or phase name
  createdAt: string;
  pinned: boolean;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AgentSession {
  id: string;
  teamId: string;
  agentType: AgentType;
  messages: AgentMessage[];
  createdAt: string;
}

export type AgentType = 
  | 'guide' 
  | 'idea' 
  | 'pitch' 
  | 'code' 
  | 'image' 
  | 'logo' 
  | 'readme' 
  | 'coach' 
  | 'techstack';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string;
}

export interface PhaseConfig {
  id: Phase;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
}

export interface AgentInfo {
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  inputFields?: { name: string; label: string; type: 'text' | 'textarea' | 'select'; options?: string[] }[];
  isChat: boolean;
}
