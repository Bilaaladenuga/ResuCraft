import { ProviderConfig, AIProvider, AIPromptParams, TailorParams, PowerUpParams, SkillsParams, CoverLetterParams, ATSParams, WritingStyle, LanguageCode, FormData } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getStyleInstructions, getFallbackTone } from './prompts';
import { TRANSLATION_DICTS } from './translationDicts';

interface AIProvidersMap {
    [key: string]: AIProvider;
}

export const AI_PROVIDERS: AIProvidersMap = {
    gemini: {
        name: 'Gemini',
        storageKey: 'gemini_api_key',
        modelKey: 'gemini_model',
        defaultModel: 'gemini-2.0-flash'
    },
    openai: {
        name: 'OpenAI-compatible',
        storageKey: 'openai_api_key',
        modelKey: 'openai_model',
        baseUrlKey: 'openai_base_url',
        defaultModel: 'gpt-4o-mini',
        defaultBaseUrl: 'https://api.openai.com/v1'
    },
    openrouter: {
        name: 'OpenRouter',
        storageKey: 'openrouter_api_key',
        modelKey: 'openrouter_model',
        defaultModel: 'openai/gpt-4o-mini',
        defaultBaseUrl: 'https://openrouter.ai/api/v1'
    },
    ollama: {
        name: 'Ollama local',
        modelKey: 'ollama_model',
        baseUrlKey: 'ollama_base_url',
        defaultModel: 'llama3.2',
        defaultBaseUrl: 'http://localhost:11434'
    }
};

export const getActiveProvider = (): string => {
    if (typeof localStorage === 'undefined') return 'gemini';
    return localStorage.getItem('ai_provider') || 'gemini';
};

export const getProviderConfig = (): ProviderConfig => {
    if (typeof localStorage === 'undefined') {
        return {
            provider: 'gemini',
            label: AI_PROVIDERS.gemini.name,
            apiKey: '',
            model: AI_PROVIDERS.gemini.defaultModel,
            baseUrl: AI_PROVIDERS.gemini.defaultBaseUrl || ''
        };
    }

    const provider = getActiveProvider();
    const defaults = AI_PROVIDERS[provider] || AI_PROVIDERS.gemini;

    return {
        provider,
        label: defaults.name,
        apiKey: defaults.storageKey ? localStorage.getItem(defaults.storageKey) || '' : '',
        model: localStorage.getItem(defaults.modelKey) || defaults.defaultModel,
        baseUrl: defaults.baseUrlKey ? localStorage.getItem(defaults.baseUrlKey) || defaults.defaultBaseUrl || '' : defaults.defaultBaseUrl || ''
    };
};

const assertConfigured = (config: ProviderConfig): void => {
    if (config.provider !== 'ollama' && !config.apiKey) {
        throw new Error(`No API key configured for ${config.label}`);
    }

    if ((config.provider === 'openai' || config.provider === 'openrouter' || config.provider === 'ollama') && !config.baseUrl) {
        throw new Error(`No base URL configured for ${config.label}`);
    }
};

interface OpenAIResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
    error?: {
        message?: string;
    };
}

const parseOpenAIResponse = async (response: Response, providerLabel: string): Promise<string> => {
    const data: OpenAIResponse | null = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.error?.message || `${providerLabel} request failed with status ${response.status}`);
    }

    return data?.choices?.[0]?.message?.content?.trim() || '';
};

const callGemini = async (prompt: string, config: ProviderConfig): Promise<string> => {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.model });
    const result = await model.generateContent(prompt);
    return result.response.text();
};

const callOpenAICompatible = async (prompt: string, config: ProviderConfig): Promise<string> => {
    const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
    });

    return parseOpenAIResponse(response, config.label);
};

const callOpenRouter = async (prompt: string, config: ProviderConfig): Promise<string> => {
    const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
            'X-Title': 'ResuCraft'
        },
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
    });

    return parseOpenAIResponse(response, config.label);
};

interface OllamaResponse {
    response?: string;
    error?: string;
}

const callOllama = async (prompt: string, config: ProviderConfig): Promise<string> => {
    const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: config.model,
            prompt,
            stream: false
        })
    });
    const data: OllamaResponse | null = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.error || `Ollama request failed with status ${response.status}`);
    }

    return data?.response?.trim() || '';
};

export const generateWithProvider = async (prompt: string): Promise<string> => {
    const config = getProviderConfig();
    assertConfigured(config);

    if (config.provider === 'openai') return callOpenAICompatible(prompt, config);
    if (config.provider === 'openrouter') return callOpenRouter(prompt, config);
    if (config.provider === 'ollama') return callOllama(prompt, config);
    return callGemini(prompt, config);
};

const getPrimarySkill = (skills: string = ''): string => {
    return skills.split(',').map(skill => skill.trim()).filter(Boolean)[0] || 'cross-functional collaboration';
};

