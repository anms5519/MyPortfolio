(() => {
    "use strict";
    const initVoiceNavigation = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            console.warn("Speech recognition not supported in this browser");
            return;
        }

        // Create voice navigation button
        const voiceNavButton = document.createElement("button");
        voiceNavButton.className = "voice-nav-btn";
        voiceNavButton.innerHTML = '<i class="fas fa-headset"></i>';
        voiceNavButton.title = "Voice Navigation";
        voiceNavButton.setAttribute("aria-label", "Voice Navigation");
        voiceNavButton.setAttribute("id", "voice-nav-button");

        // Create help button
        const helpButton = document.createElement("button");
        helpButton.className = "voice-help-btn";
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpButton.title = "Voice Navigation Help";
        helpButton.setAttribute("aria-label", "Voice Navigation Help");
        helpButton.setAttribute("id", "voice-help-button");

        const header = document.getElementById("header");
        if (header) {
            // Adding to the header tools container which we'll create
            const headerTools = document.querySelector(".header-tools") || createHeaderTools();
            headerTools.appendChild(voiceNavButton);
            headerTools.appendChild(helpButton);
        }

        function createHeaderTools() {
            const toolsContainer = document.createElement("div");
            toolsContainer.className = "header-tools";
            header.appendChild(toolsContainer);
            return toolsContainer;
        }

        // Create help modal with ultra-advanced documentation
        const helpModal = document.createElement("div");
        helpModal.className = "voice-help-modal";
        helpModal.innerHTML = `
            <div class="voice-help-modal-content">
                <div class="voice-help-modal-header">
                    <h3><i class="fas fa-headset"></i> Ultra Advanced Voice Navigation</h3>
                    <button class="voice-help-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="voice-help-tabs">
                    <button class="voice-help-tab active" data-tab="basic">Basic Commands</button>
                    <button class="voice-help-tab" data-tab="navigation">Navigation</button>
                    <button class="voice-help-tab" data-tab="interface">Interface</button>
                    <button class="voice-help-tab" data-tab="advanced">Advanced</button>
                    <button class="voice-help-tab" data-tab="tips">Tips</button>
                </div>
                <div class="voice-help-modal-body">
                    <div class="voice-help-tab-content active" data-tab-content="basic">
                        <div class="voice-help-introduction">
                            <div class="voice-help-icon">
                                <i class="fas fa-microphone-alt"></i>
                            </div>
                            <div class="voice-help-intro-text">
                                <h4>Welcome to Voice Navigation</h4>
                                <p>Control this portfolio with your voice using natural commands. Simply click the <i class="fas fa-headset"></i> icon in the header and start speaking after the activation sound.</p>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Essential Commands</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Go to [section]"</div>
                                    <div class="command-description">Navigate to any section of the portfolio</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Scroll down/up"</div>
                                    <div class="command-description">Move up or down the page</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Help"</div>
                                    <div class="command-description">Show this help screen</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Toggle theme"</div>
                                    <div class="command-description">Switch between light and dark mode</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Change language to [language]"</div>
                                    <div class="command-description">Switch the interface language</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Search for [term]"</div>
                                    <div class="command-description">Search the portfolio</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="voice-help-tab-content" data-tab-content="navigation">
                        <div class="voice-help-section">
                            <h4>Section Navigation</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Go to [section]"</div>
                                    <div class="command-description">Navigate to a specific section</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Open [section]"</div>
                                    <div class="command-description">Alternative for navigation</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Navigate to [section]"</div>
                                    <div class="command-description">Alternative for navigation</div>
                                </div>
                            </div>
                            
                            <div class="available-sections">
                                <h5>Available Sections:</h5>
                                <div class="section-badges">
                                    <span class="section-badge">About</span>
                                    <span class="section-badge">Education</span>
                                    <span class="section-badge">Skills</span>
                                    <span class="section-badge">Work</span>
                                    <span class="section-badge">Projects</span>
                                    <span class="section-badge">Certifications</span>
                                    <span class="section-badge">Trainings</span>
                                    <span class="section-badge">Activities</span>
                                    <span class="section-badge">Gallery</span>
                                    <span class="section-badge">Interests</span>
                                    <span class="section-badge">Languages</span>
                                    <span class="section-badge">Resume</span>
                                    <span class="section-badge">Contact</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Scrolling Commands</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Scroll down"</div>
                                    <div class="command-description">Scroll down the page</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Scroll up"</div>
                                    <div class="command-description">Scroll up the page</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Page down"</div>
                                    <div class="command-description">Scroll down by a larger amount</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Page up"</div>
                                    <div class="command-description">Scroll up by a larger amount</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Top" or "Beginning"</div>
                                    <div class="command-description">Go to the top of the page</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Bottom" or "End"</div>
                                    <div class="command-description">Go to the bottom of the page</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="voice-help-tab-content" data-tab-content="interface">
                        <div class="voice-help-section">
                            <h4>Theme Commands</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Toggle theme"</div>
                                    <div class="command-description">Switch between light/dark mode</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Dark mode"</div>
                                    <div class="command-description">Switch to dark mode</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Light mode"</div>
                                    <div class="command-description">Switch to light mode</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Menu Commands</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Open menu"</div>
                                    <div class="command-description">Open the navigation menu</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Close menu"</div>
                                    <div class="command-description">Close the navigation menu</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Language & Search</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Change language to [language]"</div>
                                    <div class="command-description">Switch language (English, Arabic, Bengali, Hindi)</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Search for [term]"</div>
                                    <div class="command-description">Search the portfolio</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Find [term]"</div>
                                    <div class="command-description">Alternative for search</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Zoom Controls</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Zoom in"</div>
                                    <div class="command-description">Zoom in the content</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Zoom out"</div>
                                    <div class="command-description">Zoom out the content</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Reset zoom"</div>
                                    <div class="command-description">Reset to default zoom level</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="voice-help-tab-content" data-tab-content="advanced">
                        <div class="voice-help-section">
                            <h4>Audio Control</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Play introduction"</div>
                                    <div class="command-description">Play the portfolio introduction audio</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Stop audio"</div>
                                    <div class="command-description">Stop any playing audio</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Stop playing"</div>
                                    <div class="command-description">Alternative to stop audio</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Visual Effects</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Screenshot"</div>
                                    <div class="command-description">Capture a screenshot effect</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Take a picture"</div>
                                    <div class="command-description">Alternative for screenshot effect</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="voice-help-section">
                            <h4>Help Commands</h4>
                            <div class="command-grid">
                                <div class="command-item">
                                    <div class="command-phrase">"Help"</div>
                                    <div class="command-description">Show this help screen</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"Commands"</div>
                                    <div class="command-description">Alternative to show help</div>
                                </div>
                                <div class="command-item">
                                    <div class="command-phrase">"What can I say"</div>
                                    <div class="command-description">Alternative to show help</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="voice-help-tab-content" data-tab-content="tips">
                        <div class="voice-help-section">
                            <h4>Tips for Better Recognition</h4>
                            <div class="tips-grid">
                                <div class="tip-item">
                                    <div class="tip-icon"><i class="fas fa-volume-up"></i></div>
                                    <div class="tip-content">
                                        <h5>Speak Clearly & Naturally</h5>
                                        <p>Use a normal speaking voice at a moderate pace. Avoid speaking too quickly or too slowly.</p>
                                    </div>
                                </div>
                                <div class="tip-item">
                                    <div class="tip-icon"><i class="fas fa-microphone"></i></div>
                                    <div class="tip-content">
                                        <h5>Optimize Your Environment</h5>
                                        <p>Reduce background noise and position yourself closer to your microphone for better recognition.</p>
                                    </div>
                                </div>
                                <div class="tip-item">
                                    <div class="tip-icon"><i class="fas fa-quote-right"></i></div>
                                    <div class="tip-content">
                                        <h5>Use Exact Command Phrases</h5>
                                        <p>For best results, use the exact command phrases as listed in this help guide.</p>
                                    </div>
                                </div>
                                <div class="tip-item">
                                    <div class="tip-icon"><i class="fas fa-sync-alt"></i></div>
                                    <div class="tip-content">
                                        <h5>Try Alternative Commands</h5>
                                        <p>If a command isn't recognized, try an alternative command phrasing for the same action.</p>
                                    </div>
                                </div>
                                <div class="tip-item">
                                    <div class="tip-icon"><i class="fas fa-hand-paper"></i></div>
                                    <div class="tip-content">
                                        <h5>Wait for Activation</h5>
                                        <p>After clicking the voice button, wait for the activation sound before speaking.</p>
                                    </div>
                                </div>
                                <div class="tip-item">
                                    <div class="tip-icon"><i class="fas fa-browser"></i></div>
                                    <div class="tip-content">
                                        <h5>Browser Compatibility</h5>
                                        <p>Voice recognition works best in Chrome, Edge, and Safari. Firefox may have limited support.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="voice-help-modal-footer">
                    <p>Click the <i class="fas fa-headset"></i> icon in the header to activate voice navigation.</p>
                    <div class="voice-listen-indicator">
                        <div class="voice-indicator-dot"></div> System is ready to listen for your commands
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);

        // Close modal functionality
        const closeButton = helpModal.querySelector(".voice-help-close");
        closeButton.addEventListener("click", () => {
            helpModal.classList.remove("show");
        });

        // Open modal on help button click
        helpButton.addEventListener("click", () => {
            helpModal.classList.add("show");
        });

        // Close modal when clicking outside
        window.addEventListener("click", (e) => {
            if (e.target === helpModal) {
                helpModal.classList.remove("show");
            }
        });
        
        // Tab functionality for help modal
        const tabButtons = helpModal.querySelectorAll('.voice-help-tab');
        const tabContents = helpModal.querySelectorAll('.voice-help-tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Hide all tab content
                tabContents.forEach(content => content.classList.remove('active'));
                // Show content that corresponds to clicked tab
                const tabContent = helpModal.querySelector(`.voice-help-tab-content[data-tab-content="${button.getAttribute('data-tab')}"]`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });

        // Speech Recognition Setup
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        // Advanced recognition settings
        recognition.lang = document.documentElement.lang || 'en-US';
        recognition.maxAlternatives = 3;

        // Create visualization for voice
        const visualizer = document.createElement("div");
        visualizer.className = "voice-visualizer";
        visualizer.innerHTML = `
            <div class="voice-visualizer-container">
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
            </div>
            <div class="voice-transcript"></div>
        `;
        document.body.appendChild(visualizer);

        // Transcript display
        const transcriptDisplay = visualizer.querySelector(".voice-transcript");
        
        recognition.onresult = (event) => {
            // Show interim results
            if (event.results[0].isFinal) {
                const transcript = event.results[0][0].transcript.toLowerCase();
                console.log("Voice command recognized:", transcript);
                transcriptDisplay.textContent = transcript;
                
                // Process commands
                processVoiceCommand(transcript);
                
                // Play acknowledgment sound
                playAcknowledgmentSound();
                
                // Clear transcript after a delay
                setTimeout(() => {
                    transcriptDisplay.textContent = "";
                }, 3000);
            } else {
                // Update with interim results
                const interimTranscript = event.results[0][0].transcript;
                transcriptDisplay.textContent = interimTranscript;
            }
        };

        function processVoiceCommand(transcript) {
            // Navigation commands
            if (transcript.includes("go to") || transcript.includes("navigate to") || transcript.includes("open")) {
                navigateByVoice(transcript);
            } 
            // Scrolling commands
            else if (transcript.includes("scroll down")) {
                window.scrollBy({ top: 300, behavior: "smooth" });
            } else if (transcript.includes("scroll up")) {
                window.scrollBy({ top: -300, behavior: "smooth" });
            } else if (transcript.includes("page down")) {
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
            } else if (transcript.includes("page up")) {
                window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
            } else if (transcript.includes("scroll to top") || transcript.includes("top") || transcript.includes("beginning")) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (transcript.includes("scroll to bottom") || transcript.includes("bottom") || transcript.includes("end")) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            } 
            // Theme commands
            else if (transcript.includes("dark mode") || transcript.includes("light mode") || transcript.includes("toggle theme")) {
                document.getElementById("theme-toggle").click();
                showCommandFeedback("Theme toggled");
            } 
            // Menu commands
            else if (transcript.includes("open menu")) {
                const navToggle = document.getElementById("nav-toggle");
                if (navToggle && !document.getElementById("slide-menu").classList.contains("active")) {
                    navToggle.click();
                    showCommandFeedback("Menu opened");
                }
            } else if (transcript.includes("close menu")) {
                const navToggle = document.getElementById("nav-toggle");
                if (navToggle && document.getElementById("slide-menu").classList.contains("active")) {
                    navToggle.click();
                    showCommandFeedback("Menu closed");
                }
            } 
            // Language commands
            else if (transcript.includes("change language") || transcript.includes("switch language")) {
                const langMatch = transcript.match(/language to (\w+)/);
                if (langMatch && langMatch[1]) {
                    const lang = mapSpokenLanguageToCode(langMatch[1]);
                    if (lang) {
                        changeLanguageByVoice(lang);
                        showCommandFeedback(`Changing language to ${lang}`);
                    }
                }
            } 
            // Search commands
            else if (transcript.includes("search for") || transcript.includes("find")) {
                const searchMatch = transcript.match(/search for (.*)|find (.*)/);
                if (searchMatch) {
                    const searchTerm = searchMatch[1] || searchMatch[2];
                    const searchInput = document.getElementById("portfolio-search");
                    if (searchInput && searchTerm) {
                        searchInput.value = searchTerm;
                        searchInput.dispatchEvent(new Event("input"));
                        showCommandFeedback(`Searching for "${searchTerm}"`);
                    }
                }
            }
            // Audio control commands
            else if (transcript.includes("play introduction")) {
                playIntroAudio();
                showCommandFeedback("Playing introduction");
            } else if (transcript.includes("stop audio") || transcript.includes("stop playing")) {
                stopAllAudio();
                showCommandFeedback("Audio stopped");
            }
            // Zoom commands
            else if (transcript.includes("zoom in")) {
                zoomContent(1.1);
                showCommandFeedback("Zooming in");
            } else if (transcript.includes("zoom out")) {
                zoomContent(0.9);
                showCommandFeedback("Zooming out");
            } else if (transcript.includes("reset zoom")) {
                resetZoom();
                showCommandFeedback("Zoom reset");
            }
            // Screenshot command (might require permissions)
            else if (transcript.includes("screenshot") || transcript.includes("take a picture")) {
                try {
                    // This is just a visual effect since actual screenshot requires permissions
                    takeScreenshotEffect();
                    showCommandFeedback("Screenshot effect shown");
                } catch (e) {
                    console.warn("Screenshot not available:", e);
                }
            }
            // Help command
            else if (transcript.includes("help") || transcript.includes("commands") || transcript.includes("what can i say")) {
                helpModal.classList.add("show");
                showCommandFeedback("Opening help");
            }
        }

        function mapSpokenLanguageToCode(spokenLanguage) {
            const languageMap = {
                "english": "en",
                "arabic": "ar",
                "bengali": "bn",
                "hindi": "hi"
            };
            
            return languageMap[spokenLanguage.toLowerCase()] || null;
        }

        function changeLanguageByVoice(langCode) {
            // Find language option and click it
            const langOptions = document.querySelectorAll(".lang-dropdown a");
            for (const option of langOptions) {
                if (option.getAttribute("data-lang") === langCode) {
                    option.click();
                    break;
                }
            }
        }

        function playIntroAudio() {
            try {
                const audio = new Audio("intro.mp3");
                audio.play().catch(err => console.warn("Could not play intro audio:", err));
            } catch (e) {
                console.warn("Intro audio not available:", e);
            }
        }

        function stopAllAudio() {
            document.querySelectorAll("audio, video").forEach(el => {
                if (!el.paused) {
                    el.pause();
                }
            });
        }

        let currentZoom = 1;
        function zoomContent(factor) {
            currentZoom *= factor;
            // Limit zoom range
            currentZoom = Math.min(Math.max(0.5, currentZoom), 2);
            document.body.style.transform = `scale(${currentZoom})`;
            document.body.style.transformOrigin = "center top";
        }

        function resetZoom() {
            currentZoom = 1;
            document.body.style.transform = "scale(1)";
        }

        function takeScreenshotEffect() {
            const flashEffect = document.createElement("div");
            flashEffect.className = "screenshot-flash";
            document.body.appendChild(flashEffect);
            
            // Camera shutter sound
            const shutterSound = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
            shutterSound.play().catch(e => console.warn("Could not play shutter sound:", e));
            
            setTimeout(() => {
                flashEffect.remove();
            }, 500);
        }

        function showCommandFeedback(message) {
            const feedbackToast = document.createElement("div");
            feedbackToast.className = "voice-command-feedback";
            feedbackToast.innerHTML = `
                <div class="feedback-content">
                    <i class="fas fa-check-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(feedbackToast);
            
            setTimeout(() => {
                feedbackToast.classList.add("show");
            }, 10);
            
            setTimeout(() => {
                feedbackToast.classList.remove("show");
                setTimeout(() => feedbackToast.remove(), 300);
            }, 2000);
        }

        function navigateByVoice(command) {
            const sections = {
                "about": "#about",
                "summary": "#about",
                "education": "#education",
                "certifications": "#certifications",
                "skills": "#skills",
                "work": "#work",
                "experience": "#work",
                "projects": "#projects",
                "research": "#projects",
                "trainings": "#trainings",
                "activities": "#activities",
                "extracurricular": "#activities",
                "gallery": "#gallery",
                "interests": "#interests",
                "hobbies": "#interests",
                "languages": "#languages",
                "resume": "#resume",
                "contact": "#contact"
            };

            for (const [keyword, selector] of Object.entries(sections)) {
                if (command.includes(keyword)) {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                        showCommandFeedback(`Navigating to ${keyword}`);
                        break;
                    }
                }
            }
        }

        function playAcknowledgmentSound() {
            const audio = new Audio();
            audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="; // Minimal sound
            audio.play().catch(err => console.warn("Could not play audio:", err));
        }

        // Voice visualization animation
        function animateVoiceBars(isListening) {
            const bars = visualizer.querySelectorAll(".voice-bar");
            if (isListening) {
                bars.forEach(bar => {
                    bar.style.animationPlayState = "running";
                    // Randomize animation delay for each bar
                    bar.style.animationDelay = `${Math.random() * 0.5}s`;
                });
                visualizer.classList.add("active");
            } else {
                bars.forEach(bar => {
                    bar.style.animationPlayState = "paused";
                });
                visualizer.classList.remove("active");
            }
        }

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            voiceNavButton.classList.remove("listening");
            animateVoiceBars(false);
            visualizer.classList.remove("active");
            
            // Show error message
            if (event.error === "no-speech") {
                showCommandFeedback("No speech detected. Try again.");
            } else {
                showCommandFeedback(`Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            voiceNavButton.classList.remove("listening");
            animateVoiceBars(false);
            visualizer.classList.remove("active");
        };

        recognition.onstart = () => {
            animateVoiceBars(true);
        };

        voiceNavButton.addEventListener("click", () => {
            if (voiceNavButton.classList.contains("listening")) {
                recognition.stop();
                voiceNavButton.classList.remove("listening");
                animateVoiceBars(false);
                visualizer.classList.remove("active");
            } else {
                // Provide visual feedback
                const feedbackToast = document.createElement("div");
                feedbackToast.className = "voice-nav-toast";
                feedbackToast.innerHTML = `
                    <div class="toast-content">
                        <i class="fas fa-microphone"></i>
                        <span>Listening for commands... Say "help" for available commands</span>
                    </div>
                `;
                document.body.appendChild(feedbackToast);
                
                setTimeout(() => {
                    feedbackToast.classList.add("show");
                }, 10);
                
                setTimeout(() => {
                    feedbackToast.classList.remove("show");
                    setTimeout(() => feedbackToast.remove(), 300);
                }, 3000);
                
                // Start recognition
                try {
                    recognition.start();
                    voiceNavButton.classList.add("listening");
                    animateVoiceBars(true);
                    visualizer.classList.add("active");
                } catch (e) {
                    console.error("Recognition error:", e);
                    showCommandFeedback("Error starting voice recognition");
                }
            }
        });

        // Keyboard shortcut for voice navigation (Alt+V)
        document.addEventListener("keydown", (e) => {
            if (e.altKey && e.key === "v") {
                e.preventDefault();
                voiceNavButton.click();
            }
            // Escape key to stop listening
            if (e.key === "Escape" && voiceNavButton.classList.contains("listening")) {
                recognition.stop();
            }
        });

        // Add CSS for voice navigation
        const style = document.createElement("style");
        style.innerHTML = `
            /* Voice Navigation Button */
            .voice-nav-btn, .voice-help-btn {
                background: transparent;
                border: none;
                color: var(--text-color);
                font-size: 1.2rem;
                cursor: pointer;
                width: 4vh;
                height: 4vh;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .voice-nav-btn:hover, .voice-help-btn:hover {
                background: rgba(var(--primary-rgb), 0.1);
                transform: scale(1.1);
            }
            
            .voice-nav-btn.listening {
                animation: pulse 1.5s infinite;
                color: var(--primary-color);
                background: rgba(var(--primary-rgb), 0.2);
            }
            
            .voice-help-btn {
                font-size: 1rem;
            }
            
            /* Voice Navigation Toast */
            .voice-nav-toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(2rem);
                background: var(--card-bg);
                padding: 1rem 1.5rem;
                border-radius: 2rem;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .voice-nav-toast.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            
            .voice-nav-toast .toast-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .voice-nav-toast i {
                color: var(--primary-color);
                animation: pulse 1.5s infinite;
            }
            
            /* Voice Command Feedback */
            .voice-command-feedback {
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
            
            .voice-command-feedback.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .voice-command-feedback .feedback-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .voice-command-feedback i {
                color: var(--primary-color);
            }
            
            /* Voice Visualizer */
            .voice-visualizer {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--card-bg);
                padding: 1rem;
                border-radius: 1rem;
                box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
                z-index: 999;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                opacity: 0;
                transform: scale(0.9);
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .voice-visualizer.active {
                opacity: 1;
                transform: scale(1);
            }
            
            .voice-visualizer-container {
                display: flex;
                align-items: flex-end;
                gap: 0.25rem;
                height: 3rem;
                width: 10rem;
            }
            
            .voice-bar {
                width: 0.5rem;
                height: 0.5rem;
                background: var(--primary-color);
                border-radius: 0.25rem;
                animation: voice-bar 1.5s ease-in-out infinite;
                animation-play-state: paused;
            }
            
            .voice-transcript {
                font-size: 0.85rem;
                color: var(--text-color);
                text-align: center;
                min-height: 1.2rem;
                max-width: 15rem;
                overflow-wrap: break-word;
            }
            
            @keyframes voice-bar {
                0%, 100% {
                    height: 0.5rem;
                }
                50% {
                    height: 2.5rem;
                }
            }
            
            /* Screenshot Flash Effect */
            .screenshot-flash {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                opacity: 0.8;
                z-index: 9999;
                pointer-events: none;
                animation: flash 0.5s ease-out;
            }
            
            @keyframes flash {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
            
            /* Voice Help Modal */
            .voice-help-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .voice-help-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .voice-help-modal-content {
                background: var(--card-bg);
                border-radius: 1rem;
                width: 90%;
                max-width: 50rem;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
                transform: scale(0.9);
                transition: all 0.3s ease;
            }
            
            .voice-help-modal.show .voice-help-modal-content {
                transform: scale(1);
            }
            
            .voice-help-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .voice-help-modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
                color: var(--text-color);
            }
            
            .voice-help-close {
                background: transparent;
                border: none;
                color: var(--text-color);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .voice-help-close:hover {
                background: rgba(var(--primary-rgb), 0.1);
                transform: scale(1.1);
            }
            
            .voice-help-modal-body {
                padding: 1.5rem;
            }
            
            .voice-help-section {
                margin-bottom: 1.5rem;
            }
            
            .voice-help-section h4 {
                margin: 0 0 0.75rem 0;
                font-size: 1.2rem;
                color: var(--primary-color);
            }
            
            .voice-help-section ul {
                margin: 0;
                padding-left: 1.5rem;
            }
            
            .voice-help-section li {
                margin-bottom: 0.5rem;
            }
            
            .voice-help-modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid var(--border-color);
                text-align: center;
                font-size: 0.9rem;
                color: var(--text-color-light);
            }
            
            .voice-help-modal-footer i {
                color: var(--primary-color);
            }
            
            /* Responsive styles */
            @media (max-width: 768px) {
                .voice-help-modal-content {
                    width: 95%;
                }
                
                .voice-visualizer {
                    bottom: 1rem;
                    right: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    };

    document.addEventListener("DOMContentLoaded", initVoiceNavigation);
})();