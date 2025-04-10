(() => {
    "use strict";
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) =>
        parent.querySelectorAll(selector);
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    const random = (min, max) => Math.random() * (max - min) + min;
    const requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        ((callback) => window.setTimeout(callback, 1000 / 60));
    class ProjectShowcase {
        constructor() {
            this.projects = [];
            this.currentProject = null;
            this.currentGameInstance = null; 
            this.container = null;
            this.isDarkMode =
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            this.soundEnabled = true;
            this.gameStates = this.loadGameStates(); 
            this.activeListeners = []; 
            this.audioContext = null; 
            this.particleEffects = true; 
            this.gamepadSupport = false; 
            this.recentlyPlayed = []; 
            this.lastPlayedTime = {}; 
            this.achievementSystem = new AchievementSystem(this); 
        }
        init() {
            this.createTriggerButton();
            this.createContainer();
            this.addEventListeners();
            this.addStyles(); 
            this.loadProjects(); 
            this.populateGameList(); 
            this.updateFooterStats(); 
            this.applyInitialTheme(); 
            setTimeout(() => {
                this.container.classList.add("loaded");
                this.loadRandomProject();
            }, 500); 
        }
        createContainer() {
            this.container = document.createElement("div");
            this.container.className = "project-showcase"; 
            this.container.innerHTML = `
                <div class="showcase-header">
                    <div class="showcase-title-area">
                        <div class="showcase-logo-wrapper">
                            <i class="fas fa-crown logo-icon"></i>
                        </div>
                        <h3>Legendary HTML5 Arcade</h3>
                    </div>
                    <div class="showcase-controls">
                        <button class="toggle-effects" title="Toggle Visual Effects"><i class="fas fa-bolt"></i></button>
                        <button class="toggle-achievements" title="View Achievements"><i class="fas fa-trophy"></i></button>
                        <button class="toggle-darkmode" title="Toggle Theme"><i class="fas fa-palette"></i></button>
                        <button class="showcase-fullscreen" title="Toggle Fullscreen"><i class="fas fa-expand-arrows-alt"></i></button>
                        <button class="showcase-minimize" title="Minimize"><i class="fas fa-window-minimize"></i></button>
                        <button class="showcase-close" title="Close"><i class="fas fa-times-circle"></i></button>
                    </div>
                </div>
                <div class="showcase-content">
                    <div class="showcase-sidebar">
                        <div class="search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="project-search" placeholder="Search legendary games...">
                        </div>
                        <div class="category-filters">
                        </div>
                        <div class="game-tab-controls">
                            <button class="game-tab-btn active" data-tab="all"><i class="fas fa-th"></i> All Games</button>
                            <button class="game-tab-btn" data-tab="recent"><i class="fas fa-history"></i> Recently Played</button>
                            <button class="game-tab-btn" data-tab="favorites"><i class="fas fa-star"></i> Favorites</button>
                        </div>
                        <div class="project-list-wrapper">
                            <div class="project-list"></div>
                        </div>
                        <div class="showcase-sidebar-footer">
                            <div class="gamepad-status">
                                <i class="fas fa-gamepad"></i> <span class="gamepad-text">No gamepad detected</span>
                            </div>
                        </div>
                    </div>
                    <div class="showcase-main">
                        <div class="project-view">
                            <div class="project-preview-wrapper">
                                <div class="project-preview">
                                    <div class="loading-indicator">
                                        <div class="loading-spinner"></div>
                                        <span>Loading Game...</span>
                                    </div>
                                </div>
                                <div class="game-overlay">
                                    <div class="game-pause-menu">
                                        <h4>Game Paused</h4>
                                        <div class="pause-menu-buttons">
                                            <button class="resume-btn"><i class="fas fa-play"></i> Resume</button>
                                            <button class="restart-btn"><i class="fas fa-redo"></i> Restart</button>
                                            <button class="exit-btn"><i class="fas fa-times"></i> Exit Game</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="project-info">
                                <h4 class="project-title">Select an Epic Game</h4>
                                <p class="project-description">Choose a game from our legendary list to begin your adventure.</p>
                                <div class="project-stats-display">
                                    <div class="score-container">
                                        <span class="current-score">Score: 0</span> | <span class="high-score">High Score: 0</span>
                                    </div>
                                    <div class="play-count">Plays: 0</div>
                                </div>
                                <div class="project-controls">
                                    <button class="game-fullscreen-btn" title="Game Fullscreen"><i class="fas fa-expand"></i></button>
                                    <button class="game-restart-btn" title="Restart Game"><i class="fas fa-redo-alt"></i></button>
                                    <button class="game-sound-btn" title="Toggle Sound"><i class="fas fa-volume-up"></i></button>
                                    <button class="game-favorite-btn" title="Add to Favorites"><i class="far fa-star"></i></button>
                                    <button class="game-share-btn" title="Share Game"><i class="fas fa-share-alt"></i></button>
                                </div>
                            </div>
                            <div class="game-instructions">
                                <h5><i class="fas fa-info-circle"></i> How to Play</h5>
                                <p class="instructions-text">Select a game to see instructions.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="showcase-footer">
                    <div class="project-stats">
                        <span class="games-count">0 Games</span>
                        <span class="footer-separator">|</span>
                        <span class="games-categories">Loading...</span>
                        <span class="footer-separator">|</span>
                        <span class="achievement-progress">Achievements: 0%</span>
                    </div>
                    <div class="project-actions">
                        <button class="random-game-btn"><i class="fas fa-dice"></i> Random Game</button>
                    </div>
                </div>
                <canvas class="particle-canvas"></canvas>
            `;
            document.body.appendChild(this.container);
            this.initParticleEffects();
        }
        createTriggerButton() {
            const button = document.createElement("button");
            button.className = "showcase-trigger";
            button.innerHTML = '<i class="fas fa-gamepad-alt"></i> Open Arcade';
            button.addEventListener("click", () => this.show());
            document.body.appendChild(button); 
            this.triggerButton = button;
        }
        initParticleEffects() {
            const canvas = $(".particle-canvas", this.container);
            if (!canvas) return;
            this.particleCanvas = canvas;
            this.particleCtx = canvas.getContext("2d");
            this.particles = [];
            this.particleCount = 50;
            this.resizeParticleCanvas();
            try {
                this.particleEffects = JSON.parse(
                    localStorage.getItem("game-particles-enabled") || "true"
                );
            } catch (e) {
                this.particleEffects = true; 
            }
            const effectsButton = $(".toggle-effects", this.container);
            if (effectsButton) {
                if (this.particleEffects) {
                    effectsButton.classList.add("active");
                } else {
                    effectsButton.classList.remove("active");
                }
            }
            for (let i = 0; i < this.particleCount; i++) {
                this.createParticle();
            }
            if (this.particleEffects) {
                this.startParticleAnimation();
            }
            window.addEventListener("resize", () =>
                this.resizeParticleCanvas()
            );
        }
        createParticle(x, y, usePremiumEffects = false) {
            const posX =
                x !== undefined ? x : Math.random() * this.particleCanvas.width;
            const posY =
                y !== undefined
                    ? y
                    : Math.random() * this.particleCanvas.height;
            const particle = {
                x: posX,
                y: posY,
                radius: Math.random() * 3 + 1,
                color: this.getRandomParticleColor(),
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                life: 1, 
                maxLife: usePremiumEffects ? 0.5 + Math.random() * 0.5 : 1, 
            };
            if (usePremiumEffects) {
                particle.glow = true;
                particle.pulse = 0;
                particle.pulseSpeed = 0.02 + Math.random() * 0.03;
                particle.sparkle = Math.random() > 0.7;
            }
            this.particles.push(particle);
            return particle;
        }
        resizeParticleCanvas() {
            if (!this.particleCanvas) return;
            this.particleCanvas.width = this.container.clientWidth;
            this.particleCanvas.height = this.container.clientHeight;
        }
        getRandomParticleColor() {
            const colors = [
                "#fbcb5b", 
                "#e67e22", 
                "#f39c12", 
                "#3498db", 
                "#9b59b6", 
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        startParticleAnimation() {
            if (this.particleAnimationFrame) {
                cancelAnimationFrame(this.particleAnimationFrame);
            }
            const animate = () => {
                if (
                    !this.particleEffects ||
                    !this.container.classList.contains("active")
                ) {
                    this.particleAnimationFrame = null;
                    return;
                }
                this.particleCtx.clearRect(
                    0,
                    0,
                    this.particleCanvas.width,
                    this.particleCanvas.height
                );
                for (let i = 0; i < this.particles.length; i++) {
                    const p = this.particles[i];
                    p.x += p.speedX;
                    p.y += p.speedY;
                    if (p.x < 0) p.x = this.particleCanvas.width;
                    if (p.x > this.particleCanvas.width) p.x = 0;
                    if (p.y < 0) p.y = this.particleCanvas.height;
                    if (p.y > this.particleCanvas.height) p.y = 0;
                    this.particleCtx.beginPath();
                    this.particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.particleCtx.globalAlpha = p.opacity;
                    this.particleCtx.fillStyle = p.color;
                    this.particleCtx.fill();
                }
                this.particleCtx.globalAlpha = 0.2;
                this.particleCtx.strokeStyle = "#ffffff";
                this.particleCtx.lineWidth = 0.5;
                for (let i = 0; i < this.particles.length; i++) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        const p1 = this.particles[i];
                        const p2 = this.particles[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 100) {
                            this.particleCtx.beginPath();
                            this.particleCtx.moveTo(p1.x, p1.y);
                            this.particleCtx.lineTo(p2.x, p2.y);
                            this.particleCtx.stroke();
                        }
                    }
                }
                this.particleCtx.globalAlpha = 1;
                this.particleAnimationFrame = requestAnimFrame(animate);
            };
            this.particleAnimationFrame = requestAnimFrame(animate);
        }
        toggleParticleEffects() {
            this.particleEffects = !this.particleEffects;
            if (this.particleEffects) {
                this.startParticleAnimation();
                $(".toggle-effects", this.container).classList.add("active");
            } else {
                if (this.particleAnimationFrame) {
                    cancelAnimationFrame(this.particleAnimationFrame);
                    this.particleAnimationFrame = null;
                }
                $(".toggle-effects", this.container).classList.remove("active");
            }
            try {
                localStorage.setItem(
                    "game-particles-enabled",
                    JSON.stringify(this.particleEffects)
                );
            } catch (e) {}
            this.showParticleToggleEffect();
            this.playSound("click");
        }
        showParticleToggleEffect() {
            const effect = document.createElement("div");
            effect.className = "toggle-effects-animation";
            effect.style.position = "absolute";
            effect.style.top = "0";
            effect.style.left = "0";
            effect.style.width = "100%";
            effect.style.height = "100%";
            effect.style.pointerEvents = "none";
            effect.style.background = this.particleEffects
                ? "radial-gradient(circle, rgba(251,203,91,0.15) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 70%)";
            effect.style.opacity = "0";
            effect.style.transition = "opacity 0.5s ease-out";
            effect.style.zIndex = "1000";
            this.container.appendChild(effect);
            setTimeout(() => {
                effect.style.opacity = "1";
                setTimeout(() => {
                    effect.style.opacity = "0";
                    setTimeout(() => effect.remove(), 500);
                }, 500);
            }, 10);
        }
        initGamepadSupport() {
            this.gamepadSupport = "getGamepads" in navigator;
            if (!this.gamepadSupport) {
                return;
            }
            const gamepadText = $(".gamepad-text", this.container);
            if (gamepadText) {
                gamepadText.textContent = "Waiting for gamepad...";
            }
            window.addEventListener("gamepadconnected", (e) => {
                this.handleGamepadConnected(e.gamepad);
            });
            window.addEventListener("gamepaddisconnected", (e) => {
                this.handleGamepadDisconnected(e.gamepad);
            });
            this.pollGamepads();
        }
        pollGamepads() {
            if (!this.gamepadSupport) return;
            const gamepads = navigator.getGamepads
                ? navigator.getGamepads()
                : [];
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    this.handleGamepadConnected(gamepads[i]);
                    break; 
                }
            }
            setTimeout(() => this.pollGamepads(), 5000);
        }
        handleGamepadConnected(gamepad) {
            const gamepadText = $(".gamepad-text", this.container);
            if (gamepadText) {
                gamepadText.textContent = `${
                    gamepad.id.split("(")[0]
                } Connected`;
                $(".gamepad-status", this.container).classList.add("connected");
            }
            this.activeGamepad = gamepad.index;
            if (!this.gamepadLoopRunning) {
                this.gamepadLoopRunning = true;
                this.gamepadLoop();
            }
        }
        handleGamepadDisconnected(gamepad) {
            const gamepadText = $(".gamepad-text", this.container);
            if (gamepadText) {
                gamepadText.textContent = "No gamepad detected";
                $(".gamepad-status", this.container).classList.remove(
                    "connected"
                );
            }
            if (this.activeGamepad === gamepad.index) {
                this.activeGamepad = null;
            }
        }
        gamepadLoop() {
            if (!this.activeGamepad && this.activeGamepad !== 0) {
                this.gamepadLoopRunning = false;
                return;
            }
            const gamepads = navigator.getGamepads
                ? navigator.getGamepads()
                : [];
            const gamepad = gamepads[this.activeGamepad];
            if (!gamepad) {
                this.gamepadLoopRunning = false;
                return;
            }
            if (gamepad.buttons[0].pressed && !this.lastButtonState?.a) {
                const selectedItem = $(
                    ".project-item.selected",
                    this.container
                );
                if (selectedItem) {
                    this.loadProject(selectedItem.dataset.id);
                }
            }
            if (gamepad.buttons[1].pressed && !this.lastButtonState?.b) {
                if (this.currentProject) {
                    this.loadProject(null);
                } else {
                    this.hide();
                }
            }
            const dpadUpPressed =
                gamepad.buttons[12].pressed && !this.lastButtonState?.dpadUp;
            const dpadDownPressed =
                gamepad.buttons[13].pressed && !this.lastButtonState?.dpadDown;
            const dpadLeftPressed =
                gamepad.buttons[14].pressed && !this.lastButtonState?.dpadLeft;
            const dpadRightPressed =
                gamepad.buttons[15].pressed && !this.lastButtonState?.dpadRight;
            if (
                dpadUpPressed ||
                dpadDownPressed ||
                dpadLeftPressed ||
                dpadRightPressed
            ) {
                this.navigateGameListWithGamepad(
                    dpadUpPressed,
                    dpadDownPressed,
                    dpadLeftPressed,
                    dpadRightPressed
                );
            }
            this.lastButtonState = {
                a: gamepad.buttons[0].pressed,
                b: gamepad.buttons[1].pressed,
                dpadUp: gamepad.buttons[12].pressed,
                dpadDown: gamepad.buttons[13].pressed,
                dpadLeft: gamepad.buttons[14].pressed,
                dpadRight: gamepad.buttons[15].pressed,
            };
            requestAnimFrame(() => this.gamepadLoop());
        }
        navigateGameListWithGamepad(up, down, left, right) {
            const gameItems = $$(".project-item:not(.hidden)", this.container);
            if (!gameItems.length) return;
            let selectedItem = $(".project-item.selected", this.container);
            let newIndex = 0;
            if (selectedItem) {
                const currentIndex = Array.from(gameItems).indexOf(
                    selectedItem
                );
                if (up) {
                    newIndex = Math.max(0, currentIndex - 1);
                } else if (down) {
                    newIndex = Math.min(gameItems.length - 1, currentIndex + 1);
                } else if (right) {
                    newIndex = Math.min(gameItems.length - 1, currentIndex + 3);
                } else if (left) {
                    newIndex = Math.max(0, currentIndex - 3);
                }
            }
            $$(".project-item.selected", this.container).forEach((item) =>
                item.classList.remove("selected")
            );
            gameItems[newIndex].classList.add("selected");
            gameItems[newIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
            this.playSound("navigate");
        }
        addEventListeners() {
            $(".showcase-close", this.container).addEventListener("click", () =>
                this.hide()
            );
            $(".showcase-minimize", this.container).addEventListener(
                "click",
                () => this.toggleMinimize()
            );
            $(".showcase-fullscreen", this.container).addEventListener(
                "click",
                () => this.toggleFullscreen()
            );
            $(".toggle-darkmode", this.container).addEventListener(
                "click",
                () => this.toggleDarkMode()
            );
            $(".toggle-effects", this.container).addEventListener("click", () =>
                this.toggleParticleEffects()
            );
            $(".toggle-achievements", this.container).addEventListener(
                "click",
                () => this.achievementSystem.showAllAchievements()
            );
            const searchInput = $(".project-search", this.container);
            searchInput.addEventListener(
                "input",
                debounce((e) => this.filterProjects(e.target.value), 300)
            );
            $(".random-game-btn", this.container).addEventListener(
                "click",
                () => this.loadRandomProject()
            );
            const tabContainer = $(".game-tab-controls", this.container);
            if (tabContainer) {
                tabContainer.addEventListener("click", (e) => {
                    const btn = e.target.closest(".game-tab-btn");
                    if (btn) {
                        $$(".game-tab-btn", this.container).forEach((b) =>
                            b.classList.remove("active")
                        );
                        btn.classList.add("active");
                        const tab = btn.dataset.tab;
                        switch (tab) {
                            case "all":
                                this.filterProjects(""); 
                                break;
                            case "recent":
                                this.showRecentlyPlayed();
                                break;
                            case "favorites":
                                this.showFavorites();
                                break;
                        }
                        this.playSound("click");
                    }
                });
            }
            $(".game-fullscreen-btn", this.container).addEventListener(
                "click",
                () => this.toggleGameFullscreen()
            );
            $(".game-restart-btn", this.container).addEventListener(
                "click",
                () => this.restartCurrentGame()
            );
            $(".game-sound-btn", this.container).addEventListener("click", () =>
                this.toggleGameSound()
            );
            const favoriteBtn = $(".game-favorite-btn", this.container);
            if (favoriteBtn) {
                favoriteBtn.addEventListener("click", () =>
                    this.toggleFavorite()
                );
            }
            const shareBtn = $(".game-share-btn", this.container);
            if (shareBtn) {
                shareBtn.addEventListener("click", () => this.shareGame());
            }
            const resumeBtn = $(".resume-btn", this.container);
            if (resumeBtn) {
                resumeBtn.addEventListener("click", () => this.resumeGame());
            }
            const pauseRestartBtn = $(".restart-btn", this.container);
            if (pauseRestartBtn) {
                pauseRestartBtn.addEventListener("click", () => {
                    this.resumeGame();
                    this.restartCurrentGame();
                });
            }
            const exitBtn = $(".exit-btn", this.container);
            if (exitBtn) {
                exitBtn.addEventListener("click", () => {
                    this.resumeGame();
                    this.loadProject(null); 
                });
            }
            $(".category-filters", this.container).addEventListener(
                "click",
                (e) => {
                    if (e.target.classList.contains("category-btn")) {
                        $$(".category-btn", this.container).forEach((b) =>
                            b.classList.remove("active")
                        );
                        e.target.classList.add("active");
                        this.filterProjectsByCategory(
                            e.target.dataset.category
                        );
                        this.playSound("click");
                    }
                }
            );
            $(".project-list", this.container).addEventListener(
                "click",
                (e) => {
                    const item = e.target.closest(".project-item");
                    if (item) {
                        $$(
                            ".project-item.selected",
                            this.container
                        ).forEach((i) => i.classList.remove("selected"));
                        item.classList.add("selected");
                        this.loadProject(item.dataset.id);
                    }
                }
            );
            $(".project-list", this.container).addEventListener(
                "mouseover",
                (e) => {
                    const item = e.target.closest(".project-item");
                    if (item && this.particleEffects) {
                        this.createItemHoverEffect(item);
                    }
                }
            );
            this.addManagedListener(document, "keydown", (e) => {
                if (!this.container.classList.contains("active")) return;
                if (e.key === "Escape") {
                    if (
                        this.currentProject &&
                        !$(".game-overlay", this.container).classList.contains(
                            "visible"
                        )
                    ) {
                        this.pauseGame();
                        e.preventDefault();
                        return;
                    }
                    else if (
                        this.currentProject &&
                        $(".game-overlay", this.container).classList.contains(
                            "visible"
                        )
                    ) {
                        this.resumeGame();
                        e.preventDefault();
                        return;
                    }
                    else if (!this.container.classList.contains("fullscreen")) {
                        this.hide();
                        e.preventDefault();
                        return;
                    }
                }
                if (e.key === "f") {
                    if (this.currentProject) {
                        this.toggleGameFullscreen();
                    } else {
                        this.toggleFullscreen();
                    }
                    e.preventDefault();
                    return;
                }
                if (!this.currentProject) {
                    switch (e.key) {
                        case "ArrowUp":
                        case "ArrowDown":
                        case "ArrowLeft":
                        case "ArrowRight":
                            this.navigateGameListWithKeyboard(e.key);
                            e.preventDefault();
                            break;
                        case "Enter":
                            const selectedItem = $(
                                ".project-item.selected",
                                this.container
                            );
                            if (selectedItem) {
                                this.loadProject(selectedItem.dataset.id);
                                e.preventDefault();
                            }
                            break;
                    }
                }
            });
            this.initGamepadSupport();
        }
        navigateGameListWithKeyboard(key) {
            const gameItems = $$(".project-item:not(.hidden)", this.container);
            if (!gameItems.length) return;
            let selectedItem = $(".project-item.selected", this.container);
            let currentIndex = selectedItem
                ? Array.from(gameItems).indexOf(selectedItem)
                : -1;
            let newIndex = currentIndex;
            switch (key) {
                case "ArrowUp":
                    newIndex =
                        currentIndex > 0
                            ? currentIndex - 1
                            : gameItems.length - 1;
                    break;
                case "ArrowDown":
                    newIndex =
                        currentIndex < gameItems.length - 1
                            ? currentIndex + 1
                            : 0;
                    break;
                case "ArrowLeft":
                    newIndex =
                        currentIndex > 0
                            ? currentIndex - 1
                            : gameItems.length - 1;
                    break;
                case "ArrowRight":
                    newIndex =
                        currentIndex < gameItems.length - 1
                            ? currentIndex + 1
                            : 0;
                    break;
            }
            $$(".project-item.selected", this.container).forEach((item) =>
                item.classList.remove("selected")
            );
            gameItems[newIndex].classList.add("selected");
            gameItems[newIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
            this.playSound("navigate");
        }
        createItemHoverEffect(item) {
            const rect = item.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            const particleCount = Math.floor(Math.random() * 5) + 5;
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 3 + 1;
                const speed = Math.random() * 2 + 1;
                const angle = Math.random() * Math.PI * 2;
                const opacity = Math.random() * 0.5 + 0.5;
                const color =
                    item.dataset.color || this.getRandomParticleColor();
                this.particles.push({
                    x,
                    y,
                    radius: size,
                    color,
                    speedX: Math.cos(angle) * speed,
                    speedY: Math.sin(angle) * speed,
                    opacity,
                    life: 30,
                    maxLife: 30,
                });
            }
        }
        pauseGame() {
            if (!this.currentProject) return;
            const overlay = $(".game-overlay", this.container);
            if (overlay) {
                overlay.classList.add("visible");
                if (
                    this.currentGameInstance &&
                    typeof this.currentGameInstance.pause === "function"
                ) {
                    this.currentGameInstance.pause();
                }
                this.playSound("pause");
            }
        }
        resumeGame() {
            const overlay = $(".game-overlay", this.container);
            if (overlay) {
                overlay.classList.remove("visible");
                if (
                    this.currentGameInstance &&
                    typeof this.currentGameInstance.resume === "function"
                ) {
                    this.currentGameInstance.resume();
                }
                this.playSound("unpause");
            }
        }
        toggleFavorite() {
            if (!this.currentProject) return;
            const projectId = this.currentProject.id;
            let favorites = [];
            try {
                favorites = JSON.parse(
                    localStorage.getItem("game-favorites") || "[]"
                );
            } catch (e) {}
            const isFavorite = favorites.includes(projectId);
            if (isFavorite) {
                favorites = favorites.filter((id) => id !== projectId);
                $(".game-favorite-btn i", this.container).className =
                    "far fa-star";
            } else {
                favorites.push(projectId);
                $(".game-favorite-btn i", this.container).className =
                    "fas fa-star";
                this.showStarBurstEffect();
            }
            try {
                localStorage.setItem(
                    "game-favorites",
                    JSON.stringify(favorites)
                );
            } catch (e) {}
            this.playSound(isFavorite ? "unfavorite" : "favorite");
        }
        showStarBurstEffect() {
            const btn = $(".game-favorite-btn", this.container);
            if (!btn) return;
            const container = document.createElement("div");
            container.className = "star-burst-container";
            container.style.position = "absolute";
            container.style.pointerEvents = "none";
            const rect = btn.getBoundingClientRect();
            const parentRect = this.container.getBoundingClientRect();
            container.style.left =
                rect.left - parentRect.left + rect.width / 2 + "px";
            container.style.top =
                rect.top - parentRect.top + rect.height / 2 + "px";
            for (let i = 0; i < 12; i++) {
                const star = document.createElement("div");
                star.className = "burst-star";
                star.innerHTML = '<i class="fas fa-star"></i>';
                const angle = (i / 12) * Math.PI * 2;
                const distance = 60;
                const delay = i * 50;
                star.style.transform = `translate(-50%, -50%)`;
                star.style.setProperty("--angle", angle + "rad");
                star.style.setProperty("--distance", distance + "px");
                star.style.setProperty("--delay", delay + "ms");
                container.appendChild(star);
            }
            this.container.appendChild(container);
            setTimeout(() => {
                container.remove();
            }, 1500);
        }
        shareGame() {
            if (!this.currentProject) return;
            this.playSound("click");
            alert(
                `Share ${
                    this.currentProject.name
                }:\n\nTry out this awesome HTML5 game: ${
                    this.currentProject.name
                } in the Legendary HTML5 Arcade!\n\nCategory: ${
                    this.currentProject.category
                }\nMy High Score: ${this.getHighScore()}`
            );
        }
        showRecentlyPlayed() {
            const projectItems = $$(".project-item", this.container);
            projectItems.forEach((item) => {
                item.classList.remove("hidden");
            });
            if (this.recentlyPlayed.length > 0) {
                projectItems.forEach((item) => {
                    if (!this.recentlyPlayed.includes(item.dataset.id)) {
                        item.classList.add("hidden");
                    }
                });
            } else {
                projectItems.forEach((item) => item.classList.add("hidden"));
                const message = document.createElement("div");
                message.className = "no-items-message";
                message.innerHTML =
                    '<i class="fas fa-info-circle"></i> No recently played games. Start playing to build your history!';
                const existingMessage = $(".no-items-message", this.container);
                if (existingMessage) existingMessage.remove();
                $(".project-list", this.container).appendChild(message);
            }
        }
        showFavorites() {
            let favorites = [];
            try {
                favorites = JSON.parse(
                    localStorage.getItem("game-favorites") || "[]"
                );
            } catch (e) {}
            const projectItems = $$(".project-item", this.container);
            projectItems.forEach((item) => {
                item.classList.remove("hidden");
            });
            if (favorites.length > 0) {
                projectItems.forEach((item) => {
                    if (!favorites.includes(item.dataset.id)) {
                        item.classList.add("hidden");
                    }
                });
            } else {
                projectItems.forEach((item) => item.classList.add("hidden"));
                const message = document.createElement("div");
                message.className = "no-items-message";
                message.innerHTML =
                    '<i class="fas fa-info-circle"></i> No favorite games yet. Click the star icon when playing a game to add it to favorites!';
                const existingMessage = $(".no-items-message", this.container);
                if (existingMessage) existingMessage.remove();
                $(".project-list", this.container).appendChild(message);
            }
        }
        addManagedListener(element, type, listener, options) {
            element.addEventListener(type, listener, options);
            this.activeListeners.push({ element, type, listener, options });
        }
        cleanupListeners(filterFn = () => true) {
            const listenersToRemove = this.activeListeners.filter(filterFn);
            const listenersToKeep = this.activeListeners.filter(
                (l) => !filterFn(l)
            );
            listenersToRemove.forEach(
                ({ element, type, listener, options }) => {
                    element.removeEventListener(type, listener, options);
                }
            );
            this.activeListeners = listenersToKeep;
        }
        addStyles() {
            const styleEl = document.createElement("style");
            styleEl.textContent = `
                .project-showcase {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: clamp(600px, 75vw, 1200px); 
                    height: clamp(500px, 80vh, 900px); 
                    background: var(--bg-gradient);
                    border-radius: 20px;
                    box-shadow: 0 20px 50px var(--shadow-color);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1); 
                    z-index: 10000;
                    opacity: 0;
                    transform: translateY(50px) scale(0.95);
                    pointer-events: none;
                    color: var(--text-color);
                    --background-dark-1: #151923;
                    --background-dark-2: #1d212d;
                    --background-light-1: #f5f5f7;
                    --background-light-2: #e9eaec;
                    --primary-color: #fbcb5b;
                    --secondary-color: #e67e22;
                    --accent-color: #f39c12;
                    --success-color: #2ecc71;
                    --warning-color: #f39c12;
                    --danger-color: #e74c3c;
                    --info-color: #3498db;
                    --text-light: #333;
                    --text-dark: #f5f5f7;
                    --border-light: rgba(0, 0, 0, 0.1);
                    --border-dark: rgba(255, 255, 255, 0.1);
                    --shadow-color: rgba(0, 0, 0, 0.5);
                    --shadow-color-light: rgba(0, 0, 0, 0.1);
                    --font-heading: 'Montserrat', 'Arial', sans-serif;
                    --bg-gradient: linear-gradient(135deg, var(--background-dark-1), var(--background-dark-2));
                    --text-color: var(--text-dark);
                    --border-color: var(--border-dark);
                    --input-bg: rgba(255, 255, 255, 0.1);
                    --sidebar-bg: rgba(15, 18, 25, 0.6);
                    --main-bg: rgba(29, 33, 45, 0.8);
                    --header-bg: rgba(15, 18, 25, 0.9);
                    --footer-bg: rgba(15, 18, 25, 0.9);
                    --button-bg: rgba(255, 255, 255, 0.1);
                    --button-hover-bg: var(--primary-color);
                    --button-hover-text: #333;
                    --item-hover-bg: rgba(255, 255, 255, 0.05);
                    --active-item-bg: rgba(251, 197, 49, 0.2);
                    --scrollbar-thumb: var(--primary-color);
                    --scrollbar-track: rgba(255, 255, 255, 0.05);
                    --animation-speed: 0.3s;
                }
                .project-showcase.loaded { 
                     transform: translateY(20px) scale(1); 
                }
                .project-showcase.active {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: all;
                }
                .project-showcase.minimized {
                    height: 55px;
                    width: 300px;
                    overflow: hidden;
                }
                 .project-showcase.minimized .showcase-content,
                 .project-showcase.minimized .showcase-footer {
                    display: none;
                 }
                .project-showcase.fullscreen {
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    border-radius: 0;
                }
                .project-showcase.light {
                    --bg-gradient: linear-gradient(135deg, var(--background-light-1), var(--background-light-2));
                    --text-color: var(--text-light);
                    --border-color: var(--border-light);
                    --input-bg: rgba(0, 0, 0, 0.05);
                    --sidebar-bg: rgba(255, 255, 255, 0.6);
                    --main-bg: rgba(255, 255, 255, 0.8);
                    --header-bg: rgba(255, 255, 255, 0.9);
                    --footer-bg: rgba(255, 255, 255, 0.9);
                    --button-bg: rgba(0, 0, 0, 0.08);
                    --button-hover-bg: var(--primary-color);
                    --button-hover-text: #fff;
                    --item-hover-bg: rgba(0, 0, 0, 0.03);
                    --active-item-bg: rgba(251, 197, 49, 0.2);
                    --scrollbar-thumb: var(--secondary-color);
                    --scrollbar-track: rgba(0, 0, 0, 0.1);
                    color: var(--text-color);
                }
                 .project-showcase.light .project-search::placeholder { color: #888; }
                 .project-showcase.light .project-item-category { color: #555; }
                 .project-showcase.light .project-description { color: #444; }
                 .project-showcase.light .instructions-text { color: #444; }
                 .project-showcase.light .project-stats { color: #555; }
                 .project-showcase.light .showcase-controls button { color: #555; }
                 .project-showcase.light .showcase-controls button:hover { color: var(--primary-color); }
                 .project-showcase.light .category-btn { background: rgba(0,0,0,0.06); color: #333; }
                 .project-showcase.light .category-btn.active, .project-showcase.light .category-btn:hover { background: var(--primary-color); color: #fff; }
                 .project-showcase.light .random-game-btn { background: var(--primary-color); color: #fff; }
                 .project-showcase.light .random-game-btn:hover { background: var(--secondary-color); }
                 .project-showcase.light .project-item-icon { color: #fff; } 
                 .project-showcase.light .loading-indicator { color: var(--text-light); }
                .showcase-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 24px;
                    background: var(--header-bg);
                    border-bottom: 1px solid var(--border-color);
                    backdrop-filter: blur(10px);
                    flex-shrink: 0;
                }
                .showcase-header h3 {
                    margin: 0;
                    font-family: var(--font-heading);
                    font-size: 1.6rem; 
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--primary-color); 
                }
                .showcase-header h3 i {
                     font-size: 1.8rem; 
                }
                .showcase-controls button {
                    background: none;
                    border: none;
                    color: var(--text-color);
                    font-size: 1.3rem; 
                    margin-left: 15px;
                    cursor: pointer;
                    transition: transform 0.2s ease, color 0.2s ease;
                    padding: 5px;
                }
                .showcase-controls button:hover {
                    transform: scale(1.25) rotate(5deg);
                    color: var(--primary-color);
                }
                .showcase-content {
                    display: flex;
                    flex: 1;
                    overflow: hidden; 
                }
                .showcase-sidebar {
                    width: 300px; 
                    background: var(--sidebar-bg);
                    border-right: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    padding: 0; 
                    flex-shrink: 0;
                    transition: background 0.3s ease;
                }
                .search-container {
                    padding: 20px 20px 15px 20px;
                    border-bottom: 1px solid var(--border-color);
                    position: relative;
                }
                .search-icon {
                    position: absolute;
                    left: 35px;
                    top: 50%;
                    transform: translateY(-35%); 
                    color: #aaa;
                    font-size: 0.9rem;
                }
                .project-search {
                    width: 100%;
                    padding: 12px 15px 12px 40px; 
                    border: none;
                    border-radius: 30px;
                    font-size: 1rem;
                    font-family: var(--font-main);
                    outline: none;
                    background: var(--input-bg);
                    color: var(--text-color);
                    transition: background 0.3s ease, box-shadow 0.3s ease;
                }
                .project-search:focus {
                    background: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 0 0 2px var(--primary-color);
                }
                .project-search::placeholder {
                    color: #aaa;
                    font-style: italic;
                }
                .category-filters {
                    padding: 15px 20px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    border-bottom: 1px solid var(--border-color);
                }
                .category-btn {
                    background: var(--button-bg);
                    border: 1px solid transparent;
                    border-radius: 20px;
                    padding: 6px 14px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .category-btn.active, .category-btn:hover {
                    background: var(--primary-color);
                    color: var(--button-hover-text);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    border-color: var(--primary-color);
                }
                .project-list-wrapper {
                    flex: 1;
                    overflow: hidden; 
                    position: relative;
                }
                .project-list {
                    height: 100%;
                    overflow-y: auto;
                    padding: 10px 0;
                    scrollbar-width: thin;
                    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
                }
                .project-list::-webkit-scrollbar { width: 8px; }
                .project-list::-webkit-scrollbar-track { background: var(--scrollbar-track); border-radius: 4px; }
                .project-list::-webkit-scrollbar-thumb { background-color: var(--scrollbar-thumb); border-radius: 4px; border: 2px solid var(--scrollbar-track); }
                .project-item {
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: background 0.2s ease, border-left-color 0.3s ease;
                    border-left: 4px solid transparent;
                    gap: 15px;
                }
                .project-item:last-child {
                    border-bottom: none;
                }
                .project-item:hover {
                    background: var(--item-hover-bg);
                    border-left-color: var(--accent-color);
                }
                .project-item.active {
                    background: var(--active-item-bg);
                    border-left-color: var(--primary-color);
                    font-weight: 600;
                }
                .project-item-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 1.5rem;
                    color: #fff; 
                    transition: transform 0.3s ease;
                }
                .project-item:hover .project-item-icon {
                    transform: scale(1.1) rotate(-5deg);
                }
                .project-item-text {
                    flex: 1;
                    overflow: hidden; 
                }
                .project-item-name {
                    font-weight: 600;
                    font-size: 1.05rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .project-item-category {
                    font-size: 0.8rem;
                    color: #bbb;
                    text-transform: capitalize;
                }
                .showcase-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 24px;
                    background: var(--main-bg);
                    overflow: hidden; 
                    transition: background 0.3s ease;
                }
                .project-view {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden; 
                    gap: 16px; 
                }
                .project-preview-wrapper {
                    flex: 1; 
                    min-height: 200px; 
                    display: flex; 
                    align-items: center;
                    justify-content: center;
                    position: relative; 
                }
                .project-preview {
                    width: 100%;
                    height: 100%;
                    background: #000;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    overflow: hidden; 
                    position: relative; 
                }
                .project-preview canvas {
                    display: block;
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain; 
                    border-radius: 10px; 
                    transition: opacity 0.3s ease;
                    opacity: 1;
                }
                 .project-preview canvas.loading {
                    opacity: 0.5;
                 }
                .loading-indicator {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    color: var(--primary-color);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    border-radius: 12px;
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none; 
                }
                .loading-indicator.visible {
                    opacity: 1;
                    pointer-events: all;
                }
                .loading-indicator i {
                    font-size: 2.5rem;
                    margin-bottom: 15px;
                }
                .project-info {
                    padding: 16px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 10px;
                    display: grid; 
                    grid-template-columns: 1fr auto; 
                    grid-template-rows: auto auto auto; 
                    gap: 8px 16px; 
                    align-items: center;
                }
                .project-info h4 { 
                    grid-column: 1 / 2;
                    grid-row: 1 / 2;
                    margin: 0;
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--primary-color);
                }
                .project-description { 
                    grid-column: 1 / 3; 
                    grid-row: 2 / 3;
                    margin: 0;
                    font-size: 0.95rem;
                    color: #ccc;
                    line-height: 1.5;
                }
                .project-stats-display { 
                    grid-column: 1 / 2;
                    grid-row: 3 / 4;
                    font-size: 0.9rem;
                    color: #bbb;
                    font-weight: 500;
                }
                .project-controls { 
                    grid-column: 2 / 3;
                    grid-row: 1 / 4; 
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    align-items: center;
                }
                .project-controls button {
                    background: var(--button-bg);
                    border: none;
                    border-radius: 50%;
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .project-controls button:hover {
                    transform: scale(1.15);
                    background: var(--button-hover-bg);
                    color: var(--button-hover-text);
                    box-shadow: 0 5px 10px rgba(0,0,0,0.3);
                }
                .game-instructions {
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    margin-top: 0; 
                }
                .game-instructions h5 {
                    margin: 0 0 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--accent-color); 
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .game-instructions p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #ccc;
                    line-height: 1.6;
                }
                .achievement-notifications {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    max-width: 80vw;
                    z-index: 10001;
                    pointer-events: none;
                }
                .achievement-notification {
                    display: flex;
                    background: linear-gradient(135deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95));
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 10px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(251, 203, 91, 0.3);
                    border: 1px solid rgba(251, 203, 91, 0.5);
                    transform: translateX(100%) scale(0.8);
                    opacity: 0;
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                                opacity 0.4s ease;
                    overflow: hidden;
                }
                .achievement-notification::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 5px;
                    height: 100%;
                    background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
                }
                .achievement-notification.show {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
                .achievement-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: #fff;
                    margin-right: 15px;
                    flex-shrink: 0;
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                .achievement-icon::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(transparent, rgba(255, 255, 255, 0.2), transparent);
                    transform: rotate(45deg);
                    animation: shine 2s ease-in-out infinite;
                }
                .achievement-content {
                    flex: 1;
                }
                .achievement-header {
                    margin-bottom: 5px;
                }
                .achievement-unlocked {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--primary-color);
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 2px;
                }
                .achievement-name {
                    display: block;
                    font-size: 1.1rem;
                    color: #fff;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .achievement-description {
                    font-size: 0.85rem;
                    color: #bbb;
                }
                @keyframes shine {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
                }
                .achievement-list-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 10100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(5px);
                }
                .achievement-list-modal.show {
                    opacity: 1;
                }
                .achievement-modal-content {
                    width: 600px;
                    max-width: 90vw;
                    max-height: 80vh;
                    background: linear-gradient(135deg, var(--background-dark-1), var(--background-dark-2));
                    border-radius: 15px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                }
                .achievement-modal-header {
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: relative;
                }
                .achievement-modal-header h3 {
                    margin: 0;
                    color: var(--primary-color);
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .achievement-modal-header h3::before {
                    content: '🏆';
                    font-size: 1.5rem;
                }
                .achievement-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #fff;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .achievement-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }
                .achievement-progress {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .achievement-progress-bar {
                    height: 10px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 5px;
                    overflow: hidden;
                }
                .achievement-progress-fill {
                    height: 100%;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    border-radius: 5px;
                    transition: width 0.5s ease;
                }
                .achievement-progress-text {
                    font-size: 0.8rem;
                    color: #bbb;
                    text-align: right;
                }
                .achievement-modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                }
                .achievement-item {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                }
                .achievement-item:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }
                .achievement-item.unlocked {
                    background: linear-gradient(135deg, rgba(251, 203, 91, 0.1), rgba(230, 126, 34, 0.1));
                    border: 1px solid rgba(251, 203, 91, 0.3);
                }
                .achievement-item.secret {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                }
                .achievement-item-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: #aaa;
                    flex-shrink: 0;
                }
                .achievement-item.unlocked .achievement-item-icon {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: #fff;
                }
                .achievement-item-content {
                    flex: 1;
                }
                .achievement-item-name {
                    font-size: 1rem;
                    color: #fff;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .achievement-item-description {
                    font-size: 0.8rem;
                    color: #bbb;
                }
                .achievement-unlocked-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 20px;
                    height: 20px;
                    background: var(--success-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    color: #fff;
                }
                .star-burst-container {
                    z-index: 10000;
                }
                .burst-star {
                    position: absolute;
                    color: var(--primary-color);
                    animation: burstStar 1.5s forwards;
                    opacity: 0;
                }
                @keyframes burstStar {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg) scale(0.5);
                        opacity: 1;
                    }
                    100% {
                        transform: 
                            translate(
                                calc(-50% + (cos(var(--angle)) * var(--distance))), 
                                calc(-50% + (sin(var(--angle)) * var(--distance)))
                            )
                            rotate(360deg) 
                            scale(0);
                        opacity: 0;
                    }
                }
                .game-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(5px);
                    z-index: 1000;
                }
                .game-overlay.visible {
                    opacity: 1;
                    pointer-events: all;
                }
                .game-pause-menu {
                    background: linear-gradient(135deg, var(--background-dark-1), var(--background-dark-2));
                    border-radius: 15px;
                    padding: 30px;
                    width: 300px;
                    max-width: 80%;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    border: 1px solid var(--border-color);
                    transform: scale(0.9);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .game-overlay.visible .game-pause-menu {
                    transform: scale(1);
                }
                .game-pause-menu h4 {
                    margin: 0 0 20px 0;
                    color: var(--primary-color);
                    font-size: 1.5rem;
                }
                .pause-menu-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .pause-menu-buttons button {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 30px;
                    padding: 12px 20px;
                    color: #fff;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .pause-menu-buttons button:hover {
                    background: var(--primary-color);
                    transform: translateY(-2px);
                }
                .pause-menu-buttons .resume-btn {
                    background: var(--primary-color);
                }
                .pause-menu-buttons .resume-btn:hover {
                    background: var(--secondary-color);
                }
                .pause-menu-buttons .exit-btn {
                    background: rgba(244, 67, 54, 0.2);
                }
                .pause-menu-buttons .exit-btn:hover {
                    background: var(--danger-color);
                }
                .game-tab-controls {
                    display: flex;
                    padding: 10px 15px;
                    gap: 5px;
                    border-bottom: 1px solid var(--border-color);
                    background: rgba(0, 0, 0, 0.2);
                }
                .game-tab-btn {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    padding: 8px 10px;
                    border-radius: 5px;
                    color: #bbb;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                .game-tab-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }
                .game-tab-btn.active {
                    background: var(--primary-color);
                    color: var(--button-hover-text);
                }
                .no-items-message {
                    padding: 30px;
                    text-align: center;
                    color: #aaa;
                    font-size: 0.9rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }
                .no-items-message i {
                    font-size: 2rem;
                    color: var(--primary-color);
                    opacity: 0.5;
                }
                .showcase-sidebar-footer {
                    padding: 10px 15px;
                    border-top: 1px solid var(--border-color);
                    background: rgba(0, 0, 0, 0.2);
                }
                .gamepad-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #777;
                    font-size: 0.8rem;
                    transition: all 0.2s ease;
                }
                .gamepad-status.connected {
                    color: var(--success-color);
                }
                .gamepad-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 10px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .particle-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }
                .showcase-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 24px;
                    background: var(--footer-bg);
                    border-top: 1px solid var(--border-color);
                    backdrop-filter: blur(10px);
                    flex-shrink: 0;
                }
                .project-stats {
                    font-size: 0.85rem;
                    color: #bbb;
                }
                .footer-separator {
                    margin: 0 10px;
                    opacity: 0.5;
                }
                .random-game-btn {
                    background: var(--primary-color);
                    color: var(--button-hover-text);
                    border: none;
                    border-radius: 30px;
                    padding: 10px 20px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .random-game-btn:hover {
                    transform: translateY(-3px) scale(1.03);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.3);
                    background-color: var(--secondary-color); 
                }
                .showcase-trigger {
                    position: fixed;
                    bottom: 30px;
                    left: 30px;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: #fff;
                    border: none;
                    border-radius: 50px;
                    padding: 16px 32px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    font-family: var(--font-heading);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    z-index: 9999; 
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .showcase-trigger:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.4);
                }
                .showcase-trigger i {
                    font-size: 1.3rem;
                }
                 .project-preview:-webkit-full-screen { 
                    background-color: #000;
                    width: 100%;
                    height: 100%;
                 }
                 .project-preview:-moz-full-screen {
                    background-color: #000;
                    width: 100%;
                    height: 100%;
                 }
                 .project-preview:-ms-fullscreen {
                    background-color: #000;
                    width: 100%;
                    height: 100%;
                 }
                 .project-preview:fullscreen {
                    background-color: #000; 
                    width: 100%;
                    height: 100%;
                    padding: 0; 
                    border-radius: 0; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                 }
                 .project-preview:fullscreen canvas {
                    max-width: 100vw;
                    max-height: 100vh;
                    object-fit: contain;
                    border-radius: 0;
                 }
                .hidden { display: none !important; }
                .fas { font-family: 'Font Awesome 5 Free' !important; font-weight: 900; }
            `;
            document.head.appendChild(styleEl);
            const fontLink = document.createElement("link");
            fontLink.href =
                "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap";
            fontLink.rel = "stylesheet";
            document.head.appendChild(fontLink);
            if (!document.querySelector('link[href*="fontawesome"]')) {
                const faLink = document.createElement("link");
                faLink.rel = "stylesheet";
                faLink.href =
                    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
                document.head.appendChild(faLink);
            }
        }
        applyInitialTheme() {
            this.container.classList.toggle("light", !this.isDarkMode);
            this.updateDarkModeButton();
        }
        loadProjects() {
            this.projects = [
                {
                    id: "breakout",
                    name: "Breakout Blast",
                    description:
                        "Arcade classic brick-breaker with power-ups and vibrant effects.",
                    preview: `<canvas id="breakout-game" width="600" height="450"></canvas>`,
                    init: this.initBreakoutGame,
                    category: "arcade",
                    icon: "fa-th",
                    iconColor: "#e74c3c",
                    instructions:
                        "Mouse to move paddle. Break all bricks. Catch falling power-ups!",
                },
                {
                    id: "snake",
                    name: "Hyper Snake",
                    description:
                        "Timeless snake game with faster speeds and a modern neon look.",
                    preview: `<canvas id="snake-game" width="400" height="400"></canvas>`,
                    init: this.initSnakeGame,
                    category: "retro",
                    icon: "fa-wave-square",
                    iconColor: "#2ecc71",
                    instructions:
                        "Arrow keys to move. Eat food (red squares) to grow. Avoid walls and yourself.",
                },
                {
                    id: "tetris",
                    name: "Tetris Dimensions",
                    description:
                        "Falling block puzzle game. Clear lines, score high!",
                    preview: `<canvas id="tetris-game" width="300" height="600"></canvas>`,
                    init: this.initTetrisGame,
                    category: "puzzle",
                    icon: "fa-shapes",
                    iconColor: "#3498db",
                    instructions:
                        "Arrows: Left/Right to move, Down to soft drop, Up to rotate. Space for hard drop. Clear lines.",
                },
                {
                    id: "pong",
                    name: "Quantum Pong",
                    description:
                        "The original paddle game with a futuristic twist.",
                    preview: `<canvas id="pong-game" width="600" height="400"></canvas>`,
                    init: this.initPongGame,
                    category: "retro",
                    icon: "fa-table-tennis",
                    iconColor: "#f1c40f",
                    instructions:
                        "Player 1 (Left): W/S keys. Player 2 (Right): Up/Down Arrows. Score points!",
                },
                {
                    id: "spaceinvaders",
                    name: "Galaxy Invaders",
                    description: "Defend Earth from descending alien hordes!",
                    preview: `<canvas id="spaceinvaders-game" width="500" height="450"></canvas>`,
                    init: this.initSpaceInvadersGame,
                    category: "action",
                    icon: "fa-space-shuttle",
                    iconColor: "#9b59b6",
                    instructions:
                        "Left/Right Arrows to move. Spacebar to shoot. Destroy all invaders.",
                },
                {
                    id: "asteroids",
                    name: "Asteroid Belt",
                    description: "Navigate space, destroy asteroids and UFOs.",
                    preview: `<canvas id="asteroids-game" width="500" height="500"></canvas>`,
                    init: this.initAsteroidsGame,
                    category: "action",
                    icon: "fa-meteor",
                    iconColor: "#7f8c8d",
                    instructions:
                        "Arrows: Left/Right to rotate, Up to thrust. Spacebar to shoot. Avoid collisions.",
                },
                {
                    id: "pacman",
                    name: "Dot Muncher",
                    description: "Navigate the maze, eat dots, avoid ghosts!",
                    preview: `<canvas id="pacman-game" width="448" height="496"></canvas>`,
                    init: this.initPacmanGame,
                    category: "arcade",
                    icon: "fa-ghost",
                    iconColor: "#f39c12",
                    instructions:
                        "Arrow keys to move. Eat all dots to win. Avoid ghosts. Eat power pellets (large dots) to eat ghosts.",
                },
                {
                    id: "frogger",
                    name: "Road Hopper",
                    description: "Help the frog cross the busy road and river.",
                    preview: `<canvas id="frogger-game" width="400" height="480"></canvas>`,
                    init: this.initFroggerGame,
                    category: "arcade",
                    icon: "fa-frog",
                    iconColor: "#1abc9c",
                    instructions:
                        "Arrow keys to move. Reach the empty lilypads at the top. Avoid cars and water hazards.",
                },
                {
                    id: "minesweeper",
                    name: "Mine Sweeper Pro",
                    description:
                        "Classic logic puzzle. Flag the mines, clear the board.",
                    preview: `<div id="minesweeper-game" style="padding: 10px;"></div>`,
                    init: this.initMinesweeperGame,
                    category: "puzzle",
                    icon: "fa-bomb",
                    iconColor: "#34495e",
                    instructions:
                        "Left-click to reveal square. Right-click (or Ctrl+click) to flag mine. Numbers show adjacent mines.",
                },
                {
                    id: "connect4",
                    name: "Connect Four",
                    description:
                        "Drop discs, connect four in a row vertically, horizontally, or diagonally.",
                    preview: `<canvas id="connect4-game" width="420" height="360"></canvas>`,
                    init: this.initConnect4Game,
                    category: "puzzle",
                    icon: "fa-grip-horizontal",
                    iconColor: "#e74c3c",
                    instructions:
                        "Click on a column to drop your disc (Red). Get four in a row before the AI (Yellow).",
                },
                {
                    id: "flappybird",
                    name: "Flappy Pipe",
                    description: "Tap to flap, navigate through the pipes.",
                    preview: `<canvas id="flappybird-game" width="300" height="500"></canvas>`,
                    init: this.initFlappyBirdGame,
                    category: "arcade",
                    icon: "fa-kiwi-bird",
                    iconColor: "#f1c40f",
                    instructions:
                        "Spacebar or Click to flap upwards. Avoid pipes and the ground.",
                },
                {
                    id: "doodlejump",
                    name: "Doodle Jumper",
                    description:
                        "Jump ever higher on platforms, avoid falling.",
                    preview: `<canvas id="doodlejump-game" width="400" height="600"></canvas>`,
                    init: this.initDoodleJumpGame,
                    category: "arcade",
                    icon: "fa-angle-double-up",
                    iconColor: "#2ecc71",
                    instructions:
                        "Left/Right Arrows to move horizontally. Bounce automatically on platforms.",
                },
                {
                    id: "memory",
                    name: "Memory Match",
                    description: "Flip cards and find matching pairs.",
                    preview: `<div id="memory-game" style="padding: 20px; display: grid; gap: 10px;"></div>`,
                    init: this.initMemoryGame,
                    category: "puzzle",
                    icon: "fa-brain",
                    iconColor: "#9b59b6",
                    instructions:
                        "Click cards to reveal them. Find all matching pairs.",
                },
                {
                    id: "clicker",
                    name: "Idle Clicker",
                    description: "Click the button, earn points, buy upgrades.",
                    preview: `<div id="clicker-game" style="padding: 20px; text-align: center;"></div>`,
                    init: this.initClickerGame,
                    category: "casual",
                    icon: "fa-mouse-pointer",
                    iconColor: "#3498db",
                    instructions:
                        "Click the main button to earn points. Buy upgrades to increase points per click or auto-click.",
                },
                {
                    id: "maze",
                    name: "Labyrinth Run",
                    description: "Find your way through the maze to the exit.",
                    preview: `<canvas id="maze-game" width="400" height="400"></canvas>`,
                    init: this.initMazeGame,
                    category: "puzzle",
                    icon: "fa-project-diagram",
                    iconColor: "#7f8c8d",
                    instructions:
                        "Arrow keys to move the player (blue square) to the exit (green square).",
                },
                {
                    id: "typing",
                    name: "Typing Speed Test",
                    description: "Test and improve your typing speed.",
                    preview: `<div id="typing-game" style="padding: 20px;"></div>`,
                    init: this.initTypingGame,
                    category: "casual",
                    icon: "fa-keyboard",
                    iconColor: "#1abc9c",
                    instructions:
                        "Type the displayed words accurately. Results shown at the end.",
                },
                {
                    id: "wordsearch",
                    name: "Word Search",
                    description: "Find the hidden words in the grid.",
                    preview: `<div id="wordsearch-game" style="padding: 10px;"></div>`,
                    init: this.initWordSearchGame,
                    category: "puzzle",
                    icon: "fa-search",
                    iconColor: "#e74c3c",
                    instructions:
                        "Click and drag to highlight words found in the list. Words can be horizontal, vertical, or diagonal.",
                },
                {
                    id: "hangman",
                    name: "Hangman Classic",
                    description: "Guess the letters to find the hidden word.",
                    preview: `<div id="hangman-game" style="padding: 20px;"></div>`,
                    init: this.initHangmanGame,
                    category: "puzzle",
                    icon: "fa-user-secret",
                    iconColor: "#34495e",
                    instructions:
                        "Click letters to guess. Too many wrong guesses and the game is over!",
                },
                {
                    id: "simonsays",
                    name: "Simon Says",
                    description: "Repeat the sequence of colors and sounds.",
                    preview: `<div id="simonsays-game" style="padding: 20px; display: flex; justify-content: center;"></div>`,
                    init: this.initSimonSaysGame,
                    category: "casual",
                    icon: "fa-palette",
                    iconColor: "#f39c12",
                    instructions:
                        "Watch the sequence, then click the buttons in the same order.",
                },
                {
                    id: "tictactoe",
                    name: "Tic Tac Toe AI",
                    description: "Classic Tic Tac Toe against a simple AI.",
                    preview: `<div id="tictactoe-game" style="padding: 20px;"></div>`,
                    init: this.initTicTacToeGame,
                    category: "puzzle",
                    icon: "fa-times",
                    iconColor: "#2ecc71",
                    instructions:
                        "Click on an empty square to place your 'X'. Try to get 3 in a row before the AI ('O').",
                },
                {
                    id: "arkanoid",
                    name: "Arkanoid Lite",
                    description:
                        "Breakout variant with moving bricks (simple).",
                    preview: `<canvas id="arkanoid-game" width="600" height="450"></canvas>`,
                    init: this.initArkanoidGame,
                    category: "arcade",
                    icon: "fa-th-large",
                    iconColor: "#e74c3c",
                    instructions:
                        "Mouse to move paddle. Similar to Breakout, but some bricks might move.",
                },
                {
                    id: "platformer",
                    name: "Simple Platformer",
                    description: "Basic jump and run platformer.",
                    preview: `<canvas id="platformer-game" width="600" height="400"></canvas>`,
                    init: this.initPlatformerGame,
                    category: "action",
                    icon: "fa-running",
                    iconColor: "#3498db",
                    instructions:
                        "Left/Right Arrows to move. Up Arrow or Space to jump. Reach the goal.",
                },
                {
                    id: "shooter",
                    name: "Top-Down Shooter",
                    description: "Simple top-down shooting gallery.",
                    preview: `<canvas id="shooter-game" width="500" height="500"></canvas>`,
                    init: this.initShooterGame,
                    category: "action",
                    icon: "fa-crosshairs",
                    iconColor: "#9b59b6",
                    instructions:
                        "WASD or Arrows to move. Mouse click to shoot targets.",
                },
                {
                    id: "match3",
                    name: "Match-3 Gems",
                    description: "Swap adjacent gems to match 3 or more.",
                    preview: `<canvas id="match3-game" width="400" height="400"></canvas>`,
                    init: this.initMatch3Game,
                    category: "puzzle",
                    icon: "fa-gem",
                    iconColor: "#1abc9c",
                    instructions:
                        "Click and drag a gem to swap with an adjacent one. Match 3 or more of the same color.",
                },
                {
                    id: "rhythm",
                    name: "Rhythm Tap",
                    description: "Tap the notes as they reach the target line.",
                    preview: `<canvas id="rhythm-game" width="400" height="500"></canvas>`,
                    init: this.initRhythmGame,
                    category: "casual",
                    icon: "fa-music",
                    iconColor: "#f1c40f",
                    instructions:
                        "Press the corresponding keys (e.g., D, F, J, K) as notes hit the line.",
                },
                {
                    id: "drawing",
                    name: "Simple Draw Pad",
                    description: "A basic canvas for drawing.",
                    preview: `<canvas id="drawing-game" width="500" height="400" style="background: #fff; cursor: crosshair;"></canvas>`,
                    init: this.initDrawingGame,
                    category: "casual",
                    icon: "fa-paint-brush",
                    iconColor: "#e74c3c",
                    instructions:
                        "Click and drag to draw. Controls for color/clear might be added.",
                },
                {
                    id: "physics",
                    name: "Physics Balls",
                    description:
                        "Simple physics simulation with bouncing balls.",
                    preview: `<canvas id="physics-game" width="500" height="400"></canvas>`,
                    init: this.initPhysicsGame,
                    category: "casual",
                    icon: "fa-atom",
                    iconColor: "#3498db",
                    instructions:
                        "Watch the balls bounce around. Click to add more balls.",
                },
                {
                    id: "cardgame",
                    name: "Simple Card Game",
                    description: "Basic High-Low card guessing game.",
                    preview: `<div id="cardgame-game" style="padding: 20px;"></div>`,
                    init: this.initCardGame,
                    category: "casual",
                    icon: "fa-heart",
                    iconColor: "#e74c3c",
                    instructions:
                        "Guess if the next card drawn will be higher or lower than the current card.",
                },
                {
                    id: "adventure",
                    name: "Text Adventure Snippet",
                    description: "A tiny example of a text-based adventure.",
                    preview: `<div id="adventure-game" style="padding: 20px; height: 300px; overflow-y: auto; background: #000; color: #0f0; font-family: monospace;"></div>`,
                    init: this.initAdventureGame,
                    category: "retro",
                    icon: "fa-terminal",
                    iconColor: "#2ecc71",
                    instructions:
                        "Type commands like 'look', 'north', 'take key' etc. (Very basic).",
                },
                {
                    id: "sudoku",
                    name: "Sudoku Mini",
                    description:
                        "A very simple Sudoku puzzle generator/solver.",
                    preview: `<div id="sudoku-game" style="padding: 10px;"></div>`,
                    init: this.initSudokuGame,
                    category: "puzzle",
                    icon: "fa-border-all",
                    iconColor: "#34495e",
                    instructions:
                        "Fill the grid so each row, column, and 3x3 box contains digits 1-9. (Basic implementation)",
                },
            ];
            this.projects.sort((a, b) => a.name.localeCompare(b.name));
        }
        populateGameList() {
            const projectList = $(".project-list", this.container);
            projectList.innerHTML = ""; 
            const categories = new Set();
            this.projects.forEach((project) => {
                const projectItem = document.createElement("div");
                projectItem.className = "project-item";
                projectItem.dataset.id = project.id;
                projectItem.dataset.category = project.category;
                projectItem.innerHTML = `
                    <div class="project-item-icon" style="background-color: ${
                        project.iconColor || "#888"
                    };">
                        <i class="fas ${project.icon || "fa-gamepad"}"></i>
                    </div>
                    <div class="project-item-text">
                        <div class="project-item-name">${project.name}</div>
                        <div class="project-item-category">${
                            project.category
                        }</div>
                    </div>
                `;
                projectList.appendChild(projectItem);
                categories.add(project.category);
            });
            const categoryFilters = $(".category-filters", this.container);
            categoryFilters.innerHTML = `<button class="category-btn active" data-category="all">All (${this.projects.length})</button>`;
            const sortedCategories = [...categories].sort();
            sortedCategories.forEach((cat) => {
                const count = this.projects.filter((p) => p.category === cat)
                    .length;
                const btn = document.createElement("button");
                btn.className = "category-btn";
                btn.dataset.category = cat;
                btn.textContent = `${
                    cat.charAt(0).toUpperCase() + cat.slice(1)
                } (${count})`;
                categoryFilters.appendChild(btn);
            });
        }
        updateFooterStats() {
            const gamesCount = $(".games-count", this.container);
            const gamesCategories = $(".games-categories", this.container);
            const uniqueCategories = [
                ...new Set(this.projects.map((p) => p.category)),
            ].sort();
            gamesCount.textContent = `${this.projects.length} Legendary Games`;
            gamesCategories.textContent = uniqueCategories
                .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                .join(", ");
        }
        loadProject(projectId) {
            if (
                !projectId ||
                (this.currentProject && this.currentProject.id === projectId)
            )
                return;
            const project = this.projects.find((p) => p.id === projectId);
            if (!project) return;
            this.showLoadingIndicator();
            this.cleanupCurrentGame(); 
            this.currentProject = project;
            const previewWrapper = $(
                ".project-preview-wrapper",
                this.container
            );
            const preview = $(".project-preview", this.container);
            const title = $(".project-title", this.container);
            const description = $(".project-description", this.container);
            const instructions = $(".instructions-text", this.container);
            title.textContent = this.currentProject.name;
            description.textContent = this.currentProject.description;
            instructions.textContent =
                this.currentProject.instructions ||
                "No instructions available.";
            this.updateScoreDisplay(); 
            preview.innerHTML = ""; 
            preview.insertAdjacentHTML(
                "beforeend",
                this.currentProject.preview
            ); 
            const gameElement = preview.children[0]; 
            if (gameElement) {
                if (gameElement.tagName === "CANVAS") {
                    gameElement.style.width = "100%";
                    gameElement.style.height = "100%";
                    gameElement.style.display = "block";
                    gameElement.style.objectFit = "contain"; 
                }
                gameElement.classList.add("game-canvas"); 
            }
            this.highlightProjectItem(projectId);
            const startGameOverlay = document.createElement("div");
            startGameOverlay.className = "start-game-overlay";
            startGameOverlay.style.position = "absolute";
            startGameOverlay.style.top = "0";
            startGameOverlay.style.left = "0";
            startGameOverlay.style.width = "100%";
            startGameOverlay.style.height = "100%";
            startGameOverlay.style.display = "flex";
            startGameOverlay.style.flexDirection = "column";
            startGameOverlay.style.alignItems = "center";
            startGameOverlay.style.justifyContent = "center";
            startGameOverlay.style.backgroundColor = "rgba(8, 13, 28, 0.85)";
            startGameOverlay.style.zIndex = "5";
            startGameOverlay.style.cursor = "pointer";
            startGameOverlay.style.backdropFilter = "blur(8px)";
            startGameOverlay.style.transition =
                "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
            startGameOverlay.style.boxShadow =
                "inset 0 0 100px rgba(16, 30, 62, 0.6)";
            startGameOverlay.style.border =
                "1px solid rgba(102, 252, 241, 0.15)";
            const gameCard = document.createElement("div");
            gameCard.style.background =
                "linear-gradient(135deg, rgba(40, 50, 80, 0.8) 0%, rgba(20, 30, 55, 0.9) 100%)";
            gameCard.style.backdropFilter = "blur(4px)";
            gameCard.style.borderRadius = "12px";
            gameCard.style.padding = "30px 40px";
            gameCard.style.display = "flex";
            gameCard.style.flexDirection = "column";
            gameCard.style.alignItems = "center";
            gameCard.style.maxWidth = "80%";
            gameCard.style.width = "400px";
            gameCard.style.border = "1px solid rgba(102, 252, 241, 0.2)";
            gameCard.style.boxShadow =
                "0 15px 35px rgba(0, 0, 0, 0.3), 0 0 25px rgba(102, 252, 241, 0.2)";
            gameCard.style.transform = "translateY(0)";
            gameCard.style.transition =
                "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)";
            const gameHeader = document.createElement("div");
            gameHeader.style.position = "relative";
            gameHeader.style.marginBottom = "25px";
            gameHeader.style.padding = "0 10px";
            const headerDecor = document.createElement("div");
            headerDecor.style.position = "absolute";
            headerDecor.style.height = "3px";
            headerDecor.style.width = "60%";
            headerDecor.style.background =
                "linear-gradient(90deg, rgba(102, 252, 241, 0) 0%, rgba(102, 252, 241, 1) 50%, rgba(102, 252, 241, 0) 100%)";
            headerDecor.style.top = "-10px";
            headerDecor.style.left = "20%";
            headerDecor.style.borderRadius = "3px";
            headerDecor.style.boxShadow = "0 0 10px rgba(102, 252, 241, 0.8)";
            const headerDecorBottom = document.createElement("div");
            headerDecorBottom.style.position = "absolute";
            headerDecorBottom.style.height = "3px";
            headerDecorBottom.style.width = "40%";
            headerDecorBottom.style.background =
                "linear-gradient(90deg, rgba(102, 252, 241, 0) 0%, rgba(102, 252, 241, 0.7) 50%, rgba(102, 252, 241, 0) 100%)";
            headerDecorBottom.style.bottom = "-10px";
            headerDecorBottom.style.left = "30%";
            headerDecorBottom.style.borderRadius = "3px";
            headerDecorBottom.style.boxShadow =
                "0 0 8px rgba(102, 252, 241, 0.6)";
            const gameTitle = document.createElement("div");
            gameTitle.textContent = this.currentProject.name.toUpperCase();
            gameTitle.style.color = "#fff";
            gameTitle.style.fontSize = "1.8em";
            gameTitle.style.fontWeight = "bold";
            gameTitle.style.letterSpacing = "2px";
            gameTitle.style.textAlign = "center";
            gameTitle.style.fontFamily = "'Raleway', sans-serif";
            gameTitle.style.textShadow =
                "0 0 10px rgba(102, 252, 241, 0.8), 0 0 20px rgba(102, 252, 241, 0.4)";
            const gameBadge = document.createElement("div");
            gameBadge.textContent = "PREMIUM";
            gameBadge.style.position = "absolute";
            gameBadge.style.top = "-35px";
            gameBadge.style.right = "-10px";
            gameBadge.style.backgroundColor = "rgba(102, 252, 241, 0.9)";
            gameBadge.style.color = "#000";
            gameBadge.style.fontSize = "0.65em";
            gameBadge.style.fontWeight = "bold";
            gameBadge.style.padding = "5px 10px";
            gameBadge.style.borderRadius = "4px";
            gameBadge.style.boxShadow = "0 0 15px rgba(102, 252, 241, 0.8)";
            gameBadge.style.transform = "rotate(15deg)";
            const gameDesc = document.createElement("div");
            gameDesc.textContent = this.currentProject.description;
            gameDesc.style.color = "#bdd4ff";
            gameDesc.style.fontSize = "1em";
            gameDesc.style.textAlign = "center";
            gameDesc.style.marginBottom = "30px";
            gameDesc.style.lineHeight = "1.5";
            gameDesc.style.fontFamily = "'Raleway', sans-serif";
            gameDesc.style.borderBottom = "1px solid rgba(102, 252, 241, 0.2)";
            gameDesc.style.paddingBottom = "20px";
            gameDesc.style.width = "100%";
            const controlPanel = document.createElement("div");
            controlPanel.style.display = "flex";
            controlPanel.style.flexDirection = "column";
            controlPanel.style.alignItems = "center";
            controlPanel.style.width = "100%";
            const startButton = document.createElement("button");
            startButton.innerHTML =
                '<span>START GAME</span><i class="fas fa-play" style="margin-left: 10px; font-size: 0.8em;"></i>';
            startButton.style.padding = "12px 30px";
            startButton.style.fontSize = "1.1em";
            startButton.style.fontWeight = "bold";
            startButton.style.letterSpacing = "1px";
            startButton.style.background =
                "linear-gradient(135deg, #2ecc71 0%, #1abc9c 100%)";
            startButton.style.color = "#fff";
            startButton.style.border = "none";
            startButton.style.borderRadius = "6px";
            startButton.style.cursor = "pointer";
            startButton.style.boxShadow =
                "0 5px 15px rgba(46, 204, 113, 0.4), 0 0 15px rgba(102, 252, 241, 0.4)";
            startButton.style.transition =
                "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)";
            startButton.style.marginBottom = "15px";
            startButton.style.fontFamily = "'Raleway', sans-serif";
            startButton.style.position = "relative";
            startButton.style.overflow = "hidden";
            startButton.style.display = "flex";
            startButton.style.alignItems = "center";
            startButton.style.justifyContent = "center";
            const shine = document.createElement("div");
            shine.style.position = "absolute";
            shine.style.top = "-50%";
            shine.style.left = "-50%";
            shine.style.width = "200%";
            shine.style.height = "200%";
            shine.style.background =
                "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)";
            shine.style.transform = "rotate(45deg) translateX(-100%)";
            shine.style.transition = "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
            shine.style.pointerEvents = "none";
            startButton.appendChild(shine);
            const instructionsNote = document.createElement("div");
            instructionsNote.innerHTML =
                '<i class="fas fa-info-circle" style="margin-right: 5px;"></i> Game controls shown below';
            instructionsNote.style.color = "rgba(189, 212, 255, 0.7)";
            instructionsNote.style.fontSize = "0.85em";
            instructionsNote.style.marginTop = "20px";
            instructionsNote.style.fontStyle = "italic";
            instructionsNote.style.fontFamily = "'Raleway', sans-serif";
            startButton.addEventListener("mouseenter", () => {
                startButton.style.transform = "translateY(-3px) scale(1.03)";
                startButton.style.boxShadow =
                    "0 8px 25px rgba(46, 204, 113, 0.5), 0 0 20px rgba(102, 252, 241, 0.6)";
                shine.style.transform = "rotate(45deg) translateX(100%)";
                gameCard.style.transform = "translateY(-5px)";
                gameCard.style.boxShadow =
                    "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(102, 252, 241, 0.3)";
            });
            startButton.addEventListener("mouseleave", () => {
                startButton.style.transform = "translateY(0) scale(1)";
                startButton.style.boxShadow =
                    "0 5px 15px rgba(46, 204, 113, 0.4), 0 0 15px rgba(102, 252, 241, 0.4)";
                shine.style.transform = "rotate(45deg) translateX(-100%)";
                gameCard.style.transform = "translateY(0)";
                gameCard.style.boxShadow =
                    "0 15px 35px rgba(0, 0, 0, 0.3), 0 0 25px rgba(102, 252, 241, 0.2)";
            });
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement("div");
                particle.style.position = "absolute";
                particle.style.width = `${Math.random() * 6 + 2}px`;
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = `rgba(102, 252, 241, ${
                    Math.random() * 0.5 + 0.2
                })`;
                particle.style.borderRadius = "50%";
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.boxShadow = "0 0 10px rgba(102, 252, 241, 0.8)";
                particle.style.animation = `floatParticle ${
                    Math.random() * 10 + 5
                }s infinite ease-in-out`;
                particle.style.opacity = Math.random() * 0.7 + 0.3;
                const keyframes = `
                @keyframes floatParticle {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    50% {
                        transform: translate(${Math.random() * 20 - 10}px, ${
                    Math.random() * 20 - 10
                }px) rotate(180deg);
                    }
                    100% {
                        transform: translate(0, 0) rotate(360deg);
                    }
                }`;
                const style = document.createElement("style");
                style.textContent = keyframes;
                document.head.appendChild(style);
                startGameOverlay.appendChild(particle);
            }
            gameHeader.appendChild(headerDecor);
            gameHeader.appendChild(gameTitle);
            gameHeader.appendChild(headerDecorBottom);
            gameHeader.appendChild(gameBadge);
            controlPanel.appendChild(startButton);
            controlPanel.appendChild(instructionsNote);
            gameCard.appendChild(gameHeader);
            gameCard.appendChild(gameDesc);
            gameCard.appendChild(controlPanel);
            startGameOverlay.appendChild(gameCard);
            const previewWrapperEl = $(
                ".project-preview-wrapper",
                this.container
            );
            previewWrapperEl.style.position = "relative"; 
            previewWrapperEl.appendChild(startGameOverlay);
            this.hideLoadingIndicator();
            const initializeGame = () => {
                try {
                    this.showLoadingIndicator();
                    if (this.currentProject.init) {
                        const boundInitFunction = this.currentProject.init.bind(
                            this
                        );
                        startGameOverlay.style.opacity = "0";
                        setTimeout(() => {
                            if (startGameOverlay.parentNode) {
                                startGameOverlay.parentNode.removeChild(
                                    startGameOverlay
                                );
                            }
                            this.playSound("click");
                            this.currentGameInstance = boundInitFunction(
                                gameElement
                            );
                            this.hideLoadingIndicator();
                        }, 300);
                    } else {
                        console.warn(
                            `No init function found for project: ${projectId}`
                        );
                        this.drawPlaceholder(
                            gameElement,
                            this.currentProject.name,
                            "Initialization Error"
                        );
                        this.hideLoadingIndicator();
                    }
                } catch (error) {
                    console.error(
                        `Error initializing game "${projectId}":`,
                        error
                    );
                    this.drawPlaceholder(
                        gameElement,
                        this.currentProject.name,
                        "Failed to Load"
                    );
                    this.hideLoadingIndicator();
                }
            };
            startButton.addEventListener("click", initializeGame);
            startGameOverlay.addEventListener("click", (e) => {
                if (e.target === startGameOverlay) {
                    initializeGame();
                }
            });
            if (!this.gameStates[projectId]) {
                this.gameStates[projectId] = {
                    score: 0,
                    highScore: 0,
                    lastPlayed: new Date(),
                };
            } else {
                this.gameStates[projectId].lastPlayed = new Date();
            }
            this.saveGameStates(); 
            this.playSound("load"); 
        }
        cleanupCurrentGame() {
            if (this.currentGameInstance) {
                if (typeof this.currentGameInstance.cleanup === "function") {
                    try {
                        this.currentGameInstance.cleanup();
                    } catch (error) {
                        console.error("Error during game cleanup:", error);
                    }
                }
                if (this.currentGameInstance.intervalId) {
                    clearInterval(this.currentGameInstance.intervalId);
                }
                if (this.currentGameInstance.timeoutIds) {
                    this.currentGameInstance.timeoutIds.forEach(clearTimeout);
                }
                this.cleanupListeners(
                    (listener) => listener.gameId === this.currentProject?.id
                );
            }
            const preview = $(".project-preview", this.container);
            preview.innerHTML = ""; 
            this.currentGameInstance = null;
        }
        highlightProjectItem(projectId) {
            $$(".project-item", this.container).forEach((item) => {
                item.classList.toggle("active", item.dataset.id === projectId);
                if (item.dataset.id === projectId) {
                    item.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "start",
                    });
                }
            });
        }
        loadRandomProject() {
            const availableProjects = this.projects.filter(
                (p) => p.id !== this.currentProject?.id
            );
            if (availableProjects.length === 0) return; 
            const randomIndex = Math.floor(
                Math.random() * availableProjects.length
            );
            const randomProject = availableProjects[randomIndex];
            this.loadProject(randomProject.id);
        }
        filterProjects(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            const items = $$(".project-item", this.container);
            const activeCategory =
                $(".category-btn.active", this.container)?.dataset.category ||
                "all";
            items.forEach((item) => {
                const project = this.projects.find(
                    (p) => p.id === item.dataset.id
                );
                if (!project) return;
                const nameMatch = project.name.toLowerCase().includes(term);
                const descMatch = project.description
                    .toLowerCase()
                    .includes(term);
                const categoryMatch = project.category
                    .toLowerCase()
                    .includes(term);
                const isInActiveCategory =
                    activeCategory === "all" ||
                    project.category === activeCategory;
                const isVisible =
                    isInActiveCategory &&
                    (term === "" || nameMatch || descMatch || categoryMatch);
                item.classList.toggle("hidden", !isVisible);
            });
        }
        filterProjectsByCategory(category) {
            const items = $$(".project-item", this.container);
            const currentSearchTerm = $(".project-search", this.container)
                .value;
            items.forEach((item) => {
                const project = this.projects.find(
                    (p) => p.id === item.dataset.id
                );
                if (!project) return;
                const term = currentSearchTerm.toLowerCase().trim();
                const nameMatch = project.name.toLowerCase().includes(term);
                const descMatch = project.description
                    .toLowerCase()
                    .includes(term);
                const categoryMatch = project.category
                    .toLowerCase()
                    .includes(term);
                const isInSelectedCategory =
                    category === "all" || item.dataset.category === category;
                const matchesSearch =
                    term === "" || nameMatch || descMatch || categoryMatch;
                const isVisible = isInSelectedCategory && matchesSearch;
                item.classList.toggle("hidden", !isVisible);
            });
        }
        toggleFullscreen() {
            this.container.classList.toggle("fullscreen");
            const icon = $(".showcase-fullscreen i", this.container);
            icon.className = this.container.classList.contains("fullscreen")
                ? "fas fa-compress-arrows-alt"
                : "fas fa-expand-arrows-alt";
            this.playSound("ui");
            this.dispatchResizeEvent();
        }
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            this.container.classList.toggle("light", !this.isDarkMode);
            this.updateDarkModeButton();
            this.playSound("ui");
            try {
                localStorage.setItem(
                    "projectShowcaseDarkMode",
                    this.isDarkMode
                );
            } catch (e) {
                console.warn("Could not save dark mode preference.");
            }
        }
        updateDarkModeButton() {
            const icon = $(".toggle-darkmode i", this.container);
            icon.className = this.isDarkMode ? "fas fa-sun" : "fas fa-moon";
            $(".toggle-darkmode", this.container).title = this.isDarkMode
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";
        }
        toggleMinimize() {
            this.container.classList.toggle("minimized");
            this.playSound("ui");
        }
        show() {
            try {
                const storedMode = localStorage.getItem(
                    "projectShowcaseDarkMode"
                );
                if (storedMode !== null) {
                    this.isDarkMode = storedMode === "true";
                    this.applyInitialTheme();
                }
            } catch (e) {
                console.warn("Could not load dark mode preference.");
            }
            this.container.classList.add("active");
            this.triggerButton.style.opacity = "0"; 
            this.triggerButton.style.pointerEvents = "none";
            this.playSound("open");
        }
        hide() {
            this.container.classList.remove("active");
            this.triggerButton.style.opacity = "1"; 
            this.triggerButton.style.pointerEvents = "all";
            this.playSound("close");
            this.cleanupCurrentGame();
            this.currentProject = null; 
        }
        toggleGameFullscreen() {
            if (!this.currentProject) return;
            const preview = $(".project-preview", this.container);
            if (!document.fullscreenElement) {
                preview
                    .requestFullscreen?.({ navigationUI: "hide" }) 
                    .catch((err) =>
                        console.error("Fullscreen request failed:", err)
                    );
            } else {
                document.exitFullscreen?.();
            }
            this.playSound("ui");
        }
        restartCurrentGame() {
            if (!this.currentProject || !this.currentProject.init) return;
            this.showLoadingIndicator();
            this.cleanupCurrentGame(); 
            const preview = $(".project-preview", this.container);
            preview.innerHTML = this.currentProject.preview; 
            const gameElement = preview.children[0];
            if (gameElement && gameElement.tagName === "CANVAS") {
                gameElement.style.width = "100%";
                gameElement.style.height = "100%";
                gameElement.style.display = "block";
                gameElement.style.objectFit = "contain";
            }
            if (this.gameStates[this.currentProject.id]) {
                this.gameStates[this.currentProject.id].score = 0;
            }
            this.updateScoreDisplay(); 
            const startGameOverlay = document.createElement("div");
            startGameOverlay.className = "start-game-overlay";
            startGameOverlay.style.position = "absolute";
            startGameOverlay.style.top = "0";
            startGameOverlay.style.left = "0";
            startGameOverlay.style.width = "100%";
            startGameOverlay.style.height = "100%";
            startGameOverlay.style.display = "flex";
            startGameOverlay.style.flexDirection = "column";
            startGameOverlay.style.alignItems = "center";
            startGameOverlay.style.justifyContent = "center";
            startGameOverlay.style.backgroundColor = "rgba(8, 13, 28, 0.85)";
            startGameOverlay.style.zIndex = "5";
            startGameOverlay.style.cursor = "pointer";
            startGameOverlay.style.backdropFilter = "blur(8px)";
            startGameOverlay.style.transition =
                "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
            startGameOverlay.style.boxShadow =
                "inset 0 0 100px rgba(16, 30, 62, 0.6)";
            startGameOverlay.style.border =
                "1px solid rgba(102, 252, 241, 0.15)";
            const gameCard = document.createElement("div");
            gameCard.style.background =
                "linear-gradient(135deg, rgba(40, 50, 80, 0.8) 0%, rgba(20, 30, 55, 0.9) 100%)";
            gameCard.style.backdropFilter = "blur(4px)";
            gameCard.style.borderRadius = "12px";
            gameCard.style.padding = "30px 40px";
            gameCard.style.display = "flex";
            gameCard.style.flexDirection = "column";
            gameCard.style.alignItems = "center";
            gameCard.style.maxWidth = "80%";
            gameCard.style.width = "400px";
            gameCard.style.border = "1px solid rgba(102, 252, 241, 0.2)";
            gameCard.style.boxShadow =
                "0 15px 35px rgba(0, 0, 0, 0.3), 0 0 25px rgba(102, 252, 241, 0.2)";
            gameCard.style.transform = "translateY(0)";
            gameCard.style.transition =
                "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)";
            const gameHeader = document.createElement("div");
            gameHeader.style.position = "relative";
            gameHeader.style.marginBottom = "25px";
            gameHeader.style.padding = "0 10px";
            const headerDecor = document.createElement("div");
            headerDecor.style.position = "absolute";
            headerDecor.style.height = "3px";
            headerDecor.style.width = "60%";
            headerDecor.style.background =
                "linear-gradient(90deg, rgba(102, 252, 241, 0) 0%, rgba(102, 252, 241, 1) 50%, rgba(102, 252, 241, 0) 100%)";
            headerDecor.style.top = "-10px";
            headerDecor.style.left = "20%";
            headerDecor.style.borderRadius = "3px";
            headerDecor.style.boxShadow = "0 0 10px rgba(102, 252, 241, 0.8)";
            const gameTitle = document.createElement("div");
            gameTitle.textContent = this.currentProject.name.toUpperCase();
            gameTitle.style.color = "#fff";
            gameTitle.style.fontSize = "1.8em";
            gameTitle.style.fontWeight = "bold";
            gameTitle.style.letterSpacing = "2px";
            gameTitle.style.textAlign = "center";
            gameTitle.style.fontFamily = "'Raleway', sans-serif";
            gameTitle.style.textShadow =
                "0 0 10px rgba(102, 252, 241, 0.8), 0 0 20px rgba(102, 252, 241, 0.4)";
            const gameBadge = document.createElement("div");
            gameBadge.textContent = "RESTART";
            gameBadge.style.position = "absolute";
            gameBadge.style.top = "-35px";
            gameBadge.style.right = "-20px";
            gameBadge.style.backgroundColor = "rgba(255, 184, 48, 0.9)";
            gameBadge.style.color = "#000";
            gameBadge.style.fontSize = "0.65em";
            gameBadge.style.fontWeight = "bold";
            gameBadge.style.padding = "5px 10px";
            gameBadge.style.borderRadius = "4px";
            gameBadge.style.boxShadow = "0 0 15px rgba(255, 184, 48, 0.8)";
            gameBadge.style.transform = "rotate(15deg)";
            const controlPanel = document.createElement("div");
            controlPanel.style.display = "flex";
            controlPanel.style.flexDirection = "column";
            controlPanel.style.alignItems = "center";
            controlPanel.style.width = "100%";
            controlPanel.style.marginTop = "15px";
            const startButton = document.createElement("button");
            startButton.innerHTML =
                '<span>RESTART GAME</span><i class="fas fa-redo-alt" style="margin-left: 10px; font-size: 0.8em;"></i>';
            startButton.style.padding = "12px 30px";
            startButton.style.fontSize = "1.1em";
            startButton.style.fontWeight = "bold";
            startButton.style.letterSpacing = "1px";
            startButton.style.background =
                "linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%)";
            startButton.style.color = "#fff";
            startButton.style.border = "none";
            startButton.style.borderRadius = "6px";
            startButton.style.cursor = "pointer";
            startButton.style.boxShadow =
                "0 5px 15px rgba(255, 159, 67, 0.4), 0 0 15px rgba(102, 252, 241, 0.2)";
            startButton.style.transition =
                "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)";
            startButton.style.marginBottom = "15px";
            startButton.style.fontFamily = "'Raleway', sans-serif";
            startButton.style.position = "relative";
            startButton.style.overflow = "hidden";
            startButton.style.display = "flex";
            startButton.style.alignItems = "center";
            startButton.style.justifyContent = "center";
            const shine = document.createElement("div");
            shine.style.position = "absolute";
            shine.style.top = "-50%";
            shine.style.left = "-50%";
            shine.style.width = "200%";
            shine.style.height = "200%";
            shine.style.background =
                "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)";
            shine.style.transform = "rotate(45deg) translateX(-100%)";
            shine.style.transition = "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
            shine.style.pointerEvents = "none";
            startButton.appendChild(shine);
            startButton.addEventListener("mouseenter", () => {
                startButton.style.transform = "translateY(-3px) scale(1.03)";
                startButton.style.boxShadow =
                    "0 8px 25px rgba(255, 159, 67, 0.5), 0 0 20px rgba(102, 252, 241, 0.4)";
                shine.style.transform = "rotate(45deg) translateX(100%)";
                gameCard.style.transform = "translateY(-5px)";
                gameCard.style.boxShadow =
                    "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(102, 252, 241, 0.3)";
            });
            startButton.addEventListener("mouseleave", () => {
                startButton.style.transform = "translateY(0) scale(1)";
                startButton.style.boxShadow =
                    "0 5px 15px rgba(255, 159, 67, 0.4), 0 0 15px rgba(102, 252, 241, 0.2)";
                shine.style.transform = "rotate(45deg) translateX(-100%)";
                gameCard.style.transform = "translateY(0)";
                gameCard.style.boxShadow =
                    "0 15px 35px rgba(0, 0, 0, 0.3), 0 0 25px rgba(102, 252, 241, 0.2)";
            });
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement("div");
                particle.style.position = "absolute";
                particle.style.width = `${Math.random() * 6 + 2}px`;
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = `rgba(255, 159, 67, ${
                    Math.random() * 0.5 + 0.2
                })`;
                particle.style.borderRadius = "50%";
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.boxShadow = "0 0 10px rgba(255, 159, 67, 0.8)";
                particle.style.animation = `floatRestartParticle ${
                    Math.random() * 10 + 5
                }s infinite ease-in-out`;
                particle.style.opacity = Math.random() * 0.7 + 0.3;
                const keyframes = `
                @keyframes floatRestartParticle {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    50% {
                        transform: translate(${Math.random() * 20 - 10}px, ${
                    Math.random() * 20 - 10
                }px) rotate(180deg);
                    }
                    100% {
                        transform: translate(0, 0) rotate(360deg);
                    }
                }`;
                const style = document.createElement("style");
                style.textContent = keyframes;
                document.head.appendChild(style);
                startGameOverlay.appendChild(particle);
            }
            gameHeader.appendChild(headerDecor);
            gameHeader.appendChild(gameTitle);
            gameHeader.appendChild(gameBadge);
            controlPanel.appendChild(startButton);
            gameCard.appendChild(gameHeader);
            gameCard.appendChild(controlPanel);
            startGameOverlay.appendChild(gameCard);
            const previewWrapperElement = $(
                ".project-preview-wrapper",
                this.container
            );
            previewWrapperElement.style.position = "relative"; 
            previewWrapperElement.appendChild(startGameOverlay);
            this.hideLoadingIndicator();
            const initializeRestartedGame = () => {
                try {
                    this.showLoadingIndicator();
                    const boundInitFunction = this.currentProject.init.bind(
                        this
                    );
                    startGameOverlay.style.opacity = "0";
                    setTimeout(() => {
                        if (startGameOverlay.parentNode) {
                            startGameOverlay.parentNode.removeChild(
                                startGameOverlay
                            );
                        }
                        this.playSound("click");
                        this.currentGameInstance = boundInitFunction(
                            gameElement
                        );
                        this.hideLoadingIndicator();
                    }, 300);
                } catch (error) {
                    console.error(
                        `Error restarting game "${this.currentProject.id}":`,
                        error
                    );
                    this.drawPlaceholder(
                        gameElement,
                        this.currentProject.name,
                        "Failed to Restart"
                    );
                    this.hideLoadingIndicator();
                }
            };
            startButton.addEventListener("click", initializeRestartedGame);
            startGameOverlay.addEventListener("click", (e) => {
                if (e.target === startGameOverlay) {
                    initializeRestartedGame();
                }
            });
            this.playSound("restart");
        }
        toggleGameSound() {
            this.soundEnabled = !this.soundEnabled;
            const soundBtnIcon = $(".game-sound-btn i", this.container);
            soundBtnIcon.className = this.soundEnabled
                ? "fas fa-volume-up"
                : "fas fa-volume-mute";
            if (this.soundEnabled) {
                this.playSound("ui"); 
            }
            if (
                this.currentGameInstance &&
                typeof this.currentGameInstance.setSoundEnabled === "function"
            ) {
                this.currentGameInstance.setSoundEnabled(this.soundEnabled);
            }
        }
        showLoadingIndicator() {
            const indicator = $(".loading-indicator", this.container);
            const canvas = $("canvas", this.container);
            if (indicator) indicator.classList.add("visible");
            if (canvas) canvas.classList.add("loading"); 
        }
        hideLoadingIndicator() {
            const indicator = $(".loading-indicator", this.container);
            const canvas = $("canvas", this.container);
            if (indicator) indicator.classList.remove("visible");
            if (canvas) canvas.classList.remove("loading");
        }
        dispatchResizeEvent() {
            window.dispatchEvent(new Event("resize"));
            if (
                this.currentGameInstance &&
                typeof this.currentGameInstance.resize === "function"
            ) {
                this.currentGameInstance.resize();
            }
        }
        getAudioContext() {
            if (!this.audioContext) {
                try {
                    this.audioContext = new (window.AudioContext ||
                        window.webkitAudioContext)();
                } catch (e) {
                    console.error(
                        "Web Audio API is not supported in this browser."
                    );
                    this.soundEnabled = false; 
                }
            }
            return this.audioContext;
        }
        playSound(soundType) {
            if (!this.soundEnabled) return;
            const audioCtx = this.getAudioContext();
            if (!audioCtx) return;
            const sounds = {
                click: {
                    type: "sine",
                    freq: 880,
                    duration: 0.05,
                    vol: 0.3,
                    decay: 0.04,
                }, 
                ui: {
                    type: "triangle",
                    freq: 660,
                    duration: 0.06,
                    vol: 0.25,
                    decay: 0.05,
                }, 
                open: {
                    type: "sine",
                    freq: 523.25,
                    duration: 0.15,
                    vol: 0.4,
                    decay: 0.1,
                }, 
                close: {
                    type: "sine",
                    freq: 440,
                    duration: 0.15,
                    vol: 0.4,
                    decay: 0.1,
                }, 
                load: {
                    type: "square",
                    freq: 110,
                    duration: 0.1,
                    vol: 0.2,
                    decay: 0.08,
                }, 
                restart: {
                    type: "sawtooth",
                    freq: [220, 440],
                    duration: 0.15,
                    vol: 0.3,
                    decay: 0.1,
                }, 
                point: {
                    type: "triangle",
                    freq: 1046.5,
                    duration: 0.08,
                    vol: 0.35,
                    decay: 0.07,
                }, 
                shoot: {
                    type: "square",
                    freq: 440,
                    duration: 0.05,
                    vol: 0.2,
                    decay: 0.04,
                }, 
                explosion: {
                    type: "noise",
                    duration: 0.3,
                    vol: 0.5,
                    decay: 0.25,
                }, 
                jump: {
                    type: "sine",
                    freq: [660, 880],
                    duration: 0.1,
                    vol: 0.3,
                    decay: 0.08,
                }, 
                hit: {
                    type: "sawtooth",
                    freq: 220,
                    duration: 0.1,
                    vol: 0.4,
                    decay: 0.09,
                }, 
                powerup: {
                    type: "sine",
                    freq: [523, 659, 783],
                    duration: 0.3,
                    vol: 0.4,
                    decay: 0.25,
                }, 
                win: {
                    type: "sine",
                    freq: [523, 783, 1046],
                    duration: 0.5,
                    vol: 0.5,
                    decay: 0.4,
                }, 
                gameOver: {
                    type: "sawtooth",
                    freq: [220, 110],
                    duration: 0.8,
                    vol: 0.5,
                    decay: 0.7,
                }, 
            };
            const sound = sounds[soundType];
            if (!sound) return;
            try {
                let oscillator;
                if (sound.type === "noise") {
                    oscillator = audioCtx.createBufferSource();
                    const bufferSize = audioCtx.sampleRate * sound.duration;
                    const buffer = audioCtx.createBuffer(
                        1,
                        bufferSize,
                        audioCtx.sampleRate
                    );
                    const output = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        output[i] = Math.random() * 2 - 1; 
                    }
                    oscillator.buffer = buffer;
                } else {
                    oscillator = audioCtx.createOscillator();
                    oscillator.type = sound.type || "sine";
                    if (Array.isArray(sound.freq)) {
                        oscillator.frequency.setValueAtTime(
                            sound.freq[0],
                            audioCtx.currentTime
                        );
                        for (let i = 1; i < sound.freq.length; i++) {
                            oscillator.frequency.linearRampToValueAtTime(
                                sound.freq[i],
                                audioCtx.currentTime +
                                    sound.duration * (i / sound.freq.length)
                            );
                        }
                    } else {
                        oscillator.frequency.setValueAtTime(
                            sound.freq,
                            audioCtx.currentTime
                        );
                    }
                }
                const gainNode = audioCtx.createGain();
                gainNode.gain.setValueAtTime(sound.vol, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                    0.001,
                    audioCtx.currentTime + sound.decay
                ); 
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + sound.duration);
            } catch (error) {
                console.error(`Error playing sound "${soundType}":`, error);
                if (
                    audioCtx.state === "interrupted" ||
                    audioCtx.state === "closed"
                ) {
                    this.audioContext = null;
                }
            }
        }
        updateScore(score) {
            if (!this.currentProject) return;
            const projectId = this.currentProject.id;
            if (!this.gameStates[projectId]) {
                this.gameStates[projectId] = {
                    score: 0,
                    highScore: 0,
                    lastPlayed: new Date(),
                };
            }
            const state = this.gameStates[projectId];
            state.score = score;
            let newHighScore = false;
            if (score > state.highScore) {
                state.highScore = score;
                newHighScore = true;
            }
            this.updateScoreDisplay(); 
            this.saveGameStates(); 
            return newHighScore; 
        }
        updateScoreDisplay() {
            const scoreDisplay = $(".current-score", this.container);
            const highScoreDisplay = $(".high-score", this.container);
            if (!scoreDisplay || !highScoreDisplay) return;
            if (this.currentProject) {
                const state = this.gameStates[this.currentProject.id] || {
                    score: 0,
                    highScore: 0,
                };
                scoreDisplay.textContent = `Score: ${state.score}`;
                highScoreDisplay.textContent = `High Score: ${state.highScore}`;
            } else {
                scoreDisplay.textContent = "Score: -";
                highScoreDisplay.textContent = "High Score: -";
            }
        }
        getScore() {
            if (!this.currentProject) return 0;
            return this.gameStates[this.currentProject.id]?.score || 0;
        }
        getHighScore() {
            if (!this.currentProject) return 0;
            return this.gameStates[this.currentProject.id]?.highScore || 0;
        }
        saveGameStates() {
            try {
                localStorage.setItem(
                    "projectShowcaseGameStates",
                    JSON.stringify(this.gameStates)
                );
            } catch (e) {
                console.warn("Could not save game states to localStorage:", e);
            }
        }
        loadGameStates() {
            try {
                const savedStates = localStorage.getItem(
                    "projectShowcaseGameStates"
                );
                return savedStates ? JSON.parse(savedStates) : {};
            } catch (e) {
                console.warn(
                    "Could not load game states from localStorage:",
                    e
                );
                return {};
            }
        }
        drawPlaceholder(gameElement, gameName, message) {
            if (!gameElement) return;
            if (gameElement.tagName === "CANVAS") {
                const ctx = gameElement.getContext("2d");
                const canvas = gameElement;
                ctx.fillStyle = "#111"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "bold 24px var(--font-heading)";
                ctx.fillStyle = "var(--primary-color)";
                ctx.textAlign = "center";
                ctx.fillText(
                    gameName,
                    canvas.width / 2,
                    canvas.height / 2 - 30
                );
                ctx.font = "16px var(--font-main)";
                ctx.fillStyle = "#ccc";
                ctx.fillText(
                    message || "Coming Soon!",
                    canvas.width / 2,
                    canvas.height / 2 + 10
                );
                ctx.fillText(
                    "Select another game or try restarting.",
                    canvas.width / 2,
                    canvas.height / 2 + 40
                );
            } else if (gameElement.tagName === "DIV") {
                gameElement.style.display = "flex";
                gameElement.style.flexDirection = "column";
                gameElement.style.alignItems = "center";
                gameElement.style.justifyContent = "center";
                gameElement.style.background = "#111";
                gameElement.style.color = "#ccc";
                gameElement.style.textAlign = "center";
                gameElement.style.height = "100%";
                gameElement.style.padding = "20px";
                gameElement.innerHTML = `
                    <h3 style="color: var(--primary-color); font-family: var(--font-heading); margin-bottom: 15px;">${gameName}</h3>
                    <p>${message || "Coming Soon!"}</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Select another game or try restarting.</p>
                `;
            }
            this.hideLoadingIndicator(); 
        }
        initBreakoutGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this; 
            let animationFrameId;
            let score = 0;
            let lives = 3;
            const ball = {
                x: canvas.width / 2,
                y: canvas.height - 30,
                radius: 8,
                dx: 3,
                dy: -3,
                speed: 4,
            };
            const paddle = {
                x: (canvas.width - 80) / 2,
                y: canvas.height - 15,
                width: 80,
                height: 10,
                dx: 6,
            };
            const bricks = [];
            const brickInfo = {
                rows: 5,
                cols: 9,
                width: 55,
                height: 15,
                padding: 10,
                offsetTop: 40,
                offsetLeft: 30,
            };
            const colors = [
                "#e74c3c",
                "#e67e22",
                "#f1c40f",
                "#2ecc71",
                "#3498db",
            ];
            let rightPressed = false;
            let leftPressed = false;
            function createBricks() {
                bricks.length = 0; 
                for (let c = 0; c < brickInfo.cols; c++) {
                    bricks[c] = [];
                    for (let r = 0; r < brickInfo.rows; r++) {
                        const brickX =
                            c * (brickInfo.width + brickInfo.padding) +
                            brickInfo.offsetLeft;
                        const brickY =
                            r * (brickInfo.height + brickInfo.padding) +
                            brickInfo.offsetTop;
                        bricks[c][r] = {
                            x: brickX,
                            y: brickY,
                            status: 1,
                            color: colors[r % colors.length],
                        };
                    }
                }
            }
            function drawBall() {
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.closePath();
            }
            function drawPaddle() {
                ctx.beginPath();
                ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
                ctx.fillStyle = "var(--primary-color)";
                ctx.fill();
                ctx.closePath();
            }
            function drawBricks() {
                for (let c = 0; c < brickInfo.cols; c++) {
                    for (let r = 0; r < brickInfo.rows; r++) {
                        if (bricks[c][r].status === 1) {
                            const brick = bricks[c][r];
                            ctx.beginPath();
                            ctx.rect(
                                brick.x,
                                brick.y,
                                brickInfo.width,
                                brickInfo.height
                            );
                            ctx.fillStyle = brick.color;
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
            function drawScore() {
                ctx.font = "16px var(--font-main)";
                ctx.fillStyle = "#fff";
                ctx.fillText(`Score: ${score}`, 8, 25);
            }
            function drawLives() {
                ctx.font = "16px var(--font-main)";
                ctx.fillStyle = "#fff";
                ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 25);
            }
            function collisionDetection() {
                for (let c = 0; c < brickInfo.cols; c++) {
                    for (let r = 0; r < brickInfo.rows; r++) {
                        const b = bricks[c][r];
                        if (b.status === 1) {
                            if (
                                ball.x > b.x &&
                                ball.x < b.x + brickInfo.width &&
                                ball.y > b.y &&
                                ball.y < b.y + brickInfo.height
                            ) {
                                ball.dy = -ball.dy;
                                b.status = 0;
                                score += 10;
                                self.updateScore(score);
                                self.playSound("hit");
                                if (
                                    score ===
                                    brickInfo.rows * brickInfo.cols * 10
                                ) {
                                    self.playSound("win");
                                    alert("YOU WIN! CONGRATULATIONS!");
                                    cancelAnimationFrame(animationFrameId);
                                    self.restartCurrentGame();
                                }
                                return; 
                            }
                        }
                    }
                }
                if (
                    ball.x + ball.dx > canvas.width - ball.radius ||
                    ball.x + ball.dx < ball.radius
                ) {
                    ball.dx = -ball.dx;
                    self.playSound("click");
                }
                if (ball.y + ball.dy < ball.radius) {
                    ball.dy = -ball.dy;
                    self.playSound("click");
                } else if (
                    ball.y + ball.dy >
                    canvas.height - ball.radius - paddle.height + 5
                ) {
                    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                        ball.dy = -ball.dy;
                        let deltaX = ball.x - (paddle.x + paddle.width / 2);
                        ball.dx = deltaX * 0.15; 
                        ball.dx = Math.max(
                            -ball.speed * 0.9,
                            Math.min(ball.speed * 0.9, ball.dx)
                        );
                        self.playSound("click");
                    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
                        lives--;
                        self.playSound("gameOver");
                        if (!lives) {
                            alert("GAME OVER");
                            cancelAnimationFrame(animationFrameId);
                            self.restartCurrentGame(); 
                        } else {
                            ball.x = canvas.width / 2;
                            ball.y = canvas.height - 30;
                            ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1); 
                            ball.dy = -3;
                            paddle.x = (canvas.width - paddle.width) / 2;
                        }
                    }
                }
            }
            function movePaddle() {
                if (rightPressed && paddle.x < canvas.width - paddle.width) {
                    paddle.x += paddle.dx;
                } else if (leftPressed && paddle.x > 0) {
                    paddle.x -= paddle.dx;
                }
            }
            function updateBallPosition() {
                ball.x += ball.dx;
                ball.y += ball.dy;
            }
            function gameLoop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBricks();
                drawBall();
                drawPaddle();
                drawScore();
                drawLives();
                collisionDetection();
                movePaddle();
                updateBallPosition();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const keyDownHandler = (e) => {
                if (e.key === "Right" || e.key === "ArrowRight")
                    rightPressed = true;
                else if (e.key === "Left" || e.key === "ArrowLeft")
                    leftPressed = true;
            };
            const keyUpHandler = (e) => {
                if (e.key === "Right" || e.key === "ArrowRight")
                    rightPressed = false;
                else if (e.key === "Left" || e.key === "ArrowLeft")
                    leftPressed = false;
            };
            const mouseMoveHandler = (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width; 
                const relativeX = (e.clientX - rect.left) * scaleX;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddle.x = relativeX - paddle.width / 2;
                    paddle.x = Math.max(
                        0,
                        Math.min(canvas.width - paddle.width, paddle.x)
                    );
                }
            };
            self.addManagedListener(document, "keydown", keyDownHandler, {
                gameId: "breakout",
            });
            self.addManagedListener(document, "keyup", keyUpHandler, {
                gameId: "breakout",
            });
            self.addManagedListener(canvas, "mousemove", mouseMoveHandler, {
                gameId: "breakout",
            });
            createBricks();
            gameLoop();
            return {
                cleanup: () => {
                    cancelAnimationFrame(animationFrameId);
                },
            };
        }
        initSnakeGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            const box = 20; 
            const canvasSize = canvas.width; 
            const boxesCount = canvasSize / box;
            let score = 0;
            let snake;
            let food;
            let direction; 
            let changingDirection; 
            let gameInterval;
            let gameSpeed = 120; 
            function initGame() {
                snake = [
                    {
                        x: Math.floor(boxesCount / 2) * box,
                        y: Math.floor(boxesCount / 2) * box,
                    },
                ];
                createFood();
                score = 0;
                self.updateScore(score); 
                direction = undefined; 
                changingDirection = false;
            }
            function createFood() {
                let foodX, foodY;
                do {
                    foodX = Math.floor(Math.random() * boxesCount) * box;
                    foodY = Math.floor(Math.random() * boxesCount) * box;
                } while (
                    snake.some(
                        (segment) => segment.x === foodX && segment.y === foodY
                    )
                ); 
                food = { x: foodX, y: foodY };
            }
            function drawSnakePart(snakePart, index) {
                ctx.fillStyle = index === 0 ? "#32ff7e" : "#2ecc71"; 
                ctx.strokeStyle = "#1b1b1b"; 
                ctx.fillRect(snakePart.x, snakePart.y, box, box);
                ctx.strokeRect(snakePart.x, snakePart.y, box, box);
            }
            function drawSnake() {
                snake.forEach(drawSnakePart);
            }
            function drawFood() {
                ctx.fillStyle = "#ff4757"; 
                ctx.strokeStyle = "#darkred";
                ctx.fillRect(food.x, food.y, box, box);
                ctx.strokeRect(food.x, food.y, box, box);
            }
            function drawScore() {
                ctx.fillStyle = "#fff";
                ctx.font = "18px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText("Score: " + score, box, box);
            }
            function moveSnake() {
                if (!direction) return; 
                let headX = snake[0].x;
                let headY = snake[0].y;
                if (direction === "LEFT") headX -= box;
                if (direction === "UP") headY -= box;
                if (direction === "RIGHT") headX += box;
                if (direction === "DOWN") headY += box;
                const newHead = { x: headX, y: headY };
                if (
                    headX < 0 ||
                    headX >= canvasSize ||
                    headY < 0 ||
                    headY >= canvasSize ||
                    didCollide(newHead)
                ) {
                    gameOver();
                    return;
                }
                snake.unshift(newHead); 
                if (headX === food.x && headY === food.y) {
                    score += 10;
                    self.updateScore(score);
                    self.playSound("point");
                    createFood();
                } else {
                    snake.pop(); 
                }
                changingDirection = false; 
            }
            function didCollide(head) {
                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        return true;
                    }
                }
                return false;
            }
            function changeDirection(event) {
                if (changingDirection) return; 
                const keyPressed = event.key;
                const goingUp = direction === "UP";
                const goingDown = direction === "DOWN";
                const goingRight = direction === "RIGHT";
                const goingLeft = direction === "LEFT";
                if (
                    (keyPressed === "ArrowLeft" ||
                        keyPressed.toLowerCase() === "a") &&
                    !goingRight
                ) {
                    direction = "LEFT";
                    changingDirection = true;
                }
                if (
                    (keyPressed === "ArrowUp" ||
                        keyPressed.toLowerCase() === "w") &&
                    !goingDown
                ) {
                    direction = "UP";
                    changingDirection = true;
                }
                if (
                    (keyPressed === "ArrowRight" ||
                        keyPressed.toLowerCase() === "d") &&
                    !goingLeft
                ) {
                    direction = "RIGHT";
                    changingDirection = true;
                }
                if (
                    (keyPressed === "ArrowDown" ||
                        keyPressed.toLowerCase() === "s") &&
                    !goingUp
                ) {
                    direction = "DOWN";
                    changingDirection = true;
                }
            }
            function gameOver() {
                clearInterval(gameInterval);
                self.playSound("gameOver");
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 0, canvasSize, canvasSize);
                ctx.font = "40px var(--font-heading)";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText("GAME OVER", canvasSize / 2, canvasSize / 2 - 20);
                ctx.font = "20px var(--font-main)";
                ctx.fillStyle = "white";
                ctx.fillText(
                    `Final Score: ${score}`,
                    canvasSize / 2,
                    canvasSize / 2 + 20
                );
                ctx.fillText(
                    "Click Restart to Play Again",
                    canvasSize / 2,
                    canvasSize / 2 + 50
                );
            }
            function gameLoop() {
                ctx.fillStyle = "#1a1a2e"; 
                ctx.fillRect(0, 0, canvasSize, canvasSize);
                moveSnake(); 
                if (gameInterval) {
                    drawFood();
                    drawSnake();
                    drawScore();
                }
            }
            self.addManagedListener(document, "keydown", changeDirection, {
                gameId: "snake",
            });
            initGame();
            gameInterval = setInterval(gameLoop, gameSpeed);
            return {
                cleanup: () => {
                    clearInterval(gameInterval);
                    gameInterval = null; 
                },
            };
        }
        initTetrisGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            const scale = 30; 
            const rows = canvas.height / scale;
            const cols = canvas.width / scale;
            const colors = [
                null,
                "#FF0D72",
                "#0DC2FF",
                "#0DFF72",
                "#F538FF",
                "#FF8E0D",
                "#FFE138",
                "#3877FF", 
            ];
            const pieces = "TJLOSZI"; 
            let board;
            let player;
            let dropCounter;
            let dropInterval; 
            let lastTime;
            let score;
            let level;
            let linesCleared;
            let animationFrameId;
            let paused = false;
            function createMatrix(w, h) {
                const matrix = [];
                while (h--) {
                    matrix.push(new Array(w).fill(0));
                }
                return matrix;
            }
            function createPiece(type) {
                switch (type) {
                    case "T":
                        return [
                            [0, 1, 0],
                            [1, 1, 1],
                            [0, 0, 0],
                        ];
                    case "J":
                        return [
                            [2, 0, 0],
                            [2, 2, 2],
                            [0, 0, 0],
                        ];
                    case "L":
                        return [
                            [0, 0, 3],
                            [3, 3, 3],
                            [0, 0, 0],
                        ];
                    case "O":
                        return [
                            [4, 4],
                            [4, 4],
                        ];
                    case "S":
                        return [
                            [0, 5, 5],
                            [5, 5, 0],
                            [0, 0, 0],
                        ];
                    case "Z":
                        return [
                            [6, 6, 0],
                            [0, 6, 6],
                            [0, 0, 0],
                        ];
                    case "I":
                        return [
                            [0, 0, 0, 0],
                            [7, 7, 7, 7],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                        ];
                }
            }
            function drawMatrix(matrix, offset) {
                matrix.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value !== 0) {
                            ctx.fillStyle = colors[value];
                            ctx.fillRect(
                                (x + offset.x) * scale,
                                (y + offset.y) * scale,
                                scale,
                                scale
                            );
                            ctx.strokeStyle = "rgba(0,0,0,0.3)"; 
                            ctx.strokeRect(
                                (x + offset.x) * scale,
                                (y + offset.y) * scale,
                                scale,
                                scale
                            );
                        }
                    });
                });
            }
            function draw() {
                ctx.fillStyle = "#111";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawMatrix(board, { x: 0, y: 0 });
                drawMatrix(player.matrix, player.pos);
                drawGhostPiece();
                ctx.fillStyle = "#fff";
                ctx.font = "16px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, 25);
                ctx.fillText(`Level: ${level}`, 10, 50);
                ctx.fillText(`Lines: ${linesCleared}`, 10, 75);
                if (paused) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
                    ctx.font = "24px var(--font-heading)";
                    ctx.fillStyle = "var(--primary-color)";
                    ctx.textAlign = "center";
                    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
                }
            }
            function drawGhostPiece() {
                const ghost = { ...player }; 
                ghost.matrix = player.matrix; 
                ghost.pos = { x: player.pos.x, y: player.pos.y }; 
                while (!collide(board, ghost)) {
                    ghost.pos.y++;
                }
                ghost.pos.y--; 
                ctx.globalAlpha = 0.2;
                drawMatrix(ghost.matrix, ghost.pos);
                ctx.globalAlpha = 1.0;
            }
            function merge(board, player) {
                player.matrix.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value !== 0) {
                            if (
                                y + player.pos.y >= 0 &&
                                y + player.pos.y < board.length &&
                                x + player.pos.x >= 0 &&
                                x + player.pos.x < board[0].length
                            ) {
                                board[y + player.pos.y][
                                    x + player.pos.x
                                ] = value;
                            }
                        }
                    });
                });
            }
            function rotate(matrix, dir) {
                for (let y = 0; y < matrix.length; ++y) {
                    for (let x = 0; x < y; ++x) {
                        [matrix[x][y], matrix[y][x]] = [
                            matrix[y][x],
                            matrix[x][y],
                        ];
                    }
                }
                if (dir > 0) {
                    matrix.forEach((row) => row.reverse());
                } else {
                    matrix.reverse();
                }
            }
            function playerRotate(dir) {
                const pos = player.pos.x;
                let offset = 1;
                rotate(player.matrix, dir);
                while (collide(board, player)) {
                    player.pos.x += offset;
                    offset = -(offset + (offset > 0 ? 1 : -1));
                    if (offset > player.matrix[0].length + 1) {
                        rotate(player.matrix, -dir); 
                        player.pos.x = pos; 
                        return; 
                    }
                }
                self.playSound("click"); 
            }
            function playerMove(offset) {
                player.pos.x += offset;
                if (collide(board, player)) {
                    player.pos.x -= offset; 
                }
            }
            function playerDrop() {
                player.pos.y++;
                if (collide(board, player)) {
                    player.pos.y--; 
                    merge(board, player); 
                    self.playSound("hit"); 
                    playerReset(); 
                    arenaSweep(); 
                    updateGameStats(); 
                }
                dropCounter = 0; 
            }
            function playerHardDrop() {
                while (!collide(board, player)) {
                    player.pos.y++;
                }
                player.pos.y--; 
                merge(board, player);
                self.playSound("hit");
                playerReset();
                arenaSweep();
                updateGameStats();
                dropCounter = 0; 
            }
            function collide(board, player) {
                const [m, o] = [player.matrix, player.pos];
                for (let y = 0; y < m.length; ++y) {
                    for (let x = 0; x < m[y].length; ++x) {
                        if (m[y][x] !== 0) {
                            let boardY = y + o.y;
                            let boardX = x + o.x;
                            if (
                                boardX < 0 ||
                                boardX >= cols ||
                                boardY >= rows ||
                                (boardY >= 0 &&
                                    board[boardY] &&
                                    board[boardY][boardX] !== 0)
                            ) {
                                return true; 
                            }
                        }
                    }
                }
                return false; 
            }
            function playerReset() {
                const type = pieces[Math.floor(Math.random() * pieces.length)];
                player.matrix = createPiece(type);
                player.pos.y = 0; 
                player.pos.x =
                    Math.floor(cols / 2) -
                    Math.floor(player.matrix[0].length / 2); 
                if (collide(board, player)) {
                    gameOver();
                }
            }
            function arenaSweep() {
                let rowsClearedThisTurn = 0;
                outer: for (let y = board.length - 1; y >= 0; --y) {
                    for (let x = 0; x < board[y].length; ++x) {
                        if (board[y][x] === 0) {
                            continue outer; 
                        }
                    }
                    const row = board.splice(y, 1)[0].fill(0); 
                    board.unshift(row); 
                    ++y; 
                    rowsClearedThisTurn++;
                }
                if (rowsClearedThisTurn > 0) {
                    const lineScores = [0, 100, 300, 500, 800]; 
                    score += lineScores[rowsClearedThisTurn] * level;
                    linesCleared += rowsClearedThisTurn;
                    self.playSound(rowsClearedThisTurn >= 4 ? "win" : "point"); 
                    level = Math.floor(linesCleared / 10) + 1;
                    dropInterval = Math.max(100, 1000 - (level - 1) * 75); 
                }
            }
            function updateGameStats() {
                self.updateScore(score); 
            }
            function gameOver() {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                self.playSound("gameOver");
                ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "30px var(--font-heading)";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(
                    "GAME OVER",
                    canvas.width / 2,
                    canvas.height / 2 - 20
                );
                ctx.font = "18px var(--font-main)";
                ctx.fillStyle = "white";
                ctx.fillText(
                    `Final Score: ${score}`,
                    canvas.width / 2,
                    canvas.height / 2 + 20
                );
                ctx.fillText(
                    "Click Restart",
                    canvas.width / 2,
                    canvas.height / 2 + 50
                );
            }
            function update(time = 0) {
                if (paused || !animationFrameId) return; 
                const deltaTime = time - lastTime;
                lastTime = time;
                dropCounter += deltaTime;
                if (dropCounter > dropInterval) {
                    playerDrop(); 
                }
                draw();
                animationFrameId = requestAnimationFrame(update);
            }
            function handleKeyDown(event) {
                if (!animationFrameId) return; 
                if (event.key === "p" || event.key === "P") {
                    paused = !paused;
                    if (!paused) {
                        lastTime = performance.now(); 
                        update(); 
                    }
                    self.playSound("ui");
                    draw(); 
                    return; 
                }
                if (paused) return; 
                switch (event.key) {
                    case "ArrowLeft":
                    case "a":
                        playerMove(-1);
                        break;
                    case "ArrowRight":
                    case "d":
                        playerMove(1);
                        break;
                    case "ArrowDown":
                    case "s":
                        playerDrop();
                        break;
                    case "ArrowUp": 
                    case "w":
                    case "x":
                        playerRotate(1);
                        break;
                    case "z": 
                        playerRotate(-1);
                        break;
                    case " ": 
                        playerHardDrop();
                        break;
                }
            }
            function startGame() {
                board = createMatrix(cols, rows);
                player = { pos: { x: 0, y: 0 }, matrix: null };
                score = 0;
                level = 1;
                linesCleared = 0;
                dropInterval = 1000;
                dropCounter = 0;
                lastTime = 0;
                paused = false;
                self.updateScore(score); 
                playerReset(); 
                if (animationFrameId) cancelAnimationFrame(animationFrameId); 
                animationFrameId = requestAnimationFrame(update); 
            }
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "tetris",
            });
            startGame();
            return {
                cleanup: () => {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                },
            };
        }
        initPongGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const paddleWidth = 10,
                paddleHeight = 100,
                ballRadius = 8;
            const playerSpeed = 6,
                aiSpeed = 4; 
            let ball = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                dx: 5,
                dy: 3,
                radius: ballRadius,
            };
            let player1 = {
                x: 10,
                y: (canvas.height - paddleHeight) / 2,
                width: paddleWidth,
                height: paddleHeight,
                score: 0,
                dy: 0,
            };
            let player2 = {
                x: canvas.width - paddleWidth - 10,
                y: (canvas.height - paddleHeight) / 2,
                width: paddleWidth,
                height: paddleHeight,
                score: 0,
                dy: 0,
            }; 
            let keys = {};
            function drawRect(x, y, w, h, color) {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, w, h);
            }
            function drawCircle(x, y, r, color) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
            }
            function drawNet() {
                for (let i = 0; i < canvas.height; i += 25) {
                    drawRect(
                        canvas.width / 2 - 1,
                        i,
                        2,
                        15,
                        "rgba(255, 255, 255, 0.5)"
                    );
                }
            }
            function drawScores() {
                ctx.fillStyle = "#fff";
                ctx.font = "40px var(--font-heading)";
                ctx.textAlign = "center";
                ctx.fillText(player1.score, canvas.width * 0.25, 50);
                ctx.fillText(player2.score, canvas.width * 0.75, 50);
            }
            function resetBall() {
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
                ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1); 
                ball.dy = Math.random() * 6 - 3; 
                if (Math.abs(ball.dy) < 1) ball.dy = ball.dy < 0 ? -1 : 1; 
            }
            function update() {
                if (keys["w"] || keys["W"]) player1.y -= playerSpeed;
                if (keys["s"] || keys["S"]) player1.y += playerSpeed;
                const targetY = ball.y - player2.height / 2;
                if (player2.y + player2.height / 2 < ball.y - 10) {
                    player2.y += aiSpeed;
                } else if (player2.y + player2.height / 2 > ball.y + 10) {
                    player2.y -= aiSpeed;
                }
                player1.y = Math.max(
                    0,
                    Math.min(canvas.height - player1.height, player1.y)
                );
                player2.y = Math.max(
                    0,
                    Math.min(canvas.height - player2.height, player2.y)
                );
                ball.x += ball.dx;
                ball.y += ball.dy;
                if (
                    ball.y - ball.radius < 0 ||
                    ball.y + ball.radius > canvas.height
                ) {
                    ball.dy = -ball.dy;
                    self.playSound("click");
                }
                let player = ball.x < canvas.width / 2 ? player1 : player2;
                if (
                    ball.x - ball.radius < player.x + player.width && 
                    ball.x + ball.radius > player.x && 
                    ball.y + ball.radius > player.y && 
                    ball.y - ball.radius < player.y + player.height
                ) {
                    ball.dx = -ball.dx;
                    let collidePoint = ball.y - (player.y + player.height / 2);
                    collidePoint = collidePoint / (player.height / 2); 
                    let angleRad = collidePoint * (Math.PI / 4); 
                    let direction = ball.x < canvas.width / 2 ? 1 : -1;
                    let speed = Math.sqrt(
                        ball.dx * ball.dx + ball.dy * ball.dy
                    ); 
                    ball.dx = direction * speed * Math.cos(angleRad);
                    ball.dy = speed * Math.sin(angleRad);
                    self.playSound("hit");
                }
                if (ball.x - ball.radius < 0) {
                    player2.score++;
                    self.playSound("point");
                    resetBall();
                } else if (ball.x + ball.radius > canvas.width) {
                    player1.score++;
                    self.playSound("point");
                    resetBall();
                }
            }
            function render() {
                drawRect(0, 0, canvas.width, canvas.height, "#1a1a2e"); 
                drawNet();
                drawRect(
                    player1.x,
                    player1.y,
                    player1.width,
                    player1.height,
                    "var(--primary-color)"
                );
                drawRect(
                    player2.x,
                    player2.y,
                    player2.width,
                    player2.height,
                    "var(--accent-color)"
                );
                drawCircle(ball.x, ball.y, ball.radius, "#fff");
                drawScores();
            }
            function gameLoop() {
                update();
                render();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                keys[e.key] = true;
            };
            const handleKeyUp = (e) => {
                keys[e.key] = false;
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "pong",
            });
            self.addManagedListener(document, "keyup", handleKeyUp, {
                gameId: "pong",
            });
            resetBall(); 
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initSpaceInvadersGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const player = {
                x: canvas.width / 2 - 25,
                y: canvas.height - 60,
                width: 50,
                height: 30,
                speed: 5,
                color: "#2ecc71",
                lives: 3,
            };
            const bullets = [];
            const invaders = [];
            const invaderBullets = [];
            const invaderInfo = {
                rows: 4,
                cols: 8,
                width: 30,
                height: 20,
                padding: 15,
                speed: 0.5,
                drop: 20,
                fireRate: 0.01,
            }; 
            let invaderDirection = 1; 
            let score = 0;
            let gameOver = false;
            let gameWon = false;
            function createInvaders() {
                invaders.length = 0;
                const startX =
                    (canvas.width -
                        (invaderInfo.cols *
                            (invaderInfo.width + invaderInfo.padding) -
                            invaderInfo.padding)) /
                    2;
                const startY = 50;
                const colors = ["#e74c3c", "#e74c3c", "#f1c40f", "#f1c40f"]; 
                for (let r = 0; r < invaderInfo.rows; r++) {
                    for (let c = 0; c < invaderInfo.cols; c++) {
                        invaders.push({
                            x:
                                startX +
                                c * (invaderInfo.width + invaderInfo.padding),
                            y:
                                startY +
                                r *
                                    (invaderInfo.height +
                                        invaderInfo.padding +
                                        5), 
                            width: invaderInfo.width,
                            height: invaderInfo.height,
                            color: colors[r % colors.length],
                            alive: true,
                        });
                    }
                }
            }
            function drawPlayer() {
                ctx.fillStyle = player.color;
                ctx.beginPath();
                ctx.moveTo(player.x + player.width / 2, player.y);
                ctx.lineTo(player.x, player.y + player.height);
                ctx.lineTo(player.x + player.width, player.y + player.height);
                ctx.closePath();
                ctx.fill();
            }
            function drawBullets() {
                ctx.fillStyle = "#00ffff"; 
                bullets.forEach((bullet) => {
                    ctx.fillRect(bullet.x - 2, bullet.y, 4, 10);
                });
                ctx.fillStyle = "#ff4757"; 
                invaderBullets.forEach((bullet) => {
                    ctx.fillRect(bullet.x - 2, bullet.y, 4, 8);
                });
            }
            function drawInvaders() {
                invaders.forEach((invader) => {
                    if (invader.alive) {
                        ctx.fillStyle = invader.color;
                        ctx.fillRect(
                            invader.x,
                            invader.y,
                            invader.width,
                            invader.height
                        );
                        ctx.fillStyle = "black";
                        ctx.fillRect(
                            invader.x + invader.width * 0.2,
                            invader.y + invader.height * 0.3,
                            4,
                            4
                        );
                        ctx.fillRect(
                            invader.x + invader.width * 0.6,
                            invader.y + invader.height * 0.3,
                            4,
                            4
                        );
                    }
                });
            }
            function drawUI() {
                ctx.fillStyle = "#fff";
                ctx.font = "16px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, 25);
                ctx.textAlign = "right";
                ctx.fillText(`Lives: ${player.lives}`, canvas.width - 10, 25);
                if (gameOver) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = "40px var(--font-heading)";
                    ctx.fillStyle = "red";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "GAME OVER",
                        canvas.width / 2,
                        canvas.height / 2 - 20
                    );
                    ctx.font = "20px var(--font-main)";
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        `Final Score: ${score}`,
                        canvas.width / 2,
                        canvas.height / 2 + 20
                    );
                    ctx.fillText(
                        "Click Restart",
                        canvas.width / 2,
                        canvas.height / 2 + 50
                    );
                } else if (gameWon) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = "40px var(--font-heading)";
                    ctx.fillStyle = "lime";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "YOU WIN!",
                        canvas.width / 2,
                        canvas.height / 2 - 20
                    );
                    ctx.font = "20px var(--font-main)";
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        `Final Score: ${score}`,
                        canvas.width / 2,
                        canvas.height / 2 + 20
                    );
                    ctx.fillText(
                        "Click Restart",
                        canvas.width / 2,
                        canvas.height / 2 + 50
                    );
                }
            }
            function movePlayer(dx) {
                player.x += dx;
                player.x = Math.max(
                    0,
                    Math.min(canvas.width - player.width, player.x)
                );
            }
            function shoot() {
                if (bullets.length < 3) {
                    bullets.push({
                        x: player.x + player.width / 2,
                        y: player.y,
                        speed: 7,
                    });
                    self.playSound("shoot");
                }
            }
            function updateBullets() {
                for (let i = bullets.length - 1; i >= 0; i--) {
                    bullets[i].y -= bullets[i].speed;
                    if (bullets[i].y < 0) {
                        bullets.splice(i, 1); 
                    } else {
                        for (let j = invaders.length - 1; j >= 0; j--) {
                            const invader = invaders[j];
                            if (
                                invader.alive &&
                                bullets[i].x > invader.x &&
                                bullets[i].x < invader.x + invader.width &&
                                bullets[i].y > invader.y &&
                                bullets[i].y < invader.y + invader.height
                            ) {
                                invader.alive = false;
                                bullets.splice(i, 1); 
                                score += 100;
                                self.updateScore(score);
                                self.playSound("explosion");
                                if (invaders.every((inv) => !inv.alive)) {
                                    gameWon = true;
                                    self.playSound("win");
                                }
                                break; 
                            }
                        }
                    }
                }
                for (let i = invaderBullets.length - 1; i >= 0; i--) {
                    invaderBullets[i].y += invaderBullets[i].speed;
                    if (invaderBullets[i].y > canvas.height) {
                        invaderBullets.splice(i, 1);
                    } else {
                        if (
                            invaderBullets[i].x > player.x &&
                            invaderBullets[i].x < player.x + player.width &&
                            invaderBullets[i].y > player.y &&
                            invaderBullets[i].y < player.y + player.height
                        ) {
                            invaderBullets.splice(i, 1);
                            player.lives--;
                            self.playSound("hit");
                            if (player.lives <= 0) {
                                gameOver = true;
                                self.playSound("gameOver");
                            }
                            break;
                        }
                    }
                }
            }
            function updateInvaders() {
                let moveDown = false;
                let furthestLeft = canvas.width;
                let furthestRight = 0;
                invaders.forEach((invader) => {
                    if (invader.alive) {
                        invader.x += invaderInfo.speed * invaderDirection;
                        furthestLeft = Math.min(furthestLeft, invader.x);
                        furthestRight = Math.max(
                            furthestRight,
                            invader.x + invader.width
                        );
                        if (invader.y + invader.height >= player.y) {
                            gameOver = true;
                            self.playSound("gameOver");
                        }
                        if (
                            Math.random() <
                            invaderInfo.fireRate /
                                invaders.filter((inv) => inv.alive).length
                        ) {
                            invaderBullets.push({
                                x: invader.x + invader.width / 2,
                                y: invader.y + invader.height,
                                speed: 4,
                            });
                        }
                    }
                });
                if (furthestRight > canvas.width || furthestLeft < 0) {
                    invaderDirection *= -1; 
                    moveDown = true;
                    invaderInfo.speed *= 1.05;
                }
                if (moveDown) {
                    invaders.forEach((invader) => {
                        if (invader.alive) {
                            invader.y += invaderInfo.drop;
                        }
                    });
                }
            }
            let leftPressed = false;
            let rightPressed = false;
            function gameLoop() {
                if (gameOver || gameWon) {
                    drawUI(); 
                    return; 
                }
                if (leftPressed) movePlayer(-player.speed);
                if (rightPressed) movePlayer(player.speed);
                updateInvaders();
                updateBullets();
                ctx.fillStyle = "#111"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawPlayer();
                drawInvaders();
                drawBullets();
                drawUI(); 
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
                    leftPressed = true;
                if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
                    rightPressed = true;
                if (
                    e.key === " " ||
                    e.key === "ArrowUp" ||
                    e.key.toLowerCase() === "w"
                )
                    shoot();
            };
            const handleKeyUp = (e) => {
                if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
                    leftPressed = false;
                if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
                    rightPressed = false;
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "spaceinvaders",
            });
            self.addManagedListener(document, "keyup", handleKeyUp, {
                gameId: "spaceinvaders",
            });
            createInvaders();
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initAsteroidsGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const ship = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: 15,
                angle: 0, 
                rotation: 0,
                thrusting: false,
                thrust: { x: 0, y: 0 },
                lives: 3,
                invincible: false,
                invincibleTimer: 0,
            };
            const bullets = [];
            const asteroids = [];
            const debris = []; 
            const shipTurnSpeed = 0.08; 
            const shipThrust = 0.1;
            const friction = 0.99;
            const bulletSpeed = 5;
            const asteroidNum = 5; 
            const asteroidSpeed = 1;
            const asteroidVertices = 10; 
            const asteroidJag = 0.4; 
            let score = 0;
            let gameOver = false;
            function createAsteroids(count, initialSize = 60) {
                for (let i = 0; i < count; i++) {
                    let x, y;
                    do {
                        x = Math.random() * canvas.width;
                        y = Math.random() * canvas.height;
                    } while (
                        distBetweenPoints(ship.x, ship.y, x, y) <
                        initialSize * 2 + ship.radius
                    );
                    asteroids.push(newAsteroid(x, y, initialSize));
                }
            }
            function newAsteroid(x, y, radius) {
                const lvlMult = 1 + (0.1 * score) / 1000; 
                const angle = Math.random() * Math.PI * 2;
                const vert = Math.floor(
                    Math.random() * (asteroidVertices + 1) +
                        asteroidVertices / 2
                );
                const offs = []; 
                for (let i = 0; i < vert; i++) {
                    offs.push(
                        Math.random() * asteroidJag * 2 + 1 - asteroidJag
                    );
                }
                return {
                    x: x,
                    y: y,
                    radius: radius,
                    angle: Math.random() * Math.PI * 2, 
                    vel: {
                        x:
                            Math.random() *
                            asteroidSpeed *
                            lvlMult *
                            (Math.random() < 0.5 ? 1 : -1),
                        y:
                            Math.random() *
                            asteroidSpeed *
                            lvlMult *
                            (Math.random() < 0.5 ? 1 : -1),
                    },
                    vert: vert,
                    offs: offs, 
                };
            }
            function distBetweenPoints(x1, y1, x2, y2) {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }
            function drawShip() {
                if (ship.invincible && Math.floor(Date.now() / 150) % 2 === 0) {
                    return; 
                }
                ctx.strokeStyle = "white";
                ctx.lineWidth = ship.radius / 15;
                ctx.beginPath();
                ctx.moveTo(
                    ship.x + ship.radius * Math.cos(ship.angle),
                    ship.y - ship.radius * Math.sin(ship.angle) 
                );
                ctx.lineTo(
                    ship.x -
                        ship.radius *
                            (Math.cos(ship.angle) + Math.sin(ship.angle)),
                    ship.y +
                        ship.radius *
                            (Math.sin(ship.angle) - Math.cos(ship.angle))
                );
                ctx.lineTo(
                    ship.x -
                        ship.radius *
                            (Math.cos(ship.angle) - Math.sin(ship.angle)),
                    ship.y +
                        ship.radius *
                            (Math.sin(ship.angle) + Math.cos(ship.angle))
                );
                ctx.closePath();
                ctx.stroke();
                if (ship.thrusting && !gameOver) {
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "yellow";
                    ctx.lineWidth = ship.radius / 20;
                    ctx.beginPath();
                    ctx.moveTo(
                        ship.x -
                            ship.radius *
                                (1.1 * Math.cos(ship.angle) +
                                    0.0 * Math.sin(ship.angle)), 
                        ship.y +
                            ship.radius *
                                (1.1 * Math.sin(ship.angle) -
                                    0.0 * Math.cos(ship.angle))
                    );
                    ctx.lineTo(
                        ship.x - ship.radius * 1.8 * Math.cos(ship.angle),
                        ship.y + ship.radius * 1.8 * Math.sin(ship.angle)
                    );
                    ctx.lineTo(
                        ship.x -
                            ship.radius *
                                (1.1 * Math.cos(ship.angle) -
                                    0.0 * Math.sin(ship.angle)), 
                        ship.y +
                            ship.radius *
                                (1.1 * Math.sin(ship.angle) +
                                    0.0 * Math.cos(ship.angle))
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
            function drawBullets() {
                ctx.fillStyle = "lime";
                bullets.forEach((bullet) => {
                    ctx.beginPath();
                    ctx.arc(
                        bullet.x,
                        bullet.y,
                        ship.radius / 8,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                });
            }
            function drawAsteroids() {
                ctx.strokeStyle = "slategrey";
                ctx.lineWidth = ship.radius / 15;
                asteroids.forEach((a) => {
                    ctx.beginPath();
                    ctx.moveTo(
                        a.x + a.radius * a.offs[0] * Math.cos(a.angle),
                        a.y + a.radius * a.offs[0] * Math.sin(a.angle)
                    );
                    for (let i = 1; i < a.vert; i++) {
                        ctx.lineTo(
                            a.x +
                                a.radius *
                                    a.offs[i] *
                                    Math.cos(
                                        a.angle + (i * Math.PI * 2) / a.vert
                                    ),
                            a.y +
                                a.radius *
                                    a.offs[i] *
                                    Math.sin(
                                        a.angle + (i * Math.PI * 2) / a.vert
                                    )
                        );
                    }
                    ctx.closePath();
                    ctx.stroke();
                });
            }
            function drawDebris() {
                ctx.fillStyle = "darkgrey";
                debris.forEach((d) => {
                    ctx.fillRect(d.x - 1, d.y - 1, 3, 3);
                });
            }
            function drawUI() {
                ctx.fillStyle = "#fff";
                ctx.font = "18px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, 25);
                ctx.textAlign = "right";
                ctx.fillText(`Lives: ${ship.lives}`, canvas.width - 10, 25);
                if (gameOver) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = "40px var(--font-heading)";
                    ctx.fillStyle = "red";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "GAME OVER",
                        canvas.width / 2,
                        canvas.height / 2 - 20
                    );
                    ctx.font = "20px var(--font-main)";
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        `Final Score: ${score}`,
                        canvas.width / 2,
                        canvas.height / 2 + 20
                    );
                    ctx.fillText(
                        "Click Restart",
                        canvas.width / 2,
                        canvas.height / 2 + 50
                    );
                }
            }
            function explodeShip() {
                ship.lives--;
                self.playSound("explosion");
                for (let i = 0; i < 20; i++) {
                    debris.push({
                        x: ship.x,
                        y: ship.y,
                        vel: {
                            x: Math.random() * 10 - 5,
                            y: Math.random() * 10 - 5,
                        },
                        life: 60, 
                    });
                }
                if (ship.lives <= 0) {
                    gameOver = true;
                    self.playSound("gameOver");
                } else {
                    ship.x = canvas.width / 2;
                    ship.y = canvas.height / 2;
                    ship.thrust = { x: 0, y: 0 };
                    ship.angle = 0;
                    ship.invincible = true;
                    ship.invincibleTimer = 180; 
                }
            }
            function destroyAsteroid(index) {
                const a = asteroids[index];
                self.playSound("explosion");
                if (a.radius > 40) score += 20;
                else if (a.radius > 20) score += 50;
                else score += 100;
                self.updateScore(score);
                for (let i = 0; i < a.radius / 2; i++) {
                    debris.push({
                        x: a.x,
                        y: a.y,
                        vel: {
                            x: Math.random() * 4 - 2,
                            y: Math.random() * 4 - 2,
                        },
                        life: 45,
                    });
                }
                if (a.radius > 15) {
                    asteroids.push(newAsteroid(a.x, a.y, a.radius / 2));
                    asteroids.push(newAsteroid(a.x, a.y, a.radius / 2));
                }
                asteroids.splice(index, 1);
                if (asteroids.length === 0) {
                    self.playSound("win");
                    createAsteroids(asteroidNum + Math.floor(score / 1000)); 
                }
            }
            function update() {
                if (gameOver) return;
                if (ship.invincible) {
                    ship.invincibleTimer--;
                    if (ship.invincibleTimer <= 0) {
                        ship.invincible = false;
                    }
                }
                ship.angle += ship.rotation;
                if (ship.thrusting) {
                    ship.thrust.x += shipThrust * Math.cos(ship.angle);
                    ship.thrust.y -= shipThrust * Math.sin(ship.angle); 
                } else {
                    ship.thrust.x *= friction;
                    ship.thrust.y *= friction;
                }
                ship.x += ship.thrust.x;
                ship.y += ship.thrust.y;
                if (ship.x < 0 - ship.radius)
                    ship.x = canvas.width + ship.radius;
                else if (ship.x > canvas.width + ship.radius)
                    ship.x = 0 - ship.radius;
                if (ship.y < 0 - ship.radius)
                    ship.y = canvas.height + ship.radius;
                else if (ship.y > canvas.height + ship.radius)
                    ship.y = 0 - ship.radius;
                for (let i = bullets.length - 1; i >= 0; i--) {
                    bullets[i].x += bullets[i].vel.x;
                    bullets[i].y += bullets[i].vel.y;
                    bullets[i].dist += Math.sqrt(
                        Math.pow(bullets[i].vel.x, 2) +
                            Math.pow(bullets[i].vel.y, 2)
                    );
                    if (
                        bullets[i].dist > canvas.width * 0.7 ||
                        bullets[i].x < 0 ||
                        bullets[i].x > canvas.width ||
                        bullets[i].y < 0 ||
                        bullets[i].y > canvas.height
                    ) {
                        bullets.splice(i, 1);
                        continue;
                    }
                    for (let j = asteroids.length - 1; j >= 0; j--) {
                        if (
                            distBetweenPoints(
                                bullets[i].x,
                                bullets[i].y,
                                asteroids[j].x,
                                asteroids[j].y
                            ) < asteroids[j].radius
                        ) {
                            bullets.splice(i, 1);
                            destroyAsteroid(j);
                            break; 
                        }
                    }
                }
                asteroids.forEach((a) => {
                    a.x += a.vel.x;
                    a.y += a.vel.y;
                    if (a.x < 0 - a.radius) a.x = canvas.width + a.radius;
                    else if (a.x > canvas.width + a.radius) a.x = 0 - a.radius;
                    if (a.y < 0 - a.radius) a.y = canvas.height + a.radius;
                    else if (a.y > canvas.height + a.radius) a.y = 0 - a.radius;
                });
                for (let i = debris.length - 1; i >= 0; i--) {
                    debris[i].x += debris[i].vel.x;
                    debris[i].y += debris[i].vel.y;
                    debris[i].life--;
                    if (debris[i].life <= 0) {
                        debris.splice(i, 1);
                    }
                }
                if (!ship.invincible) {
                    for (let i = asteroids.length - 1; i >= 0; i--) {
                        if (
                            distBetweenPoints(
                                ship.x,
                                ship.y,
                                asteroids[i].x,
                                asteroids[i].y
                            ) <
                            ship.radius + asteroids[i].radius
                        ) {
                            explodeShip();
                            destroyAsteroid(i); 
                            break; 
                        }
                    }
                }
            }
            function render() {
                ctx.fillStyle = "#111";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawAsteroids();
                drawDebris();
                drawBullets();
                if (!gameOver) drawShip(); 
                drawUI();
            }
            function gameLoop() {
                update();
                render();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                if (gameOver) return;
                switch (e.key) {
                    case "ArrowLeft":
                    case "a":
                        ship.rotation = -shipTurnSpeed;
                        break;
                    case "ArrowRight":
                    case "d":
                        ship.rotation = shipTurnSpeed;
                        break;
                    case "ArrowUp":
                    case "w":
                        ship.thrusting = true;
                        break;
                    case " ": 
                        if (bullets.length < 5) {
                            bullets.push({
                                x: ship.x + ship.radius * Math.cos(ship.angle),
                                y: ship.y - ship.radius * Math.sin(ship.angle),
                                vel: {
                                    x: bulletSpeed * Math.cos(ship.angle),
                                    y: -bulletSpeed * Math.sin(ship.angle), 
                                },
                                dist: 0,
                            });
                            self.playSound("shoot");
                        }
                        break;
                }
            };
            const handleKeyUp = (e) => {
                if (gameOver) return;
                switch (e.key) {
                    case "ArrowLeft":
                    case "a":
                        ship.rotation = 0;
                        break;
                    case "ArrowRight":
                    case "d":
                        ship.rotation = 0;
                        break;
                    case "ArrowUp":
                    case "w":
                        ship.thrusting = false;
                        break;
                }
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "asteroids",
            });
            self.addManagedListener(document, "keyup", handleKeyUp, {
                gameId: "asteroids",
            });
            createAsteroids(asteroidNum);
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initPacmanGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const scale = 16; 
            const map = [
                "1111111111111111111111111111",
                "1222222222222112222222222221",
                "1211112111112112111112111121",
                "1311112111112112111112111131",
                "1211112111112112111112111121",
                "1222222222222222222222222221",
                "1211112112111111121121111121",
                "1211112112111111121121111121",
                "1222222112222112222112222221",
                "1111112111110110111112111111",
                "0000012111110110111112100000",
                "0000012110000440000112100000",
                "0000012110111441110112100000",
                "1111112110100000010112111111",
                "0000002000100000010002000000", 
                "1111112110111111110112111111",
                "0000012110100000010112100000",
                "0000012110111111110112100000",
                "0000012110000000000112100000",
                "1111112110111111110112111111",
                "1222222222222112222222222221",
                "1211112111112112111112111121",
                "1211112111112112111112111121",
                "132211222222200222222112231", 
                "111211211211111112112112111",
                "111211211211111112112112111",
                "1222222112222112222112222221",
                "1211111111112112111111111121",
                "1211111111112112111111111121",
                "1222222222222222222222222221",
                "1111111111111111111111111111",
            ];
            const cols = map[0].length;
            const rows = map.length;
            canvas.width = cols * scale;
            canvas.height = rows * scale;
            let player = {
                x: 14,
                y: 23,
                dx: 0,
                dy: 0,
                nextDx: 0,
                nextDy: 0,
                radius: scale * 0.4,
                speed: 2,
                mouthOpen: 0,
            };
            let ghosts = []; 
            let score = 0;
            let dotsLeft = 0;
            let frightenedTimer = 0;
            let gameOver = false;
            let gameWon = false;
            let level = 1;
            function getTile(x, y) {
                const col = Math.floor(x / scale);
                const row = Math.floor(y / scale);
                if (row >= 0 && row < rows && col >= 0 && col < cols) {
                    return map[row][col];
                }
                return "1"; 
            }
            function getTileCoords(col, row) {
                if (row >= 0 && row < rows && col >= 0 && col < cols) {
                    return map[row][col];
                }
                return "1";
            }
            function isWall(x, y) {
                return getTile(x, y) === "1";
            }
            function initLevel() {
                dotsLeft = 0;
                map.forEach((rowStr, r) => {
                    for (let c = 0; c < rowStr.length; c++) {
                        if (rowStr[c] === "2" || rowStr[c] === "3") {
                            dotsLeft++;
                        }
                    }
                });
                player.x = 14 * scale + scale / 2;
                player.y = 23 * scale + scale / 2;
                player.dx = 0;
                player.dy = 0;
                player.nextDx = 0;
                player.nextDy = 0;
                ghosts = [
                    {
                        x: 13.5 * scale,
                        y: 11.5 * scale,
                        dx: 1,
                        dy: 0,
                        color: "red",
                        state: "scatter",
                        id: 0,
                    },
                    {
                        x: 14.5 * scale,
                        y: 13.5 * scale,
                        dx: -1,
                        dy: 0,
                        color: "pink",
                        state: "scatter",
                        id: 1,
                    },
                    {
                        x: 12.5 * scale,
                        y: 13.5 * scale,
                        dx: 1,
                        dy: 0,
                        color: "cyan",
                        state: "scatter",
                        id: 2,
                    },
                    {
                        x: 15.5 * scale,
                        y: 13.5 * scale,
                        dx: -1,
                        dy: 0,
                        color: "orange",
                        state: "scatter",
                        id: 3,
                    },
                ];
                frightenedTimer = 0;
                gameOver = false;
                gameWon = false;
            }
            function drawMap() {
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const tile = map[r][c];
                        const x = c * scale;
                        const y = r * scale;
                        if (tile === "1") {
                            ctx.fillStyle = "#0033cc"; 
                            ctx.fillRect(x, y, scale, scale);
                        } else if (tile === "2") {
                            ctx.fillStyle = "yellow";
                            ctx.fillRect(
                                x + scale * 0.4,
                                y + scale * 0.4,
                                scale * 0.2,
                                scale * 0.2
                            );
                        } else if (tile === "3") {
                            ctx.fillStyle = "orange";
                            ctx.beginPath();
                            ctx.arc(
                                x + scale / 2,
                                y + scale / 2,
                                scale * 0.3,
                                0,
                                Math.PI * 2
                            );
                            ctx.fill();
                        }
                    }
                }
            }
            function drawPlayer() {
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                let angleOffset = 0;
                if (player.dx > 0) angleOffset = 0;
                else if (player.dx < 0) angleOffset = Math.PI;
                else if (player.dy > 0) angleOffset = Math.PI / 2;
                else if (player.dy < 0) angleOffset = -Math.PI / 2;
                const mouthAngle =
                    (Math.sin((player.mouthOpen * Math.PI) / 10) + 1) *
                    0.2 *
                    Math.PI; 
                ctx.arc(
                    player.x,
                    player.y,
                    player.radius,
                    angleOffset + mouthAngle / 2,
                    angleOffset - mouthAngle / 2 + Math.PI * 2
                );
                ctx.lineTo(player.x, player.y); 
                ctx.fill();
                player.mouthOpen = (player.mouthOpen + 1) % 20; 
            }
            function drawGhosts() {
                ghosts.forEach((ghost) => {
                    ctx.fillStyle =
                        ghost.state === "frightened" ? "#aaa" : ghost.color;
                    ctx.beginPath();
                    ctx.arc(ghost.x, ghost.y, scale * 0.45, Math.PI, 0); 
                    ctx.lineTo(ghost.x + scale * 0.45, ghost.y + scale * 0.4); 
                    ctx.lineTo(ghost.x + scale * 0.15, ghost.y + scale * 0.3);
                    ctx.lineTo(ghost.x - scale * 0.15, ghost.y + scale * 0.4);
                    ctx.lineTo(ghost.x - scale * 0.45, ghost.y + scale * 0.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(
                        ghost.x - scale * 0.15,
                        ghost.y - scale * 0.1,
                        scale * 0.1,
                        0,
                        Math.PI * 2
                    ); 
                    ctx.arc(
                        ghost.x + scale * 0.15,
                        ghost.y - scale * 0.1,
                        scale * 0.1,
                        0,
                        Math.PI * 2
                    ); 
                    ctx.fill();
                });
            }
            function drawUI() {
                ctx.fillStyle = "#fff";
                ctx.font = "16px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, scale - 4); 
                ctx.textAlign = "right";
                if (gameOver) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = "30px var(--font-heading)";
                    ctx.fillStyle = "red";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "GAME OVER",
                        canvas.width / 2,
                        canvas.height / 2 - 20
                    );
                    ctx.font = "18px var(--font-main)";
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        `Final Score: ${score}`,
                        canvas.width / 2,
                        canvas.height / 2 + 20
                    );
                    ctx.fillText(
                        "Click Restart",
                        canvas.width / 2,
                        canvas.height / 2 + 50
                    );
                } else if (gameWon) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = "30px var(--font-heading)";
                    ctx.fillStyle = "lime";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "YOU WIN!",
                        canvas.width / 2,
                        canvas.height / 2 - 20
                    );
                    ctx.font = "18px var(--font-main)";
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        `Final Score: ${score}`,
                        canvas.width / 2,
                        canvas.height / 2 + 20
                    );
                    ctx.fillText(
                        "Click Restart",
                        canvas.width / 2,
                        canvas.height / 2 + 50
                    );
                }
            }
            function updatePlayer() {
                const currentTileCol = Math.floor(player.x / scale);
                const currentTileRow = Math.floor(player.y / scale);
                const xOffset = player.x % scale;
                const yOffset = player.y % scale;
                const tolerance = player.speed * 1.1; 
                const canTurn =
                    xOffset > scale / 2 - tolerance &&
                    xOffset < scale / 2 + tolerance &&
                    yOffset > scale / 2 - tolerance &&
                    yOffset < scale / 2 + tolerance;
                if (canTurn && (player.nextDx !== 0 || player.nextDy !== 0)) {
                    const nextTileX = player.x + player.nextDx * scale;
                    const nextTileY = player.y + player.nextDy * scale;
                    if (!isWall(nextTileX, nextTileY)) {
                        player.dx = player.nextDx;
                        player.dy = player.nextDy;
                        player.nextDx = 0;
                        player.nextDy = 0;
                        player.x = currentTileCol * scale + scale / 2;
                        player.y = currentTileRow * scale + scale / 2;
                    }
                }
                const nextX = player.x + player.dx * player.speed;
                const nextY = player.y + player.dy * player.speed;
                const nextTileCol = Math.floor(nextX / scale);
                const nextTileRow = Math.floor(nextY / scale);
                if (
                    isWall(
                        nextX + Math.sign(player.dx) * player.radius,
                        nextY + Math.sign(player.dy) * player.radius
                    )
                ) {
                    player.dx = 0;
                    player.dy = 0;
                    if (player.dx > 0)
                        player.x = nextTileCol * scale - player.radius;
                    else if (player.dx < 0)
                        player.x = (currentTileCol + 1) * scale + player.radius;
                    if (player.dy > 0)
                        player.y = nextTileRow * scale - player.radius;
                    else if (player.dy < 0)
                        player.y = (currentTileRow + 1) * scale + player.radius;
                } else {
                    player.x = nextX;
                    player.y = nextY;
                }
                if (player.x < -player.radius)
                    player.x = canvas.width + player.radius;
                else if (player.x > canvas.width + player.radius)
                    player.x = -player.radius;
                const playerCol = Math.floor(player.x / scale);
                const playerRow = Math.floor(player.y / scale);
                if (
                    playerCol >= 0 &&
                    playerCol < cols &&
                    playerRow >= 0 &&
                    playerRow < rows
                ) {
                    const tileIndex = playerRow * cols + playerCol; 
                    const tileChar = map[playerRow][playerCol];
                    if (tileChar === "2") {
                        map[playerRow] =
                            map[playerRow].substring(0, playerCol) +
                            "0" +
                            map[playerRow].substring(playerCol + 1);
                        score += 10;
                        dotsLeft--;
                        self.updateScore(score);
                        self.playSound("click"); 
                    } else if (tileChar === "3") {
                        map[playerRow] =
                            map[playerRow].substring(0, playerCol) +
                            "0" +
                            map[playerRow].substring(playerCol + 1);
                        score += 50;
                        dotsLeft--;
                        self.updateScore(score);
                        self.playSound("powerup");
                        frightenedTimer = 360; 
                        ghosts.forEach((g) => {
                            if (g.state !== "eaten") g.state = "frightened";
                        });
                    }
                }
                if (dotsLeft <= 0) {
                    gameWon = true;
                    self.playSound("win");
                }
            }
            function updateGhosts() {
                if (frightenedTimer > 0) {
                    frightenedTimer--;
                    if (frightenedTimer === 0) {
                        ghosts.forEach((g) => {
                            if (g.state === "frightened") g.state = "scatter";
                        }); 
                    }
                }
                ghosts.forEach((ghost) => {
                    const currentTileCol = Math.floor(ghost.x / scale);
                    const currentTileRow = Math.floor(ghost.y / scale);
                    const xOffset = ghost.x % scale;
                    const yOffset = ghost.y % scale;
                    const tolerance = 1.5; 
                    const atIntersection =
                        xOffset > scale / 2 - tolerance &&
                        xOffset < scale / 2 + tolerance &&
                        yOffset > scale / 2 - tolerance &&
                        yOffset < scale / 2 + tolerance;
                    let possibleMoves = [];
                    if (atIntersection) {
                        if (!isWall(ghost.x, ghost.y - scale) && ghost.dy <= 0)
                            possibleMoves.push({ dx: 0, dy: -1 }); 
                        if (!isWall(ghost.x, ghost.y + scale) && ghost.dy >= 0)
                            possibleMoves.push({ dx: 0, dy: 1 }); 
                        if (!isWall(ghost.x - scale, ghost.y) && ghost.dx <= 0)
                            possibleMoves.push({ dx: -1, dy: 0 }); 
                        if (!isWall(ghost.x + scale, ghost.y) && ghost.dx >= 0)
                            possibleMoves.push({ dx: 1, dy: 0 }); 
                        if (possibleMoves.length > 0) {
                            const move =
                                possibleMoves[
                                    Math.floor(
                                        Math.random() * possibleMoves.length
                                    )
                                ];
                            ghost.dx = move.dx;
                            ghost.dy = move.dy;
                            ghost.x = currentTileCol * scale + scale / 2;
                            ghost.y = currentTileRow * scale + scale / 2;
                        } else {
                            ghost.dx *= -1;
                            ghost.dy *= -1;
                        }
                    }
                    const ghostSpeed = ghost.state === "frightened" ? 0.8 : 1.2; 
                    const nextX = ghost.x + ghost.dx * ghostSpeed;
                    const nextY = ghost.y + ghost.dy * ghostSpeed;
                    if (
                        isWall(
                            nextX + Math.sign(ghost.dx) * scale * 0.4,
                            nextY + Math.sign(ghost.dy) * scale * 0.4
                        )
                    ) {
                        if (!atIntersection) {
                            ghost.x = nextX;
                            ghost.y = nextY;
                        } else {
                            ghost.dx *= -1;
                            ghost.dy *= -1;
                        }
                    } else {
                        ghost.x = nextX;
                        ghost.y = nextY;
                    }
                    if (ghost.x < -scale / 2)
                        ghost.x = canvas.width + scale / 2;
                    else if (ghost.x > canvas.width + scale / 2)
                        ghost.x = -scale / 2;
                    const dx = player.x - ghost.x;
                    const dy = player.y - ghost.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < player.radius + scale * 0.45) {
                        if (ghost.state === "frightened") {
                            score += 200; 
                            self.updateScore(score);
                            self.playSound("explosion");
                            ghost.state = "eaten";
                            ghost.x = 13.5 * scale;
                            ghost.y = 11.5 * scale;
                            setTimeout(() => {
                                if (ghost.state === "eaten")
                                    ghost.state = "scatter";
                            }, 3000); 
                        } else if (ghost.state !== "eaten") {
                            gameOver = true;
                            self.playSound("gameOver");
                        }
                    }
                });
            }
            function gameLoop() {
                if (gameOver || gameWon) {
                    drawUI();
                    return;
                }
                updatePlayer();
                updateGhosts();
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawMap();
                drawGhosts();
                drawPlayer();
                drawUI();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                if (gameOver || gameWon) return;
                switch (e.key) {
                    case "ArrowUp":
                    case "w":
                        player.nextDx = 0;
                        player.nextDy = -1;
                        break;
                    case "ArrowDown":
                    case "s":
                        player.nextDx = 0;
                        player.nextDy = 1;
                        break;
                    case "ArrowLeft":
                    case "a":
                        player.nextDx = -1;
                        player.nextDy = 0;
                        break;
                    case "ArrowRight":
                    case "d":
                        player.nextDx = 1;
                        player.nextDy = 0;
                        break;
                }
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "pacman",
            });
            initLevel();
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initFroggerGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const scale = 40; 
            const cols = canvas.width / scale;
            const rows = canvas.height / scale;
            let player = {
                x: cols / 2,
                y: rows - 1,
                width: scale * 0.8,
                height: scale * 0.8,
            }; 
            let score = 0;
            let lives = 3; 
            let homes = [false, false, false, false, false]; 
            let gameWon = false;
            let gameOver = false;
            const obstacles = [];
            const rowDefs = [
                {
                    y: rows - 2,
                    type: "car",
                    speed: 1.5,
                    dir: 1,
                    len: 2,
                    space: 4,
                    color: "#e74c3c",
                },
                {
                    y: rows - 3,
                    type: "car",
                    speed: 2,
                    dir: -1,
                    len: 1,
                    space: 3,
                    color: "#f1c40f",
                },
                {
                    y: rows - 4,
                    type: "car",
                    speed: 1,
                    dir: 1,
                    len: 3,
                    space: 5,
                    color: "#3498db",
                },
                {
                    y: rows - 5,
                    type: "car",
                    speed: 2.5,
                    dir: -1,
                    len: 1,
                    space: 4,
                    color: "#9b59b6",
                },
                {
                    y: rows - 7,
                    type: "log",
                    speed: 1,
                    dir: -1,
                    len: 4,
                    space: 6,
                    color: "#8c5a30",
                },
                {
                    y: rows - 8,
                    type: "log",
                    speed: 1.8,
                    dir: 1,
                    len: 3,
                    space: 5,
                    color: "#8c5a30",
                },
                {
                    y: rows - 9,
                    type: "log",
                    speed: 1.2,
                    dir: -1,
                    len: 5,
                    space: 7,
                    color: "#8c5a30",
                },
                {
                    y: rows - 10,
                    type: "log",
                    speed: 2.2,
                    dir: 1,
                    len: 2,
                    space: 4,
                    color: "#8c5a30",
                },
            ];
            function createObstacles() {
                obstacles.length = 0;
                rowDefs.forEach((def) => {
                    let currentX =
                        def.dir === 1 ? -def.len * scale : canvas.width;
                    while (
                        (def.dir === 1 && currentX < canvas.width * 1.5) ||
                        (def.dir === -1 && currentX > -canvas.width * 0.5)
                    ) {
                        obstacles.push({
                            x: currentX,
                            y: def.y * scale + (scale - scale * 0.8) / 2, 
                            width: def.len * scale,
                            height: scale * 0.8,
                            speed: def.speed * def.dir,
                            type: def.type,
                            color: def.color,
                            rowY: def.y, 
                        });
                        currentX += (def.len + def.space) * scale * def.dir;
                    }
                });
            }
            function drawPlayer() {
                ctx.fillStyle = "#2ecc71"; 
                ctx.fillRect(
                    player.x * scale + (scale - player.width) / 2,
                    player.y * scale + (scale - player.height) / 2,
                    player.width,
                    player.height
                );
            }
            function drawObstacles() {
                obstacles.forEach((obs) => {
                    ctx.fillStyle = obs.color;
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                });
            }
            function drawBackground() {
                ctx.fillStyle = "#333";
                ctx.fillRect(
                    0,
                    (rows / 2) * scale,
                    canvas.width,
                    (rows / 2 - 1) * scale
                );
                ctx.fillStyle = "#3498db";
                ctx.fillRect(
                    0,
                    1 * scale,
                    canvas.width,
                    (rows / 2 - 2) * scale
                );
                ctx.fillStyle = "#555";
                ctx.fillRect(0, (rows - 1) * scale, canvas.width, scale);
                ctx.fillStyle = "#555";
                ctx.fillRect(0, (rows / 2 - 1) * scale, canvas.width, scale);
                ctx.fillStyle = "#555";
                ctx.fillRect(0, 0, canvas.width, scale);
                ctx.fillStyle = "#2ecc71"; 
                const homeWidth = scale * 1.5;
                const homeSpacing =
                    (canvas.width - homes.length * homeWidth) /
                    (homes.length + 1);
                for (let i = 0; i < homes.length; i++) {
                    const homeX = homeSpacing + i * (homeWidth + homeSpacing);
                    if (homes[i]) {
                        ctx.fillRect(
                            homeX + (homeWidth - player.width) / 2,
                            (scale - player.height) / 2,
                            player.width,
                            player.height
                        );
                    } else {
                        ctx.fillStyle = "#444";
                        ctx.fillRect(homeX, 0, homeWidth, scale);
                    }
                }
            }
            function drawUI() {
                ctx.fillStyle = "#fff";
                ctx.font = "16px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
            }
            function movePlayer(dx, dy) {
                const nextX = player.x + dx;
                const nextY = player.y + dy;
                if (nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows) {
                    player.x = nextX;
                    player.y = nextY;
                    self.playSound("jump");
                    if (dy < 0) {
                        score += 10;
                        self.updateScore(score);
                    }
                    if (player.y === 0) {
                        checkHome();
                    }
                }
            }
            function checkHome() {
                const homeWidth = scale * 1.5;
                const homeSpacing =
                    (canvas.width - homes.length * homeWidth) /
                    (homes.length + 1);
                const playerCenterX = player.x * scale + scale / 2;
                let landedHome = false;
                for (let i = 0; i < homes.length; i++) {
                    const homeXStart =
                        homeSpacing + i * (homeWidth + homeSpacing);
                    const homeXEnd = homeXStart + homeWidth;
                    if (
                        playerCenterX > homeXStart &&
                        playerCenterX < homeXEnd
                    ) {
                        if (!homes[i]) {
                            homes[i] = true;
                            score += 100; 
                            self.updateScore(score);
                            self.playSound("point");
                            landedHome = true;
                            resetPlayer();
                            if (homes.every((h) => h)) {
                                gameWon = true; 
                                self.playSound("win");
                                alert("Level Cleared!"); 
                                homes.fill(false); 
                                createObstacles(); 
                            }
                        } else {
                            resetPlayer(true); 
                        }
                        break;
                    }
                }
                if (!landedHome) {
                    resetPlayer(true); 
                }
            }
            function updateObstacles() {
                obstacles.forEach((obs) => {
                    obs.x += obs.speed;
                    if (obs.speed > 0 && obs.x > canvas.width) {
                        obs.x = -obs.width;
                    } else if (obs.speed < 0 && obs.x < -obs.width) {
                        obs.x = canvas.width;
                    }
                });
            }
            function checkCollisions() {
                const playerRect = {
                    x: player.x * scale + (scale - player.width) / 2,
                    y: player.y * scale + (scale - player.height) / 2,
                    width: player.width,
                    height: player.height,
                };
                let onLog = false;
                let logSpeed = 0;
                if (player.y > 0 && player.y < rows / 2 - 1) {
                    obstacles.forEach((obs) => {
                        if (obs.type === "log" && obs.rowY === player.y) {
                            if (
                                playerRect.x < obs.x + obs.width &&
                                playerRect.x + playerRect.width > obs.x &&
                                playerRect.y < obs.y + obs.height &&
                                playerRect.y + playerRect.height > obs.y
                            ) {
                                onLog = true;
                                logSpeed = obs.speed;
                            }
                        }
                    });
                    if (!onLog) {
                        resetPlayer(true); 
                        return; 
                    } else {
                        player.x += logSpeed / scale; 
                        if (
                            player.x * scale < -player.width ||
                            player.x * scale > canvas.width
                        ) {
                            resetPlayer(true);
                            return;
                        }
                    }
                }
                if (player.y >= rows / 2 && player.y < rows - 1) {
                    obstacles.forEach((obs) => {
                        if (obs.type === "car" && obs.rowY === player.y) {
                            if (
                                playerRect.x < obs.x + obs.width &&
                                playerRect.x + playerRect.width > obs.x &&
                                playerRect.y < obs.y + obs.height &&
                                playerRect.y + playerRect.height > obs.y
                            ) {
                                resetPlayer(true); 
                            }
                        }
                    });
                }
            }
            function resetPlayer(isDead = false) {
                player.x = cols / 2;
                player.y = rows - 1;
                if (isDead) {
                    self.playSound("hit"); 
                }
            }
            function gameLoop() {
                if (gameOver || gameWon) {
                    return;
                }
                updateObstacles();
                checkCollisions(); 
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawBackground();
                drawObstacles();
                drawPlayer();
                drawUI();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                if (gameOver || gameWon) return;
                if (
                    [
                        "ArrowUp",
                        "ArrowDown",
                        "ArrowLeft",
                        "ArrowRight",
                    ].includes(e.key)
                ) {
                    e.preventDefault();
                }
                switch (e.key) {
                    case "ArrowUp":
                    case "w":
                        movePlayer(0, -1);
                        break;
                    case "ArrowDown":
                    case "s":
                        movePlayer(0, 1);
                        break;
                    case "ArrowLeft":
                    case "a":
                        movePlayer(-1, 0);
                        break;
                    case "ArrowRight":
                    case "d":
                        movePlayer(1, 0);
                        break;
                }
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "frogger",
            });
            createObstacles();
            resetPlayer();
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initMinesweeperGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.fontFamily = "var(--font-main)";
            const gridWidth = 16;
            const gridHeight = 16;
            const numMines = 40;
            let board = []; 
            let minesLeft = numMines;
            let tilesRevealed = 0;
            let firstClick = true;
            let gameOver = false;
            let gameWon = false;
            const header = document.createElement("div");
            header.style.display = "flex";
            header.style.justifyContent = "space-around";
            header.style.width = "300px";
            header.style.marginBottom = "10px";
            header.style.fontSize = "1.2em";
            header.style.color = "#fff";
            const minesDisplay = document.createElement("span");
            minesDisplay.textContent = `Mines: ${minesLeft}`;
            const statusDisplay = document.createElement("span"); 
            statusDisplay.textContent = "🙂";
            header.appendChild(minesDisplay);
            header.appendChild(statusDisplay);
            container.appendChild(header);
            const gridElement = document.createElement("div");
            gridElement.style.display = "grid";
            gridElement.style.gridTemplateColumns = `repeat(${gridWidth}, 25px)`;
            gridElement.style.gridTemplateRows = `repeat(${gridHeight}, 25px)`;
            gridElement.style.gap = "1px";
            gridElement.style.backgroundColor = "#555";
            gridElement.style.border = "2px solid #888";
            container.appendChild(gridElement);
            function createBoard() {
                board = [];
                for (let r = 0; r < gridHeight; r++) {
                    board[r] = [];
                    for (let c = 0; c < gridWidth; c++) {
                        board[r][c] = {
                            mine: false,
                            revealed: false,
                            flagged: false,
                            adjacentMines: 0,
                        };
                        const tile = document.createElement("div");
                        tile.dataset.row = r;
                        tile.dataset.col = c;
                        tile.style.backgroundColor = "#bbb";
                        tile.style.border = "1px solid #999";
                        tile.style.display = "flex";
                        tile.style.alignItems = "center";
                        tile.style.justifyContent = "center";
                        tile.style.fontSize = "14px";
                        tile.style.fontWeight = "bold";
                        tile.style.cursor = "pointer";
                        tile.addEventListener("click", handleTileClick);
                        tile.addEventListener(
                            "contextmenu",
                            handleTileRightClick
                        );
                        gridElement.appendChild(tile);
                    }
                }
            }
            function placeMines(startRow, startCol) {
                let minesPlaced = 0;
                while (minesPlaced < numMines) {
                    const r = Math.floor(Math.random() * gridHeight);
                    const c = Math.floor(Math.random() * gridWidth);
                    if (
                        !board[r][c].mine &&
                        !(
                            Math.abs(r - startRow) <= 1 &&
                            Math.abs(c - startCol) <= 1
                        )
                    ) {
                        board[r][c].mine = true;
                        minesPlaced++;
                    }
                }
                calculateAdjacentMines();
            }
            function calculateAdjacentMines() {
                for (let r = 0; r < gridHeight; r++) {
                    for (let c = 0; c < gridWidth; c++) {
                        if (board[r][c].mine) continue;
                        let count = 0;
                        for (let dr = -1; dr <= 1; dr++) {
                            for (let dc = -1; dc <= 1; dc++) {
                                if (dr === 0 && dc === 0) continue;
                                const nr = r + dr;
                                const nc = c + dc;
                                if (
                                    nr >= 0 &&
                                    nr < gridHeight &&
                                    nc >= 0 &&
                                    nc < gridWidth &&
                                    board[nr][nc].mine
                                ) {
                                    count++;
                                }
                            }
                        }
                        board[r][c].adjacentMines = count;
                    }
                }
            }
            function revealTile(r, c) {
                if (
                    r < 0 ||
                    r >= gridHeight ||
                    c < 0 ||
                    c >= gridWidth ||
                    board[r][c].revealed ||
                    board[r][c].flagged
                ) {
                    return;
                }
                board[r][c].revealed = true;
                tilesRevealed++;
                const tileElement = gridElement.children[r * gridWidth + c];
                tileElement.style.backgroundColor = "#ddd";
                tileElement.style.border = "1px solid #ccc";
                tileElement.style.cursor = "default";
                if (board[r][c].mine) {
                    tileElement.innerHTML =
                        '<i class="fas fa-bomb" style="color: red;"></i>';
                    endGame(false);
                } else if (board[r][c].adjacentMines > 0) {
                    const colors = [
                        "",
                        "blue",
                        "green",
                        "red",
                        "purple",
                        "maroon",
                        "turquoise",
                        "black",
                        "gray",
                    ];
                    tileElement.textContent = board[r][c].adjacentMines;
                    tileElement.style.color = colors[board[r][c].adjacentMines];
                } else {
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            revealTile(r + dr, c + dc);
                        }
                    }
                }
                if (
                    !gameOver &&
                    tilesRevealed === gridWidth * gridHeight - numMines
                ) {
                    endGame(true);
                }
            }
            function toggleFlag(r, c) {
                if (gameOver || board[r][c].revealed) return;
                const tileElement = gridElement.children[r * gridWidth + c];
                if (board[r][c].flagged) {
                    board[r][c].flagged = false;
                    tileElement.innerHTML = "";
                    minesLeft++;
                    self.playSound("click");
                } else {
                    if (minesLeft > 0) {
                        board[r][c].flagged = true;
                        tileElement.innerHTML =
                            '<i class="fas fa-flag" style="color: orange;"></i>';
                        minesLeft--;
                        self.playSound("ui");
                    }
                }
                minesDisplay.textContent = `Mines: ${minesLeft}`;
            }
            function handleTileClick(event) {
                if (gameOver || gameWon) return;
                const tile = event.target.closest("div[data-row]");
                if (!tile) return;
                const r = parseInt(tile.dataset.row);
                const c = parseInt(tile.dataset.col);
                if (board[r][c].flagged) return;
                if (firstClick) {
                    placeMines(r, c);
                    firstClick = false;
                }
                if (board[r][c].mine) {
                    revealTile(r, c); 
                } else {
                    revealTile(r, c);
                    self.playSound("click");
                }
            }
            function handleTileRightClick(event) {
                event.preventDefault(); 
                if (gameOver || gameWon) return;
                const tile = event.target.closest("div[data-row]");
                if (!tile) return;
                const r = parseInt(tile.dataset.row);
                const c = parseInt(tile.dataset.col);
                toggleFlag(r, c);
            }
            function endGame(won) {
                gameOver = true;
                gameWon = won;
                statusDisplay.textContent = won ? "😎 Win!" : "😭 Boom!";
                self.playSound(won ? "win" : "gameOver");
                for (let r = 0; r < gridHeight; r++) {
                    for (let c = 0; c < gridWidth; c++) {
                        const tileElement =
                            gridElement.children[r * gridWidth + c];
                        tileElement.style.cursor = "default";
                        if (board[r][c].mine && !board[r][c].revealed) {
                            if (!board[r][c].flagged) {
                                tileElement.innerHTML =
                                    '<i class="fas fa-bomb" style="color: #555;"></i>';
                                tileElement.style.backgroundColor = "#ddd";
                            }
                        } else if (!board[r][c].mine && board[r][c].flagged) {
                            tileElement.innerHTML =
                                '<i class="fas fa-times" style="color: red;"></i>';
                        }
                    }
                }
            }
            createBoard();
            return {
                cleanup: () => {
                    Array.from(gridElement.children).forEach((tile) => {
                        tile.removeEventListener("click", handleTileClick);
                        tile.removeEventListener(
                            "contextmenu",
                            handleTileRightClick
                        );
                    });
                    container.innerHTML = ""; 
                },
            };
        }
        initConnect4Game(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            const rows = 6;
            const cols = 7;
            const pieceRadius = (canvas.width / cols) * 0.4;
            const cellWidth = canvas.width / cols;
            const cellHeight = canvas.height / rows;
            let board = Array(rows)
                .fill(null)
                .map(() => Array(cols).fill(0)); 
            let currentPlayer = 1; 
            let gameOver = false;
            let winner = 0;
            let dropColumn = -1; 
            let dropY = 0; 
            let dropTargetY = 0;
            let dropPlayer = 0;
            let isDropping = false;
            function drawBoard() {
                ctx.fillStyle = "#0033cc"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        ctx.beginPath();
                        ctx.arc(
                            c * cellWidth + cellWidth / 2,
                            r * cellHeight + cellHeight / 2,
                            pieceRadius,
                            0,
                            Math.PI * 2
                        );
                        if (board[r][c] === 1) {
                            ctx.fillStyle = "#ff4757"; 
                        } else if (board[r][c] === 2) {
                            ctx.fillStyle = "#f1c40f"; 
                        } else {
                            ctx.fillStyle = "#1a1a2e"; 
                        }
                        ctx.fill();
                    }
                }
            }
            function drawDroppingPiece() {
                if (!isDropping) return;
                ctx.beginPath();
                ctx.arc(
                    dropColumn * cellWidth + cellWidth / 2,
                    dropY,
                    pieceRadius,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = dropPlayer === 1 ? "#ff4757" : "#f1c40f";
                ctx.fill();
            }
            function drawUI() {
                if (gameOver) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
                    ctx.font = "24px var(--font-heading)";
                    ctx.textAlign = "center";
                    if (winner === 1) {
                        ctx.fillStyle = "lime";
                        ctx.fillText(
                            "YOU WIN!",
                            canvas.width / 2,
                            canvas.height / 2
                        );
                    } else if (winner === 2) {
                        ctx.fillStyle = "red";
                        ctx.fillText(
                            "AI WINS!",
                            canvas.width / 2,
                            canvas.height / 2
                        );
                    } else {
                        ctx.fillStyle = "orange";
                        ctx.fillText(
                            "IT'S A DRAW!",
                            canvas.width / 2,
                            canvas.height / 2
                        );
                    }
                } else {
                    ctx.fillStyle = currentPlayer === 1 ? "#ff4757" : "#f1c40f";
                    ctx.font = "16px var(--font-main)";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        `${currentPlayer === 1 ? "Your" : "AI"} Turn`,
                        canvas.width / 2,
                        20
                    );
                }
            }
            function findEmptyRow(col) {
                for (let r = rows - 1; r >= 0; r--) {
                    if (board[r][col] === 0) {
                        return r;
                    }
                }
                return -1; 
            }
            function dropPiece(col, player) {
                const row = findEmptyRow(col);
                if (row !== -1 && !isDropping) {
                    isDropping = true;
                    dropColumn = col;
                    dropPlayer = player;
                    dropY = -pieceRadius; 
                    dropTargetY = row * cellHeight + cellHeight / 2;
                    self.playSound("click");
                    return true; 
                }
                return false; 
            }
            function checkWin(player) {
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (board[r][c] === player) {
                            if (
                                c <= cols - 4 &&
                                board[r][c + 1] === player &&
                                board[r][c + 2] === player &&
                                board[r][c + 3] === player
                            )
                                return true;
                            if (
                                r <= rows - 4 &&
                                board[r + 1][c] === player &&
                                board[r + 2][c] === player &&
                                board[r + 3][c] === player
                            )
                                return true;
                            if (
                                r <= rows - 4 &&
                                c <= cols - 4 &&
                                board[r + 1][c + 1] === player &&
                                board[r + 2][c + 2] === player &&
                                board[r + 3][c + 3] === player
                            )
                                return true;
                            if (
                                r >= 3 &&
                                c <= cols - 4 &&
                                board[r - 1][c + 1] === player &&
                                board[r - 2][c + 2] === player &&
                                board[r - 3][c + 3] === player
                            )
                                return true;
                        }
                    }
                }
                return false;
            }
            function checkDraw() {
                for (let c = 0; c < cols; c++) {
                    if (board[0][c] === 0) return false;
                }
                return true; 
            }
            function aiMove() {
                let validCols = [];
                for (let c = 0; c < cols; c++) {
                    if (findEmptyRow(c) !== -1) {
                        validCols.push(c);
                    }
                }
                if (validCols.length > 0) {
                    const randomCol =
                        validCols[Math.floor(Math.random() * validCols.length)];
                    dropPiece(randomCol, 2);
                }
            }
            function updateDropAnimation() {
                if (!isDropping) return;
                const dropSpeed = 15; 
                dropY += dropSpeed;
                if (dropY >= dropTargetY) {
                    dropY = dropTargetY; 
                    const row = findEmptyRow(dropColumn); 
                    if (row !== -1) {
                        board[row][dropColumn] = dropPlayer; 
                    }
                    isDropping = false; 
                    if (checkWin(dropPlayer)) {
                        gameOver = true;
                        winner = dropPlayer;
                        self.playSound(winner === 1 ? "win" : "gameOver");
                    } else if (checkDraw()) {
                        gameOver = true;
                        winner = 0; 
                        self.playSound("gameOver");
                    } else {
                        currentPlayer = dropPlayer === 1 ? 2 : 1;
                        if (currentPlayer === 2) {
                            setTimeout(aiMove, 500);
                        }
                    }
                }
            }
            function gameLoop() {
                ctx.fillStyle = "#1a1a2e"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawBoard();
                updateDropAnimation(); 
                drawDroppingPiece(); 
                drawUI(); 
                if (!gameOver) {
                    requestAnimationFrame(gameLoop);
                }
            }
            const handleCanvasClick = (event) => {
                if (gameOver || currentPlayer !== 1 || isDropping) return; 
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const clickX = (event.clientX - rect.left) * scaleX;
                const col = Math.floor(clickX / cellWidth);
                if (col >= 0 && col < cols) {
                    dropPiece(col, 1);
                }
            };
            self.addManagedListener(canvas, "click", handleCanvasClick, {
                gameId: "connect4",
            });
            requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                },
            };
        }
        initFlappyBirdGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const bird = {
                x: 50,
                y: canvas.height / 2,
                radius: 15,
                velocity: 0,
                gravity: 0.4,
                lift: -7,
            };
            const pipes = [];
            const pipeWidth = 60;
            const pipeGap = 120;
            const pipeFrequency = 90; 
            let frameCount = 0;
            let score = 0;
            let gameOver = false;
            function drawBird() {
                ctx.fillStyle = "#f1c40f"; 
                ctx.beginPath();
                ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            function drawPipes() {
                ctx.fillStyle = "#2ecc71"; 
                pipes.forEach((pipe) => {
                    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight); 
                    ctx.fillRect(
                        pipe.x,
                        canvas.height - pipe.bottomHeight,
                        pipeWidth,
                        pipe.bottomHeight
                    ); 
                });
            }
            function drawScore() {
                ctx.fillStyle = "#fff";
                ctx.font = "30px var(--font-heading)";
                ctx.textAlign = "center";
                ctx.fillText(score, canvas.width / 2, 50);
            }
            function drawGameOver() {
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "40px var(--font-heading)";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(
                    "GAME OVER",
                    canvas.width / 2,
                    canvas.height / 2 - 20
                );
                ctx.font = "20px var(--font-main)";
                ctx.fillStyle = "white";
                ctx.fillText(
                    `Score: ${score}`,
                    canvas.width / 2,
                    canvas.height / 2 + 20
                );
                ctx.fillText(
                    "Click Restart",
                    canvas.width / 2,
                    canvas.height / 2 + 50
                );
            }
            function updateBird() {
                bird.velocity += bird.gravity;
                bird.velocity *= 0.95; 
                bird.y += bird.velocity;
                if (
                    bird.y + bird.radius > canvas.height ||
                    bird.y - bird.radius < 0
                ) {
                    endGame();
                }
            }
            function updatePipes() {
                if (frameCount % pipeFrequency === 0) {
                    const minHeight = 40;
                    const maxHeight = canvas.height - pipeGap - minHeight;
                    const topHeight =
                        Math.random() * (maxHeight - minHeight) + minHeight;
                    const bottomHeight = canvas.height - topHeight - pipeGap;
                    pipes.push({
                        x: canvas.width,
                        topHeight: topHeight,
                        bottomHeight: bottomHeight,
                        scored: false,
                    });
                }
                for (let i = pipes.length - 1; i >= 0; i--) {
                    pipes[i].x -= 3; 
                    if (
                        bird.x + bird.radius > pipes[i].x &&
                        bird.x - bird.radius < pipes[i].x + pipeWidth
                    ) {
                        if (
                            bird.y - bird.radius < pipes[i].topHeight ||
                            bird.y + bird.radius >
                                canvas.height - pipes[i].bottomHeight
                        ) {
                            endGame();
                        }
                    }
                    if (!pipes[i].scored && pipes[i].x + pipeWidth < bird.x) {
                        score++;
                        pipes[i].scored = true;
                        self.updateScore(score);
                        self.playSound("point");
                    }
                    if (pipes[i].x + pipeWidth < 0) {
                        pipes.splice(i, 1);
                    }
                }
            }
            function flap() {
                bird.velocity = bird.lift;
                self.playSound("jump");
            }
            function endGame() {
                if (gameOver) return; 
                gameOver = true;
                self.playSound("gameOver");
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null; 
                drawGameOver(); 
            }
            function gameLoop() {
                if (gameOver) return;
                ctx.fillStyle = "#87CEEB"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                updateBird();
                updatePipes();
                drawPipes();
                drawBird();
                drawScore();
                frameCount++;
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleInput = (e) => {
                if (gameOver) return;
                if (e.type === "keydown" && e.key !== " ") return;
                if (e.type === "keydown") e.preventDefault(); 
                flap();
            };
            self.addManagedListener(document, "keydown", handleInput, {
                gameId: "flappybird",
            });
            self.addManagedListener(canvas, "mousedown", handleInput, {
                gameId: "flappybird",
            });
            self.addManagedListener(canvas, "touchstart", handleInput, {
                gameId: "flappybird",
                passive: true,
            });
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                },
            };
        }
        initDoodleJumpGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const player = {
                x: canvas.width / 2,
                y: canvas.height - 50,
                width: 40,
                height: 40,
                dx: 0,
                dy: 0,
                gravity: 0.3,
                lift: -8,
                speed: 4,
            };
            const platforms = [];
            const platformWidth = 70;
            const platformHeight = 15;
            const numPlatforms = 8;
            let score = 0;
            let highestY = player.y; 
            let cameraY = 0; 
            function createPlatforms() {
                platforms.length = 0;
                platforms.push({
                    x: canvas.width / 2 - platformWidth / 2,
                    y: canvas.height - 30,
                    width: platformWidth,
                    height: platformHeight,
                });
                for (let i = 1; i < numPlatforms * 3; i++) {
                    platforms.push({
                        x: Math.random() * (canvas.width - platformWidth),
                        y:
                            canvas.height -
                            i * (canvas.height / numPlatforms) -
                            Math.random() * 30, 
                        width: platformWidth,
                        height: platformHeight,
                    });
                }
            }
            function drawPlayer() {
                ctx.fillStyle = "#2ecc71"; 
                ctx.fillRect(
                    player.x - player.width / 2,
                    player.y - player.height / 2 - cameraY,
                    player.width,
                    player.height
                );
            }
            function drawPlatforms() {
                ctx.fillStyle = "#8c5a30"; 
                platforms.forEach((p) => {
                    ctx.fillRect(p.x, p.y - cameraY, p.width, p.height);
                });
            }
            function drawScore() {
                ctx.fillStyle = "#fff";
                ctx.font = "20px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, 30);
            }
            function updatePlayer() {
                player.x += player.dx;
                if (player.x > canvas.width + player.width / 2)
                    player.x = -player.width / 2;
                else if (player.x < -player.width / 2)
                    player.x = canvas.width + player.width / 2;
                player.dy += player.gravity;
                player.y += player.dy;
                if (player.y < highestY) {
                    score += Math.floor(highestY - player.y);
                    highestY = player.y;
                    self.updateScore(score);
                }
                if (player.y - cameraY < canvas.height * 0.3) {
                    cameraY = player.y - canvas.height * 0.3;
                }
                if (player.y - cameraY > canvas.height) {
                    gameOver();
                }
            }
            function checkPlatformCollisions() {
                if (player.dy > 0) {
                    platforms.forEach((p) => {
                        if (
                            player.y + player.height / 2 > p.y &&
                            player.y + player.height / 2 <
                                p.y + platformHeight + 10 && 
                            player.x + player.width / 2 > p.x &&
                            player.x - player.width / 2 < p.x + p.width
                        ) {
                            player.dy = player.lift; 
                            self.playSound("jump");
                        }
                    });
                }
            }
            function managePlatforms() {
                for (let i = platforms.length - 1; i >= 0; i--) {
                    if (platforms[i].y - cameraY > canvas.height + 50) {
                        platforms.splice(i, 1);
                    }
                }
                if (platforms.length < numPlatforms * 2) {
                    let highestPlatformY = canvas.height;
                    platforms.forEach((p) => {
                        highestPlatformY = Math.min(highestPlatformY, p.y);
                    });
                    platforms.push({
                        x: Math.random() * (canvas.width - platformWidth),
                        y:
                            highestPlatformY -
                            (canvas.height / numPlatforms) *
                                (0.8 + Math.random() * 0.4), 
                        width: platformWidth,
                        height: platformHeight,
                    });
                }
            }
            function gameOver() {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                self.playSound("gameOver");
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "40px var(--font-heading)";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(
                    "GAME OVER",
                    canvas.width / 2,
                    canvas.height / 2 - 20
                );
                ctx.font = "20px var(--font-main)";
                ctx.fillStyle = "white";
                ctx.fillText(
                    `Final Score: ${score}`,
                    canvas.width / 2,
                    canvas.height / 2 + 20
                );
                ctx.fillText(
                    "Click Restart",
                    canvas.width / 2,
                    canvas.height / 2 + 50
                );
            }
            function gameLoop() {
                updatePlayer();
                checkPlatformCollisions();
                managePlatforms();
                ctx.fillStyle = "#87CEEB"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawPlatforms();
                drawPlayer();
                drawScore(); 
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                if (animationFrameId === null) return; 
                if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
                    player.dx = -player.speed;
                if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
                    player.dx = player.speed;
            };
            const handleKeyUp = (e) => {
                if (animationFrameId === null) return;
                if (
                    (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") &&
                    player.dx < 0
                )
                    player.dx = 0;
                if (
                    (e.key === "ArrowRight" || e.key.toLowerCase() === "d") &&
                    player.dx > 0
                )
                    player.dx = 0;
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "doodlejump",
            });
            self.addManagedListener(document, "keyup", handleKeyUp, {
                gameId: "doodlejump",
            });
            createPlatforms();
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                },
            };
        }
        initMemoryGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex"; 
            container.style.justifyContent = "center";
            container.style.alignItems = "center";
            container.style.flexWrap = "wrap"; 
            container.style.padding = "20px";
            const symbols = [
                "🍎",
                "🍌",
                "🍒",
                "🍇",
                "🍓",
                "🍍",
                "🥝",
                "🍉",
                "🍊",
                "🍋",
            ]; 
            const gridSize = 4; 
            const numPairs = (gridSize * gridSize) / 2;
            let cards = []; 
            let flippedCards = [];
            let canFlip = true;
            let matchesFound = 0;
            let moves = 0;
            const statusDiv = document.createElement("div");
            statusDiv.style.width = "100%";
            statusDiv.style.textAlign = "center";
            statusDiv.style.marginBottom = "15px";
            statusDiv.style.fontSize = "1.1em";
            statusDiv.style.color = "#fff";
            statusDiv.textContent = `Moves: 0 | Matches: 0 / ${numPairs}`;
            container.appendChild(statusDiv);
            const gridElement = document.createElement("div");
            gridElement.style.display = "grid";
            gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;
            gridElement.style.gridTemplateRows = `repeat(${gridSize}, 70px)`;
            gridElement.style.gap = "10px";
            container.appendChild(gridElement);
            function createCards() {
                cards = [];
                const gameSymbols = symbols
                    .slice(0, numPairs)
                    .concat(symbols.slice(0, numPairs)); 
                gameSymbols.sort(() => 0.5 - Math.random()); 
                for (let i = 0; i < gameSymbols.length; i++) {
                    cards.push({
                        id: i,
                        symbol: gameSymbols[i],
                        flipped: false,
                        matched: false,
                    });
                    const cardElement = document.createElement("div");
                    cardElement.dataset.id = i;
                    cardElement.style.backgroundColor = "#3498db"; 
                    cardElement.style.borderRadius = "5px";
                    cardElement.style.display = "flex";
                    cardElement.style.alignItems = "center";
                    cardElement.style.justifyContent = "center";
                    cardElement.style.fontSize = "30px";
                    cardElement.style.cursor = "pointer";
                    cardElement.style.transition =
                        "transform 0.5s, background-color 0.3s";
                    cardElement.style.transformStyle = "preserve-3d"; 
                    cardElement.addEventListener("click", handleCardClick);
                    gridElement.appendChild(cardElement);
                }
            }
            function handleCardClick(event) {
                if (!canFlip) return;
                const cardElement = event.target;
                const cardId = parseInt(cardElement.dataset.id);
                const card = cards[cardId];
                if (card.flipped || card.matched || flippedCards.length >= 2)
                    return;
                flipCard(card, cardElement, true);
                flippedCards.push({ card, element: cardElement });
                if (flippedCards.length === 1) {
                    self.playSound("click");
                } else if (flippedCards.length === 2) {
                    moves++;
                    canFlip = false; 
                    setTimeout(checkForMatch, 800); 
                }
                updateStatus();
            }
            function flipCard(card, element, isFlippingUp) {
                card.flipped = isFlippingUp;
                element.style.transform = `rotateY(${
                    isFlippingUp ? 180 : 0
                }deg)`;
                setTimeout(() => {
                    if (isFlippingUp) {
                        element.textContent = card.symbol;
                        element.style.backgroundColor = "#f1c40f"; 
                    } else {
                        element.textContent = "";
                        element.style.backgroundColor = "#3498db"; 
                    }
                }, 250); 
            }
            function checkForMatch() {
                const [card1Info, card2Info] = flippedCards;
                if (card1Info.card.symbol === card2Info.card.symbol) {
                    card1Info.card.matched = true;
                    card2Info.card.matched = true;
                    card1Info.element.style.backgroundColor = "#2ecc71"; 
                    card2Info.element.style.backgroundColor = "#2ecc71";
                    card1Info.element.style.cursor = "default";
                    card2Info.element.style.cursor = "default";
                    matchesFound++;
                    self.playSound("point");
                    if (matchesFound === numPairs) {
                        self.playSound("win");
                        statusDiv.textContent = `You Won in ${moves} moves!`;
                    }
                } else {
                    flipCard(card1Info.card, card1Info.element, false);
                    flipCard(card2Info.card, card2Info.element, false);
                    self.playSound("hit");
                }
                flippedCards = []; 
                canFlip = true; 
                updateStatus();
            }
            function updateStatus() {
                if (matchesFound !== numPairs) {
                    statusDiv.textContent = `Moves: ${moves} | Matches: ${matchesFound} / ${numPairs}`;
                }
            }
            createCards();
            return {
                cleanup: () => {
                    Array.from(gridElement.children).forEach((card) => {
                        card.removeEventListener("click", handleCardClick);
                    });
                    container.innerHTML = "";
                },
            };
        }
        initClickerGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.justifyContent = "center";
            container.style.gap = "15px";
            container.style.color = "#fff";
            let score = 0;
            let scorePerClick = 1;
            let autoClickRate = 0; 
            let autoClickInterval;
            const scoreDisplay = document.createElement("h2");
            scoreDisplay.textContent = `Score: ${score}`;
            scoreDisplay.style.fontSize = "2em";
            scoreDisplay.style.fontFamily = "var(--font-heading)";
            container.appendChild(scoreDisplay);
            const clickButton = document.createElement("button");
            clickButton.innerHTML =
                '<i class="fas fa-hand-pointer"></i> Click Me!';
            clickButton.style.padding = "20px 40px";
            clickButton.style.fontSize = "1.5em";
            clickButton.style.backgroundColor = "var(--primary-color)";
            clickButton.style.color = "#111";
            clickButton.style.border = "none";
            clickButton.style.borderRadius = "10px";
            clickButton.style.cursor = "pointer";
            clickButton.style.transition = "transform 0.1s ease";
            clickButton.addEventListener(
                "mousedown",
                () => (clickButton.style.transform = "scale(0.95)")
            );
            clickButton.addEventListener(
                "mouseup",
                () => (clickButton.style.transform = "scale(1)")
            );
            clickButton.addEventListener("click", () => {
                score += scorePerClick;
                updateDisplay();
                self.playSound("click");
                showClickFeedback(clickButton);
            });
            container.appendChild(clickButton);
            const statsDisplay = document.createElement("div");
            statsDisplay.style.fontSize = "1em";
            statsDisplay.innerHTML = `Per Click: ${scorePerClick} | Auto/sec: ${autoClickRate}`;
            container.appendChild(statsDisplay);
            const upgradesContainer = document.createElement("div");
            upgradesContainer.style.display = "flex";
            upgradesContainer.style.gap = "10px";
            container.appendChild(upgradesContainer);
            const upgradeClickButton = createUpgradeButton(
                "Upgrade Click (Cost: 10)",
                10,
                () => {
                    scorePerClick++;
                    return Math.floor(10 * Math.pow(1.15, scorePerClick)); 
                },
                (cost) => `Upgrade Click (Cost: ${cost})`
            );
            upgradesContainer.appendChild(upgradeClickButton);
            const upgradeAutoButton = createUpgradeButton(
                "Buy Auto Clicker (Cost: 50)",
                50,
                () => {
                    autoClickRate++;
                    startAutoClicker(); 
                    return Math.floor(50 * Math.pow(1.2, autoClickRate));
                },
                (cost) => `Buy Auto Clicker (Cost: ${cost})`
            );
            upgradesContainer.appendChild(upgradeAutoButton);
            function createUpgradeButton(
                initialText,
                initialCost,
                action,
                updateTextFn
            ) {
                const button = document.createElement("button");
                let currentCost = initialCost;
                button.textContent = initialText;
                button.style.padding = "8px 15px";
                button.style.fontSize = "0.9em";
                button.style.backgroundColor = "var(--accent-color)";
                button.style.color = "#fff";
                button.style.border = "none";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
                button.disabled = true; 
                button.addEventListener("click", () => {
                    if (score >= currentCost) {
                        score -= currentCost;
                        currentCost = action(); 
                        button.textContent = updateTextFn(currentCost);
                        updateDisplay();
                        self.playSound("point");
                    }
                });
                button.updateAvailability = () => {
                    button.disabled = score < currentCost;
                    button.style.opacity = button.disabled ? 0.6 : 1;
                };
                button.updateAvailability(); 
                return button;
            }
            function updateDisplay() {
                scoreDisplay.textContent = `Score: ${Math.floor(score)}`; 
                statsDisplay.innerHTML = `Per Click: ${scorePerClick} | Auto/sec: ${autoClickRate}`;
                upgradeClickButton.updateAvailability();
                upgradeAutoButton.updateAvailability();
            }
            function startAutoClicker() {
                if (autoClickInterval) clearInterval(autoClickInterval);
                if (autoClickRate > 0) {
                    autoClickInterval = setInterval(() => {
                        score += autoClickRate / 10; 
                        updateDisplay();
                    }, 100); 
                }
            }
            function showClickFeedback(button) {
                const feedback = document.createElement("div");
                feedback.textContent = `+${scorePerClick}`;
                feedback.style.position = "absolute";
                const rect = button.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                feedback.style.left = `${
                    rect.left -
                    containerRect.left +
                    rect.width / 2 +
                    (Math.random() * 40 - 20)
                }px`;
                feedback.style.top = `${
                    rect.top - containerRect.top - 20 + (Math.random() * 10 - 5)
                }px`;
                feedback.style.color = "var(--primary-color)";
                feedback.style.fontSize = "1.2em";
                feedback.style.fontWeight = "bold";
                feedback.style.pointerEvents = "none";
                feedback.style.transition =
                    "opacity 0.5s ease-out, transform 0.5s ease-out";
                feedback.style.opacity = "1";
                feedback.style.transform = "translateY(0)";
                container.appendChild(feedback);
                setTimeout(() => {
                    feedback.style.opacity = "0";
                    feedback.style.transform = "translateY(-30px)";
                    setTimeout(() => container.removeChild(feedback), 500); 
                }, 100);
            }
            updateDisplay();
            return {
                cleanup: () => {
                    if (autoClickInterval) clearInterval(autoClickInterval);
                    container.innerHTML = ""; 
                },
            };
        }
        initMazeGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const cols = 20;
            const rows = 20;
            const cellSize = canvas.width / cols; 
            let grid = []; 
            let player = { x: 0, y: 0 }; 
            const goal = { x: cols - 1, y: rows - 1 }; 
            let visited = []; 
            let stack = []; 
            function createGrid() {
                grid = Array(rows)
                    .fill(null)
                    .map(() =>
                        Array(cols)
                            .fill(null)
                            .map(() => ({
                                top: true,
                                right: true,
                                bottom: true,
                                left: true,
                                visited: false,
                            }))
                    );
            }
            function generateMaze(cx, cy) {
                grid[cy][cx].visited = true;
                stack.push({ x: cx, y: cy });
                while (stack.length > 0) {
                    const current = stack[stack.length - 1];
                    let { x, y } = current;
                    let neighbors = [];
                    if (y > 0 && !grid[y - 1][x].visited)
                        neighbors.push({
                            x: x,
                            y: y - 1,
                            dir: "top",
                            opposite: "bottom",
                        });
                    if (x < cols - 1 && !grid[y][x + 1].visited)
                        neighbors.push({
                            x: x + 1,
                            y: y,
                            dir: "right",
                            opposite: "left",
                        });
                    if (y < rows - 1 && !grid[y + 1][x].visited)
                        neighbors.push({
                            x: x,
                            y: y + 1,
                            dir: "bottom",
                            opposite: "top",
                        });
                    if (x > 0 && !grid[y][x - 1].visited)
                        neighbors.push({
                            x: x - 1,
                            y: y,
                            dir: "left",
                            opposite: "right",
                        });
                    if (neighbors.length > 0) {
                        const next =
                            neighbors[
                                Math.floor(Math.random() * neighbors.length)
                            ];
                        grid[y][x][next.dir] = false;
                        grid[next.y][next.x][next.opposite] = false;
                        grid[next.y][next.x].visited = true;
                        stack.push({ x: next.x, y: next.y });
                    } else {
                        stack.pop();
                    }
                }
            }
            function drawMaze() {
                ctx.strokeStyle = "#ccc"; 
                ctx.lineWidth = 2;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const x = c * cellSize;
                        const y = r * cellSize;
                        if (grid[r][c].top) {
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + cellSize, y);
                            ctx.stroke();
                        }
                        if (grid[r][c].right) {
                            ctx.beginPath();
                            ctx.moveTo(x + cellSize, y);
                            ctx.lineTo(x + cellSize, y + cellSize);
                            ctx.stroke();
                        }
                        if (grid[r][c].bottom) {
                            ctx.beginPath();
                            ctx.moveTo(x + cellSize, y + cellSize);
                            ctx.lineTo(x, y + cellSize);
                            ctx.stroke();
                        }
                        if (grid[r][c].left) {
                            ctx.beginPath();
                            ctx.moveTo(x, y + cellSize);
                            ctx.lineTo(x, y);
                            ctx.stroke();
                        }
                    }
                }
            }
            function drawPlayer() {
                ctx.fillStyle = "#3498db"; 
                ctx.fillRect(
                    player.x * cellSize + cellSize * 0.15,
                    player.y * cellSize + cellSize * 0.15,
                    cellSize * 0.7,
                    cellSize * 0.7
                );
            }
            function drawGoal() {
                ctx.fillStyle = "#2ecc71"; 
                ctx.fillRect(
                    goal.x * cellSize + cellSize * 0.1,
                    goal.y * cellSize + cellSize * 0.1,
                    cellSize * 0.8,
                    cellSize * 0.8
                );
            }
            function movePlayer(dx, dy) {
                const currentCell = grid[player.y][player.x];
                let canMove = false;
                if (dx === 1 && !currentCell.right) canMove = true;
                else if (dx === -1 && !currentCell.left) canMove = true;
                else if (dy === 1 && !currentCell.bottom) canMove = true;
                else if (dy === -1 && !currentCell.top) canMove = true; 
                if (canMove) {
                    player.x += dx;
                    player.y += dy;
                    self.playSound("click");
                    if (player.x === goal.x && player.y === goal.y) {
                        winGame();
                    }
                }
            }
            function winGame() {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                self.playSound("win");
                ctx.fillStyle = "rgba(0, 200, 0, 0.7)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "30px var(--font-heading)";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(
                    "MAZE COMPLETED!",
                    canvas.width / 2,
                    canvas.height / 2
                );
            }
            function gameLoop() {
                ctx.fillStyle = "#1a1a2e";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawMaze();
                drawGoal();
                drawPlayer();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                if (animationFrameId === null) return; 
                switch (e.key) {
                    case "ArrowUp":
                    case "w":
                        movePlayer(0, -1);
                        break;
                    case "ArrowDown":
                    case "s":
                        movePlayer(0, 1);
                        break;
                    case "ArrowLeft":
                    case "a":
                        movePlayer(-1, 0);
                        break;
                    case "ArrowRight":
                    case "d":
                        movePlayer(1, 0);
                        break;
                }
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "maze",
            });
            createGrid();
            generateMaze(0, 0); 
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                },
            };
        }
        initTypingGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.justifyContent = "center";
            container.style.gap = "15px";
            container.style.padding = "20px";
            container.style.color = "#fff";
            container.style.fontFamily = "var(--font-main)";
            const words = [
                "javascript",
                "html",
                "developer",
                "coding",
                "legendary",
                "showcase",
                "project",
                "interface",
                "function",
                "variable",
                "constant",
                "array",
                "object",
                "class",
                "event",
                "listener",
                "framework",
                "library",
                "component",
                "style",
                "element",
                "attribute",
                "selector",
                "debug",
                "algorithm",
                "database",
                "server",
                "client",
                "network",
                "protocol",
                "security",
                "authentication",
                "performance",
                "optimization",
                "responsive",
                "accessibility",
                "design",
                "experience",
                "innovation",
            ];
            const gameTime = 60; 
            let currentWords = [];
            let wordIndex = 0;
            let startTime;
            let timerInterval;
            let timeLeft = gameTime;
            let correctChars = 0;
            let totalChars = 0;
            let gameActive = false;
            const wordDisplay = document.createElement("div");
            wordDisplay.style.fontSize = "1.8em";
            wordDisplay.style.marginBottom = "10px";
            wordDisplay.style.lineHeight = "1.5";
            wordDisplay.style.backgroundColor = "rgba(0,0,0,0.3)";
            wordDisplay.style.padding = "15px";
            wordDisplay.style.borderRadius = "8px";
            wordDisplay.style.minHeight = "100px";
            wordDisplay.style.width = "80%";
            wordDisplay.style.maxWidth = "600px";
            wordDisplay.style.textAlign = "left"; 
            container.appendChild(wordDisplay);
            const inputArea = document.createElement("input");
            inputArea.type = "text";
            inputArea.placeholder = "Start typing here...";
            inputArea.style.fontSize = "1.2em";
            inputArea.style.padding = "10px";
            inputArea.style.width = "80%";
            inputArea.style.maxWidth = "600px";
            inputArea.style.borderRadius = "5px";
            inputArea.style.border = "2px solid #aaa";
            inputArea.disabled = true; 
            inputArea.addEventListener("input", handleInput);
            container.appendChild(inputArea);
            const statsDisplay = document.createElement("div");
            statsDisplay.style.fontSize = "1.2em";
            statsDisplay.style.marginTop = "10px";
            statsDisplay.textContent = `Time: ${timeLeft}s | WPM: 0 | Accuracy: 100%`;
            container.appendChild(statsDisplay);
            const startButton = document.createElement("button");
            startButton.textContent = "Start Test";
            startButton.style.padding = "10px 20px";
            startButton.style.fontSize = "1em";
            startButton.style.backgroundColor = "var(--primary-color)";
            startButton.style.color = "#111";
            startButton.style.border = "none";
            startButton.style.borderRadius = "5px";
            startButton.style.cursor = "pointer";
            startButton.addEventListener("click", startGame);
            container.appendChild(startButton);
            function setupWords() {
                currentWords = [];
                for (let i = 0; i < 50; i++) {
                    currentWords.push(
                        words[Math.floor(Math.random() * words.length)]
                    );
                }
                wordIndex = 0;
                displayWords();
            }
            function displayWords() {
                wordDisplay.innerHTML = "";
                currentWords.forEach((word, index) => {
                    const wordSpan = document.createElement("span");
                    wordSpan.textContent = word + " "; 
                    wordSpan.dataset.index = index;
                    if (index === wordIndex) {
                        wordSpan.style.backgroundColor =
                            "rgba(255, 255, 255, 0.2)"; 
                        wordSpan.style.borderRadius = "3px";
                    } else if (index < wordIndex) {
                        wordSpan.style.opacity = "0.6"; 
                    }
                    wordDisplay.appendChild(wordSpan);
                });
                const activeWord = wordDisplay.querySelector(
                    `span[data-index="${wordIndex}"]`
                );
                if (activeWord)
                    activeWord.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
            }
            function startGame() {
                if (timerInterval) clearInterval(timerInterval);
                setupWords();
                timeLeft = gameTime;
                correctChars = 0;
                totalChars = 0;
                gameActive = true;
                inputArea.disabled = false;
                inputArea.value = "";
                inputArea.focus();
                startButton.textContent = "Restart Test";
                statsDisplay.textContent = `Time: ${timeLeft}s | WPM: 0 | Accuracy: 100%`;
                self.playSound("ui");
                startTime = new Date();
                timerInterval = setInterval(updateTimer, 1000);
            }
            function updateTimer() {
                timeLeft--;
                if (timeLeft <= 0) {
                    endGame();
                }
                updateStats();
            }
            function handleInput() {
                if (!gameActive) return;
                const typedValue = inputArea.value;
                const currentWord = currentWords[wordIndex];
                const currentWordSpan = wordDisplay.querySelector(
                    `span[data-index="${wordIndex}"]`
                );
                if (typedValue.endsWith(" ")) {
                    const typedWord = typedValue.trim();
                    totalChars += currentWord.length + 1; 
                    if (typedWord === currentWord) {
                        correctChars += currentWord.length + 1;
                        currentWordSpan.style.color = "lime"; 
                        self.playSound("click");
                    } else {
                        currentWordSpan.style.color = "red"; 
                        self.playSound("hit");
                    }
                    wordIndex++;
                    inputArea.value = ""; 
                    if (wordIndex >= currentWords.length) {
                        setupWords(); 
                    } else {
                        displayWords(); 
                    }
                } else {
                    let correct = true;
                    let displayHtml = "";
                    for (let i = 0; i < currentWord.length; i++) {
                        if (i < typedValue.length) {
                            if (typedValue[i] === currentWord[i]) {
                                displayHtml += `<span style="color: lime;">${currentWord[i]}</span>`;
                            } else {
                                displayHtml += `<span style="color: red; text-decoration: underline;">${currentWord[i]}</span>`;
                                correct = false;
                            }
                        } else {
                            displayHtml += `<span>${currentWord[i]}</span>`; 
                        }
                    }
                    currentWordSpan.innerHTML = displayHtml + " "; 
                    currentWordSpan.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)"; 
                }
                updateStats();
            }
            function updateStats() {
                const timeElapsed = gameTime - timeLeft;
                const wpm =
                    timeElapsed > 0
                        ? Math.round(correctChars / 5 / (timeElapsed / 60))
                        : 0;
                const accuracy =
                    totalChars > 0
                        ? Math.round((correctChars / totalChars) * 100)
                        : 100;
                statsDisplay.textContent = `Time: ${timeLeft}s | WPM: ${wpm} | Accuracy: ${accuracy}%`;
            }
            function endGame() {
                clearInterval(timerInterval);
                gameActive = false;
                inputArea.disabled = true;
                startButton.textContent = "Start Again";
                self.playSound("gameOver");
                updateStats(); 
            }
            setupWords(); 
            return {
                cleanup: () => {
                    if (timerInterval) clearInterval(timerInterval);
                    container.innerHTML = "";
                },
            };
        }
        initWordSearchGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.gap = "20px";
            container.style.padding = "15px";
            container.style.fontFamily = "var(--font-main)";
            container.style.color = "#fff";
            const gridSize = 12;
            const wordsToFind = [
                "HTML",
                "CSS",
                "GRID",
                "FLEX",
                "NODE",
                "REACT",
                "VUE",
                "SVELTE",
                "JAVA",
                "SCRIPT",
            ]; 
            let grid = []; 
            let placedWords = []; 
            let foundWords = new Set();
            let isSelecting = false;
            let selectionStart = null; 
            let selectionCurrent = null; 
            let selectedCells = []; 
            const gridContainer = document.createElement("div");
            gridContainer.style.flexGrow = "1";
            const gridElement = document.createElement("div");
            gridElement.style.display = "grid";
            gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
            gridElement.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;
            gridElement.style.gap = "1px";
            gridElement.style.backgroundColor = "#555";
            gridElement.style.border = "2px solid #888";
            gridElement.style.userSelect = "none"; 
            gridContainer.appendChild(gridElement);
            const wordListContainer = document.createElement("div");
            wordListContainer.style.width = "150px";
            wordListContainer.style.flexShrink = "0";
            wordListContainer.style.borderLeft = "1px solid #555";
            wordListContainer.style.paddingLeft = "15px";
            const wordListTitle = document.createElement("h4");
            wordListTitle.textContent = "Find Words:";
            wordListTitle.style.margin = "0 0 10px 0";
            const wordListElement = document.createElement("ul");
            wordListElement.style.listStyle = "none";
            wordListElement.style.padding = "0";
            wordListElement.style.margin = "0";
            wordListContainer.appendChild(wordListTitle);
            wordListContainer.appendChild(wordListElement);
            container.appendChild(gridContainer);
            container.appendChild(wordListContainer);
            function createGridCells() {
                gridElement.innerHTML = ""; 
                for (let r = 0; r < gridSize; r++) {
                    grid[r] = [];
                    for (let c = 0; c < gridSize; c++) {
                        grid[r][c] = ""; 
                        const cell = document.createElement("div");
                        cell.dataset.row = r;
                        cell.dataset.col = c;
                        cell.style.backgroundColor = "#bbb";
                        cell.style.color = "#111";
                        cell.style.display = "flex";
                        cell.style.alignItems = "center";
                        cell.style.justifyContent = "center";
                        cell.style.fontSize = "16px";
                        cell.style.fontWeight = "bold";
                        cell.style.cursor = "pointer";
                        cell.addEventListener("mousedown", handleMouseDown);
                        cell.addEventListener("mouseover", handleMouseOver);
                        gridElement.appendChild(cell);
                    }
                }
                gridElement.addEventListener("mouseup", handleMouseUp);
                gridElement.addEventListener("mouseleave", handleMouseLeave); 
            }
            function placeWords() {
                placedWords = [];
                const directions = [
                    { dr: 0, dc: 1 },
                    { dr: 1, dc: 0 },
                    { dr: 1, dc: 1 }, 
                    { dr: 0, dc: -1 },
                    { dr: -1, dc: 0 },
                    { dr: -1, dc: -1 }, 
                    { dr: 1, dc: -1 },
                    { dr: -1, dc: 1 }, 
                ];
                wordsToFind.sort((a, b) => b.length - a.length); 
                wordsToFind.forEach((word) => {
                    let placed = false;
                    let attempts = 0;
                    while (!placed && attempts < 100) {
                        attempts++;
                        const dir =
                            directions[
                                Math.floor(Math.random() * directions.length)
                            ];
                        const rStart = Math.floor(Math.random() * gridSize);
                        const cStart = Math.floor(Math.random() * gridSize);
                        let canPlace = true;
                        let positions = [];
                        for (let i = 0; i < word.length; i++) {
                            const r = rStart + i * dir.dr;
                            const c = cStart + i * dir.dc;
                            if (
                                r < 0 ||
                                r >= gridSize ||
                                c < 0 ||
                                c >= gridSize ||
                                (grid[r][c] !== "" && grid[r][c] !== word[i])
                            ) {
                                canPlace = false;
                                break;
                            }
                            positions.push({ r, c });
                        }
                        if (canPlace) {
                            for (let i = 0; i < word.length; i++) {
                                grid[positions[i].r][positions[i].c] = word[i];
                            }
                            placedWords.push({ word, positions });
                            placed = true;
                        }
                    }
                    if (!placed) console.warn(`Could not place word: ${word}`);
                });
            }
            function fillEmptyCells() {
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        if (grid[r][c] === "") {
                            grid[r][c] =
                                alphabet[
                                    Math.floor(Math.random() * alphabet.length)
                                ];
                        }
                        gridElement.children[r * gridSize + c].textContent =
                            grid[r][c];
                    }
                }
            }
            function updateWordList() {
                wordListElement.innerHTML = "";
                wordsToFind.forEach((word) => {
                    const li = document.createElement("li");
                    li.textContent = word;
                    li.style.padding = "3px 0";
                    li.style.fontSize = "0.95em";
                    if (foundWords.has(word)) {
                        li.style.textDecoration = "line-through";
                        li.style.opacity = "0.6";
                    }
                    wordListElement.appendChild(li);
                });
            }
            function handleMouseDown(event) {
                const cell = event.target.closest("div[data-row]");
                if (!cell || foundWords.size === wordsToFind.length) return;
                isSelecting = true;
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);
                selectionStart = { r, c, element: cell };
                selectionCurrent = { r, c, element: cell };
                selectedCells = [selectionStart];
                highlightSelection();
                self.playSound("click");
            }
            function handleMouseOver(event) {
                if (!isSelecting || !selectionStart) return;
                const cell = event.target.closest("div[data-row]");
                if (!cell) return;
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);
                if (r === selectionCurrent.r && c === selectionCurrent.c)
                    return;
                selectionCurrent = { r, c, element: cell };
                updateSelectedCells();
                highlightSelection();
            }
            function handleMouseUp() {
                if (!isSelecting) return;
                isSelecting = false;
                checkSelectedWord();
                clearHighlight();
                selectionStart = null;
                selectionCurrent = null;
                selectedCells = [];
            }
            function handleMouseLeave() {
                if (isSelecting) {
                    handleMouseUp();
                }
            }
            function updateSelectedCells() {
                selectedCells = [];
                if (!selectionStart || !selectionCurrent) return;
                const r1 = selectionStart.r,
                    c1 = selectionStart.c;
                const r2 = selectionCurrent.r,
                    c2 = selectionCurrent.c;
                const dr = Math.sign(r2 - r1);
                const dc = Math.sign(c2 - c1);
                if (
                    r1 === r2 ||
                    c1 === c2 ||
                    Math.abs(r2 - r1) === Math.abs(c2 - c1)
                ) {
                    let r = r1,
                        c = c1;
                    while (true) {
                        const element = gridElement.children[r * gridSize + c];
                        selectedCells.push({ r, c, element });
                        if (r === r2 && c === c2) break;
                        r += dr;
                        c += dc;
                    }
                } else {
                    selectedCells = [selectionStart]; 
                }
            }
            function highlightSelection() {
                clearHighlight(false); 
                selectedCells.forEach(({ element }) => {
                    if (!element.classList.contains("found")) {
                        element.style.backgroundColor = "#f1c40f"; 
                        element.classList.add("selected");
                    }
                });
            }
            function clearHighlight(clearFound = true) {
                const cellsToClear = gridElement.querySelectorAll(".selected");
                cellsToClear.forEach((cell) => {
                    if (!cell.classList.contains("found") || clearFound) {
                        cell.style.backgroundColor = "#bbb"; 
                        cell.classList.remove("selected");
                    }
                });
            }
            function checkSelectedWord() {
                if (selectedCells.length < 2) return; 
                let selectedWord = selectedCells
                    .map(({ r, c }) => grid[r][c])
                    .join("");
                let selectedWordReversed = selectedCells
                    .slice()
                    .reverse()
                    .map(({ r, c }) => grid[r][c])
                    .join("");
                let wordFound = null;
                if (
                    wordsToFind.includes(selectedWord) &&
                    !foundWords.has(selectedWord)
                ) {
                    wordFound = selectedWord;
                } else if (
                    wordsToFind.includes(selectedWordReversed) &&
                    !foundWords.has(selectedWordReversed)
                ) {
                    wordFound = selectedWordReversed;
                    selectedCells.reverse();
                }
                if (wordFound) {
                    foundWords.add(wordFound);
                    selectedCells.forEach(({ element }) => {
                        element.style.backgroundColor = "#2ecc71"; 
                        element.classList.add("found"); 
                        element.classList.remove("selected"); 
                    });
                    updateWordList();
                    self.playSound("point");
                    if (foundWords.size === wordsToFind.length) {
                        self.playSound("win");
                    }
                } else {
                    self.playSound("hit"); 
                }
            }
            createGridCells();
            placeWords();
            fillEmptyCells();
            updateWordList();
            return {
                cleanup: () => {
                    gridElement.removeEventListener("mouseup", handleMouseUp);
                    gridElement.removeEventListener(
                        "mouseleave",
                        handleMouseLeave
                    );
                    Array.from(gridElement.children).forEach((cell) => {
                        cell.removeEventListener("mousedown", handleMouseDown);
                        cell.removeEventListener("mouseover", handleMouseOver);
                    });
                    container.innerHTML = "";
                },
            };
        }
        initHangmanGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.gap = "15px";
            container.style.padding = "20px";
            container.style.fontFamily = "var(--font-main)";
            container.style.color = "#fff";
            const words = [
                "JAVASCRIPT",
                "DEVELOPER",
                "LEGENDARY",
                "SHOWCASE",
                "INTERFACE",
                "FRAMEWORK",
                "COMPONENT",
                "ALGORITHM",
                "OPTIMIZATION",
                "ACCESSIBILITY",
            ];
            let wordToGuess = "";
            let guessedLetters = new Set();
            let wrongGuesses = 0;
            const maxWrongGuesses = 6; 
            let gameOver = false;
            const hangmanCanvas = document.createElement("canvas");
            hangmanCanvas.width = 200;
            hangmanCanvas.height = 250;
            const hctx = hangmanCanvas.getContext("2d");
            container.appendChild(hangmanCanvas);
            const wordDisplay = document.createElement("div");
            wordDisplay.style.fontSize = "2em";
            wordDisplay.style.letterSpacing = "0.2em";
            wordDisplay.style.margin = "10px 0";
            container.appendChild(wordDisplay);
            const guessedDisplay = document.createElement("div");
            guessedDisplay.style.fontSize = "1em";
            guessedDisplay.style.color = "#aaa";
            guessedDisplay.textContent = "Guessed: ";
            container.appendChild(guessedDisplay);
            const keyboard = document.createElement("div");
            keyboard.style.display = "flex";
            keyboard.style.flexWrap = "wrap";
            keyboard.style.justifyContent = "center";
            keyboard.style.gap = "5px";
            keyboard.style.maxWidth = "400px";
            container.appendChild(keyboard);
            const statusMessage = document.createElement("div");
            statusMessage.style.fontSize = "1.2em";
            statusMessage.style.fontWeight = "bold";
            statusMessage.style.marginTop = "10px";
            container.appendChild(statusMessage);
            function drawHangman() {
                hctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
                hctx.strokeStyle = "#fff";
                hctx.lineWidth = 3;
                hctx.beginPath();
                hctx.moveTo(10, 240);
                hctx.lineTo(190, 240);
                hctx.stroke(); 
                hctx.moveTo(50, 240);
                hctx.lineTo(50, 10);
                hctx.stroke(); 
                hctx.lineTo(150, 10);
                hctx.stroke(); 
                hctx.lineTo(150, 40);
                hctx.stroke(); 
                if (wrongGuesses > 0) {
                    hctx.beginPath();
                    hctx.arc(150, 60, 20, 0, Math.PI * 2);
                    hctx.stroke();
                }
                if (wrongGuesses > 1) {
                    hctx.beginPath();
                    hctx.moveTo(150, 80);
                    hctx.lineTo(150, 150);
                    hctx.stroke();
                }
                if (wrongGuesses > 2) {
                    hctx.beginPath();
                    hctx.moveTo(150, 100);
                    hctx.lineTo(110, 130);
                    hctx.stroke();
                }
                if (wrongGuesses > 3) {
                    hctx.beginPath();
                    hctx.moveTo(150, 100);
                    hctx.lineTo(190, 130);
                    hctx.stroke();
                }
                if (wrongGuesses > 4) {
                    hctx.beginPath();
                    hctx.moveTo(150, 150);
                    hctx.lineTo(120, 200);
                    hctx.stroke();
                }
                if (wrongGuesses > 5) {
                    hctx.beginPath();
                    hctx.moveTo(150, 150);
                    hctx.lineTo(180, 200);
                    hctx.stroke();
                }
            }
            function updateWordDisplay() {
                let display = "";
                let allGuessed = true;
                for (const letter of wordToGuess) {
                    if (guessedLetters.has(letter)) {
                        display += letter;
                    } else {
                        display += "_";
                        allGuessed = false;
                    }
                    display += " "; 
                }
                wordDisplay.textContent = display.trim();
                return allGuessed;
            }
            function updateGuessedDisplay() {
                guessedDisplay.textContent = `Guessed: ${[...guessedLetters]
                    .sort()
                    .join(", ")}`;
            }
            function createKeyboard() {
                keyboard.innerHTML = ""; 
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (const letter of alphabet) {
                    const button = document.createElement("button");
                    button.textContent = letter;
                    button.dataset.letter = letter;
                    button.style.width = "30px";
                    button.style.height = "30px";
                    button.style.fontSize = "1em";
                    button.style.cursor = "pointer";
                    button.style.backgroundColor = "#555";
                    button.style.color = "#fff";
                    button.style.border = "1px solid #888";
                    button.addEventListener("click", handleGuess);
                    keyboard.appendChild(button);
                }
            }
            function handleGuess(event) {
                if (gameOver) return;
                const guessedLetter = event.target.dataset.letter;
                if (!guessedLetter || guessedLetters.has(guessedLetter)) return;
                guessedLetters.add(guessedLetter);
                event.target.disabled = true; 
                event.target.style.opacity = "0.5";
                event.target.style.cursor = "default";
                if (wordToGuess.includes(guessedLetter)) {
                    self.playSound("click");
                    const allGuessed = updateWordDisplay();
                    if (allGuessed) {
                        endGame(true);
                    }
                } else {
                    wrongGuesses++;
                    self.playSound("hit");
                    drawHangman();
                    if (wrongGuesses >= maxWrongGuesses) {
                        endGame(false);
                    }
                }
                updateGuessedDisplay();
            }
            function endGame(won) {
                gameOver = true;
                keyboard.querySelectorAll("button").forEach((btn) => {
                    btn.disabled = true;
                    btn.style.cursor = "default";
                });
                if (won) {
                    statusMessage.textContent = "You Win!";
                    statusMessage.style.color = "lime";
                    self.playSound("win");
                } else {
                    statusMessage.textContent = `Game Over! Word was: ${wordToGuess}`;
                    statusMessage.style.color = "red";
                    self.playSound("gameOver");
                    wordDisplay.textContent = wordToGuess.split("").join(" ");
                }
            }
            function startGame() {
                wordToGuess = words[Math.floor(Math.random() * words.length)];
                guessedLetters.clear();
                wrongGuesses = 0;
                gameOver = false;
                statusMessage.textContent = "";
                drawHangman();
                updateWordDisplay();
                updateGuessedDisplay();
                createKeyboard(); 
            }
            startGame();
            return {
                cleanup: () => {
                    keyboard.querySelectorAll("button").forEach((btn) => {
                        btn.removeEventListener("click", handleGuess);
                    });
                    container.innerHTML = "";
                },
            };
        }
        initSimonSaysGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.gap = "20px";
            container.style.padding = "20px";
            container.style.fontFamily = "var(--font-main)";
            container.style.color = "#fff";
            const colors = ["#2ecc71", "#e74c3c", "#f1c40f", "#3498db"]; 
            const sounds = [261.63, 329.63, 392.0, 523.25]; 
            let sequence = [];
            let playerSequence = [];
            let level = 0;
            let canPlayerGuess = false;
            let flashTimeout;
            const simonContainer = document.createElement("div");
            simonContainer.style.display = "grid";
            simonContainer.style.gridTemplateColumns = "100px 100px";
            simonContainer.style.gridTemplateRows = "100px 100px";
            simonContainer.style.gap = "10px";
            container.appendChild(simonContainer);
            const statusDisplay = document.createElement("div");
            statusDisplay.style.fontSize = "1.2em";
            statusDisplay.textContent = "Level: 0";
            container.appendChild(statusDisplay);
            colors.forEach((color, index) => {
                const button = document.createElement("div");
                button.dataset.index = index;
                button.style.backgroundColor = color;
                button.style.borderRadius = "10px";
                button.style.cursor = "pointer";
                button.style.transition = "opacity 0.1s ease";
                button.addEventListener("click", handleButtonClick);
                simonContainer.appendChild(button);
            });
            function playSequence() {
                canPlayerGuess = false;
                statusDisplay.textContent = `Level: ${level} - Watch!`;
                let i = 0;
                const interval = setInterval(() => {
                    if (i >= sequence.length) {
                        clearInterval(interval);
                        canPlayerGuess = true;
                        playerSequence = [];
                        statusDisplay.textContent = `Level: ${level} - Your Turn!`;
                        return;
                    }
                    flashButton(sequence[i]);
                    i++;
                }, 800); 
            }
            function flashButton(index) {
                const button = simonContainer.children[index];
                if (!button) return;
                button.style.opacity = "0.5"; 
                playSoundNote(sounds[index], 0.3); 
                if (flashTimeout) clearTimeout(flashTimeout); 
                flashTimeout = setTimeout(() => {
                    button.style.opacity = "1";
                }, 400); 
            }
            function handleButtonClick(event) {
                if (!canPlayerGuess) return;
                const index = parseInt(event.target.dataset.index);
                flashButton(index); 
                playerSequence.push(index);
                if (
                    playerSequence[playerSequence.length - 1] !==
                    sequence[playerSequence.length - 1]
                ) {
                    gameOver();
                    return;
                }
                if (playerSequence.length === sequence.length) {
                    canPlayerGuess = false; 
                    level++;
                    self.updateScore(level); 
                    self.playSound("point");
                    setTimeout(nextLevel, 1000); 
                }
            }
            function nextLevel() {
                sequence.push(Math.floor(Math.random() * 4)); 
                playSequence();
            }
            function gameOver() {
                canPlayerGuess = false;
                statusDisplay.textContent = `Game Over! Reached Level ${level}`;
                self.playSound("gameOver");
            }
            function playSoundNote(frequency, duration) {
                if (!self.soundEnabled) return;
                const audioCtx = self.getAudioContext();
                if (!audioCtx) return;
                try {
                    const oscillator = audioCtx.createOscillator();
                    oscillator.type = "sine";
                    oscillator.frequency.setValueAtTime(
                        frequency,
                        audioCtx.currentTime
                    );
                    const gainNode = audioCtx.createGain();
                    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + duration
                    );
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + duration);
                } catch (error) {
                    console.error("Error playing Simon sound:", error);
                }
            }
            setTimeout(nextLevel, 500); 
            return {
                cleanup: () => {
                    if (flashTimeout) clearTimeout(flashTimeout);
                    Array.from(simonContainer.children).forEach((btn) => {
                        btn.removeEventListener("click", handleButtonClick);
                    });
                    container.innerHTML = "";
                },
            };
        }
        initTicTacToeGame(container) {
            if (!container) return null;
            const self = this;
            container.innerHTML = ""; 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.gap = "15px";
            container.style.padding = "20px";
            container.style.fontFamily = "var(--font-main)";
            container.style.color = "#fff";
            const board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; 
            const playerMark = "X";
            const aiMark = "O";
            let currentPlayer = 1; 
            let gameOver = false;
            let winningLine = null;
            let winAnimation = 0;
            let scores = { player: 0, ai: 0, draw: 0 };
            let difficulty = "medium"; 
            let lastWinner = null;
            const gameHeader = document.createElement("div");
            gameHeader.style.fontSize = "1.5em";
            gameHeader.style.fontWeight = "bold";
            gameHeader.style.marginBottom = "5px";
            gameHeader.style.textAlign = "center";
            gameHeader.style.color = "#ff9f43";
            gameHeader.textContent = "Tic Tac Toe AI Challenge";
            container.appendChild(gameHeader);
            const difficultyContainer = document.createElement("div");
            difficultyContainer.style.display = "flex";
            difficultyContainer.style.marginBottom = "15px";
            difficultyContainer.style.gap = "10px";
            container.appendChild(difficultyContainer);
            ["easy", "medium", "hard"].forEach((level) => {
                const btn = document.createElement("button");
                btn.textContent =
                    level.charAt(0).toUpperCase() + level.slice(1);
                btn.style.padding = "5px 10px";
                btn.style.borderRadius = "5px";
                btn.style.border = "none";
                btn.style.backgroundColor =
                    level === difficulty ? "#ff9f43" : "#666";
                btn.style.color = "#fff";
                btn.style.cursor = "pointer";
                btn.style.fontWeight = level === difficulty ? "bold" : "normal";
                btn.style.transition = "all 0.2s ease";
                btn.addEventListener("mouseenter", () => {
                    btn.style.transform = "scale(1.05)";
                });
                btn.addEventListener("mouseleave", () => {
                    btn.style.transform = "scale(1)";
                });
                btn.addEventListener("click", () => {
                    if (difficulty !== level && !gameOver) {
                        return;
                    }
                    difficulty = level;
                    document.querySelectorAll("button").forEach((b) => {
                        if (b.textContent.toLowerCase().includes(level)) {
                            b.style.backgroundColor = "#ff9f43";
                            b.style.fontWeight = "bold";
                        } else {
                            b.style.backgroundColor = "#666";
                            b.style.fontWeight = "normal";
                        }
                    });
                    if (gameOver) {
                        resetGame();
                    }
                    self.playSound("click");
                });
                difficultyContainer.appendChild(btn);
            });
            const scoreDisplay = document.createElement("div");
            scoreDisplay.style.display = "flex";
            scoreDisplay.style.justifyContent = "space-around";
            scoreDisplay.style.width = "100%";
            scoreDisplay.style.marginBottom = "10px";
            scoreDisplay.style.padding = "8px";
            scoreDisplay.style.backgroundColor = "rgba(0,0,0,0.2)";
            scoreDisplay.style.borderRadius = "8px";
            container.appendChild(scoreDisplay);
            const playerScoreEl = document.createElement("div");
            playerScoreEl.innerHTML = `<span style="color:#ff4757">You:</span> <span style="font-weight:bold">${scores.player}</span>`;
            scoreDisplay.appendChild(playerScoreEl);
            const drawScoreEl = document.createElement("div");
            drawScoreEl.innerHTML = `<span style="color:#7bed9f">Draws:</span> <span style="font-weight:bold">${scores.draw}</span>`;
            scoreDisplay.appendChild(drawScoreEl);
            const aiScoreEl = document.createElement("div");
            aiScoreEl.innerHTML = `<span style="color:#f1c40f">AI:</span> <span style="font-weight:bold">${scores.ai}</span>`;
            scoreDisplay.appendChild(aiScoreEl);
            const statusDisplay = document.createElement("div");
            statusDisplay.style.fontSize = "1.2em";
            statusDisplay.style.marginBottom = "15px";
            statusDisplay.style.textAlign = "center";
            statusDisplay.style.minHeight = "25px";
            container.appendChild(statusDisplay);
            const gameCanvas = document.createElement("canvas");
            gameCanvas.width = 255; 
            gameCanvas.height = 255;
            gameCanvas.style.position = "absolute";
            gameCanvas.style.pointerEvents = "none"; 
            gameCanvas.style.zIndex = "5";
            const canvasCtx = gameCanvas.getContext("2d");
            const gameContainer = document.createElement("div");
            gameContainer.style.position = "relative";
            gameContainer.style.marginBottom = "15px";
            container.appendChild(gameContainer);
            const gridElement = document.createElement("div");
            gridElement.style.display = "grid";
            gridElement.style.gridTemplateColumns = "repeat(3, 80px)";
            gridElement.style.gridTemplateRows = "repeat(3, 80px)";
            gridElement.style.gap = "5px";
            gridElement.style.backgroundColor = "#555";
            gridElement.style.borderRadius = "5px";
            gridElement.style.padding = "5px";
            gridElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
            gameContainer.appendChild(gridElement);
            gameContainer.appendChild(gameCanvas);
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement("div");
                cell.dataset.index = i;
                cell.style.backgroundColor = "#ddd";
                cell.style.color = "#111";
                cell.style.display = "flex";
                cell.style.alignItems = "center";
                cell.style.justifyContent = "center";
                cell.style.fontSize = "40px";
                cell.style.fontWeight = "bold";
                cell.style.cursor = "pointer";
                cell.style.borderRadius = "4px";
                cell.style.transition =
                    "background-color 0.2s ease, transform 0.1s ease";
                cell.addEventListener("mouseenter", () => {
                    if (board[i] === 0 && !gameOver && currentPlayer === 1) {
                        cell.style.backgroundColor = "#f5f5f5";
                        cell.style.transform = "scale(1.03)";
                    }
                });
                cell.addEventListener("mouseleave", () => {
                    if (board[i] === 0) {
                        cell.style.backgroundColor = "#ddd";
                        cell.style.transform = "scale(1)";
                    }
                });
                cell.addEventListener("click", handleCellClick);
                gridElement.appendChild(cell);
            }
            const restartButton = document.createElement("button");
            restartButton.textContent = "New Game";
            restartButton.style.padding = "8px 20px";
            restartButton.style.borderRadius = "5px";
            restartButton.style.border = "none";
            restartButton.style.backgroundColor = "#2ecc71";
            restartButton.style.color = "#fff";
            restartButton.style.fontWeight = "bold";
            restartButton.style.cursor = "pointer";
            restartButton.style.marginTop = "5px";
            restartButton.style.transition = "all 0.2s ease";
            restartButton.addEventListener("mouseenter", () => {
                restartButton.style.transform = "scale(1.05)";
                restartButton.style.backgroundColor = "#27ae60";
            });
            restartButton.addEventListener("mouseleave", () => {
                restartButton.style.transform = "scale(1)";
                restartButton.style.backgroundColor = "#2ecc71";
            });
            restartButton.addEventListener("click", () => {
                resetGame();
                self.playSound("click");
            });
            container.appendChild(restartButton);
            function updateStatus(message) {
                statusDisplay.textContent = message;
            }
            function updateScoreDisplay() {
                playerScoreEl.innerHTML = `<span style="color:#ff4757">You:</span> <span style="font-weight:bold">${scores.player}</span>`;
                drawScoreEl.innerHTML = `<span style="color:#7bed9f">Draws:</span> <span style="font-weight:bold">${scores.draw}</span>`;
                aiScoreEl.innerHTML = `<span style="color:#f1c40f">AI:</span> <span style="font-weight:bold">${scores.ai}</span>`;
            }
            function resetGame() {
                for (let i = 0; i < 9; i++) {
                    board[i] = 0;
                    const cell = gridElement.children[i];
                    cell.textContent = "";
                    cell.style.backgroundColor = "#ddd";
                    cell.style.color = "#111";
                    cell.style.cursor = "pointer";
                    cell.style.transform = "scale(1)";
                }
                canvasCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                gameOver = false;
                winningLine = null;
                winAnimation = 0;
                if (lastWinner === 1) {
                    currentPlayer = 2;
                    updateStatus("AI's Turn...");
                    setTimeout(aiMove, 800);
                } else {
                    currentPlayer = 1;
                    updateStatus("Your Turn (X)");
                }
            }
            function handleCellClick(event) {
                if (gameOver || currentPlayer !== 1) return;
                const index = parseInt(event.target.dataset.index);
                if (board[index] === 0) {
                    makeMove(index, 1); 
                    if (!gameOver) {
                        currentPlayer = 2;
                        updateStatus("AI's Turn...");
                        setTimeout(aiMove, 800); 
                    }
                }
            }
            function makeMove(index, player) {
                if (board[index] !== 0 || gameOver) return false; 
                board[index] = player;
                const cellElement = gridElement.children[index];
                cellElement.style.transform = "scale(0.1)";
                setTimeout(() => {
                    cellElement.textContent =
                        player === 1 ? playerMark : aiMark;
                    cellElement.style.color =
                        player === 1 ? "#ff4757" : "#f1c40f";
                    cellElement.style.transform = "scale(1.1)";
                    setTimeout(() => {
                        cellElement.style.transform = "scale(1)";
                    }, 100);
                }, 50);
                cellElement.style.cursor = "default";
                self.playSound("click");
                const result = checkWinWithPattern(player);
                if (result.win) {
                    winningLine = result.pattern;
                    endGame(player);
                } else if (board.every((cell) => cell !== 0)) {
                    endGame(0); 
                }
                return true;
            }
            function checkWinWithPattern(player) {
                const winPatterns = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8], 
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8], 
                    [0, 4, 8],
                    [2, 4, 6], 
                ];
                for (const pattern of winPatterns) {
                    if (pattern.every((index) => board[index] === player)) {
                        return { win: true, pattern };
                    }
                }
                return { win: false, pattern: null };
            }
            function aiMove() {
                if (gameOver) return;
                let moveMade = false;
                let bestMove = -1;
                switch (difficulty) {
                    case "easy":
                        if (Math.random() < 0.5) {
                            const emptyIndices = board
                                .map((val, idx) => (val === 0 ? idx : -1))
                                .filter((idx) => idx !== -1);
                            if (emptyIndices.length > 0) {
                                bestMove =
                                    emptyIndices[
                                        Math.floor(
                                            Math.random() * emptyIndices.length
                                        )
                                    ];
                            }
                            break;
                        }
                    case "medium":
                        for (let i = 0; i < 9; i++) {
                            if (board[i] === 0) {
                                board[i] = 2; 
                                if (checkWinWithPattern(2).win) {
                                    bestMove = i;
                                    board[i] = 0; 
                                    break;
                                }
                                board[i] = 0; 
                            }
                        }
                        if (bestMove === -1) {
                            for (let i = 0; i < 9; i++) {
                                if (board[i] === 0) {
                                    board[i] = 1; 
                                    if (checkWinWithPattern(1).win) {
                                        bestMove = i; 
                                        board[i] = 0; 
                                        break;
                                    }
                                    board[i] = 0; 
                                }
                            }
                        }
                        if (bestMove === -1 && board[4] === 0) {
                            bestMove = 4;
                        }
                        if (bestMove === -1) {
                            const corners = [0, 2, 6, 8];
                            const availableCorners = corners.filter(
                                (idx) => board[idx] === 0
                            );
                            if (availableCorners.length > 0) {
                                bestMove =
                                    availableCorners[
                                        Math.floor(
                                            Math.random() *
                                                availableCorners.length
                                        )
                                    ];
                            }
                        }
                        if (bestMove === -1) {
                            const emptyIndices = board
                                .map((val, idx) => (val === 0 ? idx : -1))
                                .filter((idx) => idx !== -1);
                            if (emptyIndices.length > 0) {
                                bestMove =
                                    emptyIndices[
                                        Math.floor(
                                            Math.random() * emptyIndices.length
                                        )
                                    ];
                            }
                        }
                        break;
                    case "hard":
                        bestMove = findBestMove();
                        break;
                }
                if (bestMove !== -1) {
                    setTimeout(() => {
                        makeMove(bestMove, 2);
                        if (!gameOver) {
                            currentPlayer = 1;
                            updateStatus("Your Turn");
                        }
                    }, 200);
                    moveMade = true;
                }
                if (!moveMade && !gameOver) {
                    console.error(
                        "AI couldn't find a move, but game isn't over?"
                    );
                }
            }
            function minimax(
                board,
                depth,
                isMaximizing,
                alpha = -Infinity,
                beta = Infinity
            ) {
                if (checkWinWithPattern(2).win) return 10 - depth; 
                if (checkWinWithPattern(1).win) return depth - 10; 
                if (board.every((cell) => cell !== 0)) return 0; 
                if (isMaximizing) {
                    let maxEval = -Infinity;
                    for (let i = 0; i < 9; i++) {
                        if (board[i] === 0) {
                            board[i] = 2; 
                            const evalScore = minimax(
                                board,
                                depth + 1,
                                false,
                                alpha,
                                beta
                            );
                            board[i] = 0; 
                            maxEval = Math.max(maxEval, evalScore);
                            alpha = Math.max(alpha, evalScore);
                            if (beta <= alpha) break; 
                        }
                    }
                    return maxEval;
                } else {
                    let minEval = Infinity;
                    for (let i = 0; i < 9; i++) {
                        if (board[i] === 0) {
                            board[i] = 1; 
                            const evalScore = minimax(
                                board,
                                depth + 1,
                                true,
                                alpha,
                                beta
                            );
                            board[i] = 0; 
                            minEval = Math.min(minEval, evalScore);
                            beta = Math.min(beta, evalScore);
                            if (beta <= alpha) break; 
                        }
                    }
                    return minEval;
                }
            }
            function findBestMove() {
                let bestScore = -Infinity;
                let bestMove = -1;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === 0) {
                        board[i] = 2; 
                        const score = minimax(board, 0, false);
                        board[i] = 0; 
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = i;
                        }
                    }
                }
                return bestMove;
            }
            function drawWinningLine() {
                if (!winningLine) return;
                const cellSize = 80;
                const cellGap = 5;
                const cellOffset = 5; 
                function getCellCenter(index) {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const x =
                        col * (cellSize + cellGap) + cellSize / 2 + cellOffset;
                    const y =
                        row * (cellSize + cellGap) + cellSize / 2 + cellOffset;
                    return { x, y };
                }
                const start = getCellCenter(winningLine[0]);
                const end = getCellCenter(winningLine[2]);
                canvasCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                const lineColor =
                    board[winningLine[0]] === 1 ? "#ff4757" : "#f1c40f";
                const progress = Math.min(1, winAnimation / 40);
                const currentX = start.x + (end.x - start.x) * progress;
                const currentY = start.y + (end.y - start.y) * progress;
                canvasCtx.beginPath();
                canvasCtx.moveTo(start.x, start.y);
                canvasCtx.lineTo(currentX, currentY);
                canvasCtx.lineWidth = 8;
                canvasCtx.lineCap = "round";
                canvasCtx.strokeStyle = lineColor;
                canvasCtx.shadowColor = lineColor;
                canvasCtx.shadowBlur = 15;
                canvasCtx.stroke();
                if (progress === 1) {
                    const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 200);
                    canvasCtx.lineWidth = 8 * pulse;
                    canvasCtx.globalAlpha = 0.7 + 0.3 * pulse;
                    canvasCtx.stroke();
                    canvasCtx.globalAlpha = 1;
                }
                winningLine.forEach((index) => {
                    const cell = gridElement.children[index];
                    const pulse = 0.95 + 0.05 * Math.sin(Date.now() / 150);
                    cell.style.transform = `scale(${pulse})`;
                    cell.style.boxShadow = `0 0 10px ${lineColor}`;
                });
                if (winAnimation < 40) {
                    winAnimation++;
                }
                requestAnimationFrame(drawWinningLine);
            }
            function endGame(winner) {
                gameOver = true;
                gridElement
                    .querySelectorAll("div")
                    .forEach((cell) => (cell.style.cursor = "default"));
                if (winner === 1) {
                    updateStatus("You Win! 🏆");
                    scores.player++;
                    lastWinner = 1;
                    self.playSound("win");
                    Array.from({ length: 30 }).forEach(() => {
                        createConfetti();
                    });
                } else if (winner === 2) {
                    updateStatus("AI Wins! 🤖");
                    scores.ai++;
                    lastWinner = 2;
                    self.playSound("gameOver");
                } else {
                    updateStatus("It's a Draw! 🤝");
                    scores.draw++;
                    lastWinner = null;
                    self.playSound("hit");
                }
                updateScoreDisplay();
                if (winningLine) {
                    requestAnimationFrame(drawWinningLine);
                }
            }
            function createConfetti() {
                const confetti = document.createElement("div");
                const colors = [
                    "#ff4757",
                    "#2ecc71",
                    "#f1c40f",
                    "#3498db",
                    "#9b59b6",
                ];
                const size = 5 + Math.random() * 10;
                confetti.style.position = "absolute";
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                confetti.style.backgroundColor =
                    colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = "50%";
                confetti.style.zIndex = "10";
                confetti.style.pointerEvents = "none";
                confetti.style.opacity = "0.8";
                const startX = Math.random() * 250;
                const endX = startX + (Math.random() * 100 - 50);
                confetti.style.left = `${startX}px`;
                confetti.style.top = "0px";
                gameContainer.appendChild(confetti);
                const duration = 1000 + Math.random() * 2000;
                const startTime = Date.now();
                function animateConfetti() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const y = progress * 250;
                    const x = startX + (endX - startX) * progress;
                    const rotation = progress * 720;
                    confetti.style.transform = `translate(${
                        x - startX
                    }px, ${y}px) rotate(${rotation}deg)`;
                    confetti.style.opacity = (1 - progress).toString();
                    if (progress < 1) {
                        requestAnimationFrame(animateConfetti);
                    } else {
                        gameContainer.removeChild(confetti);
                    }
                }
                requestAnimationFrame(animateConfetti);
            }
            updateStatus("Your Turn (X)");
            return {
                cleanup: () => {
                    Array.from(gridElement.children).forEach((cell) => {
                        cell.removeEventListener("click", handleCellClick);
                    });
                    container.innerHTML = "";
                },
            };
        }
        initArkanoidGame(canvas) {
            console.warn("Arkanoid Lite using Breakout logic for now.");
            return this.initBreakoutGame(canvas); 
        }
        initPlatformerGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const gravity = 0.5;
            const player = {
                x: 50,
                y: canvas.height - 50,
                width: 30,
                height: 40,
                dx: 0,
                dy: 0,
                speed: 4,
                jumpPower: -10,
                onGround: false,
                color: "#3498db",
            };
            const platforms = [
                {
                    x: 0,
                    y: canvas.height - 20,
                    width: canvas.width,
                    height: 20,
                    color: "#555",
                }, 
                {
                    x: 150,
                    y: canvas.height - 80,
                    width: 100,
                    height: 15,
                    color: "#888",
                },
                {
                    x: 300,
                    y: canvas.height - 140,
                    width: 120,
                    height: 15,
                    color: "#888",
                },
                {
                    x: 500,
                    y: canvas.height - 100,
                    width: 80,
                    height: 15,
                    color: "#888",
                },
                {
                    x: canvas.width - 50,
                    y: canvas.height - 180,
                    width: 40,
                    height: 40,
                    color: "lime",
                    isGoal: true,
                }, 
            ];
            let keys = {};
            let gameOver = false;
            let gameWon = false;
            function drawPlayer() {
                ctx.fillStyle = player.color;
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
            function drawPlatforms() {
                platforms.forEach((p) => {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.width, p.height);
                });
            }
            function updatePlayer() {
                if (keys["ArrowLeft"] || keys["a"]) player.dx = -player.speed;
                else if (keys["ArrowRight"] || keys["d"])
                    player.dx = player.speed;
                else player.dx = 0;
                player.x += player.dx;
                if (!player.onGround) {
                    player.dy += gravity;
                }
                player.y += player.dy;
                player.onGround = false; 
                platforms.forEach((p) => {
                    if (
                        player.x < p.x + p.width &&
                        player.x + player.width > p.x &&
                        player.y < p.y + p.height &&
                        player.y + player.height > p.y
                    ) {
                        if (
                            player.dy >= 0 &&
                            player.y + player.height - player.dy <= p.y + 1
                        ) {
                            player.y = p.y - player.height;
                            player.dy = 0;
                            player.onGround = true;
                            if (p.isGoal) {
                                winGame();
                            }
                        } else if (
                            player.dy < 0 &&
                            player.y - player.dy >= p.y + p.height - 1
                        ) {
                            player.y = p.y + p.height;
                            player.dy = 0;
                        } else {
                            if (
                                player.dx > 0 &&
                                player.x + player.width - player.dx <= p.x + 1
                            ) {
                                player.x = p.x - player.width;
                            } else if (
                                player.dx < 0 &&
                                player.x - player.dx >= p.x + p.width - 1
                            ) {
                                player.x = p.x + p.width;
                            }
                            player.dx = 0; 
                        }
                    }
                });
                if (player.y > canvas.height) {
                    player.x = 50;
                    player.y = canvas.height - 50;
                    player.dy = 0; 
                    self.playSound("hit");
                }
            }
            function jump() {
                if (player.onGround) {
                    player.dy = player.jumpPower;
                    player.onGround = false;
                    self.playSound("jump");
                }
            }
            function winGame() {
                if (gameWon) return;
                gameWon = true;
                self.playSound("win");
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                ctx.fillStyle = "rgba(0, 200, 0, 0.7)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "30px var(--font-heading)";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(
                    "GOAL REACHED!",
                    canvas.width / 2,
                    canvas.height / 2
                );
            }
            function gameLoop() {
                if (gameOver || gameWon) return;
                updatePlayer();
                ctx.fillStyle = "#1a1a2e"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawPlatforms();
                drawPlayer();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                keys[e.key] = true;
                if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
                    jump();
                }
            };
            const handleKeyUp = (e) => {
                keys[e.key] = false;
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "platformer",
            });
            self.addManagedListener(document, "keyup", handleKeyUp, {
                gameId: "platformer",
            });
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    if (animationFrameId)
                        cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initShooterGame(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const player = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: 15,
                speed: 3,
                color: "#3498db",
                angle: 0,
            };
            const bullets = [];
            const targets = [];
            const targetRadius = 20;
            const bulletSpeed = 5;
            let score = 0;
            let mousePos = { x: player.x, y: player.y };
            let keys = {};
            function createTarget() {
                if (targets.length < 10) {
                    targets.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: targetRadius,
                        color: "#e74c3c",
                    });
                }
            }
            function drawPlayer() {
                ctx.save();
                ctx.translate(player.x, player.y);
                ctx.rotate(player.angle);
                ctx.fillStyle = player.color;
                ctx.beginPath();
                ctx.moveTo(0, -player.radius); 
                ctx.lineTo(-player.radius * 0.7, player.radius * 0.7); 
                ctx.lineTo(player.radius * 0.7, player.radius * 0.7); 
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            function drawBullets() {
                ctx.fillStyle = "yellow";
                bullets.forEach((b) => {
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            function drawTargets() {
                targets.forEach((t) => {
                    ctx.fillStyle = t.color;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.radius * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            function drawScore() {
                ctx.fillStyle = "#fff";
                ctx.font = "18px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, 25);
            }
            function updatePlayer() {
                let dx = 0;
                let dy = 0;
                if (keys["w"] || keys["ArrowUp"]) dy -= 1;
                if (keys["s"] || keys["ArrowDown"]) dy += 1;
                if (keys["a"] || keys["ArrowLeft"]) dx -= 1;
                if (keys["d"] || keys["ArrowRight"]) dx += 1;
                const len = Math.sqrt(dx * dx + dy * dy);
                if (len > 0) {
                    dx = (dx / len) * player.speed;
                    dy = (dy / len) * player.speed;
                }
                player.x += dx;
                player.y += dy;
                player.x = Math.max(
                    player.radius,
                    Math.min(canvas.width - player.radius, player.x)
                );
                player.y = Math.max(
                    player.radius,
                    Math.min(canvas.height - player.radius, player.y)
                );
                player.angle =
                    Math.atan2(mousePos.y - player.y, mousePos.x - player.x) +
                    Math.PI / 2; 
            }
            function updateBullets() {
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const b = bullets[i];
                    b.x += b.dx;
                    b.y += b.dy;
                    if (
                        b.x < 0 ||
                        b.x > canvas.width ||
                        b.y < 0 ||
                        b.y > canvas.height
                    ) {
                        bullets.splice(i, 1);
                        continue;
                    }
                    for (let j = targets.length - 1; j >= 0; j--) {
                        const t = targets[j];
                        const dist = Math.sqrt(
                            Math.pow(b.x - t.x, 2) + Math.pow(b.y - t.y, 2)
                        );
                        if (dist < t.radius) {
                            targets.splice(j, 1); 
                            bullets.splice(i, 1); 
                            score += 10;
                            self.updateScore(score);
                            self.playSound("explosion");
                            createTarget(); 
                            break; 
                        }
                    }
                }
            }
            function shoot() {
                const angle = Math.atan2(
                    mousePos.y - player.y,
                    mousePos.x - player.x
                );
                bullets.push({
                    x: player.x,
                    y: player.y,
                    dx: Math.cos(angle) * bulletSpeed,
                    dy: Math.sin(angle) * bulletSpeed,
                });
                self.playSound("shoot");
            }
            function gameLoop() {
                updatePlayer();
                updateBullets();
                ctx.fillStyle = "#1a1a2e";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawTargets();
                drawBullets();
                drawPlayer();
                drawScore();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            const handleKeyDown = (e) => {
                keys[e.key.toLowerCase()] = true;
            };
            const handleKeyUp = (e) => {
                keys[e.key.toLowerCase()] = false;
            };
            const handleMouseMove = (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                mousePos.x = (e.clientX - rect.left) * scaleX;
                mousePos.y = (e.clientY - rect.top) * scaleY;
            };
            const handleMouseDown = (e) => {
                if (e.button === 0) {
                    shoot();
                }
            };
            self.addManagedListener(document, "keydown", handleKeyDown, {
                gameId: "shooter",
            });
            self.addManagedListener(document, "keyup", handleKeyUp, {
                gameId: "shooter",
            });
            self.addManagedListener(canvas, "mousemove", handleMouseMove, {
                gameId: "shooter",
            });
            self.addManagedListener(canvas, "mousedown", handleMouseDown, {
                gameId: "shooter",
            });
            for (let i = 0; i < 5; i++) createTarget(); 
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    if (animationFrameId)
                        cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initMatch3Game(canvas) {
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");
            const self = this;
            let animationFrameId;
            const gridSize = 8;
            const gemSize = canvas.width / gridSize;
            const gemColors = [
                "#e74c3c",
                "#f1c40f",
                "#2ecc71",
                "#3498db",
                "#9b59b6",
                "#e67e22",
            ]; 
            let board = []; 
            let selectedGem = null; 
            let isSwapping = false;
            let score = 0;
            function createBoard() {
                board = [];
                for (let r = 0; r < gridSize; r++) {
                    board[r] = [];
                    for (let c = 0; c < gridSize; c++) {
                        board[r][c] = Math.floor(
                            Math.random() * gemColors.length
                        );
                    }
                }
            }
            function drawBoard() {
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        if (board[r][c] !== -1) {
                            ctx.fillStyle = gemColors[board[r][c]];
                            ctx.fillRect(
                                c * gemSize + 2,
                                r * gemSize + 2,
                                gemSize - 4,
                                gemSize - 4
                            ); 
                            if (
                                selectedGem &&
                                selectedGem.r === r &&
                                selectedGem.c === c
                            ) {
                                ctx.strokeStyle = "white";
                                ctx.lineWidth = 3;
                                ctx.strokeRect(
                                    c * gemSize + 1,
                                    r * gemSize + 1,
                                    gemSize - 2,
                                    gemSize - 2
                                );
                            }
                        }
                    }
                }
            }
            function drawScore() {
                ctx.fillStyle = "#fff";
                ctx.font = "18px var(--font-main)";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 10, 25);
            }
            function handleBoardClick(event) {
                if (isSwapping) return; 
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const clickX = (event.clientX - rect.left) * scaleX;
                const clickY = (event.clientY - rect.top) * scaleY;
                const c = Math.floor(clickX / gemSize);
                const r = Math.floor(clickY / gemSize);
                if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return; 
                if (!selectedGem) {
                    selectedGem = { r, c };
                    self.playSound("click");
                } else {
                    const dr = Math.abs(r - selectedGem.r);
                    const dc = Math.abs(c - selectedGem.c);
                    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                        swapGems(selectedGem.r, selectedGem.c, r, c);
                    } else {
                        selectedGem = null;
                        self.playSound("hit");
                    }
                }
            }
            function swapGems(r1, c1, r2, c2) {
                isSwapping = true;
                self.playSound("ui");
                [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
                selectedGem = null; 
                setTimeout(() => {
                    const matches1 = findMatchesAt(r1, c1);
                    const matches2 = findMatchesAt(r2, c2);
                    if (matches1.length > 0 || matches2.length > 0) {
                        processMatches(matches1.concat(matches2));
                    } else {
                        [board[r1][c1], board[r2][c2]] = [
                            board[r2][c2],
                            board[r1][c1],
                        ];
                        self.playSound("hit");
                        isSwapping = false;
                    }
                }, 200); 
            }
            function findMatches() {
                let matches = [];
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize - 2; c++) {
                        if (
                            board[r][c] !== -1 &&
                            board[r][c] === board[r][c + 1] &&
                            board[r][c] === board[r][c + 2]
                        ) {
                            matches.push(
                                { r, c },
                                { r, c: c + 1 },
                                { r, c: c + 2 }
                            );
                            let k = c + 3;
                            while (
                                k < gridSize &&
                                board[r][k] === board[r][c]
                            ) {
                                matches.push({ r, c: k });
                                k++;
                            }
                        }
                    }
                }
                for (let c = 0; c < gridSize; c++) {
                    for (let r = 0; r < gridSize - 2; r++) {
                        if (
                            board[r][c] !== -1 &&
                            board[r][c] === board[r + 1][c] &&
                            board[r][c] === board[r + 2][c]
                        ) {
                            matches.push(
                                { r, c },
                                { r: r + 1, c },
                                { r: r + 2, c }
                            );
                            let k = r + 3;
                            while (
                                k < gridSize &&
                                board[k][c] === board[r][c]
                            ) {
                                matches.push({ r: k, c });
                                k++;
                            }
                        }
                    }
                }
                const uniqueMatches = [];
                const seen = new Set();
                matches.forEach((m) => {
                    const key = `${m.r}-${m.c}`;
                    if (!seen.has(key)) {
                        uniqueMatches.push(m);
                        seen.add(key);
                    }
                });
                return uniqueMatches;
            }
            function findMatchesAt(r, c) {
                return findMatches(); 
            }
            function processMatches(matches) {
                if (matches.length === 0) {
                    isSwapping = false;
                    return;
                }
                self.playSound("point");
                score += matches.length * 10; 
                self.updateScore(score);
                matches.forEach(({ r, c }) => {
                    board[r][c] = -1;
                });
                setTimeout(dropGems, 200); 
            }
            function dropGems() {
                for (let c = 0; c < gridSize; c++) {
                    let emptyRow = gridSize - 1;
                    for (let r = gridSize - 1; r >= 0; r--) {
                        if (board[r][c] !== -1) {
                            if (r !== emptyRow) {
                                board[emptyRow][c] = board[r][c];
                                board[r][c] = -1; 
                            }
                            emptyRow--; 
                        }
                    }
                }
                setTimeout(refillBoard, 200); 
            }
            function refillBoard() {
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        if (board[r][c] === -1) {
                            board[r][c] = Math.floor(
                                Math.random() * gemColors.length
                            );
                        }
                    }
                }
                setTimeout(() => {
                    const newMatches = findMatches();
                    if (newMatches.length > 0) {
                        processMatches(newMatches); 
                    } else {
                        isSwapping = false; 
                    }
                }, 200);
            }
            function gameLoop() {
                ctx.fillStyle = "#1a1a2e";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawBoard();
                drawScore();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
            self.addManagedListener(canvas, "click", handleBoardClick, {
                gameId: "match3",
            });
            createBoard();
            setTimeout(() => {
                const initialMatches = findMatches();
                if (initialMatches.length > 0) {
                    processMatches(initialMatches);
                } else {
                    isSwapping = false; 
                }
            }, 100);
            animationFrameId = requestAnimationFrame(gameLoop);
            return {
                cleanup: () => {
                    if (animationFrameId)
                        cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                },
            };
        }
        initRhythmGame(canvas) {
            if (!canvas) {
                console.error(
                    'Error initializing game "rhythm":',
                    "Canvas not available"
                );
                return { cleanup: () => {} };
            }
            const ctx = canvas.getContext("2d");
            const state = {
                score: 0,
                combo: 0,
                maxCombo: 0,
                health: 100,
                paused: false,
                gameOver: false,
                startTime: Date.now(),
                elapsedTime: 0,
                lastFrameTime: 0,
                beatSpeed: 2.5, 
                difficulty: 1, 
                difficultyIncreaseInterval: 15000, 
                lastDifficultyIncrease: 0,
                perfectHitWindow: 30, 
                goodHitWindow: 60, 
                okayHitWindow: 100, 
                missDistance: 150, 
                laneWidth: 100, 
                trackHeight: 400, 
                targetY: 350, 
                notes: [], 
                effects: [], 
                particles: [], 
                hits: [], 
                lanes: [
                    {
                        key: "D",
                        color: "#ff5252",
                        x: 100,
                        activeFrame: 0,
                        keyCode: 68,
                    },
                    {
                        key: "F",
                        color: "#4caf50",
                        x: 200,
                        activeFrame: 0,
                        keyCode: 70,
                    },
                    {
                        key: "J",
                        color: "#2196f3",
                        x: 300,
                        activeFrame: 0,
                        keyCode: 74,
                    },
                    {
                        key: "K",
                        color: "#9c27b0",
                        x: 400,
                        activeFrame: 0,
                        keyCode: 75,
                    },
                ],
                activeKeys: new Set(), 
                sounds: {
                    perfect: null,
                    good: null,
                    okay: null,
                    miss: null,
                    combo: null,
                },
                backgroundMusic: null,
                lastSpawnTime: 0,
                spawnInterval: 1000, 
                minSpawnInterval: 400, 
                currentSong: {
                    bpm: 120,
                    beatsPerMeasure: 4,
                    highScore: this.getHighScore(),
                },
            };
            let audioCtx;
            try {
                audioCtx = this.getAudioContext();
            } catch (e) {
                console.log(
                    "Audio context not available, game will run without sound"
                );
            }
            const loadSounds = () => {
                if (!audioCtx || !this.soundEnabled) return;
                state.sounds.perfect = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.3
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                };
                state.sounds.good = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(660, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.2
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.2);
                };
                state.sounds.okay = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "square";
                    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.15
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.15);
                };
                state.sounds.miss = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.3
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                };
                state.sounds.combo = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(660, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(
                        880,
                        audioCtx.currentTime + 0.1
                    );
                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.2
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.2);
                };
                state.backgroundMusic = () => {
                    if (!state.backgroundMusicPlaying) {
                        state.backgroundMusicPlaying = true;
                        const playBeat = () => {
                            if (!state.backgroundMusicPlaying) return;
                            const osc = audioCtx.createOscillator();
                            const gain = audioCtx.createGain();
                            osc.connect(gain);
                            gain.connect(audioCtx.destination);
                            osc.type = "sine";
                            osc.frequency.setValueAtTime(
                                state.currentSong.bpm,
                                audioCtx.currentTime
                            );
                            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(
                                0.01,
                                audioCtx.currentTime + 0.1
                            );
                            osc.start();
                            osc.stop(audioCtx.currentTime + 0.1);
                            setTimeout(playBeat, 60000 / state.currentSong.bpm);
                        };
                        playBeat();
                    }
                };
            };
            const stopBackgroundMusic = () => {
                state.backgroundMusicPlaying = false;
            };
            const measureText = (text, fontSize, fontFamily = "Arial") => {
                ctx.font = `${fontSize}px ${fontFamily}`;
                return ctx.measureText(text).width;
            };
            const drawHeading = (text, x, y, fontSize = 24, color = "#fff") => {
                ctx.save();
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillText(text, x + 2, y + 2);
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
                ctx.restore();
            };
            const createNote = (laneIndex) => {
                if (laneIndex < 0 || laneIndex >= state.lanes.length) {
                    laneIndex = Math.floor(Math.random() * state.lanes.length);
                }
                const lane = state.lanes[laneIndex];
                state.notes.push({
                    x: lane.x,
                    y: 0, 
                    laneIndex,
                    width: 70,
                    height: 20,
                    color: lane.color,
                    hit: false,
                    missed: false,
                    alpha: 1,
                });
            };
            const spawnNote = (currentTime) => {
                if (state.paused || state.gameOver) return;
                if (currentTime - state.lastSpawnTime > state.spawnInterval) {
                    const laneIndex = Math.floor(
                        Math.random() * state.lanes.length
                    );
                    createNote(laneIndex);
                    state.lastSpawnTime = currentTime;
                    state.spawnInterval = Math.max(
                        state.minSpawnInterval,
                        1000 - state.difficulty * 50
                    );
                }
            };
            const createHitEffect = (x, y, rating) => {
                let color, text, points;
                switch (rating) {
                    case "perfect":
                        color = "#ffeb3b";
                        text = "PERFECT!";
                        points = 100;
                        break;
                    case "good":
                        color = "#4caf50";
                        text = "GOOD!";
                        points = 50;
                        break;
                    case "okay":
                        color = "#2196f3";
                        text = "OKAY";
                        points = 30;
                        break;
                    case "miss":
                        color = "#f44336";
                        text = "MISS";
                        points = 0;
                        break;
                    default:
                        color = "#ffffff";
                        text = rating;
                        points = 0;
                }
                state.hits.push({
                    x,
                    y,
                    text,
                    color,
                    alpha: 1,
                    scale: 1.5,
                    points,
                });
                if (rating !== "miss") {
                    for (let i = 0; i < 10; i++) {
                        state.particles.push({
                            x,
                            y,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5 - 2, 
                            size: Math.random() * 5 + 3,
                            color,
                            alpha: 1,
                        });
                    }
                }
                if (points > 0) {
                    state.score +=
                        points * (1 + Math.floor(state.combo / 10) * 0.1); 
                    state.combo++;
                    state.maxCombo = Math.max(state.maxCombo, state.combo);
                    if (
                        state.combo > 0 &&
                        state.combo % 10 === 0 &&
                        state.sounds.combo
                    ) {
                        state.sounds.combo();
                    }
                } else {
                    state.combo = 0;
                    state.health -= 5; 
                }
                this.updateScore(Math.floor(state.score));
                if (state.sounds[rating]) {
                    state.sounds[rating]();
                }
            };
            const checkNoteHit = (laneIndex) => {
                if (state.paused || state.gameOver) return;
                const relevantNotes = state.notes.filter(
                    (note) =>
                        note.laneIndex === laneIndex &&
                        !note.hit &&
                        !note.missed
                );
                if (relevantNotes.length === 0) return;
                relevantNotes.sort(
                    (a, b) =>
                        Math.abs(a.y - state.targetY) -
                        Math.abs(b.y - state.targetY)
                );
                const closestNote = relevantNotes[0];
                const distance = Math.abs(closestNote.y - state.targetY);
                if (distance <= state.perfectHitWindow) {
                    closestNote.hit = true;
                    createHitEffect(
                        state.lanes[laneIndex].x,
                        state.targetY,
                        "perfect"
                    );
                    state.lanes[laneIndex].activeFrame = 10;
                } else if (distance <= state.goodHitWindow) {
                    closestNote.hit = true;
                    createHitEffect(
                        state.lanes[laneIndex].x,
                        state.targetY,
                        "good"
                    );
                    state.lanes[laneIndex].activeFrame = 7;
                } else if (distance <= state.okayHitWindow) {
                    closestNote.hit = true;
                    createHitEffect(
                        state.lanes[laneIndex].x,
                        state.targetY,
                        "okay"
                    );
                    state.lanes[laneIndex].activeFrame = 5;
                }
            };
            const handleKeyDown = (e) => {
                if (state.paused || state.gameOver) return;
                const laneIndex = state.lanes.findIndex(
                    (lane) => lane.keyCode === e.keyCode
                );
                if (laneIndex !== -1 && !state.activeKeys.has(e.keyCode)) {
                    state.activeKeys.add(e.keyCode);
                    checkNoteHit(laneIndex);
                }
            };
            const handleKeyUp = (e) => {
                state.activeKeys.delete(e.keyCode);
            };
            const drawGame = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBackground();
                drawLanes();
                drawNotes();
                drawHitEffects();
                drawParticles();
                drawUI();
                if (state.gameOver) {
                    drawGameOver();
                }
            };
            const drawBackground = () => {
                const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    canvas.height
                );
                gradient.addColorStop(0, "#1a1a2e");
                gradient.addColorStop(1, "#16213e");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 1;
                for (let y = 0; y < canvas.height; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
                for (let i = 0; i < state.lanes.length + 1; i++) {
                    const x = i * state.laneWidth;
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                ctx.restore();
                drawTimingIndicator();
            };
            const drawTimingIndicator = () => {
                const beatInterval = 60000 / state.currentSong.bpm;
                const beatProgress =
                    (state.elapsedTime % beatInterval) / beatInterval;
                const baseSize = 5;
                const pulseSize = Math.sin(beatProgress * Math.PI * 2) * 3;
                const size = baseSize + Math.max(0, pulseSize);
                ctx.save();
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.beginPath();
                ctx.arc(
                    canvas.width / 2,
                    canvas.height - 20,
                    size,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.restore();
            };
            const drawLanes = () => {
                state.lanes.forEach((lane, index) => {
                    const x = lane.x - state.laneWidth / 2;
                    ctx.save();
                    const gradient = ctx.createLinearGradient(
                        x,
                        0,
                        x,
                        canvas.height
                    );
                    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
                    gradient.addColorStop(
                        1,
                        `rgba(${hexToRgb(lane.color)}, 0.2)`
                    );
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, 0, state.laneWidth, canvas.height);
                    if (lane.activeFrame > 0) {
                        ctx.globalAlpha = lane.activeFrame / 10;
                        ctx.fillStyle = lane.color;
                        ctx.fillRect(x, 0, state.laneWidth, canvas.height);
                        lane.activeFrame--;
                    }
                    ctx.restore();
                    drawKeyIndicator(lane, index);
                });
                ctx.save();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, state.targetY);
                ctx.lineTo(canvas.width, state.targetY);
                ctx.stroke();
                ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();
            };
            const drawKeyIndicator = (lane, index) => {
                const x = lane.x;
                const y = canvas.height - 50;
                const width = 40;
                const height = 40;
                const isActive = state.activeKeys.has(lane.keyCode);
                ctx.save();
                ctx.fillStyle = isActive
                    ? lane.color
                    : "rgba(255, 255, 255, 0.1)";
                ctx.strokeStyle = lane.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(x - width / 2, y - height / 2, width, height, 5);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = isActive ? "#fff" : lane.color;
                ctx.font = "bold 20px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(lane.key, x, y);
                ctx.restore();
            };
            const drawNotes = () => {
                state.notes.forEach((note) => {
                    if (note.hit || note.missed) {
                        note.alpha = Math.max(0, note.alpha - 0.1);
                    }
                    if (note.alpha <= 0) return;
                    ctx.save();
                    ctx.globalAlpha = note.alpha;
                    ctx.fillStyle = note.color;
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 2;
                    if (!note.hit && !note.missed) {
                        ctx.shadowColor = note.color;
                        ctx.shadowBlur = 10;
                    }
                    const x = note.x - note.width / 2;
                    const y = note.y - note.height / 2;
                    ctx.beginPath();
                    ctx.roundRect(x, y, note.width, note.height, 5);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                });
            };
            const drawHitEffects = () => {
                state.hits.forEach((hit) => {
                    ctx.save();
                    ctx.globalAlpha = hit.alpha;
                    ctx.fillStyle = hit.color;
                    ctx.font = `bold ${20 * hit.scale}px Arial`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.shadowColor = hit.color;
                    ctx.shadowBlur = 10;
                    ctx.fillText(hit.text, hit.x, hit.y);
                    if (hit.points > 0) {
                        ctx.font = `${12 * hit.scale}px Arial`;
                        ctx.fillText(
                            `+${hit.points}`,
                            hit.x,
                            hit.y + 25 * hit.scale
                        );
                    }
                    ctx.restore();
                    hit.y -= 1; 
                    hit.alpha -= 0.02; 
                    hit.scale -= 0.02; 
                });
                state.hits = state.hits.filter((hit) => hit.alpha > 0);
            };
            const drawParticles = () => {
                state.particles.forEach((particle) => {
                    ctx.save();
                    ctx.globalAlpha = particle.alpha;
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    ctx.restore();
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.1; 
                    particle.alpha -= 0.02; 
                });
                state.particles = state.particles.filter(
                    (particle) => particle.alpha > 0
                );
            };
            const drawUI = () => {
                drawHeading(
                    `Score: ${Math.floor(state.score)}`,
                    20,
                    30,
                    24,
                    "#fff"
                );
                const comboColor = state.combo >= 10 ? "#ffeb3b" : "#fff";
                drawHeading(`Combo: ${state.combo}`, 20, 60, 18, comboColor);
                drawHeading(`Max Combo: ${state.maxCombo}`, 20, 85, 16, "#bbb");
                drawHeading(
                    `Level: ${state.difficulty}`,
                    canvas.width - 100,
                    30,
                    18,
                    "#64b5f6"
                );
                drawHealthBar();
                const minutes = Math.floor(state.elapsedTime / 60000);
                const seconds = Math.floor((state.elapsedTime % 60000) / 1000);
                drawHeading(
                    `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`,
                    canvas.width - 100,
                    55,
                    16,
                    "#bbb"
                );
            };
            const drawHealthBar = () => {
                const barWidth = 150;
                const barHeight = 15;
                const x = canvas.width - barWidth - 20;
                const y = 80;
                ctx.save();
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 5);
                ctx.fill();
                ctx.stroke();
                let healthColor;
                if (state.health > 60) healthColor = "#4caf50";
                else if (state.health > 30) healthColor = "#ff9800";
                else healthColor = "#f44336";
                const gradient = ctx.createLinearGradient(
                    x,
                    y,
                    x + barWidth * (state.health / 100),
                    y
                );
                gradient.addColorStop(0, healthColor);
                gradient.addColorStop(1, adjustBrightness(healthColor, 1.3));
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(
                    x,
                    y,
                    barWidth * (state.health / 100),
                    barHeight,
                    5
                );
                ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.font = "bold 10px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    `${Math.floor(state.health)}%`,
                    x + barWidth / 2,
                    y + barHeight / 2
                );
                ctx.restore();
            };
            const drawGameOver = () => {
                ctx.save();
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#f44336";
                ctx.font = "bold 36px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    "GAME OVER",
                    canvas.width / 2,
                    canvas.height / 2 - 60
                );
                ctx.fillStyle = "#fff";
                ctx.font = "24px Arial";
                ctx.fillText(
                    `Final Score: ${Math.floor(state.score)}`,
                    canvas.width / 2,
                    canvas.height / 2 - 10
                );
                ctx.fillStyle = "#ffeb3b";
                ctx.font = "20px Arial";
                ctx.fillText(
                    `Max Combo: ${state.maxCombo}`,
                    canvas.width / 2,
                    canvas.height / 2 + 30
                );
                const highScore = state.currentSong.highScore;
                ctx.fillStyle = "#4caf50";
                ctx.font = "18px Arial";
                ctx.fillText(
                    `High Score: ${highScore}`,
                    canvas.width / 2,
                    canvas.height / 2 + 60
                );
                if (state.score > highScore) {
                    ctx.fillStyle = "#ffeb3b";
                    ctx.font = "bold 22px Arial";
                    ctx.fillText(
                        "NEW HIGH SCORE!",
                        canvas.width / 2,
                        canvas.height / 2 + 90
                    );
                }
                ctx.fillStyle = "#bbb";
                ctx.font = "16px Arial";
                ctx.fillText(
                    'Press "R" to restart',
                    canvas.width / 2,
                    canvas.height - 50
                );
                ctx.restore();
            };
            const updateGame = (timestamp) => {
                if (!state.lastFrameTime) {
                    state.lastFrameTime = timestamp;
                }
                const deltaTime = timestamp - state.lastFrameTime;
                state.lastFrameTime = timestamp;
                if (!state.paused && !state.gameOver) {
                    state.elapsedTime = Date.now() - state.startTime;
                    if (state.health <= 0) {
                        state.health = 0;
                        state.gameOver = true;
                        stopBackgroundMusic();
                    }
                    spawnNote(state.elapsedTime);
                    state.notes.forEach((note) => {
                        if (!note.hit && !note.missed) {
                            note.y += state.beatSpeed;
                            if (note.y > state.targetY + state.missDistance) {
                                note.missed = true;
                                createHitEffect(note.x, state.targetY, "miss");
                            }
                        }
                    });
                    state.notes = state.notes.filter((note) => note.alpha > 0);
                    if (
                        state.elapsedTime - state.lastDifficultyIncrease >
                        state.difficultyIncreaseInterval
                    ) {
                        state.difficulty++;
                        state.beatSpeed += 0.3; 
                        state.lastDifficultyIncrease = state.elapsedTime;
                        const levelUpText = `Level ${state.difficulty}!`;
                        state.hits.push({
                            x: canvas.width / 2,
                            y: canvas.height / 2,
                            text: levelUpText,
                            color: "#64b5f6",
                            alpha: 1,
                            scale: 2.5,
                            points: 0,
                        });
                    }
                }
                drawGame();
                if (!state.destroyed) {
                    requestAnimFrame(updateGame);
                }
            };
            const init = () => {
                canvas.width = 500;
                canvas.height = 500;
                requestAnimFrame(updateGame);
                loadSounds();
                if (this.soundEnabled && state.backgroundMusic) {
                    state.backgroundMusic();
                }
                document.addEventListener("keydown", handleKeyDown);
                document.addEventListener("keyup", handleKeyUp);
                document.addEventListener("keydown", handleGameRestart);
                addTouchControls();
            };
            const handleGameRestart = (e) => {
                if (state.gameOver && (e.key === "r" || e.key === "R")) {
                    resetGame();
                }
            };
            const resetGame = () => {
                state.score = 0;
                state.combo = 0;
                state.health = 100;
                state.paused = false;
                state.gameOver = false;
                state.startTime = Date.now();
                state.elapsedTime = 0;
                state.lastFrameTime = 0;
                state.difficulty = 1;
                state.beatSpeed = 2.5;
                state.lastDifficultyIncrease = 0;
                state.notes = [];
                state.effects = [];
                state.particles = [];
                state.hits = [];
                state.lastSpawnTime = 0;
                state.spawnInterval = 1000;
                this.updateScore(0);
                if (this.soundEnabled && state.backgroundMusic) {
                    state.backgroundMusic();
                }
            };
            const addTouchControls = () => {
                const touchAreas = state.lanes.map((lane, index) => {
                    const area = document.createElement("div");
                    area.style.position = "absolute";
                    area.style.width = `${state.laneWidth}px`;
                    area.style.height = `${canvas.height}px`;
                    area.style.left = `${lane.x - state.laneWidth / 2}px`;
                    area.style.top = "0";
                    area.style.zIndex = "100";
                    area.style.cursor = "pointer";
                    area.addEventListener("touchstart", (e) => {
                        e.preventDefault();
                        checkNoteHit(index);
                        state.activeKeys.add(lane.keyCode);
                    });
                    area.addEventListener("touchend", (e) => {
                        e.preventDefault();
                        state.activeKeys.delete(lane.keyCode);
                    });
                    area.addEventListener("mousedown", () => {
                        checkNoteHit(index);
                        state.activeKeys.add(lane.keyCode);
                    });
                    area.addEventListener("mouseup", () => {
                        state.activeKeys.delete(lane.keyCode);
                    });
                    canvas.parentNode.appendChild(area);
                    return area;
                });
                return () => {
                    touchAreas.forEach((area) => {
                        if (area.parentNode) {
                            area.parentNode.removeChild(area);
                        }
                    });
                };
            };
            const adjustBrightness = (hex, factor) => {
                const rgb = hexToRgb(hex);
                const adjusted = [
                    Math.min(
                        255,
                        Math.floor(parseInt(rgb.split(",")[0]) * factor)
                    ),
                    Math.min(
                        255,
                        Math.floor(parseInt(rgb.split(",")[1]) * factor)
                    ),
                    Math.min(
                        255,
                        Math.floor(parseInt(rgb.split(",")[2]) * factor)
                    ),
                ];
                return `rgb(${adjusted.join(",")})`;
            };
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                    hex
                );
                return result
                    ? `${parseInt(result[1], 16)},${parseInt(
                          result[2],
                          16
                      )},${parseInt(result[3], 16)}`
                    : "255,255,255";
            };
            const pauseGame = () => {
                if (!state.gameOver) {
                    state.paused = true;
                    stopBackgroundMusic();
                }
            };
            const resumeGame = () => {
                if (!state.gameOver) {
                    state.paused = false;
                    state.startTime = Date.now() - state.elapsedTime; 
                    if (this.soundEnabled && state.backgroundMusic) {
                        state.backgroundMusic();
                    }
                }
            };
            init();
            return {
                pause: pauseGame,
                resume: resumeGame,
                restart: resetGame,
                cleanup: () => {
                    state.destroyed = true;
                    document.removeEventListener("keydown", handleKeyDown);
                    document.removeEventListener("keyup", handleKeyUp);
                    document.removeEventListener("keydown", handleGameRestart);
                    stopBackgroundMusic();
                },
            };
        }
        initDrawingGame(canvas) {
            if (!canvas) return { cleanup: () => {} };
            const ctx = canvas.getContext("2d");
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;
            ctx.strokeStyle = "#e74c3c";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            const startDrawing = (e) => {
                isDrawing = true;
                [lastX, lastY] = getMousePos(e);
            };
            const stopDrawing = () => (isDrawing = false);
            const draw = (e) => {
                if (!isDrawing) return;
                const [x, y] = getMousePos(e);
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                [lastX, lastY] = [x, y];
            };
            const getMousePos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
                const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
                return [
                    (clientX - rect.left) * scaleX,
                    (clientY - rect.top) * scaleY,
                ];
            };
            this.addManagedListener(canvas, "mousedown", startDrawing, {
                gameId: "drawing",
            });
            this.addManagedListener(canvas, "mouseup", stopDrawing, {
                gameId: "drawing",
            });
            this.addManagedListener(canvas, "mouseout", stopDrawing, {
                gameId: "drawing",
            });
            this.addManagedListener(canvas, "mousemove", draw, {
                gameId: "drawing",
            });
            this.addManagedListener(
                canvas,
                "touchstart",
                (e) => {
                    e.preventDefault();
                    startDrawing(e);
                },
                { gameId: "drawing", passive: false }
            );
            this.addManagedListener(
                canvas,
                "touchend",
                (e) => {
                    e.preventDefault();
                    stopDrawing();
                },
                { gameId: "drawing", passive: false }
            );
            this.addManagedListener(
                canvas,
                "touchmove",
                (e) => {
                    e.preventDefault();
                    draw(e);
                },
                { gameId: "drawing", passive: false }
            );
            return { cleanup: () => {} }; 
        }
        initPhysicsGame(canvas) {
            if (!canvas) {
                console.error(
                    'Error initializing game "physics":',
                    "Canvas not available"
                );
                return { cleanup: () => {} };
            }
            const ctx = canvas.getContext("2d");
            const state = {
                balls: [],
                obstacles: [],
                gravity: 0.25,
                friction: 0.99,
                bounce: 0.7,
                nextBallColor: 0,
                score: 0,
                isMouseDown: false,
                mouseX: 0,
                mouseY: 0,
                lastX: 0,
                lastY: 0,
                throwPower: 0,
                maxThrowPower: 15,
                isDragging: false,
                activeObstacle: null,
                dragOffsetX: 0,
                dragOffsetY: 0,
                specialEffectCountdown: 0,
                specialEffects: [], 
                paused: false,
                gameOver: false,
                ballCount: 0,
                maxBalls: 50,
                level: 1,
                ballsToNextLevel: 10,
                highScore: this.getHighScore(),
                showHelp: true,
                helpCountdown: 5000, 
                lastFrameTime: 0,
                fpsInterval: 1000 / 60, 
                showFPS: false,
                frameCount: 0,
                lastFpsUpdate: 0,
                currentFps: 0,
                powerUps: [], 
                powerUpChance: 0.05, 
                activePowerUps: {
                    antiGravity: 0, 
                    slowMotion: 0,
                    multiball: 0,
                    bigBalls: 0,
                    extraBounce: 0,
                    colorful: 0,
                },
                sounds: {
                    pop: null,
                    bounce: null,
                    levelUp: null,
                    powerUp: null, 
                },
                colorPalettes: [
                    [
                        "#f44336",
                        "#e91e63",
                        "#9c27b0",
                        "#673ab7",
                        "#3f51b5",
                        "#2196f3",
                        "#03a9f4",
                        "#00bcd4",
                        "#009688",
                        "#4caf50",
                    ],
                    [
                        "#ff9800",
                        "#ff5722",
                        "#795548",
                        "#607d8b",
                        "#f44336",
                        "#9c27b0",
                        "#2196f3",
                        "#4caf50",
                    ],
                    [
                        "#1abc9c",
                        "#2ecc71",
                        "#3498db",
                        "#9b59b6",
                        "#f1c40f",
                        "#e67e22",
                        "#e74c3c",
                        "#ecf0f1",
                    ],
                ],
                colorPalette: 0,
            };
            let audioCtx;
            try {
                audioCtx = this.getAudioContext();
            } catch (e) {
                console.log(
                    "Audio context not available, game will run without sound"
                );
            }
            const loadSounds = () => {
                if (!audioCtx || !this.soundEnabled) return;
                state.sounds.pop = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
                    osc.frequency.exponentialRampToValueAtTime(
                        783.99,
                        audioCtx.currentTime + 0.1
                    ); 
                    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.2
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.2);
                };
                state.sounds.bounce = (volume = 0.05) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); 
                    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.1
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.1);
                };
                state.sounds.levelUp = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "square";
                    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
                    osc.frequency.exponentialRampToValueAtTime(
                        783.99,
                        audioCtx.currentTime + 0.1
                    ); 
                    osc.frequency.exponentialRampToValueAtTime(
                        1046.5,
                        audioCtx.currentTime + 0.2
                    ); 
                    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.3
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                };
                state.sounds.powerUp = () => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(392.0, audioCtx.currentTime); 
                    osc.frequency.setValueAtTime(
                        493.88,
                        audioCtx.currentTime + 0.08
                    ); 
                    osc.frequency.setValueAtTime(
                        587.33,
                        audioCtx.currentTime + 0.16
                    ); 
                    osc.frequency.setValueAtTime(
                        783.99,
                        audioCtx.currentTime + 0.24
                    ); 
                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioCtx.currentTime + 0.4
                    );
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.4);
                };
            };
            class Ball {
                constructor(x, y, radius, vx = 0, vy = 0) {
                    this.x = x;
                    this.y = y;
                    this.radius =
                        radius || Math.random() * 20 + this.getMinRadius();
                    this.vx = vx;
                    this.vy = vy;
                    this.mass = Math.PI * this.radius * this.radius; 
                    this.colorIndex =
                        state.nextBallColor++ %
                        state.colorPalettes[state.colorPalette].length;
                    this.color =
                        state.colorPalettes[state.colorPalette][
                            this.colorIndex
                        ];
                    this.elasticity = 0.8 + Math.random() * 0.2; 
                    this.lifespan = 0; 
                    this.glowing = 0; 
                    this.trail = []; 
                    this.trailOpacity = 0.5;
                    this.trailLength = Math.floor(this.radius * 1.5); 
                    this.isGrabbed = false;
                    this.isHovered = false;
                }
                getMinRadius() {
                    return Math.max(5, 25 - state.level);
                }
                update() {
                    if (this.isGrabbed) return;
                    if (this.lifespan % 2 === 0) {
                        this.trail.push({ x: this.x, y: this.y });
                        if (this.trail.length > this.trailLength) {
                            this.trail.shift();
                        }
                    }
                    this.vy += state.gravity;
                    this.vx *= state.friction;
                    this.vy *= state.friction;
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x - this.radius < 0) {
                        this.x = this.radius;
                        this.vx = -this.vx * this.elasticity;
                        if (Math.abs(this.vx) > 0.5) playBounceSound(this.vx);
                    } else if (this.x + this.radius > canvas.width) {
                        this.x = canvas.width - this.radius;
                        this.vx = -this.vx * this.elasticity;
                        if (Math.abs(this.vx) > 0.5) playBounceSound(this.vx);
                    }
                    if (this.y - this.radius < 0) {
                        this.y = this.radius;
                        this.vy = -this.vy * this.elasticity;
                        if (Math.abs(this.vy) > 0.5) playBounceSound(this.vy);
                    } else if (this.y + this.radius > canvas.height) {
                        this.y = canvas.height - this.radius;
                        this.vy = -this.vy * this.elasticity;
                        if (Math.abs(this.vy) > 0.5) playBounceSound(this.vy);
                    }
                    if (this.glowing > 0) {
                        this.glowing -= 0.05;
                    }
                    this.lifespan++;
                }
                draw() {
                    if (this.trail.length > 1) {
                        ctx.save();
                        for (let i = 0; i < this.trail.length - 1; i++) {
                            const opacity =
                                (i / this.trail.length) * this.trailOpacity;
                            const currentPos = this.trail[i];
                            const nextPos = this.trail[i + 1];
                            ctx.strokeStyle = this.color;
                            ctx.globalAlpha = opacity;
                            ctx.lineWidth =
                                this.radius * 0.3 * (i / this.trail.length);
                            ctx.beginPath();
                            ctx.moveTo(currentPos.x, currentPos.y);
                            ctx.lineTo(nextPos.x, nextPos.y);
                            ctx.stroke();
                        }
                        ctx.restore();
                    }
                    ctx.save();
                    if (this.glowing > 0 || this.isHovered) {
                        const glowSize =
                            this.radius * (this.glowing > 0 ? 1.5 : 1.2);
                        const gradient = ctx.createRadialGradient(
                            this.x,
                            this.y,
                            this.radius * 0.5,
                            this.x,
                            this.y,
                            glowSize
                        );
                        gradient.addColorStop(0, this.color);
                        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                        ctx.globalAlpha = this.isHovered ? 0.3 : this.glowing;
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    const gradient = ctx.createRadialGradient(
                        this.x - this.radius * 0.3,
                        this.y - this.radius * 0.3,
                        this.radius * 0.1,
                        this.x,
                        this.y,
                        this.radius
                    );
                    gradient.addColorStop(0, "#fff");
                    gradient.addColorStop(0.3, this.color);
                    gradient.addColorStop(1, adjustColor(this.color, -30));
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    const highlightGradient = ctx.createRadialGradient(
                        this.x - this.radius * 0.5,
                        this.y - this.radius * 0.5,
                        1,
                        this.x,
                        this.y,
                        this.radius * 0.9
                    );
                    highlightGradient.addColorStop(
                        0,
                        "rgba(255, 255, 255, 0.8)"
                    );
                    highlightGradient.addColorStop(
                        0.5,
                        "rgba(255, 255, 255, 0.2)"
                    );
                    highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                    ctx.fillStyle = highlightGradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                contains(x, y) {
                    const distance = Math.sqrt(
                        (this.x - x) ** 2 + (this.y - y) ** 2
                    );
                    return distance <= this.radius;
                }
                applyForce(fx, fy) {
                    this.vx += fx / this.mass;
                    this.vy += fy / this.mass;
                }
                collideWith(other) {
                    const dx = other.x - this.x;
                    const dy = other.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.radius + other.radius) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const relVelocityX = other.vx - this.vx;
                        const relVelocityY = other.vy - this.vy;
                        const speedAlongNormal =
                            relVelocityX * nx + relVelocityY * ny;
                        if (speedAlongNormal > 0) return false;
                        const restitution = Math.min(
                            this.elasticity,
                            other.elasticity
                        );
                        const impulseScalar =
                            (-(1 + restitution) * speedAlongNormal) /
                            (1 / this.mass + 1 / other.mass);
                        const impulseX = impulseScalar * nx;
                        const impulseY = impulseScalar * ny;
                        this.vx -= impulseX / this.mass;
                        this.vy -= impulseY / this.mass;
                        other.vx += impulseX / other.mass;
                        other.vy += impulseY / other.mass;
                        const overlap =
                            (this.radius + other.radius - distance) / 2;
                        const correctionX = overlap * nx;
                        const correctionY = overlap * ny;
                        this.x -= correctionX;
                        this.y -= correctionY;
                        other.x += correctionX;
                        other.y += correctionY;
                        this.glowing = 1;
                        other.glowing = 1;
                        playBounceSound(speedAlongNormal);
                        return true;
                    }
                    return false;
                }
                repelFrom(other) {
                    const dx = this.x - other.x;
                    const dy = this.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 0 && distance < this.radius + other.radius) {
                        const force = 1 / distance;
                        this.vx += (dx / distance) * force;
                        this.vy += (dy / distance) * force;
                    }
                }
            }
            class Obstacle {
                constructor(x, y, width, height, type = "rectangle") {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.type = type; 
                    this.color = "#455a64";
                    this.elasticity = 0.5;
                    this.angle = 0; 
                    this.isDraggable = true;
                    this.isHovered = false;
                }
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    if (this.type === "rectangle") {
                        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                        const gradient = ctx.createLinearGradient(
                            -this.width / 2,
                            -this.height / 2,
                            this.width / 2,
                            this.height / 2
                        );
                        gradient.addColorStop(0, this.color);
                        gradient.addColorStop(1, adjustColor(this.color, -50));
                        ctx.fillStyle = gradient;
                        ctx.fillRect(
                            -this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height
                        );
                        ctx.strokeStyle = adjustColor(this.color, 50);
                        ctx.lineWidth = 2;
                        ctx.strokeRect(
                            -this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height
                        );
                        if (this.isHovered) {
                            ctx.strokeStyle = "#ffffff";
                            ctx.lineWidth = 2;
                            ctx.setLineDash([5, 5]);
                            ctx.strokeRect(
                                -this.width / 2 - 2,
                                -this.height / 2 - 2,
                                this.width + 4,
                                this.height + 4
                            );
                        }
                    } else if (this.type === "circle") {
                        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                        const gradient = ctx.createRadialGradient(
                            0,
                            0,
                            this.width / 4,
                            0,
                            0,
                            this.width / 2
                        );
                        gradient.addColorStop(0, adjustColor(this.color, 50));
                        gradient.addColorStop(1, this.color);
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                        ctx.fill();
                        if (this.isHovered) {
                            ctx.strokeStyle = "#ffffff";
                            ctx.lineWidth = 2;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.arc(0, 0, this.width / 2 + 2, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }
                    ctx.restore();
                }
                contains(x, y) {
                    const dx = x - this.x;
                    const dy = y - this.y;
                    const rotatedX =
                        dx * Math.cos(-this.angle) - dy * Math.sin(-this.angle);
                    const rotatedY =
                        dx * Math.sin(-this.angle) + dy * Math.cos(-this.angle);
                    if (this.type === "rectangle") {
                        return (
                            rotatedX >= -this.width / 2 &&
                            rotatedX <= this.width / 2 &&
                            rotatedY >= -this.height / 2 &&
                            rotatedY <= this.height / 2
                        );
                    } else if (this.type === "circle") {
                        const distance = Math.sqrt(
                            rotatedX * rotatedX + rotatedY * rotatedY
                        );
                        return distance <= this.width / 2;
                    }
                    return false;
                }
                collideWithBall(ball) {
                    if (this.type === "rectangle") {
                        const dx = ball.x - this.x;
                        const dy = ball.y - this.y;
                        const rotatedX =
                            dx * Math.cos(-this.angle) -
                            dy * Math.sin(-this.angle);
                        const rotatedY =
                            dx * Math.sin(-this.angle) +
                            dy * Math.cos(-this.angle);
                        const closestX = Math.max(
                            -this.width / 2,
                            Math.min(this.width / 2, rotatedX)
                        );
                        const closestY = Math.max(
                            -this.height / 2,
                            Math.min(this.height / 2, rotatedY)
                        );
                        const distanceX = rotatedX - closestX;
                        const distanceY = rotatedY - closestY;
                        const distanceSquared =
                            distanceX * distanceX + distanceY * distanceY;
                        if (distanceSquared < ball.radius * ball.radius) {
                            const distance = Math.sqrt(distanceSquared);
                            let normalX = distanceX / (distance || 1);
                            let normalY = distanceY / (distance || 1);
                            const worldNormalX =
                                normalX * Math.cos(this.angle) -
                                normalY * Math.sin(this.angle);
                            const worldNormalY =
                                normalX * Math.sin(this.angle) +
                                normalY * Math.cos(this.angle);
                            const relVelocityX = ball.vx;
                            const relVelocityY = ball.vy;
                            const speedAlongNormal =
                                relVelocityX * worldNormalX +
                                relVelocityY * worldNormalY;
                            if (speedAlongNormal > 0) return false;
                            const restitution = Math.min(
                                ball.elasticity,
                                this.elasticity
                            );
                            const impulse =
                                -(1 + restitution) * speedAlongNormal;
                            ball.vx += impulse * worldNormalX;
                            ball.vy += impulse * worldNormalY;
                            const penetration = ball.radius - distance;
                            ball.x += penetration * worldNormalX;
                            ball.y += penetration * worldNormalY;
                            ball.glowing = 1;
                            playBounceSound(speedAlongNormal);
                            return true;
                        }
                    } else if (this.type === "circle") {
                        const dx = ball.x - this.x;
                        const dy = ball.y - this.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < ball.radius + this.width / 2) {
                            const nx = dx / distance;
                            const ny = dy / distance;
                            const relVelocityX = ball.vx;
                            const relVelocityY = ball.vy;
                            const speedAlongNormal =
                                relVelocityX * nx + relVelocityY * ny;
                            if (speedAlongNormal > 0) return false;
                            const restitution = Math.min(
                                ball.elasticity,
                                this.elasticity
                            );
                            const impulseScalar =
                                -(1 + restitution) * speedAlongNormal;
                            ball.vx += impulseScalar * nx;
                            ball.vy += impulseScalar * ny;
                            const overlap =
                                ball.radius + this.width / 2 - distance;
                            ball.x += overlap * nx;
                            ball.y += overlap * ny;
                            ball.glowing = 1;
                            playBounceSound(speedAlongNormal);
                            return true;
                        }
                    }
                    return false;
                }
            }
            class PowerUp {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.radius = 15;
                    this.vy = -1; 
                    this.vx = (Math.random() - 0.5) * 0.5; 
                    this.rotation = 0;
                    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
                    this.pulseSize = 0;
                    this.pulseDirection = 1;
                    this.age = 0;
                    this.maxAge = 500; 
                    const types = [
                        "antiGravity",
                        "slowMotion",
                        "multiball",
                        "bigBalls",
                        "extraBounce",
                        "colorful",
                    ];
                    this.type = types[Math.floor(Math.random() * types.length)];
                    switch (this.type) {
                        case "antiGravity":
                            this.color = "#9c27b0"; 
                            this.icon = "↑";
                            this.duration = 300; 
                            break;
                        case "slowMotion":
                            this.color = "#2196f3"; 
                            this.icon = "⏱";
                            this.duration = 240;
                            break;
                        case "multiball":
                            this.color = "#f44336"; 
                            this.icon = "⊕";
                            this.duration = 1; 
                            break;
                        case "bigBalls":
                            this.color = "#ff9800"; 
                            this.icon = "⊙";
                            this.duration = 180;
                            break;
                        case "extraBounce":
                            this.color = "#4caf50"; 
                            this.icon = "⇅";
                            this.duration = 200;
                            break;
                        case "colorful":
                            this.color = "#e91e63"; 
                            this.icon = "⚡";
                            this.duration = 150;
                            break;
                    }
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx += (Math.random() - 0.5) * 0.2;
                    this.vx *= 0.98;
                    this.rotation += this.rotationSpeed;
                    this.pulseSize += 0.03 * this.pulseDirection;
                    if (this.pulseSize > 1) {
                        this.pulseSize = 1;
                        this.pulseDirection = -1;
                    } else if (this.pulseSize < 0) {
                        this.pulseSize = 0;
                        this.pulseDirection = 1;
                    }
                    if (this.x - this.radius < 0) {
                        this.x = this.radius;
                        this.vx = Math.abs(this.vx);
                    } else if (this.x + this.radius > canvas.width) {
                        this.x = canvas.width - this.radius;
                        this.vx = -Math.abs(this.vx);
                    }
                    this.age++;
                    return this.age < this.maxAge;
                }
                draw() {
                    ctx.save();
                    const glowRadius =
                        this.radius * (1.5 + this.pulseSize * 0.5);
                    const gradient = ctx.createRadialGradient(
                        this.x,
                        this.y,
                        this.radius * 0.5,
                        this.x,
                        this.y,
                        glowRadius
                    );
                    gradient.addColorStop(0, this.color);
                    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                    ctx.globalAlpha = 0.6 - (this.age / this.maxAge) * 0.3;
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    const circleGradient = ctx.createRadialGradient(
                        this.x - this.radius * 0.3,
                        this.y - this.radius * 0.3,
                        this.radius * 0.1,
                        this.x,
                        this.y,
                        this.radius
                    );
                    circleGradient.addColorStop(0, "#ffffff");
                    circleGradient.addColorStop(0.4, this.color);
                    circleGradient.addColorStop(
                        1,
                        adjustColor(this.color, -30)
                    );
                    ctx.fillStyle = circleGradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 14px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(this.icon, 0, 0);
                    ctx.restore();
                }
                contains(x, y) {
                    const distance = Math.sqrt(
                        (this.x - x) ** 2 + (this.y - y) ** 2
                    );
                    return distance <= this.radius;
                }
                activate() {
                    state.activePowerUps[this.type] = this.duration;
                    state.specialEffects.push(
                        new SpecialEffect(this.x, this.y, "powerup")
                    );
                    if (state.sounds.powerUp) {
                        state.sounds.powerUp();
                    }
                    switch (this.type) {
                        case "multiball":
                            for (let i = 0; i < 3; i++) {
                                const angle = Math.random() * Math.PI * 2;
                                const speed = 2 + Math.random() * 3;
                                createBall(
                                    this.x,
                                    this.y,
                                    null,
                                    Math.cos(angle) * speed,
                                    Math.sin(angle) * speed
                                );
                            }
                            break;
                        case "antiGravity":
                            state.balls.forEach((ball) => {
                                ball.vy -= 3;
                                ball.glowing = 1;
                            });
                            break;
                    }
                    state.score += 50;
                    updateScore();
                }
            }
            class SpecialEffect {
                constructor(x, y, type = "explosion") {
                    this.x = x;
                    this.y = y;
                    this.type = type;
                    this.radius = 1;
                    this.maxRadius = 100;
                    this.alpha = 1;
                    this.color = "#ffeb3b";
                    this.particles = [];
                    if (type === "explosion") {
                        const particleCount = 30;
                        for (let i = 0; i < particleCount; i++) {
                            const angle = (i / particleCount) * Math.PI * 2;
                            const speed = 1 + Math.random() * 3;
                            this.particles.push({
                                x: this.x,
                                y: this.y,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                radius: 2 + Math.random() * 3,
                                alpha: 1,
                                color: this.color,
                            });
                        }
                    }
                }
                update() {
                    if (this.type === "ripple") {
                        this.radius += 2;
                        this.alpha -= 0.02;
                    } else if (this.type === "explosion") {
                        for (let i = 0; i < this.particles.length; i++) {
                            const p = this.particles[i];
                            p.x += p.vx;
                            p.y += p.vy;
                            p.alpha -= 0.02;
                            p.radius *= 0.98;
                        }
                        this.particles = this.particles.filter(
                            (p) => p.alpha > 0
                        );
                        if (this.particles.length === 0) {
                            this.alpha = 0;
                        }
                    }
                }
                draw() {
                    ctx.save();
                    if (this.type === "ripple") {
                        ctx.strokeStyle = this.color;
                        ctx.globalAlpha = this.alpha;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                        ctx.stroke();
                    } else if (this.type === "explosion") {
                        for (let i = 0; i < this.particles.length; i++) {
                            const p = this.particles[i];
                            ctx.globalAlpha = p.alpha;
                            ctx.fillStyle = p.color;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    ctx.restore();
                }
                isFinished() {
                    return this.alpha <= 0;
                }
            }
            function adjustColor(color, amount) {
                if (color.startsWith("#")) {
                    let hex = color.slice(1);
                    let r = parseInt(hex.slice(0, 2), 16);
                    let g = parseInt(hex.slice(2, 4), 16);
                    let b = parseInt(hex.slice(4, 6), 16);
                    r = Math.max(0, Math.min(255, r + amount));
                    g = Math.max(0, Math.min(255, g + amount));
                    b = Math.max(0, Math.min(255, b + amount));
                    return `#${r.toString(16).padStart(2, "0")}${g
                        .toString(16)
                        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
                }
                return color;
            }
            function playBounceSound(velocity) {
                if (state.sounds.bounce && Math.abs(velocity) > 1) {
                    const volume = Math.min(0.2, Math.abs(velocity) / 20);
                    state.sounds.bounce(volume);
                }
            }
            function createBall(x, y, radius, vx = 0, vy = 0) {
                if (state.balls.length >= state.maxBalls) {
                    state.balls.shift();
                }
                const ball = new Ball(x, y, radius, vx, vy);
                state.balls.push(ball);
                state.ballCount++;
                if (state.ballCount >= state.ballsToNextLevel) {
                    levelUp();
                }
                state.score += 10 + state.level * 5;
                updateScore();
                if (state.sounds.pop) {
                    state.sounds.pop();
                }
                state.specialEffects.push(new SpecialEffect(x, y, "ripple"));
                return ball;
            }
            function createInitialObstacles() {
                state.obstacles.push(
                    new Obstacle(
                        canvas.width / 2,
                        canvas.height / 2,
                        200,
                        20,
                        "rectangle"
                    )
                );
                state.obstacles.push(
                    new Obstacle(
                        canvas.width / 4,
                        canvas.height / 3,
                        60,
                        60,
                        "circle"
                    )
                );
                const rightPlatform = new Obstacle(
                    (canvas.width * 3) / 4,
                    canvas.height / 3,
                    150,
                    20,
                    "rectangle"
                );
                rightPlatform.angle = Math.PI / 6; 
                state.obstacles.push(rightPlatform);
            }
            function levelUp() {
                state.level++;
                state.ballsToNextLevel += 5; 
                state.gravity += 0.05; 
                const effect = new SpecialEffect(
                    canvas.width / 2,
                    canvas.height / 2,
                    "explosion"
                );
                effect.color =
                    state.colorPalettes[state.colorPalette][
                        Math.floor(
                            Math.random() *
                                state.colorPalettes[state.colorPalette].length
                        )
                    ];
                state.specialEffects.push(effect);
                if (state.sounds.levelUp) {
                    state.sounds.levelUp();
                }
                if (state.level % 3 === 0) {
                    state.colorPalette =
                        (state.colorPalette + 1) % state.colorPalettes.length;
                }
            }
            function updateScore() {
                this.updateScore(state.score);
                if (state.score > state.highScore) {
                    state.highScore = state.score;
                }
            }
            function drawBackground() {
                const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    canvas.height
                );
                gradient.addColorStop(0, "#2c3e50");
                gradient.addColorStop(1, "#1a1a2a");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 1;
                for (let x = 0; x < canvas.width; x += 50) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                for (let y = 0; y < canvas.height; y += 50) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
                ctx.restore();
            }
            function drawUI() {
                ctx.save();
                ctx.font = "bold 20px Arial";
                ctx.fillStyle = "#fff";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${state.score}`, 15, 30);
                ctx.font = "16px Arial";
                ctx.fillStyle = "#aaa";
                ctx.fillText(`High Score: ${state.highScore}`, 15, 55);
                ctx.fillStyle = "#64b5f6";
                ctx.font = "bold 18px Arial";
                ctx.fillText(`Level: ${state.level}`, 15, 80);
                ctx.fillStyle = "#4caf50";
                ctx.font = "16px Arial";
                ctx.fillText(
                    `Balls: ${state.balls.length}/${state.maxBalls}`,
                    15,
                    105
                );
                ctx.fillStyle = "#aaa";
                ctx.fillText(
                    `Next Level: ${state.ballCount}/${state.ballsToNextLevel}`,
                    15,
                    130
                );
                let powerUpY = 155;
                for (const type in state.activePowerUps) {
                    if (state.activePowerUps[type] > 0) {
                        let color, name, icon;
                        switch (type) {
                            case "antiGravity":
                                color = "#9c27b0";
                                name = "Anti-Gravity";
                                icon = "↑";
                                break;
                            case "slowMotion":
                                color = "#2196f3";
                                name = "Slow Motion";
                                icon = "⏱";
                                break;
                            case "multiball":
                                color = "#f44336";
                                name = "Multi-Ball";
                                icon = "⊕";
                                break;
                            case "bigBalls":
                                color = "#ff9800";
                                name = "Big Balls";
                                icon = "⊙";
                                break;
                            case "extraBounce":
                                color = "#4caf50";
                                name = "Extra Bounce";
                                icon = "⇅";
                                break;
                            case "colorful":
                                color = "#e91e63";
                                name = "Color Shift";
                                icon = "⚡";
                                break;
                        }
                        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                        ctx.fillRect(15, powerUpY - 15, 170, 22);
                        ctx.font = "bold 16px Arial";
                        ctx.fillStyle = color;
                        ctx.fillText(icon, 25, powerUpY);
                        ctx.font = "14px Arial";
                        ctx.fillStyle = color;
                        ctx.fillText(name, 45, powerUpY);
                        const maxDuration =
                            type === "multiball"
                                ? 1
                                : type === "slowMotion"
                                ? 240
                                : type === "antiGravity"
                                ? 300
                                : type === "bigBalls"
                                ? 180
                                : type === "extraBounce"
                                ? 200
                                : 150;
                        const barWidth =
                            60 * (state.activePowerUps[type] / maxDuration);
                        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                        ctx.fillRect(120, powerUpY - 10, 60, 8);
                        ctx.fillStyle = color;
                        ctx.fillRect(120, powerUpY - 10, barWidth, 8);
                        powerUpY += 25;
                    }
                }
                if (state.showFPS) {
                    ctx.fillStyle = "#ffeb3b";
                    ctx.fillText(
                        `FPS: ${state.currentFps}`,
                        canvas.width - 100,
                        30
                    );
                }
                if (state.showHelp) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.fillRect(0, canvas.height - 140, canvas.width, 140);
                    ctx.font = "bold 18px Arial";
                    ctx.fillStyle = "#fff";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "Physics Playground Controls:",
                        canvas.width / 2,
                        canvas.height - 115
                    );
                    ctx.font = "16px Arial";
                    ctx.fillText(
                        "- Click and drag to create and throw balls",
                        canvas.width / 2,
                        canvas.height - 90
                    );
                    ctx.fillText(
                        "- Drag obstacles to reposition them",
                        canvas.width / 2,
                        canvas.height - 65
                    );
                    ctx.fillText(
                        "- Collect floating power-ups for special abilities",
                        canvas.width / 2,
                        canvas.height - 40
                    );
                    ctx.fillText(
                        "- Create collisions for more points!",
                        canvas.width / 2,
                        canvas.height - 15
                    );
                }
                if (state.isMouseDown && !state.isDragging) {
                    const powerPercent = Math.min(
                        1,
                        state.throwPower / state.maxThrowPower
                    );
                    const barWidth = 100;
                    const barHeight = 10;
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.fillRect(
                        state.mouseX - barWidth / 2,
                        state.mouseY - 30,
                        barWidth,
                        barHeight
                    );
                    let powerColor;
                    if (powerPercent < 0.3) powerColor = "#4caf50";
                    else if (powerPercent < 0.7) powerColor = "#ff9800";
                    else powerColor = "#f44336";
                    ctx.fillStyle = powerColor;
                    ctx.fillRect(
                        state.mouseX - barWidth / 2,
                        state.mouseY - 30,
                        barWidth * powerPercent,
                        barHeight
                    );
                    ctx.fillStyle = "#fff";
                    ctx.font = "12px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        `Power: ${Math.round(powerPercent * 100)}%`,
                        state.mouseX,
                        state.mouseY - 40
                    );
                    if (powerPercent > 0) {
                        const dx = state.mouseX - state.lastX;
                        const dy = state.mouseY - state.lastY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 0) {
                            const nx = -dx / distance;
                            const ny = -dy / distance;
                            const length = Math.min(150, powerPercent * 200);
                            ctx.strokeStyle = powerColor;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.moveTo(state.mouseX, state.mouseY);
                            ctx.lineTo(
                                state.mouseX + nx * length,
                                state.mouseY + ny * length
                            );
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    }
                }
                ctx.restore();
            }
            function update(timestamp) {
                if (!state.lastFrameTime) {
                    state.lastFrameTime = timestamp;
                    state.frameCount = 0;
                    state.lastFpsUpdate = timestamp;
                }
                const elapsed = timestamp - state.lastFrameTime;
                if (elapsed > state.fpsInterval) {
                    state.lastFrameTime =
                        timestamp - (elapsed % state.fpsInterval);
                    state.frameCount++;
                    if (timestamp - state.lastFpsUpdate >= 1000) {
                        state.currentFps = Math.round(
                            (state.frameCount * 1000) /
                                (timestamp - state.lastFpsUpdate)
                        );
                        state.frameCount = 0;
                        state.lastFpsUpdate = timestamp;
                    }
                    if (!state.paused) {
                        if (state.isMouseDown && !state.isDragging) {
                            state.throwPower = Math.min(
                                state.maxThrowPower,
                                state.throwPower + 0.2
                            );
                        }
                        if (state.showHelp && state.helpCountdown > 0) {
                            state.helpCountdown -= state.fpsInterval;
                            if (state.helpCountdown <= 0) {
                                state.showHelp = false;
                            }
                        }
                        for (let i = 0; i < state.balls.length; i++) {
                            state.balls[i].update();
                            for (let j = i + 1; j < state.balls.length; j++) {
                                const collision = state.balls[i].collideWith(
                                    state.balls[j]
                                );
                                if (collision) {
                                    state.score += 1;
                                    updateScore();
                                }
                            }
                            for (let j = 0; j < state.obstacles.length; j++) {
                                state.obstacles[j].collideWithBall(
                                    state.balls[i]
                                );
                            }
                        }
                        for (const type in state.activePowerUps) {
                            if (state.activePowerUps[type] > 0) {
                                state.activePowerUps[type]--;
                                switch (type) {
                                    case "antiGravity":
                                        state.balls.forEach((ball) => {
                                            ball.vy -= state.gravity * 1.5;
                                        });
                                        break;
                                    case "slowMotion":
                                        state.balls.forEach((ball) => {
                                            ball.vx *= 0.98;
                                            ball.vy *= 0.98;
                                        });
                                        break;
                                    case "extraBounce":
                                        state.balls.forEach((ball) => {
                                            if (ball.elasticity < 1.5) {
                                                ball.elasticity = 1.2;
                                            }
                                        });
                                        break;
                                    case "bigBalls":
                                        state.balls.forEach((ball) => {
                                            if (
                                                ball.radius <
                                                ball.getMinRadius() * 1.5
                                            ) {
                                                ball.radius =
                                                    ball.getMinRadius() * 1.5;
                                                ball.mass =
                                                    Math.PI *
                                                    ball.radius *
                                                    ball.radius;
                                            }
                                        });
                                        break;
                                    case "colorful":
                                        if (Math.random() < 0.05) {
                                            state.balls.forEach((ball) => {
                                                ball.colorIndex =
                                                    (ball.colorIndex + 1) %
                                                    state.colorPalettes[
                                                        state.colorPalette
                                                    ].length;
                                                ball.color =
                                                    state.colorPalettes[
                                                        state.colorPalette
                                                    ][ball.colorIndex];
                                                ball.glowing = 0.5;
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                        for (let i = 0; i < state.specialEffects.length; i++) {
                            state.specialEffects[i].update();
                        }
                        state.specialEffects = state.specialEffects.filter(
                            (effect) => !effect.isFinished()
                        );
                        state.powerUps = state.powerUps.filter((powerUp) => {
                            const active = powerUp.update();
                            for (let i = 0; i < state.balls.length; i++) {
                                const ball = state.balls[i];
                                const dx = powerUp.x - ball.x;
                                const dy = powerUp.y - ball.y;
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                if (distance < ball.radius + powerUp.radius) {
                                    powerUp.activate();
                                    return false; 
                                }
                            }
                            return active;
                        });
                        if (
                            Math.random() < 0.002 &&
                            state.powerUps.length < 3
                        ) {
                            const x = Math.random() * (canvas.width - 60) + 30;
                            const y = Math.random() * (canvas.height - 60) + 30;
                            state.powerUps.push(new PowerUp(x, y));
                        }
                        for (let i = 0; i < state.obstacles.length; i++) {
                            state.obstacles[i].isHovered = state.obstacles[
                                i
                            ].contains(state.mouseX, state.mouseY);
                        }
                        for (let i = 0; i < state.balls.length; i++) {
                            state.balls[i].isHovered = state.balls[i].contains(
                                state.mouseX,
                                state.mouseY
                            );
                        }
                    }
                }
                render();
                if (!state.destroyed) {
                    requestAnimFrame(update);
                }
            }
            function render() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBackground();
                for (let i = 0; i < state.obstacles.length; i++) {
                    state.obstacles[i].draw();
                }
                for (let i = 0; i < state.balls.length; i++) {
                    state.balls[i].draw();
                }
                for (let i = 0; i < state.specialEffects.length; i++) {
                    state.specialEffects[i].draw();
                }
                for (let i = 0; i < state.powerUps.length; i++) {
                    state.powerUps[i].draw();
                }
                drawUI();
            }
            function handleMouseDown(e) {
                e.preventDefault();
                if (state.paused) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                state.mouseX = x;
                state.mouseY = y;
                state.lastX = x;
                state.lastY = y;
                state.isMouseDown = true;
                state.throwPower = 0;
                for (let i = 0; i < state.obstacles.length; i++) {
                    if (
                        state.obstacles[i].contains(x, y) &&
                        state.obstacles[i].isDraggable
                    ) {
                        state.isDragging = true;
                        state.activeObstacle = state.obstacles[i];
                        state.dragOffsetX = x - state.obstacles[i].x;
                        state.dragOffsetY = y - state.obstacles[i].y;
                        return;
                    }
                }
                state.showHelp = false;
            }
            function handleMouseMove(e) {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                state.mouseX = x;
                state.mouseY = y;
                if (state.isDragging && state.activeObstacle) {
                    state.activeObstacle.x = x - state.dragOffsetX;
                    state.activeObstacle.y = y - state.dragOffsetY;
                    state.activeObstacle.x = Math.max(
                        state.activeObstacle.width / 2,
                        Math.min(
                            canvas.width - state.activeObstacle.width / 2,
                            state.activeObstacle.x
                        )
                    );
                    state.activeObstacle.y = Math.max(
                        state.activeObstacle.height / 2,
                        Math.min(
                            canvas.height - state.activeObstacle.height / 2,
                            state.activeObstacle.y
                        )
                    );
                }
            }
            function handleMouseUp(e) {
                e.preventDefault();
                if (state.isDragging) {
                    state.isDragging = false;
                    state.activeObstacle = null;
                } else if (state.isMouseDown) {
                    const dx = state.mouseX - state.lastX;
                    const dy = state.mouseY - state.lastY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 0) {
                        const nx = -dx / distance;
                        const ny = -dy / distance;
                        const power = state.throwPower;
                        createBall(
                            state.mouseX,
                            state.mouseY,
                            null, 
                            nx * power,
                            ny * power
                        );
                    } else {
                        createBall(state.mouseX, state.mouseY);
                    }
                }
                state.isMouseDown = false;
                state.throwPower = 0;
            }
            function handleTouchStart(e) {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                });
                handleMouseDown(mouseEvent);
            }
            function handleTouchMove(e) {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                });
                handleMouseMove(mouseEvent);
            }
            function handleTouchEnd(e) {
                e.preventDefault();
                const mouseEvent = new MouseEvent("mouseup", {});
                handleMouseUp(mouseEvent);
            }
            function init() {
                canvas.width = 500;
                canvas.height = 400;
                loadSounds();
                createInitialObstacles();
                canvas.addEventListener("mousedown", handleMouseDown);
                canvas.addEventListener("mousemove", handleMouseMove);
                canvas.addEventListener("mouseup", handleMouseUp);
                canvas.addEventListener("mouseleave", handleMouseUp);
                canvas.addEventListener("touchstart", handleTouchStart);
                canvas.addEventListener("touchmove", handleTouchMove);
                canvas.addEventListener("touchend", handleTouchEnd);
                state.highScore = this.getHighScore();
                requestAnimFrame(update);
            }
            function resetGame() {
                state.balls = [];
                state.score = 0;
                state.ballCount = 0;
                state.level = 1;
                state.ballsToNextLevel = 10;
                state.gravity = 0.25;
                state.specialEffects = [];
                state.powerUps = [];
                for (const type in state.activePowerUps) {
                    state.activePowerUps[type] = 0;
                }
                state.obstacles = [];
                createInitialObstacles();
                updateScore();
            }
            function addInitialBalls() {
                for (let i = 0; i < 5; i++) {
                    const x = Math.random() * (canvas.width - 40) + 20;
                    const y = Math.random() * (canvas.height - 40) + 20;
                    const vx = (Math.random() - 0.5) * 6;
                    const vy = (Math.random() - 0.5) * 6;
                    createBall(x, y, null, vx, vy);
                }
            }
            function pauseGame() {
                state.paused = true;
            }
            function resumeGame() {
                state.paused = false;
                state.lastFrameTime = 0; 
            }
            init();
            addInitialBalls();
            return {
                pause: pauseGame,
                resume: resumeGame,
                restart: resetGame,
                cleanup: () => {
                    state.destroyed = true;
                    canvas.removeEventListener("mousedown", handleMouseDown);
                    canvas.removeEventListener("mousemove", handleMouseMove);
                    canvas.removeEventListener("mouseup", handleMouseUp);
                    canvas.removeEventListener("mouseleave", handleMouseUp);
                    canvas.removeEventListener("touchstart", handleTouchStart);
                    canvas.removeEventListener("touchmove", handleTouchMove);
                    canvas.removeEventListener("touchend", handleTouchEnd);
                },
            };
        }
        initCardGame(container) {
            if (!container) return { cleanup: () => {} };
            const self = this;
            container.innerHTML = "";
            const gameContainer = document.createElement("div");
            gameContainer.className = "card-game-container";
            gameContainer.style.display = "flex";
            gameContainer.style.flexDirection = "column";
            gameContainer.style.alignItems = "center";
            gameContainer.style.justifyContent = "center";
            gameContainer.style.width = "100%";
            gameContainer.style.height = "100%";
            gameContainer.style.padding = "20px";
            gameContainer.style.boxSizing = "border-box";
            gameContainer.style.fontFamily = "var(--font-main)";
            gameContainer.style.color = "#fff";
            gameContainer.style.background =
                "radial-gradient(circle at center, #0a3f2a, #0c2432)";
            gameContainer.style.borderRadius = "8px";
            gameContainer.style.position = "relative";
            const title = document.createElement("h2");
            title.textContent = "Card Predictor";
            title.style.margin = "0 0 20px 0";
            title.style.color = "var(--primary-color)";
            title.style.textShadow = "0 0 10px rgba(255,255,255,0.2)";
            gameContainer.appendChild(title);
            const gameArea = document.createElement("div");
            gameArea.className = "card-game-area";
            gameArea.style.display = "flex";
            gameArea.style.flexDirection = "column";
            gameArea.style.alignItems = "center";
            gameArea.style.width = "100%";
            gameArea.style.maxWidth = "450px";
            gameArea.style.flex = "1";
            gameContainer.appendChild(gameArea);
            const cardArea = document.createElement("div");
            cardArea.className = "card-area";
            cardArea.style.display = "flex";
            cardArea.style.justifyContent = "center";
            cardArea.style.alignItems = "center";
            cardArea.style.gap = "20px";
            cardArea.style.minHeight = "180px";
            cardArea.style.width = "100%";
            cardArea.style.margin = "10px 0 30px";
            gameArea.appendChild(cardArea);
            const currentCardContainer = document.createElement("div");
            currentCardContainer.className = "card-container current";
            currentCardContainer.style.position = "relative";
            currentCardContainer.style.perspective = "1000px";
            const currentCard = document.createElement("div");
            currentCard.className = "card current-card";
            styleCard(currentCard);
            currentCardContainer.appendChild(currentCard);
            cardArea.appendChild(currentCardContainer);
            const nextCardContainer = document.createElement("div");
            nextCardContainer.className = "card-container next";
            nextCardContainer.style.position = "relative";
            nextCardContainer.style.perspective = "1000px";
            const nextCard = document.createElement("div");
            nextCard.className = "card next-card";
            styleCard(nextCard, true); 
            nextCardContainer.appendChild(nextCard);
            cardArea.appendChild(nextCardContainer);
            const controlsArea = document.createElement("div");
            controlsArea.className = "controls-area";
            controlsArea.style.display = "flex";
            controlsArea.style.flexDirection = "column";
            controlsArea.style.alignItems = "center";
            controlsArea.style.gap = "15px";
            controlsArea.style.width = "100%";
            gameArea.appendChild(controlsArea);
            const resultDisplay = document.createElement("div");
            resultDisplay.className = "result-display";
            resultDisplay.textContent =
                "Predict if the next card will be higher or lower!";
            resultDisplay.style.fontSize = "18px";
            resultDisplay.style.textAlign = "center";
            resultDisplay.style.marginBottom = "15px";
            resultDisplay.style.minHeight = "54px";
            resultDisplay.style.color = "#fff";
            resultDisplay.style.fontWeight = "bold";
            resultDisplay.style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
            controlsArea.appendChild(resultDisplay);
            const buttonRow = document.createElement("div");
            buttonRow.className = "button-row";
            buttonRow.style.display = "flex";
            buttonRow.style.gap = "15px";
            buttonRow.style.marginBottom = "20px";
            const higherBtn = document.createElement("button");
            higherBtn.textContent = "HIGHER";
            higherBtn.className = "prediction-btn higher";
            styleActionButton(higherBtn, "#2ecc71");
            const lowerBtn = document.createElement("button");
            lowerBtn.textContent = "LOWER";
            lowerBtn.className = "prediction-btn lower";
            styleActionButton(lowerBtn, "#e74c3c");
            buttonRow.appendChild(higherBtn);
            buttonRow.appendChild(lowerBtn);
            controlsArea.appendChild(buttonRow);
            const newGameBtn = document.createElement("button");
            newGameBtn.textContent = "NEW GAME";
            newGameBtn.className = "new-game-btn";
            styleActionButton(newGameBtn, "#3498db", true);
            newGameBtn.style.display = "none"; 
            controlsArea.appendChild(newGameBtn);
            const statsDisplay = document.createElement("div");
            statsDisplay.className = "stats-display";
            statsDisplay.style.display = "flex";
            statsDisplay.style.justifyContent = "space-between";
            statsDisplay.style.width = "100%";
            statsDisplay.style.marginTop = "15px";
            statsDisplay.style.padding = "10px";
            statsDisplay.style.borderRadius = "5px";
            statsDisplay.style.background = "rgba(0,0,0,0.3)";
            const streakDisplay = document.createElement("div");
            streakDisplay.textContent = "Streak: 0";
            streakDisplay.className = "streak";
            const scoreDisplay = document.createElement("div");
            scoreDisplay.textContent = "Score: 0";
            scoreDisplay.className = "score";
            const cardsLeftDisplay = document.createElement("div");
            cardsLeftDisplay.textContent = "Cards: 52";
            cardsLeftDisplay.className = "cards-left";
            statsDisplay.appendChild(streakDisplay);
            statsDisplay.appendChild(scoreDisplay);
            statsDisplay.appendChild(cardsLeftDisplay);
            controlsArea.appendChild(statsDisplay);
            addFloatingCards(gameContainer);
            container.appendChild(gameContainer);
            let deck = [];
            let currentCardValue = null;
            let nextCardValue = null;
            let score = 0;
            let streak = 0;
            let cardsLeft = 52;
            let gameOver = false;
            let predictionInProgress = false;
            initializeDeck();
            dealInitialCard();
            higherBtn.addEventListener("click", () => makeGuess("higher"));
            lowerBtn.addEventListener("click", () => makeGuess("lower"));
            newGameBtn.addEventListener("click", startNewGame);
            function initializeDeck() {
                deck = [];
                const suits = ["hearts", "diamonds", "clubs", "spades"];
                const values = [
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "J",
                    "Q",
                    "K",
                    "A",
                ];
                for (let suit of suits) {
                    for (let i = 0; i < values.length; i++) {
                        deck.push({
                            suit: suit,
                            value: values[i],
                            numericValue: i + 2, 
                            color:
                                suit === "hearts" || suit === "diamonds"
                                    ? "red"
                                    : "black",
                        });
                    }
                }
                shuffleDeck();
                cardsLeft = deck.length;
                updateStats();
            }
            function shuffleDeck() {
                for (let i = deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [deck[i], deck[j]] = [deck[j], deck[i]];
                }
            }
            function dealInitialCard() {
                if (deck.length === 0) {
                    endGame();
                    return;
                }
                currentCardValue = deck.pop();
                cardsLeft = deck.length;
                displayCard(currentCard, currentCardValue, false);
                updateStats();
                resultDisplay.textContent =
                    "Will the next card be higher or lower?";
                resultDisplay.style.color = "#fff";
            }
            function displayCard(cardElement, cardData, isCardBack = false) {
                if (isCardBack) {
                    cardElement.innerHTML = "";
                    cardElement.style.background = "#2c3e50";
                    cardElement.style.backgroundImage =
                        "repeating-linear-gradient(45deg, #34495e, #34495e 10px, #2c3e50 10px, #2c3e50 20px)";
                    const innerCircle = document.createElement("div");
                    innerCircle.style.position = "absolute";
                    innerCircle.style.top = "50%";
                    innerCircle.style.left = "50%";
                    innerCircle.style.transform = "translate(-50%, -50%)";
                    innerCircle.style.width = "60px";
                    innerCircle.style.height = "60px";
                    innerCircle.style.borderRadius = "50%";
                    innerCircle.style.background = "var(--primary-color)";
                    innerCircle.style.display = "flex";
                    innerCircle.style.justifyContent = "center";
                    innerCircle.style.alignItems = "center";
                    innerCircle.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
                    const cardIcon = document.createElement("i");
                    cardIcon.className = "fas fa-crown";
                    cardIcon.style.fontSize = "24px";
                    cardIcon.style.color = "#fff";
                    innerCircle.appendChild(cardIcon);
                    cardElement.appendChild(innerCircle);
                    return;
                }
                cardElement.innerHTML = "";
                cardElement.style.background = "#fff";
                cardElement.style.color = cardData.color;
                const valueTop = document.createElement("div");
                valueTop.className = "card-value top";
                valueTop.textContent = cardData.value;
                valueTop.style.position = "absolute";
                valueTop.style.top = "8px";
                valueTop.style.left = "8px";
                valueTop.style.fontSize = "28px";
                valueTop.style.fontWeight = "bold";
                const valueBottom = document.createElement("div");
                valueBottom.className = "card-value bottom";
                valueBottom.textContent = cardData.value;
                valueBottom.style.position = "absolute";
                valueBottom.style.bottom = "8px";
                valueBottom.style.right = "8px";
                valueBottom.style.fontSize = "28px";
                valueBottom.style.fontWeight = "bold";
                valueBottom.style.transform = "rotate(180deg)";
                const suitTop = document.createElement("div");
                suitTop.className = "card-suit top";
                suitTop.style.position = "absolute";
                suitTop.style.top = "38px";
                suitTop.style.left = "8px";
                suitTop.style.fontSize = "20px";
                const suitBottom = document.createElement("div");
                suitBottom.className = "card-suit bottom";
                suitBottom.style.position = "absolute";
                suitBottom.style.bottom = "38px";
                suitBottom.style.right = "8px";
                suitBottom.style.fontSize = "20px";
                suitBottom.style.transform = "rotate(180deg)";
                let suitIcon;
                switch (cardData.suit) {
                    case "hearts":
                        suitIcon = "♥";
                        break;
                    case "diamonds":
                        suitIcon = "♦";
                        break;
                    case "clubs":
                        suitIcon = "♣";
                        break;
                    case "spades":
                        suitIcon = "♠";
                        break;
                }
                suitTop.textContent = suitIcon;
                suitBottom.textContent = suitIcon;
                const centerDesign = document.createElement("div");
                centerDesign.className = "card-center";
                centerDesign.style.position = "absolute";
                centerDesign.style.top = "50%";
                centerDesign.style.left = "50%";
                centerDesign.style.transform = "translate(-50%, -50%)";
                centerDesign.style.fontSize = "60px";
                centerDesign.style.fontWeight = "bold";
                centerDesign.style.opacity = "0.8";
                centerDesign.textContent = suitIcon;
                cardElement.appendChild(valueTop);
                cardElement.appendChild(valueBottom);
                cardElement.appendChild(suitTop);
                cardElement.appendChild(suitBottom);
                cardElement.appendChild(centerDesign);
            }
            function makeGuess(prediction) {
                if (gameOver || predictionInProgress) return;
                predictionInProgress = true;
                higherBtn.disabled = true;
                lowerBtn.disabled = true;
                if (deck.length === 0) {
                    endGame();
                    return;
                }
                nextCardValue = deck.pop();
                cardsLeft = deck.length;
                flipCard(nextCard, () => {
                    displayCard(nextCard, nextCardValue, false);
                    const isHigher =
                        nextCardValue.numericValue >
                        currentCardValue.numericValue;
                    const isLower =
                        nextCardValue.numericValue <
                        currentCardValue.numericValue;
                    const isSame =
                        nextCardValue.numericValue ===
                        currentCardValue.numericValue;
                    let correct = false;
                    if (prediction === "higher" && isHigher) {
                        correct = true;
                    } else if (prediction === "lower" && isLower) {
                        correct = true;
                    }
                    if (isSame) {
                        resultDisplay.textContent =
                            "Same value! No points awarded.";
                        resultDisplay.style.color = "#f1c40f";
                        streak = 0;
                    } else if (correct) {
                        streak++;
                        score += 10 * streak; 
                        self.updateScore(score);
                        resultDisplay.textContent = `Correct! +${
                            10 * streak
                        } points`;
                        resultDisplay.style.color = "#2ecc71";
                        self.playSound("point");
                        addFloatingPoints(controlsArea, 10 * streak);
                    } else {
                        streak = 0;
                        resultDisplay.textContent = "Wrong! Try again.";
                        resultDisplay.style.color = "#e74c3c";
                        self.playSound("hit");
                    }
                    updateStats();
                    setTimeout(() => {
                        currentCard.style.transition =
                            "transform 0.5s ease, opacity 0.5s ease";
                        nextCard.style.transition =
                            "transform 0.5s ease, opacity 0.5s ease";
                        currentCard.style.transform =
                            "translateX(-120%) scale(0.8)";
                        currentCard.style.opacity = "0";
                        nextCard.style.transform = "translateX(-100%)";
                        setTimeout(() => {
                            currentCardValue = nextCardValue;
                            displayCard(currentCard, currentCardValue, false);
                            currentCard.style.transition = "none";
                            nextCard.style.transition = "none";
                            currentCard.style.transform =
                                "translateX(0) scale(1)";
                            currentCard.style.opacity = "1";
                            displayCard(nextCard, null, true);
                            nextCard.style.transform = "translateX(0)";
                            higherBtn.disabled = false;
                            lowerBtn.disabled = false;
                            predictionInProgress = false;
                            if (deck.length === 0) {
                                resultDisplay.textContent =
                                    "No more cards! Game over.";
                                displayGameOver();
                            }
                        }, 500);
                    }, 1500);
                });
            }
            function flipCard(cardElement, callback) {
                cardElement.style.transition = "transform 0.3s ease";
                cardElement.style.transform = "rotateY(90deg)";
                self.playSound("ui");
                setTimeout(() => {
                    if (callback) callback();
                    setTimeout(() => {
                        cardElement.style.transform = "rotateY(0deg)";
                    }, 50);
                }, 300);
            }
            function updateStats() {
                streakDisplay.textContent = `Streak: ${streak}`;
                scoreDisplay.textContent = `Score: ${score}`;
                cardsLeftDisplay.textContent = `Cards: ${cardsLeft}`;
                if (streak >= 3) {
                    streakDisplay.style.color = "#f39c12";
                    streakDisplay.style.fontWeight = "bold";
                } else {
                    streakDisplay.style.color = "#fff";
                    streakDisplay.style.fontWeight = "normal";
                }
                if (streak >= 5) {
                    gameContainer.style.boxShadow =
                        "0 0 20px var(--primary-color)";
                } else {
                    gameContainer.style.boxShadow = "none";
                }
            }
            function startNewGame() {
                score = 0;
                streak = 0;
                gameOver = false;
                resultDisplay.textContent =
                    "Will the next card be higher or lower?";
                resultDisplay.style.color = "#fff";
                newGameBtn.style.display = "none";
                higherBtn.style.display = "block";
                lowerBtn.style.display = "block";
                initializeDeck();
                dealInitialCard();
                displayCard(nextCard, null, true);
                higherBtn.disabled = false;
                lowerBtn.disabled = false;
                self.playSound("restart");
            }
            function endGame() {
                gameOver = true;
                displayGameOver();
            }
            function displayGameOver() {
                resultDisplay.textContent = `Game Over! Final Score: ${score}`;
                higherBtn.style.display = "none";
                lowerBtn.style.display = "none";
                newGameBtn.style.display = "block";
                self.playSound("gameOver");
                self.updateScore(score);
            }
            function addFloatingPoints(container, points) {
                const pointsElement = document.createElement("div");
                pointsElement.textContent = `+${points}`;
                pointsElement.style.position = "absolute";
                pointsElement.style.top = "50%";
                pointsElement.style.left = "50%";
                pointsElement.style.transform = "translate(-50%, -50%)";
                pointsElement.style.color = "#2ecc71";
                pointsElement.style.fontWeight = "bold";
                pointsElement.style.fontSize = "32px";
                pointsElement.style.pointerEvents = "none";
                pointsElement.style.zIndex = "100";
                pointsElement.style.opacity = "0";
                pointsElement.style.animation =
                    "floatPoints 1.5s ease-out forwards";
                container.appendChild(pointsElement);
                const style = document.createElement("style");
                style.textContent = `
                    @keyframes floatPoints {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
                        100% { opacity: 0; transform: translate(-50%, -200%) scale(1); }
                    }
                `;
                document.head.appendChild(style);
                setTimeout(() => {
                    pointsElement.remove();
                    style.remove();
                }, 1500);
            }
            function addFloatingCards(container) {
                const numCards = 5;
                const cards = [];
                const style = document.createElement("style");
                style.textContent = `
                    @keyframes floatingCard {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        50% { transform: translate(10px, -10px) rotate(5deg); }
                        100% { transform: translate(0, 0) rotate(0deg); }
                    }
                `;
                document.head.appendChild(style);
                for (let i = 0; i < numCards; i++) {
                    const card = document.createElement("div");
                    card.className = "floating-card";
                    styleCard(card, true, 40, 60); 
                    card.style.position = "absolute";
                    card.style.zIndex = "1";
                    card.style.opacity = "0.2";
                    const corner = i % 4;
                    switch (corner) {
                        case 0: 
                            card.style.top = "5%";
                            card.style.left = "5%";
                            break;
                        case 1: 
                            card.style.top = "10%";
                            card.style.right = "5%";
                            break;
                        case 2: 
                            card.style.bottom = "10%";
                            card.style.right = "5%";
                            break;
                        case 3: 
                            card.style.bottom = "5%";
                            card.style.left = "10%";
                            break;
                    }
                    card.style.transform = `rotate(${
                        Math.random() * 40 - 20
                    }deg)`;
                    card.style.animation = `floatingCard ${
                        3 + Math.random() * 2
                    }s ease-in-out infinite`;
                    card.style.animationDelay = `${Math.random() * 2}s`;
                    container.appendChild(card);
                    cards.push(card);
                }
                return () => {
                    cards.forEach((card) => card.remove());
                    style.remove();
                };
            }
            function styleCard(
                card,
                isCardBack = false,
                width = 120,
                height = 180
            ) {
                card.style.width = `${width}px`;
                card.style.height = `${height}px`;
                card.style.borderRadius = "10px";
                card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                card.style.position = "relative";
                card.style.overflow = "hidden";
                card.style.transition =
                    "transform 0.3s ease, box-shadow 0.3s ease";
                if (isCardBack) {
                    card.style.background = "#2c3e50";
                    card.style.backgroundImage =
                        "repeating-linear-gradient(45deg, #34495e, #34495e 10px, #2c3e50 10px, #2c3e50 20px)";
                } else {
                    card.style.background = "#fff";
                }
                card.style.border = "1px solid rgba(0,0,0,0.3)";
            }
            function styleActionButton(button, color, isLarge = false) {
                button.style.background = color;
                button.style.color = "#fff";
                button.style.fontWeight = "bold";
                button.style.border = "none";
                button.style.borderRadius = "6px";
                button.style.padding = isLarge ? "12px 24px" : "10px 20px";
                button.style.fontSize = isLarge ? "18px" : "16px";
                button.style.cursor = "pointer";
                button.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                button.style.transition = "all 0.2s ease";
                button.addEventListener("mouseenter", () => {
                    button.style.transform = "translateY(-2px)";
                    button.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                });
                button.addEventListener("mouseleave", () => {
                    button.style.transform = "translateY(0)";
                    button.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                });
                button.addEventListener("mousedown", () => {
                    button.style.transform = "translateY(1px)";
                    button.style.boxShadow = "0 2px 3px rgba(0,0,0,0.1)";
                });
                button.addEventListener("mouseup", () => {
                    button.style.transform = "translateY(-2px)";
                    button.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                });
                return button;
            }
            return {
                cleanup: () => {
                    higherBtn.removeEventListener("click", () =>
                        makeGuess("higher")
                    );
                    lowerBtn.removeEventListener("click", () =>
                        makeGuess("lower")
                    );
                    newGameBtn.removeEventListener("click", startNewGame);
                },
            };
        }
        initAdventureGame(container) {
            this.drawPlaceholder(
                container,
                "Text Adventure",
                "Type commands (Basic)"
            );
            return { cleanup: () => {} };
        }
        initSudokuGame(container) {
            if (!container) return { cleanup: () => {} };
            const self = this;
            container.innerHTML = "";
            const gameContainer = document.createElement("div");
            gameContainer.className = "sudoku-container";
            gameContainer.style.display = "flex";
            gameContainer.style.flexDirection = "column";
            gameContainer.style.alignItems = "center";
            gameContainer.style.width = "100%";
            gameContainer.style.height = "100%";
            gameContainer.style.padding = "10px";
            gameContainer.style.boxSizing = "border-box";
            gameContainer.style.fontFamily = "var(--font-main)";
            gameContainer.style.position = "relative";
            const title = document.createElement("h2");
            title.textContent = "Sudoku Mini";
            title.style.margin = "0 0 10px 0";
            title.style.color = "var(--primary-color)";
            gameContainer.appendChild(title);
            const controls = document.createElement("div");
            controls.className = "sudoku-controls";
            controls.style.display = "flex";
            controls.style.justifyContent = "center";
            controls.style.marginBottom = "15px";
            controls.style.gap = "10px";
            const newGameBtn = document.createElement("button");
            newGameBtn.textContent = "New Game";
            newGameBtn.className = "sudoku-button";
            styleButton(newGameBtn);
            const difficultySelect = document.createElement("select");
            difficultySelect.className = "sudoku-select";
            ["Easy", "Medium", "Hard"].forEach((level) => {
                const option = document.createElement("option");
                option.value = level.toLowerCase();
                option.textContent = level;
                difficultySelect.appendChild(option);
            });
            styleSelect(difficultySelect);
            const solveBtn = document.createElement("button");
            solveBtn.textContent = "Solve";
            solveBtn.className = "sudoku-button";
            styleButton(solveBtn);
            const hintBtn = document.createElement("button");
            hintBtn.textContent = "Hint";
            hintBtn.className = "sudoku-button";
            styleButton(hintBtn);
            controls.appendChild(newGameBtn);
            controls.appendChild(difficultySelect);
            controls.appendChild(solveBtn);
            controls.appendChild(hintBtn);
            gameContainer.appendChild(controls);
            const statusDisplay = document.createElement("div");
            statusDisplay.className = "game-status";
            statusDisplay.style.marginBottom = "10px";
            statusDisplay.style.color = "#fff";
            statusDisplay.style.fontWeight = "bold";
            statusDisplay.style.minHeight = "20px";
            gameContainer.appendChild(statusDisplay);
            const gridContainer = document.createElement("div");
            gridContainer.className = "sudoku-grid";
            gridContainer.style.display = "grid";
            gridContainer.style.gridTemplateColumns = "repeat(9, 1fr)";
            gridContainer.style.gridTemplateRows = "repeat(9, 1fr)";
            gridContainer.style.gap = "1px";
            gridContainer.style.width = "100%";
            gridContainer.style.maxWidth = "400px";
            gridContainer.style.aspectRatio = "1/1";
            gridContainer.style.margin = "0 auto";
            gridContainer.style.background = "#444";
            gridContainer.style.padding = "2px";
            gridContainer.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
            gridContainer.style.borderRadius = "4px";
            gameContainer.appendChild(gridContainer);
            const numberPad = document.createElement("div");
            numberPad.className = "number-pad";
            numberPad.style.display = "grid";
            numberPad.style.gridTemplateColumns = "repeat(5, 1fr)";
            numberPad.style.gap = "5px";
            numberPad.style.maxWidth = "300px";
            numberPad.style.margin = "15px auto 0";
            for (let i = 1; i <= 9; i++) {
                const numBtn = document.createElement("button");
                numBtn.textContent = i;
                numBtn.dataset.number = i;
                numBtn.className = "num-button";
                styleButton(numBtn, "30px", "30px");
                numberPad.appendChild(numBtn);
            }
            const eraseBtn = document.createElement("button");
            eraseBtn.textContent = "X";
            eraseBtn.dataset.number = 0;
            eraseBtn.className = "num-button erase";
            styleButton(eraseBtn, "30px", "30px");
            eraseBtn.style.background = "#e74c3c";
            numberPad.appendChild(eraseBtn);
            gameContainer.appendChild(numberPad);
            container.appendChild(gameContainer);
            let selectedCell = null;
            let board = [];
            let solution = [];
            let initialBoard = [];
            let difficulty = "medium";
            let mistakes = 0;
            let gameActive = true;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const cell = document.createElement("div");
                    cell.className = "sudoku-cell";
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.style.background = "#222";
                    cell.style.color = "#fff";
                    cell.style.display = "flex";
                    cell.style.alignItems = "center";
                    cell.style.justifyContent = "center";
                    cell.style.fontWeight = "bold";
                    cell.style.fontSize = "18px";
                    cell.style.cursor = "pointer";
                    cell.style.transition = "all 0.2s ease";
                    cell.style.userSelect = "none";
                    if (i % 3 === 0) cell.style.borderTop = "2px solid #777";
                    if (j % 3 === 0) cell.style.borderLeft = "2px solid #777";
                    if (i === 8) cell.style.borderBottom = "2px solid #777";
                    if (j === 8) cell.style.borderRight = "2px solid #777";
                    cell.addEventListener("click", () => {
                        if (!gameActive) return;
                        selectCell(cell);
                    });
                    gridContainer.appendChild(cell);
                }
            }
            newGameBtn.addEventListener("click", () => {
                if (gameActive) {
                    self.playSound("click");
                    generateNewGame(difficultySelect.value);
                }
            });
            solveBtn.addEventListener("click", () => {
                if (gameActive) {
                    self.playSound("ui");
                    solvePuzzle();
                }
            });
            hintBtn.addEventListener("click", () => {
                if (gameActive) {
                    self.playSound("ui");
                    giveHint();
                }
            });
            difficultySelect.addEventListener("change", () => {
                self.playSound("ui");
                difficulty = difficultySelect.value;
            });
            numberPad.addEventListener("click", (e) => {
                if (!gameActive || !selectedCell) return;
                const numBtn = e.target.closest(".num-button");
                if (!numBtn) return;
                self.playSound("click");
                const num = parseInt(numBtn.dataset.number);
                fillSelectedCell(num);
            });
            const keyDownHandler = (e) => {
                if (!gameActive || !selectedCell) return;
                if (e.key >= "1" && e.key <= "9") {
                    self.playSound("click");
                    fillSelectedCell(parseInt(e.key));
                } else if (
                    e.key === "Backspace" ||
                    e.key === "Delete" ||
                    e.key === "0"
                ) {
                    self.playSound("click");
                    fillSelectedCell(0); 
                } else if (
                    e.key === "ArrowUp" ||
                    e.key === "ArrowDown" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight"
                ) {
                    moveSelection(e.key);
                    e.preventDefault(); 
                }
            };
            document.addEventListener("keydown", keyDownHandler);
            function moveSelection(key) {
                if (!selectedCell) return;
                const currentRow = parseInt(selectedCell.dataset.row);
                const currentCol = parseInt(selectedCell.dataset.col);
                let newRow = currentRow;
                let newCol = currentCol;
                switch (key) {
                    case "ArrowUp":
                        newRow = Math.max(0, currentRow - 1);
                        break;
                    case "ArrowDown":
                        newRow = Math.min(8, currentRow + 1);
                        break;
                    case "ArrowLeft":
                        newCol = Math.max(0, currentCol - 1);
                        break;
                    case "ArrowRight":
                        newCol = Math.min(8, currentCol + 1);
                        break;
                }
                if (newRow !== currentRow || newCol !== currentCol) {
                    const newCell = gridContainer.querySelector(
                        `[data-row="${newRow}"][data-col="${newCol}"]`
                    );
                    if (newCell) {
                        self.playSound("ui");
                        selectCell(newCell);
                    }
                }
            }
            function selectCell(cell) {
                const cells = gridContainer.querySelectorAll(".sudoku-cell");
                cells.forEach((c) => {
                    c.style.background = "#222";
                    if (
                        cell.textContent &&
                        c.textContent === cell.textContent
                    ) {
                        c.style.background = "#2c3e50";
                    }
                    c.style.opacity = "1";
                });
                cell.style.background = "var(--primary-color)";
                cell.style.color = "#fff";
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                cells.forEach((c) => {
                    if (c.dataset.row === row || c.dataset.col === col) {
                        if (c !== cell) c.style.background = "#333";
                    }
                    const boxRow = Math.floor(row / 3);
                    const boxCol = Math.floor(col / 3);
                    if (
                        Math.floor(c.dataset.row / 3) === boxRow &&
                        Math.floor(c.dataset.col / 3) === boxCol
                    ) {
                        if (
                            c !== cell &&
                            c.style.background !== "var(--primary-color)"
                        ) {
                            c.style.background = "#333";
                        }
                    }
                });
                selectedCell = cell;
                self.playSound("ui");
            }
            function fillSelectedCell(num) {
                if (!selectedCell || !gameActive) return;
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                if (initialBoard[row][col] !== 0) {
                    self.playSound("hit");
                    selectedCell.style.animation = "shake 0.5s";
                    setTimeout(() => {
                        selectedCell.style.animation = "";
                    }, 500);
                    return;
                }
                if (num === 0) {
                    board[row][col] = 0;
                    selectedCell.textContent = "";
                    selectedCell.style.color = "#fff";
                } else {
                    board[row][col] = num;
                    selectedCell.textContent = num;
                    if (num === solution[row][col]) {
                        selectedCell.style.color = "#2ecc71";
                    } else {
                        selectedCell.style.color = "#e74c3c";
                        mistakes++;
                        updateStatus(`Mistakes: ${mistakes}`);
                        self.playSound("hit");
                    }
                }
                if (isBoardComplete()) {
                    gameActive = false;
                    self.playSound("win");
                    self.updateScore(1000 - mistakes * 50);
                    updateStatus("Puzzle solved! Well done!", "success");
                    addCelebration();
                }
            }
            function updateStatus(message, type = "info") {
                statusDisplay.textContent = message;
                statusDisplay.style.color =
                    type === "success"
                        ? "#2ecc71"
                        : type === "error"
                        ? "#e74c3c"
                        : "#fff";
            }
            function generateNewGame(difficulty) {
                mistakes = 0;
                gameActive = true;
                updateStatus("New game started!");
                solution = generateSolvedBoard();
                let removals;
                switch (difficulty) {
                    case "easy":
                        removals = 30;
                        break;
                    case "hard":
                        removals = 55;
                        break;
                    default:
                        removals = 40; 
                }
                board = JSON.parse(JSON.stringify(solution));
                initialBoard = JSON.parse(JSON.stringify(solution));
                let removed = 0;
                while (removed < removals) {
                    const row = Math.floor(Math.random() * 9);
                    const col = Math.floor(Math.random() * 9);
                    if (initialBoard[row][col] !== 0) {
                        initialBoard[row][col] = 0;
                        board[row][col] = 0;
                        removed++;
                    }
                }
                updateBoardUI();
            }
            function updateBoardUI() {
                const cells = gridContainer.querySelectorAll(".sudoku-cell");
                cells.forEach((cell) => {
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);
                    if (initialBoard[row][col] !== 0) {
                        cell.textContent = initialBoard[row][col];
                        cell.style.fontWeight = "bold";
                        cell.style.color = "#888"; 
                    } else {
                        cell.textContent =
                            board[row][col] === 0 ? "" : board[row][col];
                        cell.style.fontWeight = "normal";
                        cell.style.color = "#fff";
                    }
                    cell.style.background = "#222";
                });
                selectedCell = null;
            }
            function generateSolvedBoard() {
                const grid = Array(9)
                    .fill()
                    .map(() => Array(9).fill(0));
                solveSudoku(grid);
                return grid;
            }
            function solveSudoku(grid) {
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (grid[row][col] === 0) {
                            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                            shuffleArray(nums);
                            for (let i = 0; i < nums.length; i++) {
                                const num = nums[i];
                                if (isSafe(grid, row, col, num)) {
                                    grid[row][col] = num;
                                    if (solveSudoku(grid)) {
                                        return true;
                                    }
                                    grid[row][col] = 0;
                                }
                            }
                            return false; 
                        }
                    }
                }
                return true; 
            }
            function isSafe(grid, row, col, num) {
                for (let x = 0; x < 9; x++) {
                    if (grid[row][x] === num) return false;
                }
                for (let x = 0; x < 9; x++) {
                    if (grid[x][col] === num) return false;
                }
                const boxRow = Math.floor(row / 3) * 3;
                const boxCol = Math.floor(col / 3) * 3;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (grid[boxRow + i][boxCol + j] === num) return false;
                    }
                }
                return true; 
            }
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            function solvePuzzle() {
                board = JSON.parse(JSON.stringify(solution));
                updateBoardUI();
                gameActive = false;
                self.playSound("ui");
                updateStatus("Puzzle solved automatically");
                const cells = gridContainer.querySelectorAll(".sudoku-cell");
                cells.forEach((cell, index) => {
                    setTimeout(() => {
                        cell.style.opacity = "0";
                        setTimeout(() => {
                            const row = parseInt(cell.dataset.row);
                            const col = parseInt(cell.dataset.col);
                            if (initialBoard[row][col] === 0) {
                                cell.textContent = solution[row][col];
                                cell.style.color = "#3498db";
                            }
                            cell.style.opacity = "1";
                        }, 50);
                    }, index * 10);
                });
            }
            function giveHint() {
                if (!selectedCell) {
                    self.playSound("hit");
                    updateStatus("Select a cell first!", "error");
                    return;
                }
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                if (
                    initialBoard[row][col] !== 0 ||
                    board[row][col] === solution[row][col]
                ) {
                    self.playSound("hit");
                    updateStatus("Try another cell!", "error");
                    return;
                }
                board[row][col] = solution[row][col];
                selectedCell.textContent = solution[row][col];
                selectedCell.style.color = "#f39c12"; 
                self.playSound("point");
                updateStatus("Hint used");
                if (isBoardComplete()) {
                    gameActive = false;
                    self.playSound("win");
                    self.updateScore(500); 
                    updateStatus("Puzzle solved with hints!", "success");
                    addCelebration();
                }
            }
            function isBoardComplete() {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (board[i][j] !== solution[i][j]) {
                            return false;
                        }
                    }
                }
                return true;
            }
            function addCelebration() {
                const confettiContainer = document.createElement("div");
                confettiContainer.style.position = "absolute";
                confettiContainer.style.top = "0";
                confettiContainer.style.left = "0";
                confettiContainer.style.width = "100%";
                confettiContainer.style.height = "100%";
                confettiContainer.style.pointerEvents = "none";
                confettiContainer.style.overflow = "hidden";
                gameContainer.appendChild(confettiContainer);
                for (let i = 0; i < 100; i++) {
                    createConfetti(confettiContainer);
                }
                setTimeout(() => {
                    confettiContainer.remove();
                }, 5000);
            }
            function createConfetti(container) {
                const colors = [
                    "#f39c12",
                    "#e74c3c",
                    "#3498db",
                    "#2ecc71",
                    "#9b59b6",
                ];
                const confetti = document.createElement("div");
                confetti.style.position = "absolute";
                confetti.style.width = "10px";
                confetti.style.height = "10px";
                confetti.style.backgroundColor =
                    colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
                confetti.style.left = Math.random() * 100 + "%";
                confetti.style.top = "-10px";
                confetti.style.opacity = Math.random() * 0.7 + 0.3;
                confetti.style.transform = `scale(${Math.random() * 1 + 0.5})`;
                confetti.style.animation = `fall ${
                    Math.random() * 3 + 2
                }s linear forwards`;
                container.appendChild(confetti);
                const style = document.createElement("style");
                style.textContent = `
                    @keyframes fall {
                        to {
                            transform: translateY(${
                                container.offsetHeight
                            }px) rotate(${Math.random() * 360}deg);
                            opacity: 0;
                        }
                    }
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        50% { transform: translateX(5px); }
                        75% { transform: translateX(-5px); }
                    }
                `;
                document.head.appendChild(style);
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
            function styleButton(button, width = "auto", height = "32px") {
                button.style.background = "var(--primary-color)";
                button.style.color = "#fff";
                button.style.border = "none";
                button.style.borderRadius = "4px";
                button.style.padding = "5px 10px";
                button.style.cursor = "pointer";
                button.style.fontFamily = "var(--font-main)";
                button.style.fontSize = "14px";
                button.style.fontWeight = "bold";
                button.style.width = width;
                button.style.height = height;
                button.style.transition = "all 0.2s ease";
                button.addEventListener("mouseover", () => {
                    button.style.filter = "brightness(1.2)";
                });
                button.addEventListener("mouseout", () => {
                    button.style.filter = "brightness(1)";
                });
            }
            function styleSelect(select) {
                select.style.background = "#333";
                select.style.color = "#fff";
                select.style.border = "1px solid #555";
                select.style.borderRadius = "4px";
                select.style.padding = "5px 10px";
                select.style.fontFamily = "var(--font-main)";
                select.style.fontSize = "14px";
                select.style.height = "32px";
            }
            generateNewGame(difficulty);
            return {
                cleanup: () => {
                    document.removeEventListener("keydown", keyDownHandler);
                },
            };
        }
    } 
    class AchievementSystem {
        constructor(showcase) {
            this.showcase = showcase;
            this.achievements = [
                {
                    id: "first_play",
                    name: "First Steps",
                    description: "Play your first game",
                    icon: "fa-gamepad",
                    unlocked: false,
                    secret: false,
                },
                {
                    id: "play_all_categories",
                    name: "Genre Explorer",
                    description: "Play a game from each category",
                    icon: "fa-th",
                    unlocked: false,
                    secret: false,
                },
                {
                    id: "play_10_games",
                    name: "Game Hopper",
                    description: "Play 10 different games",
                    icon: "fa-award",
                    unlocked: false,
                    secret: false,
                },
                {
                    id: "score_1000",
                    name: "Score Hunter",
                    description: "Get 1000+ points in any game",
                    icon: "fa-star",
                    unlocked: false,
                    secret: false,
                },
                {
                    id: "night_owl",
                    name: "Night Owl",
                    description: "Play a game after midnight",
                    icon: "fa-moon",
                    unlocked: false,
                    secret: true,
                },
                {
                    id: "speed_demon",
                    name: "Speed Demon",
                    description: "Complete a game in under 30 seconds",
                    icon: "fa-bolt",
                    unlocked: false,
                    secret: true,
                },
                {
                    id: "perfectionist",
                    name: "Perfectionist",
                    description: "Get a perfect score in any puzzle game",
                    icon: "fa-trophy",
                    unlocked: false,
                    secret: true,
                },
                {
                    id: "marathon",
                    name: "Gaming Marathon",
                    description: "Play games for over an hour total",
                    icon: "fa-stopwatch",
                    unlocked: false,
                    secret: true,
                },
                {
                    id: "comeback_kid",
                    name: "Comeback Kid",
                    description: "Return to the arcade after 3+ days",
                    icon: "fa-undo",
                    unlocked: false,
                    secret: true,
                },
                {
                    id: "completionist",
                    name: "Legendary Completionist",
                    description: "Play all games at least once",
                    icon: "fa-crown",
                    unlocked: false,
                    secret: false,
                },
            ];
            this.achievementsUnlocked = this.loadAchievements();
            this.totalPlayTime = 0;
            this.sessionStartTime = Date.now();
            this.lastSaveTime = this.loadLastVisit() || 0;
            this.achievementsUnlocked.forEach((id) => {
                const achievement = this.achievements.find((a) => a.id === id);
                if (achievement) achievement.unlocked = true;
            });
            this.checkTimeBasedAchievements();
        }
        loadAchievements() {
            try {
                return JSON.parse(
                    localStorage.getItem("game-achievements") || "[]"
                );
            } catch (e) {
                console.warn("Error loading achievements:", e);
                return [];
            }
        }
        loadLastVisit() {
            try {
                return JSON.parse(
                    localStorage.getItem("game-last-visit") || "0"
                );
            } catch (e) {
                return 0;
            }
        }
        saveAchievements() {
            try {
                localStorage.setItem(
                    "game-achievements",
                    JSON.stringify(this.achievementsUnlocked)
                );
                localStorage.setItem(
                    "game-last-visit",
                    JSON.stringify(Date.now())
                );
            } catch (e) {
                console.warn("Error saving achievements:", e);
            }
        }
        checkForAchievements(trigger, data = {}) {
            let newUnlocks = [];
            switch (trigger) {
                case "game_started":
                    if (!this.isUnlocked("first_play")) {
                        this.unlockAchievement("first_play");
                        newUnlocks.push(this.getAchievement("first_play"));
                    }
                    if (!this.isUnlocked("play_all_categories")) {
                        const playedCategories = new Set();
                        this.showcase.projects.forEach((p) => {
                            if (this.showcase.lastPlayedTime[p.id]) {
                                playedCategories.add(p.category);
                            }
                        });
                        const allCategories = new Set(
                            this.showcase.projects.map((p) => p.category)
                        );
                        if (playedCategories.size >= allCategories.size) {
                            this.unlockAchievement("play_all_categories");
                            newUnlocks.push(
                                this.getAchievement("play_all_categories")
                            );
                        }
                    }
                    if (!this.isUnlocked("play_10_games")) {
                        const gamesPlayed = Object.keys(
                            this.showcase.lastPlayedTime
                        ).length;
                        if (gamesPlayed >= 10) {
                            this.unlockAchievement("play_10_games");
                            newUnlocks.push(
                                this.getAchievement("play_10_games")
                            );
                        }
                    }
                    if (!this.isUnlocked("completionist")) {
                        const allGamesPlayed = this.showcase.projects.every(
                            (p) => this.showcase.lastPlayedTime[p.id]
                        );
                        if (allGamesPlayed) {
                            this.unlockAchievement("completionist");
                            newUnlocks.push(
                                this.getAchievement("completionist")
                            );
                        }
                    }
                    break;
                case "score_update":
                    if (!this.isUnlocked("score_1000") && data.score >= 1000) {
                        this.unlockAchievement("score_1000");
                        newUnlocks.push(this.getAchievement("score_1000"));
                    }
                    if (
                        !this.isUnlocked("perfectionist") &&
                        data.isPerfect &&
                        this.showcase.currentProject &&
                        this.showcase.currentProject.category === "puzzle"
                    ) {
                        this.unlockAchievement("perfectionist");
                        newUnlocks.push(this.getAchievement("perfectionist"));
                    }
                    break;
                case "game_completed":
                    if (
                        !this.isUnlocked("speed_demon") &&
                        data.duration &&
                        data.duration < 30
                    ) {
                        this.unlockAchievement("speed_demon");
                        newUnlocks.push(this.getAchievement("speed_demon"));
                    }
                    break;
            }
            if (newUnlocks.length > 0) {
                this.displayAchievements(newUnlocks);
            }
            return newUnlocks.length > 0;
        }
        checkTimeBasedAchievements() {
            let newUnlocks = [];
            if (!this.isUnlocked("night_owl")) {
                const hours = new Date().getHours();
                if (hours >= 0 && hours <= 4) {
                    this.unlockAchievement("night_owl");
                    newUnlocks.push(this.getAchievement("night_owl"));
                }
            }
            if (!this.isUnlocked("comeback_kid") && this.lastSaveTime > 0) {
                const daysDifference =
                    (Date.now() - this.lastSaveTime) / (1000 * 60 * 60 * 24);
                if (daysDifference >= 3) {
                    this.unlockAchievement("comeback_kid");
                    newUnlocks.push(this.getAchievement("comeback_kid"));
                }
            }
            if (newUnlocks.length > 0) {
                this.displayAchievements(newUnlocks);
            }
        }
        unlockAchievement(id) {
            const achievement = this.achievements.find((a) => a.id === id);
            if (achievement && !achievement.unlocked) {
                achievement.unlocked = true;
                if (!this.achievementsUnlocked.includes(id)) {
                    this.achievementsUnlocked.push(id);
                    this.saveAchievements();
                    return true;
                }
            }
            return false;
        }
        isUnlocked(id) {
            const achievement = this.achievements.find((a) => a.id === id);
            return achievement ? achievement.unlocked : false;
        }
        getAchievement(id) {
            return this.achievements.find((a) => a.id === id);
        }
        displayAchievements(achievements) {
            if (!Array.isArray(achievements) || achievements.length === 0)
                return;
            const container = document.createElement("div");
            container.className = "achievement-notifications";
            document.body.appendChild(container);
            achievements.forEach((achievement, index) => {
                setTimeout(() => {
                    const notification = document.createElement("div");
                    notification.className = "achievement-notification";
                    notification.innerHTML = `
                        <div class="achievement-icon">
                            <i class="fas ${achievement.icon}"></i>
                        </div>
                        <div class="achievement-content">
                            <div class="achievement-header">
                                <span class="achievement-unlocked">Achievement Unlocked!</span>
                                <span class="achievement-name">${achievement.name}</span>
                            </div>
                            <div class="achievement-description">${achievement.description}</div>
                        </div>
                    `;
                    container.appendChild(notification);
                    setTimeout(() => notification.classList.add("show"), 50);
                    setTimeout(() => {
                        notification.classList.remove("show");
                        setTimeout(() => notification.remove(), 500);
                    }, 5000);
                }, index * 2000); 
            });
        }
        getProgress() {
            const unlocked = this.achievements.filter((a) => a.unlocked).length;
            const total = this.achievements.length;
            return {
                unlocked,
                total,
                percentage: Math.round((unlocked / total) * 100),
            };
        }
        showAllAchievements() {
            const achievementList = document.createElement("div");
            achievementList.className = "achievement-list-modal";
            const progress = this.getProgress();
            achievementList.innerHTML = `
                <div class="achievement-modal-content">
                    <div class="achievement-modal-header">
                        <h3>Legendary Achievements</h3>
                        <div class="achievement-progress">
                            <div class="achievement-progress-bar">
                                <div class="achievement-progress-fill" style="width: ${
                                    progress.percentage
                                }%"></div>
                            </div>
                            <div class="achievement-progress-text">${
                                progress.unlocked
                            }/${progress.total} (${progress.percentage}%)</div>
                        </div>
                        <button class="achievement-close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="achievement-modal-body">
                        ${this.achievements
                            .map(
                                (a) => `
                            <div class="achievement-item ${
                                a.unlocked ? "unlocked" : "locked"
                            } ${a.secret && !a.unlocked ? "secret" : ""}">
                                <div class="achievement-item-icon">
                                    <i class="fas ${
                                        a.unlocked ? a.icon : "fa-lock"
                                    }"></i>
                                </div>
                                <div class="achievement-item-content">
                                    <div class="achievement-item-name">
                                        ${
                                            a.unlocked || !a.secret
                                                ? a.name
                                                : "Secret Achievement"
                                        }
                                    </div>
                                    <div class="achievement-item-description">
                                        ${
                                            a.unlocked || !a.secret
                                                ? a.description
                                                : "Keep playing to discover this achievement!"
                                        }
                                    </div>
                                </div>
                                ${
                                    a.unlocked
                                        ? '<div class="achievement-unlocked-badge"><i class="fas fa-check"></i></div>'
                                        : ""
                                }
                            </div>
                        `
                            )
                            .join("")}
                    </div>
                </div>
            `;
            document.body.appendChild(achievementList);
            setTimeout(() => achievementList.classList.add("show"), 50);
            achievementList
                .querySelector(".achievement-close-btn")
                .addEventListener("click", () => {
                    achievementList.classList.remove("show");
                    setTimeout(() => achievementList.remove(), 300);
                });
            achievementList.addEventListener("click", (e) => {
                if (e.target === achievementList) {
                    achievementList.classList.remove("show");
                    setTimeout(() => achievementList.remove(), 300);
                }
            });
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        const faPreload = document.createElement("link");
        faPreload.rel = "preload";
        faPreload.href =
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
        faPreload.as = "style";
        document.head.appendChild(faPreload);
        const showcase = new ProjectShowcase();
        showcase.init();
        window.projectShowcase = showcase; 
    });
})();