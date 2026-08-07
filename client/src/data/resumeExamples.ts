import { FormData } from '../types';

export interface ResumeExample {
    id: string;
    title: string;
    role: string;
    description: string;
    tags: string[];
    templateId: string;
    roleId: string;
    formData: FormData;
}

let uid = 0;
const nextId = () => ++uid;

const examples: ResumeExample[] = [
    {
        id: 'software-engineer',
        title: 'Software Engineer',
        role: 'Mid-level developer',
        description: 'A skills-first resume built around shipping products, with strong project and achievement sections.',
        tags: ['Tech', 'Backend', 'React'],
        templateId: 'tech',
        roleId: 'software-engineer',
        formData: {
            firstName: 'Jordan',
            lastName: 'Chen',
            designation: 'Software Engineer',
            email: 'jordan.chen@email.com',
            phone: '+1 (415) 555-0184',
            address: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/jordanchen',
            github: 'github.com/jordanchen',
            website: '',
            summary: 'Software engineer with 6 years of experience building scalable web applications and APIs. Passionate about clean architecture, performance optimization, and mentoring junior developers.',
            image: null,
            skillsRaw: 'TypeScript, React, Node.js, PostgreSQL, GraphQL, Docker, AWS, Jest, Redis, CI/CD',
            experiences: [
                { id: nextId(), title: 'Senior Software Engineer', company: 'Nimbus Labs', location: 'San Francisco, CA', startDate: '2021-03', endDate: '', description: 'Led a team of 4 engineers building a real-time analytics platform serving 2M+ users\nReduced API p95 latency by 40% through query optimization and Redis caching\nIntroduced automated testing, raising coverage from 42% to 87%' },
                { id: nextId(), title: 'Software Engineer', company: 'Brightpath', location: 'Seattle, WA', startDate: '2019-06', endDate: '2021-02', description: 'Built customer-facing React applications with TypeScript and GraphQL\nShipped a self-serve onboarding flow that lifted activation by 22%\nMentored 3 junior engineers and ran weekly code reviews' },
                { id: nextId(), title: 'Software Engineer Intern', company: 'CodeStream', location: 'Remote', startDate: '2018-05', endDate: '2018-08', description: 'Developed REST APIs in Node.js and contributed to the frontend design system' },
            ],
            educations: [
                { id: nextId(), school: 'University of Washington', degree: 'B.S. Computer Science', city: 'Seattle, WA', startDate: '2015-09', endDate: '2019-06', description: 'Graduated cum laude. Focus on distributed systems and human-computer interaction.' },
            ],
            projects: [
                { id: nextId(), title: 'Real-time Analytics Dashboard', link: 'github.com/jordanchen/analytics-dash', description: 'Open-source dashboard visualizing WebSocket event streams, used by 1.2k developers.' },
            ],
            achievements: [
                { id: nextId(), title: 'AWS Certified Solutions Architect', description: 'Associate level, 2022' },
                { id: nextId(), title: 'Speaker, ReactConf 2023', description: 'Talk: "Performance Budgets That Stick"' },
            ],
            customSections: [],
        },
    },
    {
        id: 'product-manager',
        title: 'Product Manager',
        role: 'Consumer products',
        description: 'An experience-led resume showing measurable product impact across launches and growth.',
        tags: ['Product', 'Growth', 'Analytics'],
        templateId: 'general',
        roleId: 'product-manager',
        formData: {
            firstName: 'Maya',
            lastName: 'Rodriguez',
            designation: 'Senior Product Manager',
            email: 'maya.rodriguez@email.com',
            phone: '+1 (212) 555-0177',
            address: 'New York, NY',
            linkedin: 'linkedin.com/in/mayarodriguez',
            github: '',
            website: 'mayarodriguez.design',
            summary: 'Product manager with 7 years of experience shipping consumer mobile and web products. Skilled in discovery, roadmapping, and leading cross-functional teams to measurable growth outcomes.',
            image: null,
            skillsRaw: 'Product Strategy, Roadmapping, A/B Testing, SQL, Figma, Jira, User Research, Agile, OKRs',
            experiences: [
                { id: nextId(), title: 'Senior Product Manager', company: 'Harbor', location: 'New York, NY', startDate: '2021-02', endDate: '', description: 'Owned the mobile onboarding funnel; improved activation by 31% through experiment-driven redesigns\nLed a team of 6 (eng, design, data) to ship 12 features in 2023\nIntroduced a quarterly OKR framework adopted across 3 product teams' },
                { id: nextId(), title: 'Product Manager', company: 'Loopcart', location: 'Boston, MA', startDate: '2018-08', endDate: '2021-01', description: 'Launched a subscription analytics product that reached $4M ARR in 18 months\nPrioritized a 120-item backlog using RICE and customer interviews' },
            ],
            educations: [
                { id: nextId(), school: 'Cornell University', degree: 'B.A. Economics', city: 'Ithaca, NY', startDate: '2013-08', endDate: '2017-05', description: 'Minor in Information Science.' },
            ],
            projects: [
                { id: nextId(), title: 'Harbor Re-engagement Campaign', link: '', description: 'Win-back flow combining push, email, and in-app messaging; recovered 18% of churned users.' },
            ],
            achievements: [
                { id: nextId(), title: 'PM of the Year, Harbor 2022', description: 'Voted by cross-functional peers' },
            ],
            customSections: [],
        },
    },
    {
        id: 'data-scientist',
        title: 'Data Scientist',
        role: 'ML & analytics',
        description: 'An education-and-projects-forward resume for a quantitative, research-oriented role.',
        tags: ['ML', 'Python', 'Research'],
        templateId: 'data',
        roleId: 'data-scientist',
        formData: {
            firstName: 'Priya',
            lastName: 'Sharma',
            designation: 'Data Scientist',
            email: 'priya.sharma@email.com',
            phone: '+1 (510) 555-0129',
            address: 'Oakland, CA',
            linkedin: 'linkedin.com/in/priyasharma',
            github: 'github.com/priyasharma',
            website: '',
            summary: 'Data scientist with 5 years of experience applying machine learning to fraud detection and recommendation systems. PhD-trained in statistics with a record of translating research into production models.',
            image: null,
            skillsRaw: 'Python, PyTorch, scikit-learn, SQL, Spark, Airflow, A/B Testing, XGBoost, Pandas, Tableau',
            experiences: [
                { id: nextId(), title: 'Data Scientist', company: 'Trustwave Analytics', location: 'Oakland, CA', startDate: '2021-01', endDate: '', description: 'Built a fraud-detection ensemble that reduced false positives by 26% while catching 11% more fraud\nDeployed real-time scoring pipelines on Spark and Airflow serving 40k requests/sec\nOwned experimentation framework used by 5 data teams' },
                { id: nextId(), title: 'Data Scientist', company: 'Sable Research', location: 'Remote', startDate: '2018-07', endDate: '2020-12', description: 'Developed churn-prediction models achieving 0.87 AUC, saving an estimated $2.1M annually' },
            ],
            educations: [
                { id: nextId(), school: 'Stanford University', degree: 'M.S. Statistics', city: 'Stanford, CA', startDate: '2016-09', endDate: '2018-06', description: 'Thesis on causal inference in observational studies.' },
            ],
            projects: [
                { id: nextId(), title: 'Open-source Causal Inference Toolkit', link: 'github.com/priyasharma/causal-tools', description: 'A Python library for ATE estimation, starred by 900+ practitioners.' },
            ],
            achievements: [
                { id: nextId(), title: 'Paper at KDD 2023', description: 'Co-author: "Adaptive Thresholds for Streaming Fraud Detection"' },
            ],
            customSections: [],
        },
    },
    {
        id: 'registered-nurse',
        title: 'Registered Nurse',
        role: 'Critical care',
        description: 'A clinical resume with certifications and patient-outcome achievements front and center.',
        tags: ['Healthcare', 'ICU', 'BLS/ACLS'],
        templateId: 'healthcare',
        roleId: 'registered-nurse',
        formData: {
            firstName: 'Sarah',
            lastName: 'Okafor',
            designation: 'Registered Nurse, BSN',
            email: 'sarah.okafor@email.com',
            phone: '+1 (312) 555-0143',
            address: 'Chicago, IL',
            linkedin: '',
            github: '',
            website: '',
            summary: 'Compassionate registered nurse with 6 years of critical care experience, including 3 years in level-1 trauma ICUs. Recognized for calm, decisive leadership during rapid-response situations.',
            image: null,
            skillsRaw: 'ICU Nursing, Ventilator Management, Rapid Response, EKG Interpretation, Wound Care, Medication Administration, Patient Education, Epic EHR',
            experiences: [
                { id: nextId(), title: 'Registered Nurse, ICU', company: 'St. Luke Medical Center', location: 'Chicago, IL', startDate: '2020-04', endDate: '', description: 'Managed 1:2 nurse-to-patient ratios in a 24-bed cardiac/neuro ICU\nLed code-blue responses as charge nurse; improved response documentation compliance by 30%\nMentored 8 new graduate nurses through orientation' },
                { id: nextId(), title: 'Registered Nurse, Med-Surg', company: 'Northshore Hospital', location: 'Evanston, IL', startDate: '2018-06', endDate: '2020-03', description: 'Cared for an average of 5-6 patients per shift with strong outcomes on fall-prevention protocols' },
            ],
            educations: [
                { id: nextId(), school: 'Loyola University Chicago', degree: 'B.S. Nursing (BSN)', city: 'Chicago, IL', startDate: '2014-08', endDate: '2018-05', description: 'Sigma Theta Tau honor society member.' },
            ],
            projects: [
                { id: nextId(), title: 'ICU Family Communication Initiative', link: '', description: 'Designed structured family-update huddles; satisfaction scores rose 24% on HCAHPS.' },
            ],
            achievements: [
                { id: nextId(), title: 'DAISY Award Nominee 2023', description: 'Extraordinary Nurses recognition' },
                { id: nextId(), title: 'Certifications', description: 'BLS, ACLS, CCRN (in progress)' },
            ],
            customSections: [],
        },
    },
    {
        id: 'graphic-designer',
        title: 'Graphic Designer',
        role: 'Brand & digital',
        description: 'A portfolio-first resume with a visual, expressive layout and award highlights.',
        tags: ['Design', 'Branding', 'Figma'],
        templateId: 'creative',
        roleId: 'graphic-designer',
        formData: {
            firstName: 'Liam',
            lastName: 'Novak',
            designation: 'Graphic Designer',
            email: 'liam.novak@email.com',
            phone: '+1 (310) 555-0196',
            address: 'Los Angeles, CA',
            linkedin: 'linkedin.com/in/liamnovak',
            github: '',
            website: 'liamnovak.design',
            summary: 'Graphic designer with 5 years of experience across brand identity, packaging, and digital campaigns. Known for bold, human-centered work that moves business metrics.',
            image: null,
            skillsRaw: 'Brand Identity, Logo Design, Typography, Figma, Adobe Illustrator, Photoshop, After Effects, Print Design',
            experiences: [
                { id: nextId(), title: 'Graphic Designer', company: 'Pinecone Studio', location: 'Los Angeles, CA', startDate: '2021-05', endDate: '', description: 'Led brand identity for 20+ clients including two Series-A startups\nDesigned packaging and campaign assets that lifted client engagement by up to 35%' },
                { id: nextId(), title: 'Junior Designer', company: 'Marrow Agency', location: 'Austin, TX', startDate: '2019-07', endDate: '2021-04', description: 'Produced social, web, and print collateral for national restaurant and retail brands' },
            ],
            educations: [
                { id: nextId(), school: 'Savannah College of Art and Design', degree: 'B.F.A. Graphic Design', city: 'Savannah, GA', startDate: '2015-09', endDate: '2019-05', description: 'Graduated with honors.' },
            ],
            projects: [
                { id: nextId(), title: 'Orbit Coffee Rebrand', link: 'liamnovak.design/orbit', description: 'Full identity refresh — packaging, signage, and digital — named a Behance Staff Pick.' },
            ],
            achievements: [
                { id: nextId(), title: 'Adobe Design Achievement Awards', description: 'Semi-finalist, Branding 2022' },
                { id: nextId(), title: 'AIGA Portfolio Review', description: 'Selected participant 2021' },
            ],
            customSections: [],
        },
    },
    {
        id: 'attorney',
        title: 'Attorney',
        role: 'Commercial litigation',
        description: 'A formal, education-first legal resume with bar admissions and representative matters.',
        tags: ['Legal', 'Litigation', 'Contracts'],
        templateId: 'legal',
        roleId: 'attorney',
        formData: {
            firstName: 'David',
            lastName: 'Mensah',
            designation: 'Associate Attorney',
            email: 'david.mensah@email.com',
            phone: '+1 (202) 555-0131',
            address: 'Washington, DC',
            linkedin: 'linkedin.com/in/davidmensah',
            github: '',
            website: '',
            summary: 'Litigation associate with 5 years of experience in commercial disputes and regulatory matters. Skilled in motion practice, discovery strategy, and client counseling across the technology sector.',
            image: null,
            skillsRaw: 'Civil Litigation, Motion Practice, Depositions, Contract Drafting, E-Discovery, Legal Research, Regulatory Compliance',
            experiences: [
                { id: nextId(), title: 'Associate', company: 'Whitfield & Cole LLP', location: 'Washington, DC', startDate: '2021-09', endDate: '', description: 'Represented technology and financial clients in 15+ commercial disputes\nDrafted dispositive motions; obtained favorable summary judgment in two matters\nManaged discovery for matters exceeding $50M in controversy' },
                { id: nextId(), title: 'Law Clerk', company: 'Superior Court of DC', location: 'Washington, DC', startDate: '2019-08', endDate: '2021-08', description: 'Researched and drafted opinions for a civil division judge across 200+ matters' },
            ],
            educations: [
                { id: nextId(), school: 'Georgetown University Law Center', degree: 'J.D.', city: 'Washington, DC', startDate: '2016-08', endDate: '2019-05', description: 'Order of the Coif. Notes Editor, Georgetown Law Journal.' },
                { id: nextId(), school: 'Howard University', degree: 'B.A. Political Science', city: 'Washington, DC', startDate: '2012-08', endDate: '2016-05', description: 'Summa cum laude.' },
            ],
            projects: [
                { id: nextId(), title: 'Pro Bono: Veterans Appeals Project', link: '', description: 'Represented three veterans in disability appeals; two favorable rulings.' },
            ],
            achievements: [
                { id: nextId(), title: 'Bar Admissions', description: 'District of Columbia Bar, 2019; U.S. District Court for DC, 2020' },
            ],
            customSections: [],
        },
    },
    {
        id: 'teacher',
        title: 'High School Teacher',
        role: 'Math & science',
        description: 'A warm, achievement-aware resume for educators with classroom impact and certifications.',
        tags: ['Education', 'STEM', 'Curriculum'],
        templateId: 'education',
        roleId: 'teacher',
        formData: {
            firstName: 'Emily',
            lastName: 'Whitfield',
            designation: 'High School Mathematics Teacher',
            email: 'emily.whitfield@email.com',
            phone: '+1 (404) 555-0172',
            address: 'Atlanta, GA',
            linkedin: '',
            github: '',
            website: '',
            summary: 'Dedicated mathematics educator with 8 years of experience raising student achievement in underserved schools. Specializes in project-based learning and data-driven instruction.',
            image: null,
            skillsRaw: 'Curriculum Design, AP Calculus, Data-Driven Instruction, Google Classroom, Differentiated Instruction, Student Mentoring, Nearpod',
            experiences: [
                { id: nextId(), title: 'Mathematics Teacher', company: 'Westbrook High School', location: 'Atlanta, GA', startDate: '2019-08', endDate: '', description: 'Teach AP Calculus AB/BC and Algebra II; AP pass rate improved from 61% to 84%\nLaunched a peer-tutoring program serving 120 students per semester\nLead the math department PLC and mentor 3 new teachers' },
                { id: nextId(), title: 'Mathematics Teacher', company: 'Cedar Ridge Middle School', location: 'Decatur, GA', startDate: '2016-08', endDate: '2019-05', description: 'Raised 8th-grade math proficiency by 19 points on state assessments over two years' },
            ],
            educations: [
                { id: nextId(), school: 'Georgia State University', degree: 'M.Ed. Mathematics Education', city: 'Atlanta, GA', startDate: '2014-08', endDate: '2016-05', description: 'Research focus: mastery-based grading.' },
            ],
            projects: [
                { id: nextId(), title: 'Financial Literacy Elective', link: '', description: 'Designed and taught a semester-long financial literacy course now offered district-wide.' },
            ],
            achievements: [
                { id: nextId(), title: 'Teacher of the Year, Westbrook HS 2022', description: 'Nominated by peers and students' },
                { id: nextId(), title: 'Georgia Teaching Certification', description: 'Mathematics, grades 6-12' },
            ],
            customSections: [],
        },
    },
    {
        id: 'accountant',
        title: 'Accountant',
        role: 'CPA-track',
        description: 'A competencies-first finance resume with certifications and audit experience.',
        tags: ['Finance', 'CPA', 'Audit'],
        templateId: 'finance',
        roleId: 'accountant',
        formData: {
            firstName: 'Grace',
            lastName: 'Kim',
            designation: 'Senior Accountant',
            email: 'grace.kim@email.com',
            phone: '+1 (617) 555-0188',
            address: 'Boston, MA',
            linkedin: 'linkedin.com/in/gracekim',
            github: '',
            website: '',
            summary: 'Senior accountant with 6 years of experience in audit, month-end close, and financial reporting for mid-market clients. CPA candidate with a track record of clean audits and process improvements.',
            image: null,
            skillsRaw: 'GAAP, Financial Reporting, Month-End Close, Audit Preparation, QuickBooks, Excel (Advanced), SAP, Variance Analysis, Internal Controls',
            experiences: [
                { id: nextId(), title: 'Senior Accountant', company: 'Harborline Advisors', location: 'Boston, MA', startDate: '2021-03', endDate: '', description: 'Own month-end close for 12 client entities, reducing close cycle from 10 to 5 days\nPrepare consolidated financial statements and board decks for $40M portfolio\nLead annual audit support; zero material findings for three consecutive years' },
                { id: nextId(), title: 'Staff Accountant', company: 'Meridian Group', location: 'Providence, RI', startDate: '2018-07', endDate: '2021-02', description: 'Performed general ledger reconciliations and journal entries for 20+ accounts\nStreamlined AP workflow, cutting processing time by 30%' },
            ],
            educations: [
                { id: nextId(), school: 'Bentley University', degree: 'B.S. Accounting', city: 'Waltham, MA', startDate: '2014-08', endDate: '2018-05', description: 'Minor in Finance. Beta Alpha Psi member.' },
            ],
            projects: [
                { id: nextId(), title: 'ERP Migration (SAP)', link: '', description: 'Served as accounting lead for a firm-wide SAP migration, training 25 colleagues.' },
            ],
            achievements: [
                { id: nextId(), title: 'CPA Exam', description: 'Passed all four sections; license pending experience requirement' },
            ],
            customSections: [],
        },
    },
    {
        id: 'sales-representative',
        title: 'Sales Representative',
        role: 'B2B SaaS',
        description: 'A quota-beating, numbers-first resume for sales with achievement badges.',
        tags: ['Sales', 'SaaS', 'CRM'],
        templateId: 'marketing',
        roleId: 'sales-representative',
        formData: {
            firstName: 'Tyler',
            lastName: 'Brooks',
            designation: 'Account Executive',
            email: 'tyler.brooks@email.com',
            phone: '+1 (720) 555-0165',
            address: 'Denver, CO',
            linkedin: 'linkedin.com/in/tylerbrooks',
            github: '',
            website: '',
            summary: 'Account executive with 5 years of B2B SaaS sales success, consistently exceeding quota by 120%+. Expert in consultative selling, discovery, and closing enterprise deals.',
            image: null,
            skillsRaw: 'B2B Sales, Consultative Selling, Salesforce, HubSpot, Discovery Calls, Negotiation, Pipeline Management, MEDDIC, Cold Outreach',
            experiences: [
                { id: nextId(), title: 'Account Executive', company: 'Cloudforge', location: 'Denver, CO', startDate: '2021-06', endDate: '', description: 'Exceeded quota 5 consecutive quarters, closing $1.8M in ARR in 2023\nManage a 60-account book of business with 94% net revenue retention\nWon "Rookie of the Year" then "Top Performer" in back-to-back years' },
                { id: nextId(), title: 'Sales Development Representative', company: 'Brightpath', location: 'Boulder, CO', startDate: '2019-06', endDate: '2021-05', description: 'Booked 45+ qualified meetings per quarter with a 28% connect-to-demo rate' },
            ],
            educations: [
                { id: nextId(), school: 'University of Colorado Boulder', degree: 'B.A. Communications', city: 'Boulder, CO', startDate: '2015-08', endDate: '2019-05', description: 'Minor in Business.' },
            ],
            projects: [
                { id: nextId(), title: 'Outbound Playbook', link: '', description: 'Created a sequence playbook adopted by the 12-person SDR team.' },
            ],
            achievements: [
                { id: nextId(), title: 'President\'s Club 2023', description: 'Top 10% of reps company-wide' },
                { id: nextId(), title: 'Deal of the Quarter', description: 'Q3 2022 — $260K expansion deal' },
            ],
            customSections: [],
        },
    },
    {
        id: 'marketing-manager',
        title: 'Marketing Manager',
        role: 'Digital & brand',
        description: 'A campaign-results resume with star highlights for a growth-minded marketer.',
        tags: ['Marketing', 'Growth', 'SEO'],
        templateId: 'marketing',
        roleId: 'marketing-coordinator',
        formData: {
            firstName: 'Ava',
            lastName: 'Laurent',
            designation: 'Marketing Manager',
            email: 'ava.laurent@email.com',
            phone: '+1 (646) 555-0112',
            address: 'New York, NY',
            linkedin: 'linkedin.com/in/avalaurent',
            github: '',
            website: '',
            summary: 'Marketing manager with 6 years of experience building brand and demand-generation programs. Data-driven marketer with a record of doubling pipeline contribution year over year.',
            image: null,
            skillsRaw: 'Demand Generation, SEO/SEM, Content Strategy, Email Marketing, Google Analytics, HubSpot, Paid Social, Brand Strategy, Copywriting',
            experiences: [
                { id: nextId(), title: 'Marketing Manager', company: 'Northbeam', location: 'New York, NY', startDate: '2021-04', endDate: '', description: 'Grew organic traffic 214% in 18 months via SEO overhaul and content engine\nLed a $1.2M paid media budget with blended CAC down 27% YoY\nLaunched email nurture programs generating 38% of new business pipeline' },
                { id: nextId(), title: 'Marketing Coordinator', company: 'Fieldstone Foods', location: 'Jersey City, NJ', startDate: '2019-06', endDate: '2021-03', description: 'Executed 40+ product campaigns across social, email, and in-store; average ROI 4.2x' },
            ],
            educations: [
                { id: nextId(), school: 'NYU Stern School of Business', degree: 'B.S. Marketing', city: 'New York, NY', startDate: '2015-08', endDate: '2019-05', description: 'Dean\'s list, 3 semesters.' },
            ],
            projects: [
                { id: nextId(), title: 'SEO Content Engine', link: '', description: 'Built a 200-article editorial pipeline with a 12-person freelance network.' },
            ],
            achievements: [
                { id: nextId(), title: 'Marketing Team Award 2022', description: 'Company-wide recognition for the SEO program' },
                { id: nextId(), title: 'Google Analytics & HubSpot Certified', description: '' },
            ],
            customSections: [],
        },
    },
];

export const getResumeExamples = (): ResumeExample[] => examples;

export const getResumeExampleById = (id: string): ResumeExample | undefined =>
    examples.find(e => e.id === id);

export default examples;
