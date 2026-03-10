import type { AgentInfo } from './types';

// Demo credentials
export const DEMO_USERS = {
    admin: { email: 'admin@makeitappen.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
    participant: { email: 'participant@test.com', password: 'test123', name: 'Test Participant', role: 'participant' as const },
};

// Known admin emails
export const ADMIN_EMAILS = ['admin@makeitappen.com'];

export function validateCredentials(email: string, password: string) {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase().trim());

    // Admin login
    if (isAdmin) {
        if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
            return {
                id: 'admin-001',
                email: DEMO_USERS.admin.email,
                name: DEMO_USERS.admin.name,
                role: 'admin' as const,
            };
        }
        return null; // Wrong admin password
    }

    // Participant: accept any email + password ≥ 4 chars
    if (email && password.length >= 4) {
        return {
            id: `user-${Date.now()}`,
            email,
            name: email.split('@')[0],
            role: 'participant' as const,
        };
    }

    return null;
}


export const AGENTS_CONFIG: AgentInfo[] = [
    {
        type: 'guide',
        name: 'Hackathon Guide Bot',
        description: 'Your AI companion throughout the hackathon. Get help with ideation, strategy, and next steps.',
        icon: '🤖',
        color: '#7c3aed',
        isChat: true,
    },
    {
        type: 'idea',
        name: 'Idea Generator',
        description: 'Generate innovative project ideas based on your domain and interests.',
        icon: '💡',
        color: '#f59e0b',
        inputFields: [
            { name: 'domain', label: 'Project Domain', type: 'select', options: ['Healthcare', 'EdTech', 'FinTech', 'AgriTech', 'Sustainability', 'Social Impact', 'AI/ML', 'IoT', 'Other'] },
            { name: 'keywords', label: 'Keywords & Interests', type: 'text' },
            { name: 'constraints', label: 'Constraints (time, team size, skills)', type: 'textarea' },
        ],
        isChat: false,
    },
    {
        type: 'pitch',
        name: 'Pitch Deck Writer',
        description: 'Create compelling slide-by-slide pitch content for your project.',
        icon: '📊',
        color: '#06b6d4',
        inputFields: [
            { name: 'projectTitle', label: 'Project Title', type: 'text' },
            { name: 'problem', label: 'Problem Statement', type: 'textarea' },
            { name: 'solution', label: 'Proposed Solution', type: 'textarea' },
            { name: 'techStack', label: 'Tech Stack', type: 'text' },
        ],
        isChat: false,
    },
    {
        type: 'code',
        name: 'Code Helper',
        description: 'Get starter code, debug help, and explanations in any language.',
        icon: '👨‍💻',
        color: '#10b981',
        isChat: true,
    },
    {
        type: 'readme',
        name: 'README Generator',
        description: 'Generate a professional GitHub README with badges and setup instructions.',
        icon: '📝',
        color: '#8b5cf6',
        inputFields: [
            { name: 'projectName', label: 'Project Name', type: 'text' },
            { name: 'description', label: 'Project Description', type: 'textarea' },
            { name: 'features', label: 'Key Features (comma-separated)', type: 'textarea' },
            { name: 'techStack', label: 'Tech Stack', type: 'text' },
            { name: 'installation', label: 'Installation Steps', type: 'textarea' },
        ],
        isChat: false,
    },
    {
        type: 'coach',
        name: 'Presentation Coach',
        description: 'Get feedback on your pitch — structure, clarity, and persuasiveness.',
        icon: '🎯',
        color: '#ef4444',
        inputFields: [
            { name: 'pitchContent', label: 'Paste your pitch content', type: 'textarea' },
        ],
        isChat: false,
    },
    {
        type: 'techstack',
        name: 'Tech Stack Advisor',
        description: 'Get personalized tech stack recommendations based on your project.',
        icon: '🔧',
        color: '#f97316',
        inputFields: [
            { name: 'problemDescription', label: 'Problem Description', type: 'textarea' },
            { name: 'teamSkills', label: 'Team Skills', type: 'text' },
            { name: 'timeConstraint', label: 'Time Available', type: 'text' },
        ],
        isChat: false,
    },
    {
        type: 'logo',
        name: 'Logo Generator',
        description: 'Get logo design concepts and prompts for your project.',
        icon: '🎨',
        color: '#ec4899',
        inputFields: [
            { name: 'projectName', label: 'Project Name', type: 'text' },
            { name: 'style', label: 'Style Keywords (modern, minimal, playful...)', type: 'text' },
            { name: 'colors', label: 'Preferred Colors', type: 'text' },
        ],
        isChat: false,
    },
    {
        type: 'image',
        name: 'Image Generator',
        description: 'Generate image concepts and prompts for mockups and diagrams.',
        icon: '🖼️',
        color: '#14b8a6',
        inputFields: [
            { name: 'description', label: 'Describe the image you need', type: 'textarea' },
            { name: 'style', label: 'Style (realistic, illustration, diagram...)', type: 'text' },
        ],
        isChat: false,
    },
];

// Hackathon config
export const HACKATHON_CONFIG = {
    name: 'Make It Happen 2026',
    startDate: '2026-04-15T09:00:00+05:30',
    endDate: '2026-04-16T09:00:00+05:30',
    registrationDeadline: '2026-04-10T23:59:59+05:30',
    maxTeamSize: 5,
    minTeamSize: 2,
    domains: ['Healthcare', 'EdTech', 'FinTech', 'AgriTech', 'Sustainability', 'Social Impact', 'AI/ML', 'IoT', 'Other'],
    techStackOptions: [
        'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
        'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
        'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust',
        'PostgreSQL', 'MongoDB', 'Firebase', 'Supabase', 'Redis',
        'TensorFlow', 'PyTorch', 'OpenAI API', 'Gemini API',
        'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
        'React Native', 'Flutter', 'Swift', 'Kotlin',
        'GraphQL', 'REST API', 'WebSocket', 'gRPC',
    ],
};