export const generateFallbackSummary = ({ name, role, experience, skills, industry }: AIPromptParams, style: WritingStyle = 'professional'): string => {
    const displayName = name || 'This candidate';
    const targetRole = role || `${industry || 'professional'} candidate`;
    const primarySkill = getPrimarySkill(skills);
    const experienceText = experience
        ? ` with experience including ${experience.split('. ')[0].toLowerCase()}`
        : '';
    const tone = getFallbackTone(style);

    if (style === 'casual') {
        return `${displayName} is a passionate ${targetRole} who loves diving into ${primarySkill} and delivering results${experienceText}. Known for clear communication and a collaborative approach, they thrive in dynamic environments and are excited to bring their energy to a ${industry || 'forward-thinking'} team.`;
    }
    if (style === 'academic') {
        return `${displayName} is a dedicated ${targetRole} whose professional practice demonstrates rigorous application of ${primarySkill} and advanced methodologies${experienceText}. Their scholarly approach to problem-solving and commitment to excellence make them a valuable contributor to ${industry || 'research-driven'} organizations.`;
    }
    // Professional (default)
    return `${displayName} is a results-driven ${targetRole}${experienceText}. Skilled in ${primarySkill}, clear communication, and practical problem solving, they bring a focused approach to delivering measurable value. They are prepared to contribute to ${industry || 'business'} teams by combining technical strengths, adaptability, and a strong attention to detail.`;
};

export const generateFallbackBullet = ({ bulletText, role, industry }: PowerUpParams, style: WritingStyle = 'professional'): string => {
    const action = bulletText.trim().replace(/[.]+$/, '');
    const context = role || `${industry || 'professional'} role`;

    if (style === 'casual') {
        return `Transformed ${action.toLowerCase()} in a ${context}, making things run smoother and delivering real results for the team.`;
    }
    if (style === 'academic') {
        return `Advanced ${action.toLowerCase()} within a ${context}, employing systematic methodologies to enhance operational outcomes and scholarly practice.`;
    }
    // Professional (default)
    return `Improved ${action.toLowerCase()} in a ${context}, strengthening team efficiency, delivery quality, and measurable business impact.`;
};

export const generateFallbackCoverLetter = ({ name, role, experience, skills, jobDescription, industry }: CoverLetterParams, style: WritingStyle = 'professional'): string => {
    const displayName = name || 'Applicant';
    const targetRole = role || `${industry || 'professional'} position`;
    const skillList = skills || 'relevant skills';
    const tone = getFallbackTone(style);

    const body = experience
        ? `In my previous roles, ${experience.split(',').slice(0, 2).join(' and ')}, I have developed expertise in ${skillList} while consistently exceeding expectations.`
        : `I bring a strong foundation in ${skillList} and a passion for driving meaningful outcomes in the ${industry || 'professional'} space.`;

    const interest = jobDescription
        ? 'the focus areas outlined in the job description closely match my professional experience and career aspirations.'
        : 'it represents a compelling opportunity to apply my skills in a challenging environment.';

    if (style === 'casual') {
        return `Hey there,

I'm really excited to apply for the ${targetRole} role! With my background in ${industry || 'the industry'} and a genuine love for what I do, I think I'd be a great fit for your team.

${body}

What caught my eye about this opportunity is that ${interest}

I'd love to chat more about how I can contribute to your team's success. Thanks for considering my application!

${tone.signOff},
${displayName}`;
    }
    if (style === 'academic') {
        return `Dear Search Committee,

I submit my application for the ${targetRole} position with great interest. My academic and professional background in ${industry || 'the field'} has prepared me to contribute meaningfully to your organization's mission.

${body}

I am particularly drawn to this opportunity because ${interest}

I welcome the opportunity to discuss how my research and professional experience align with your needs. Thank you for your time and consideration.

${tone.signOff},
${displayName}`;
    }
    // Professional (default)
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${targetRole} position. With my background in ${industry || 'the industry'} and proven track record of delivering results, I am confident that my experience aligns well with your team's needs.

${body}

I am particularly drawn to this opportunity because ${interest}

I would welcome the chance to discuss how my background and skills could contribute to your team's success. Thank you for your consideration.

${tone.signOff},
${displayName}`;
};

export const generateFallbackSkills = ({ role, rawSkills, industry }: SkillsParams): string => {
    const existing = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
    if (existing.length === 0) {
        // Suggest common skills based on industry
        const industrySkills: Record<string, string[]> = {
            technology: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Git', 'TypeScript', 'SQL', 'Docker', 'REST APIs'],
            finance: ['Financial Analysis', 'Excel', 'Risk Management', 'Financial Modeling', 'Bloomberg', 'SQL', 'Data Analysis', 'Reporting', 'Compliance', 'Forecasting'],
            healthcare: ['Patient Care', 'EMR Systems', 'Clinical Research', 'HIPAA', 'Treatment Planning', 'Medical Documentation', 'Team Collaboration', 'Diagnostics'],
            'creative design': ['Adobe Creative Suite', 'UI/UX Design', 'Figma', 'Typography', 'Brand Strategy', 'Motion Design', 'Prototyping', 'Design Systems'],
            legal: ['Legal Research', 'Contract Review', 'Litigation Support', 'Document Drafting', 'Case Management', 'Regulatory Compliance', 'Client Counseling'],
            education: ['Curriculum Development', 'Classroom Management', 'Assessment Design', 'Educational Technology', 'Student Advising', 'Program Evaluation', 'Differentiated Instruction']
        };

        const suggestions = industrySkills[industry?.toLowerCase()] || industrySkills.technology;
        return suggestions.join(', ');
    }

    // Organize and categorize existing skills
    return existing.slice(0, 12).join(', ');
};

export const generateFallbackATS = ({ role, summary, skills, experience, jobDescription }: ATSParams): string => {
    // Simple keyword-matching ATS analysis (no AI needed)
    const resumeText = [summary, skills, experience].filter(Boolean).join(' ').toLowerCase();
    const jdWords = (jobDescription || '').toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'been', 'will', 'your', 'about', 'which', 'their', 'they', 'would', 'could', 'should', 'there'].includes(w));

    const uniqueJdWords = [...new Set(jdWords)];
    const matchedWords = uniqueJdWords.filter(w => resumeText.includes(w));
    const score = uniqueJdWords.length > 0
        ? Math.min(Math.round((matchedWords.length / uniqueJdWords.length) * 100), 100)
        : 50;

    const tips: string[] = [];
    if (score < 60) {
        tips.push('Add more keywords from the job description to your resume: ' + uniqueJdWords.slice(0, 5).join(', ') + '...');
        tips.push('Quantify your achievements with specific metrics and results');
        tips.push('Ensure your role title matches or closely relates to the target position');
    } else if (score < 80) {
        tips.push('Great keyword match! Try to weave in remaining terms: ' + uniqueJdWords.filter(w => !matchedWords.includes(w)).slice(0, 3).join(', '));
        tips.push('Strengthen your bullet points with measurable outcomes');
        tips.push('Add a professional summary that mirrors the job description\'s language');
    } else {
        tips.push('Excellent alignment! Your resume is well-optimized for this role');
        tips.push('Consider adding a few niche terms to reach a perfect score');
        tips.push('Ensure your contact info and formatting are ATS-friendly');
    }

    return `SCORE: ${score}\nTIP1: ${tips[0]}\nTIP2: ${tips[1]}\nTIP3: ${tips[2]}`;
};

export const generateSummary = async ({ name, role, experience, skills, industry }: AIPromptParams, style: WritingStyle = 'professional'): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a professional resume writer specializing in the ${industry || 'general'} industry.
Write a compelling, ATS-optimized professional summary (3-4 sentences) for:
- Name: ${name}
- Target Role: ${role}
- Experience: ${experience}
- Key Skills: ${skills}

${styleInstr}

Rules:
- Include relevant industry keywords
- Be concise and impactful
- Do NOT include any markdown formatting
- Return ONLY the summary text`;

    return generateWithProvider(prompt);
};

