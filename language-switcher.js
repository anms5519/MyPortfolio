document.addEventListener("DOMContentLoaded", function () {
    // Add CSS for language error toast
    const style = document.createElement('style');
    style.innerHTML = `
        .language-error-toast {
            position: fixed;
            top: 6rem;
            right: 1rem;
            background: var(--card-bg);
            padding: 0.75rem 1.25rem;
            border-radius: 1rem;
            box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transform: translateX(1rem);
            transition: all 0.3s ease;
        }
        
        .language-error-toast.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .language-error-toast .toast-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .language-error-toast i {
            color: #ff6b6b;
        }
    `;
    document.head.appendChild(style);
    
    // Load preferred language from localStorage
    const loadSavedLanguage = () => {
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang) {
            changeLanguage(savedLang);
            
            // Update the language toggle UI
            const langOptions = document.querySelectorAll(".lang-dropdown a");
            langOptions.forEach((option) => {
                if (option.getAttribute("data-lang") === savedLang) {
                    option.classList.add("active");
                    const langToggle = document.querySelector(".lang-toggle span");
                    if (langToggle) {
                        langToggle.textContent = savedLang.toUpperCase();
                    }
                } else {
                    option.classList.remove("active");
                }
            });
        }
    };
    
    initLanguageCards();
    initLanguageParticles();
    initLanguageRadarChart();
    initLanguageSwitcher();
    
    // Load saved language preference after a short delay to ensure UI is ready
    setTimeout(loadSavedLanguage, 500);
    function initLanguageCards() {
        const cards = document.querySelectorAll(".language-card");
        cards.forEach((card) => {
            card.addEventListener("click", () => {
                card.classList.toggle("flipped");
            });
            card.addEventListener("mousemove", handleMouseMove);
            card.addEventListener("mouseleave", handleMouseLeave);
        });
        function handleMouseMove(e) {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleY = (x - centerX) / 15;
            const angleX = (centerY - y) / 15;
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
        }
        function handleMouseLeave(e) {
            const card = e.currentTarget;
            card.style.transform = "";
        }
    }
    function initLanguageParticles() {
        const skillItems = document.querySelectorAll(".skill-item");
        skillItems.forEach((item) => {
            const particlesContainer = item.querySelector(".skill-particles");
            const progressValue = parseInt(
                item.querySelector(".skill-percentage").textContent
            );
            if (progressValue >= 80) {
                for (let i = 0; i < 5; i++) {
                    createParticle(particlesContainer);
                }
            }
        });
        function createParticle(container) {
            if (!container) return;
            const particle = document.createElement("span");
            particle.className = "particle";
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const size = Math.random() * 4 + 1;
            const duration = Math.random() * 3 + 2;
            particle.style.cssText = `
                position: absolute;
                top: ${posY}%;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                animation: float ${duration}s ease-in-out infinite alternate;
                pointer-events: none;
            `;
            container.appendChild(particle);
        }
    }
    function initLanguageRadarChart() {
        const ctx = document.getElementById("languageRadarChart");
        if (!ctx) return;
        const data = {
            labels: ["Bengali", "English", "Hindi", "Urdu", "Arabic"],
            datasets: [
                {
                    label: "Language Proficiency",
                    data: [100, 93, 82, 68, 38],
                    fill: true,
                    backgroundColor: "rgba(138, 79, 255, 0.3)",
                    borderColor: "rgba(138, 79, 255, 0.8)",
                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                    pointBorderColor: "rgba(138, 79, 255, 1)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(138, 79, 255, 1)",
                },
            ],
        };
        const config = {
            type: "radar",
            data: data,
            options: {
                elements: {
                    line: {
                        borderWidth: 3,
                    },
                },
                scales: {
                    r: {
                        angleLines: {
                            color: "rgba(255, 255, 255, 0.2)",
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                        },
                        pointLabels: {
                            color: "rgba(255, 255, 255, 0.7)",
                            font: {
                                size: 12,
                            },
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.5)",
                            backdropColor: "transparent",
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        };
        if (typeof Chart !== "undefined") {
            new Chart(ctx, config);
        } else {
            console.log(
                "Chart.js not loaded. Radar chart will not be displayed."
            );
        }
    }
    function initLanguageSwitcher() {
        const langSwitcher = document.createElement("div");
        langSwitcher.className = "language-switcher";
        langSwitcher.innerHTML = `
            <button class="lang-toggle">
                <i class="fas fa-globe"></i>
                <span>EN</span>
            </button>
            <div class="lang-dropdown">
                <a href="#" data-lang="en" class="active">English</a>
                <a href="#" data-lang="bn">Bengali</a>
                <a href="#" data-lang="hi">Hindi</a>
                <a href="#" data-lang="ar">Arabic</a>
            </div>
        `;
        const header = document.getElementById("header");
        if (header) {
            // Add to the header tools container
            const headerTools = document.querySelector(".header-tools");
            if (headerTools) {
                headerTools.appendChild(langSwitcher);
            } else {
                // Create header tools if it doesn't exist
                const toolsContainer = document.createElement("div");
                toolsContainer.className = "header-tools";
                header.appendChild(toolsContainer);
                toolsContainer.appendChild(langSwitcher);
            }
        }
        const langToggle = langSwitcher.querySelector(".lang-toggle");
        const langDropdown = langSwitcher.querySelector(".lang-dropdown");
        langToggle.addEventListener("click", () => {
            langDropdown.classList.toggle("active");
        });
        const langOptions = langSwitcher.querySelectorAll(".lang-dropdown a");
        langOptions.forEach((option) => {
            option.addEventListener("click", (e) => {
                e.preventDefault();
                const lang = option.getAttribute("data-lang");
                langOptions.forEach((opt) => opt.classList.remove("active"));
                option.classList.add("active");
                langToggle.querySelector(
                    "span"
                ).textContent = lang.toUpperCase();
                langDropdown.classList.remove("active");
                changeLanguage(lang);
            });
        });
        document.addEventListener("click", (e) => {
            if (!langSwitcher.contains(e.target)) {
                langDropdown.classList.remove("active");
            }
        });
    }
    function changeLanguage(lang) {
        console.log(`Changing language to: ${lang}`);
        // Save selected language in localStorage
        localStorage.setItem('preferred_language', lang);
        
        // Update document lang attribute for voice recognition
        document.documentElement.lang = lang === 'en' ? 'en-US' : 
                                       lang === 'ar' ? 'ar' : 
                                       lang === 'bn' ? 'bn' : 
                                       lang === 'hi' ? 'hi-IN' : 'en-US';
        
        // Add RTL support for Arabic
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl-language');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl-language');
        }
        
        // Force cache reload of the translation file
        const cacheBuster = new Date().getTime();
        fetch(`translations/${lang}.json?_=${cacheBuster}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Translation file not found");
                }
                return response.json();
            })
            .then((translations) => {
                updatePageContent(translations);
                // Dispatch an event for other components to respond to language change
                window.dispatchEvent(new CustomEvent('languageChanged', {
                    detail: { language: lang, translations: translations }
                }));
            })
            .catch((error) => {
                console.error("Error loading translations:", error);
                showTranslationError(lang);
            });
    }
    
    function showTranslationError(lang) {
        const toast = document.createElement('div');
        toast.className = 'language-error-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>Failed to load ${getLangName(lang)} translations. Falling back to English.</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    function getLangName(code) {
        const names = {
            'en': 'English',
            'ar': 'Arabic',
            'bn': 'Bengali',
            'hi': 'Hindi',
        };
        return names[code] || code;
    }
    
    function updatePageContent(translations) {
        if (!translations) return;
        
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach((element) => {
            const key = element.getAttribute("data-i18n");
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
        
        // Update document title if available
        if (translations['page_title']) {
            document.title = translations['page_title'];
        }
        
        // Add CSS for RTL language support
        if (!document.getElementById('rtl-styles')) {
            const rtlStyle = document.createElement('style');
            rtlStyle.id = 'rtl-styles';
            rtlStyle.innerHTML = `
                .rtl-language {
                    text-align: right;
                }
                .rtl-language .header-tools {
                    flex-direction: row-reverse;
                }
                .rtl-language .search-icon {
                    left: auto;
                    right: 1vh;
                }
                .rtl-language .legendary-search-input {
                    padding-left: 1vh;
                    padding-right: 4vh;
                    direction: rtl;
                }
                .rtl-language .search-results {
                    text-align: right;
                    direction: rtl;
                }
                .rtl-language .notification-center {
                    right: auto;
                    left: 1vh;
                }
                .rtl-language .notification-item {
                    flex-direction: row-reverse;
                }
                .rtl-language .voice-help-modal-body,
                .rtl-language .voice-help-section {
                    text-align: right;
                }
                
                /* Fix RTL for languages section */
                .rtl-language .languages-container .languages-grid {
                    direction: rtl;
                }
                .rtl-language .language-card-front,
                .rtl-language .language-card-back {
                    text-align: right;
                }
                .rtl-language .skill-item {
                    direction: rtl;
                }
                .rtl-language .language-card .skill-item .skill-name {
                    text-align: right;
                }
                .rtl-language .language-card .skill-item .skill-bar {
                    direction: ltr;
                }
                .rtl-language .language-card-details div {
                    text-align: right;
                }
                .rtl-language .languages-summary.ultra-premium .summary-header,
                .rtl-language .languages-summary.ultra-premium .summary-header p {
                    text-align: right;
                }
                .rtl-language .stat-item.premium {
                    flex-direction: row-reverse;
                }
                .rtl-language .stat-item.premium .stat-icon {
                    margin-right: 0;
                    margin-left: 15px;
                }
                .rtl-language .stat-details {
                    text-align: right;
                }
                .rtl-language .stat-fill {
                    direction: ltr;
                }
                .rtl-language .achievement-card {
                    flex-direction: row-reverse;
                    text-align: right;
                }
                .rtl-language .achievement-icon {
                    margin-right: 0;
                    margin-left: 15px;
                }
                .rtl-language .map-header {
                    flex-direction: row-reverse;
                }
            `;
            document.head.appendChild(rtlStyle);
        }
    }
});