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
            id: 'ml-engineer',
            title: 'ML Engineer',
            description: 'Design, train, and deploy machine learning models into production systems.',
            skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'ML Pipelines', 'MLOps', 'Docker', 'Kubernetes', 'Feature Engineering', 'Model Deployment', 'AWS', 'SQL'],
            sampleEducation: 'B.Sc./M.Sc. in Computer Science, ML Specialization',
            summaryTemplate: 'Hands-on ML Engineer with experience taking models from research to production. Skilled in building scalable training pipelines, serving infrastructure, and monitoring model performance in the real world.',
            experienceHints: [
                'Deployed 15+ ML models to production serving 1M+ predictions per day',
                'Built an MLOps pipeline with CI/CD that cut model release time from 3 weeks to 2 days',
                'Reduced model inference cost by 45% through quantization and optimized serving'
            ]
        },
        {
            id: 'data-analyst',
            title: 'Data Analyst',
            description: 'Turn raw data into clear insights, dashboards, and business recommendations.',
            skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Data Cleaning', 'Statistical Analysis', 'A/B Testing', 'Data Visualization', 'Google Analytics'],
            sampleEducation: 'B.Sc. in Statistics, Data Analytics, or Business',
            summaryTemplate: 'Detail-oriented Data Analyst skilled at translating complex datasets into actionable insights. Strong command of SQL, visualization tools, and A/B testing to drive data-informed decisions.',
            experienceHints: [
                'Built dashboards used by 10+ teams to monitor 40+ KPIs daily',
                'Ran A/B tests that lifted conversion by 12% across the signup funnel',
                'Automated weekly reporting with SQL + Python, saving 15 hours per week'
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
        },
        {
            id: 'backend-developer',
            title: 'Backend Developer',
            description: 'Build and maintain server-side logic, APIs, and databases that power applications.',
            skills: ['Node.js', 'Python', 'Java', 'Go', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Microservices', 'System Design'],
            sampleEducation: 'B.Sc. in Computer Science, B.Sc. in Software Engineering',
            summaryTemplate: 'Backend Developer focused on designing scalable APIs, data models, and services. Proven record of shipping reliable systems that handle high traffic with clean, maintainable code.',
            experienceHints: [
                'Designed a REST API serving 50M requests/day with 99.9% uptime',
                'Rebuilt a data layer in PostgreSQL that cut query latency 60%',
                'Introduced caching with Redis that reduced database load 45%'
            ]
        },

        {
            id: 'full-stack-developer',
            title: 'Full-Stack Developer',
            description: 'Build complete web applications end to end, from database to user interface.',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'Testing', 'CI/CD', 'System Design'],
            sampleEducation: 'B.Sc. in Computer Science, Coding Bootcamp + B.Sc.',
            summaryTemplate: 'Full-Stack Developer who ships complete features from database schema to polished UI. Comfortable across the stack and focused on performance, testing, and clean architecture.',
            experienceHints: [
                'Built a full-stack SaaS product used by 10,000+ users with 99.9% uptime',
                'Shipped 40+ end-to-end features in 12 months as the solo engineer on a product team',
                'Cut page load times 50% by refactoring the API and client data fetching'
            ]
        },

        {
            id: 'qa-engineer',
            title: 'QA Engineer',
            description: 'Design and execute test strategies to ensure software quality and reliability.',
            skills: ['Test Automation', 'Selenium', 'Cypress', 'Playwright', 'Jest', 'API Testing', 'Postman', 'CI/CD', 'Test Planning', 'Bug Tracking', 'Agile/Scrum', 'Performance Testing'],
            sampleEducation: 'B.Sc. in Computer Science / IT, ISTQB Certification',
            summaryTemplate: 'QA Engineer with a passion for breaking things on purpose. Experienced building automated test suites that catch regressions early and keep release cycles fast.',
            experienceHints: [
                'Built a Cypress test suite with 1,200+ E2E cases cutting release bugs 70%',
                'Introduced API testing that caught 90% of integration defects pre-release',
                'Reduced regression test time from 3 days to 4 hours via parallel execution'
            ]
        },

        {
            id: 'cloud-engineer',
            title: 'Cloud Engineer',
            description: 'Design, deploy, and optimize cloud infrastructure on AWS, Azure, or GCP.',
            skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Networking', 'Security', 'Cloud Architecture', 'Linux', 'Cost Optimization'],
            sampleEducation: 'B.Sc. in Computer Science / IT, AWS/Azure Certification',
            summaryTemplate: 'Cloud Engineer who designs secure, cost-efficient infrastructure as code. Experienced migrating workloads, automating deployments, and keeping clouds well-architected.',
            experienceHints: [
                'Migrated 30+ workloads to AWS saving $180K/year in infrastructure cost',
                'Built a Terraform platform that provisions environments in minutes, not days',
                'Implemented security controls that passed a SOC 2 audit with zero findings'
            ]
        },

        {
            id: 'cybersecurity-analyst',
            title: 'Cybersecurity Analyst',
            description: 'Monitor, detect, and respond to security threats across the organization.',
            skills: ['SIEM', 'Threat Detection', 'Incident Response', 'Vulnerability Management', 'Firewalls', 'EDR', 'Network Security', 'Penetration Testing', 'Risk Assessment', 'Security Compliance'],
            sampleEducation: 'B.Sc. in Cybersecurity / IT, Security+ Certification',
            summaryTemplate: 'Cybersecurity Analyst with hands-on experience in threat monitoring, incident response, and vulnerability management. Keeps systems secure through vigilance and process.',
            experienceHints: [
                'Triaged 2,000+ security alerts per month with 15% mean time to response improvement',
                'Led incident response for a ransomware attempt, containing it in under 2 hours',
                'Remediated 1,500+ vulnerabilities across the environment in one year'
            ]
        },
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
        },
        {
            id: 'auditor',
            title: 'Auditor',
            description: 'Examine financial records and controls to ensure accuracy and compliance.',
            skills: ['Auditing', 'GAAP/IFRS', 'SOX', 'Risk Assessment', 'Financial Analysis', 'Data Analytics', 'Internal Controls', 'Documentation', 'Excel', 'CPA'],
            sampleEducation: 'B.Sc. in Accounting, CPA Certification',
            summaryTemplate: 'Auditor with a sharp eye for detail and a track record of clean audits. Experienced in financial statement audits, SOX testing, and internal control evaluation.',
            experienceHints: [
                'Led audits of $100M+ revenue portfolios with zero material findings',
                'Tested 200+ SOX controls across 5 business units',
                'Automated sampling workflows, cutting audit fieldwork time 30%'
            ]
        },

        {
            id: 'controller',
            title: 'Controller',
            description: 'Own the accounting function: reporting, compliance, and financial operations.',
            skills: ['Financial Reporting', 'GAAP', 'Month-End Close', 'Budgeting', 'Cash Management', 'Team Leadership', 'ERP Systems', 'Internal Controls', 'Tax Compliance', 'Audit Management'],
            sampleEducation: 'B.Sc. in Accounting, CPA, 7+ years experience',
            summaryTemplate: 'Controller with experience running complete accounting functions. Delivers accurate reporting, tight controls, and close cycles that scale with the business.',
            experienceHints: [
                'Owned full close for a $200M company, consistently closing in 4 days',
                'Built a finance team and processes that scaled from startup to Series C',
                'Cut audit fees 25% by strengthening internal controls and documentation'
            ]
        },

        {
            id: 'credit-analyst',
            title: 'Credit Analyst',
            description: 'Assess creditworthiness, structure loans, and manage portfolio risk.',
            skills: ['Credit Analysis', 'Financial Modeling', 'Risk Assessment', 'Financial Statements', 'Lending', 'Excel', 'Underwriting', 'Cash Flow Analysis', 'Due Diligence', 'Portfolio Management'],
            sampleEducation: 'B.Sc. in Finance / Economics, CFA Candidate',
            summaryTemplate: 'Credit Analyst who evaluates risk with rigor and speed. Strong at financial modeling, covenant analysis, and structuring decisions that protect the book.',
            experienceHints: [
                'Underwrote $300M in commercial credit with losses 40% below portfolio average',
                'Built a scoring model that cut review turnaround from 5 days to 1',
                'Restructured 12 distressed credits recovering 85% of exposure'
            ]
        },

        {
            id: 'financial-planner',
            title: 'Financial Planner',
            description: 'Help clients build and execute plans to reach their financial goals.',
            skills: ['Financial Planning', 'Investments', 'Retirement Planning', 'Tax Strategy', 'Client Relationships', 'CFP', 'Risk Management', 'Estate Planning', 'Portfolio Analysis', 'Communication'],
            sampleEducation: 'B.Sc. in Finance, CFP Certification',
            summaryTemplate: 'Financial Planner who turns client goals into clear, actionable plans. Trusted advisor focused on long-term outcomes and clear communication.',
            experienceHints: [
                'Managed 120+ client relationships representing $80M in assets',
                'Grew a client book 45% through referrals in 24 months',
                'Built financial plans that helped clients increase savings rates 30%'
            ]
        },
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
        },
        {
            id: 'physician-assistant',
            title: 'Physician Assistant',
            description: 'Diagnose, treat, and manage patient care under physician supervision.',
            skills: ['Patient Assessment', 'Diagnosis', 'Treatment Planning', 'Prescribing', 'EMR/EHR', 'Minor Procedures', 'Patient Education', 'Care Coordination', 'BLS/ACLS', 'Documentation'],
            sampleEducation: 'M.Sc. in Physician Assistant Studies, NCCPA Certification',
            summaryTemplate: 'Physician Assistant providing high-quality, evidence-based care across outpatient and urgent care settings. Skilled at diagnosis, treatment, and patient education.',
            experienceHints: [
                'Evaluated 80+ patients per week in a busy urgent care clinic',
                'Diagnosed and treated 1,500+ acute conditions with a 98% patient satisfaction score',
                'Implemented a follow-up protocol that cut readmissions 20%'
            ]
        },

        {
            id: 'physical-therapist',
            title: 'Physical Therapist',
            description: 'Help patients recover movement and function through targeted therapy.',
            skills: ['Patient Assessment', 'Rehabilitation', 'Manual Therapy', 'Therapeutic Exercise', 'Orthopedic Care', 'Treatment Planning', 'Patient Education', 'Documentation', 'Sports Injury', 'Geriatric Care'],
            sampleEducation: 'DPT, State Physical Therapy License',
            summaryTemplate: 'Physical Therapist who helps patients get back to what they love. Experienced in orthopedic rehab, manual therapy, and measurable recovery plans.',
            experienceHints: [
                'Managed 15+ patients daily, achieving 92% goal-attainment rate',
                'Built a post-op ACL protocol that cut recovery time 25%',
                'Educated 200+ patients on injury prevention with a 95% satisfaction rating'
            ]
        },

        {
            id: 'pharmacist',
            title: 'Pharmacist',
            description: 'Dispense medications, counsel patients, and ensure safe drug therapy.',
            skills: ['Medication Dispensing', 'Pharmacy Law', 'Drug Interactions', 'Patient Counseling', 'Immunizations', 'Clinical Services', 'Inventory Management', 'Insurance Billing', 'MTM', 'Documentation'],
            sampleEducation: 'Pharm.D., State Pharmacist License',
            summaryTemplate: 'Pharmacist dedicated to medication safety and patient outcomes. Experienced in dispensing, clinical counseling, and immunization services.',
            experienceHints: [
                'Dispensed 300+ prescriptions daily with a 99.99% accuracy rate',
                'Delivered 1,000+ immunizations in a single flu season',
                'Caught 40+ dangerous drug interactions, preventing adverse events'
            ]
        },

        {
            id: 'medical-technician',
            title: 'Medical Technician',
            description: 'Perform diagnostic tests and operate lab or imaging equipment to support care.',
            skills: ['Phlebotomy', 'Lab Testing', 'EKG', 'Specimen Handling', 'Quality Control', 'HIPAA', 'Medical Equipment', 'Documentation', 'Patient Care', 'Certification'],
            sampleEducation: 'Associate Degree in Medical Technology, Certification',
            summaryTemplate: 'Medical Technician skilled in phlebotomy, lab testing, and diagnostic support. Accurate, efficient, and committed to quality and patient comfort.',
            experienceHints: [
                'Collected and processed 100+ specimens daily with zero labeling errors',
                'Maintained 100% QC compliance across 2 years of lab operations',
                'Trained 10 new technicians on phlebotomy and EKG procedures'
            ]
        },
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
        },
        {
            id: 'illustrator',
            title: 'Illustrator',
            description: 'Create original artwork for books, brands, products, and digital media.',
            skills: ['Illustration', 'Procreate', 'Photoshop', 'Digital Painting', 'Character Design', 'Storyboarding', 'Typography', 'Print & Web', 'Brand Identity', 'Creative Briefs'],
            sampleEducation: 'B.F.A. in Illustration / Fine Arts',
            summaryTemplate: 'Illustrator with a distinctive portfolio across editorial, brand, and product work. Combines strong technique with storytelling and client collaboration.',
            experienceHints: [
                'Produced 200+ illustrations for a national magazine over 3 years',
                'Illustrated 12 children’s books including a bestseller',
                'Partnered with 30+ brands on packaging and campaign artwork'
            ]
        },

        {
            id: 'motion-designer',
            title: 'Motion Designer',
            description: 'Create animated graphics and video content for brands and products.',
            skills: ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Blender', '2D/3D Animation', 'Motion Graphics', 'Video Editing', 'Sound Design', 'Storyboarding', 'Typography Animation'],
            sampleEducation: 'B.A. in Animation / Motion Design, Portfolio',
            summaryTemplate: 'Motion Designer who brings brands to life through animation. Experienced across explainers, product UI motion, and social-first content.',
            experienceHints: [
                'Created 60+ motion pieces that drove 25M+ combined views',
                'Designed a UI motion system adopted across an app used by 2M users',
                'Delivered an animated brand launch film for a Series B startup'
            ]
        },

        {
            id: 'brand-designer',
            title: 'Brand Designer',
            description: 'Craft visual identities, guidelines, and brand systems that stand out.',
            skills: ['Brand Identity', 'Logo Design', 'Design Systems', 'Typography', 'Color Strategy', 'Art Direction', 'Figma', 'Adobe Suite', 'Packaging', 'Brand Guidelines'],
            sampleEducation: 'B.F.A. in Graphic Design / Branding',
            summaryTemplate: 'Brand Designer who builds identities that feel strategic and look unforgettable. Experienced from discovery and naming to full guideline systems.',
            experienceHints: [
                'Rebranded 25+ companies including a national retail chain',
                'Built a 100-page brand guideline system adopted company-wide',
                'Designed an identity that won 3 industry design awards'
            ]
        },
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
        },
        {
            id: 'legal-assistant',
            title: 'Legal Assistant',
            description: 'Support legal teams with documents, research, scheduling, and client communication.',
            skills: ['Legal Documents', 'Filing Systems', 'Legal Research', 'Case Management', 'Client Communication', 'Scheduling', 'Billing', 'E-Discovery', 'MS Office', 'Confidentiality'],
            sampleEducation: 'A.A./B.A. in Paralegal/Legal Studies',
            summaryTemplate: 'Organized Legal Assistant who keeps matters moving. Experienced with filings, client communication, and the systems that keep a busy practice running.',
            experienceHints: [
                'Prepared and filed 500+ legal documents with 100% court-compliance rate',
                'Managed case calendars for 6 attorneys across 100+ active matters',
                'Cut document turnaround 35% by digitizing a legacy filing system'
            ]
        },

        {
            id: 'compliance-officer',
            title: 'Compliance Officer',
            description: 'Ensure the organization meets regulatory, legal, and policy requirements.',
            skills: ['Regulatory Compliance', 'Risk Assessment', 'Policy Development', 'Audits', 'Data Privacy (GDPR/CCPA)', 'Training', 'Investigations', 'AML/KYC', 'Reporting', 'Stakeholder Management'],
            sampleEducation: 'B.A./B.Sc. in Business/Law, Compliance Certification',
            summaryTemplate: 'Compliance Officer who turns regulatory complexity into clear process. Experienced building programs, running audits, and training teams on the rules.',
            experienceHints: [
                'Built a compliance program that passed a regulatory exam with zero findings',
                'Drafted 30+ policies and trained 400+ employees on data privacy',
                'Investigated 50+ potential violations, resolving all within policy timelines'
            ]
        },
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
        },
        {
            id: 'academic-advisor',
            title: 'Academic Advisor',
            description: 'Guide students on course selection, degree planning, and academic success.',
            skills: ['Advising', 'Degree Planning', 'Student Success', 'Data Analysis', 'Communication', 'Enrollment', 'Workshops', 'CRM Systems', 'Policy Knowledge', 'Mentoring'],
            sampleEducation: 'M.Ed. in Higher Education / Counseling',
            summaryTemplate: 'Academic Advisor dedicated to student success. Experienced guiding 500+ students through degree planning, registration, and graduation milestones.',
            experienceHints: [
                'Advised 500+ students with a 90% on-time graduation rate',
                'Built a first-year advising program that cut probation rates 25%',
                'Delivered 40+ workshops on major exploration and career planning'
            ]
        },

        {
            id: 'curriculum-developer',
            title: 'Curriculum Developer',
            description: 'Design learning materials, courses, and assessments aligned to outcomes.',
            skills: ['Curriculum Design', 'Instructional Design', 'Alignment to Standards', 'Assessment Design', 'Content Development', 'Learning Theory', 'EdTech Tools', 'Project Management', 'Teacher Training', 'Evaluation'],
            sampleEducation: 'M.Ed. in Curriculum & Instruction',
            summaryTemplate: 'Curriculum Developer who designs rigorous, engaging learning experiences. Experienced building full course sequences, assessments, and teacher materials.',
            experienceHints: [
                'Designed a full K-12 science curriculum used by 50 schools',
                'Built 120+ standards-aligned lessons and assessments',
                'Led curriculum review that improved test scores 18% across pilot schools'
            ]
        },
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
        },
        {
            id: 'hr-generalist',
            title: 'HR Generalist',
            description: 'Handle the full range of HR: recruiting, relations, benefits, and compliance.',
            skills: ['Recruiting', 'Employee Relations', 'Onboarding', 'Benefits', 'HRIS', 'Performance Management', 'Compliance', 'Training', 'Conflict Resolution', 'Employment Law'],
            sampleEducation: 'B.A. in HR Management, SHRM-CP Certification',
            summaryTemplate: 'HR Generalist who covers the people function end to end. Experienced in recruiting, employee relations, and building the processes that scale culture.',
            experienceHints: [
                'Managed recruiting for 80+ hires per year across 6 departments',
                'Reduced involuntary turnover 30% with a new retention program',
                'Led HRIS rollout that automated onboarding, saving 300 hours annually'
            ]
        },

        {
            id: 'operations-manager',
            title: 'Operations Manager',
            description: 'Oversee day-to-day operations, processes, and teams to drive efficiency.',
            skills: ['Operations', 'Process Improvement', 'Team Leadership', 'Budgeting', 'KPI Management', 'Vendor Management', 'Logistics', 'Data Analysis', 'Project Management', 'Lean/Six Sigma'],
            sampleEducation: 'B.A./B.Sc. in Business / Operations Management',
            summaryTemplate: 'Operations Manager who builds the systems behind the business. Experienced improving processes, leading teams, and driving measurable efficiency gains.',
            experienceHints: [
                'Led operations for a 50-person company, cutting costs 22% in a year',
                'Automated reporting that saved the team 15 hours per week',
                'Scaled fulfillment from 1,000 to 10,000 orders/month with 99.5% accuracy'
            ]
        },

        {
            id: 'customer-success-manager',
            title: 'Customer Success Manager',
            description: 'Drive adoption, retention, and growth across the customer base.',
            skills: ['Customer Success', 'Onboarding', 'Renewals', 'Upselling', 'CRM (Salesforce/Gainsight)', 'Data Analysis', 'Training', 'Churn Prevention', 'Account Management', 'Communication'],
            sampleEducation: 'B.A. in Business / Communications',
            summaryTemplate: 'Customer Success Manager focused on outcomes, retention, and growth. Experienced running onboarding, QBRs, and the plays that keep customers winning.',
            experienceHints: [
                'Managed a $3M book of business with 95% net revenue retention',
                'Cut churn 30% by building a proactive health-score playbook',
                'Ran onboarding that lifted time-to-value from 60 to 21 days'
            ]
        },
    ],
    marketing: [
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
            id: 'marketing-manager',
            title: 'Marketing Manager',
            description: 'Own the marketing strategy and execution across channels, budgets, and teams.',
            skills: ['Brand Strategy', 'Campaign Management', 'SEO/SEM', 'Content Marketing', 'Email Marketing', 'Google Analytics', 'HubSpot', 'Paid Social', 'Budget Management', 'Team Leadership'],
            sampleEducation: 'B.A./B.Sc. in Marketing, MBA preferred',
            summaryTemplate: 'Results-driven Marketing Manager with a track record of growing pipeline and brand through data-backed campaigns. Experienced leading multi-channel teams and managing six-figure budgets.',
            experienceHints: [
                'Grew organic traffic 214% in 18 months through an SEO and content engine',
                'Managed a $1.2M paid media budget, cutting blended CAC by 27% YoY',
                'Built email nurture programs generating 38% of new business pipeline'
            ]
        },
        {
            id: 'seo-specialist',
            title: 'SEO Specialist',
            description: 'Improve organic visibility through technical SEO, content, and link building.',
            skills: ['SEO', 'Keyword Research', 'Technical SEO', 'Link Building', 'Google Analytics', 'Search Console', 'Ahrefs', 'Content Strategy', 'On-Page SEO', 'Core Web Vitals'],
            sampleEducation: 'B.A. in Marketing / Communications, SEO Certification',
            summaryTemplate: 'SEO Specialist focused on compounding organic growth through technical fixes, content strategy, and authority building. Comfortable with both analytics and hands-on page optimization.',
            experienceHints: [
                'Increased organic traffic 180% and keyword rankings 3x in 12 months',
                'Ran technical audits fixing 500+ crawl and indexation issues',
                'Built a link program earning 2,000+ quality backlinks from industry domains'
            ]
        },
        {
            id: 'content-marketer',
            title: 'Content Marketer',
            description: 'Create and distribute content that attracts, educates, and converts audiences.',
            skills: ['Copywriting', 'Content Strategy', 'Blogging', 'SEO', 'Email Marketing', 'Social Media', 'Editing', 'Storytelling', 'CMS', 'Analytics'],
            sampleEducation: 'B.A. in English, Journalism, or Marketing',
            summaryTemplate: 'Versatile Content Marketer who turns ideas into content that ranks, engages, and converts. Skilled across blog, email, social, and video with a strong eye for story and data.',
            experienceHints: [
                'Grew a company blog from 5K to 120K monthly readers in 18 months',
                'Wrote email sequences with 42% open and 9% click rates',
                'Created a content pillar strategy that tripled qualified demo requests'
            ]
        },
        {
            id: 'account-executive',
            title: 'Account Executive',
            description: 'Own the full sales cycle from discovery to close for mid-market and enterprise accounts.',
            skills: ['B2B Sales', 'Consultative Selling', 'Salesforce', 'HubSpot', 'Pipeline Management', 'Negotiation', 'Discovery Calls', 'MEDDIC', 'Contract Negotiation', 'Forecasting'],
            sampleEducation: 'B.Sc. in Business / Communications',
            summaryTemplate: 'Enterprise Account Executive with a history of over-achieving quota through disciplined pipeline management and consultative selling. Strong at navigating multi-stakeholder deals.',
            experienceHints: [
                'Closed $2.1M ARR in 2023 at 128% of quota',
                'Won 14 enterprise deals with 9-month average sales cycles',
                'Maintained 96% forecast accuracy across 4 consecutive quarters'
            ]
        },
        {
            id: 'brand-manager',
            title: 'Brand Manager',
            description: 'Protect and grow the brand through strategy, positioning, and integrated campaigns.',
            skills: ['Brand Strategy', 'Market Research', 'Positioning', 'Campaign Management', 'P&L Management', 'Consumer Insights', 'Advertising', 'Social Media', 'Packaging', 'Team Leadership'],
            sampleEducation: 'B.A. in Marketing / Business, MBA preferred',
            summaryTemplate: 'Brand Manager experienced in building differentiated brands that win in crowded categories. Combines consumer insight, creative leadership, and P&L discipline to drive share growth.',
            experienceHints: [
                'Rel launched a flagship brand line, growing category share from 11% to 17%',
                'Managed a $3M marketing budget with positive ROI across 12 campaigns',
                'Led a repositioning that lifted brand awareness 23 points in 9 months'
            ]
        },
        {
            id: 'digital-marketing-specialist',
            title: 'Digital Marketing Specialist',
            description: 'Execute digital campaigns across paid, social, email, and web.',
            skills: ['Google Ads', 'Meta Ads', 'SEO', 'Email Marketing', 'Google Analytics', 'Landing Pages', 'A/B Testing', 'Copywriting', 'Marketing Automation', 'Budget Management'],
            sampleEducation: 'B.A. in Marketing / Digital Media',
            summaryTemplate: 'Digital Marketing Specialist who plans, launches, and optimizes campaigns across channels. Data-driven with a track record of improving ROAS and CAC.',
            experienceHints: [
                'Managed $500K annual ad spend with 4.2x blended ROAS',
                'Cut CAC 35% through creative testing and audience segmentation',
                'Scaled an email program from 10K to 150K subscribers in 12 months'
            ]
        },

        {
            id: 'growth-marketer',
            title: 'Growth Marketer',
            description: 'Run experiments across funnel and channel to find compounding growth.',
            skills: ['Growth Strategy', 'A/B Testing', 'SEO', 'Paid Acquisition', 'Lifecycle Marketing', 'Analytics', 'Funnel Optimization', 'Viral Loops', 'Experimentation', 'SQL'],
            sampleEducation: 'B.A. in Marketing / Business, Analytics Certification',
            summaryTemplate: 'Growth Marketer obsessed with experiments and compounding channels. Proven at finding the 20% of plays that drive 80% of growth.',
            experienceHints: [
                'Ran 200+ experiments, lifting activation 28% and retention 15%',
                'Built an SEO engine that grew organic traffic 5x in 18 months',
                'Designed a referral loop adding 8% of total signups within a quarter'
            ]
        },
    ],
    engineering: [
        {
            id: 'civil-engineer',
            title: 'Civil Engineer',
            description: 'Design and oversee infrastructure projects like roads, bridges, and water systems.',
            skills: ['Structural Analysis', 'AutoCAD', 'Civil 3D', 'STAAD Pro', 'Project Management', 'Site Planning', 'Cost Estimation', 'Surveying', 'Construction Documents', 'Building Codes'],
            sampleEducation: 'B.Sc. in Civil Engineering, EIT/PE License',
            summaryTemplate: 'Civil Engineer with a strong record of delivering infrastructure projects on time and budget. Experienced in structural design, site planning, and construction document production.',
            experienceHints: [
                'Designed a 12-span highway bridge approved with zero value-engineering changes',
                'Managed $8M in municipal water infrastructure projects from concept to close-out',
                'Produced construction documents for 20+ residential and commercial developments'
            ]
        },
        {
            id: 'mechanical-engineer',
            title: 'Mechanical Engineer',
            description: 'Design mechanical systems, components, and products from concept to production.',
            skills: ['CAD/CAM', 'SolidWorks', 'AutoCAD', 'FEA', 'Thermodynamics', 'GD&T', 'Product Design', 'MATLAB', 'Prototyping', 'Manufacturing Processes'],
            sampleEducation: 'B.Sc. in Mechanical Engineering, EIT/PE License',
            summaryTemplate: 'Mechanical Engineer with end-to-end product development experience. Skilled in 3D modeling, finite element analysis, and taking designs from prototype to high-volume manufacturing.',
            experienceHints: [
                'Designed a thermal management system cutting energy use 22% across a product line',
                'Led DFM reviews that reduced unit cost 18% while improving reliability',
                'Took 6 products from concept to production with 99.7% first-pass yield'
            ]
        },
        {
            id: 'electrical-engineer',
            title: 'Electrical Engineer',
            description: 'Design electrical systems, circuits, and controls for buildings, products, and power.',
            skills: ['Circuit Design', 'AutoCAD Electrical', 'PLC', 'MATLAB/Simulink', 'Power Systems', 'Control Systems', 'PCB Design', 'Electrical Codes', 'Troubleshooting', 'Renewable Energy'],
            sampleEducation: 'B.Sc. in Electrical Engineering, EIT/PE License',
            summaryTemplate: 'Electrical Engineer experienced in power systems, controls, and circuit design. Strong at delivering safe, code-compliant electrical designs and solving complex field problems.',
            experienceHints: [
                'Designed power distribution for a 250,000 sq ft industrial facility',
                'Programmed PLC controls that improved line efficiency 15%',
                'Led a solar microgrid project generating 40% of facility energy demand'
            ]
        },
        {
            id: 'chemical-engineer',
            title: 'Chemical Engineer',
            description: 'Design and optimize processes that transform raw materials into valuable products.',
            skills: ['Process Engineering', 'Aspen HYSYS', 'Chemical Kinetics', 'Thermodynamics', 'Plant Operations', 'Safety Compliance', 'Process Simulation', 'Quality Control', 'Fluid Dynamics', 'Data Analysis'],
            sampleEducation: 'B.Sc. in Chemical Engineering, EIT/PE License',
            summaryTemplate: 'Chemical Engineer focused on process design, optimization, and safe plant operations. Experienced with process simulation tools and delivering measurable yield and cost improvements.',
            experienceHints: [
                'Optimized a distillation train that boosted yield 9% and saved $1.2M annually',
                'Led process safety reviews (HAZOP) for 3 production units with zero incidents',
                'Designed a heat-recovery loop cutting plant energy intensity 14%'
            ]
        },
        {
            id: 'structural-engineer',
            title: 'Structural Engineer',
            description: 'Design load-bearing structures and ensure they are safe, stable, and buildable.',
            skills: ['Structural Analysis', 'ETABS', 'SAP2000', 'STAAD Pro', 'Seismic Design', 'Concrete & Steel Design', 'Load Calculations', 'Building Codes', 'Revit', 'Site Inspection'],
            sampleEducation: 'B.Sc. in Structural/Civil Engineering, PE License',
            summaryTemplate: 'Structural Engineer specializing in concrete, steel, and seismic design. Delivers safe and efficient structural solutions for buildings, bridges, and specialty structures.',
            experienceHints: [
                'Designed the lateral system for a 30-story mixed-use tower',
                'Led seismic retrofits on 8 existing buildings in a high-risk zone',
                'Produced 500+ structural drawings with 100% QA pass rate'
            ]
        },
        {
            id: 'manufacturing-engineer',
            title: 'Manufacturing Engineer',
            description: 'Design and improve production processes for efficiency, quality, and cost.',
            skills: ['Lean Manufacturing', 'Six Sigma', 'Process Design', 'CAD/CAM', 'CNC Programming', 'Automation', 'Production Planning', 'Quality Systems (ISO)', 'Root Cause Analysis', 'Kaizen'],
            sampleEducation: 'B.Sc. in Industrial/Mechanical Engineering, Six Sigma Certification',
            summaryTemplate: 'Manufacturing Engineer with a track record of eliminating waste and improving throughput. Experienced in lean tools, automation, and quality systems across high-volume plants.',
            experienceHints: [
                'Increased line throughput 23% through a Kaizen program across 4 lines',
                'Led Six Sigma project saving $1.1M annually in scrap and rework',
                'Implemented automation that reduced direct labor 30% on a flagship line'
            ]
        },
        {
            id: 'aerospace-engineer',
            title: 'Aerospace Engineer',
            description: 'Design and test aircraft, spacecraft, and propulsion systems.',
            skills: ['Aerodynamics', 'Structural Analysis', 'CAD (CATIA)', 'MATLAB', 'Propulsion', 'Finite Element Analysis', 'Systems Engineering', 'Flight Testing', 'Thermal Analysis', 'Composites'],
            sampleEducation: 'B.Sc. in Aerospace Engineering, EIT/PE License',
            summaryTemplate: 'Aerospace Engineer with experience in design, analysis, and test across aircraft and space systems. Detail-focused with strong systems-thinking skills.',
            experienceHints: [
                'Designed structural components for a commercial aircraft program',
                'Ran FEA analysis cutting component weight 15% while meeting load specs',
                'Supported flight test campaigns with 100% on-schedule data delivery'
            ]
        },

        {
            id: 'industrial-engineer',
            title: 'Industrial Engineer',
            description: 'Optimize processes, layouts, and systems to maximize efficiency.',
            skills: ['Process Optimization', 'Lean Six Sigma', 'Time & Motion', 'Facility Layout', 'Simulation (Arena)', 'Data Analysis', 'Ergonomics', 'Capacity Planning', 'Cost Reduction', 'Project Management'],
            sampleEducation: 'B.Sc. in Industrial Engineering, Six Sigma Certification',
            summaryTemplate: 'Industrial Engineer who finds the waste and eliminates it. Experienced improving throughput, layout, and cost across manufacturing and service operations.',
            experienceHints: [
                'Improved line efficiency 27% through layout and flow redesign',
                'Led a Six Sigma project saving $900K in annual labor cost',
                'Built capacity models that guided a $15M facility expansion'
            ]
        },

        {
            id: 'environmental-engineer',
            title: 'Environmental Engineer',
            description: 'Design solutions for environmental challenges: water, air, and waste.',
            skills: ['Water Treatment', 'Environmental Compliance', 'Remediation', 'Hydrology', 'Air Quality', 'CAD', 'EIA', 'Waste Management', 'Regulations (EPA)', 'Data Analysis'],
            sampleEducation: 'B.Sc. in Environmental Engineering, EIT/PE License',
            summaryTemplate: 'Environmental Engineer dedicated to sustainable solutions that meet compliance and community needs. Experienced in remediation, treatment, and permitting.',
            experienceHints: [
                'Designed a water treatment upgrade serving 50,000 residents',
                'Led site remediation that closed 5 brownfield sites for reuse',
                'Prepared EIAs for 10+ projects with successful agency approval'
            ]
        },
    ],
    data: [
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
            id: 'ml-engineer',
            title: 'ML Engineer',
            description: 'Design, train, and deploy machine learning models into production systems.',
            skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'ML Pipelines', 'MLOps', 'Docker', 'Kubernetes', 'Feature Engineering', 'Model Deployment', 'AWS', 'SQL'],
            sampleEducation: 'B.Sc./M.Sc. in Computer Science, ML Specialization',
            summaryTemplate: 'Hands-on ML Engineer with experience taking models from research to production. Skilled in building scalable training pipelines, serving infrastructure, and monitoring model performance.',
            experienceHints: [
                'Deployed 15+ ML models to production serving 1M+ predictions per day',
                'Built an MLOps pipeline with CI/CD that cut model release time from 3 weeks to 2 days',
                'Reduced model inference cost by 45% through quantization and optimized serving'
            ]
        },
        {
            id: 'data-analyst',
            title: 'Data Analyst',
            description: 'Turn raw data into clear insights, dashboards, and business recommendations.',
            skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Data Cleaning', 'Statistical Analysis', 'A/B Testing', 'Data Visualization', 'Google Analytics'],
            sampleEducation: 'B.Sc. in Statistics, Data Analytics, or Business',
            summaryTemplate: 'Detail-oriented Data Analyst skilled at translating complex datasets into actionable insights. Strong command of SQL, visualization tools, and A/B testing to drive data-informed decisions.',
            experienceHints: [
                'Built dashboards used by 10+ teams to monitor 40+ KPIs daily',
                'Ran A/B tests that lifted conversion by 12% across the signup funnel',
                'Automated weekly reporting with SQL + Python, saving 15 hours per week'
            ]
        },
        {
            id: 'data-engineer',
            title: 'Data Engineer',
            description: 'Build and maintain the pipelines and warehouses that make data usable at scale.',
            skills: ['SQL', 'Python', 'ETL', 'Spark', 'Airflow', 'dbt', 'Data Warehousing', 'Snowflake', 'BigQuery', 'Kafka', 'AWS', 'Data Modeling'],
            sampleEducation: 'B.Sc. in Computer Science / Data Engineering',
            summaryTemplate: 'Data Engineer who builds reliable, scalable data infrastructure. Experienced with modern warehouse stacks, orchestration, and streaming to power analytics and ML at scale.',
            experienceHints: [
                'Built a data lakehouse serving 20+ analytics teams with 99.9% SLA',
                'Migrated 100+ legacy ETL jobs to dbt + Airflow, cutting runtimes 60%',
                'Designed real-time pipelines ingesting 5B events per day via Kafka'
            ]
        },
        {
            id: 'bi-analyst',
            title: 'Business Intelligence Analyst',
            description: 'Design dashboards and reports that turn business data into decisions.',
            skills: ['Power BI', 'Tableau', 'SQL', 'Data Modeling', 'DAX', 'Dashboard Design', 'KPI Analysis', 'Excel', 'Reporting Automation', 'Stakeholder Communication'],
            sampleEducation: 'B.Sc. in Business / Information Systems, BI Certification',
            summaryTemplate: 'Business Intelligence Analyst focused on building self-serve reporting that executives actually use. Strong in data modeling, dashboard design, and turning questions into metrics.',
            experienceHints: [
                'Built a company-wide KPI dashboard used by 300+ employees weekly',
                'Reduced ad-hoc report requests 70% through a self-serve semantic layer',
                'Uncovered a $400K annual leak by analyzing procurement data'
            ]
        },
        {
            id: 'data-architect',
            title: 'Data Architect',
            description: 'Design the data systems, models, and governance that power analytics and ML.',
            skills: ['Data Modeling', 'Data Warehousing', 'Snowflake', 'BigQuery', 'dbt', 'ETL/ELT', 'Data Governance', 'Data Lakes', 'Streaming (Kafka)', 'Cloud (AWS/GCP)', 'SQL', 'Architecture'],
            sampleEducation: 'B.Sc. in Computer Science / Information Systems',
            summaryTemplate: 'Data Architect who designs scalable, governed data platforms. Experienced turning messy data landscapes into reliable foundations for analytics and ML.',
            experienceHints: [
                'Designed a lakehouse architecture serving 40+ teams with 99.9% SLAs',
                'Cut data pipeline cost 45% through architecture modernization',
                'Built a data governance model achieving 95% metadata coverage'
            ]
        },

        {
            id: 'mlops-engineer',
            title: 'MLOps Engineer',
            description: 'Operationalize ML models: pipelines, deployment, monitoring, and governance.',
            skills: ['MLOps', 'Kubernetes', 'Docker', 'Airflow', 'MLflow', 'CI/CD', 'Model Monitoring', 'Feature Stores', 'Python', 'Cloud (AWS/GCP)', 'Terraform', 'Experiment Tracking'],
            sampleEducation: 'B.Sc./M.Sc. in CS / ML, MLOps Certification',
            summaryTemplate: 'MLOps Engineer who makes ML reliable in production. Experienced building training pipelines, serving infrastructure, and monitoring drift at scale.',
            experienceHints: [
                'Operationalized 30+ models with automated retraining and monitoring',
                'Cut model deployment time from 3 weeks to 1 day with CI/CD',
                'Built drift monitoring that caught 3 data issues before they hit users'
            ]
        },

        {
            id: 'statistician',
            title: 'Statistician',
            description: 'Design studies and analyze data to extract rigorous, defensible insights.',
            skills: ['Statistical Modeling', 'R', 'Python', 'Experimental Design', 'Hypothesis Testing', 'Regression', 'Bayesian Methods', 'Sampling', 'Data Visualization', 'Causal Inference'],
            sampleEducation: 'M.Sc./Ph.D. in Statistics',
            summaryTemplate: 'Statistician who brings rigor to decision-making. Experienced in experimental design, modeling, and communicating uncertainty clearly.',
            experienceHints: [
                'Designed and analyzed 50+ experiments with rigorous power analysis',
                'Built predictive models that reduced forecast error 30%',
                'Published 8 peer-reviewed papers in applied statistics'
            ]
        },
    ],
    hospitality: [
        {
            id: 'hotel-manager',
            title: 'Hotel Manager',
            description: 'Oversee hotel operations, guest experience, staff, and revenue performance.',
            skills: ['Front Office Management', 'Housekeeping Oversight', 'Guest Relations', 'Revenue Management', 'Staff Scheduling', 'Budgeting', 'Reservations Systems', 'Upselling', 'Customer Service', 'Compliance'],
            sampleEducation: 'B.Sc. in Hospitality Management, Hotel Certification',
            summaryTemplate: 'Hotel Manager with a passion for exceptional guest experiences and operational excellence. Experienced in leading teams, driving revenue, and maintaining high service standards.',
            experienceHints: [
                'Increased RevPAR 14% through rate strategy and upselling programs',
                'Maintained 4.8-star average guest rating across 2,000+ reviews',
                'Led a 45-person team across front office, housekeeping, and F&B'
            ]
        },
        {
            id: 'restaurant-manager',
            title: 'Restaurant Manager',
            description: 'Run daily restaurant operations, control costs, and lead front-of-house teams.',
            skills: ['Restaurant Operations', 'Staff Management', 'Inventory Control', 'Food Safety (ServSafe)', 'POS Systems', 'Scheduling', 'Cost Control', 'Customer Service', 'Vendor Management', 'Training'],
            sampleEducation: 'Associates/B.Sc. in Hospitality, ServSafe Certified',
            summaryTemplate: 'Restaurant Manager known for clean operations, happy teams, and strong margins. Hands-on leader experienced in high-volume dining and cost discipline.',
            experienceHints: [
                'Cut food cost from 34% to 28% through inventory and vendor renegotiation',
                'Grew average daily covers 22% with service and upselling training',
                'Led a 30-person team to 100% health-inspection compliance for 3 years'
            ]
        },
        {
            id: 'retail-store-manager',
            title: 'Retail Store Manager',
            description: 'Drive store sales, manage inventory, and lead the sales team day to day.',
            skills: ['Store Operations', 'Visual Merchandising', 'Inventory Management', 'Sales Leadership', 'Staff Training', 'POS Systems', 'Loss Prevention', 'Customer Experience', 'Scheduling', 'KPIs'],
            sampleEducation: 'High School Diploma + Retail Management Experience, Associate Degree preferred',
            summaryTemplate: 'Retail Store Manager focused on sales growth, strong teams, and great customer experience. Experienced with P&L ownership, merchandising, and loss prevention.',
            experienceHints: [
                'Grew store revenue 18% YoY while beating shrink targets every quarter',
                'Reduced turnover 40% through better hiring and development programs',
                'Delivered 92% customer satisfaction across 2,500+ surveys'
            ]
        },
        {
            id: 'event-coordinator',
            title: 'Event Coordinator',
            description: 'Plan and execute events end to end, from concept and vendors to day-of delivery.',
            skills: ['Event Planning', 'Vendor Management', 'Budget Management', 'Venue Coordination', 'Marketing', 'Timelines', 'Client Relations', 'Catering', 'Logistics', 'On-site Management'],
            sampleEducation: 'B.A. in Event Management / Hospitality',
            summaryTemplate: 'Event Coordinator who delivers flawless events on time and on budget. Calm under pressure with strong vendor networks and meticulous attention to detail.',
            experienceHints: [
                'Coordinated 60+ events per year, from 50-person dinners to 2,000-person galas',
                'Managed event budgets up to $500K with 98% on-budget delivery',
                'Negotiated vendor contracts that saved clients 20% on average'
            ]
        },
        {
            id: 'front-of-house-supervisor',
            title: 'Front-of-House Supervisor',
            description: 'Lead the guest-facing team and keep service flowing smoothly during shifts.',
            skills: ['Team Leadership', 'Guest Services', 'Table Service', 'POS Systems', 'Reservations', 'Conflict Resolution', 'Scheduling', 'Training', 'Upselling', 'Opening/Closing'],
            sampleEducation: 'Hospitality Diploma, Fine Dining Service Training',
            summaryTemplate: 'Front-of-House Supervisor with a talent for building warm, efficient teams and turning guests into regulars. Experienced in fine dining and high-volume service.',
            experienceHints: [
                'Trained 20+ servers, raising average check size 12% through upselling',
                'Resolved guest issues with a 95% recovery-to-return rate',
                'Ran floor service for 400+ covers on peak nights with zero service breakdowns'
            ]
        },
        {
            id: 'barista',
            title: 'Barista',
            description: 'Craft drinks, serve customers, and keep the café running during shifts.',
            skills: ['Espresso Preparation', 'Latte Art', 'Customer Service', 'POS Systems', 'Cash Handling', 'Food Safety', 'Inventory', 'Teamwork', 'Speed of Service', 'Opening/Closing'],
            sampleEducation: 'High School Diploma, Barista Training',
            summaryTemplate: 'Barista who balances speed and quality even on the busiest shifts. Known for friendly service, consistent drinks, and a spotless station.',
            experienceHints: [
                'Served 300+ customers per shift with 4.9-star average reviews',
                'Consistently hit 90-second ticket times during peak rush',
                'Trained 6 new baristas on espresso standards and latte art'
            ]
        },

        {
            id: 'guest-services-associate',
            title: 'Guest Services Associate',
            description: 'Create great first and last impressions for hotel and venue guests.',
            skills: ['Front Desk', 'Reservations', 'Check-in/Out', 'Concierge', 'Guest Relations', 'Upselling', 'POS/PMS Systems', 'Problem Solving', 'Local Knowledge', 'Communication'],
            sampleEducation: 'Hospitality Diploma / Hotel Training',
            summaryTemplate: 'Guest Services Associate who turns check-ins into great memories. Skilled at reservations, upselling, and solving guest issues with a smile.',
            experienceHints: [
                'Checked in 100+ guests per shift with zero queue over 10 minutes',
                'Upsold upgrades generating $60K in incremental revenue a year',
                'Maintained a 95% guest satisfaction score across 1,000+ reviews'
            ]
        },
    ],
    administration: [
        {
            id: 'executive-assistant',
            title: 'Executive Assistant',
            description: 'Provide high-level administrative support to executives and leadership teams.',
            skills: ['Calendar Management', 'Travel Arrangements', 'Meeting Coordination', 'Confidentiality', 'MS Office', 'Expense Reports', 'Communication', 'Project Support', 'Time Management', 'Gatekeeping'],
            sampleEducation: 'B.A. in Business / Communications, EA Certification',
            summaryTemplate: 'Executive Assistant trusted by C-level leaders to run calendars, travel, and communications. Discrete, proactive, and highly organized under pressure.',
            experienceHints: [
                'Managed complex calendars for 3 C-level executives across 5 time zones',
                'Coordinated board meetings and investor roadshows for a $100M company',
                'Reduced executive scheduling conflicts 40% with proactive triage'
            ]
        },
        {
            id: 'office-manager',
            title: 'Office Manager',
            description: 'Keep the office running: facilities, vendors, budgets, and day-to-day operations.',
            skills: ['Office Operations', 'Facilities Management', 'Vendor Relations', 'Budget Administration', 'HR Support', 'Onboarding', 'MS Office', 'Inventory', 'Policy Compliance', 'Team Coordination'],
            sampleEducation: 'B.A. in Business Administration / Office Management',
            summaryTemplate: 'Office Manager who keeps teams productive by owning facilities, vendors, and operations. Known for cutting costs while improving the workplace experience.',
            experienceHints: [
                'Managed a 5,000 sq ft office and $150K annual operating budget',
                'Cut facilities costs 25% by renegotiating vendor contracts',
                'Coordinated onboarding for 60+ new hires per year'
            ]
        },
        {
            id: 'administrative-assistant',
            title: 'Administrative Assistant',
            description: 'Support daily office operations with scheduling, documents, and correspondence.',
            skills: ['MS Office', 'Data Entry', 'Scheduling', 'Correspondence', 'Filing', 'Record Keeping', 'Customer Service', 'Phone Etiquette', 'Travel Booking', 'Document Preparation'],
            sampleEducation: 'High School Diploma + Admin Training, Associate Degree preferred',
            summaryTemplate: 'Reliable Administrative Assistant with a reputation for accuracy and a can-do attitude. Keeps schedules, files, and communications running without a hitch.',
            experienceHints: [
                'Supported a 15-person department with 100% on-time document turnaround',
                'Processed 300+ expense reports per quarter with zero errors',
                'Built a digital filing system cutting retrieval time from 20 minutes to 2'
            ]
        },
        {
            id: 'operations-coordinator',
            title: 'Operations Coordinator',
            description: 'Coordinate logistics, vendors, and processes that keep operations running.',
            skills: ['Operations Support', 'Scheduling', 'Data Analysis', 'Inventory', 'Process Improvement', 'Vendor Coordination', 'Reporting', 'MS Office', 'Logistics', 'Compliance'],
            sampleEducation: 'B.A./B.Sc. in Business Administration / Operations',
            summaryTemplate: 'Operations Coordinator who keeps complex workflows on track. Strong at data, logistics, and cross-team coordination to drive efficiency.',
            experienceHints: [
                'Coordinated logistics for 2,000+ orders per month with 99.5% on-time rate',
                'Automated tracking reports, saving the team 10 hours weekly',
                'Supported a process overhaul that cut turnaround times 30%'
            ]
        },
        {
            id: 'receptionist',
            title: 'Receptionist / Front Desk',
            description: 'Be the first impression: greet visitors, manage calls, and route requests.',
            skills: ['Front Desk', 'Phone Etiquette', 'Scheduling', 'MS Office', 'Customer Service', 'Multi-line Phone Systems', 'Data Entry', 'Hospitality', 'Greeting', 'Record Keeping'],
            sampleEducation: 'High School Diploma, Customer Service Training',
            summaryTemplate: 'Friendly and professional Receptionist who makes every visitor feel welcome. Skilled at multi-line phones, scheduling, and keeping the front desk running smoothly.',
            experienceHints: [
                'Managed a multi-line phone system fielding 150+ calls daily',
                'Greeted and directed 200+ visitors per week with a welcoming first impression',
                'Handled conference room and visitor scheduling with zero double-bookings'
            ]
        },
        {
            id: 'office-administrator',
            title: 'Office Administrator',
            description: 'Keep office operations, facilities, and admin systems running smoothly.',
            skills: ['Office Operations', 'Scheduling', 'Vendor Relations', 'MS Office', 'Record Keeping', 'Supply Management', 'Facilities', 'Onboarding Support', 'Budget Support', 'Communication'],
            sampleEducation: 'Associate/B.A. in Business Administration',
            summaryTemplate: 'Office Administrator who owns the details that keep a workplace productive. Efficient, organized, and a master of the processes nobody notices until they break.',
            experienceHints: [
                'Managed office operations for a 100-person company',
                'Cut office supply costs 20% through vendor consolidation',
                'Coordinated onboarding and events for 50+ employees per year'
            ]
        },
    ],
    leadership: [
        {
            id: 'ceo',
            title: 'Chief Executive Officer (CEO)',
            description: 'Set the vision, strategy, and culture while owning overall company performance.',
            skills: ['Strategic Vision', 'P&L Management', 'Board Relations', 'Fundraising', 'Mergers & Acquisitions', 'Organizational Leadership', 'Corporate Governance', 'Business Development', 'Talent Strategy', 'Risk Management'],
            sampleEducation: 'MBA, B.Sc. in Business / Engineering, 10+ years leadership',
            summaryTemplate: 'Chief Executive Officer with a record of scaling companies through growth stages. Combines strategic vision, operational discipline, and people leadership to build lasting value.',
            experienceHints: [
                'Scaled a company from $4M to $45M revenue over 5 years',
                'Led a Series B raise of $30M and two successful acquisitions',
                'Built an executive team and culture that achieved 90%+ employee retention'
            ]
        },
        {
            id: 'cto',
            title: 'Chief Technology Officer (CTO)',
            description: 'Own technology strategy, architecture, and engineering leadership.',
            skills: ['Technology Strategy', 'Product Architecture', 'Engineering Leadership', 'Cloud Infrastructure', 'R&D', 'Security', 'Vendor Management', 'Budgeting', 'Team Building', 'Technical Due Diligence'],
            sampleEducation: 'B.Sc./M.Sc. in Computer Science, 10+ years engineering leadership',
            summaryTemplate: 'Chief Technology Officer who aligns technology with business outcomes. Experienced scaling platforms, building high-performing teams, and modernizing legacy systems.',
            experienceHints: [
                'Scaled a platform from 100K to 8M users with 99.99% uptime',
                'Grew an engineering org from 8 to 80 engineers across 4 offices',
                'Led a cloud migration that cut infrastructure costs 35%'
            ]
        },
        {
            id: 'department-director',
            title: 'Department Director',
            description: 'Lead a department with P&L ownership, strategy, and people development.',
            skills: ['Strategic Planning', 'Team Leadership', 'Budget Management', 'Cross-Functional Collaboration', 'KPI Management', 'Process Improvement', 'Stakeholder Relations', 'Talent Development', 'Compliance', 'Reporting'],
            sampleEducation: 'B.A./MBA, 8+ years management experience',
            summaryTemplate: 'Department Director with a track record of hitting targets while developing people. Experienced leading multi-team functions through change and growth.',
            experienceHints: [
                'Led a 40-person department delivering 115% of annual targets',
                'Restructured workflows that saved $800K and cut delivery times 25%',
                'Developed 12 team members into management roles'
            ]
        },
        {
            id: 'coo',
            title: 'Chief Operating Officer (COO)',
            description: 'Own day-to-day operations, execution, and scaling the business engine.',
            skills: ['Operations Leadership', 'Strategy Execution', 'P&L Management', 'Process Improvement', 'Team Leadership', 'Budgeting', 'Vendor Management', 'KPIs', 'Scaling Operations', 'Crisis Management'],
            sampleEducation: 'MBA, B.Sc. in Business, 10+ years leadership',
            summaryTemplate: 'Chief Operating Officer with a record of scaling operations through growth phases. Turns strategy into executable systems with clear metrics.',
            experienceHints: [
                'Scaled operations from 20 to 400 employees across 3 countries',
                'Cut operating costs 25% while maintaining service levels',
                'Led a turnaround that moved the company from loss to 15% EBITDA margin'
            ]
        },

        {
            id: 'vice-president',
            title: 'Vice President',
            description: 'Lead a major function with strategy, budget, and team ownership.',
            skills: ['Leadership', 'Strategy', 'P&L Ownership', 'Team Development', 'Cross-Functional Influence', 'Budgeting', 'Change Management', 'Stakeholder Relations', 'Talent Strategy', 'KPIs'],
            sampleEducation: 'MBA, B.A./B.Sc. + 10+ years experience',
            summaryTemplate: 'Vice President with a track record of building teams and delivering results across a major function. Balances big-picture strategy with hands-on execution.',
            experienceHints: [
                'Led a function of 60+ people delivering 120% of plan for 3 years',
                'Built and scaled a new business unit to $25M revenue',
                'Drove a transformation that improved efficiency 30%'
            ]
        },

        {
            id: 'head-of-department',
            title: 'Head of Department',
            description: 'Own departmental strategy, operations, and people outcomes.',
            skills: ['Department Strategy', 'Team Leadership', 'Budgeting', 'Process Improvement', 'Reporting', 'Talent Development', 'Cross-Team Collaboration', 'Compliance', 'KPI Management', 'Communication'],
            sampleEducation: 'B.A./MBA, 8+ years management experience',
            summaryTemplate: 'Head of Department focused on outcomes, people, and process. Experienced leading multi-team functions and delivering against ambitious targets.',
            experienceHints: [
                'Led a 35-person department to 115% of annual targets',
                'Redesigned workflows saving $500K and cutting turnaround 30%',
                'Built a bench of 8 future leaders through structured development'
            ]
        },

        {
            id: 'senior-consultant',
            title: 'Senior Consultant',
            description: 'Lead client engagements and deliver expert, high-impact recommendations.',
            skills: ['Client Advisory', 'Strategy', 'Data Analysis', 'Process Design', 'Stakeholder Management', 'Presentations', 'Project Management', 'Financial Modeling', 'Change Management', 'Team Leadership'],
            sampleEducation: 'MBA / B.Sc. in Business, 5+ years consulting',
            summaryTemplate: 'Senior Consultant who leads engagements from hypothesis to implementation. Strong at analysis, storytelling, and getting stakeholders to act.',
            experienceHints: [
                'Delivered 15+ strategy engagements for Fortune 500 clients',
                'Led an engagement that identified $40M in annual savings',
                'Managed 4-consultant teams with consistent on-time, on-budget delivery'
            ]
        },

        {
            id: 'managing-director',
            title: 'Managing Director',
            description: 'Own a business unit, practice, or region with full P&L responsibility.',
            skills: ['P&L Ownership', 'Business Strategy', 'Client Relationships', 'Business Development', 'Team Leadership', 'Budgeting', 'M&A', 'Governance', 'Risk Management', 'Board Reporting'],
            sampleEducation: 'MBA, 15+ years leadership experience',
            summaryTemplate: 'Managing Director with P&L ownership and a record of growing businesses. Combines commercial instinct, operational control, and leadership.',
            experienceHints: [
                'Grew a business unit from $20M to $55M revenue in 4 years',
                'Led 3 acquisitions and integrated them into the core business',
                'Delivered 18%+ EBITDA growth for 5 consecutive years'
            ]
        },

        {
            id: 'startup-founder',
            title: 'Startup Founder',
            description: 'Build a company from zero: vision, product, team, and fundraising.',
            skills: ['Product Vision', 'Fundraising', 'Business Development', 'Team Building', 'Customer Discovery', 'P&L', 'Marketing', 'Operations', 'Pitch Deck', 'Networking'],
            sampleEducation: 'B.A./B.Sc. + founder experience',
            summaryTemplate: 'Startup Founder with experience taking a product from idea to users and revenue. Wears every hat, moves fast, and learns from customers.',
            experienceHints: [
                'Founded a SaaS product that grew to 10,000 users and $1M ARR',
                'Raised a $2M seed round and built a team of 8',
                'Ran lean experiments to validate product-market fit in 90 days'
            ]
        },

        {
            id: 'operations-lead',
            title: 'Operations Lead',
            description: 'Drive operational execution, process, and team performance day to day.',
            skills: ['Operations', 'Team Leadership', 'Process Improvement', 'KPI Tracking', 'Resource Planning', 'Reporting', 'Vendor Coordination', 'Budget Support', 'Problem Solving', 'Communication'],
            sampleEducation: 'B.A./B.Sc. in Business / Operations',
            summaryTemplate: 'Operations Lead who keeps the machine running and improving. Experienced managing teams, processes, and the metrics that prove progress.',
            experienceHints: [
                'Led daily operations for a 25-person team, hitting all KPIs for 8 quarters',
                'Implemented a process that cut cycle time 35%',
                'Built reporting that reduced decision lag from weeks to days'
            ]
        },

        {
            id: 'tech-generalist',
            title: 'Tech Generalist',
            description: 'Bring broad technical skill across product, engineering, and data.',
            skills: ['JavaScript/TypeScript', 'Python', 'React', 'Node.js', 'SQL', 'Cloud (AWS)', 'APIs', 'Data Analysis', 'Automation', 'Product Thinking'],
            sampleEducation: 'B.Sc. in Computer Science or equivalent experience',
            summaryTemplate: 'Tech Generalist who can contribute anywhere in the stack. Combines broad technical capability with product sense and a bias to ship.',
            experienceHints: [
                'Shipped 30+ features across frontend, backend, and data in 18 months',
                'Built automation that saved the team 500 hours a year',
                'Connected product, engineering, and data to drive a 20% activation lift'
            ]
        },
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