export const tailorSummary = async ({ currentSummary, jobDescription }: TailorParams, style: WritingStyle = 'professional'): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are an expert resume tailor. Rewrite this professional summary to better match the job description below.

Current Summary:
${currentSummary}

Job Description:
${jobDescription}

${styleInstr}

Rules:
- Incorporate relevant keywords from the job description
- Keep to 3-4 sentences
- Do NOT include any markdown formatting
- Return ONLY the rewritten summary`;

    return generateWithProvider(prompt);
};

export const powerUpBullet = async ({ bulletText, role, industry }: PowerUpParams, style: WritingStyle = 'professional'): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a resume optimization expert for the ${industry || 'general'} industry.
Transform this simple task description into a powerful, quantified achievement bullet point:

Original: "${bulletText}"
Role context: ${role}

${styleInstr}

Rules:
- Start with a strong action verb
- Include quantified results where possible (%, $, numbers)
- Keep to 1-2 lines maximum
- Make it ATS-friendly
- Do NOT include any markdown formatting or bullet characters
- Return ONLY the improved bullet point text`;

    return generateWithProvider(prompt);
};

export const generateSkills = async ({ role, rawSkills, industry }: SkillsParams, style: WritingStyle = 'professional'): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a resume expert for the ${industry || 'general'} industry.
Given this role and raw skills, organize and enhance them into professional skill categories:

Role: ${role}
Raw Skills: ${rawSkills}

${styleInstr}

Rules:
- Return a comma-separated list of refined, ATS-friendly skill names
- Include up to 12 of the most impactful and relevant skills
- Do NOT include any markdown formatting
- Return ONLY the comma-separated skills`;

    return generateWithProvider(prompt);
};

export const generateCoverLetter = async ({ name, role, experience, skills, jobDescription, industry }: CoverLetterParams, style: WritingStyle = 'professional'): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a professional career coach and resume writer for the ${industry || 'general'} industry.
Write a personalized, high-impact cover letter for:
- Name: ${name}
- Target Role: ${role}
- Experience Highlight: ${experience}
- Key Skills: ${skills}
- Job Description: ${jobDescription}

${styleInstr}

Rules:
- 300-400 words
- Directly address how the experience matches the job description
- Use standard business letter format
- Do NOT include markdown formatting
- Return ONLY the cover letter text`;

    return generateWithProvider(prompt);
};

export const analyzeATSCompatibility = async ({ role, summary, skills, experience, jobDescription }: ATSParams, style: WritingStyle = 'professional'): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are an ATS (Applicant Tracking System) algorithm expert. 
Analyze the compatibility between this resume and the job description.

Resume Data:
- Role: ${role}
- Summary: ${summary}
- Skills: ${skills}
- Experience: ${experience}

Job Description:
${jobDescription}

${styleInstr}

Rules:
- Provide a score from 0-100 based on keyword match, role alignment, and experience.
- Provide 3 specific improvement tips to increase the score.
- Return the response in this exact format:
  SCORE: [number]
  TIP1: [tip]
  TIP2: [tip]
  TIP3: [tip]`;

    return generateWithProvider(prompt);
};

/* ============================================
   Section-by-Section Rewrite in Writing Style
   ============================================ */

/**
 * Rewrite the professional summary in the selected writing style
 */
export const rewriteSummaryStyle = async (
    currentSummary: string,
    industry: string,
    style: WritingStyle
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a professional resume writer. Rewrite the following professional summary to match the specified writing style.

Current Summary:
${currentSummary}

Industry: ${industry || 'general'}

${styleInstr}

Rules:
- Preserve the core content and achievements
- Rewrite the tone, vocabulary, and structure to match the writing style
- Keep to 3-4 sentences
- Do NOT include any markdown formatting
- Return ONLY the rewritten summary text`;

    return generateWithProvider(prompt);
};

