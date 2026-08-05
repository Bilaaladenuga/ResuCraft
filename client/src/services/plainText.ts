import { FormData } from '../types';

/**
 * Convert FormData into clean, ATS-friendly plain text.
 * No tables, no columns, no fancy glyphs — just simple lines that
 * paste cleanly into job portal text boxes.
 */
export function formDataToPlainText(data: FormData): string {
    const lines: string[] = [];

    // ── Header ──
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
    if (fullName) lines.push(fullName.toUpperCase());

    if (data.designation) lines.push(data.designation);

    const contact = [data.email, data.phone, data.address].filter(Boolean).join('  |  ');
    if (contact) lines.push(contact);

    // ── Summary ──
    if (data.summary && data.summary.trim()) {
        lines.push('');
        lines.push('PROFESSIONAL SUMMARY');
        lines.push(data.summary.trim());
    }

    // ── Experience ──
    const experiences = data.experiences || [];
    if (experiences.length > 0) {
        lines.push('');
        lines.push('WORK EXPERIENCE');
        for (const exp of experiences) {
            const title = exp.title || '';
            const company = exp.company || '';
            const roleLine = [title, company].filter(Boolean).join(' — ');
            const meta = [exp.location, formatDateRange(exp.startDate, exp.endDate)].filter(Boolean).join('  |  ');
            if (roleLine) lines.push(roleLine);
            if (meta) lines.push(meta);
            if (exp.description && exp.description.trim()) {
                const bullets = exp.description.split('\n').map(b => b.replace(/^[•\-–—\s]+/, '').trim()).filter(Boolean);
                for (const b of bullets) lines.push(`- ${b}`);
            }
            lines.push('');
        }
    }

    // ── Education ──
    const educations = data.educations || [];
    if (educations.length > 0) {
        lines.push('EDUCATION');
        for (const edu of educations) {
            const degree = edu.degree || '';
            const school = edu.school || '';
            const eduLine = [degree, school].filter(Boolean).join(' — ');
            const meta = [edu.city, formatDateRange(edu.startDate, edu.endDate)].filter(Boolean).join('  |  ');
            if (eduLine) lines.push(eduLine);
            if (meta) lines.push(meta);
            if (edu.description && edu.description.trim()) {
                lines.push(edu.description.trim());
            }
            lines.push('');
        }
    }

    // ── Skills ──
    const skills = (data.skillsRaw || '').split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    if (skills.length > 0) {
        lines.push('SKILLS');
        lines.push(skills.join(', '));
    }

    // ── Projects ──
    const projects = data.projects || [];
    if (projects.length > 0) {
        lines.push('');
        lines.push('PROJECTS');
        for (const proj of projects) {
            const title = proj.title || '';
            const link = proj.link || '';
            const projLine = [title, link].filter(Boolean).join(' — ');
            if (projLine) lines.push(projLine);
            if (proj.description && proj.description.trim()) {
                lines.push(proj.description.trim());
            }
            lines.push('');
        }
    }

    // ── Achievements ──
    const achievements = data.achievements || [];
    if (achievements.length > 0) {
        lines.push('ACHIEVEMENTS');
        for (const ach of achievements) {
            const title = ach.title || '';
            if (title) lines.push(title);
            if (ach.description && ach.description.trim()) {
                lines.push(ach.description.trim());
            }
            lines.push('');
        }
    }

    // Trim trailing blank lines
    while (lines.length > 0 && lines[lines.length - 1] === '') {
        lines.pop();
    }

    return lines.join('\n');
}

function formatDateRange(startDate: string, endDate: string): string {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    if (!start && !end) return '';
    if (start && end) return `${start} – ${end}`;
    return start || end || '';
}

function formatDate(dateStr: string): string {
    if (!dateStr) return 'Present';
    // Accepts YYYY-MM or YYYY
    try {
        if (/^\d{4}-\d{2}$/.test(dateStr)) {
            const [y, m] = dateStr.split('-').map(Number);
            const date = new Date(y, m - 1, 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        if (/^\d{4}$/.test(dateStr)) return dateStr;
        return dateStr;
    } catch {
        return dateStr || 'Present';
    }
}

/** Download plain text as a .txt file */
export function downloadPlainText(data: FormData): void {
    const text = formDataToPlainText(data);
    const name = [data.firstName, data.lastName].filter(Boolean).join('_') || 'resume';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

/** Copy plain text to clipboard with a fallback for older browsers */
export async function copyPlainText(data: FormData): Promise<boolean> {
    const text = formDataToPlainText(data);
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return true;
        } catch {
            return false;
        }
    }
}
