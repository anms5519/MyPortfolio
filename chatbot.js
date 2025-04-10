(() => {
    "use strict";
    document.addEventListener("DOMContentLoaded", () => {
        const chatbotContainer = document.getElementById("chatbot-container");
        const chatbotTrigger = document.getElementById("chatbot-trigger");
        const chatbotClose = document.getElementById("chatbot-close");
        const chatbotMinimize = document.getElementById("chatbot-minimize");
        const chatbotMessages = document.getElementById("chatbot-messages");
        const chatbotInput = document.getElementById("chatbot-input");
        const chatbotSend = document.getElementById("chatbot-send");
        const chatbotToggleSettings = document.getElementById(
            "chatbot-toggle-settings"
        );
        const chatbotSettings = document.getElementById("chatbot-settings");
        const moodButtons = document.querySelectorAll(".mood-option");
        const themeButtons = document.querySelectorAll(".theme-option");
        const suggestionChips = document.getElementById(
            "chatbot-suggestion-chips"
        );
        let chatHistory = [];
        let currentChatMood = "friendly";
        let currentTheme = "dark";
        let isTyping = false;
        let isSettingsOpen = false;
        let particles = [];
        let botMessageQueue = [];
        const maxParticles = 20;
        const logoPath = "logo.png";
        const chatbotKnowledge = {
            skills: {
                technical: [
                    "Python",
                    "C++",
                    "Java",
                    "JavaScript",
                    "C#",
                    "SQL",
                    "HTML5",
                    "CSS3",
                    "PHP",
                    "Swift",
                    "Kotlin",
                    "Dart",
                    "Go",
                    "Machine Learning",
                    "Deep Learning (PyTorch)",
                    "Generative AI (Amazon Bedrock)",
                    "Computer Vision",
                    "Image Processing",
                    "Data Visualization",
                    "Full-Stack Development",
                    "Node.js",
                    "React",
                    "Angular",
                    "Vue.js",
                    "Laravel",
                    "WordPress",
                    "REST APIs",
                    "UI/UX Design",
                    "SEO",
                    "WebGL",
                    "Firebase",
                    "Unreal Engine",
                    "Unity",
                    "Game Design Principles",
                    "3D Modeling (Basic)",
                    "Python Scripting for Games",
                    "Git",
                    "Docker",
                    "Google Cloud Platform (GCP)",
                    "AWS (Bedrock)",
                    "PostgreSQL",
                    "MySQL",
                    "MariaDB",
                    "MongoDB",
                    "Agile Methodologies",
                    "Data Structures",
                    "Algorithms",
                    "Object-Oriented Programming",
                    "Cybersecurity Fundamentals",
                    "Blockchain Principles",
                ],
                design: [
                    "UI/UX Design",
                    "Adobe Photoshop",
                    "Adobe Illustrator",
                    "Adobe Creative Suite",
                    "Figma",
                    "Web Design",
                    "Logo Design",
                    "Branding",
                    "Wireframing",
                    "Prototyping",
                    "Visual Design",
                    "User Experience Research",
                    "Digital Art & Animation",
                    "CSS Animation",
                    "Graphic Design",
                    "3D Modeling (Basic)",
                    "Color Theory",
                    "Typography",
                    "Layout Design",
                    "Brand Identity",
                    "Responsive Design",
                    "Mobile-First Design",
                    "Digital Painting",
                    "Sketching",
                ],
                soft: [
                    "Communication",
                    "Problem-solving",
                    "Team leadership",
                    "Project management",
                    "Time management",
                    "Critical thinking",
                    "Adaptability",
                    "Creativity",
                    "Collaboration",
                    "Mentoring",
                    "Emotional Intelligence",
                    "Conflict Resolution",
                    "Multicultural Communication",
                    "Technical Communication",
                    "Team Collaboration",
                    "Public Speaking",
                    "Client Interaction",
                    "Customer Service",
                ],
            },
            projects: [
                {
                    name: "Intelligent Healthcare Assistant",
                    description:
                        "AI-powered healthcare assistant that helps diagnose common ailments using deep learning algorithms",
                    technologies: [
                        "Python",
                        "TensorFlow",
                        "Flask",
                        "React",
                        "MongoDB",
                    ],
                },
                {
                    name: "Crypto Market Analyzer",
                    description:
                        "Real-time cryptocurrency market analysis tool with predictive algorithms and custom alerts",
                    technologies: [
                        "JavaScript",
                        "Node.js",
                        "Express",
                        "WebSockets",
                        "Chart.js",
                        "Blockchain APIs",
                    ],
                },
                {
                    name: "Smart Home Automation System",
                    description:
                        "IoT-based home automation system with voice control and AI-powered energy optimization",
                    technologies: [
                        "Python",
                        "Raspberry Pi",
                        "MQTT",
                        "React",
                        "Node.js",
                        "TensorFlow",
                    ],
                },
                {
                    name: "3D Game Engine",
                    description:
                        "Custom game engine with physics simulation and realistic rendering capabilities",
                    technologies: [
                        "C++",
                        "OpenGL",
                        "GLSL",
                        "ImGui",
                        "Bullet Physics",
                    ],
                },
                {
                    name: "Augmented Reality Portfolio",
                    description:
                        "Interactive AR portfolio showcasing projects through immersive 3D experiences",
                    technologies: [
                        "Unity",
                        "ARKit",
                        "ARCore",
                        "C#",
                        "3D Modeling",
                    ],
                },
                {
                    name: "THETAEnhancer+",
                    description:
                        "Advanced AI-driven image restoration and enhancement model for superior image quality",
                    technologies: ["Python", "Deep Learning", "AI Algorithms"],
                },
                {
                    name: "Interactive 3D/FPS Game",
                    description:
                        "Immersive 3D/FPS game developed using Unreal Engine and Python",
                    technologies: ["Unreal Engine", "Python", "Game Design"],
                },
                {
                    name: "Dynamic Web Interfaces",
                    description:
                        "Ultra-advanced CSS styles and animations creating engaging web experiences",
                    technologies: [
                        "HTML",
                        "CSS",
                        "JavaScript",
                        "Advanced CSS Animations",
                    ],
                },
                {
                    name: "AI-Powered Data Visualizer",
                    description:
                        "Interactive platform for data visualization enriched with AI insights",
                    technologies: ["Python", "Power BI", "Data Analytics"],
                },
                {
                    name: "3D Virtual Tour",
                    description:
                        "Fully immersive virtual tour built with Three.js and WebGL for an engaging experience",
                    technologies: ["Three.js", "WebGL", "3D Modeling"],
                },
                {
                    name: "Real-Time Multiplayer Game",
                    description:
                        "Online game featuring advanced animations, responsive controls, and real-time interactivity",
                    technologies: [
                        "JavaScript",
                        "WebSockets",
                        "Game Development",
                    ],
                },
                {
                    name: "Quantum Code Simulator",
                    description:
                        "Real-time simulation and visualization of quantum computing algorithms",
                    technologies: ["JavaScript", "Visualization Libraries"],
                },
                {
                    name: "Blockchain Secure Voting",
                    description:
                        "Decentralized voting system ensuring security via blockchain technology",
                    technologies: ["Blockchain", "Smart Contracts"],
                },
                {
                    name: "AI-Powered Cyber Defense",
                    description:
                        "Real-time threat detection and prevention system using machine learning techniques",
                    technologies: [
                        "Python",
                        "Machine Learning",
                        "Cybersecurity",
                    ],
                },
            ],
            education: [
                {
                    degree:
                        "Bachelor of Science in Computer Science & Engineering",
                    school:
                        "Atish Dipankar University of Science & Technology, Dhaka",
                    period: "Jan 2022 – Aug 2026",
                    additional: "Current CGPA: 3.56/4.00",
                },
                {
                    degree: "Higher Secondary School Certificate",
                    school: "Adamjee Cantonment College, Dhaka",
                    period: "2020",
                    additional: "GPA: 5.00/5.00, Faculty: Science",
                },
                {
                    degree: "Secondary School Certificate",
                    school: "Civil Aviation School & College, Dhaka",
                    period: "2018",
                    additional: "GPA: 5.00/5.00, Faculty: Science",
                },
            ],
            certifications: [
                "HHP (Mobile) Service For Hardware and Software (2024-01)",
                "Mobile Game Development (Cross Platform) (2022-02)",
                "Beginner's Guide to Python 3 Programming (2023-02)",
                "Professional C Programming for Job Interview (2023-06)",
                "EF SET Certificate (2025-02)",
                "CSS (Basic) Certificate (2025-01)",
                "CHAT — Toolkit to Improve Community Engagement in Emergencies (2025-01)",
                "Cybersecurity Analyst Job Simulation (2024-04)",
                "Data Visualization: Empowering Business with Effective Insights (2024-04)",
                "A2Z Of Finance: Finance Beginner Course (2024-04)",
                "Building Generative AI Applications Using Amazon Bedrock (June 9, 2024)",
                "SDG Primer Certificate (Monitoring & Evaluation Analyst at UNDP Bangladesh, 7th September 2024)",
                "Google Cloud Professional Machine Learning Engineer (2022)",
                "AWS Certified Solutions Architect (2021)",
                "TensorFlow Developer Certificate (2020)",
            ],
            experience: [
                {
                    role: "WordPress Design & Developer Intern",
                    company: "Akbor Skills Development Limited, Dhaka",
                    period: "Mar 2024 – Present",
                    responsibilities: [
                        "Developed 5 responsive WordPress websites, reducing page load time by 40% through custom theme optimization, achieving a 95% client satisfaction rate",
                        "Implemented modern UI/UX principles to enhance user engagement and usability",
                        "Customized themes and developed plugins to extend WordPress functionality",
                        "Performed website performance optimization and basic SEO implementation",
                    ],
                    technologies: [
                        "WordPress",
                        "PHP",
                        "HTML",
                        "CSS",
                        "JavaScript",
                        "Web Design Tools",
                    ],
                },
                {
                    role: "Freelance Commercial Designer",
                    company: "Fiverr Platform, Remote",
                    period: "Jan 2020 – Present",
                    responsibilities: [
                        "Delivered 200+ branding projects for clients across 15 countries, achieving a 4.9/5.0 average rating and maintaining an 80% client retention rate",
                        "Created 150+ unique brand assets (logos, brochures, social media kits) using Adobe Creative Suite, contributing to an average 25% increase in client conversion rates",
                        "Developed compelling UI/UX mockups for web and mobile applications, reducing client revision requests by 40%",
                        "Consistently received 5-star feedback for communication, creativity, and timely delivery",
                    ],
                    technologies: [
                        "Adobe Creative Suite",
                        "Photoshop",
                        "Illustrator",
                        "UI/UX Design",
                        "Brand Design",
                        "Logo Design",
                    ],
                },
                {
                    role: "Data Visualization Specialist (Job Simulation)",
                    company: "Tata Consultancy Services (via Forage), Remote",
                    period: "Jun 2024 – Jul 2024",
                    responsibilities: [
                        "Developed 3 interactive Power BI dashboards analyzing 50,000+ customer records, reducing report generation time by 75% and improving data accessibility across 5 departments",
                        "Employed Python (Pandas) and Excel for data cleaning, transformation, and preparation",
                        "Applied statistical analysis and data storytelling techniques to present actionable insights",
                    ],
                    technologies: [
                        "Power BI",
                        "Python",
                        "Excel",
                        "Data Visualization",
                        "Data Analysis",
                    ],
                },
                {
                    role: "Cybersecurity Analyst (Job Simulation)",
                    company: "Tata Consultancy Services (via Forage), Remote",
                    period: "Apr 2024 – May 2024",
                    responsibilities: [
                        "Identified 15 critical vulnerabilities using simulated penetration testing tools and techniques",
                        "Proposed and documented remediation strategies, including firewall rule adjustments and access control enhancements, contributing to a simulated 40% reduction in security incidents",
                        "Conducted risk assessments to improve the simulated network security posture",
                    ],
                    technologies: [
                        "Penetration Testing",
                        "Risk Assessment",
                        "Network Security",
                        "Cybersecurity Tools",
                    ],
                },
            ],
            trainingsWorkshops: [
                "Undergraduates Projects for CSE Students: A Comprehensive Guideline",
                "Workshop on Beginner's Guide to Python 3 Programming",
                "Machine Learning and AI Workshop",
                "Web Development Bootcamp",
                "Arduino Programming and Applications Workshop",
                "Workshop on Professional C Programming for Job Interview",
                "AR/VR Workshop",
                "Software Testing and Quality Assurance Conference",
                "DevOps and CI/CD Conference",
                "Game Development Using Unity Webinar",
                "Cybersecurity and Ethical Hacking Workshop",
                "Mobile App Development Seminar",
                "Blockchain and Cryptocurrency Workshop",
                "IoT Workshop",
                "Data Science and Analytics Workshop",
                "Cloud Computing Workshop",
                "Dive Into R: A Hands-on Programming Workshop",
                "SQA Webinar",
            ],
            extracurricular: {
                leadershipVolunteering: [
                    "President, Adamjee Eco Amica Club (2019 – 2020)",
                    "Graphics Designer, Leo Club of Dhaka Mega City (2022 – 2023)",
                    "Treasurer, Vantage IT Limited, Uttara (2022 – 2023)",
                    "Event Coordinator, BD Clean, Dhaka (2021 – 2022)",
                    "Graphics Designer, ADUST Prothom Alo Bandhu Sabha (2023 – 2024)",
                    "Member, ADUST Shomokal Shuhud (2024 – 2025)",
                    "Member, Bangabandhu Parishad, Tejgaon (Ongoing)",
                    "General Secretary, Social Environment and Human Rights, Implementation Agency, Mohakhali (2023 – 2024)",
                ],
                techCreative: [
                    "Organizer, ACC Coding Club",
                    "Member, ADUST Programming Club",
                    "Member, ACC Photography Club",
                    "Mentor, ACC Cultural Club",
                ],
                sports: [
                    "Sporting Director, ADUST Football Club",
                    "Active Member, Badminton Team",
                ],
            },
            interests: [
                "Programming",
                "Artificial Intelligence",
                "Web Development",
                "Cybersecurity",
                "Data Science",
                "Cloud Computing",
                "Game Development",
                "Robotics",
                "Blockchain",
                "Mobile App Development",
                "Character Design",
                "Animation",
                "Digital Painting",
                "Sketching",
                "Photography",
                "Traveling",
                "Reading",
                "Writing",
                "Music",
                "Sports",
                "Board Games",
                "Cooking",
                "Gardening",
            ],
            languages: [
                { language: "Bengali", proficiency: "Native" },
                { language: "English", proficiency: "Fluent (C1 Advanced)" },
                { language: "Hindi", proficiency: "Conversational" },
                { language: "Urdu", proficiency: "Conversational" },
                { language: "Arabic", proficiency: "Basic" },
            ],
            personalInfo: {
                name: "Kholipha",
                fullName: "Kholipha Ahmmad Al-Amin",
                dateOfBirth: "2002-07-26", 
                gender: "Male",
                religion: "Islam",
                maritalStatus: "Single",
                profession: "Student",
                location: "Dhaka, Bangladesh",
                permanentAddress:
                    "1676 Boro Keshabpur, Kadirpur, Shibchar, Munshi Kadirpur - 7930, Madaripur, Bangladesh",
                presentAddress:
                    "176 West Arjatpara, Tejgaon, Tejgaon - 1215, Dhaka, Bangladesh",
                phone: "+8801320389539",
                alternatePhone: "+8801749103303",
                email: "kholifaahmadalamin@gmail.com",
                website: "https://kholipha-portfolio.netlify.app",
                passportDetails: {
                    type: "P (Ordinary)",
                    countryCode: "BGD",
                    number: "A08677968",
                    pages: "48 pages",
                    duration: "10 Years",
                    issueDate: "2024-10-20",
                    expiryDate: "2034-10-19",
                    issuingAuthority: "DIP/DHAKA",
                    passportOffice: "AGARGAON",
                    deliveryType: "REGULAR",
                    onlineRegID: "OID1023918907",
                },
                parentalInfo: {
                    fatherName: "MD Akman Hossain",
                    fatherNationalID: "1014311318",
                    fatherProfession: "Pharmacist",
                    fatherNationality: "Bangladeshi",
                    motherName: "Rohana Akter Rani",
                    motherNationalID: "8228625219",
                    motherProfession: "Pharmacist",
                    motherNationality: "Bangladeshi",
                },
                emergencyContact: {
                    name: "Rohana Akter Rani",
                    relationship: "Mother",
                    address:
                        "176 West Arjatpara, Tejgaon, Tejgaon - 1215, Dhaka, Bangladesh",
                    telephone: "+8801749103303",
                },
                socialLinks: {
                    github: "https://github.com/anms5519",
                    linkedin:
                        "https://www.linkedin.com/in/kholipha-ahmmad-al-amin-3856b1305",
                    facebook: "https://facebook.com/kholipha.ahmmad",
                    instagram: "https://instagram.com/kholipha.ahmmad",
                    twitter: "https://twitter.com/kholipha_ahmmad",
                    youtube: "https://youtube.com/@kholiphaahmmad",
                    tiktok: "https://tiktok.com/@kholipha.ahmmad",
                    snapchat: "https://snapchat.com/add/kholipha.ahmmad",
                    pinterest: "https://pinterest.com/kholiphaahmmad",
                    behance: "https://behance.net/kholiphaahmmad",
                    dribbble: "https://dribbble.com/kholiphaahmmad",
                    medium: "https://medium.com/@kholifaahmadalamin",
                    dev: "https://dev.to/kholiphaahmmad",
                    stackoverflow:
                        "https://stackoverflow.com/users/kholiphaahmmad",
                    quora: "https://quora.com/profile/Kholipha-Ahmmad",
                    reddit: "https://reddit.com/user/kholiphaahmmad",
                    telegram: "https://t.me/kholiphaahmmad",
                    whatsapp: "https://wa.me/8801320389539",
                    discord: "kholiphaahmmad#0001",
                    skype: "kholipha.ahmmad",
                    spotify: "https://open.spotify.com/user/kholiphaahmmad",
                    soundcloud: "https://soundcloud.com/kholiphaahmmad",
                    fiverr: "https://fiverr.com/kholiphaahmmad",
                    upwork: "https://upwork.com/freelancers/kholiphaahmmad",
                    freelancer: "https://freelancer.com/u/kholiphaahmmad",
                    kaggle: "https://kaggle.com/kholiphaahmmad",
                    hackerrank: "https://hackerrank.com/kholifaahmadalamin",
                    leetcode: "https://leetcode.com/kholiphaahmmad",
                    codepen: "https://codepen.io/kholiphaahmmad",
                    tumblr: "https://kholiphaahmmad.tumblr.com",
                    vimeo: "https://vimeo.com/kholiphaahmmad",
                },
                hobbies: [
                    "Photography",
                    "Hiking",
                    "Playing guitar",
                    "Reading sci-fi novels",
                    "Machine learning research",
                    "Game development",
                    "Travel",
                    "Digital Painting",
                    "Sketching",
                ],
                favoriteBooks: [
                    "The Innovators by Walter Isaacson",
                    "Sapiens by Yuval Noah Harari",
                    "Dune by Frank Herbert",
                    "Neuromancer by William Gibson",
                ],
                favoriteMovies: [
                    "Inception",
                    "Interstellar",
                    "The Social Network",
                    "The Matrix",
                    "Her",
                ],
                favoriteTechTools: [
                    "PyTorch",
                    "React",
                    "VS Code",
                    "Figma",
                    "Docker",
                    "Adobe Photoshop",
                ],
                funFacts: [
                    "I once built a robot that could solve a Rubik's cube in under 30 seconds",
                    "I've visited 23 countries across 5 continents",
                    "I maintain a photography blog with over 100,000 followers",
                    "I can play 5 different musical instruments",
                    "I won a hackathon by building an app in 48 hours straight without sleep",
                    "I'm a certified scuba diver and have explored several shipwrecks",
                    "I helped develop an open-source library that's now used by thousands of developers",
                ],
                goals: [
                    "Start a tech company focused on AI for healthcare",
                    "Publish research papers in top AI conferences",
                    "Develop a popular open-source framework",
                    "Mentor 100 young developers from underrepresented backgrounds",
                ],
                values: [
                    "Innovation",
                    "Continuous learning",
                    "Ethical development",
                    "Collaboration",
                    "Diversity",
                ],
                pets: {
                    name: "Data",
                    type: "Cat",
                    breed: "Russian Blue",
                    age: 3,
                    personality:
                        "Curious and playful, loves sitting on keyboards during coding sessions",
                },
                workSummary:
                    "Dynamic and visionary IT professional with a solid foundation in computer science and a proven track record in harnessing artificial intelligence to redefine digital experiences. Adept at spearheading advanced image enhancement projects, immersive 3D/FPS game development with Unreal Engine and Python, and cutting-edge web solutions driven by ultra-modern UI/UX design. Recognized for delivering innovative projects—from AI-powered image restoration and blockchain-secure voting systems to real-time data visualizations—that merge creativity with technical excellence.",
                disclaimer:
                    "I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.",
            },
            faqs: [
                {
                    question: "What do you do?",
                    answer:
                        "I'm a full-stack developer and AI specialist with expertise in machine learning, image enhancement, and web development. I'm passionate about creating innovative solutions using cutting-edge technologies.",
                },
                {
                    question: "How can I contact you?",
                    answer:
                        "You can reach me through the contact form on this website, or via any of my social media profiles. I'm most active on LinkedIn and GitHub for professional inquiries.",
                },
                {
                    question: "What are your most impressive projects?",
                    answer:
                        "Some of my most notable projects include THETAEnhancer+ (AI-driven image enhancement), Interactive 3D/FPS Game (Unreal Engine), and several AI-powered web applications. You can find details about all my projects in the Projects section.",
                },
                {
                    question: "Are you available for freelance work?",
                    answer:
                        "Yes, I'm available for freelance projects, especially those involving AI development, web applications, or 3D/game development. Feel free to contact me with your requirements!",
                },
                {
                    question: "What programming languages do you know?",
                    answer:
                        "I'm proficient in Python, JavaScript, C/C++, HTML/CSS, and SQL. I also have experience with various frameworks like React, Node.js, TensorFlow, and Django.",
                },
            ],
            conversationalPhrases: {
                greetings: [
                    "Hey there! What's up?",
                    "Hi friend! Great to see you!",
                    "Hello there! How's your day going?",
                    "Hey! Ready to chat about some cool tech?",
                    "What's happening? How can I help today?",
                    "Hi! Awesome to connect with you!",
                    "Hey you! What brings you here today?",
                    "Hello hello! How's everything going?",
                ],
                transitions: [
                    "So anyway, about that...",
                    "Oh, before I forget to mention...",
                    "That reminds me of something interesting...",
                    "Speaking of which...",
                    "Not to change the subject, but...",
                    "This is kinda related, actually...",
                    "You know what else is cool?",
                    "Oh! I just remembered something you might like...",
                ],
                enthusiasm: [
                    "I'm seriously obsessed with this project!",
                    "This tech absolutely blows my mind!",
                    "I couldn't be more excited about this!",
                    "You have no idea how awesome this is!",
                    "I literally stayed up all night working on this!",
                    "This is probably the coolest thing I've ever built!",
                    "I'm completely in love with how this turned out!",
                    "You're going to be amazed by this, trust me!",
                ],
                thinking: [
                    "Hmm, let me think about that for a sec...",
                    "That's an interesting question, actually...",
                    "Let me see if I can remember correctly...",
                    "Oh, I need to think about how to explain this best...",
                    "Hmm, how should I put this...",
                    "Let me gather my thoughts on that...",
                    "That's a good question, gimme a moment...",
                    "I'm just collecting my thoughts here...",
                ],
                fillers: [
                    "y'know?",
                    "like",
                    "basically",
                    "literally",
                    "honestly",
                    "I mean",
                    "actually",
                    "so yeah",
                    "right?",
                    "if that makes sense",
                    "know what I mean?",
                    "believe it or not",
                ],
                wordReflection: [
                    "I noticed you mentioned *word*. Let me tell you about that.",
                    "You said *word*, which is interesting because...",
                    "Ah, *word* is something I'm quite familiar with!",
                    "When you say *word*, I immediately think of...",
                    "It's fascinating you brought up *word*. Let me share some thoughts on that.",
                    "*word* is definitely worth discussing! Here's what I know:",
                    "I'm glad you asked about *word*. That's an important topic.",
                    "You're interested in *word*? That's one of my favorite subjects!",
                    "Regarding *word* that you mentioned...",
                    "Let's explore what you said about *word* a bit more.",
                ],
                morningGreetings: [
                    "Good morning! Ready to conquer the day?",
                    "Morning! The day is full of possibilities.",
                    "Rise and shine! Good morning!",
                    "Good morning! Hope you've had your coffee already!",
                    "It's a beautiful morning! What's on your mind?",
                ],
                afternoonGreetings: [
                    "Good afternoon! How's your day going?",
                    "Afternoon! Ready for some productive chat?",
                    "Hope you're having a fantastic afternoon!",
                    "Afternoon! Still plenty of day left to accomplish great things.",
                    "Good afternoon! Need a mid-day brain boost?",
                ],
                eveningGreetings: [
                    "Good evening! Winding down or just getting started?",
                    "Evening! Hope you had a productive day.",
                    "Good evening!",
                    "Evening! Perfect time for some thoughtful conversation.",
                    "How's your evening going? Ready to chat?",
                ],
                nightGreetings: [
                    "Working late? I'm here to help!",
                    "Night owl mode activated! It's not good to stay awake at night.",
                    "It's getting late, but I'm still energized to chat with you!",
                    "Burning the midnight oil? Let's be productive together.",
                    "The quiet night is perfect for focused work. What's on your mind?",
                ],
                defaultSuggestions: [
                    "Tell me about your skills",
                    "What projects have you worked on?",
                    "What's your educational background?",
                    "Tell me about your work experience",
                    "What are your technical strengths?",
                ],
            },
            defaultSuggestions: [
                "Tell me about your skills",
                "What projects have you worked on?",
                "What is your work experience?",
                "What technologies do you use?",
                "What education do you have?",
            ],
        };
        const createParticles = () => {
            if (particles.length > maxParticles) {
                const excessCount = particles.length - maxParticles;
                for (let i = 0; i < excessCount; i++) {
                    if (particles[i] && particles[i].parentNode) {
                        particles[i].parentNode.removeChild(particles[i]);
                    }
                }
                particles = particles.slice(excessCount);
            }
            const newParticleCount = Math.min(
                3,
                maxParticles - particles.length
            );
            for (let i = 0; i < newParticleCount; i++) {
                createParticle();
            }
        };
        const createParticle = () => {
            const particle = document.createElement("div");
            particle.className = "chatbot-particle";
            const size = Math.floor(Math.random() * 6) + 4;
            const left = Math.floor(Math.random() * 100);
            const top = Math.floor(Math.random() * 100);
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            const opacity = Math.random() * 0.6 + 0.2;
            particle.style.opacity = opacity;
            chatbotContainer.appendChild(particle);
            particles.push(particle);
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                    particles = particles.filter((p) => p !== particle);
                }
            }, (duration + delay) * 1000);
        };
        const highlightKeywordsInUserMessage = (message, keywords) => {
            if (!keywords || !keywords.length) return message;
            let highlightedMessage = message;
            keywords.forEach((keyword) => {
                const regex = new RegExp(`(${keyword})`, "gi");
                highlightedMessage = highlightedMessage.replace(
                    regex,
                    '<span class="highlighted-keyword">$1</span>'
                );
            });
            return highlightedMessage;
        };
        const animateBotMessage = (element) => {
            element.classList.add("animate-message");
            element.addEventListener("mouseenter", () => {
                element.style.boxShadow = "0 5px 20px rgba(102, 0, 255, 0.3)";
                element.style.transform = "translateY(-3px)";
            });
            element.addEventListener("mouseleave", () => {
                element.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
                element.style.transform = "translateY(0)";
            });
            if (Math.random() > 0.7) {
                const particleCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < particleCount; i++) {
                    const particleElem = document.createElement("div");
                    particleElem.className = "message-particle";
                    particleElem.style.width = Math.random() * 5 + 3 + "px";
                    particleElem.style.height = Math.random() * 5 + 3 + "px";
                    particleElem.style.backgroundColor =
                        "rgba(102, 0, 255, 0.4)";
                    particleElem.style.borderRadius = "50%";
                    particleElem.style.position = "absolute";
                    particleElem.style.top = Math.random() * 80 + "%";
                    particleElem.style.left = Math.random() * 80 + "%";
                    particleElem.style.animation = `float ${
                        Math.random() * 3 + 2
                    }s infinite alternate ease-in-out`;
                    element.appendChild(particleElem);
                }
            }
        };
        const formatMarkdown = (text) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/`(.*?)`/g, "<code>$1</code>")
                .replace(/\n/g, "<br>");
        };
        const generateResponse = (input) => {
            const normalizedInput = input.toLowerCase();
            let detectedKeywords = [];
            const currentHour = new Date().getHours();
            const timeOfDay =
                currentHour >= 4 && currentHour < 6
                    ? "pre-dawn"
                    : currentHour >= 6 && currentHour < 8
                    ? "early morning"
                    : currentHour >= 8 && currentHour < 10
                    ? "mid-morning"
                    : currentHour >= 10 && currentHour < 12
                    ? "late morning"
                    : currentHour >= 12 && currentHour < 14
                    ? "early afternoon"
                    : currentHour >= 14 && currentHour < 16
                    ? "mid-afternoon"
                    : currentHour >= 16 && currentHour < 18
                    ? "late afternoon"
                    : currentHour >= 18 && currentHour < 19.5
                    ? "early evening"
                    : currentHour >= 19.5 && currentHour < 21
                    ? "evening"
                    : currentHour >= 21 && currentHour < 23
                    ? "late evening"
                    : currentHour >= 23 || currentHour < 4
                    ? "night"
                    : "day";
            if (
                normalizedInput.includes("hello") ||
                normalizedInput.includes("hi") ||
                normalizedInput.includes("hey") ||
                normalizedInput.includes("greetings") ||
                normalizedInput.includes("hola") ||
                normalizedInput.includes("namaste") ||
                normalizedInput.includes("good morning") ||
                normalizedInput.includes("good afternoon") ||
                normalizedInput.includes("good evening") ||
                normalizedInput.includes("good night") ||
                normalizedInput.match(/^(yes|no|sure|okay|ok|yep|nope)$/)
            ) {
                detectedKeywords = [
                    "hello",
                    "hi",
                    "hey",
                    "greetings",
                    "hola",
                    "namaste",
                    "good morning",
                    "good afternoon",
                    "good evening",
                    "good night",
                    "yes",
                    "no",
                    "sure",
                    "okay",
                    "ok",
                    "yep",
                    "nope",
                ].filter((word) => normalizedInput.includes(word));
                if (
                    normalizedInput.includes("morning") ||
                    normalizedInput.includes("afternoon") ||
                    normalizedInput.includes("evening") ||
                    normalizedInput.includes("night")
                ) {
                    return {
                        response: getTimeAwareGreeting(
                            normalizedInput,
                            timeOfDay
                        ),
                        keywords: detectedKeywords,
                    };
                }
                return {
                    response: getPersonalizedGreeting(timeOfDay),
                    keywords: detectedKeywords,
                };
            }
            if (
                normalizedInput.includes("thank") ||
                normalizedInput.includes("thanks") ||
                normalizedInput.includes("appreciate") ||
                normalizedInput.includes("grateful")
            ) {
                detectedKeywords = [
                    "thank",
                    "thanks",
                    "appreciate",
                    "grateful",
                ].filter((word) => normalizedInput.includes(word));
                const thankResponses = [
                    "You're very welcome! I'm here anytime you need assistance or just want to chat.",
                    "My pleasure! Is there anything else I can help with?",
                    "Happy to be of service! Let me know if you need anything else.",
                    "Glad I could help! Feel free to ask me anything else you're curious about.",
                    "No problem at all! I'm always here to chat about anything you'd like to know.",
                ];
                return {
                    response:
                        thankResponses[
                            Math.floor(Math.random() * thankResponses.length)
                        ],
                    keywords: detectedKeywords,
                };
            }
            if (
                normalizedInput.includes("bye") ||
                normalizedInput.includes("tata") ||
                normalizedInput.includes("goodbye") ||
                normalizedInput.includes("see you") ||
                normalizedInput.includes("talk later") ||
                normalizedInput.includes("got to go") ||
                normalizedInput.includes("gotta go") ||
                normalizedInput.includes("farewell")
            ) {
                detectedKeywords = [
                    "bye",
                    "tata",
                    "goodbye",
                    "see you",
                    "talk later",
                    "got to go",
                    "gotta go",
                    "farewell",
                ].filter((word) => normalizedInput.includes(word));
                const farewellResponses = [
                    `Thanks for chatting! Wishing you a wonderful ${timeOfDay}. Feel free to come back anytime!`,
                    "It was great talking with you! I'll be here whenever you want to chat again.",
                    "Until next time! Have a fantastic day ahead.",
                    "Farewell for now! Looking forward to our next conversation.",
                    "Goodbye! I'll be here whenever you want to continue our chat.",
                ];
                return {
                    response:
                        farewellResponses[
                            Math.floor(Math.random() * farewellResponses.length)
                        ],
                    keywords: detectedKeywords,
                };
            }
            const reflectionResponse = getWordReflectionResponse(input);
            if (reflectionResponse) {
                return reflectionResponse;
            }
            if (
                normalizedInput.includes("skill") ||
                normalizedInput.includes("tech") ||
                normalizedInput.includes("know") ||
                normalizedInput.includes("ability")
            ) {
                detectedKeywords = [
                    "skill",
                    "tech",
                    "know",
                    "ability",
                ].filter((word) => normalizedInput.includes(word));
                const skillsResponse = getSkillsResponse(normalizedInput);
                if (skillsResponse)
                    return {
                        response: skillsResponse,
                        keywords: detectedKeywords,
                    };
            }
            if (
                normalizedInput.includes("about you") ||
                normalizedInput.includes("yourself") ||
                normalizedInput.includes("personal") ||
                normalizedInput.includes("hobby") ||
                normalizedInput.includes("hobbies") ||
                normalizedInput.includes("favorite") ||
                normalizedInput.includes("age") ||
                normalizedInput.includes("live") ||
                normalizedInput.includes("location") ||
                normalizedInput.includes("pet") ||
                normalizedInput.includes("fun fact") ||
                normalizedInput.includes("language")
            ) {
                detectedKeywords = [
                    "about you",
                    "yourself",
                    "personal",
                    "hobby",
                    "hobbies",
                    "favorite",
                    "age",
                    "live",
                    "location",
                    "pet",
                    "fun fact",
                    "language",
                ].filter((word) => normalizedInput.includes(word));
                return {
                    response: getPersonalInfoResponse(normalizedInput),
                    keywords: detectedKeywords,
                };
            }
            if (
                normalizedInput.includes("project") ||
                normalizedInput.includes("portfolio") ||
                normalizedInput.includes("work") ||
                normalizedInput.includes("built")
            ) {
                detectedKeywords = [
                    "project",
                    "portfolio",
                    "work",
                    "built",
                ].filter((word) => normalizedInput.includes(word));
                const projectResponse = getProjectResponse(normalizedInput);
                if (projectResponse)
                    return {
                        response: projectResponse,
                        keywords: detectedKeywords,
                    };
            }
            if (
                normalizedInput.includes("education") ||
                normalizedInput.includes("degree") ||
                normalizedInput.includes("study") ||
                normalizedInput.includes("learn") ||
                normalizedInput.includes("certification") ||
                normalizedInput.includes("university") ||
                normalizedInput.includes("school") ||
                normalizedInput.includes("college") ||
                normalizedInput.includes("ssc") ||
                normalizedInput.includes("hsc") ||
                normalizedInput.includes("graduate") ||
                normalizedInput.includes("academic")
            ) {
                detectedKeywords = [
                    "education",
                    "degree",
                    "study",
                    "learn",
                    "certification",
                    "university",
                    "school",
                    "college",
                    "ssc",
                    "hsc",
                    "graduate",
                    "academic",
                ].filter((word) => normalizedInput.includes(word));
                const educationResponse = getEducationResponse(input);
                if (educationResponse)
                    return {
                        response: educationResponse,
                        keywords: detectedKeywords,
                    };
            }
            if (
                normalizedInput.includes("experience") ||
                normalizedInput.includes("job") ||
                normalizedInput.includes("work") ||
                normalizedInput.includes("career") ||
                normalizedInput.includes("company") ||
                normalizedInput.includes("internship") ||
                normalizedInput.includes("freelance") ||
                normalizedInput.includes("fiverr") ||
                normalizedInput.includes("upwork") ||
                normalizedInput.includes("leadership") ||
                normalizedInput.includes("professional") ||
                normalizedInput.includes("president") ||
                normalizedInput.includes("volunteering") ||
                normalizedInput.includes("akbor")
            ) {
                detectedKeywords = [
                    "experience",
                    "job",
                    "work",
                    "career",
                    "company",
                    "internship",
                    "freelance",
                    "fiverr",
                    "upwork",
                    "leadership",
                    "professional",
                    "president",
                    "volunteering",
                    "akbor",
                ].filter((word) => normalizedInput.includes(word));
                const experienceResponse = getExperienceResponse(input);
                if (experienceResponse)
                    return {
                        response: experienceResponse,
                        keywords: detectedKeywords,
                    };
            }
            const faqs = chatbotKnowledge.faqs || [];
            for (const faq of faqs) {
                if (!faq || !faq.question) continue;
                const questionWords = faq.question.toLowerCase().split(" ");
                const matchCount = questionWords.filter((word) =>
                    normalizedInput.includes(word)
                ).length;
                if (
                    matchCount >= 2 ||
                    normalizedInput.includes(faq.question.toLowerCase())
                ) {
                    detectedKeywords = questionWords.filter(
                        (word) =>
                            word.length > 3 && normalizedInput.includes(word)
                    );
                    return { response: faq.answer, keywords: detectedKeywords };
                }
            }
            const words = input
                .split(" ")
                .filter((word) => word.length > 4)
                .filter(
                    (word) =>
                        ![
                            "about",
                            "what",
                            "where",
                            "when",
                            "which",
                            "there",
                            "their",
                            "would",
                            "should",
                            "could",
                        ].includes(word.toLowerCase())
                );
            if (words.length > 0) {
                const randomWord = getRandomItem(words);
                const reflectionTemplate = getRandomPhrase("wordReflection");
                detectedKeywords = [randomWord];
                return {
                    response: reflectionTemplate.replace("*word*", randomWord),
                    keywords: detectedKeywords,
                };
            }
            return {
                response:
                    "I'm not sure I understand. Could you rephrase your question? You can ask me about skills, projects, education, or work experience.",
                keywords: [],
            };
        };
        const getPersonalizedGreeting = (timeOfDay = null) => {
            const defaultGreetings = [
                "👋 Hey there! I'm Kholipha Ahmmad. How can I help you today?",
                "Welcome to my digital space! I'm Kholipha Al-Amin. What would you like to know about me or my work?",
                "Thanks for stopping by! I'm Kholipha, ready to chat about my projects, skills, or anything you'd like to know.",
                "Hello! I'm Kholipha Ahmmad. Feel free to ask me anything about my work or experience.",
                "Great to see you here! I'm Kholipha Al-Amin. What can I tell you about my education or projects?",
            ];
            if (!timeOfDay) {
                return getRandomItem(defaultGreetings);
            }
            const timeBasedGreetings = {
                "pre-dawn": [
                    "You're up early! I'm Kholipha Ahmmad. The pre-dawn hours are perfect for focused conversation.",
                    "Welcome to the mystical pre-dawn hour! I'm Kholipha Al-Amin. How can I assist you today?",
                    "Good pre-dawn! This quiet time between 4-5AM is special. I'm Kholipha, ready to help with anything.",
                ],
                "early morning": [
                    "Good morning! I'm Kholipha Ahmmad. The day is just beginning. What can I help you with?",
                    "A fresh early morning welcome to you! I'm Kholipha Al-Amin. What would you like to explore today?",
                    "Morning greetings! As the sun begins to warm the earth, I'm here to assist you with anything you need.",
                ],
                "mid-morning": [
                    "Good mid-morning! I'm Kholipha Ahmmad. The day is in full bloom - just like our conversation can be!",
                    "Mid-morning greetings! I'm Kholipha Al-Amin. The world is bustling with energy, and I'm ready to help.",
                    "Hello there! Mid-morning is a time of great productivity. I'm Kholipha - what would you like to know?",
                ],
                "late morning": [
                    "Late morning greetings! I'm Kholipha Ahmmad. As we approach midday, how can I assist you?",
                    "Welcome! It's that vibrant late morning time. I'm Kholipha Al-Amin, ready to chat about anything.",
                    "Hello! As the morning transitions toward noon, I'm here to help with any questions you might have.",
                ],
                "early afternoon": [
                    "Good afternoon! I'm Kholipha Ahmmad. Perfect time to digest both lunch and information. How can I help?",
                    "Afternoon greetings! I'm Kholipha Al-Amin. What would you like to know during this productive time?",
                    "Hello there! Early afternoon is great for thoughtful conversations. What's on your mind today?",
                ],
                "mid-afternoon": [
                    "Mid-afternoon greetings! I'm Kholipha Ahmmad. The day is flowing with purpose - just like our chat can.",
                    "Hello! I'm Kholipha Al-Amin. Mid-afternoon is perfect for creative thinking. What shall we discuss?",
                    "Good afternoon! This steady, purposeful time of day is ideal for exploration. What would you like to know?",
                ],
                "late afternoon": [
                    "Late afternoon hello! I'm Kholipha Ahmmad. As the day softens, what can I help you discover?",
                    "Greetings! I'm Kholipha Al-Amin. The light is getting golden - a perfect time for thoughtful conversation.",
                    "Welcome! As afternoon winds down, it's a great moment for reflection. What would you like to explore?",
                ],
                "early evening": [
                    "Good evening! I'm Kholipha Ahmmad. As work transforms into relaxation, what can I help with?",
                    "Early evening greetings! I'm Kholipha Al-Amin. A perfect time for meaningful conversation.",
                    "Hello there! As the day transitions to evening, I'm here to assist with anything you need.",
                ],
                evening: [
                    "Evening greetings! I'm Kholipha Ahmmad. This time of connection and contemplation is perfect for our chat.",
                    "Good evening! I'm Kholipha Al-Amin. As the world slows down, what would you like to know?",
                    "Welcome to the evening! When the day softens into dusk, it's ideal for deeper conversations. How can I help?",
                ],
                "late evening": [
                    "Late evening hello! I'm Kholipha Ahmmad. As night settles in, what can I help you with?",
                    "Greetings at this quiet hour! I'm Kholipha Al-Amin. Late evening is perfect for thoughtful exchanges.",
                    "Welcome! As we bridge to the quiet of night, I'm here to assist with anything you'd like to know.",
                ],
                night: [
                    "Good night-time! I'm Kholipha Ahmmad. Even at this late hour, I'm here to help with anything you need.",
                    "Night greetings! I'm Kholipha Al-Amin. The stillness of night can bring clarity to our conversations.",
                    "Welcome to the night hours! When the world sleeps and dreams whisper, I'm here to assist you.",
                ],
            };
            const greetingsForTimeOfDay =
                timeBasedGreetings[timeOfDay] || defaultGreetings;
            return getRandomItem(greetingsForTimeOfDay);
        };
        const getTimeAwareGreeting = (input, actualTimeOfDay) => {
            const normalizedInput = input.toLowerCase();
            let mentionedTime = null;
            if (normalizedInput.includes("morning")) mentionedTime = "morning";
            else if (normalizedInput.includes("afternoon"))
                mentionedTime = "afternoon";
            else if (normalizedInput.includes("evening"))
                mentionedTime = "evening";
            else if (normalizedInput.includes("night")) mentionedTime = "night";
            const broadTimeCategory =
                actualTimeOfDay.includes("morning") ||
                actualTimeOfDay === "pre-dawn"
                    ? "morning"
                    : actualTimeOfDay.includes("afternoon")
                    ? "afternoon"
                    : actualTimeOfDay.includes("evening")
                    ? "evening"
                    : "night";
            if (mentionedTime === broadTimeCategory) {
                return getRandomItem([
                    `Yes, it is a lovely ${mentionedTime}! I'm Kholipha Ahmmad. How can I help you today?`,
                    `Good ${mentionedTime} to you too! I'm Kholipha Al-Amin. What would you like to know about me or my work?`,
                    `A wonderful ${mentionedTime} it is! I'm Kholipha. How can I assist you?`,
                ]);
            }
            else {
                return getRandomItem([
                    `Actually, it's ${broadTimeCategory} here, but good ${mentionedTime} to you! I'm Kholipha Ahmmad. How can I help?`,
                    `It's ${broadTimeCategory} in my timezone, but I appreciate your ${mentionedTime} greeting! I'm Kholipha Al-Amin. What can I do for you?`,
                    `While it's ${broadTimeCategory} here, I wish you a good ${mentionedTime}! I'm Kholipha. What would you like to know?`,
                ]);
            }
        };
        const getTimeBasedGreeting = () => {
            const hour = new Date().getHours();
            const timeBasedGreetings = {
                "pre-dawn": [
                    "You're up early! I'm Kholipha Ahmmad. The pre-dawn hours are perfect for focused conversation.",
                    "Welcome to the mystical pre-dawn hour! I'm Kholipha Al-Amin. How can I assist you today?",
                    "Good pre-dawn! This quiet time between 4-5AM is special. I'm Kholipha, ready to help with anything.",
                ],
                "early morning": [
                    "Good morning! I'm Kholipha Ahmmad. The day is just beginning. What can I help you with?",
                    "A fresh early morning welcome to you! I'm Kholipha Al-Amin. What would you like to explore today?",
                    "Morning greetings! As the sun begins to warm the earth, I'm here to assist you with anything you need.",
                ],
                "mid-morning": [
                    "Good mid-morning! I'm Kholipha Ahmmad. The day is in full bloom - just like our conversation can be!",
                    "Mid-morning greetings! I'm Kholipha Al-Amin. The world is bustling with energy, and I'm ready to help.",
                    "Hello there! Mid-morning is a time of great productivity. I'm Kholipha - what would you like to know?",
                ],
                "late morning": [
                    "Late morning greetings! I'm Kholipha Ahmmad. As we approach midday, how can I assist you?",
                    "Welcome! It's that vibrant late morning time. I'm Kholipha Al-Amin, ready to chat about anything.",
                    "Hello! As the morning transitions toward noon, I'm here to help with any questions you might have.",
                ],
                "early afternoon": [
                    "Good afternoon! I'm Kholipha Ahmmad. Perfect time to digest both lunch and information. How can I help?",
                    "Afternoon greetings! I'm Kholipha Al-Amin. What would you like to know during this productive time?",
                    "Hello there! Early afternoon is great for thoughtful conversations. What's on your mind today?",
                ],
                "mid-afternoon": [
                    "Mid-afternoon greetings! I'm Kholipha Ahmmad. The day is flowing with purpose - just like our chat can.",
                    "Hello! I'm Kholipha Al-Amin. Mid-afternoon is perfect for creative thinking. What shall we discuss?",
                    "Good afternoon! This steady, purposeful time of day is ideal for exploration. What would you like to know?",
                ],
                "late afternoon": [
                    "Late afternoon hello! I'm Kholipha Ahmmad. As the day softens, what can I help you discover?",
                    "Greetings! I'm Kholipha Al-Amin. The light is getting golden - a perfect time for thoughtful conversation.",
                    "Welcome! As afternoon winds down, it's a great moment for reflection. What would you like to explore?",
                ],
                "early evening": [
                    "Good early evening! I'm Kholipha Ahmmad. As the day transitions to evening, what can I help with?",
                    "Early evening greetings! I'm Kholipha Al-Amin. This peaceful transition time is perfect for new ideas.",
                    "Hello! The early evening light brings a special quality. I'm Kholipha - what would you like to discuss?",
                ],
                evening: [
                    "Good evening! I'm Kholipha Ahmmad. The perfect time to reflect on the day. How can I assist you?",
                    "Evening greetings! I'm Kholipha Al-Amin. What would you like to explore in this contemplative hour?",
                    "Hello there! Evening is ideal for thoughtful conversation. What's on your mind tonight?",
                ],
                night: [
                    "Good night! I'm Kholipha Ahmmad, ready to assist even at this late hour. What can I help with?",
                    "Night greetings! I'm Kholipha Al-Amin. The quiet of night is perfect for focused conversation.",
                    "Hello! Even as the world rests, I'm here to help. What would you like to know?",
                ],
                "late night": [
                    "You're up late! I'm Kholipha Ahmmad. The stillness of late night provides clarity of thought.",
                    "Late night greetings! I'm Kholipha Al-Amin. What keeps you up at this hour?",
                    "Hello! The quiet of late night can spark great insights. What's on your mind?",
                ],
            };
            let timeCategory;
            if (hour >= 4 && hour < 6) timeCategory = "pre-dawn";
            else if (hour >= 6 && hour < 9) timeCategory = "early morning";
            else if (hour >= 9 && hour < 11) timeCategory = "mid-morning";
            else if (hour >= 11 && hour < 13) timeCategory = "late morning";
            else if (hour >= 13 && hour < 15) timeCategory = "early afternoon";
            else if (hour >= 15 && hour < 17) timeCategory = "mid-afternoon";
            else if (hour >= 17 && hour < 19) timeCategory = "late afternoon";
            else if (hour >= 19 && hour < 21) timeCategory = "early evening";
            else if (hour >= 21 && hour < 23) timeCategory = "evening";
            else if (hour >= 23 || hour < 1) timeCategory = "night";
            else timeCategory = "late night";
            return getRandomItem(timeBasedGreetings[timeCategory]);
        };
        const getWordReflectionResponse = (input) => {
            const excludedWords = [
                "a",
                "an",
                "the",
                "is",
                "are",
                "was",
                "were",
                "be",
                "been",
                "being",
                "and",
                "or",
                "but",
                "if",
                "then",
                "else",
                "when",
                "where",
                "why",
                "how",
                "all",
                "any",
                "both",
                "each",
                "few",
                "more",
                "most",
                "some",
                "such",
                "this",
                "that",
                "these",
                "those",
                "what",
                "which",
                "who",
                "whom",
            ];
            const words = input
                .split(/\s+/)
                .filter((word) => word.length > 4)
                .map((word) => word.replace(/[.,?!;:'"()]/g, "").toLowerCase())
                .filter((word) => !excludedWords.includes(word));
            if (words.length === 0) return null;
            const significantWord = getRandomItem(words);
            if (
                [
                    "skill",
                    "skills",
                    "tech",
                    "ability",
                    "programming",
                    "coding",
                    "develop",
                ].some((topic) => significantWord.includes(topic))
            ) {
                return {
                    response: getSkillsResponse(input),
                    keywords: [significantWord],
                };
            }
            if (
                [
                    "project",
                    "portfolio",
                    "built",
                    "create",
                    "develop",
                    "application",
                    "software",
                ].some((topic) => significantWord.includes(topic))
            ) {
                return {
                    response: getProjectResponse(input),
                    keywords: [significantWord],
                };
            }
            if (
                [
                    "education",
                    "degree",
                    "study",
                    "college",
                    "university",
                    "school",
                    "learn",
                    "certification",
                ].some((topic) => significantWord.includes(topic))
            ) {
                return {
                    response: getEducationResponse(),
                    keywords: [significantWord],
                };
            }
            if (
                [
                    "experience",
                    "job",
                    "work",
                    "career",
                    "company",
                    "professional",
                    "industry",
                ].some((topic) => significantWord.includes(topic))
            ) {
                return {
                    response: getExperienceResponse(),
                    keywords: [significantWord],
                };
            }
            if (
                [
                    "personal",
                    "hobby",
                    "favorite",
                    "interest",
                    "yourself",
                    "family",
                    "friend",
                    "lifestyle",
                ].some((topic) => significantWord.includes(topic))
            ) {
                return {
                    response: getPersonalInfoResponse(input),
                    keywords: [significantWord],
                };
            }
            const reflectionTemplate = getRandomPhrase("wordReflection");
            let response = reflectionTemplate.replace(
                "*word*",
                significantWord
            );
            if (Math.random() > 0.5) {
                return {
                    response: response,
                    keywords: [significantWord],
                };
            }
            return null;
        };
        const calculateAge = (dateOfBirth, detailed = false) => {
            let dob;
            if (dateOfBirth.includes("/")) {
                const parts = dateOfBirth.split("/");
                dob = new Date(parts[2], parts[1] - 1, parts[0], 4, 0, 0); 
            } else {
                dob = new Date(dateOfBirth);
            }
            const now = new Date();
            if (!detailed) {
                let years = now.getFullYear() - dob.getFullYear();
                if (
                    now.getMonth() < dob.getMonth() ||
                    (now.getMonth() === dob.getMonth() &&
                        now.getDate() < dob.getDate())
                ) {
                    years--;
                }
                return years;
            }
            let years = now.getFullYear() - dob.getFullYear();
            let months = now.getMonth() - dob.getMonth();
            let days = now.getDate() - dob.getDate();
            let hours = now.getHours() - dob.getHours();
            let minutes = now.getMinutes() - dob.getMinutes();
            let seconds = now.getSeconds() - dob.getSeconds();
            if (seconds < 0) {
                seconds += 60;
                minutes--;
            }
            if (minutes < 0) {
                minutes += 60;
                hours--;
            }
            if (hours < 0) {
                hours += 24;
                days--;
            }
            if (days < 0) {
                const lastMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    0
                );
                days += lastMonth.getDate();
                months--;
            }
            if (months < 0) {
                months += 12;
                years--;
            }
            return {
                years,
                months,
                days,
                hours,
                minutes,
                seconds,
            };
        };
        const getPersonalInfoResponse = (input) => {
            const normalizedInput = input.toLowerCase();
            if (
                normalizedInput.includes("age") ||
                normalizedInput.includes("old") ||
                normalizedInput.includes("birthday") ||
                normalizedInput.includes("born") ||
                normalizedInput.includes("date of birth")
            ) {
                const birthDate = "26/07/2002"; 
                const detailedAge = calculateAge(birthDate, true);
                const ageDisplay = `Age (as respect to 26/07/2002 4 am (UTC + 06.00) ): ${detailedAge.years} year ${detailedAge.months} month ${detailedAge.days} day ${detailedAge.hours} hour ${detailedAge.minutes} minute ${detailedAge.seconds} second`;
                const ageDisplayWithPlurals = `${detailedAge.years} year${
                    detailedAge.years !== 1 ? "s" : ""
                }, ${detailedAge.months} month${
                    detailedAge.months !== 1 ? "s" : ""
                }, ${detailedAge.days} day${
                    detailedAge.days !== 1 ? "s" : ""
                }, ${detailedAge.hours} hour${
                    detailedAge.hours !== 1 ? "s" : ""
                }, ${detailedAge.minutes} minute${
                    detailedAge.minutes !== 1 ? "s" : ""
                }, and ${detailedAge.seconds} second${
                    detailedAge.seconds !== 1 ? "s" : ""
                }`;
                if (
                    normalizedInput.includes("exact") ||
                    normalizedInput.includes("precise") ||
                    normalizedInput.includes("detail") ||
                    normalizedInput.includes("specific") ||
                    normalizedInput.includes("real time") ||
                    normalizedInput.includes("realtime")
                ) {
                    return ageDisplay;
                } else {
                    return `I am ${ageDisplayWithPlurals} old, born on July 26, 2002 at 4:00 AM (UTC+6) in Dhaka, Bangladesh.`;
                }
            }
            if (
                normalizedInput.includes("location") ||
                normalizedInput.includes("live") ||
                normalizedInput.includes("from") ||
                normalizedInput.includes("where")
            ) {
                return `I'm based in ${chatbotKnowledge.personalInfo.location}. It's a great hub for tech innovation and creative thinking!`;
            }
            if (
                normalizedInput.includes("hobby") ||
                normalizedInput.includes("hobbies") ||
                normalizedInput.includes("free time") ||
                normalizedInput.includes("fun")
            ) {
                const hobbies = getRandomItems(
                    chatbotKnowledge.personalInfo.hobbies,
                    3
                ).join(", ");
                return `When I'm not coding, I enjoy ${hobbies}. I find these activities help balance my technical work with creativity and physical activity.`;
            }
            if (
                normalizedInput.includes("book") ||
                normalizedInput.includes("read")
            ) {
                const books = getRandomItems(
                    chatbotKnowledge.personalInfo.favoriteBooks,
                    2
                ).join(" and ");
                return `I love reading! Some of my favorite books include ${books}. They really inspire my thinking about technology and the future.`;
            }
            if (
                normalizedInput.includes("movie") ||
                normalizedInput.includes("film") ||
                normalizedInput.includes("watch")
            ) {
                const movies = getRandomItems(
                    chatbotKnowledge.personalInfo.favoriteMovies,
                    2
                ).join(" and ");
                return `I enjoy movies that make me think! My favorites include ${movies}. I'm particularly drawn to sci-fi and stories about innovation.`;
            }
            if (
                normalizedInput.includes("tech") ||
                normalizedInput.includes("tool") ||
                normalizedInput.includes("software") ||
                normalizedInput.includes("hardware")
            ) {
                const tools = getRandomItems(
                    chatbotKnowledge.personalInfo.favoriteTechTools,
                    2
                ).join(" and ");
                return `I'm a big fan of ${tools}. These tools boost my productivity and creativity in development work.`;
            }
            if (
                normalizedInput.includes("language") ||
                normalizedInput.includes("speak")
            ) {
                const languages = chatbotKnowledge.personalInfo.languages.join(
                    ", "
                );
                return `I can communicate in ${languages}. I believe language skills are valuable for collaboration in our global tech community.`;
            }
            if (
                normalizedInput.includes("fact") ||
                normalizedInput.includes("interesting") ||
                normalizedInput.includes("unique")
            ) {
                const funFact = getRandomItem(
                    chatbotKnowledge.personalInfo.funFacts
                );
                return `Here's something you might not know about me: ${funFact}. Pretty cool, right?`;
            }
            if (
                normalizedInput.includes("goal") ||
                normalizedInput.includes("aspiration") ||
                normalizedInput.includes("future") ||
                normalizedInput.includes("plan")
            ) {
                const goal = getRandomItem(chatbotKnowledge.personalInfo.goals);
                return `One of my key professional goals is to ${goal}. I'm working steadily toward this while continuing to grow my skills.`;
            }
            if (
                normalizedInput.includes("value") ||
                normalizedInput.includes("believe") ||
                normalizedInput.includes("principle")
            ) {
                const values = getRandomItems(
                    chatbotKnowledge.personalInfo.values,
                    3
                ).join(", ");
                return `I strongly value ${values}. These principles guide my approach to both work and personal growth.`;
            }
            if (
                normalizedInput.includes("pet") ||
                normalizedInput.includes("cat") ||
                normalizedInput.includes("dog") ||
                normalizedInput.includes("animal")
            ) {
                return `I have a ${chatbotKnowledge.personalInfo.pets.breed} cat named ${chatbotKnowledge.personalInfo.pets.name} who is ${chatbotKnowledge.personalInfo.pets.age} years old. ${chatbotKnowledge.personalInfo.pets.personality}`;
            }
            if (
                normalizedInput.includes("email") &&
                !normalizedInput.includes("contact")
            ) {
                return `My email address is ${chatbotKnowledge.personalInfo.email}. Feel free to reach out anytime!`;
            }
            if (
                normalizedInput.includes("phone") ||
                normalizedInput.includes("mobile") ||
                (normalizedInput.includes("number") &&
                    !normalizedInput.includes("contact"))
            ) {
                return `My primary phone number is ${chatbotKnowledge.personalInfo.phone}. You can also reach me at my alternate number: ${chatbotKnowledge.personalInfo.alternatePhone}.`;
            }
            if (
                normalizedInput.includes("address") ||
                normalizedInput.includes("live")
            ) {
                if (
                    normalizedInput.includes("permanent") ||
                    normalizedInput.includes("home")
                ) {
                    return `My permanent address is: ${chatbotKnowledge.personalInfo.permanentAddress}`;
                } else if (
                    normalizedInput.includes("present") ||
                    normalizedInput.includes("current")
                ) {
                    return `My present address is: ${chatbotKnowledge.personalInfo.presentAddress}`;
                } else {
                    return `I currently live at ${chatbotKnowledge.personalInfo.presentAddress}. My permanent address is ${chatbotKnowledge.personalInfo.permanentAddress}.`;
                }
            }
            if (
                normalizedInput.includes("contact") ||
                normalizedInput.includes("reach") ||
                normalizedInput.includes("call") ||
                normalizedInput.includes("get in touch")
            ) {
                return `You can contact me via:
- Email: ${chatbotKnowledge.personalInfo.email}
- Phone: ${chatbotKnowledge.personalInfo.phone}
- Alternative Phone: ${chatbotKnowledge.personalInfo.alternatePhone}
- Present Address: ${chatbotKnowledge.personalInfo.presentAddress}
I'm also active on various social media platforms including LinkedIn, GitHub, Facebook, and many more.`;
            }
            if (
                normalizedInput.includes("passport") ||
                normalizedInput.includes("travel document") ||
                normalizedInput.includes("identification")
            ) {
                const passport = chatbotKnowledge.personalInfo.passportDetails;
                if (
                    normalizedInput.includes("number") ||
                    normalizedInput.includes("no")
                ) {
                    return `My passport number is ${passport.number}. It's a ${passport.type} passport with country code ${passport.countryCode}.`;
                } else if (
                    normalizedInput.includes("expiry") ||
                    normalizedInput.includes("expire") ||
                    normalizedInput.includes("valid")
                ) {
                    return `My passport was issued on ${passport.issueDate} and expires on ${passport.expiryDate}. It's valid for ${passport.duration}.`;
                } else if (
                    normalizedInput.includes("authority") ||
                    normalizedInput.includes("office") ||
                    normalizedInput.includes("issued")
                ) {
                    return `My passport was issued by ${passport.issuingAuthority} from the ${passport.passportOffice} office.`;
                } else {
                    return `My passport details:
- Passport Number: ${passport.number}
- Type: ${passport.type}
- Country Code: ${passport.countryCode}
- Issue Date: ${passport.issueDate}
- Expiry Date: ${passport.expiryDate}
- Issuing Authority: ${passport.issuingAuthority}
- Passport Office: ${passport.passportOffice}`;
                }
            }
            if (
                normalizedInput.includes("father") ||
                normalizedInput.includes("mother") ||
                normalizedInput.includes("parent") ||
                normalizedInput.includes("family")
            ) {
                const parentInfo = chatbotKnowledge.personalInfo.parentalInfo;
                if (
                    normalizedInput.includes("father") &&
                    !normalizedInput.includes("mother")
                ) {
                    return `My father's name is ${parentInfo.fatherName}. He is a ${parentInfo.fatherProfession} and his National ID is ${parentInfo.fatherNationalID}.`;
                } else if (
                    normalizedInput.includes("mother") &&
                    !normalizedInput.includes("father")
                ) {
                    return `My mother's name is ${parentInfo.motherName}. She is a ${parentInfo.motherProfession} and her National ID is ${parentInfo.motherNationalID}.`;
                } else {
                    return `My father is ${parentInfo.fatherName}, a ${parentInfo.fatherProfession} by profession. My mother is ${parentInfo.motherName}, also a ${parentInfo.motherProfession}. They are both ${parentInfo.fatherNationality} nationals.`;
                }
            }
            if (
                normalizedInput.includes("emergency") ||
                (normalizedInput.includes("contact") &&
                    normalizedInput.includes("urgent"))
            ) {
                const emergency =
                    chatbotKnowledge.personalInfo.emergencyContact;
                return `For emergency contact:
- Name: ${emergency.name}
- Relationship: ${emergency.relationship}
- Address: ${emergency.address}
- Phone: ${emergency.telephone}`;
            }
            if (
                normalizedInput.includes("nationality") ||
                normalizedInput.includes("citizen")
            ) {
                return `I am a ${chatbotKnowledge.personalInfo.nationality} citizen by birth.`;
            }
            if (normalizedInput.includes("religion")) {
                return `My religion is ${chatbotKnowledge.personalInfo.religion}.`;
            }
            if (
                normalizedInput.includes("marital") ||
                normalizedInput.includes("married") ||
                normalizedInput.includes("single")
            ) {
                return `My marital status is ${chatbotKnowledge.personalInfo.maritalStatus}.`;
            }
            if (
                normalizedInput.includes("gender") ||
                normalizedInput.includes("sex") ||
                normalizedInput.includes("male") ||
                normalizedInput.includes("female")
            ) {
                return `My gender is ${chatbotKnowledge.personalInfo.gender}.`;
            }
            if (
                normalizedInput.includes("profession") ||
                normalizedInput.includes("occupation")
            ) {
                return `My current profession is ${chatbotKnowledge.personalInfo.profession}.`;
            }
            if (
                normalizedInput.includes("birth") &&
                normalizedInput.includes("place")
            ) {
                return `I was born in ${chatbotKnowledge.personalInfo.placeOfBirth}.`;
            }
            if (
                normalizedInput.includes("full") &&
                normalizedInput.includes("name")
            ) {
                return `My full name is ${chatbotKnowledge.personalInfo.fullName}.`;
            }
            const socialPlatforms = {
                facebook: "Facebook",
                instagram: "Instagram",
                twitter: "Twitter",
                linkedin: "LinkedIn",
                github: "GitHub",
                youtube: "YouTube",
                tiktok: "TikTok",
                snapchat: "Snapchat",
                pinterest: "Pinterest",
                behance: "Behance",
                dribbble: "Dribbble",
                medium: "Medium",
                "dev.to": "Dev.to",
                "stack overflow": "Stack Overflow",
                stackoverflow: "Stack Overflow",
                quora: "Quora",
                reddit: "Reddit",
                telegram: "Telegram",
                whatsapp: "WhatsApp",
                discord: "Discord",
                skype: "Skype",
                spotify: "Spotify",
                soundcloud: "SoundCloud",
                fiverr: "Fiverr",
                upwork: "Upwork",
                freelancer: "Freelancer",
                kaggle: "Kaggle",
                hackerrank: "HackerRank",
                leetcode: "LeetCode",
                codepen: "CodePen",
                tumblr: "Tumblr",
                vimeo: "Vimeo",
            };
            for (const [platform, displayName] of Object.entries(
                socialPlatforms
            )) {
                if (normalizedInput.includes(platform)) {
                    const platformKey =
                        platform === "stack overflow"
                            ? "stackoverflow"
                            : platform === "dev.to"
                            ? "dev"
                            : platform;
                    if (
                        chatbotKnowledge.personalInfo.socialLinks[platformKey]
                    ) {
                        return `Yes, you can find me on ${displayName} at ${chatbotKnowledge.personalInfo.socialLinks[platformKey]}. Feel free to connect with me there!`;
                    }
                }
            }
            if (
                normalizedInput.includes("social") ||
                normalizedInput.includes("media") ||
                normalizedInput.includes("platforms") ||
                normalizedInput.includes("profiles") ||
                normalizedInput.includes("accounts")
            ) {
                const platforms =
                    Object.values(socialPlatforms).slice(0, 6).join(", ") +
                    ", and many more";
                return `I'm active on various social media platforms including ${platforms}. You can find links to all my profiles in the contact section of this website.`;
            }
            return `Hi, I'm ${
                chatbotKnowledge.personalInfo.fullName
            }, a ${calculateAge(
                chatbotKnowledge.personalInfo.dateOfBirth
            )}-year-old developer from ${
                chatbotKnowledge.personalInfo.location
            }. In my free time, I enjoy ${getRandomItems(
                chatbotKnowledge.personalInfo.hobbies,
                2
            ).join(" and ")}. Want to know anything specific about me?`;
        };
        const getSkillsResponse = (input) => {
            const normalizedInput = input.toLowerCase();
            const programmingLanguages = [
                "python",
                "javascript",
                "java",
                "c++",
                "c#",
                "sql",
                "html",
                "css",
                "php",
                "swift",
                "kotlin",
                "dart",
                "go",
            ];
            for (const language of programmingLanguages) {
                if (normalizedInput.includes(language)) {
                    return `Yes, I'm proficient in ${language.toUpperCase()}. I've used it in several projects including ${
                        getRandomItem(chatbotKnowledge.projects).name
                    }.`;
                }
            }
            if (
                normalizedInput.includes("ai") ||
                normalizedInput.includes("artificial intelligence") ||
                normalizedInput.includes("machine learning") ||
                normalizedInput.includes("deep learning") ||
                normalizedInput.includes("neural network") ||
                normalizedInput.includes("data science") ||
                normalizedInput.includes("pytorch") ||
                normalizedInput.includes("tensorflow")
            ) {
                return `For AI and Machine Learning, my skills include Machine Learning, Deep Learning with PyTorch, Generative AI using Amazon Bedrock, Computer Vision, Image Processing, and Data Visualization. My project THETAEnhancer+ demonstrates these skills where I developed an AI model for image restoration and enhancement.`;
            }
            if (
                normalizedInput.includes("web") ||
                normalizedInput.includes("frontend") ||
                normalizedInput.includes("front-end") ||
                normalizedInput.includes("backend") ||
                normalizedInput.includes("back-end") ||
                normalizedInput.includes("full stack") ||
                normalizedInput.includes("fullstack") ||
                normalizedInput.includes("react") ||
                normalizedInput.includes("node") ||
                normalizedInput.includes("angular") ||
                normalizedInput.includes("vue") ||
                normalizedInput.includes("laravel") ||
                normalizedInput.includes("wordpress")
            ) {
                return `My web development skills include Full-Stack Development using Node.js, React, Angular, Vue.js, Laravel, and WordPress. I'm proficient in building RESTful APIs, UI/UX Design, and implementing SEO best practices. My current internship at Akbor Skills Development Limited involves WordPress development.`;
            }
            if (
                normalizedInput.includes("game") ||
                normalizedInput.includes("unreal") ||
                normalizedInput.includes("unity") ||
                normalizedInput.includes("3d") ||
                normalizedInput.includes("modeling")
            ) {
                return `For game development, I work with Unreal Engine and Unity. I have experience with game design principles, basic 3D modeling, and Python scripting for games. My Interactive 3D FPS Game project was created using Unreal Engine 5.`;
            }
            if (
                normalizedInput.includes("database") ||
                normalizedInput.includes("sql") ||
                normalizedInput.includes("postgresql") ||
                normalizedInput.includes("mysql") ||
                normalizedInput.includes("mariadb") ||
                normalizedInput.includes("mongodb") ||
                normalizedInput.includes("nosql")
            ) {
                return `I have experience with several database systems including PostgreSQL, MySQL, MariaDB, and MongoDB. I've used these in various projects for data storage, retrieval, and management.`;
            }
            if (
                normalizedInput.includes("technical") ||
                normalizedInput.includes("programming") ||
                normalizedInput.includes("coding")
            ) {
                const skills = [
                    "Python",
                    "C++",
                    "Java",
                    "JavaScript",
                    "C#",
                    "SQL",
                    "HTML5",
                    "CSS3",
                    "PHP",
                    "Swift",
                    "React",
                    "Node.js",
                ].join(", ");
                return `For technical skills, I'm proficient in ${skills}, and more. I particularly enjoy working with Python for AI/ML projects and JavaScript for web development. Any specific technology you're interested in?`;
            }
            if (
                normalizedInput.includes("design") ||
                normalizedInput.includes("ui") ||
                normalizedInput.includes("ux")
            ) {
                return `In terms of design skills, I work with Adobe Creative Suite (Photoshop, Illustrator), Figma, UI/UX Design principles, and have experience in creating responsive web designs. My freelance work on Fiverr involves creating brand assets and UI/UX mockups for clients worldwide.`;
            }
            if (
                normalizedInput.includes("soft") ||
                normalizedInput.includes("people") ||
                normalizedInput.includes("communication")
            ) {
                const skills = chatbotKnowledge.skills.soft.join(", ");
                return `My soft skills include ${skills}. These are crucial for effective collaboration, project management, and leadership. My role as President of the Adamjee Eco Amica Club helped me develop many of these skills.`;
            }
            return `My skills span several areas:
1. Programming Languages: Python, JavaScript, Java, C++, C#, SQL, HTML/CSS, PHP
2. AI & Machine Learning: PyTorch, Computer Vision, Data Visualization
3. Web Development: React, Node.js, WordPress, UI/UX Design
4. Game Development: Unreal Engine, Unity
5. Tools & Platforms: Git, Docker, AWS, Adobe Creative Suite
6. Soft Skills: Communication, Team Leadership, Project Management
Would you like more specific information about any of these areas?`;
        };
        const getProjectResponse = (input) => {
            for (const project of chatbotKnowledge.projects) {
                if (input.includes(project.name.toLowerCase())) {
                    return `**${project.name}**: ${
                        project.description
                    }. It was built using ${project.technologies.join(", ")}.`;
                }
            }
            for (const tech of [
                "ai",
                "machine learning",
                "python",
                "javascript",
                "blockchain",
                "react",
            ]) {
                if (input.includes(tech)) {
                    const relevantProjects = chatbotKnowledge.projects.filter(
                        (p) =>
                            p.description.toLowerCase().includes(tech) ||
                            p.technologies.some((t) =>
                                t.toLowerCase().includes(tech)
                            )
                    );
                    if (relevantProjects.length > 0) {
                        const project = relevantProjects[0];
                        return `For ${tech}, check out my **${
                            project.name
                        }** project: ${
                            project.description
                        }. It uses ${project.technologies.join(", ")}.`;
                    }
                }
            }
            const randomProject = getRandomItem(chatbotKnowledge.projects);
            return `I've worked on several interesting projects. For example, **${randomProject.name}**: ${randomProject.description}. Would you like to hear about more projects?`;
        };
        const getEducationResponse = (input = "") => {
            const normalizedInput = input.toLowerCase();
            if (
                normalizedInput.includes("ssc") ||
                normalizedInput.includes("secondary") ||
                normalizedInput.includes("high school") ||
                normalizedInput.includes("adamjee")
            ) {
                const sscEducation = chatbotKnowledge.education.find(
                    (ed) => ed.type === "SSC" || ed.school.includes("Adamjee")
                );
                if (sscEducation) {
                    return `For my Secondary School Certificate (SSC), I studied at ${sscEducation.school} from ${sscEducation.period}. I achieved a GPA of ${sscEducation.gpa} with ${sscEducation.group} as my focus. During this time, I was also ${sscEducation.activities}.`;
                }
            }
            if (
                normalizedInput.includes("hsc") ||
                normalizedInput.includes("higher secondary") ||
                normalizedInput.includes("college") ||
                normalizedInput.includes("intermediate")
            ) {
                const hscEducation = chatbotKnowledge.education.find(
                    (ed) => ed.type === "HSC" || ed.level === "college"
                );
                if (hscEducation) {
                    return `I completed my Higher Secondary Certificate (HSC) at ${hscEducation.school} from ${hscEducation.period}. My focus was ${hscEducation.group} and I achieved a GPA of ${hscEducation.gpa}. I was actively involved in ${hscEducation.activities}.`;
                }
            }
            if (
                normalizedInput.includes("university") ||
                normalizedInput.includes("college") ||
                normalizedInput.includes("undergraduate") ||
                normalizedInput.includes("bachelor") ||
                normalizedInput.includes("bsc") ||
                normalizedInput.includes("degree")
            ) {
                const uniEducation = chatbotKnowledge.education.find(
                    (ed) => ed.level === "university" || ed.type === "BSc"
                );
                if (uniEducation) {
                    return `I'm pursuing my ${uniEducation.degree} in ${
                        uniEducation.focus
                    } at ${uniEducation.school} (${
                        uniEducation.period
                    }). My current CGPA is ${
                        uniEducation.gpa
                    }. I'm particularly interested in ${uniEducation.interests.join(
                        ", "
                    )}.`;
                }
            }
            if (
                normalizedInput.includes("certification") ||
                normalizedInput.includes("certificate") ||
                normalizedInput.includes("course") ||
                normalizedInput.includes("training") ||
                normalizedInput.includes("udemy") ||
                normalizedInput.includes("coursera") ||
                normalizedInput.includes("professional")
            ) {
                const certifications = chatbotKnowledge.education
                    .filter((ed) => ed.certification)
                    .map(
                        (cert) =>
                            `**${cert.certification}** (${cert.provider}, ${cert.year})`
                    );
                if (certifications.length > 0) {
                    return `I've completed several professional certifications, including: ${certifications.join(
                        ", "
                    )}. These certifications have helped me develop specialized skills that complement my formal education.`;
                }
            }
            let response = "My educational background includes:";
            const education = chatbotKnowledge.education || [];
            const latestDegree = education.find(
                (ed) => ed.level === "university" || ed.type === "BSc"
            );
            if (latestDegree) {
                response += `\n\n1. ${
                    latestDegree.degree || "Bachelor's degree"
                } in ${latestDegree.focus || "Computer Science"} from ${
                    latestDegree.school || "University"
                } (${latestDegree.period || "2019-Present"})`;
            }
            const secondaryEd = education.find(
                (ed) => ed.type === "HSC" || ed.level === "college"
            );
            if (secondaryEd) {
                response += `\n2. Higher Secondary Certificate from ${
                    secondaryEd.school || "College"
                } (${secondaryEd.year || secondaryEd.period || "2018-2020"})`;
            }
            const primaryEd = education.find(
                (ed) => ed.type === "SSC" || ed.school?.includes("Adamjee")
            );
            if (primaryEd) {
                response += `\n3. Secondary School Certificate from ${
                    primaryEd.school || "High School"
                } (${primaryEd.year || primaryEd.period || "2016-2018"})`;
            }
            const certs = education
                .filter((ed) => ed.certification)
                .slice(0, 3);
            if (certs && certs.length > 0) {
                response += `\n\nI also hold professional certifications including:`;
                certs.forEach((cert) => {
                    if (cert && cert.certification) {
                        response += `\n- ${cert.certification}`;
                    }
                });
            }
            return response;
        };
        const getExperienceResponse = (input = "") => {
            const normalizedInput = input.toLowerCase();
            if (
                normalizedInput.includes("current") ||
                normalizedInput.includes("now") ||
                normalizedInput.includes("present") ||
                normalizedInput.includes("akbor") ||
                normalizedInput.includes("wordpress")
            ) {
                const currentJob = chatbotKnowledge.experience[0];
                return `Currently, I'm working as a **${currentJob.role}** at ${currentJob.company} (${currentJob.period}). My key responsibilities include:
1. ${currentJob.responsibilities[0]}
2. ${currentJob.responsibilities[1]}
3. ${currentJob.responsibilities[2]}
The internship has provided me with excellent mentorship and real-world development experience with WordPress sites.`;
            }
            if (
                normalizedInput.includes("freelance") ||
                normalizedInput.includes("fiverr") ||
                normalizedInput.includes("upwork") ||
                normalizedInput.includes("self-employed") ||
                normalizedInput.includes("designer")
            ) {
                const freelanceJob = chatbotKnowledge.experience.find(
                    (job) =>
                        job.role.includes("Designer") ||
                        job.company.includes("Fiverr")
                );
                if (freelanceJob) {
                    return `I've worked as a ${freelanceJob.role} through ${
                        freelanceJob.company
                    } since ${
                        freelanceJob.period
                    }. This has involved ${freelanceJob.responsibilities.join(
                        ", "
                    )}. My freelance work has given me exposure to a diverse range of clients and projects from around the world.`;
                }
            }
            if (
                normalizedInput.includes("leadership") ||
                normalizedInput.includes("leader") ||
                normalizedInput.includes("president") ||
                normalizedInput.includes("club") ||
                normalizedInput.includes("volunteer")
            ) {
                const leadershipRole = chatbotKnowledge.experience.find(
                    (job) =>
                        job.role.includes("President") ||
                        job.type === "leadership"
                );
                if (leadershipRole) {
                    return `I served as ${leadershipRole.role} at ${
                        leadershipRole.company
                    } during ${
                        leadershipRole.period
                    }. This leadership position involved ${leadershipRole.responsibilities.join(
                        ", "
                    )}. This experience helped me develop strong organizational, team management, and public speaking skills.`;
                }
            }
            if (
                normalizedInput.includes("skill") ||
                normalizedInput.includes("technical") ||
                normalizedInput.includes("learn") ||
                normalizedInput.includes("gain")
            ) {
                return `Through my work experiences, I've gained and applied several key technical skills:
1. Web Development: WordPress theme customization, plugin development, PHP
2. Design: UI/UX principles, responsive design, Adobe XD, Figma, Photoshop
3. Project Management: Client communication, requirement analysis, timely delivery
4. Team Collaboration: Working with developers, designers, and content creators
Each role has contributed to expanding my professional toolkit in unique ways.`;
            }
            const workExp = chatbotKnowledge.experience;
            let response = `My professional experience includes:
1. **${workExp[0].role}** at ${workExp[0].company} (${workExp[0].period})
   - ${workExp[0].responsibilities[0]}
   - ${workExp[0].responsibilities[1]}
2. **${workExp[1].role}** at ${workExp[1].company} (${workExp[1].period})
   - ${workExp[1].responsibilities[0]}
   - ${workExp[1].responsibilities[1]}`;
            if (workExp.length > 2) {
                response += `
3. **${workExp[2].role}** at ${workExp[2].company} (${workExp[2].period})
   - ${workExp[2].responsibilities[0]}`;
            }
            return response;
        };
        const getRandomPhrase = (category) => {
            const phrases = chatbotKnowledge.conversationalPhrases[category];
            return phrases[Math.floor(Math.random() * phrases.length)];
        };
        const getRandomItem = (array) => {
            return array[Math.floor(Math.random() * array.length)];
        };
        const getRandomItems = (array, count) => {
            const shuffled = [...array].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };
        const addPersonality = (text) => {
            const personalityTraits = {
                friendly: {
                    intros: [
                        "Absolutely! ",
                        "Happy to share that ",
                        "Great question! ",
                        "I'd love to tell you about that. ",
                        "Thanks for asking! ",
                    ],
                    outros: [
                        " Feel free to ask me more!",
                        " Hope that answers your question!",
                        " Anything else you'd like to know?",
                        " Let me know if you need more details!",
                        " I'm excited to share more about my work!",
                    ],
                    emojis: ["😊", "👍", "💯", "✨", "🚀", "💡", "🔥", "👨‍💻"],
                },
                professional: {
                    intros: [
                        "Certainly. ",
                        "I'm pleased to share that ",
                        "To address your inquiry, ",
                        "From my experience, ",
                        "In my professional capacity, ",
                    ],
                    outros: [
                        " Please feel free to inquire further.",
                        " I'm available to elaborate if needed.",
                        " Does this information meet your requirements?",
                        " I trust this information is helpful.",
                        " I'd be happy to provide additional context if necessary.",
                    ],
                    emojis: ["📊", "📈", "🔍", "📱", "💼", "📝"],
                },
                casual: {
                    intros: [
                        "Hey! ",
                        "So, ",
                        "Well, ",
                        "You know, ",
                        "Honestly, ",
                    ],
                    outros: [
                        " Pretty cool, right?",
                        " That's the gist of it!",
                        " What else are you curious about?",
                        " Hope that helps!",
                        " Let me know what else you want to know!",
                    ],
                    emojis: ["😎", "🙌", "👏", "🤙", "👊", "🔥", "💪"],
                },
                enthusiastic: {
                    intros: [
                        "Oh wow! I'd LOVE to tell you about that! ",
                        "I'm SUPER excited you asked! ",
                        "AMAZING question! ",
                        "This is one of my FAVORITE topics! ",
                        "I'm THRILLED to share this with you! ",
                    ],
                    outros: [
                        " Isn't that INCREDIBLE?!",
                        " How AMAZING is that?!",
                        " I'm SO passionate about this!",
                        " This is what I LIVE for!",
                        " I could talk about this ALL day!",
                    ],
                    emojis: ["🤩", "✨", "🚀", "💥", "⚡", "🔥", "💫", "🌟"],
                },
            };
            const mood = personalityTraits[currentChatMood];
            const shouldAddIntro = Math.random() > 0.4;
            const shouldAddOutro = Math.random() > 0.5;
            const shouldAddEmoji = Math.random() > 0.3;
            let result = text;
            if (
                shouldAddIntro &&
                !text.startsWith("I ") &&
                !text.startsWith("My ")
            ) {
                result = getRandomItem(mood.intros) + result;
            }
            if (
                shouldAddOutro &&
                !result.endsWith("?") &&
                !result.endsWith("!")
            ) {
                result = result + getRandomItem(mood.outros);
            }
            if (shouldAddEmoji) {
                const position = Math.random() > 0.5 ? "start" : "end";
                const emoji = getRandomItem(mood.emojis);
                if (
                    position === "start" &&
                    !result.startsWith("I ") &&
                    !result.startsWith("My ")
                ) {
                    result = emoji + " " + result;
                } else if (position === "end") {
                    result = result + " " + emoji;
                }
            }
            if (Math.random() > 0.8) {
                const signatures = [
                    "\n\n~ Kholipha",
                    "\n\nRegards,\nKholipha Al-Amin",
                    "\n\n-KAA",
                ];
                result += getRandomItem(signatures);
            }
            return result;
        };
        const addMessage = (text, isUser = false, keywords = []) => {
            if (isTyping && !isUser) return;
            const messageContainer = document.createElement("div");
            messageContainer.className = isUser
                ? "user-message"
                : "bot-message";
            const timestamp = document.createElement("div");
            timestamp.className = "message-timestamp";
            const now = new Date();
            timestamp.textContent = `${now
                .getHours()
                .toString()
                .padStart(2, "0")}:${now
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
            const avatar = document.createElement("div");
            avatar.className = "message-avatar";
            if (!isUser) {
                const avatarImg = document.createElement("img");
                avatarImg.src = logoPath;
                avatarImg.alt = "Kholipha Al-Amin";
                avatarImg.loading = "lazy";
                avatar.appendChild(avatarImg);
            } else {
                const userIcon = document.createElement("i");
                userIcon.className = "fas fa-user";
                avatar.appendChild(userIcon);
            }
            const contentContainer = document.createElement("div");
            contentContainer.className = "message-content";
            if (isUser) {
                contentContainer.innerHTML = highlightKeywordsInUserMessage(
                    text,
                    keywords
                );
            } else {
                contentContainer.innerHTML = "";
                messageContainer.classList.add("typing-indicator");
                for (let i = 0; i < 3; i++) {
                    const dot = document.createElement("span");
                    dot.className = "dot";
                    contentContainer.appendChild(dot);
                }
            }
            messageContainer.appendChild(avatar);
            messageContainer.appendChild(contentContainer);
            messageContainer.appendChild(timestamp);
            chatbotMessages.appendChild(messageContainer);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            createParticles();
            if (!isUser) {
                isTyping = true;
                const formattedText = formatMarkdown(text);
                setTimeout(() => {
                    messageContainer.classList.remove("typing-indicator");
                    contentContainer.innerHTML = "";
                    typeEffect(contentContainer, formattedText, 5).then(() => {
                        isTyping = false;
                        chatbotInput.focus();
                        animateBotMessage(contentContainer);
                        setTimeout(() => {
                            if (botMessageQueue.length > 0) {
                                const nextMessage = botMessageQueue.shift();
                                addMessage(nextMessage, false);
                            }
                        }, 500);
                    });
                }, 1500);
            }
            return { messageContainer, contentContainer };
        };
        const typeEffect = (element, text, speed) => {
            isTyping = true;
            let formattedText = formatMarkdown(text);
            element.innerHTML = "";
            return new Promise((resolve) => {
                let i = 0;
                let htmlContent = "";
                let tagStack = [];
                let isInTag = false;
                let isInEntity = false;
                let entityContent = "";
                function type() {
                    if (i < formattedText.length) {
                        const char = formattedText[i];
                        if (char === "<") {
                            isInTag = true;
                            htmlContent += char;
                        } else if (char === ">" && isInTag) {
                            isInTag = false;
                            htmlContent += char;
                        } else if (isInTag) {
                            htmlContent += char;
                        } else if (char === "&") {
                            isInEntity = true;
                            entityContent = char;
                        } else if (char === ";" && isInEntity) {
                            isInEntity = false;
                            entityContent += char;
                            htmlContent += entityContent;
                        } else if (isInEntity) {
                            entityContent += char;
                        } else {
                            htmlContent += char;
                            element.innerHTML = htmlContent;
                            chatbotMessages.scrollTop =
                                chatbotMessages.scrollHeight;
                        }
                        i++;
                        setTimeout(type, isInTag || isInEntity ? 0 : speed);
                    } else {
                        isTyping = false;
                        chatbotInput.disabled = false;
                        chatbotSend.disabled = false;
                        chatbotInput.focus();
                        resolve();
                    }
                }
                type();
            });
        };
        const processInput = () => {
            const userInput = chatbotInput.value.trim();
            if (userInput === "") return;
            const messageTimestamp = new Date();
            addMessage(userInput, true);
            chatHistory.push({
                role: "user",
                content: userInput,
                timestamp: messageTimestamp,
            });
            chatbotInput.value = "";
            chatbotInput.disabled = true;
            chatbotSend.disabled = true;
            showTypingIndicator();
            const messageComplexity = analyzeMessageComplexity(userInput);
            const baseResponseTime = 1000; 
            const variableResponseTime = calculateResponseTime(
                userInput,
                messageComplexity
            );
            setTimeout(() => {
                const { response, keywords } = generateResponse(userInput);
                const typingSpeed = 30 + Math.floor(Math.random() * 10); 
                const typingTime = Math.min(
                    2000,
                    (response.length * 1000) / typingSpeed
                );
                hideTypingIndicator();
                typeResponse(response, keywords, typingTime);
                chatHistory.push({
                    role: "assistant",
                    content: response,
                    timestamp: new Date(),
                });
                setTimeout(() => {
                    chatbotInput.disabled = false;
                    chatbotSend.disabled = false;
                    chatbotInput.focus();
                    setTimeout(updateSuggestionChips, 1000);
                }, typingTime + 200);
            }, variableResponseTime);
        };
        const analyzeMessageComplexity = (message) => {
            const wordCount = message.split(/\s+/).filter((w) => w.length > 0)
                .length;
            const questionCount = (message.match(/\?/g) || []).length;
            const complexSentenceMarkers = (
                message.match(
                    /because|therefore|however|although|despite|while|if|when|how|why|what|where/gi
                ) || []
            ).length;
            const complexTopics = [
                "compare",
                "explain",
                "difference",
                "opinion",
                "best",
                "recommend",
                "versus",
                "vs",
                "think",
                "feel",
                "believe",
                "complex",
                "difficult",
                "challenge",
                "problem",
                "architecture",
                "design",
                "implementation",
            ];
            const complexTopicMatches = complexTopics.filter((topic) =>
                message.toLowerCase().includes(topic)
            ).length;
            let complexity = Math.min(
                10,
                wordCount / 5 + 
                    questionCount * 2 + 
                    complexSentenceMarkers + 
                    complexTopicMatches * 1.5 
            );
            return Math.max(1, Math.min(10, Math.floor(complexity)));
        };
        const calculateResponseTime = (message, complexity) => {
            const baseThinkingTime = 800;
            const complexityFactor = complexity * 300;
            const randomVariation = Math.floor(Math.random() * 500);
            const totalResponseTime =
                baseThinkingTime + complexityFactor + randomVariation;
            return Math.min(5000, totalResponseTime);
        };
        const showTypingIndicator = () => {
            if (!document.getElementById("chatbot-typing-indicator")) {
                const typingIndicator = document.createElement("div");
                typingIndicator.id = "chatbot-typing-indicator";
                typingIndicator.className = "bot-message typing-indicator";
                const avatarContainer = document.createElement("div");
                avatarContainer.className = "message-avatar";
                const avatarImg = document.createElement("img");
                avatarImg.src = logoPath;
                avatarImg.alt = "Kholipha";
                avatarImg.loading = "lazy";
                avatarContainer.appendChild(avatarImg);
                const contentContainer = document.createElement("div");
                contentContainer.className = "message-content";
                const dotsContainer = document.createElement("div");
                dotsContainer.className = "typing-dots";
                for (let i = 0; i < 3; i++) {
                    const dot = document.createElement("span");
                    dot.className = "dot";
                    dotsContainer.appendChild(dot);
                }
                contentContainer.appendChild(dotsContainer);
                typingIndicator.appendChild(avatarContainer);
                typingIndicator.appendChild(contentContainer);
                chatbotMessages.appendChild(typingIndicator);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        };
        const hideTypingIndicator = () => {
            const typingIndicator = document.getElementById(
                "chatbot-typing-indicator"
            );
            if (typingIndicator) {
                typingIndicator.remove();
            }
        };
        const typeResponse = (response, keywords, typingTime) => {
            const { messageContainer, contentContainer } = addMessage(
                response,
                false,
                keywords
            );
            if (!contentContainer) {
                console.error("Content container not found for typing effect");
                return;
            }
            const fullText = formatMarkdown(response);
            contentContainer.innerHTML = "";
            const totalChars = fullText.length;
            const fps = 60;
            const duration = typingTime;
            const totalFrames = (duration / 1000) * fps;
            const charsPerFrame = totalChars / totalFrames;
            let charIndex = 0;
            let frameCount = 0;
            const typeChar = () => {
                frameCount++;
                const nextCharIndex = Math.min(
                    totalChars,
                    Math.floor(frameCount * charsPerFrame)
                );
                if (nextCharIndex > charIndex) {
                    contentContainer.innerHTML = fullText.substring(
                        0,
                        nextCharIndex
                    );
                    charIndex = nextCharIndex;
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }
                if (charIndex < totalChars) {
                    requestAnimationFrame(typeChar);
                }
            };
            requestAnimationFrame(typeChar);
        };
        const toggleSettings = () => {
            isSettingsOpen = !isSettingsOpen;
            if (isSettingsOpen) {
                chatbotSettings.classList.add("visible");
            } else {
                chatbotSettings.classList.remove("visible");
            }
        };
        const getMoodChangeMessage = (mood) => {
            switch (mood) {
                case "friendly":
                    return "I'll keep our chat friendly and approachable! How can I help you today?";
                case "professional":
                    return "I've switched to a more professional tone. How may I assist you with your inquiry?";
                case "casual":
                    return "Cool, switching to casual mode! What's up? What do you wanna know?";
                case "enthusiastic":
                    return "OMG! I'm SUPER excited to chat with you now!! What AMAZING thing can I tell you about?!?";
                default:
                    return "Chat style updated. How can I help you?";
            }
        };
        const setTheme = (theme) => {
            currentTheme = theme;
            document.body.setAttribute("data-chatbot-theme", theme);
            let themeMessage;
            switch (theme) {
                case "dark":
                    themeMessage =
                        "Switched to dark theme. Your eyes will thank you!";
                    break;
                case "light":
                    themeMessage = "Switched to light theme. Keep it bright!";
                    break;
                case "purple":
                    themeMessage = "Switched to purple theme. Royal vibes!";
                    break;
                case "blue":
                    themeMessage = "Switched to blue theme. Ocean mood!";
                    break;
                default:
                    themeMessage = "Theme updated.";
            }
            addMessage(themeMessage);
        };
        const updateSuggestionChips = () => {
            suggestionChips.innerHTML = "";
            let suggestions = [];
            const lastBotMessage = chatHistory
                .filter((msg) => !msg.isUser)
                .pop();
            if (lastBotMessage && lastBotMessage.content) {
                const content = lastBotMessage.content.toLowerCase();
                if (content.includes("skill")) {
                    suggestions = [
                        "Technical skills",
                        "Design skills",
                        "Soft skills",
                    ];
                } else if (content.includes("project")) {
                    suggestions = [
                        "AI projects",
                        "Web development projects",
                        "Mobile projects",
                    ];
                } else if (content.includes("education")) {
                    suggestions = [
                        "Certifications",
                        "Courses",
                        "Academic background",
                    ];
                } else if (content.includes("experience")) {
                    suggestions = [
                        "Current role",
                        "Previous jobs",
                        "Achievements",
                    ];
                } else {
                    suggestions = getRandomItems(
                        chatbotKnowledge.defaultSuggestions,
                        3
                    );
                }
            } else {
                suggestions = getRandomItems(
                    chatbotKnowledge.defaultSuggestions,
                    3
                );
            }
            suggestions.forEach((suggestion) => {
                const chip = document.createElement("button");
                chip.className = "suggestion-chip";
                chip.textContent = suggestion;
                chip.addEventListener("click", () => {
                    chatbotInput.value = suggestion;
                    processInput();
                });
                suggestionChips.appendChild(chip);
                gsap.fromTo(
                    chip,
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: "back.out(1.7)",
                        delay: Math.random() * 0.3,
                    }
                );
            });
        };
        chatbotTrigger.addEventListener("click", () => {
            chatbotContainer.classList.remove("chatbot-closed");
            chatbotTrigger.style.display = "none";
            if (chatHistory.length === 0) {
                const greeting = getTimeBasedGreeting();
                addMessage(greeting);
                chatHistory.push({ role: "assistant", content: greeting });
                updateSuggestionChips();
            }
            chatbotInput.focus();
        });
        chatbotClose.addEventListener("click", () => {
            chatbotContainer.classList.add("chatbot-closed");
            chatbotTrigger.style.display = "flex";
        });
        chatbotMinimize.addEventListener("click", () => {
            chatbotContainer.classList.toggle("chatbot-minimized");
        });
        chatbotInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey && !isTyping) {
                e.preventDefault();
                processInput();
            }
        });
        chatbotSend.addEventListener("click", () => {
            if (!isTyping) {
                processInput();
            }
        });
        if (chatbotToggleSettings) {
            chatbotToggleSettings.addEventListener("click", toggleSettings);
        }
        if (moodButtons) {
            moodButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    moodButtons.forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");
                    currentChatMood = btn.getAttribute("data-mood");
                    const moodChangeMessage = getMoodChangeMessage(
                        currentChatMood
                    );
                    addMessage(moodChangeMessage);
                });
            });
        }
        if (themeButtons) {
            themeButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    themeButtons.forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");
                    setTheme(btn.getAttribute("data-theme"));
                });
            });
        }
        updateSuggestionChips();
        const style = document.createElement("style");
        style.textContent = `
            .highlighted-keyword {
                background: linear-gradient(to right, rgba(120, 60, 240, 0.1), rgba(120, 60, 240, 0.3), rgba(120, 60, 240, 0.1));
                padding: 0 2px;
                border-radius: 3px;
                font-weight: bold;
                color: white;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
                animation: keyword-glow 2s infinite alternate;
            }
            @keyframes keyword-glow {
                0% { box-shadow: 0 0 5px rgba(120, 60, 240, 0.3); }
                100% { box-shadow: 0 0 8px rgba(120, 60, 240, 0.6); }
            }
            .message-particle {
                position: absolute;
                pointer-events: none;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);
    });
})();