/**
 * Rewrite all experience bullet points in the selected writing style
 */
export const rewriteExperienceBullets = async (
    experiences: Array<{ title: string; company: string; description: string }>,
    role: string,
    industry: string,
    style: WritingStyle
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const experienceText = experiences.map(e =>
        `Role: ${e.title} at ${e.company}\nBullets:\n${e.description || '(no description)'}`
    ).join('\n\n---\n\n');

    const prompt = `You are a professional resume writer. Rewrite ALL the experience bullet points to match the specified style.

EXPERIENCES TO REWRITE (listed in order):
${experienceText}

Role context: ${role || 'professional'}
Industry: ${industry || 'general'}

${styleInstr}

RULES:
- Rewrite EVERY bullet point — keep the same information and achievements
- Use strong action verbs to start each bullet
- Add quantified results where implied
- Keep bullets to 1-2 lines each
- Return ONLY the bullet text, no labels, no roles, no headers
- Preserve the EXACT SAME ORDER and GROUPING: first entry's bullets, then a blank line, then next entry's bullets, then a blank line, etc.
- Do NOT include any markdown formatting
- Each bullet on its own line`;

    return generateWithProvider(prompt);
};

/**
 * Rewrite skills list in the selected writing style
 */
export const rewriteSkillsStyle = async (
    rawSkills: string,
    role: string,
    industry: string,
    style: WritingStyle
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a resume expert. Refine and rewrite the following skills list to match the specified writing style.

Current Skills:
${rawSkills}

Role: ${role || 'professional'}
Industry: ${industry || 'general'}

${styleInstr}

Rules:
- Return a comma-separated list of ATS-friendly skill names
- Include up to 12 of the most relevant skills
- Remove duplicates and generic filler skills
- Add any missing critical skills for this role
- Do NOT include any markdown formatting
- Return ONLY the comma-separated skills`;

    return generateWithProvider(prompt);
};

/* --- Fallbacks (no AI needed) --- */

/**
 * Template-based style rewrite for summary (no AI)
 */
export const generateFallbackRewriteSummary = (currentSummary: string, style: WritingStyle = 'professional'): string => {
    if (!currentSummary.trim()) return currentSummary;
    const tone = getFallbackTone(style);

    if (style === 'casual') {
        // Make it more conversational
        return currentSummary
            .replace(/results-driven/g, 'passionate')
            .replace(/demonstrated/g, 'hands-on')
            .replace(/delivered measurable impact/g, 'made a real difference');
    }
    if (style === 'academic') {
        // Make it more formal
        return currentSummary
            .replace(/results-driven/g, 'accomplished')
            .replace(/skill in/g, 'proficiency in')
            .replace(/proven track record/g, 'established record of scholarship');
    }
    // Professional - return as-is
    return currentSummary;
};

/**
 * Template-based style rewrite for experience bullets (no AI)
 */
export const generateFallbackRewriteBullets = (experienceDesc: string, style: WritingStyle = 'professional'): string => {
    if (!experienceDesc.trim()) return experienceDesc;
    const tone = getFallbackTone(style);

    const lines = experienceDesc.split('\n').filter(Boolean);
    const rewritten = lines.map(line => {
        const trimmed = line.replace(/^[•\-\s]+/, '').trim();
        if (!trimmed) return line;

        const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase() || '';
        const rest = trimmed.substring(firstWord.length).trim();

        if (style === 'casual') {
            const casualVerbs: Record<string, string> = {
                'implemented': 'Built and rolled out',
                'developed': 'Created',
                'managed': 'Ran',
                'led': 'Headed up',
                'optimized': 'Made better',
                'improved': 'Leveled up',
                'delivered': 'Shipped',
                'achieved': 'Hitt'
            };
            const verb = casualVerbs[firstWord] || trimmed.split(/\s+/).slice(0, 2).join(' ');
            return `${verb} ${rest}`;
        }

        if (style === 'academic') {
            const academicVerbs: Record<string, string> = {
                'implemented': 'Implemented and systematically evaluated',
                'developed': 'Developed and validated',
                'managed': 'Directed and coordinated',
                'led': 'Principal lead for',
                'optimized': 'Optimized through systematic analysis',
                'increased': 'Significantly increased',
                'reduced': 'Substantially reduced',
                'created': 'Conceptualized and created'
            };
            const verb = academicVerbs[firstWord] || trimmed.split(/\s+/).slice(0, 2).join(' ');
            return `${verb} ${rest}`;
        }

        // Professional — keep original, just clean up
        return trimmed.replace(/^[a-z]/, c => c.toUpperCase());
    });

    return rewritten.join('\n');
};

/* ============================================
   Write for Me — Section Generation
   ============================================ */

/**
 * AI: Generate experience entries based on role and industry
 */
export const generateExperienceEntries = async (
    role: string,
    industry: string,
    style: WritingStyle = 'professional'
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a professional resume writer for the ${industry || 'general'} industry.
Write realistic experience entries for a candidate with the title "${role || 'Professional'}".

Generate 2-3 experience entries with:
- company name (well-known companies in the field)
- job title (career progression)
- location
- 3-4 achievement-oriented bullet points each
- Use strong action verbs and quantify results (%, $, numbers)

${styleInstr}

Return the data in this EXACT format for EACH entry, separated by "---":
TITLE: Software Engineer
COMPANY: Google
LOCATION: Mountain View, CA
START: 2022-01
END: Present
BULLETS:
- Led development of a microservices platform, reducing API latency by 40%
- Collaborated with cross-functional teams to deliver 15+ features
- Mentored 3 junior engineers through structured code review process

---
TITLE: ...
COMPANY: ...
LOCATION: ...
START: ...
END: ...
BULLETS:
- ...

Rules:
- Dates should be realistic (recent years, START before END)
- Each entry should have 3-4 bullet points
- Bullets should be achievement-oriented with metrics
- Do NOT include any markdown formatting or extra text
- Return ONLY the structured entries`;

    return generateWithProvider(prompt);
};

