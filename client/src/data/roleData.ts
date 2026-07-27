/* ============================================
   Role Data — industry-specific job roles
   Used by the RoleSelector and Quick Fill feature
   ============================================ */

export interface RoleConfig {
    id: string;
    title: string;
    description: string;
    skills: string[];
    sampleEducation: string;
    summaryTemplate: string;
    experienceHints: string[];
}

export interface IndustryRoleMap {
    [industry: string]: RoleConfig[];
}

const roleData: IndustryRoleMap = {
    technology: [
        {
            id: 'software-engineer',
            title: 'Software Engineer',
            description: 'Design, build, and maintain software systems and applications.',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Git', 'SQL', 'AWS', 'Docker', 'REST APIs', 'Agile/Scrum', 'CI/CD'],
            sampleEducation: 'B.Sc. in Computer Science, B.Sc. in Software Engineering',
            summaryTemplate: 'Results-driven Software Engineer with expertise in full-stack development, scalable architecture, and cross-functional collaboration. Proven track record of delivering high-quality software solutions that drive business impact.',
            experienceHints: [
                'Built and deployed microservices that reduced API latency by 40%',
                'Led migration of legacy monolith to cloud-native architecture on AWS',
                'Mentored 3 junior developers through structured code reviews and pair programming'
            ]
        },
        {
            id: 'frontend-developer',
            title: 'Frontend Developer',
            description: 'Create responsive, performant user interfaces and web applications.',
            skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML/CSS', 'Tailwind CSS', 'Figma', 'Webpack', 'Jest', 'GraphQL', 'Responsive Design', 'Accessibility'],
            sampleEducation: 'B.Sc. in Computer Science, B.A. in Web Development',
            summaryTemplate: 'Creative Frontend Developer skilled in building responsive, accessible web applications with modern frameworks. Passionate about pixel-perfect UIs, smooth interactions, and performant code that delights users.',
            experienceHints: [
                'Developed a component library used across 5 product teams, reducing UI development time by 60%',
                'Optimized Core Web Vitals, improving LCP by 45% and boosting organic search traffic by 30%',
                'Implemented design system in React/TypeScript with full accessibility compliance (WCAG 2.1 AA)'
            ]
        },
        {
            id: 'data-scientist',
            title: 'Data Scientist',
            description: 'Analyze complex data to drive strategic decisions using ML and statistical modeling.',
            skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Visualization', 'Statistical Analysis', 'Deep Learning', 'NLP'],
            sampleEducation: 'M.Sc. in Data Science, Ph.D. in Statistics',
            summaryTemplate: 'Analytical Data Scientist with deep expertise in machine learning, statistical modeling, and data-driven decision making. Adept at translating complex data into actionable business insights.',
            experienceHints: [
                'Built a recommendation system that increased user engagement by 35% using collaborative filtering',
                'Developed predictive models with 92% accuracy for customer churn prevention',
                'Designed and deployed ML pipelines processing 10M+ records daily on AWS SageMaker'
            ]
        },
        {
            id: 'devops-engineer',
            title: 'DevOps Engineer',
            description: 'Automate infrastructure, streamline deployment pipelines, and ensure system reliability.',
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Jenkins', 'Ansible', 'Prometheus', 'GitOps', 'Helm'],
            sampleEducation: 'B.Sc. in Computer Science, B.Sc. in Information Systems',
            summaryTemplate: 'Infrastructure-focused DevOps Engineer with expertise in cloud architecture, containerization, and CI/CD automation. Committed to building resilient, scalable systems that enable rapid deployment.',
            experienceHints: [
                'Reduced deployment time from 2 hours to 8 minutes with automated CI/CD pipeline on AWS',
                'Managed Kubernetes cluster serving 500K+ daily active users with 99.99% uptime',
                'Implemented infrastructure-as-code with Terraform, reducing provisioning errors by 80%'
            ]
        },
        {
            id: 'product-manager',
            title: 'Product Manager',
            description: 'Define product vision, prioritize features, and drive cross-functional execution.',
            skills: ['Product Strategy', 'User Research', 'A/B Testing', 'Agile/Scrum', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'SQL', 'Figma', 'JIRA', 'OKR Planning', 'UX Design'],
            sampleEducation: 'MBA, B.Sc. in Business / Computer Science',
            summaryTemplate: 'Strategic Product Manager with a track record of launching data-driven products that solve real user problems. Skilled at aligning cross-functional teams around a compelling product vision.',
            experienceHints: [
                'Launched a SaaS product that grew to $2M ARR within 18 months',
                'Defined product roadmap based on user research, increasing NPS from 42 to 68',
                'Led cross-functional team of 12 engineers, designers, and marketers to ship 3 major releases'
            ]
        }
    ],
    finance: [
        {
            id: 'accountant',
            title: 'Accountant',
            description: 'Manage financial records, ensure compliance, and prepare accurate reporting.',
            skills: ['Financial Reporting', 'GAAP/IFRS', 'QuickBooks', 'Excel', 'Tax Preparation', 'Auditing', 'Accounts Payable', 'Accounts Receivable', 'ERP Systems', 'Reconciliation'],
            sampleEducation: 'B.Sc. in Accounting, CPA Certification',
            summaryTemplate: 'Detail-oriented Accountant with expertise in financial reporting, tax compliance, and process optimization. Proven ability to maintain accurate records while identifying cost-saving opportunities.',
            experienceHints: [
                'Streamlined month-end close process, reducing closing time from 10 to 4 days',
                'Managed AP/AR for $50M annual revenue portfolio with 99.8% accuracy',
                'Led annual audit preparation, resulting in zero material findings for 3 consecutive years'
            ]
        },
        {
            id: 'financial-analyst',
            title: 'Financial Analyst',
            description: 'Analyze financial data, build models, and support strategic investment decisions.',
            skills: ['Financial Modeling', 'Excel/VBA', 'Bloomberg Terminal', 'SQL', 'Data Analysis', 'Valuation', 'Forecasting', 'PowerPoint', 'Tableau', 'Risk Assessment'],
            sampleEducation: 'B.Sc. in Finance, MBA, CFA Candidate',
            summaryTemplate: 'Analytical Financial Analyst with strong modeling skills and deep understanding of capital markets. Combines quantitative rigor with business acumen to deliver actionable investment insights.',
            experienceHints: [
                'Built financial models supporting $200M in M&A transactions with 95% forecast accuracy',
                'Developed automated reporting dashboards that saved 20 hours per week for the analytics team',
                'Conducted industry research that identified 3 high-growth investment opportunities'
            ]
        },
        {
            id: 'investment-banker',
            title: 'Investment Banker',
            description: 'Advise clients on M&A, capital raising, and strategic financial transactions.',
            skills: ['Financial Modeling', 'Valuation', 'M&A', 'Deal Structuring', 'Due Diligence', 'Pitch Books', 'Excel', 'PowerPoint', 'Bloomberg', 'Negotiation'],
            sampleEducation: 'B.Sc. in Finance/Economics, MBA, Series 79/63',
            summaryTemplate: 'High-performing Investment Banker with experience executing complex M&A and financing transactions. Combines sharp financial analysis with strong client relationship skills to deliver results.',
            experienceHints: [
                'Executed 10+ M&A transactions totaling $1.5B in deal value across TMT sectors',
                'Led due diligence for a $500M cross-border acquisition, identifying $50M in synergies',
                'Prepared valuation analyses and pitch materials that won 3 new mandates in 12 months'
            ]
        }
    ],
    healthcare: [
        {
            id: 'registered-nurse',
            title: 'Registered Nurse',
            description: 'Provide patient care, administer treatments, and coordinate with healthcare teams.',
            skills: ['Patient Care', 'EMR/EHR Systems', 'Medication Administration', 'Care Coordination', 'Wound Care', 'IV Therapy', 'Patient Assessment', 'Health Education', 'Critical Thinking', 'BLS/ACLS'],
            sampleEducation: 'B.Sc. in Nursing, RN License',
            summaryTemplate: 'Compassionate Registered Nurse with expertise in patient-centered care, clinical assessment, and interdisciplinary collaboration. Dedicated to improving patient outcomes through evidence-based practice.',
            experienceHints: [
                'Managed care for 15+ patients per shift in a fast-paced 40-bed medical-surgical unit',
                'Implemented a fall prevention protocol that reduced patient falls by 45%',
                'Trained and mentored 8 new graduate nurses through a structured orientation program'
            ]
        },
        {
            id: 'medical-doctor',
            title: 'Physician / Medical Doctor',
            description: 'Diagnose and treat medical conditions, manage patient care, and supervise clinical teams.',
            skills: ['Diagnosis', 'Treatment Planning', 'Patient Management', 'Clinical Research', 'EHR Systems', 'Surgical Procedures', 'Prescribing', 'Medical Documentation', 'Team Leadership', 'Board Certification'],
            sampleEducation: 'MD, Residency in Specialty Area',
            summaryTemplate: 'Board-certified Physician with comprehensive experience in patient diagnosis, treatment, and clinical leadership. Committed to delivering high-quality, evidence-based medical care.',
            experienceHints: [
                'Diagnosed and treated 2,000+ patients annually in a high-volume outpatient clinic',
                'Led quality improvement initiative that reduced hospital readmission rates by 28%',
                'Published 5 peer-reviewed articles on advances in internal medicine'
            ]
        },
        {
            id: 'healthcare-administrator',
            title: 'Healthcare Administrator',
            description: 'Manage healthcare facility operations, budgets, and regulatory compliance.',
            skills: ['Operations Management', 'Healthcare Compliance', 'Budgeting', 'Strategic Planning', 'HIPAA', 'Staff Management', 'Policy Development', 'Quality Improvement', 'EPIC/Cerner', 'Patient Experience'],
            sampleEducation: 'MHA, MBA in Healthcare Management',
            summaryTemplate: 'Results-driven Healthcare Administrator with expertise in operational efficiency, regulatory compliance, and strategic growth. Passionate about improving healthcare delivery through effective leadership.',
            experienceHints: [
                'Managed $25M operational budget for a 200-bed community hospital',
                'Reduced patient wait times by 35% through process redesign and staff optimization',
                'Led facility through successful Joint Commission accreditation with zero citations'
            ]
        }
    ],
    ['creative design']: [
        {
            id: 'graphic-designer',
            title: 'Graphic Designer',
            description: 'Create visual concepts, branding materials, and compelling digital designs.',
            skills: ['Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Brand Identity', 'Figma', 'Motion Design', 'Print Design', 'Color Theory'],
            sampleEducation: 'B.F.A. in Graphic Design, B.A. in Visual Arts',
            summaryTemplate: 'Creative Graphic Designer with a passion for visual storytelling and brand identity. Combines artistic vision with strategic thinking to create designs that captivate audiences and drive results.',
            experienceHints: [
                'Designed brand identity for 20+ startups, including logos, style guides, and marketing collateral',
                'Created visual assets for campaigns that generated $5M+ in revenue',
                'Led redesign of company website, improving conversion rate by 25%'
            ]
        },
        {
            id: 'ui-ux-designer',
            title: 'UI/UX Designer',
            description: 'Design intuitive user interfaces and seamless digital experiences.',
            skills: ['Figma', 'Sketch', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Interaction Design', 'Information Architecture', 'HTML/CSS'],
            sampleEducation: 'B.Sc. in HCI / Interaction Design, UX Certification',
            summaryTemplate: 'User-centered UI/UX Designer with expertise in research, prototyping, and design systems. Passionate about creating intuitive, accessible experiences that solve real user problems.',
            experienceHints: [
                'Redesigned core product flow, improving task completion rate by 55% and reducing drop-off by 40%',
                'Built and maintained a design system used across 3 product lines with 200+ components',
                'Conducted 50+ user research sessions, translating insights into 30+ design improvements'
            ]
        },
        {
            id: 'art-director',
            title: 'Art Director',
            description: 'Lead visual direction, manage creative teams, and execute brand strategy.',
            skills: ['Creative Direction', 'Brand Strategy', 'Team Leadership', 'Art Direction', 'Adobe Creative Suite', 'Photography', 'Campaign Design', 'Visual Storytelling', 'Client Management', 'Budget Planning'],
            sampleEducation: 'B.F.A. in Fine Arts / Graphic Design, 7+ years experience',
            summaryTemplate: 'Visionary Art Director with a proven track record of leading creative teams to produce award-winning work. Combines strategic brand thinking with exceptional visual execution.',
            experienceHints: [
                'Led creative direction for campaigns that won 5 industry awards including Cannes Lion',
                'Managed a team of 12 designers, photographers, and copywriters across multiple projects',
                'Developed brand identity refresh for Fortune 500 client, increasing brand recall by 35%'
            ]
        }
    ],
    legal: [
        {
            id: 'attorney',
            title: 'Attorney / Lawyer',
            description: 'Provide legal counsel, represent clients, and handle complex litigation or transactions.',
            skills: ['Legal Research', 'Litigation', 'Contract Drafting', 'Negotiation', 'Client Counseling', 'Case Management', 'Trial Preparation', 'Legal Writing', 'Corporate Law', 'Compliance'],
            sampleEducation: 'J.D. from ABA-accredited law school, Bar Admission',
            summaryTemplate: 'Dedicated Attorney with comprehensive experience in litigation, client advocacy, and legal strategy. Known for meticulous preparation, persuasive advocacy, and achieving favorable outcomes.',
            experienceHints: [
                'Successfully represented clients in 25+ trials with an 85% favorable verdict rate',
                'Negotiated settlements totaling $10M+ in complex commercial litigation cases',
                'Drafted and reviewed 500+ contracts, identifying and mitigating key legal risks'
            ]
        },
        {
            id: 'paralegal',
            title: 'Paralegal',
            description: 'Support attorneys with case research, document preparation, and client coordination.',
            skills: ['Legal Research', 'Document Management', 'Case Preparation', 'E-Discovery', 'Client Communication', 'Legal Writing', 'Trial Support', 'Westlaw/LexisNexis', 'Organizational Skills', 'Time Management'],
            sampleEducation: 'A.A.S./B.A. in Paralegal Studies, Paralegal Certification',
            summaryTemplate: 'Detail-oriented Paralegal with strong legal research and document management skills. Provides high-quality support to attorneys while ensuring accuracy and timeliness in all case matters.',
            experienceHints: [
                'Managed discovery process for complex litigation involving 100K+ documents',
                'Prepared trial exhibits and witness binders for 15+ federal and state trials',
                'Drafted legal documents including pleadings, motions, and discovery requests'
            ]
        },
        {
            id: 'corporate-counsel',
            title: 'Corporate Counsel',
            description: 'Provide in-house legal advice on business transactions, compliance, and corporate governance.',
            skills: ['Corporate Governance', 'M&A', 'Contract Law', 'Compliance', 'Intellectual Property', 'Employment Law', 'Risk Management', 'Regulatory Affairs', 'Negotiation', 'Board Advisory'],
            sampleEducation: 'J.D. from accredited law school, Bar Admission, 3+ years experience',
            summaryTemplate: 'Strategic Corporate Counsel with expertise in governance, transactions, and compliance. Partners with business leaders to deliver practical legal solutions that enable growth while managing risk.',
            experienceHints: [
                'Advised on 15+ M&A transactions totaling $800M, including due diligence and integration',
                'Developed global compliance program that reduced regulatory incidents by 70%',
                'Managed IP portfolio of 200+ patents and trademarks across 12 jurisdictions'
            ]
        }
    ],
    education: [
        {
            id: 'teacher',
            title: 'Teacher',
            description: 'Plan and deliver engaging lessons, assess student progress, and foster a positive learning environment.',
            skills: ['Curriculum Development', 'Classroom Management', 'Lesson Planning', 'Student Assessment', 'Differentiated Instruction', 'Educational Technology', 'Parent Communication', 'Data-Driven Instruction', 'Behavior Management', 'Collaborative Teaching'],
            sampleEducation: 'B.Ed., M.Ed., State Teaching Credential',
            summaryTemplate: 'Passionate educator with expertise in curriculum design, differentiated instruction, and student engagement. Committed to creating inclusive learning environments where every student can succeed.',
            experienceHints: [
                'Improved standardized test scores by 25% through data-driven instructional strategies',
                'Developed and implemented a project-based learning curriculum for 150+ students',
                'Served as grade-level lead, mentoring 5 new teachers through their first year'
            ]
        },
        {
            id: 'professor',
            title: 'Professor / Lecturer',
            description: 'Conduct research, teach undergraduate/graduate courses, and contribute to academic scholarship.',
            skills: ['Academic Research', 'Teaching', 'Curriculum Design', 'Student Mentoring', 'Grant Writing', 'Scholarly Publishing', 'Conference Presentations', 'Committee Service', 'Course Development', 'Public Speaking'],
            sampleEducation: 'Ph.D. in relevant field, 5+ years teaching experience',
            summaryTemplate: 'Accomplished Professor with a strong record of research, publication, and student mentorship. Dedicated to advancing knowledge in the field while inspiring the next generation of scholars.',
            experienceHints: [
                'Published 15+ peer-reviewed articles and 2 books in the field of [specialization]',
                'Secured $1.2M in research grants from NSF and private foundations',
                'Taught 20+ undergraduate and graduate courses with consistently outstanding student evaluations'
            ]
        },
        {
            id: 'instructional-designer',
            title: 'Instructional Designer',
            description: 'Design engaging learning experiences, develop curriculum, and leverage educational technology.',
            skills: ['Instructional Design', 'Articulate Storyline', 'SCORM/xAPI', 'Learning Management Systems', 'Curriculum Mapping', 'E-Learning Development', 'Assessment Design', 'ADDIE Model', 'Camtasia', 'Project Management'],
            sampleEducation: 'M.Ed. in Instructional Design, B.A. in Education Technology',
            summaryTemplate: 'Innovative Instructional Designer with expertise in creating engaging, technology-enhanced learning experiences. Skilled at translating complex content into accessible, effective educational materials.',
            experienceHints: [
                'Designed and developed 50+ e-learning modules used by 10,000+ learners globally',
                'Reduced training time by 40% through implementation of microlearning strategy',
                'Led migration of training content to new LMS, improving completion rates by 55%'
            ]
        }
    ],
    general: [
        {
            id: 'business-analyst',
            title: 'Business Analyst',
            description: 'Bridge business needs and technical solutions through requirements gathering and process analysis.',
            skills: ['Requirements Gathering', 'Data Analysis', 'Process Modeling', 'SQL', 'Agile/Scrum', 'JIRA', 'Stakeholder Management', 'Documentation', 'User Stories', 'UML/BPMN'],
            sampleEducation: 'B.Sc. in Business / Information Systems, CBAP Certification',
            summaryTemplate: 'Analytical Business Analyst skilled at translating complex business requirements into actionable technical solutions. Proven track record of improving processes and delivering measurable value.',
            experienceHints: [
                'Gathered and documented requirements for a $2M ERP implementation across 4 departments',
                'Implemented process improvements that reduced operational costs by 20% annually',
                'Created 100+ user stories and acceptance criteria for Agile development teams'
            ]
        },
        {
            id: 'project-manager',
            title: 'Project Manager',
            description: 'Plan, execute, and deliver projects on time, within scope, and within budget.',
            skills: ['Project Planning', 'Risk Management', 'Agile/Scrum', 'JIRA/MS Project', 'Budget Management', 'Stakeholder Communication', 'Team Leadership', 'Vendor Management', 'PMBOK/PRINCE2', 'Resource Allocation'],
            sampleEducation: 'B.Sc. in Business / Management, PMP Certification',
            summaryTemplate: 'Results-oriented Project Manager with expertise in delivering complex projects on time and within budget. Combines strong leadership skills with meticulous planning to drive team success.',
            experienceHints: [
                'Delivered 15+ projects with 95% on-time completion rate and under budget variance',
                'Managed cross-functional teams of up to 20 members across 3 geographic locations',
                'Implemented Agile methodologies that improved team velocity by 40% in 6 months'
            ]
        },
        {
            id: 'sales-representative',
            title: 'Sales Representative',
            description: 'Drive revenue growth through prospecting, relationship building, and closing deals.',
            skills: ['Sales Prospecting', 'CRM (Salesforce/HubSpot)', 'Negotiation', 'Cold Calling', 'Pipeline Management', 'Presentation Skills', 'Account Management', 'Revenue Forecasting', 'Customer Relationships', 'Contract Negotiation'],
            sampleEducation: 'B.Sc. in Business / Marketing, Sales Training',
            summaryTemplate: 'High-achieving Sales Representative with a consistent track record of exceeding revenue targets. Skilled at building strong client relationships and closing complex deals.',
            experienceHints: [
                'Exceeded annual sales quota of $1.5M by 35% for 3 consecutive years',
                'Built and managed a pipeline of 200+ prospects, converting 25% to closed deals',
                'Expanded key accounts by 50% through strategic upselling and relationship management'
            ]
        },
        {
            id: 'marketing-coordinator',
            title: 'Marketing Coordinator',
            description: 'Execute marketing campaigns, manage content, and coordinate cross-channel initiatives.',
            skills: ['Content Marketing', 'Social Media Management', 'Email Marketing', 'SEO/SEM', 'Google Analytics', 'HubSpot/Mailchimp', 'Copywriting', 'Campaign Analysis', 'Canva/Adobe Suite', 'Event Coordination'],
            sampleEducation: 'B.A. in Marketing / Communications',
            summaryTemplate: 'Creative Marketing Coordinator with experience driving brand awareness and engagement through multi-channel campaigns. Combines analytical thinking with creative execution to deliver results.',
            experienceHints: [
                'Managed social media strategy that grew follower base by 300% in 12 months',
                'Coordinated 20+ marketing campaigns generating $500K in attributed revenue',
                'Created email marketing program with 45% open rate and 12% conversion rate'
            ]
        },
        {
            id: 'hr-coordinator',
            title: 'HR Coordinator',
            description: 'Support recruitment, onboarding, employee relations, and HR operations.',
            skills: ['Recruitment', 'Onboarding', 'HRIS (BambooHR/Workday)', 'Employee Relations', 'Benefits Administration', 'Payroll Support', 'Compliance', 'Performance Management', 'Conflict Resolution', 'MS Office'],
            sampleEducation: 'B.A. in HR Management, PHR Certification',
            summaryTemplate: 'Organized HR Coordinator with experience in recruitment, employee relations, and HR operations. Committed to creating positive employee experiences and supporting organizational growth.',
            experienceHints: [
                'Managed full-cycle recruitment for 50+ positions annually, reducing time-to-fill by 30%',
                'Developed onboarding program that improved new hire retention by 25%',
                'Processed payroll and benefits for 200+ employees with 100% accuracy'
            ]
        }
    ]
};

export default roleData;

/** Get roles for a given industry */
export function getRolesForIndustry(industry: string): RoleConfig[] {
    const key = industry?.toLowerCase() || 'general';
    return roleData[key] || roleData.general;
}

/** Find a role by ID */
export function findRoleById(roleId: string): RoleConfig | undefined {
    for (const roles of Object.values(roleData)) {
        const found = roles.find(r => r.id === roleId);
        if (found) return found;
    }
    return undefined;
}
