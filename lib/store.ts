'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Team, Submission, Score, Announcement, Phase, PhaseConfig, AgentSession, AgentMessage, AgentType } from './types';

// ==================== AUTH STORE ====================
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            _hasHydrated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'mih-auth',
            onRehydrateStorage: () => () => {
                useAuthStore.setState({ _hasHydrated: true });
            },
        }
    )
);

// Hook to check if auth store has hydrated from localStorage
export const useAuthHydrated = () => useAuthStore((s) => s._hasHydrated);

// ==================== PHASE STORE ====================
const defaultPhases: PhaseConfig[] = [
    { id: 'enrollment', name: 'Enrollment', description: 'Team registration', icon: 'UserPlus', active: true, order: 0 },
    { id: 'ideation', name: 'Ideation', description: 'Idea submission', icon: 'Lightbulb', active: false, order: 1 },
    { id: 'development', name: 'Development', description: 'Build your project', icon: 'Code', active: false, order: 2 },
    { id: 'hackathon', name: '24h Hackathon', description: 'Final sprint', icon: 'Zap', active: false, order: 3 },
    { id: 'results', name: 'Results', description: 'Winners announced', icon: 'Trophy', active: false, order: 4 },
];

interface PhaseState {
    phases: PhaseConfig[];
    togglePhase: (id: Phase) => void;
    getCurrentPhase: () => PhaseConfig | undefined;
}

export const usePhaseStore = create<PhaseState>()(
    persist(
        (set, get) => ({
            phases: defaultPhases,
            togglePhase: (id) =>
                set((state) => ({
                    phases: state.phases.map((p) =>
                        p.id === id ? { ...p, active: !p.active } : p
                    ),
                })),
            getCurrentPhase: () => {
                const phases = get().phases;
                // Return the highest-order active phase
                return [...phases].filter(p => p.active).sort((a, b) => b.order - a.order)[0];
            },
        }),
        { name: 'mih-phases' }
    )
);

// ==================== TEAM STORE ====================
interface TeamState {
    teams: Team[];
    addTeam: (team: Team) => void;
    updateTeam: (id: string, updates: Partial<Team>) => void;
    removeTeam: (id: string) => void;
    getTeam: (id: string) => Team | undefined;
    getTeamByUserId: (userId: string) => Team | undefined;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            teams: [],
            addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
            updateTeam: (id, updates) =>
                set((state) => ({
                    teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                })),
            removeTeam: (id) =>
                set((state) => ({ teams: state.teams.filter((t) => t.id !== id) })),
            getTeam: (id) => get().teams.find((t) => t.id === id),
            getTeamByUserId: (userId) => get().teams.find((t) => t.leader.email === userId || t.members.some(m => m.email === userId)),
        }),
        { name: 'mih-teams' }
    )
);

// ==================== SUBMISSION STORE ====================
interface SubmissionState {
    submissions: Submission[];
    addSubmission: (submission: Submission) => void;
    updateSubmission: (id: string, updates: Partial<Submission>) => void;
    getSubmissionsByTeam: (teamId: string) => Submission[];
    getSubmissionsByPhase: (phase: Phase) => Submission[];
    getSubmission: (id: string) => Submission | undefined;
}

export const useSubmissionStore = create<SubmissionState>()(
    persist(
        (set, get) => ({
            submissions: [],
            addSubmission: (submission) =>
                set((state) => ({ submissions: [...state.submissions, submission] })),
            updateSubmission: (id, updates) =>
                set((state) => ({
                    submissions: state.submissions.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                })),
            getSubmissionsByTeam: (teamId) =>
                get().submissions.filter((s) => s.teamId === teamId),
            getSubmissionsByPhase: (phase) =>
                get().submissions.filter((s) => s.phase === phase),
            getSubmission: (id) => get().submissions.find((s) => s.id === id),
        }),
        { name: 'mih-submissions' }
    )
);

// ==================== SCORE STORE ====================
interface ScoreState {
    scores: Score[];
    addScore: (score: Score) => void;
    updateScore: (id: string, updates: Partial<Score>) => void;
    getScoresByTeam: (teamId: string) => Score[];
    getReleasedScores: (teamId: string) => Score[];
    toggleRelease: (id: string) => void;
}

export const useScoreStore = create<ScoreState>()(
    persist(
        (set, get) => ({
            scores: [],
            addScore: (score) =>
                set((state) => ({ scores: [...state.scores, score] })),
            updateScore: (id, updates) =>
                set((state) => ({
                    scores: state.scores.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                })),
            getScoresByTeam: (teamId) =>
                get().scores.filter((s) => s.teamId === teamId),
            getReleasedScores: (teamId) =>
                get().scores.filter((s) => s.teamId === teamId && s.released),
            toggleRelease: (id) =>
                set((state) => ({
                    scores: state.scores.map((s) =>
                        s.id === id ? { ...s, released: !s.released } : s
                    ),
                })),
        }),
        { name: 'mih-scores' }
    )
);

// ==================== ANNOUNCEMENT STORE ====================
interface AnnouncementState {
    announcements: Announcement[];
    addAnnouncement: (announcement: Announcement) => void;
    updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
    removeAnnouncement: (id: string) => void;
    getPinnedAnnouncements: () => Announcement[];
}

export const useAnnouncementStore = create<AnnouncementState>()(
    persist(
        (set, get) => ({
            announcements: [],
            addAnnouncement: (announcement) =>
                set((state) => ({ announcements: [announcement, ...state.announcements] })),
            updateAnnouncement: (id, updates) =>
                set((state) => ({
                    announcements: state.announcements.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                })),
            removeAnnouncement: (id) =>
                set((state) => ({
                    announcements: state.announcements.filter((a) => a.id !== id),
                })),
            getPinnedAnnouncements: () =>
                get().announcements.filter((a) => a.pinned),
        }),
        { name: 'mih-announcements' }
    )
);

// ==================== AGENT STORE ====================
interface AgentState {
    sessions: AgentSession[];
    createSession: (teamId: string, agentType: AgentType) => string;
    addMessage: (sessionId: string, message: AgentMessage) => void;
    getSession: (sessionId: string) => AgentSession | undefined;
    getSessionsByTeam: (teamId: string) => AgentSession[];
}

export const useAgentStore = create<AgentState>()(
    persist(
        (set, get) => ({
            sessions: [],
            createSession: (teamId, agentType) => {
                const id = crypto.randomUUID();
                const session: AgentSession = {
                    id,
                    teamId,
                    agentType,
                    messages: [],
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({ sessions: [...state.sessions, session] }));
                return id;
            },
            addMessage: (sessionId, message) =>
                set((state) => ({
                    sessions: state.sessions.map((s) =>
                        s.id === sessionId
                            ? { ...s, messages: [...s.messages, message] }
                            : s
                    ),
                })),
            getSession: (sessionId) =>
                get().sessions.find((s) => s.id === sessionId),
            getSessionsByTeam: (teamId) =>
                get().sessions.filter((s) => s.teamId === teamId),
        }),
        { name: 'mih-agents' }
    )
);