/**
 * Fallback: Generate experience entries without AI
 */
export const generateFallbackExperienceEntries = (role: string, industry: string): string => {
    const industryCompanies: Record<string, string[]> = {
        technology: ['TechCorp', 'InnovateSoft', 'DataDriven Inc.'],
        finance: ['Goldman & Partners', 'Meridian Capital', 'Pinnacle Financial'],
        healthcare: ['MedStar Health', 'CareFirst Medical', 'HealthBridge Systems'],
        'creative design': ['Creative Agency Co.', 'DesignLab Studio', 'BrandCraft Media'],
        legal: ['Morgan & Associates', 'Sterling Legal Group', 'Justice Law Firm'],
        education: ['Lincoln Academy', 'Summit School District', 'Bright Future University']
    };

    const companies = industryCompanies[industry?.toLowerCase()] || industryCompanies.technology;
    const title = role || 'Professional';
    const now = new Date();
    const y = now.getFullYear();

    return `TITLE: ${title}
COMPANY: ${companies[0]}
LOCATION: New York, NY
START: ${y - 3}-01
END: Present
BULLETS:
- Led key initiatives that improved team productivity by 35% through streamlined workflows
- Collaborated with stakeholders to deliver 10+ major projects on time and under budget
- Developed and implemented best practices, reducing error rates by 25%

---
TITLE: Junior ${title}
COMPANY: ${companies[1]}
LOCATION: Boston, MA
START: ${y - 5}-06
END: ${y - 3}-12
BULLETS:
- Supported senior team members in delivering critical client projects
- Analyzed data to identify trends, contributing to a 15% increase in operational efficiency
- Earned recognition for exceptional problem-solving and teamwork`;
};

/**
 * AI: Generate education entries
 */
export const generateEducationEntries = async (
    role: string,
    industry: string,
    style: WritingStyle = 'professional'
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a resume expert for the ${industry || 'general'} industry.
Generate 1-2 realistic education entries for a ${role || 'professional'}.

Return in this EXACT format, with "---" between entries:
SCHOOL: Massachusetts Institute of Technology
DEGREE: Bachelor of Science in Computer Science
CITY: Cambridge, MA
START: 2016-09
END: 2020-06
DESCRIPTION: Relevant coursework: Data Structures, Algorithms, Machine Learning. Dean's List. GPA: 3.8

---
SCHOOL: ...
DEGREE: ...
...

Rules:
- Return ONLY the structured data, no extra text
- No markdown formatting`;

    return generateWithProvider(prompt);
};

/**
 * Fallback: Generate education entries without AI
 */
export const generateFallbackEducationEntries = (role: string, industry: string): string => {
    const now = new Date();
    const y = now.getFullYear();

    const schools: Record<string, { school: string; degree: string; city: string }[]> = {
        technology: [
            { school: 'Massachusetts Institute of Technology', degree: 'B.S. in Computer Science', city: 'Cambridge, MA' },
            { school: 'Stanford University', degree: 'M.S. in Software Engineering', city: 'Stanford, CA' }
        ],
        finance: [
            { school: 'Wharton School of Business', degree: 'B.S. in Finance', city: 'Philadelphia, PA' },
            { school: 'London School of Economics', degree: 'M.Sc. in Financial Economics', city: 'London, UK' }
        ],
        healthcare: [
            { school: 'Johns Hopkins University', degree: 'B.S. in Nursing', city: 'Baltimore, MD' },
            { school: 'Harvard Medical School', degree: 'M.D. in Medicine', city: 'Boston, MA' }
        ],
        'creative design': [
            { school: 'Rhode Island School of Design', degree: 'B.F.A. in Graphic Design', city: 'Providence, RI' },
            { school: 'California Institute of the Arts', degree: 'M.F.A. in Design', city: 'Valencia, CA' }
        ],
        legal: [
            { school: 'Harvard Law School', degree: 'J.D. in Law', city: 'Cambridge, MA' },
            { school: 'Yale University', degree: 'B.A. in Political Science', city: 'New Haven, CT' }
        ],
        education: [
            { school: 'Teachers College, Columbia University', degree: 'M.A. in Education', city: 'New York, NY' },
            { school: 'University of Michigan', degree: 'B.A. in Elementary Education', city: 'Ann Arbor, MI' }
        ]
    };

    const entries = schools[industry?.toLowerCase()] || schools.technology;
    return entries.map((e, i) => {
        const gradYear = y - 4 - i;
        return `SCHOOL: ${e.school}
DEGREE: ${e.degree}
CITY: ${e.city}
START: ${gradYear - 4}-09
END: ${gradYear}-06
DESCRIPTION: Relevant coursework and projects. Dean's List. Graduated with honors.`;
    }).join('\n\n---\n\n');
};

/**
 * AI: Generate project entries
 */
