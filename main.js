function initialize3DEffects() {
    const cards = document.querySelectorAll("[data-tilt]");
    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const rotationY = ((x - midX) / midX) * 10;
            const rotationX = ((midY - y) / midY) * 10;
            card.style.transform = `perspective(500px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(500px) rotateX(0deg) rotateY(0deg)";
        });
    });
}
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}
function updateActiveDot() {
    console.log("Active dot updated");
}
function initNavigationDots() {
    const sections = [
        { id: "hero", name: "Home", icon: "fa-home" },
        { id: "about", name: "About", icon: "fa-user" },
        { id: "education", name: "Education", icon: "fa-graduation-cap" },
        { id: "certifications", name: "Certifications", icon: "fa-award" },
        { id: "skills", name: "Skills", icon: "fa-code" },
        { id: "work", name: "Work Experience", icon: "fa-briefcase" },
        { id: "projects", name: "Projects", icon: "fa-laptop-code" },
        { id: "trainings", name: "Trainings", icon: "fa-chalkboard-teacher" },
        { id: "activities", name: "Activities", icon: "fa-users" },
        { id: "gallery", name: "Gallery", icon: "fa-images" },
        { id: "interests", name: "Interests", icon: "fa-heart" },
        { id: "languages", name: "Languages", icon: "fa-language" },
        { id: "resume", name: "Resume", icon: "fa-file-alt" },
        { id: "contact", name: "Contact", icon: "fa-envelope" },
        { id: "footer", name: "Footer", icon: "fa-chevron-up" },
    ];
    const dotsContainer = document.getElementById("section-nav-dots");
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    sections.forEach((section, index) => {
        const dot = document.createElement("div");
        dot.className = "nav-dot";
        dot.title = section.name;
        dot.addEventListener("click", () => {
            document
                .getElementById(section.id)
                .scrollIntoView({ behavior: "smooth" });
        });
        dotsContainer.appendChild(dot);
    });
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        updateActiveDot();
                    }
                });
            },
            {
                rootMargin: "-15% 0px -30% 0px",
                threshold: [0.1, 0.2, 0.5, 0.8],
            }
        );
        sections.forEach((section) => {
            const sectionEl = document.getElementById(section.id);
            if (sectionEl) sectionObserver.observe(sectionEl);
        });
    } else {
        updateActiveDot();
        window.addEventListener("scroll", debounce(updateActiveDot, 100));
    }
    setTimeout(updateActiveDot, 500);
}
document.addEventListener("DOMContentLoaded", function () {
    initialize3DEffects();
    window.addEventListener("load", function () {
        const preloader = document.getElementById("preloader");
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 300);
        }, 500);
    });
    setTimeout(() => {
        initNavigationDots();
    }, 300);
    const themeToggle = document.getElementById("theme-toggle");
    const iconWrapper = document.querySelector(".icon-wrapper");
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
        iconWrapper.innerHTML = savedTheme === "dark" ? "🌙" : "🌞";
    } else {
        const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDarkMode) {
            document.body.setAttribute("data-theme", "dark");
            iconWrapper.innerHTML = "🌙";
            localStorage.setItem("theme", "dark");
        }
    }
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", newTheme);
        iconWrapper.innerHTML = newTheme === "dark" ? "🌙" : "🌞";
        localStorage.setItem("theme", newTheme);
        if (window.canvas && window.particleArray) {
            window.particleArray.forEach((particle) => particle.setColor());
        }
    });
    const navToggle = document.getElementById("nav-toggle");
    const slideMenu = document.getElementById("slide-menu");
    navToggle.addEventListener("click", function () {
        slideMenu.classList.toggle("open");
        navToggle.classList.toggle("menu-open");
    });
    document.addEventListener("click", function (event) {
        if (
            !slideMenu.contains(event.target) &&
            !navToggle.contains(event.target) &&
            slideMenu.classList.contains("open")
        ) {
            slideMenu.classList.remove("open");
            navToggle.classList.remove("menu-open");
        }
    });
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (slideMenu.classList.contains("open")) {
                slideMenu.classList.remove("open");
                navToggle.classList.remove("menu-open");
            }
        });
    });
    const typingElement = document.querySelector(".typed-text");
    if (typingElement) {
        const phrases = [
            "AI Specialist",
            "Game Developer",
            "Full-Stack Developer",
            "UI/UX Designer",
            "Creative Problem Solver",
        ];
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        function typeEffect() {
            const currentPhrase = phrases[currentPhraseIndex];
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(
                    0,
                    currentCharIndex - 1
                );
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(
                    0,
                    currentCharIndex + 1
                );
                currentCharIndex++;
                typingSpeed = 100;
            }
            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1000;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 300;
            }
            setTimeout(typeEffect, typingSpeed);
        }
        setTimeout(typeEffect, 1000);
    }
    const header = document.getElementById("header");
    let lastScrollTop = 0;
    window.addEventListener("scroll", function () {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.classList.add("scrolling-down");
        } else {
            header.classList.remove("scrolling-down");
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    const scrollTopButton = document.getElementById("footer-scroll-top");

    // Listen for a click event on the button
    scrollTopButton.addEventListener("click", () => {
      // Smoothly scroll the window to the top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener("resize", function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.setColor();
            }
            setColor() {
                const theme = document.body.getAttribute("data-theme");
                const colors =
                    theme === "dark"
                        ? [
                              "rgba(4, 217, 255, 0.5)",
                              "rgba(124, 77, 255, 0.5)",
                              "rgba(255, 41, 87, 0.5)",
                          ]
                        : [
                              "rgba(147, 86, 255, 0.5)",
                              "rgba(0, 188, 212, 0.5)",
                              "rgba(255, 107, 107, 0.5)",
                          ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0)
                    this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0)
                    this.speedY = -this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        const particleArray = [];
        const particleCount = Math.min(window.innerWidth / 10, 100);
        for (let i = 0; i < particleCount; i++) {
            particleArray.push(new Particle());
        }
        window.particleArray = particleArray;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particleArray.forEach((particle) => {
                particle.update();
                particle.draw();
                connectParticles(particle, particleArray);
            });
            requestAnimationFrame(animate);
        }
        function connectParticles(particle, particles) {
            const maxDistance = 100;
            particles.forEach((other) => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < maxDistance) {
                    const opacity = 1 - distance / maxDistance;
                    ctx.strokeStyle = particle.color.replace(
                        "0.5",
                        (opacity * 0.5).toFixed(2)
                    );
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            });
        }
        animate();
        themeToggle.addEventListener("click", () => {
            particleArray.forEach((particle) => particle.setColor());
        });
    }
    const certCards = document.querySelectorAll(".certificate-card");
    const certModal = document.getElementById("certificate-modal");
    if (certCards.length > 0 && certModal) {
        const modalTitle = document.getElementById("certificate-modal-title");
        const modalDate = document.getElementById("certificate-modal-date");
        const modalImage = document.getElementById("certificate-image");
        const closeBtn = document.querySelector(".close-btn");
        certCards.forEach((card) => {
            const viewBtn = card.querySelector(".view-cert-btn");
            if (viewBtn) {
                viewBtn.addEventListener("click", function () {
                    modalTitle.textContent =
                        card.getAttribute("data-title") || "Certificate";
                    modalDate.textContent =
                        card.getAttribute("data-date") || "";
                    modalImage.src = card.querySelector("img").src;
                    certModal.classList.add("show");
                });
            }
        });
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                certModal.classList.remove("show");
            });
        }
        window.addEventListener("click", function (event) {
            if (event.target === certModal) {
                certModal.classList.remove("show");
            }
        });
    }
    function initContactSection() {
        const contactForm = document.getElementById("contact-form");
        if (!contactForm) return;
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const from_name = document.getElementById("from_name").value;
            const from_email = document.getElementById("from_email").value;
            const subject = document.getElementById("subject").value;
            const phone = document.getElementById("phone").value;
            const message = document.getElementById("message").value;
            const templateParams = {
                from_name,
                from_email,
                subject,
                phone,
                message,
            };
            emailjs
                .send(
                    "service_0ietc2e",
                    "template_jihmbkn",
                    templateParams,
                    "QCLwAOKe38NGkZrCE"
                )
                .then(
                    function (response) {
                        console.log("SUCCESS!", response.status, response.text);
                        document
                            .getElementById("form-success")
                            .classList.remove("hidden");
                        document
                            .getElementById("form-error")
                            .classList.add("hidden");
                        contactForm.reset();
                    },
                    function (error) {
                        console.error("FAILED...", error);
                        document
                            .getElementById("form-error")
                            .classList.remove("hidden");
                        document
                            .getElementById("form-success")
                            .classList.add("hidden");
                    }
                );
        });
        const contactParticles = document.querySelector(".contact-particles");
        if (contactParticles) {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement("div");
                particle.classList.add("particle");
                const size = Math.random() * 6 + 2;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${delay}s`;
                const hue = Math.random() * 60 - 30 + 210;
                particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, ${
                    Math.random() * 0.3 + 0.2
                })`;
                contactParticles.appendChild(particle);
            }
        }
        contactForm
            .querySelectorAll(".form-floating input, .form-floating textarea")
            .forEach((input) => {
                if (input.value) {
                    input.classList.add("has-value");
                }
                input.addEventListener("focus", () => {
                    input.classList.add("focused");
                });
                input.addEventListener("blur", () => {
                    input.classList.remove("focused");
                    if (input.value) {
                        input.classList.add("has-value");
                    } else {
                        input.classList.remove("has-value");
                    }
                });
            });
    }
    initContactSection();
    function initLifestyleCollage() {
        const gallerySection = document.getElementById("gallery");
        if (!gallerySection) return;
        const gallageItemObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        gallageItemObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
        );
        const collageItems = gallerySection.querySelectorAll(".collage-item");
        collageItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
            gallageItemObserver.observe(item);
        });
    }
    initLifestyleCollage();
    const skillTabs = document.querySelectorAll(".skill-tab");
    if (skillTabs.length > 0) {
        skillTabs.forEach((tab) => {
            tab.addEventListener("click", function () {
                skillTabs.forEach((t) => t.classList.remove("active"));
                this.classList.add("active");
                const category = this.getAttribute("data-category");
                const skillCards = document.querySelectorAll(".skill-card");
                skillCards.forEach((card) => {
                    if (
                        category === "all" ||
                        card.getAttribute("data-category") === category
                    ) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    }
    const displayBtns = document.querySelectorAll(".display-btn");
    const skillsDisplays = document.querySelectorAll(".skills-displays > div");
    if (displayBtns.length > 0 && skillsDisplays.length > 0) {
        displayBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                displayBtns.forEach((b) => b.classList.remove("active"));
                this.classList.add("active");
                const displayType = this.getAttribute("data-display");
                skillsDisplays.forEach((display) => {
                    display.classList.remove("active");
                    if (
                        display.classList.contains(
                            `skills-${displayType}-display`
                        )
                    ) {
                        display.classList.add("active");
                        if (displayType === "chart") {
                            initSkillsChart();
                        }
                        if (displayType === "timeline") {
                            initSkillsTimeline();
                        }
                    }
                });
            });
        });
    }
    const skillCards = document.querySelectorAll(".skill-card");
    if (skillCards.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const progressBar = card.querySelector(
                            ".skill-progress"
                        );
                        const percentage = card.querySelector(
                            ".skill-percentage"
                        ).textContent;
                        if (progressBar) {
                            progressBar.style.setProperty(
                                "--progress-width",
                                percentage
                            );
                            card.classList.add("animated");
                        }
                        observer.unobserve(card);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );
        skillCards.forEach((card) => {
            observer.observe(card);
        });
    }
    function initSkillsChart() {
        const chartElement = document.getElementById("skills-chart");
        if (!chartElement) return;
        if (typeof Chart === "undefined") {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = createChart;
            document.head.appendChild(script);
        } else {
            createChart();
        }
        function createChart() {
            if (window.skillsChart) {
                window.skillsChart.destroy();
            }
            const ctx = chartElement.getContext("2d");
            const skillsData = {
                technical: {
                    labels: [
                        "Game Design",
                        "3D Modeling",
                        "AR/VR Development",
                        "Audio Production",
                        "Video Editing",
                    ],
                    data: [85, 80, 75, 70, 88],
                },
                design: {
                    labels: [
                        "UI/UX Design",
                        "Motion Graphics",
                        "Adobe Photoshop",
                        "Figma",
                        "Illustration",
                    ],
                    data: [92, 89, 94, 85, 79],
                },
                programming: {
                    labels: [
                        "JavaScript",
                        "Python",
                        "C/C++",
                        "HTML/CSS",
                        "SQL",
                    ],
                    data: [90, 85, 82, 95, 75],
                },
                data: {
                    labels: [
                        "Data Analysis",
                        "Predictive Analytics",
                        "Data Visualization",
                        "Machine Learning",
                        "Database Design",
                    ],
                    data: [78, 85, 91, 80, 75],
                },
                interpersonal: {
                    labels: [
                        "Communication",
                        "Team Leadership",
                        "Problem Solving",
                        "Adaptability",
                        "Time Management",
                    ],
                    data: [90, 88, 95, 92, 85],
                },
                all: {
                    labels: [
                        "Technical",
                        "Design",
                        "Programming",
                        "Data Analysis",
                        "Interpersonal",
                    ],
                    data: [82, 88, 86, 81, 90],
                },
            };
            let chartType = "radar";
            let category = "all";
            const activeChartType = document.querySelector(
                ".chart-type-btn.active"
            );
            const activeCategory = document.querySelector(
                ".chart-category-btn.active"
            );
            if (activeChartType) {
                chartType = activeChartType.getAttribute("data-chart");
            }
            if (activeCategory) {
                category = activeCategory.getAttribute("data-chart-category");
            }
            const theme = document.body.getAttribute("data-theme");
            const primaryColor = theme === "dark" ? "#04d9ff" : "#8a4fff";
            const secondaryColor = theme === "dark" ? "#ff2957" : "#ff6b6b";
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    r: {
                        angleLines: {
                            color:
                                theme === "dark"
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.1)",
                        },
                        grid: {
                            color:
                                theme === "dark"
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.1)",
                        },
                        pointLabels: {
                            color: theme === "dark" ? "#e6e6e6" : "#333333",
                            font: {
                                size: 12,
                            },
                        },
                        ticks: {
                            backdropColor: "transparent",
                            color: theme === "dark" ? "#e6e6e6" : "#333333",
                        },
                    },
                },
            };
            if (chartType === "radar") {
                window.skillsChart = new Chart(ctx, {
                    type: "radar",
                    data: {
                        labels: skillsData[category].labels,
                        datasets: [
                            {
                                label: "Skill Level",
                                data: skillsData[category].data,
                                backgroundColor:
                                    "rgba(" + hexToRgb(primaryColor) + ", 0.2)",
                                borderColor: primaryColor,
                                borderWidth: 2,
                                pointBackgroundColor: primaryColor,
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: primaryColor,
                            },
                        ],
                    },
                    options: options,
                });
            } else if (chartType === "bar") {
                window.skillsChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: skillsData[category].labels,
                        datasets: [
                            {
                                label: "Skill Level",
                                data: skillsData[category].data,
                                backgroundColor: createGradient(
                                    ctx,
                                    primaryColor,
                                    secondaryColor
                                ),
                                borderWidth: 0,
                                borderRadius: 5,
                            },
                        ],
                    },
                    options: {
                        ...options,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                grid: {
                                    color:
                                        theme === "dark"
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgba(0, 0, 0, 0.1)",
                                },
                                ticks: {
                                    color:
                                        theme === "dark"
                                            ? "#e6e6e6"
                                            : "#333333",
                                },
                            },
                            x: {
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    color:
                                        theme === "dark"
                                            ? "#e6e6e6"
                                            : "#333333",
                                },
                            },
                        },
                    },
                });
            } else if (chartType === "polar") {
                window.skillsChart = new Chart(ctx, {
                    type: "polarArea",
                    data: {
                        labels: skillsData[category].labels,
                        datasets: [
                            {
                                data: skillsData[category].data,
                                backgroundColor: [
                                    primaryColor,
                                    secondaryColor,
                                    "#00bcd4",
                                    "#7c4dff",
                                    "#ff9800",
                                ].map(
                                    (color) =>
                                        "rgba(" + hexToRgb(color) + ", 0.7)"
                                ),
                                borderWidth: 0,
                            },
                        ],
                    },
                    options: options,
                });
            }
            const chartTypeBtns = document.querySelectorAll(".chart-type-btn");
            chartTypeBtns.forEach((btn) => {
                btn.addEventListener("click", function () {
                    chartTypeBtns.forEach((b) => b.classList.remove("active"));
                    this.classList.add("active");
                    initSkillsChart();
                });
            });
            const chartCategoryBtns = document.querySelectorAll(
                ".chart-category-btn"
            );
            chartCategoryBtns.forEach((btn) => {
                btn.addEventListener("click", function () {
                    chartCategoryBtns.forEach((b) =>
                        b.classList.remove("active")
                    );
                    this.classList.add("active");
                    initSkillsChart();
                });
            });
        }
        function createGradient(ctx, color1, color2) {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return gradient;
        }
        function hexToRgb(hex) {
            hex = hex.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return r + "," + g + "," + b;
        }
    }
    function initSkillsTimeline() {
        const timelineTrack = document.querySelector(".timeline-track");
        if (!timelineTrack) return;
        const timelineProgress = document.querySelector(".timeline-progress");
        const timelineItems = document.querySelectorAll(".timeline-item");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (timelineProgress) {
                            timelineProgress.style.height = "100%";
                        }
                        timelineItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add("animated");
                            }, index * 200);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );
        observer.observe(timelineTrack);
    }
});