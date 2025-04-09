// Certification data with enhanced details and image information
const certificationsData = [
    {
      id: 1,
      title: "Building Generative AI Applications Using Amazon Bedrock",
      issuingOrg: "AWS Training and Certification",
      type: "Certificate of Completion",
      completionDate: "2024-06-09",
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided", // Typically verified via AWS Skill Builder profile
      downloadLink: "",
      certificateImage: "images/certificates/c(36).png", // Placeholder image name
      learnings: "Gained knowledge on leveraging Amazon Bedrock to build and scale generative AI applications. Learned about foundation models (FMs), prompt engineering techniques, integrating Bedrock APIs, and applying generative AI to various use cases like text generation, summarization, and chatbots within the AWS ecosystem.",
      additionalDetails: "Completed via AWS Skill Builder platform.",
      category: "Cloud Computing",
      tags: ["AWS", "AI", "Generative AI", "Bedrock", "Cloud", "Machine Learning"]
    },
    {
      id: 2,
      title: "Cybersecurity Analyst Job Simulation",
      issuingOrg: "Forage / TATA",
      type: "Certificate of Completion (Job Simulation)",
      completionDate: "2024-04-24",
      certificateId: "Enrolment: sGHpLKwrsNAkSxpLR | User: wgXe5itZmXT5vaQAG",
      verificationLink: "Issued by Forage (Verification likely platform-specific via codes)",
      downloadLink: "",
      certificateImage: "images/certificates/c (20).png", // Placeholder image name
      learnings: "Completed practical tasks simulating the role of a Cybersecurity Analyst. Gained hands-on experience in IAM fundamentals, conducting IAM strategy assessments, crafting custom IAM solutions, and understanding platform integration challenges in a corporate environment.",
      additionalDetails: "Virtual work experience program.",
      category: "Cybersecurity",
      tags: ["Cybersecurity", "Security", "IAM", "Risk Assessment", "Forage", "TATA", "Simulation"]
    },
    {
      id: 3,
      title: "Data Visualisation: Empowering Business with Effective Insights",
      issuingOrg: "Forage / TATA",
      type: "Certificate of Completion (Job Simulation)",
      completionDate: "2024-04-24",
      certificateId: "Enrolment: Snt2jSfWmYbXprxAu | User: wgXe5itZmXT5vaQAG",
      verificationLink: "Issued by Forage (Verification likely platform-specific via codes)",
      downloadLink: "",
      certificateImage: "images/certificates/c (21)", // Placeholder image name
      learnings: "Completed practical tasks focused on data visualization for business intelligence. Practiced framing business scenarios, selecting appropriate visualization types, creating clear and impactful visuals using data, and effectively communicating insights and analysis.",
      additionalDetails: "Virtual work experience program focused on BI.",
      category: "Data Analysis",
      tags: ["Data Visualization", "Business Intelligence", "BI", "Analytics", "Forage", "TATA", "Simulation"]
    },
    {
      id: 4,
      title: "Introduction to Critical Infrastructure Protection",
      issuingOrg: "OPSWAT Academy",
      type: "Certificate of Completion / Graduate",
      completionDate: "2025-03-06", // Note: Future date, assuming this is correct from input
      certificateId: "gDFCW-cl5A",
      verificationLink: "https://learn.opswatacademy.com/certificate/gDFCW-cl5A",
      downloadLink: "",
      certificateImage: "images/certificates/c (30).png", // Placeholder image name
      learnings: "Acquired foundational knowledge on protecting critical infrastructure sectors from cyber and physical threats. Understood risk management, security controls specific to OT/ICS, incident response, and the importance of CIP standards.",
      additionalDetails: "Expiration Date: March 6, 2026",
      category: "Cybersecurity",
      tags: ["Cybersecurity", "Critical Infrastructure", "OT", "ICS", "Security", "OPSWAT"]
    },
    {
      id: 5,
      title: "Agile Transformation A to Z | How To Make Any Company Agile",
      issuingOrg: "Udemy",
      type: "Certificate of Completion",
      completionDate: "2024-05-12",
      certificateId: "UC-56ec4a09-b4a6-4aa5-87fb-1297467078f7",
      verificationLink: "ude.my/UC-56ec4a09-b4a6-4aa5-87fb-1297467078f7",
      downloadLink: "",
      certificateImage: "images/certificates/c (27).png", // Placeholder image name
      learnings: "Gained a comprehensive understanding of Agile principles, methodologies (Scrum, Kanban), and practices. Learned strategies for implementing Agile transformations, fostering an Agile mindset, and scaling Agile frameworks.",
      additionalDetails: "Length: 6.5 total hours, Instructor: Masha Ostroumova",
      category: "Project Management",
      tags: ["Agile", "Scrum", "Kanban", "Project Management", "Transformation", "Udemy"]
    },
    {
      id: 6,
      title: "Digital Marketing Strategist. Unlock your career growth",
      issuingOrg: "Udemy",
      type: "Certificate of Completion",
      completionDate: "2024-04-24",
      certificateId: "UC-16ec4f5b-acc7-4af3-aa64-37b66793443e",
      verificationLink: "ude.my/UC-16ec4f5b-acc7-4af3-aa64-37b66793443e",
      downloadLink: "",
      certificateImage: "images/certificates/c (26).png", // Placeholder image name
      learnings: "Developed strategic knowledge across various digital marketing domains including SEO, SEM, content marketing, social media, email marketing, and analytics. Learned to formulate, implement, and measure integrated digital strategies.",
      additionalDetails: "Length: 26.5 total hours, Instructors: Anton Voroniuk, et al.",
      category: "Marketing",
      tags: ["Digital Marketing", "SEO", "SEM", "Content Marketing", "Social Media", "Analytics", "Udemy"]
    },
    {
      id: 7,
      title: "Make Simple Games with Python",
      issuingOrg: "Udemy",
      type: "Certificate of Completion",
      completionDate: "2024-04-24",
      certificateId: "UC-3ac24bfd-5bce-40b7-8be2-948bed9e6393",
      verificationLink: "ude.my/UC-3ac24bfd-5bce-40b7-8be2-948bed9e6393",
      downloadLink: "",
      certificateImage: "images/certificates/c (25).png", // Placeholder image name
      learnings: "Acquired introductory skills in game development using Python. Learned about game loops, handling user input, simple graphics/text output, and applying fundamental programming logic to create simple, playable games.",
      additionalDetails: "Length: 1 total hour, Instructor: Frank Anemaet",
      category: "Programming",
      tags: ["Python", "Game Development", "Programming", "Udemy"]
    },
    {
      id: 8,
      title: "Build a free website with WordPress",
      issuingOrg: "Coursera Project Network",
      type: "Project Certificate (Non-credit)",
      completionDate: "2024-04-28",
      certificateId: "ACDZQDJYBT2L (Inferred from verification link)",
      verificationLink: "https://coursera.org/verify/ACDZQDJYBT2L",
      downloadLink: "",
      certificateImage: "images/certificates/c (15).png", // Placeholder image name
      learnings: "Gained practical, hands-on experience in creating a functional website using WordPress. Learned to navigate the dashboard, customize themes, create pages and posts, and manage basic website operations.",
      additionalDetails: "Instructor: Delphine Sangotokun, MPH, Ph.D.",
      category: "Web Development",
      tags: ["WordPress", "Website", "CMS", "Coursera", "Project"]
    },
    {
      id: 9,
      title: "Introduction to Microsoft Excel",
      issuingOrg: "Coursera Project Network",
      type: "Project Certificate (Non-credit)",
      completionDate: "2024-04-28",
      certificateId: "W8JFG6JN7E64 (Inferred from verification link)",
      verificationLink: "https://coursera.org/verify/W8JFG6JN7E64",
      downloadLink: "",
      certificateImage: "images/certificates/c (16).png", // Placeholder image name
      learnings: "Mastered fundamental Microsoft Excel skills through a practical project. Learned data entry, formatting, basic formulas, creating charts, and navigating the Excel interface.",
      additionalDetails: "Instructor: Summer Scaggs, Subject Matter Expert",
      category: "Data Analysis",
      tags: ["Excel", "Microsoft Excel", "Spreadsheet", "Data Analysis", "Coursera", "Project"]
    },
    {
      id: 10,
      title: "CSS (Basic)",
      issuingOrg: "HackerRank",
      type: "Certificate of Accomplishment (Skill Certification)",
      completionDate: "2025-01-10", // Note: Future date
      certificateId: "8BA95279CB39",
      verificationLink: "Verification typically via HackerRank profile using ID",
      downloadLink: "",
      certificateImage: "images/certificates/c (19).png", // Placeholder image name
      learnings: "Demonstrated proficiency in foundational CSS concepts including selectors, properties, the box model, basic layout techniques, and applying styles to HTML elements.",
      additionalDetails: "Skill assessment platform.",
      category: "Web Development",
      tags: ["CSS", "Web Development", "Frontend", "HackerRank", "Skill"]
    },
    {
      id: 11,
      title: "A2Z Of Finance: Finance Beginner Course",
      issuingOrg: "Elearnmarkets",
      type: "Certificate of Completion",
      completionDate: "2024-04-24",
      certificateId: "ELM-181639",
      verificationLink: "elearnmarkets.com/verify-certificate", // Assumed needs https://
      downloadLink: "",
      certificateImage: "images/certificates/c (11).png", // Placeholder image name
      learnings: "Gained a foundational understanding of core finance concepts including financial terminology, market basics, accounting principles, and types of financial instruments.",
      additionalDetails: "",
      category: "Finance",
      tags: ["Finance", "Accounting", "Markets", "Beginner", "Elearnmarkets"]
    },
    {
      id: 12,
      title: "The SDG Primer",
      issuingOrg: "futurenation / UNDP Bangladesh",
      type: "Certificate of Completion",
      completionDate: "2024-09-07",
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (24).png", // Placeholder image name
      learnings: "Acquired foundational knowledge about the United Nations Sustainable Development Goals (SDGs). Understood the 17 goals, their targets, and their global significance.",
      additionalDetails: "Initiative: Green Skills for SDGs, Instructor: A. Z. M. Saleh, UNDP Bangladesh",
      category: "Social Impact",
      tags: ["SDG", "Sustainable Development", "UN", "UNDP", "Global Goals", "Bangladesh"]
    },
    {
      id: 13,
      title: "CHAT- a toolkit to improve Community Engagement in emergencies",
      issuingOrg: "UNICEF (via Agora platform)",
      type: "Certificate of Completion",
      completionDate: "2025-01-09", // Note: Future date
      certificateId: "KWmgQ752El",
      verificationLink: "Issued via Agora platform (Verification may require login/be internal)",
      downloadLink: "",
      certificateImage: "images/certificates/c (28).png", // Placeholder image name
      learnings: "Learned to utilize the CHAT framework to enhance community engagement during emergencies, focusing on effective communication, participation strategies, and trust-building.",
      additionalDetails: "Completed via Agora learning platform.",
      category: "Community Engagement",
      tags: ["Community Engagement", "Emergency Response", "Communication", "UNICEF", "Agora"]
    },
    {
      id: 14,
      title: "EF SET English Certificate (C1 Advanced)",
      issuingOrg: "EF SET",
      type: "Language Proficiency Certificate",
      completionDate: "2025-02-18", // Note: Future date
      certificateId: "oHqLcS (Inferred from verification link)",
      verificationLink: "https://cert.efset.org/oHqLcS",
      downloadLink: "",
      certificateImage: "images/certificates/c (22).png", // Placeholder image name
      learnings: "Demonstrated advanced English proficiency across reading, listening, writing, and speaking skills, corresponding to the C1 level (Overall Score: 68/100).",
      additionalDetails: "Scores: Reading 83, Listening 54, Writing 86, Speaking 48. CEFR Level C1.",
      category: "Language Proficiency",
      tags: ["English", "Language", "C1", "Advanced", "EF SET", "CEFR"]
    },
    {
      id: 15,
      title: "Advanced Cardiac Life Support (ACLS) Provider",
      issuingOrg: "SaveaLife Certifications™ by NHCPS",
      type: "Provider Certification",
      completionDate: "2025-04-02", // Note: Future date
      certificateId: "QR Code for verification",
      verificationLink: "Scan QR Code",
      downloadLink: "",
      certificateImage: "images/certificates/c (8).png", // Placeholder image name
      learnings: "Mastered advanced skills for managing adult cardiovascular emergencies including airway management, rhythm interpretation, defibrillation, medication administration, and effective team dynamics.",
      additionalDetails: "Renew By: April 2, 2027, Standards: ILCOR, Joint Commission (JCAHO) compliant, Instructor: Karl F. Disque D.O. RPh",
      category: "Healthcare",
      tags: ["ACLS", "Healthcare", "Medical", "Emergency", "Life Support", "NHCPS", "Certification"]
    },
    {
      id: 16,
      title: "SaveaLife - ACLS Certification 2025 (CME)",
      issuingOrg: "Postgraduate Institute for Medicine (PIM)",
      type: "Certificate of Continuing Medical Education (AAPA Credit)",
      completionDate: "2025-04-02", // Note: Future date
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (12).png", // Placeholder image name
      learnings: "Fulfilled continuing education requirements by reviewing and demonstrating knowledge of current ACLS protocols and guidelines relevant for Physician Assistants.",
      additionalDetails: "Credits: 8.00 AAPA Category 1 credit(s), Approval Valid Until: 12/31/2025",
      category: "Healthcare",
      tags: ["CME", "ACLS", "Healthcare", "Medical", "Continuing Education", "AAPA", "PIM"]
    },
    {
      id: 17,
      title: "Pediatric Advanced Life Support (PALS) Provider",
      issuingOrg: "SaveaLife Certifications™ by NHCPS",
      type: "Provider Certification",
      completionDate: "2025-04-03", // Note: Future date
      certificateId: "QR Code for verification",
      verificationLink: "Scan QR Code",
      downloadLink: "",
      certificateImage: "images/certificates/c (23).png", // Placeholder image name
      learnings: "Acquired advanced skills for assessing and managing critically ill infants and children, including pediatric assessment, management of respiratory emergencies, and resuscitation.",
      additionalDetails: "Renew By: April 3, 2027, Standards: ILCOR, Joint Commission (JCAHO) compliant, Instructor: Karl F. Disque D.O. RPh",
      category: "Healthcare",
      tags: ["PALS", "Pediatric", "Healthcare", "Medical", "Emergency", "Life Support", "NHCPS", "Certification"]
    },
    {
      id: 18,
      title: "SaveaLife - PALS Certification 2025 (CME)",
      issuingOrg: "Postgraduate Institute for Medicine (PIM)",
      type: "Attendance Certificate of Continuing Medical Education (AMA PRA Credit)",
      completionDate: "2025-04-02", // Note: Future date
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (13).png", // Placeholder image name
      learnings: "Fulfilled continuing education requirements by reviewing Pediatric Advanced Life Support protocols and guidelines.",
      additionalDetails: "Credits: 8.00 AMA PRA Category 1 Credit(s)™",
      category: "Healthcare",
      tags: ["CME", "PALS", "Healthcare", "Medical", "Continuing Education", "AMA PRA", "PIM"]
    },
    {
      id: 19,
      title: "Basic Life Support (BLS) Provider",
      issuingOrg: "SaveaLife Certifications™ by NHCPS",
      type: "Provider Certification",
      completionDate: "2025-04-02", // Note: Future date
      certificateId: "QR Code for verification",
      verificationLink: "Scan QR Code",
      downloadLink: "",
      certificateImage: "images/certificates/c (10).png", // Placeholder image name
      learnings: "Mastered fundamental life support skills including recognition of cardiac arrest, high-quality chest compressions, rescue breathing, AED use, and choking relief.",
      additionalDetails: "Renew By: April 2, 2027, Standards: ILCOR, Joint Commission (JCAHO) compliant, Instructor: Karl F. Disque D.O. RPh",
      category: "Healthcare",
      tags: ["BLS", "CPR", "Healthcare", "Medical", "Emergency", "Life Support", "NHCPS", "Certification"]
    },
    {
      id: 20,
      title: "SaveaLife - BLS Certification 2025 (CME)",
      issuingOrg: "Postgraduate Institute for Medicine (PIM)",
      type: "Attendance Certificate of Continuing Medical Education (AMA PRA Credit)",
      completionDate: "2025-04-02", // Note: Future date
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (14).png", // Placeholder image name
      learnings: "Fulfilled continuing education requirements by reviewing current Basic Life Support protocols and guidelines.",
      additionalDetails: "Credits: 4.00 AMA PRA Category 1 Credit(s)™",
      category: "Healthcare",
      tags: ["CME", "BLS", "Healthcare", "Medical", "Continuing Education", "AMA PRA", "PIM"]
    },
    {
      id: 21,
      title: "CPR, AED & First Aid Provider (Infant, Child, and Adult)",
      issuingOrg: "SaveaLife Certifications™ by NHCPS",
      type: "Provider Certification",
      completionDate: "2025-03-11", // Note: Future date
      certificateId: "QR Code for verification",
      verificationLink: "Scan QR Code",
      downloadLink: "",
      certificateImage: "images/certificates/c (17).png", // Placeholder image name
      learnings: "Gained comprehensive skills in providing CPR, using AED, and administering First Aid for infants, children, and adults.",
      additionalDetails: "Renew By: March 11, 2027, Standards: ILCOR, Joint Commission (JCAHO) compliant, Instructor: Karl F. Disque D.O. RPh",
      category: "Healthcare",
      tags: ["CPR", "AED", "First Aid", "Healthcare", "Emergency", "NHCPS", "Certification"]
    },
    {
      id: 22,
      title: "CPR, AED, and First Aid Certification Course (CME)",
      issuingOrg: "SaveaLife.com / NHCPS",
      type: "Continuing Education Certificate",
      completionDate: "2025-03-11", // Note: Future date
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (18).png", // Placeholder image name
      learnings: "Fulfilled continuing education requirements by reviewing current CPR, AED, and First Aid protocols and guidelines.",
      additionalDetails: "Credits: 6 Category 2 CME Credits, Instructor: Karl F. Disque D.O. RPh",
      category: "Healthcare",
      tags: ["CME", "CPR", "AED", "First Aid", "Healthcare", "Continuing Education", "NHCPS"]
    },
    {
      id: 23,
      title: "Bloodborne Pathogens Certification Course",
      issuingOrg: "SaveaLife.com / NHCPS",
      type: "Continuing Education Certificate",
      completionDate: "2025-04-02", // Note: Future date
      certificateId: "Not explicitly provided",
      verificationLink: "Not explicitly provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (9).png", // Placeholder image name
      learnings: "Acquired essential knowledge regarding bloodborne pathogens, modes of transmission, prevention strategies, and exposure control procedures.",
      additionalDetails: "Credits: 3 Category 2 CME Credits, Instructor: Karl F. Disque D.O. RPh",
      category: "Healthcare",
      tags: ["Bloodborne Pathogens", "Healthcare", "Safety", "CME", "Continuing Education", "NHCPS"]
    },
    {
      id: 24,
      title: "HHP (Mobile) Service For Hardware and Software",
      issuingOrg: "ST Institute of Mobile Technology (Authorised by NSDA, Bangladesh)",
      type: "Certificate of Appreciation / Training Course Completion",
      completionDate: "2024-01-31",
      certificateId: "NSDA Registration No: STP-DHA-000965; Batch: 42",
      verificationLink: "Not explicitly provided", // Likely requires contacting institute or NSDA
      downloadLink: "",
      certificateImage: "images/certificates/c (37).png", // Placeholder image name
      learnings: "Acquired practical skills in mobile phone servicing covering hardware diagnostics, repair, replacement and software issues like flashing, unlocking, and troubleshooting OS problems.",
      additionalDetails: "Training Period: Nov 1, 2023 - Jan 31, 2024, Location: Dhaka, Bangladesh",
      category: "Technical Skills",
      tags: ["Mobile Repair", "Hardware", "Software", "Technical Training", "NSDA", "Bangladesh"]
    },
    {
      id: 25,
      title: "Skill Development for Mobile Game & Application Project (Cross Platform)",
      issuingOrg: "ICT Division, Government of Bangladesh & Flash IT (Under Digital Bangladesh Initiative)",
      type: "Participation Certificate / Training Completion",
      completionDate: "2022-02-27",
      certificateId: "Batch ID: GV2-DHA-04 (Flash IT); Reg No: G20078",
      verificationLink: "Not explicitly provided", // Likely internal verification
      downloadLink: "",
      certificateImage: "images/certificates/c (39).png", // Placeholder image name
      learnings: "Developed skills in mobile game and application development using cross-platform frameworks. Gained experience in designing, coding, testing, and deploying mobile applications for multiple operating systems.",
      additionalDetails: "Duration: 200 hours of training, Part of Digital Bangladesh Initiative.",
      category: "Mobile Development",
      tags: ["Mobile Development", "App Development", "Game Development", "Cross-Platform", "ICT Division", "Bangladesh", "Training"]
    },
    {
      id: 26,
      title: "Workshop on Beginner's guide to Python 3 Programming",
      issuingOrg: "Atish Dipankar University of Science and Technology (ADUST), Dept. of Computer Science and Engineering",
      type: "Certificate of Participation (Workshop)",
      completionDate: "2023-02-09",
      certificateId: "Not provided",
      verificationLink: "Not provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (2).png", // Placeholder image name
      learnings: "Gained foundational knowledge of Python 3 programming including syntax, data types, control flow, basic data structures, and writing simple programs.",
      additionalDetails: "Recognized for active participation in university workshop.",
      category: "Programming",
      tags: ["Python", "Programming", "Workshop", "ADUST", "University"]
    },
    {
      id: 27,
      title: "Workshop on Professional C Programming for Job Interview",
      issuingOrg: "Atish Dipankar University of Science and Technology (ADUST), Dept. of Computer Science and Engineering",
      type: "Certificate of Participation (Workshop)",
      completionDate: "2023-06-03",
      certificateId: "Not provided",
      verificationLink: "Not provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (7).png", // Placeholder image name
      learnings: "Focused on enhancing C programming skills for technical job interviews. Covered pointers, memory management, data structures, algorithms, and common coding problems with an emphasis on problem-solving.",
      additionalDetails: "Recognized for active participation in university workshop.",
      category: "Programming",
      tags: ["C Programming", "Programming", "Workshop", "Interview Prep", "Data Structures", "Algorithms", "ADUST", "University"]
    },
    {
      id: 28,
      title: "Higher Secondary Certificate (HSC) Examination, 2020",
      issuingOrg: "Board of Intermediate and Secondary Education, Dhaka, Bangladesh",
      type: "Academic Certificate",
      completionDate: "2020", // Year of Exam
      certificateId: "Serial: DBHC 20 0140839; Reg: 1510767316/2018-19; Roll: 11 65 31",
      verificationLink: "Official Board Verification", // Needs specific board link
      downloadLink: "",
      certificateImage: "images/certificates/c (6).png", // Placeholder image name
      learnings: "Successfully completed higher secondary education in Science with the highest grade GPA of 5.00.",
      additionalDetails: "Institution: Adamjee Cantonment College, Group: Science, Results Published: 2021-01-30",
      category: "Academic",
      tags: ["HSC", "Academic", "High School", "Science", "Bangladesh", "GPA 5.00"]
    },
    {
      id: 29,
      title: "Secondary School Certificate (SSC) Examination, 2018",
      issuingOrg: "Board of Intermediate and Secondary Education, Dhaka, Bangladesh",
      type: "Academic Certificate",
      completionDate: "2018", // Year of Exam
      certificateId: "Serial: DBSC 8300723; Reg: 1510767316/2016; Roll: 22 86 82",
      verificationLink: "Official Board Verification", // Needs specific board link
      downloadLink: "",
      certificateImage: "images/certificates/ssc_academic.png", // Placeholder image name
      learnings: "Successfully completed secondary education in Science with the highest grade GPA of 5.00.",
      additionalDetails: "Institution: Civil Aviation High School, Tejgaon, Group: Science, Results Published: 2018-05-06",
      category: "Academic",
      tags: ["SSC", "Academic", "Secondary School", "Science", "Bangladesh", "GPA 5.00"]
    },
    {
      id: 30,
      title: "Junior School Certificate (JSC) Examination - 2015",
      issuingOrg: "Board of Intermediate and Secondary Education, Dhaka, Bangladesh",
      type: "Academic Certificate",
      completionDate: "2015", // Year of Exam
      certificateId: "Serial: DBJ 5409887; Reg: 1510767316/2015; Roll: 65 75 24",
      verificationLink: "Official Board Verification", // Needs specific board link
      downloadLink: "",
      certificateImage: "images/certificates/c (3).png", // Placeholder image name
      learnings: "Successfully completed junior secondary education with a high level of academic achievement.",
      additionalDetails: "Institution: Civil Aviation High School, Tejgaon, Results Published: 2015-12-31",
      category: "Academic",
      tags: ["JSC", "Academic", "Junior School", "Bangladesh"]
    },
    {
      id: 31,
      title: "Primary Education Completion Examination - 2012",
      issuingOrg: "Directorate of Primary Education, Bangladesh",
      type: "Academic Certificate",
      completionDate: "2012", // Year of Exam
      certificateId: "Serial: 8767358",
      verificationLink: "Official Verification", // Needs specific DPE link
      downloadLink: "",
      certificateImage: "images/certificates/c (5).png", // Placeholder image name
      learnings: "Successfully completed primary education with the highest possible academic grade GPA of 5.00.",
      additionalDetails: "Institution: Civil Aviation High School",
      category: "Academic",
      tags: ["Primary Education", "PEC", "Academic", "Bangladesh", "GPA 5.00"]
    },
    {
      id: 32,
      title: "Participation in 38th Science & Technology Week - 2017 (District Level)",
      issuingOrg: "District Administration, Dhaka & Ministry of Science and Technology, Bangladesh",
      type: "Certificate of Participation",
      completionDate: "2017-04-27", // End date of event
      certificateId: "Roll: 89",
      verificationLink: "Not provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (38).png", // Placeholder image name
      learnings: "Gained experience in developing and presenting a science project at a district-level event, enhancing presentation and communication skills.",
      additionalDetails: "Event Dates: April 25-27, 2017; Represented Civil Aviation High School (Class 10)",
      category: "Extracurricular",
      tags: ["Science Fair", "Competition", "Participation", "District Level", "Bangladesh", "STEM"]
    },
    {
      id: 33,
      title: "Participation in 'Lakho Konthe Sonar Bangla'",
      issuingOrg: "Ministry of Cultural Affairs, Bangladesh & Bangladesh Armed Forces",
      type: "Certificate of Participation / Appreciation",
      completionDate: "Not specified", // Event date likely March 26, 2014
      certificateId: "Not provided",
      verificationLink: "Not provided",
      downloadLink: "",
      certificateImage: "images/certificates/c (4).png", // Placeholder image name
      learnings: "Participated in a national event aimed at setting a world record for the most people singing a national anthem simultaneously.",
      additionalDetails: "Guinness World Record event.",
      category: "Extracurricular",
      tags: ["National Event", "Participation", "World Record", "Bangladesh", "Culture"]
    },
    {
      id: 34,
      title: "Multiple Indicator Cluster Survey (MICS) eLearning",
      issuingOrg: "UNICEF",
      type: "Certificate of Completion",
      completionDate: "2025-04-03", // Note: Future date
      certificateId: "Not Provided",
      verificationLink: "Not Provided (Issued via Agora Platform)",
      downloadLink: "",
      certificateImage: "images/certificates/c (31).png", // Placeholder image name
      learnings: "Gained understanding of the MICS methodology, survey design principles, data collection processes, and key indicators related to health, education, and child protection.",
      additionalDetails: "Platform: Agora",
      category: "Research",
      tags: ["MICS", "Survey", "Data Collection", "Child Health", "Education", "Protection", "UNICEF", "Agora"]
    },
    {
      id: 35,
      title: "Cinematic Video Editing Mastery",
      issuingOrg: "GoEdu.ac (GoEdu)",
      type: "Certificate of Achievement (With Distinction)",
      completionDate: "2025-04-03", // Note: Future date
      certificateId: "Not Provided",
      verificationLink: "QR Code provided on the certificate",
      downloadLink: "",
      certificateImage: "images/certificates/c (29).png", // Placeholder image name
      learnings: "Mastered advanced video editing techniques focused on cinematic storytelling, color grading, sound design, pacing, and visual effects.",
      additionalDetails: "Achieved with distinction, Instructor: Mr. Shah Fahad Hossain, in association with Skill Jobs & HRDI",
      category: "Creative Skills",
      tags: ["Video Editing", "Cinematic", "Color Grading", "Sound Design", "Post Production", "GoEdu"]
    },
    {
      id: 36,
      title: "Customer Service Development",
      issuingOrg: "BDskills (Supported by EDGE, BACCO, ICT Division, Bangladesh Computer Council)",
      type: "Certificate of Completion",
      completionDate: "2025-03-04", // Note: Future date
      certificateId: "Not Provided",
      verificationLink: "QR Code provided on the certificate",
      downloadLink: "",
      certificateImage: "images/certificates/c (33).png", // Placeholder image name
      learnings: "Developed core competencies in customer service excellence including effective communication, active listening, empathy, and problem-solving.",
      additionalDetails: "Achieved Score: 87%, Part of Bangladesh Digital Skills initiative under the EDGE project, Endorsed by BACCO & BCC",
      category: "Professional Development",
      tags: ["Customer Service", "Communication", "Soft Skills", "BDskills", "Bangladesh", "BPO"]
    },
    {
      id: 37,
      title: "Mobile Application Development using Android",
      issuingOrg: "BDskills (Supported by EDGE, BITM, ICT Division, Bangladesh Computer Council)",
      type: "Certificate of Completion",
      completionDate: "2025-03-04", // Note: Future date
      certificateId: "Not Provided",
      verificationLink: "QR Code provided on the certificate",
      downloadLink: "",
      certificateImage: "images/certificates/c (34).png", // Placeholder image name
      learnings: "Gained foundational and practical skills in native Android application development including UI design, application lifecycle management, and core SDK usage.",
      additionalDetails: "Achieved Score: 82%, Endorsed by BITM & BCC",
      category: "Mobile Development",
      tags: ["Android", "Mobile Development", "App Development", "Java", "Kotlin", "SDK", "BDskills", "Bangladesh"]
    },
    {
      id: 38,
      title: "Web Application Development using PHP and Laravel",
      issuingOrg: "BDskills (Supported by EDGE, BITM, ICT Division, Bangladesh Computer Council)",
      type: "Certificate of Completion",
      completionDate: "2025-03-04", // Note: Future date
      certificateId: "Not Provided",
      verificationLink: "QR Code provided on the certificate",
      downloadLink: "",
      certificateImage: "images/certificates/c (35).png", // Placeholder image name
      learnings: "Acquired proficiency in backend web development using PHP and the Laravel framework including MVC architecture, database management, routing, and RESTful API creation.",
      additionalDetails: "Achieved Score: 80%, Endorsed by BITM & BCC",
      category: "Web Development",
      tags: ["PHP", "Laravel", "Web Development", "Backend", "MVC", "API", "BDskills", "Bangladesh"]
    },
    {
      id: 39,
      title: "Professional Back Office Services",
      issuingOrg: "BDskills (Supported by EDGE, BACCO, ICT Division, Bangladesh Computer Council)",
      type: "Certificate of Completion",
      completionDate: "2025-03-04", // Note: Future date
      certificateId: "Not Provided",
      verificationLink: "QR Code provided on the certificate",
      downloadLink: "",
      certificateImage: "images/certificates/c (32).png", // Placeholder image name
      learnings: "Developed essential skills for efficient back-office operations including data management, administrative support, report generation, and organizational communication.",
      additionalDetails: "Achieved Score: 86%, Endorsed by BACCO & BCC",
      category: "Professional Development",
      tags: ["Back Office", "Administrative Support", "Data Management", "BPO", "BDskills", "Bangladesh"]
    },
    {
      id: 40,
      title: "Cloud Skills Boost Badge",
      issuingOrg: "Credly / Google Cloud", // Assuming Google based on others
      type: "Digital Badge",
      completionDate: "Not Provided", // Check Credly for issue date if needed
      certificateId: "646332c0-679d-43a0-ac31-242ebd2c2bf9", // Badge ID from link
      verificationLink: "https://www.credly.com/badges/646332c0-679d-43a0-ac31-242ebd2c2bf9",
      downloadLink: "https://www.credly.com/badges/646332c0-679d-43a0-ac31-242ebd2c2bf9",
      certificateImage: "images/certificates/credly_gcp_badge_40.png", // Placeholder image name
      learnings: "Digital badge showcasing completion of specific Google Cloud learning paths or challenges via Cloud Skills Boost.",
      additionalDetails: "Verified digital credential.",
      category: "Cloud Computing",
      tags: ["Cloud", "Badge", "Credly", "Google Cloud", "GCP", "Cloud Skills Boost"]
    },
    {
      id: 41,
      title: "Cloud Skills Boost Badge",
      issuingOrg: "Google Cloud",
      type: "Digital Badge",
      completionDate: "Not Provided", // Check profile for issue date if needed
      certificateId: "14624727", // Badge ID from link
      verificationLink: "https://www.cloudskillsboost.google/public_profiles/d81586d4-bc86-436d-8fb9-ff5eaa221080/badges/14624727",
      downloadLink: "https://www.cloudskillsboost.google/public_profiles/d81586d4-bc86-436d-8fb9-ff5eaa221080/badges/14624727",
      certificateImage: "images/certificates/gcp_badge_41.png", // Placeholder image name
      learnings: "Digital badge showcasing completion of specific Google Cloud learning paths or challenges.",
      additionalDetails: "Verified via Google Cloud Skills Boost profile.",
      category: "Cloud Computing",
      tags: ["Cloud", "Badge", "Google Cloud", "GCP", "Cloud Skills Boost"]
    },
    {
      id: 42,
      title: "Cloud Skills Boost Badge",
      issuingOrg: "Google Cloud",
      type: "Digital Badge",
      completionDate: "Not Provided", // Check profile for issue date if needed
      certificateId: "14624721", // Badge ID from link
      verificationLink: "https://www.cloudskillsboost.google/public_profiles/d81586d4-bc86-436d-8fb9-ff5eaa221080/badges/14624721",
      downloadLink: "https://www.cloudskillsboost.google/public_profiles/d81586d4-bc86-436d-8fb9-ff5eaa221080/badges/14624721",
      certificateImage: "images/certificates/gcp_badge_42.png", // Placeholder image name
      learnings: "Digital badge showcasing completion of specific Google Cloud learning paths or challenges.",
      additionalDetails: "Verified via Google Cloud Skills Boost profile.",
      category: "Cloud Computing",
      tags: ["Cloud", "Badge", "Google Cloud", "GCP", "Cloud Skills Boost"]
    },
    {
      id: 43,
      title: "Cloud Skills Boost Badge 3", // Title could be more specific if known
      issuingOrg: "Google Cloud",
      type: "Digital Badge",
      completionDate: "2025-04-03", // Note: Future date
      certificateId: "14601970", // Badge ID from link
      verificationLink: "https://www.cloudskillsboost.google/public_profiles/d81586d4-bc86-436d-8fb9-ff5eaa221080/badges/14601970",
      downloadLink: "https://www.cloudskillsboost.google/public_profiles/d81586d4-bc86-436d-8fb9-ff5eaa221080/badges/14601970",
      certificateImage: "images/certificates/gcp_badge_43.png", // Placeholder image name
      learnings: "Digital badge showcasing completion of specific Google Cloud learning paths or challenges, potentially indicating advanced skill mastery.",
      additionalDetails: "Verified via Google Cloud Skills Boost profile.",
      category: "Cloud Computing",
      tags: ["Cloud", "Badge", "Google Cloud", "GCP", "Cloud Skills Boost"]
    }
  ];
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize references to DOM elements
    const certificatesGrid = document.getElementById('certificates-grid');
    const lightbox = document.getElementById('certLightbox');
    const lightboxClose = document.getElementById('lbClose');
    const lbTitle = document.getElementById('lbTitle');
    const lbMeta = document.getElementById('lbMeta');
    const lbCompletion = document.getElementById('lbCompletion');
    const lbLearnings = document.getElementById('lbLearnings');
    const lbCertId = document.getElementById('lbCertId');
    const lbAdditional = document.getElementById('lbAdditional');
    const lbVerify = document.getElementById('lbVerify');
    const lbDownload = document.getElementById('lbDownload');
    const lbCertificateImage = document.getElementById('lbCertificateImage');
    const lbDownloadImage = document.getElementById('lbDownloadImage');
  
    // Make sure all elements are found
    if (!certificatesGrid || !lightbox) {
      console.error('Some certificate DOM elements not found');
      return;
    }
  
    // Render certifications
    renderCertifications(certificationsData);
  
    // Set up lightbox close events
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
  
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  
    // Enable dragging/panning of certificate image
    let isDragging = false;
    let dragStartX, dragStartY;
    let currentX = 0, currentY = 0;
    let scale = 1;
  
    function initImageInteractions() {
      const certificateImage = document.getElementById('lbCertificateImage');
      const imageContainer = document.querySelector('.certificate-image-container');
      
      if (!certificateImage || !imageContainer) return;
      
      // Mouse events for desktop
      certificateImage.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', endDrag);
      
      // Touch events for mobile
      certificateImage.addEventListener('touchstart', startDragTouch);
      window.addEventListener('touchmove', dragTouch);
      window.addEventListener('touchend', endDrag);
      
      // Handle zoom with mouse wheel
      imageContainer.addEventListener('wheel', handleZoom);
      
      // Set up zoom buttons
      const zoomInBtn = document.getElementById('zoomIn');
      const zoomOutBtn = document.getElementById('zoomOut');
      const resetZoomBtn = document.getElementById('resetZoom');
      
      if (zoomInBtn) zoomInBtn.addEventListener('click', () => changeZoom(0.1));
      if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => changeZoom(-0.1));
      if (resetZoomBtn) resetZoomBtn.addEventListener('click', resetImageView);
    }
    
    function startDrag(e) {
      if (e.button !== 0) return; // Only left mouse button
      isDragging = true;
      dragStartX = e.clientX - currentX;
      dragStartY = e.clientY - currentY;
      this.style.cursor = 'grabbing';
      e.preventDefault();
    }
    
    function startDragTouch(e) {
      if (e.touches.length !== 1) return; // Only single touch
      isDragging = true;
      dragStartX = e.touches[0].clientX - currentX;
      dragStartY = e.touches[0].clientY - currentY;
      e.preventDefault();
    }
    
    function drag(e) {
      if (!isDragging) return;
      currentX = e.clientX - dragStartX;
      currentY = e.clientY - dragStartY;
      updateImagePosition();
      e.preventDefault();
    }
    
    function dragTouch(e) {
      if (!isDragging || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX - dragStartX;
      currentY = e.touches[0].clientY - dragStartY;
      updateImagePosition();
      e.preventDefault();
    }
    
    function endDrag() {
      isDragging = false;
      const certificateImage = document.getElementById('lbCertificateImage');
      if (certificateImage) certificateImage.style.cursor = 'grab';
    }
    
    function handleZoom(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      changeZoom(delta);
    }
    
    function changeZoom(amount) {
      scale += amount;
      scale = Math.max(0.5, Math.min(3, scale)); // Limit zoom between 0.5x and 3x
      updateImagePosition();
    }
    
    function updateImagePosition() {
      const certificateImage = document.getElementById('lbCertificateImage');
      if (certificateImage) {
        certificateImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
      }
    }
    
    function resetImageView() {
      currentX = 0;
      currentY = 0;
      scale = 1;
      updateImagePosition();
    }
  
    // Initialize image interactions when DOM is loaded
    initImageInteractions();
  
    // Function to create a certificate card
    function createCertCard(cert) {
      const card = document.createElement('div');
      card.className = 'cert-card';
      card.setAttribute('data-cert-id', cert.id);
      
      // Create certificate icon based on type
      let iconClass = 'fa-certificate';
      if (cert.type.toLowerCase().includes('completion')) {
        iconClass = 'fa-award';
      } else if (cert.type.toLowerCase().includes('proficiency')) {
        iconClass = 'fa-language';
      } else if (cert.type.toLowerCase().includes('simulation')) {
        iconClass = 'fa-laptop-code';
      } else if (cert.type.toLowerCase().includes('provider')) {
        iconClass = 'fa-heartbeat';
      }
      
      card.innerHTML = `
        <div class="cert-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="cert-content">
          <h3>${cert.title}</h3>
          <p class="cert-issuer">${cert.issuingOrg}</p>
          <p class="cert-date">${cert.completionDate}</p>
          <span class="cert-type">${cert.type}</span>
        </div>
        <div class="cert-hover">
          <p>${cert.learnings.substring(0, 120)}${cert.learnings.length > 120 ? '...' : ''}</p>
          <button class="view-cert-btn">View Certificate</button>
        </div>
      `;
      
      // Add click handler to view certificate
      const viewBtn = card.querySelector('.view-cert-btn');
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(cert.id);
      });
      
      // Make the entire card clickable
      card.addEventListener('click', () => {
        openLightbox(cert.id);
      });
      
      return card;
    }
  
    // Function to render certificates to the grid
    function renderCertifications(data) {
      if (!certificatesGrid) return;
      
      certificatesGrid.innerHTML = '';
      
      data.forEach(cert => {
        const card = createCertCard(cert);
        certificatesGrid.appendChild(card);
      });
    }
  
    // Open lightbox and populate with certificate data
    function openLightbox(certId) {
      const cert = certificationsData.find(c => c.id == certId);
      if (cert) {
        // Store current certificate ID for navigation
        lightbox.setAttribute('data-current-cert-id', certId);
        
        // Update lightbox with certificate details
        lbTitle.textContent = cert.title;
        lbMeta.textContent = `${cert.issuingOrg} | ${cert.type}`;
        lbCompletion.innerHTML = `<strong>Completed:</strong> ${cert.completionDate}`;
        lbLearnings.innerHTML = `<strong>Learnings:</strong> ${cert.learnings}`;
        lbCertId.innerHTML = `<strong>Certificate ID:</strong> ${cert.certificateId}`;
        
        // Display tags if available
        if (cert.tags && cert.tags.length > 0) {
          const tagsHtml = cert.tags.map(tag => `<span class="cert-tag">${tag}</span>`).join('');
          lbAdditional.innerHTML = `
            <strong>Details:</strong> ${cert.additionalDetails || 'No additional details available'}
            <div class="cert-tags-container">
              <strong>Tags:</strong> ${tagsHtml}
            </div>
          `;
        } else {
          lbAdditional.innerHTML = `<strong>Details:</strong> ${cert.additionalDetails || 'No additional details available'}`;
        }
        
        // Display certificate image if available
        if (lbCertificateImage) {
          // Show loading indicator 
          lbCertificateImage.style.opacity = '0.3';
          const container = document.querySelector('.certificate-image-container');
          if (container) {
            container.classList.add('loading');
            container.style.display = 'flex';
          }
          
          // Use the specified certificate image or fallback to appropriate image
          if (cert.certificateImage) {
            lbCertificateImage.src = cert.certificateImage;
          } else {
            // Map cert ID to specific images or use default based on cert type
            let imageFileName;
            
            switch(certId) {
              case 1:
                imageFileName = 'images/certificates/c (36).png';
                break;
              case 4:
                imageFileName = 'images/certificates/introduction_to_cip.png';
                break;
              case 8:
                imageFileName = 'images/certificates/MICS eLearning Course_Certificate.png';
                break;
              default:
                // Choose a generic certificate image from the available ones
                const genericCerts = [
                  'images/certificates/Binder1.pdf_Page_01.png',
                  'images/certificates/Binder1.pdf_Page_02.png',
                  'images/certificates/Binder1.pdf_Page_03.png',
                  'images/certificates/Binder1.pdf_Page_04.png',
                  'images/certificates/Binder1.pdf_Page_05.png'
                ];
                // Use a consistent image for the same cert ID
                imageFileName = genericCerts[certId % genericCerts.length];
            }
            
            lbCertificateImage.src = imageFileName;
          }
          
          lbCertificateImage.onload = function() {
            // Once image is loaded, remove loading state
            const container = document.querySelector('.certificate-image-container');
            if (container) {
              container.classList.remove('loading');
              container.style.display = 'flex';
            }
            this.style.opacity = '1';
            
            // Update navigation buttons visibility
            updateNavigationButtons(certId);
          };
          
          lbCertificateImage.onerror = function() {
            // If image fails to load, show a placeholder
            console.error('Certificate image could not be loaded');
            this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_158bd1d28ef%20text%20%7B%20fill%3Argba(0%2C0%2C0%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_158bd1d28ef%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22109.203125%22%20y%3D%2297.2%22%3ECertificate%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
            this.style.opacity = '1';
            
            const container = document.querySelector('.certificate-image-container');
            if (container) container.classList.remove('loading');
          };
        }
        
        // Set up image download button with animated feedback
        if (lbDownloadImage) {
          lbDownloadImage.onclick = function() {
            // Add visual feedback for download
            this.classList.add('downloading');
            
            // Create a temporary link to download the image
            const link = document.createElement('a');
            link.href = lbCertificateImage.src;
            link.download = `${cert.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Reset button after brief delay
            setTimeout(() => {
              this.classList.remove('downloading');
            }, 1500);
          };
        }
        
        // Set Verify and Download buttons if links are valid
        if (cert.verificationLink && cert.verificationLink.startsWith('http')) {
          lbVerify.href = cert.verificationLink;
          lbVerify.style.display = 'inline-flex';
        } else {
          lbVerify.style.display = 'none';
        }
        
        if (cert.downloadLink && cert.downloadLink.startsWith('http')) {
          lbDownload.href = cert.downloadLink;
          lbDownload.style.display = 'inline-flex';
        } else {
          lbDownload.style.display = 'none';
        }
        
        // Reset any image transformations
        resetImageView();
        
        // Update navigation buttons visibility
        updateNavigationButtons(certId);
        
        // Show the lightbox with a smooth fade-in effect
        lightbox.style.opacity = '0';
        lightbox.style.display = 'block';
        
        // Trigger reflow to allow transition
        lightbox.offsetHeight;
        
        // Fade in
        lightbox.style.opacity = '1';
      }
    }
    
    // Function to update navigation buttons visibility based on current certificate
    function updateNavigationButtons(currentId) {
      const prevBtn = document.querySelector('.lightbox-nav.prev-cert');
      const nextBtn = document.querySelector('.lightbox-nav.next-cert');
      
      if (!prevBtn || !nextBtn) return;
      
      const ids = certificationsData.map(cert => cert.id);
      const currentIndex = ids.indexOf(parseInt(currentId));
      
      // Hide prev button if first certificate
      prevBtn.style.opacity = currentIndex <= 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex <= 0 ? 'none' : 'auto';
      
      // Hide next button if last certificate
      nextBtn.style.opacity = currentIndex >= ids.length - 1 ? '0.3' : '1';
      nextBtn.style.pointerEvents = currentIndex >= ids.length - 1 ? 'none' : 'auto';
    }
    
    // Filter certifications
    const searchInput = document.getElementById('cert-search');
    const filterSelect = document.getElementById('cert-filter');
    const sortSelect = document.getElementById('cert-sort');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (searchInput && filterSelect && sortSelect && resetFiltersBtn) {
      // Apply filters and search
      function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;
        const sortValue = sortSelect.value;
        
        let filteredData = [...certificationsData];
        
        // Apply search
        if (searchTerm) {
          filteredData = filteredData.filter(cert => 
            cert.title.toLowerCase().includes(searchTerm) || 
            cert.issuingOrg.toLowerCase().includes(searchTerm) ||
            cert.learnings.toLowerCase().includes(searchTerm)
          );
        }
        
        // Apply filter
        if (filterValue !== 'all') {
          filteredData = filteredData.filter(cert => 
            cert.type.toLowerCase().includes(filterValue.toLowerCase())
          );
        }
        
        // Apply sort
        if (sortValue === 'date-new') {
          filteredData.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
        } else if (sortValue === 'date-old') {
          filteredData.sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
        } else if (sortValue === 'name-asc') {
          filteredData.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortValue === 'name-desc') {
          filteredData.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortValue === 'org') {
          filteredData.sort((a, b) => a.issuingOrg.localeCompare(b.issuingOrg));
        }
        
        // Render filtered data
        renderCertifications(filteredData);
        
        // Update count
        const countEl = document.getElementById('cert-count');
        if (countEl) {
          countEl.textContent = `Showing ${filteredData.length} of ${certificationsData.length} certificates`;
        }
      }
      
      // Set up filter event listeners
      searchInput.addEventListener('input', applyFilters);
      filterSelect.addEventListener('change', applyFilters);
      sortSelect.addEventListener('change', applyFilters);
      
      // Reset filters
      resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterSelect.value = 'all';
        sortSelect.value = 'date-new';
        applyFilters();
      });
      
      // Apply initial filters
      applyFilters();
    }
  });
  
  // Additional functions for animation and effects
  window.addEventListener('scroll', function() {
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        card.classList.add('animate');
      }
    });
  });
  
  // Add keyboard navigation for certificates in lightbox
  document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('certLightbox');
    if (lightbox && lightbox.style.display === 'block') {
      const currentCertId = parseInt(lightbox.getAttribute('data-current-cert-id') || '0');
      
      if (e.key === 'ArrowRight') {
        // Next certificate
        const nextId = findNextCertId(currentCertId);
        if (nextId !== currentCertId) {
          openLightbox(nextId);
        }
      } else if (e.key === 'ArrowLeft') {
        // Previous certificate
        const prevId = findPrevCertId(currentCertId);
        if (prevId !== currentCertId) {
          openLightbox(prevId);
        }
      }
    }
  });
  
  // Helper function to find next certificate ID
  function findNextCertId(currentId) {
    const ids = certificationsData.map(cert => cert.id);
    const currentIndex = ids.indexOf(currentId);
    
    if (currentIndex === -1 || currentIndex === ids.length - 1) {
      return currentId; // No change if current is last or not found
    }
    
    return ids[currentIndex + 1];
  }
  
  // Helper function to find previous certificate ID
  function findPrevCertId(currentId) {
    const ids = certificationsData.map(cert => cert.id);
    const currentIndex = ids.indexOf(currentId);
    
    if (currentIndex <= 0) {
      return currentId; // No change if current is first or not found
    }
    
    return ids[currentIndex - 1];
  }
  
  // Add navigation buttons to lightbox
  function addLightboxNavigation() {
    const lightbox = document.getElementById('certLightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    
    if (!lightbox || !lightboxContent) return;
    
    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav prev-cert';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.setAttribute('aria-label', 'Previous certificate');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav next-cert';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next certificate');
    
    // Add event listeners
    prevBtn.addEventListener('click', function() {
      const currentCertId = parseInt(lightbox.getAttribute('data-current-cert-id') || '0');
      const prevId = findPrevCertId(currentCertId);
      if (prevId !== currentCertId) {
        openLightbox(prevId);
      }
    });
    
    nextBtn.addEventListener('click', function() {
      const currentCertId = parseInt(lightbox.getAttribute('data-current-cert-id') || '0');
      const nextId = findNextCertId(currentCertId);
      if (nextId !== currentCertId) {
        openLightbox(nextId);
      }
    });
    
    // Add to DOM
    lightboxContent.appendChild(prevBtn);
    lightboxContent.appendChild(nextBtn);
  }
  
  // Call function to add navigation when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    addLightboxNavigation();
  });