export const generateProjectEntries = async (
    role: string,
    industry: string,
    skills: string,
    style: WritingStyle = 'professional'
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a resume expert for the ${industry || 'general'} industry.
Generate 1-2 realistic project entries for a ${role || 'professional'}.
Skills to highlight: ${skills || 'relevant technical skills'}.

Return in this EXACT format, with "---" between entries:
TITLE: E-Commerce Platform
LINK: https://github.com/username/project
DESCRIPTION: Built a full-stack e-commerce platform using React, Node.js, and PostgreSQL. Implemented payment processing with Stripe API, reduced checkout time by 60%, and handled 10K+ daily users.

---
TITLE: ...
LINK: ...
DESCRIPTION: ...

Rules:
- Return ONLY the structured data, no extra text
- No markdown formatting`;

    return generateWithProvider(prompt);
};

/**
 * Fallback: Generate project entries without AI
 */
export const generateFallbackProjectEntries = (role: string, industry: string, skills: string): string => {
    const primarySkills = skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3).join(', ') || 'relevant technologies';
    return `TITLE: Industry Analysis Dashboard
LINK: https://github.com/username/dashboard
DESCRIPTION: Built an interactive analytics dashboard using ${primarySkills}. Processed and visualized large datasets, enabling data-driven decision making that improved reporting efficiency by 40%.

---
TITLE: Automation Framework
LINK: https://github.com/username/automation
DESCRIPTION: Developed a custom automation framework that streamlined ${industry || 'business'} workflows, reducing manual processing time by 60% and eliminating recurring errors.`;
};

/**
 * AI: Generate achievement entries
 */
export const generateAchievementEntries = async (
    role: string,
    industry: string,
    style: WritingStyle = 'professional'
): Promise<string> => {
    const styleInstr = getStyleInstructions(style);
    const prompt = `You are a resume expert for the ${industry || 'general'} industry.
Generate 2-3 realistic professional achievements for a ${role || 'professional'}.

Return in this EXACT format, with "---" between entries:
TITLE: Employee of the Year
DESCRIPTION: Awarded Employee of the Year for exceptional performance and leadership, recognized across the organization for delivering outstanding results.

---
TITLE: ...
DESCRIPTION: ...

Rules:
- Achievements should be impressive but believable
- Return ONLY the structured data, no extra text
- No markdown formatting`;

    return generateWithProvider(prompt);
};

/**
 * Fallback: Generate achievement entries without AI
 */
export const generateFallbackAchievementEntries = (): string => {
    return `TITLE: Excellence in Performance Award
DESCRIPTION: Recognized for consistently exceeding performance targets and demonstrating exceptional leadership across multiple teams.

---
TITLE: Innovation Spotlight
DESCRIPTION: Selected to present an innovative solution at the annual company innovation showcase, resulting in company-wide adoption.

---
TITLE: Top Performer Recognition
DESCRIPTION: Achieved top 5% performance rating for three consecutive quarters, contributing to a 25% increase in team output.`;
};

/**
 * Parse generated experience entries into structured format
 */
export const parseExperienceEntries = (raw: string): Array<{
    title: string; company: string; location: string;
    startDate: string; endDate: string; description: string;
}> => {
    const entries: Array<{
        title: string; company: string; location: string;
        startDate: string; endDate: string; description: string;
    }> = [];

    const blocks = raw.split(/---+/).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
        const getVal = (prefix: string): string => {
            const match = block.match(new RegExp(`${prefix}[:\\s]+(.+)`, 'i'));
            return match ? match[1].trim() : '';
        };
        const bulletsMatch = block.match(/BULLETS:[\s\S]*$/i);
        const bullets = bulletsMatch
            ? bulletsMatch[0]
                .replace(/^BULLETS:\s*/i, '')
                .split('\n')
                .map(l => l.replace(/^[-•]\s*/, '').trim())
                .filter(Boolean)
            : [];

        const title = getVal('TITLE');
        if (!title) continue;

        // Normalize 'Present'-style markers to empty string so dates render cleanly
        const normalizeDate = (v: string): string => /present|current|now|ongoing|till date|to date|todate/i.test(v) ? '' : v;

        entries.push({
            title,
            company: getVal('COMPANY'),
            location: getVal('LOCATION'),
            startDate: normalizeDate(getVal('START')),
            endDate: normalizeDate(getVal('END')),
            description: bullets.join('\n')
        });
    }

    return entries;
};

/**
 * Parse generated education entries into structured format
 */
export const parseEducationEntries = (raw: string): Array<{
    school: string; degree: string; city: string;
    startDate: string; endDate: string; description: string;
}> => {
    const entries: Array<{
        school: string; degree: string; city: string;
        startDate: string; endDate: string; description: string;
    }> = [];

    const blocks = raw.split(/---+/).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
        const getVal = (prefix: string): string => {
            const match = block.match(new RegExp(`${prefix}[:\\s]+(.+)`, 'i'));
            return match ? match[1].trim() : '';
        };

        const school = getVal('SCHOOL');
        if (!school) continue;

        // Normalize 'Present'-style markers to empty string so dates render cleanly
        const normalizeDate = (v: string): string => /present|current|now|ongoing|till date|to date|todate/i.test(v) ? '' : v;

        entries.push({
            school,
            degree: getVal('DEGREE'),
            city: getVal('CITY'),
            startDate: normalizeDate(getVal('START')),
            endDate: normalizeDate(getVal('END')),
            description: getVal('DESCRIPTION')
        });
    }

    return entries;
};

/**
 * Parse generated project entries into structured format
 */
export const parseProjectEntries = (raw: string): Array<{
    title: string; link: string; description: string;
}> => {
    const entries: Array<{
        title: string; link: string; description: string;
    }> = [];

    const blocks = raw.split(/---+/).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
        const getVal = (prefix: string): string => {
            const match = block.match(new RegExp(`${prefix}[:\\s]+(.+)`, 'i'));
            return match ? match[1].trim() : '';
        };

        const title = getVal('TITLE');
        if (!title) continue;

        entries.push({
            title,
            link: getVal('LINK'),
            description: getVal('DESCRIPTION')
        });
    }

    return entries;
};

/**
 * Parse generated achievement entries into structured format
 */
export const parseAchievementEntries = (raw: string): Array<{
    title: string; description: string;
}> => {
    const entries: Array<{
        title: string; description: string;
    }> = [];

    const blocks = raw.split(/---+/).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
        const getVal = (prefix: string): string => {
            const match = block.match(new RegExp(`${prefix}[:\\s]+(.+)`, 'i'));
            return match ? match[1].trim() : '';
        };

        const title = getVal('TITLE');
        if (!title) continue;

        entries.push({
            title,
            description: getVal('DESCRIPTION')
        });
    }

    return entries;
};

/* ============================================
   Multi-language Resume Translation
   ============================================ */

/**
 * Serialize FormData into a structured text format for AI translation
 */
const serializeForTranslation = (formData: FormData): string => {
    const lines: string[] = [];
    lines.push('=== BASIC INFO ===');
    lines.push(`firstName: ${formData.firstName || ''}`);
    lines.push(`lastName: ${formData.lastName || ''}`);
    lines.push(`designation: ${formData.designation || ''}`);
    lines.push(`email: ${formData.email || ''}`);
    lines.push(`phone: ${formData.phone || ''}`);
    lines.push(`address: ${formData.address || ''}`);
    lines.push(`summary: ${formData.summary || ''}`);
    lines.push(`skillsRaw: ${formData.skillsRaw || ''}`);
    lines.push('');

    if (formData.experiences && formData.experiences.length > 0) {
        lines.push('=== EXPERIENCES ===');
        formData.experiences.forEach((exp, i) => {
            lines.push(`--- Experience ${i + 1} ---`);
            lines.push(`title: ${exp.title || ''}`);
            lines.push(`company: ${exp.company || ''}`);
            lines.push(`location: ${exp.location || ''}`);
            lines.push(`description: ${exp.description || ''}`);
        });
        lines.push('');
    }

    if (formData.educations && formData.educations.length > 0) {
        lines.push('=== EDUCATION ===');
        formData.educations.forEach((edu, i) => {
            lines.push(`--- Education ${i + 1} ---`);
            lines.push(`school: ${edu.school || ''}`);
            lines.push(`degree: ${edu.degree || ''}`);
            lines.push(`city: ${edu.city || ''}`);
            lines.push(`description: ${edu.description || ''}`);
        });
        lines.push('');
    }

    if (formData.projects && formData.projects.length > 0) {
        lines.push('=== PROJECTS ===');
        formData.projects.forEach((proj, i) => {
            lines.push(`--- Project ${i + 1} ---`);
            lines.push(`title: ${proj.title || ''}`);
            lines.push(`link: ${proj.link || ''}`);
            lines.push(`description: ${proj.description || ''}`);
        });
        lines.push('');
    }

    if (formData.achievements && formData.achievements.length > 0) {
        lines.push('=== ACHIEVEMENTS ===');
        formData.achievements.forEach((ach, i) => {
            lines.push(`--- Achievement ${i + 1} ---`);
            lines.push(`title: ${ach.title || ''}`);
            lines.push(`description: ${ach.description || ''}`);
        });
        lines.push('');
    }

    return lines.join('\n');
};

/**
 * Parse translated text back into FormData
 */
const parseTranslatedFormData = (translated: string, original: FormData): FormData => {
    const result: FormData = {
        ...original,
        firstName: '', lastName: '', designation: '', email: '',
        phone: '', address: '', summary: '', skillsRaw: '',
        experiences: [], educations: [], projects: [], achievements: []
    };

    const currentSection: { type: string; index: number } = { type: '', index: -1 };
    let currentEntry: Record<string, string> = {};
    const entries: Record<string, Array<Record<string, string>>> = {
        experiences: [], educations: [], projects: [], achievements: []
    };

    const lines = translated.split('\n');

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // Section headers
        if (line === '=== BASIC INFO ===') {
            currentSection.type = 'basic';
            continue;
        }
        if (line === '=== EXPERIENCES ===') {
            currentSection.type = 'experiences';
            currentSection.index = -1;
            continue;
        }
        if (line === '=== EDUCATION ===') {
            currentSection.type = 'educations';
            currentSection.index = -1;
            continue;
        }
        if (line === '=== PROJECTS ===') {
            currentSection.type = 'projects';
            currentSection.index = -1;
            continue;
        }
        if (line === '=== ACHIEVEMENTS ===') {
            currentSection.type = 'achievements';
            currentSection.index = -1;
            continue;
        }

        // Entry separators (e.g. --- Experience 1 ---)
        const entryMatch = line.match(/^---\s+(\w+)\s+(\d+)\s+---$/i);
        if (entryMatch) {
            // Save previous entry if exists
            if (Object.keys(currentEntry).length > 0) {
                const type = currentSection.type;
                if (type && entries[type]) {
                    entries[type].push({ ...currentEntry });
                }
            }
            currentEntry = {};
            currentSection.index = parseInt(entryMatch[2]) - 1;
            continue;
        }

        // Key: value pairs
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim().toLowerCase();
            const value = line.substring(colonIndex + 1).trim();

            if (currentSection.type === 'basic') {
                if (key in result) {
                    (result as any)[key] = value;
                }
            } else if (currentSection.type && entries[currentSection.type]) {
                currentEntry[key] = value;
            }
        }
    }

    // Save last entry
    if (Object.keys(currentEntry).length > 0) {
        const type = currentSection.type;
        if (type && entries[type]) {
            entries[type].push({ ...currentEntry });
        }
    }

    // Convert entries back to structured data with IDs
    result.experiences = entries.experiences.map((e, i) => ({
        id: original.experiences?.[i]?.id || Date.now() + i,
        title: e.title || '',
        company: e.company || '',
        location: e.location || '',
        startDate: original.experiences?.[i]?.startDate || '',
        endDate: original.experiences?.[i]?.endDate || '',
        description: e.description || ''
    }));

    result.educations = entries.educations.map((e, i) => ({
        id: original.educations?.[i]?.id || Date.now() + i + 100,
        school: e.school || '',
        degree: e.degree || '',
        city: e.city || '',
        startDate: original.educations?.[i]?.startDate || '',
        endDate: original.educations?.[i]?.endDate || '',
        description: e.description || ''
    }));

    result.projects = entries.projects.map((e, i) => ({
        id: original.projects?.[i]?.id || Date.now() + i + 200,
        title: e.title || '',
        link: e.link || '',
        description: e.description || ''
    }));

    result.achievements = entries.achievements.map((e, i) => ({
        id: original.achievements?.[i]?.id || Date.now() + i + 300,
        title: e.title || '',
        description: e.description || ''
    }));

    return result;
};

/**
 * AI: Translate an entire resume to a target language
 */
export const translateResumeContent = async (
    formData: FormData,
    targetLanguage: LanguageCode,
    industry: string = ''
): Promise<FormData> => {
    const languageNames: Record<string, string> = {
        en: 'English', es: 'Spanish', fr: 'French', de: 'German',
        it: 'Italian', pt: 'Portuguese', nl: 'Dutch', ru: 'Russian',
        ja: 'Japanese', zh: 'Chinese (Simplified)', ar: 'Arabic',
        ko: 'Korean', hi: 'Hindi', tr: 'Turkish', pl: 'Polish',
        sv: 'Swedish', da: 'Danish', fi: 'Finnish', nb: 'Norwegian',
        cs: 'Czech', hu: 'Hungarian', th: 'Thai', vi: 'Vietnamese',
        el: 'Greek', he: 'Hebrew'
    };

    const targetName = languageNames[targetLanguage] || targetLanguage;
    const serialized = serializeForTranslation(formData);

    const prompt = `You are a professional resume translator. Translate the following resume content to ${targetName}.

IMPORTANT RULES:
1. Translate ALL text values EXCEPT proper names (person names, company names, brand names)
2. Keep ALL field labels (firstName:, title:, company:, etc.) in English — ONLY translate the values
3. Preserve the EXACT same structure, section headers (=== ===), and separators (--- ---)
4. Keep dates, URLs, and links unchanged
5. Use natural ${targetName} phrasing — adapt idioms and colloquial expressions
6. Keep email addresses and phone numbers unchanged
7. For skills, translate them to their common ${targetName} equivalents

Here is the resume content to translate:

${serialized}

Return ONLY the translated version following the exact same format.`;

    const response = await generateWithProvider(prompt);
    return parseTranslatedFormData(response, formData);
};

/**
 * Fallback: dictionary-based translation of common resume vocabulary.
 * Works with NO AI key — every supported language has a real dictionary in
 * translationDicts.ts. Longest terms are matched first and word boundaries
 * are respected so "management" isn't clobbered by "manager".
 * This is best-effort vocabulary translation; for accurate, natural
 * full-resume translation users should configure an AI provider.
 */
export const generateFallbackTranslation = (
    formData: FormData,
    targetLanguage: LanguageCode
): FormData => {
    if (targetLanguage === 'en') return { ...formData };

    const dict = TRANSLATION_DICTS[targetLanguage];
    if (!dict || Object.keys(dict).length === 0) {
        return { ...formData };
    }

    // Keys sorted longest-first so multi-word phrases win over single words
    const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const translateText = (text: string): string => {
        if (!text) return text;
        let translated = text;
        for (const [key, value] of entries) {
            const re = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'gi');
            translated = translated.replace(re, (match) => {
                // Preserve the original casing style of the matched word
                const upper = match.charAt(0) === match.charAt(0).toUpperCase();
                return upper ? value.charAt(0).toUpperCase() + value.slice(1) : value;
            });
        }
        return translated;
    };

    const result: FormData = {
        ...formData,
        summary: translateText(formData.summary),
        skillsRaw: translateText(formData.skillsRaw),
        designation: translateText(formData.designation),
        address: translateText(formData.address)
    };

    result.experiences = result.experiences.map(exp => ({
        ...exp,
        title: translateText(exp.title),
        description: translateText(exp.description)
    }));

    result.educations = result.educations.map(edu => ({
        ...edu,
        degree: translateText(edu.degree),
        description: translateText(edu.description)
    }));

    result.projects = result.projects.map(proj => ({
        ...proj,
        title: translateText(proj.title),
        description: translateText(proj.description)
    }));

    result.achievements = result.achievements.map(ach => ({
        ...ach,
        title: translateText(ach.title),
        description: translateText(ach.description)
    }));

    return result;
};

export const checkApiKey = (): boolean => {
    if (typeof localStorage === 'undefined') return false;

    const config = getProviderConfig();
    return config.provider === 'ollama' || !!config.apiKey;
};
