import { z } from 'zod';

export const teamMemberSchema = z.object({
    id: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role: z.string().min(1, 'Role is required'),
    employeeId: z.string().min(3, 'Employee ID is required'),
});

export const enrollmentSchema = z.object({
    teamName: z.string().min(3, 'Team name must be at least 3 characters'),
    leader: z.object({
        name: z.string().min(2, 'Name is required'),
        email: z.string().email('Invalid email'),
        phone: z.string().min(10, 'Valid phone number required'),
        employeeId: z.string().min(3, 'Employee ID is required'),
        organization: z.string().min(2, 'Organization is required'),
    }),
    members: z.array(teamMemberSchema).min(1, 'At least 1 team member is required'),
    domain: z.string().min(1, 'Project domain is required'),
    problemStatement: z.string().min(20, 'Problem statement must be at least 20 characters'),
    agreement: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export const ideationSchema = z.object({
    projectTitle: z.string().min(3, 'Project title is required'),
    problemStatement: z.string().min(20, 'Problem statement is required'),
    proposedSolution: z.string().min(20, 'Proposed solution is required'),
    targetAudience: z.string().min(5, 'Target audience is required'),
    techStack: z.array(z.string()).min(1, 'Select at least 1 technology'),
    videoPitchUrl: z.string().url().optional().or(z.literal('')),
});

export const developmentUpdateSchema = z.object({
    progressUpdate: z.string().min(10, 'Progress update is required'),
    blockers: z.string().optional(),
    nextSteps: z.string().min(5, 'Next steps are required'),
    githubRepoUrl: z.string().url().optional().or(z.literal('')),
});

export const hackathonUpdateSchema = z.object({
    whatChanged: z.string().min(5, 'Describe what changed'),
    whatsWorking: z.string().optional(),
    whatsBroken: z.string().optional(),
    demoLink: z.string().url().optional().or(z.literal('')),
    isFinalSubmission: z.boolean(),
});

export const scoreSchema = z.object({
    criteria: z.record(z.string(), z.number().min(0).max(10)),
    notes: z.string().optional(),
});

export const announcementSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    body: z.string().min(10, 'Body is required'),
    target: z.enum(['all', 'specific_team', 'specific_phase']),
    targetId: z.string().optional(),
    pinned: z.boolean(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    role: z.enum(['admin', 'participant', 'mentor']),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
export type IdeationFormData = z.infer<typeof ideationSchema>;
export type DevelopmentUpdateFormData = z.infer<typeof developmentUpdateSchema>;
export type HackathonUpdateFormData = z.infer<typeof hackathonUpdateSchema>;
export type ScoreFormData = z.infer<typeof scoreSchema>;
export type AnnouncementFormData = z.infer<typeof announcementSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
