document.addEventListener("DOMContentLoaded", function () {
    initSkillsVisualization();
});
function initSkillsVisualization() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 5px rgba(142, 68, 255, 0.6); }
            50% { box-shadow: 0 0 15px rgba(142, 68, 255, 0.9); }
            100% { box-shadow: 0 0 5px rgba(142, 68, 255, 0.6); }
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        @keyframes shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
        }
        .ultra-shimmer {
            background: linear-gradient(90deg, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.2) 25%, 
                rgba(255,255,255,0.2) 50%, 
                rgba(255,255,255,0) 100%);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
        }
        .floating-element {
            animation: float 6s ease-in-out infinite;
        }
        .premium-button {
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .premium-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(50, 50, 93, 0.25), 
                        0 3px 6px rgba(0, 0, 0, 0.2);
        }
        .premium-button::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -60%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                60deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
            );
            transform: rotate(30deg);
            transition: transform 0.6s;
        }
        .premium-button:hover::after {
            transform: rotate(30deg) translate(30%, 30%);
        }
        .premium-button.active {
            animation: pulse-glow 2s infinite;
        }
        .premium-canvas {
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(5px);
            transition: all 0.5s ease;
        }
        .premium-canvas:hover {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        .visualization-mode-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            padding: 5px 10px;
            border-radius: 20px;
            backdrop-filter: blur(5px);
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .premium-skill-card {
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        .skill-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }
        .stat-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .stat-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }
        .stat-icon {
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        }
        .masterpiece-title {
            background: linear-gradient(90deg, #FF8A00, #e52e71, #a36bdd, #4a9feb);
            background-size: 300% 300%;
            animation: gradient-shift 8s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
            letter-spacing: 1px;
        }
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .legendary-level {
            background: linear-gradient(90deg, #FF8A00, #e52e71);
        }
        .expert-level {
            background: linear-gradient(90deg, #4776E6, #8E54E9);
        }
        .advanced-level {
            background: linear-gradient(90deg, #00c6ff, #0072ff);
        }
        .progress-glow {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 10px;
            background: rgba(255, 255, 255, 0.8);
            filter: blur(4px);
        }
    `;
    document.head.appendChild(styleSheet);
    const visualContainer = document.createElement("div");
    visualContainer.className = "skills-3d-container";
    visualContainer.innerHTML = `
        <div class="visualization-header premium-header" style="background: rgba(20, 20, 40, 0.7); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <div class="visualization-title">
                <i class="fas fa-galaxy floating-element" style="font-size: 24px; color: #a36bdd; margin-right: 10px;"></i>
                <h3 class="masterpiece-title">KHOLIPHA'S SKILLS COSMOS</h3>
                <span class="premium-badge" style="background: linear-gradient(135deg, #4776E6, #8E54E9); padding: 5px 10px; border-radius: 15px; font-size: 11px; font-weight: bold; color: white; margin-left: 10px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);">ANMS</span>
            </div>
            <div class="visualization-controls premium-controls" style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                <button class="vis-control premium-button" data-view="sphere" style="padding: 10px 15px; border-radius: 8px; background: rgba(71, 118, 230, 0.2); color: white; border: none; display: flex; align-items: center; gap: 7px;">
                    <i class="fas fa-globe-americas"></i>
                    <span>Orbital Sphere</span>
                </button>
                <button class="vis-control premium-button" data-view="clusters" style="padding: 10px 15px; border-radius: 8px; background: rgba(142, 84, 233, 0.2); color: white; border: none; display: flex; align-items: center; gap: 7px;">
                    <i class="fas fa-project-diagram"></i>
                    <span>Domain Networks</span>
                </button>
                <button class="vis-control premium-button" data-view="tags" style="padding: 10px 15px; border-radius: 8px; background: rgba(229, 46, 113, 0.2); color: white; border: none; display: flex; align-items: center; gap: 7px;">
                    <i class="fas fa-tags"></i>
                    <span>Skill Nebula</span>
                </button>
                <button class="vis-control premium-button" data-view="helix" style="padding: 10px 15px; border-radius: 8px; background: rgba(255, 138, 0, 0.2); color: white; border: none; display: flex; align-items: center; gap: 7px;">
                    <i class="fas fa-dna"></i>
                    <span>Helix Matrix</span>
                </button>
                <button class="vis-control premium-button" data-view="showcase" style="padding: 10px 15px; border-radius: 8px; background: rgba(0, 198, 255, 0.2); color: white; border: none; display: flex; align-items: center; gap: 7px;">
                    <i class="fas fa-star"></i>
                    <span>Showcase Mode</span>
                </button>
            </div>
        </div>
        <div class="visualization-container" style="position: relative;">
            <div class="visualization-mode-badge">
                <i class="fas fa-eye"></i>
                <span id="current-view-mode">Orbital Sphere</span>
            </div>
            <div id="skills-3d-canvas" class="premium-canvas" style="width: 100%; height: 500px; position: relative; overflow: hidden;"></div>
            <div id="visualization-stats" style="position: absolute; top: 15px; left: 15px; font-size: 12px; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 5px; backdrop-filter: blur(5px); display: none;">
                <div>Nodes: <span id="node-count">0</span></div>
                <div>Connections: <span id="connection-count">0</span></div>
                <div>FPS: <span id="fps-counter">0</span></div>
            </div>
            <div id="node-tooltip" style="position: absolute; display: none; background: rgba(10,10,30,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 14px; pointer-events: none; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1); z-index: 100; max-width: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"></div>
        </div>
        <div class="visualization-info premium-info" style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">
            <div class="control-panel" style="background: rgba(20, 20, 40, 0.7); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <div class="skill-search premium-search" style="flex: 1; min-width: 250px; position: relative;">
                    <div class="search-icon" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%);">
                        <i class="fas fa-search" style="color: #8E54E9;"></i>
                    </div>
                    <input type="text" placeholder="Search for a legendary skill..." id="skill-search-input" class="premium-input" style="width: 100%; padding: 12px 15px 12px 38px; border-radius: 50px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: all 0.3s ease;">
                    <button id="skill-search-btn" class="premium-search-btn" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: linear-gradient(135deg, #4776E6, #8E54E9); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.2);">
                        <i class="fas fa-bolt"></i>
                    </button>
                </div>
                <div class="view-controls" style="display: flex; gap: 15px; align-items: center;">
                    <div class="toggle-control" style="display: flex; align-items: center; gap: 8px;">
                        <label class="toggle-label" style="font-size: 14px; color: white;">Show Labels</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="show-labels" checked style="display: none;">
                            <label for="show-labels" style="display: inline-block; width: 44px; height: 22px; background: rgba(255,255,255,0.1); border-radius: 30px; position: relative; cursor: pointer; transition: all 0.3s ease;">
                                <span style="position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: all 0.3s ease;"></span>
                            </label>
                        </div>
                    </div>
                    <div class="toggle-control" style="display: flex; align-items: center; gap: 8px;">
                        <label class="toggle-label" style="font-size: 14px; color: white;">Auto-Rotate</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="auto-rotate" checked style="display: none;">
                            <label for="auto-rotate" style="display: inline-block; width: 44px; height: 22px; background: rgba(255,255,255,0.1); border-radius: 30px; position: relative; cursor: pointer; transition: all 0.3s ease;">
                                <span style="position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: all 0.3s ease;"></span>
                            </label>
                        </div>
                    </div>
                    <button id="debug-stats-toggle" class="premium-button" style="padding: 5px 12px; border-radius: 20px; background: rgba(255,255,255,0.1); color: white; border: none; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-chart-line"></i>
                        <span>Stats</span>
                    </button>
                </div>
            </div>
            <div class="current-skill-info premium-skill-card" style="background: rgba(20, 20, 40, 0.7); backdrop-filter: blur(10px); padding: 0; overflow: hidden;">
                <div class="skill-card-header" style="background: linear-gradient(135deg, #4776E6, #8E54E9); padding: 15px 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-certificate" style="color: white; font-size: 18px;"></i>
                    <h4 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">Skill Mastery Insights</h4>
                </div>
                <div id="selected-skill-details" class="premium-skill-details" style="padding: 20px;">
                    <div class="premium-prompt" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; text-align: center; padding: 30px 0;">
                        <i class="fas fa-hand-pointer pulse-icon" style="font-size: 32px; color: #8E54E9; animation: float 3s ease-in-out infinite;"></i>
                        <p style="color: white; margin: 0; opacity: 0.8; max-width: 300px; line-height: 1.5;">Interact with any skill node in the visualization to view detailed mastery information and connections</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    const skillsTitle = skillsSection.querySelector(".section-title");
    if (skillsTitle && skillsTitle.parentNode) {
        skillsTitle.parentNode.insertBefore(
            visualContainer,
            skillsTitle.nextSibling
        );
    } else {
        skillsSection.appendChild(visualContainer);
    }
    initThreeJsVisualization();
    const visControls = document.querySelectorAll(".vis-control");
    window.skillVisualizationCamera = null;
    visControls.forEach((control) => {
        control.addEventListener("click", function () {
            const ripple = document.createElement("span");
            ripple.classList.add("button-ripple");
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transition: all 0.5s ease-out;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.style.width = "200%";
                ripple.style.height = "200%";
                ripple.style.opacity = "0";
            }, 10);
            setTimeout(() => {
                ripple.remove();
            }, 500);
            visControls.forEach((c) => c.classList.remove("active"));
            this.classList.add("active");
            const view = this.getAttribute("data-view");
            changeVisualizationView(view);
        });
    });
    if (visControls.length > 0) {
        visControls[0].classList.add("active");
    }
    const searchInput = document.getElementById("skill-search-input");
    const searchButton = document.getElementById("skill-search-btn");
    if (searchInput && searchButton) {
        searchInput.addEventListener("focus", function () {
            this.parentElement.style.boxShadow =
                "0 0 0 2px rgba(142, 84, 233, 0.4)";
        });
        searchInput.addEventListener("blur", function () {
            this.parentElement.style.boxShadow = "none";
        });
        searchButton.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-2px)";
        });
        searchButton.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)";
        });
        searchButton.addEventListener("click", function () {
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 100);
            const query = searchInput.value;
            if (query.trim()) {
                searchButton.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i>';
                setTimeout(() => {
                    searchSkill(query);
                    searchButton.innerHTML = '<i class="fas fa-bolt"></i>';
                }, 300);
            } else {
                searchInput.style.animation =
                    "shake 0.5s cubic-bezier(.36,.07,.19,.97) both";
                setTimeout(() => {
                    searchInput.style.animation = "";
                }, 500);
            }
        });
        searchInput.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                searchButton.click();
            }
        });
        const styleElement = document.createElement("style");
        styleElement.textContent = `
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
                40%, 60% { transform: translate3d(3px, 0, 0); }
            }
        `;
        document.head.appendChild(styleElement);
    }
    window.initSkillTooltip = function (
        renderer,
        camera,
        nodes,
        clusterColors
    ) {
        const tooltip = document.getElementById("node-tooltip");
        if (!tooltip || !renderer || !camera || !nodes) return;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let lastHoveredNode = null;
        renderer.domElement.addEventListener("mousemove", function (event) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(nodes);
            if (intersects.length > 0) {
                const hoveredNode = intersects[0].object;
                if (hoveredNode !== lastHoveredNode) {
                    const nodeData = hoveredNode.userData;
                    const color = clusterColors[nodeData.cluster] || 0xffffff;
                    const colorHex = "#" + color.toString(16).padStart(6, "0");
                    tooltip.innerHTML = `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${colorHex}; margin-right: 6px;"></div>
                            <span style="font-weight: 600;">${nodeData.name}</span>
                        </div>
                        <div style="font-size: 12px; opacity: 0.8;">Proficiency: ${nodeData.level}%</div>
                    `;
                    tooltip.style.display = "block";
                    tooltip.style.left = `${event.clientX + 10}px`;
                    tooltip.style.top = `${event.clientY + 10}px`;
                    lastHoveredNode = hoveredNode;
                    hoveredNode.material.emissiveIntensity = 0.5;
                    nodes.forEach((n) => {
                        if (
                            n !== hoveredNode &&
                            n.material.emissiveIntensity < 0.7
                        ) {
                            n.material.emissiveIntensity = 0.3;
                        }
                    });
                }
                tooltip.style.left = `${event.clientX + 10}px`;
                tooltip.style.top = `${event.clientY + 10}px`;
            } else {
                tooltip.style.display = "none";
                if (
                    lastHoveredNode &&
                    lastHoveredNode.material.emissiveIntensity < 0.7
                ) {
                    lastHoveredNode.material.emissiveIntensity = 0.3;
                }
                lastHoveredNode = null;
            }
        });
        renderer.domElement.addEventListener("mouseleave", function () {
            tooltip.style.display = "none";
            if (
                lastHoveredNode &&
                lastHoveredNode.material.emissiveIntensity < 0.7
            ) {
                lastHoveredNode.material.emissiveIntensity = 0.3;
            }
            lastHoveredNode = null;
        });
    };
    const toggleSwitches = document.querySelectorAll('input[type="checkbox"]');
    toggleSwitches.forEach((toggle) => {
        toggle.addEventListener("change", function () {
            const switchLabel = this.nextElementSibling;
            if (switchLabel) {
                if (this.checked) {
                    switchLabel.querySelector("span").style.left = "24px";
                    switchLabel.style.background = "rgba(142, 84, 233, 0.5)";
                } else {
                    switchLabel.querySelector("span").style.left = "2px";
                    switchLabel.style.background = "rgba(255, 255, 255, 0.1)";
                }
            }
        });
        if (toggle.checked) {
            const switchLabel = toggle.nextElementSibling;
            if (switchLabel) {
                switchLabel.querySelector("span").style.left = "24px";
                switchLabel.style.background = "rgba(142, 84, 233, 0.5)";
            }
        }
    });
    const statsToggle = document.getElementById("debug-stats-toggle");
    const statsPanel = document.getElementById("visualization-stats");
    if (statsToggle && statsPanel) {
        statsToggle.addEventListener("click", function () {
            if (statsPanel.style.display === "block") {
                statsPanel.style.display = "none";
                statsToggle.classList.remove("active");
            } else {
                statsPanel.style.display = "block";
                statsToggle.classList.add("active");
            }
        });
    }
}
function initThreeJsVisualization() {
    const scriptSelectors = [
        'script[src*="three.min.js"]',
        'script[src*="tween.min.js"]',
        'script[src*="postprocessing.min.js"]',
    ];
    scriptSelectors.forEach((selector) => {
        const existingScript = document.querySelector(selector);
        if (existingScript) existingScript.remove();
    });
    const container = document.getElementById("skills-3d-canvas");
    if (container) {
        container.innerHTML = `
            <div class="premium-loader" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(10, 10, 30, 0.8); border-radius: 12px; z-index: 100;">
                <div style="width: 60px; height: 60px; border: 3px solid rgba(255, 255, 255, 0.1); border-top-color: #8E54E9; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <div style="margin-top: 20px; color: white; font-size: 14px; letter-spacing: 1px;">INITIALIZING LEGENDARY VISUALIZATION</div>
                <div style="width: 200px; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; margin-top: 15px; overflow: hidden; position: relative;">
                    <div class="ultra-shimmer" style="position: absolute; top: 0; left: 0; height: 100%; width: 30%; background: linear-gradient(90deg, transparent, #8E54E9, transparent);"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
    }
    const threeScript = document.createElement("script");
    threeScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.min.js";
    document.head.appendChild(threeScript);
    const tweenScript = document.createElement("script");
    tweenScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.min.js";
    document.head.appendChild(tweenScript);
    const postProcessingScript = document.createElement("script");
    postProcessingScript.src =
        "https://cdn.jsdelivr.net/npm/three@0.132.0/examples/js/postprocessing/EffectComposer.min.js";
    document.head.appendChild(postProcessingScript);
    let loadedCount = 0;
    const totalScripts = 3;
    const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalScripts) {
            console.log("THREE.js loaded successfully");
            setTimeout(() => {
                setupVisualization();
            }, 800); 
        }
    };
    threeScript.onload = checkAllLoaded;
    tweenScript.onload = checkAllLoaded;
    postProcessingScript.onload = checkAllLoaded;
    const handleScriptError = (script, name) => {
        script.onerror = () => {
            console.error(`Failed to load ${name} library`);
            if (container) {
                container.innerHTML = `
                    <div class="visualization-error" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(10, 10, 30, 0.9); border-radius: 12px; color: white; padding: 20px; text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #e52e71; margin-bottom: 15px;"></i>
                        <h3 style="margin: 0 0 10px; font-weight: 600;">Visualization Engine Error</h3>
                        <p style="margin: 0; opacity: 0.8; max-width: 400px; line-height: 1.5;">Unable to initialize 3D visualization libraries. Please check your internet connection and refresh the page to try again.</p>
                        <button onclick="location.reload()" style="margin-top: 20px; background: linear-gradient(135deg, #4776E6, #8E54E9); border: none; color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: 500;">Retry</button>
                    </div>
                `;
            }
        };
    };
    handleScriptError(threeScript, "THREE.js");
    handleScriptError(tweenScript, "TWEEN");
    handleScriptError(postProcessingScript, "PostProcessing");
}
function setupVisualization() {
    const container = document.getElementById("skills-3d-canvas");
    if (!container) return;
    container.querySelector(".premium-loader")?.remove();
    const skillClusters = {
        programming: [
            {
                id: "programming",
                name: "Programming",
                level: 95,
                connections: [
                    "webdev",
                    "python",
                    "cpp",
                    "gamedev",
                    "ml",
                    "database",
                ],
                description:
                    "Proficient in multiple programming languages and paradigms",
                experience: "8+ years",
                keyAchievements: [
                    "Built cross-platform applications",
                    "Developed efficient algorithms",
                ],
                tools: [
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
                ],
            },
            {
                id: "python",
                name: "Python",
                level: 90,
                connections: ["ml", "gamedev", "dataviz"],
                description:
                    "Advanced Python programming for ML and game development",
                experience: "6+ years",
                keyAchievements: [
                    "Developed ML models",
                    "Created game systems",
                ],
                tools: ["TensorFlow", "PyTorch", "NumPy", "Pandas", "Django"],
            },
            {
                id: "cpp",
                name: "C++",
                level: 85,
                connections: ["gamedev", "assembly"],
                description:
                    "System-level programming with C++ for performance-critical applications",
                experience: "5+ years",
                keyAchievements: [
                    "Optimized algorithms",
                    "Created game engines",
                ],
                tools: ["STL", "Boost", "OpenGL", "Unreal Engine"],
            },
            {
                id: "assembly",
                name: "Assembly",
                level: 75,
                connections: [],
                description:
                    "Low-level programming for microprocessors and system optimization",
                experience: "2+ years",
                keyAchievements: [
                    "Studying Microprocessors & Assembly Language - CSE-317/318",
                ],
                tools: ["x86", "ARM", "MIPS"],
            },
            {
                id: "algorithms",
                name: "Algorithms & DS",
                level: 86,
                connections: ["oop"],
                description:
                    "Designing and implementing efficient algorithms and data structures",
                experience: "6+ years",
                keyAchievements: [
                    "Optimized computational efficiency",
                    "Solved complex problems",
                ],
                tools: [
                    "Sorting algorithms",
                    "Search algorithms",
                    "Graph algorithms",
                    "Dynamic programming",
                ],
            },
            {
                id: "oop",
                name: "OOP",
                level: 90,
                connections: [],
                description: "Applying object-oriented programming principles",
                experience: "7+ years",
                keyAchievements: [
                    "Designed modular systems",
                    "Created reusable components",
                ],
                tools: [
                    "Inheritance",
                    "Polymorphism",
                    "Encapsulation",
                    "Design patterns",
                ],
            },
        ],
        web: [
            {
                id: "webdev",
                name: "Web Development",
                level: 92,
                connections: ["frontend", "backend", "htmlcss", "wordpress"],
                description:
                    "Full-stack web development with modern frameworks and technologies",
                experience: "7+ years",
                keyAchievements: [
                    "Built responsive websites",
                    "Created interactive web applications",
                ],
                tools: [
                    "HTML5",
                    "CSS3",
                    "JavaScript",
                    "React",
                    "Angular",
                    "Vue.js",
                    "Node.js",
                    "Laravel",
                    "WordPress",
                ],
            },
            {
                id: "htmlcss",
                name: "HTML/CSS",
                level: 95,
                connections: ["frontend"],
                description:
                    "Ultra-Advanced Legendary Styles with HTML and CSS",
                experience: "8+ years",
                keyAchievements: [
                    "Created premium UI components",
                    "Implemented complex animations",
                ],
                tools: [
                    "HTML5",
                    "CSS3",
                    "SASS",
                    "CSS Grid",
                    "Flexbox",
                    "CSS Animations",
                ],
            },
            {
                id: "wordpress",
                name: "WordPress",
                level: 88,
                connections: [],
                description:
                    "WordPress design and development for content management systems",
                experience: "6+ years",
                keyAchievements: ["Built custom themes", "Developed plugins"],
                tools: [
                    "PHP",
                    "WordPress API",
                    "Custom Themes",
                    "Plugin Development",
                ],
            },
            {
                id: "frontend",
                name: "Frontend",
                level: 90,
                connections: ["javascript", "uiux"],
                description:
                    "Building interactive and responsive user interfaces",
                experience: "7+ years",
                keyAchievements: [
                    "Created 3D input designs",
                    "Implemented button animations",
                ],
                tools: [
                    "React",
                    "Vue.js",
                    "Angular",
                    "JavaScript",
                    "CSS3",
                    "WebGL",
                ],
            },
            {
                id: "backend",
                name: "Backend",
                level: 87,
                connections: ["database", "restapi"],
                description: "Server-side development and API creation",
                experience: "6+ years",
                keyAchievements: [
                    "Built scalable APIs",
                    "Implemented authentication systems",
                ],
                tools: ["Node.js", "Express", "Django", "Laravel", "REST APIs"],
            },
            {
                id: "restapi",
                name: "REST APIs",
                level: 85,
                connections: [],
                description: "Building and consuming RESTful web services",
                experience: "5+ years",
                keyAchievements: [
                    "Designed RESTful architectures",
                    "Created API documentation",
                ],
                tools: ["Node.js", "Express", "Swagger", "Postman"],
            },
            {
                id: "javascript",
                name: "JavaScript",
                level: 90,
                connections: ["react", "node"],
                description:
                    "Advanced knowledge of modern JavaScript patterns, ES6+, and best practices.",
                experience: "8+ years",
                keyAchievements: [
                    "Led company-wide JavaScript training",
                    "Contributed to open source libraries",
                ],
                tools: ["ES6+", "TypeScript", "webpack", "Babel"],
            },
            {
                id: "react",
                name: "React",
                level: 85,
                connections: [],
                description:
                    "Building complex component-based applications with React ecosystem.",
                experience: "5+ years",
                keyAchievements: [
                    "Created reusable component library",
                    "Implemented state management patterns",
                ],
                tools: [
                    "Redux",
                    "Context API",
                    "React Query",
                    "Styled Components",
                ],
            },
            {
                id: "node",
                name: "Node.js",
                level: 82,
                connections: [],
                description:
                    "Developing high-performance backend services with Node.js.",
                experience: "5+ years",
                keyAchievements: [
                    "Built real-time data processing systems",
                    "Optimized memory usage",
                ],
                tools: [
                    "Express",
                    "NestJS",
                    "Socket.io",
                    "MongoDB",
                    "PostgreSQL",
                ],
            },
            {
                id: "database",
                name: "Databases",
                level: 80,
                connections: [],
                description:
                    "Designing efficient database schemas and optimizing queries for performance.",
                experience: "6+ years",
                keyAchievements: [
                    "Database migration project lead",
                    "Improved query performance by 70%",
                ],
                tools: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Firebase"],
            },
            {
                id: "cloud",
                name: "Cloud Computing",
                level: 78,
                connections: [],
                description:
                    "Deploying and managing applications in cloud environments for scalability.",
                experience: "4+ years",
                keyAchievements: [
                    "Migrated services to cloud architecture",
                    "Reduced operational costs by 30%",
                ],
                tools: [
                    "AWS",
                    "GCP",
                    "Azure",
                    "Docker",
                    "Kubernetes",
                    "Terraform",
                ],
            },
        ],
        creative: [
            {
                id: "uiux",
                name: "UI/UX Design",
                level: 90,
                connections: ["graphicdesign"],
                description:
                    "Creating intuitive user experiences with focus on accessibility and engagement.",
                experience: "7+ years",
                keyAchievements: [
                    "Improved user satisfaction scores by 45%",
                    "Reduced bounce rates by 30%",
                ],
                tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle"],
            },
            {
                id: "graphicdesign",
                name: "Graphic Design",
                level: 88,
                connections: ["motion"],
                description:
                    "Developing visually stunning brand identities and marketing materials.",
                experience: "6+ years",
                keyAchievements: [
                    "Award-winning campaign design",
                    "Rebranded corporate identity",
                ],
                tools: [
                    "Adobe Photoshop",
                    "Illustrator",
                    "InDesign",
                    "Affinity Designer",
                ],
            },
            {
                id: "motion",
                name: "Motion Graphics",
                level: 82,
                connections: [],
                description:
                    "Creating engaging animations and visual effects for digital content.",
                experience: "4+ years",
                keyAchievements: [
                    "Developed brand motion language",
                    "Created viral marketing animations",
                ],
                tools: [
                    "After Effects",
                    "Premiere Pro",
                    "Cinema 4D",
                    "Blender",
                ],
            },
            {
                id: "3d",
                name: "3D Modeling",
                level: 80,
                connections: ["animation"],
                description:
                    "Building detailed 3D models and environments for visualization and simulation.",
                experience: "4+ years",
                keyAchievements: [
                    "Created architectural visualization library",
                    "Designed product prototypes",
                ],
                tools: ["Blender", "Maya", "ZBrush", "Substance Painter"],
            },
            {
                id: "animation",
                name: "Animation",
                level: 75,
                connections: [],
                description:
                    "Bringing characters and objects to life through fluid, realistic movement.",
                experience: "3+ years",
                keyAchievements: [
                    "Character animation for commercial projects",
                    "Developed animation workflow",
                ],
                tools: ["After Effects", "Blender", "Spine", "Lottie"],
            },
        ],
        ai: [
            {
                id: "ml",
                name: "Machine Learning",
                level: 85,
                connections: ["deeplearning", "datascience"],
                description:
                    "Building predictive models and algorithms for complex data analysis.",
                experience: "5+ years",
                keyAchievements: [
                    "Developed recommendation engine",
                    "Implemented fraud detection system",
                ],
                tools: ["Python", "scikit-learn", "TensorFlow", "PyTorch"],
            },
            {
                id: "deeplearning",
                name: "Deep Learning",
                level: 82,
                connections: ["computervision", "nlp"],
                description:
                    "Designing neural networks for solving complex pattern recognition problems.",
                experience: "4+ years",
                keyAchievements: [
                    "Built image recognition system",
                    "Trained custom language models",
                ],
                tools: ["TensorFlow", "PyTorch", "Keras", "CUDA"],
            },
            {
                id: "computervision",
                name: "Computer Vision",
                level: 80,
                connections: [],
                description:
                    "Implementing systems that can interpret and analyze visual information.",
                experience: "3+ years",
                keyAchievements: [
                    "Developed object detection solution",
                    "Created facial recognition system",
                ],
                tools: ["OpenCV", "TensorFlow", "PyTorch", "YOLO"],
            },
            {
                id: "nlp",
                name: "NLP",
                level: 78,
                connections: [],
                description:
                    "Building systems that understand and generate human language.",
                experience: "3+ years",
                keyAchievements: [
                    "Chatbot development",
                    "Sentiment analysis implementation",
                ],
                tools: ["NLTK", "spaCy", "Transformers", "BERT", "GPT"],
            },
            {
                id: "datascience",
                name: "Data Science",
                level: 85,
                connections: ["visualization"],
                description:
                    "Extracting insights from complex datasets to drive business decisions.",
                experience: "5+ years",
                keyAchievements: [
                    "Led predictive analytics projects",
                    "Developed customer segmentation model",
                ],
                tools: ["Python", "R", "Pandas", "NumPy", "Jupyter"],
            },
            {
                id: "visualization",
                name: "Data Visualization",
                level: 88,
                connections: [],
                description:
                    "Creating compelling visual representations of complex data for insight discovery.",
                experience: "5+ years",
                keyAchievements: [
                    "Built interactive dashboard solutions",
                    "Developed custom visualization library",
                ],
                tools: ["D3.js", "Tableau", "Power BI", "Plotly", "Three.js"],
            },
        ],
        gamedev: [
            {
                id: "gamedesign",
                name: "Game Design",
                level: 85,
                connections: ["unreal", "unity"],
                description:
                    "Designing engaging game mechanics and player experiences.",
                experience: "5+ years",
                keyAchievements: [
                    "Designed core mechanics for indie games",
                    "Created level design framework",
                ],
                tools: ["Unity", "Unreal Engine", "Adobe Suite", "Blender"],
            },
            {
                id: "unreal",
                name: "Unreal Engine",
                level: 80,
                connections: [],
                description:
                    "Developing immersive 3D experiences using Unreal Engine.",
                experience: "3+ years",
                keyAchievements: [
                    "Created VR prototype",
                    "Optimized rendering pipeline",
                ],
                tools: ["Blueprints", "C++", "Material Editor", "Sequencer"],
            },
            {
                id: "unity",
                name: "Unity",
                level: 82,
                connections: [],
                description:
                    "Building cross-platform games and interactive applications.",
                experience: "4+ years",
                keyAchievements: [
                    "Published mobile games",
                    "Developed AR experiences",
                ],
                tools: ["C#", "Shader Graph", "HLSL", "Cinemachine"],
            },
            {
                id: "gamephysics",
                name: "Game Physics",
                level: 78,
                connections: [],
                description:
                    "Implementing realistic physics simulations for interactive environments.",
                experience: "3+ years",
                keyAchievements: [
                    "Created custom physics solver",
                    "Optimized collision detection",
                ],
                tools: ["PhysX", "Havok", "Unity Physics", "Custom solvers"],
            },
        ],
        soft: [
            {
                id: "communication",
                name: "Communication",
                level: 95,
                connections: ["leadership", "teamwork"],
                description:
                    "Effectively conveying complex ideas to diverse audiences.",
                experience: "10+ years",
                keyAchievements: [
                    "Led client presentations",
                    "Improved team communication processes",
                ],
                tools: [
                    "Public speaking",
                    "Technical writing",
                    "Presentation design",
                ],
            },
            {
                id: "leadership",
                name: "Leadership",
                level: 88,
                connections: [],
                description:
                    "Guiding teams through complex projects while fostering growth and collaboration.",
                experience: "6+ years",
                keyAchievements: [
                    "Led cross-functional teams of 15+",
                    "Mentored junior professionals",
                ],
                tools: [
                    "Agile methodologies",
                    "Strategic planning",
                    "Conflict resolution",
                ],
            },
            {
                id: "teamwork",
                name: "Team Collaboration",
                level: 90,
                connections: [],
                description:
                    "Working effectively with diverse teams to achieve collective goals.",
                experience: "8+ years",
                keyAchievements: [
                    "Facilitated integration of remote teams",
                    "Improved collaboration workflows",
                ],
                tools: ["Agile", "Kanban", "Jira", "Confluence", "Slack"],
            },
            {
                id: "problemsolving",
                name: "Problem Solving",
                level: 92,
                connections: [],
                description:
                    "Analyzing complex situations and developing innovative solutions.",
                experience: "9+ years",
                keyAchievements: [
                    "Resolved critical production issues",
                    "Developed troubleshooting frameworks",
                ],
                tools: [
                    "Root cause analysis",
                    "Design thinking",
                    "Systems analysis",
                ],
            },
            {
                id: "timemanagement",
                name: "Time Management",
                level: 85,
                connections: [],
                description:
                    "Efficiently prioritizing tasks and meeting deadlines in fast-paced environments.",
                experience: "7+ years",
                keyAchievements: [
                    "Delivered projects ahead of schedule",
                    "Implemented productivity system",
                ],
                tools: [
                    "Project management",
                    "Time blocking",
                    "Prioritization frameworks",
                ],
            },
        ],
        ai_ml: [
            {
                id: "ml_ai",
                name: "Machine Learning",
                level: 85,
                connections: ["deep_learning", "computer_vision", "knn"],
                description:
                    "Building models that can learn from data and make predictions",
                experience: "4+ years",
                keyAchievements: [
                    "KNN Classifier for Breast Cancer Dataset",
                    "Predictive modeling",
                ],
                tools: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
            },
            {
                id: "deep_learning",
                name: "Deep Learning",
                level: 83,
                connections: ["image_enhancement"],
                description:
                    "Building and training neural networks for complex tasks",
                experience: "3+ years",
                keyAchievements: [
                    "Deep Learning Image Enhancement",
                    "Neural network architecture design",
                ],
                tools: ["PyTorch", "TensorFlow", "Google Colab"],
            },
            {
                id: "image_enhancement",
                name: "Image Enhancement",
                level: 84,
                connections: [],
                description: "Using AI to improve image quality and resolution",
                experience: "2+ years",
                keyAchievements: [
                    "Real-ESRGAN implementation",
                    "GFPGAN, ESRGAN projects",
                ],
                tools: ["PyTorch", "OpenCV", "Python"],
            },
            {
                id: "computer_vision",
                name: "Computer Vision",
                level: 80,
                connections: [],
                description:
                    "Creating systems that can interpret and analyze visual information",
                experience: "3+ years",
                keyAchievements: [
                    "Image processing projects",
                    "Object detection implementations",
                ],
                tools: ["OpenCV", "TensorFlow", "PyTorch", "Python"],
            },
            {
                id: "knn",
                name: "KNN Classifier",
                level: 85,
                connections: [],
                description:
                    "K-Nearest Neighbors implementation for classification tasks",
                experience: "2+ years",
                keyAchievements: [
                    "Breast Cancer Dataset Project",
                    "Pattern recognition systems",
                ],
                tools: ["Python", "Scikit-learn", "NumPy", "Pandas"],
            },
            {
                id: "generative_ai",
                name: "Generative AI",
                level: 78,
                connections: [],
                description:
                    "Working with AI models that can generate new content",
                experience: "1+ year",
                keyAchievements: [
                    "Amazon Bedrock implementation",
                    "Text and image generation",
                ],
                tools: ["AWS Bedrock", "GANs", "GPT models"],
            },
        ],
        quantum: [
            {
                id: "quantum_computing",
                name: "Quantum Computing",
                level: 75,
                connections: ["bloch_sphere", "circuit_builder"],
                description:
                    "Designing conceptual quantum computing applications",
                experience: "1+ year",
                keyAchievements: [
                    "Conceptual design for Quantum Code Simulator",
                    "Quantum algorithm research",
                ],
                tools: ["Qiskit", "Python", "Linear Algebra"],
            },
            {
                id: "bloch_sphere",
                name: "Bloch Sphere",
                level: 72,
                connections: [],
                description: "Visualization and manipulation of quantum states",
                experience: "1+ year",
                keyAchievements: [
                    "Created quantum state visualizations",
                    "Quantum state transformation simulations",
                ],
                tools: ["Qiskit", "Python", "Visualization libraries"],
            },
            {
                id: "circuit_builder",
                name: "Quantum Circuits",
                level: 70,
                connections: [],
                description:
                    "Designing and simulating quantum circuit implementations",
                experience: "1 year",
                keyAchievements: [
                    "Drag-n-drop Circuit Builder",
                    "Quantum algorithm implementations",
                ],
                tools: ["Qiskit", "Python", "Quantum gates"],
            },
        ],
        tools: [
            {
                id: "latex",
                name: "LaTeX",
                level: 90,
                connections: ["academic_formatting"],
                description:
                    "Professional document preparation for academic and technical papers",
                experience: "5+ years",
                keyAchievements: [
                    "Premium report writing",
                    "Clean academic formatting",
                ],
                tools: ["LaTeX", "BibTeX", "TikZ", "Beamer"],
            },
            {
                id: "academic_formatting",
                name: "Academic Tools",
                level: 88,
                connections: [],
                description:
                    "Creating professional academic documents and presentations",
                experience: "4+ years",
                keyAchievements: [
                    "Graphical content integration",
                    "Advanced presentations using VBA in Excel",
                ],
                tools: [
                    "LaTeX",
                    "Microsoft Office",
                    "VBA",
                    "Reference managers",
                ],
            },
            {
                id: "vba_excel",
                name: "Excel & VBA",
                level: 85,
                connections: [],
                description:
                    "Creating advanced spreadsheet solutions with macros and automation",
                experience: "4+ years",
                keyAchievements: [
                    "Advanced presentations using VBA",
                    "Automated data processing",
                ],
                tools: ["Excel", "VBA", "Power Query", "Data visualization"],
            },
            {
                id: "data_handling",
                name: "Data Handling",
                level: 87,
                connections: ["bigquery"],
                description:
                    "Processing and managing structured and unstructured data",
                experience: "5+ years",
                keyAchievements: ["CSV handling", "Database management"],
                tools: ["Python", "SQL", "Excel", "ETL processes"],
            },
            {
                id: "bigquery",
                name: "Google BigQuery",
                level: 80,
                connections: [],
                description: "Working with Google's big data query service",
                experience: "2+ years",
                keyAchievements: [
                    "From GCP NLP lab",
                    "Large dataset processing",
                ],
                tools: ["SQL", "Google Cloud Platform", "Data warehousing"],
            },
            {
                id: "gcp",
                name: "Google Cloud",
                level: 82,
                connections: ["visual_inspection"],
                description:
                    "Using Google Cloud Platform services for ML and data processing",
                experience: "3+ years",
                keyAchievements: ["GCP NLP lab", "Cloud-based ML workflows"],
                tools: ["GCP", "BigQuery", "Cloud Functions", "ML APIs"],
            },
            {
                id: "visual_inspection",
                name: "Visual Inspection AI",
                level: 78,
                connections: [],
                description:
                    "Using Google Cloud for automated visual inspection",
                experience: "1+ year",
                keyAchievements: [
                    "Defect Detection Challenge",
                    "Quality control systems",
                ],
                tools: [
                    "Google Cloud",
                    "Visual Inspection AI",
                    "Computer Vision",
                ],
            },
        ],
    };
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111133);
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(1, 32, 32);
    const clusterColors = {
        programming: 0x4facfe, 
        web: 0x00d184, 
        creative: 0xff6b6b, 
        ai_ml: 0x8a4fff, 
        gamedev: 0xff9f1a, 
        soft: 0xf9ca24, 
        quantum: 0xe42ef5, 
        tools: 0x2ef5e4, 
    };
    Object.keys(skillClusters).forEach((clusterKey) => {
        const cluster = skillClusters[clusterKey];
        const color = clusterColors[clusterKey] || 0xffffff;
        cluster.forEach((skill) => {
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.9,
            });
            const node = new THREE.Mesh(nodeGeometry, material);
            const scale = 0.5 + (skill.level / 100) * 0.5;
            node.scale.set(scale, scale, scale);
            node.position.x = (Math.random() - 0.5) * 40;
            node.position.y = (Math.random() - 0.5) * 40;
            node.position.z = (Math.random() - 0.5) * 40;
            node.userData = {
                id: skill.id,
                name: skill.name,
                level: skill.level,
                cluster: clusterKey,
                connections: skill.connections,
            };
            scene.add(node);
            nodes.push(node);
        });
    });
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
    });
    nodes.forEach((node) => {
        const connections = node.userData.connections;
        if (connections && connections.length > 0) {
            connections.forEach((connectionId) => {
                const targetNode = nodes.find(
                    (n) => n.userData.id === connectionId
                );
                if (targetNode) {
                    const points = [node.position, targetNode.position];
                    const geometry = new THREE.BufferGeometry().setFromPoints(
                        points
                    );
                    const line = new THREE.Line(geometry, lineMaterial);
                    scene.add(line);
                    node.userData.lines = node.userData.lines || [];
                    node.userData.lines.push({
                        line: line,
                        target: targetNode,
                    });
                }
            });
        }
    });
    function createTextLabel(text, position, color = 0xffffff) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 256;
        canvas.height = 128;
        context.fillStyle = "rgba(0, 0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "2.4vh Arial";
        context.fillStyle = `rgb(${(color >> 16) & 255}, ${
            (color >> 8) & 255
        }, ${color & 255})`;
        context.textAlign = "center";
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.position.y += 1.5;
        sprite.scale.set(5, 2.5, 1);
        return sprite;
    }
    nodes.forEach((node) => {
        const label = createTextLabel(
            node.userData.name,
            node.position,
            clusterColors[node.userData.cluster] || 0xffffff
        );
        scene.add(label);
        node.userData.label = label;
    });
    window.addEventListener("resize", function () {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    container.addEventListener("mousemove", function (event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
    container.addEventListener("click", function () {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodes);
        if (intersects.length > 0) {
            const selectedNode = intersects[0].object;
            showSkillDetails(selectedNode.userData);
            nodes.forEach((node) => {
                if (node === selectedNode) {
                    node.material.emissiveIntensity = 0.8;
                    node.scale.multiplyScalar(1.2);
                } else {
                    node.material.emissiveIntensity = 0.3;
                    node.scale.set(
                        0.5 + (node.userData.level / 100) * 0.5,
                        0.5 + (node.userData.level / 100) * 0.5,
                        0.5 + (node.userData.level / 100) * 0.5
                    );
                }
            });
        }
    });
    window.changeVisualizationView = function (view) {
        const viewModeBadge = document.getElementById("current-view-mode");
        if (viewModeBadge) {
            const modeNames = {
                sphere: "Orbital Sphere",
                clusters: "Domain Networks",
                tags: "Skill Nebula",
                helix: "Helix Matrix",
                showcase: "Showcase Mode",
            };
            viewModeBadge.textContent = modeNames[view] || view;
        }
        const useTween = typeof TWEEN !== "undefined";
        let maxDistance = 0; 
        nodes.forEach((node) => {
            let targetX, targetY, targetZ;
            const nodeLevel = node.userData.level || 50;
            const nodeId = node.userData.id || "";
            const clusterName = node.userData.cluster || "unknown";
            switch (view) {
                case "sphere":
                    const phi = Math.acos(-1 + 2 * Math.random());
                    const theta = Math.random() * Math.PI * 2;
                    const orbitRadius = 30 - (nodeLevel / 100) * 15;
                    targetX = orbitRadius * Math.sin(phi) * Math.cos(theta);
                    targetY = orbitRadius * Math.sin(phi) * Math.sin(theta);
                    targetZ = orbitRadius * Math.cos(phi);
                    break;
                case "clusters":
                    const clusterPositions = {
                        programming: { x: -20, y: 0, z: 0 },
                        web: { x: 20, y: 0, z: 0 },
                        creative: { x: 0, y: 20, z: 0 },
                        ai_ml: { x: 0, y: -20, z: 0 },
                        gamedev: { x: 0, y: 0, z: 20 },
                        soft: { x: 0, y: 0, z: -20 },
                        quantum: { x: -15, y: 15, z: 15 },
                        tools: { x: 15, y: -15, z: -15 },
                    };
                    const basePos = clusterPositions[clusterName] || {
                        x: 0,
                        y: 0,
                        z: 0,
                    };
                    targetX = basePos.x + (Math.random() - 0.5) * 10;
                    targetY = basePos.y + (Math.random() - 0.5) * 10;
                    targetZ = basePos.z + (nodeLevel / 100) * 10; 
                    break;
                case "tags":
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 5 + Math.random() * 15;
                    targetX = Math.cos(angle) * distance;
                    targetY = (Math.random() - 0.5) * 8;
                    targetZ = Math.sin(angle) * distance;
                    break;
                case "helix":
                    const idHash = nodeId
                        .split("")
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const helix = idHash % 2; 
                    const t = (nodeLevel / 100) * Math.PI * 6; 
                    const helixRadius = 15;
                    if (helix === 0) {
                        targetX = Math.cos(t) * helixRadius;
                        targetZ = Math.sin(t) * helixRadius;
                    } else {
                        targetX = Math.cos(t + Math.PI) * helixRadius; 
                        targetZ = Math.sin(t + Math.PI) * helixRadius;
                    }
                    targetY = t * 2 - 20; 
                    break;
                case "showcase":
                    if (nodeLevel >= 90) {
                        const angle = Math.random() * Math.PI * 2;
                        targetX = Math.cos(angle) * 8;
                        targetY = 5 + (Math.random() - 0.5) * 3;
                        targetZ = Math.sin(angle) * 8;
                    } else if (nodeLevel >= 80) {
                        const angle = Math.random() * Math.PI * 2;
                        targetX = Math.cos(angle) * 16;
                        targetY = 0 + (Math.random() - 0.5) * 4;
                        targetZ = Math.sin(angle) * 16;
                    } else {
                        const angle = Math.random() * Math.PI * 2;
                        const ringRadius = 25 - (nodeLevel / 100) * 5;
                        targetX = Math.cos(angle) * ringRadius;
                        targetY = -7 + (Math.random() - 0.5) * 5;
                        targetZ = Math.sin(angle) * ringRadius;
                    }
                    break;
                default:
                    targetX = (Math.random() - 0.5) * 40;
                    targetY = (Math.random() - 0.5) * 40;
                    targetZ = (Math.random() - 0.5) * 40;
            }
            if (
                node.position &&
                typeof node.position.distanceTo === "function"
            ) {
                const newPos = new THREE.Vector3(targetX, targetY, targetZ);
                const distance = node.position.distanceTo(newPos);
                maxDistance = Math.max(maxDistance, distance);
            }
            node.userData.targetPosition = {
                x: targetX,
                y: targetY,
                z: targetZ,
            };
        });
        if (useTween) {
            nodes.forEach((node) => {
                const targetPos = node.userData.targetPosition;
                if (!targetPos) return;
                const startPos = node.position.clone();
                const endPos = new THREE.Vector3(
                    targetPos.x,
                    targetPos.y,
                    targetPos.z
                );
                const distance = startPos.distanceTo(endPos);
                const duration = 1000 + (distance / maxDistance) * 1500; 
                new TWEEN.Tween(node.position)
                    .to(
                        { x: targetPos.x, y: targetPos.y, z: targetPos.z },
                        duration
                    )
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .start();
                new TWEEN.Tween(node.material)
                    .to({ opacity: 0.7 }, duration / 2)
                    .easing(TWEEN.Easing.Cubic.In)
                    .chain(
                        new TWEEN.Tween(node.material)
                            .to({ opacity: 1 }, duration / 2)
                            .easing(TWEEN.Easing.Cubic.Out)
                    )
                    .start();
            });
        }
    };
    window.searchSkill = function (query) {
        if (!query) return;
        const lowerQuery = query.toLowerCase();
        const matchingNode = nodes.find(
            (node) =>
                node.userData.name.toLowerCase().includes(lowerQuery) ||
                node.userData.id.includes(lowerQuery)
        );
        if (matchingNode) {
            const nodePosition = matchingNode.position.clone();
            const startPosition = camera.position.clone();
            const endPosition = nodePosition
                .clone()
                .add(new THREE.Vector3(0, 0, 10));
            let startTime = null;
            const duration = 1000;
            function animateCamera(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                camera.position.lerpVectors(
                    startPosition,
                    endPosition,
                    progress
                );
                camera.lookAt(nodePosition);
                if (progress < 1) {
                    requestAnimationFrame(animateCamera);
                } else {
                    showSkillDetails(matchingNode.userData);
                    nodes.forEach((node) => {
                        if (node === matchingNode) {
                            node.material.emissiveIntensity = 0.8;
                            node.scale.multiplyScalar(1.2);
                        } else {
                            node.material.emissiveIntensity = 0.3;
                            node.scale.set(
                                0.5 + (node.userData.level / 100) * 0.5,
                                0.5 + (node.userData.level / 100) * 0.5,
                                0.5 + (node.userData.level / 100) * 0.5
                            );
                        }
                    });
                }
            }
            requestAnimationFrame(animateCamera);
        }
    };
    function showSkillDetails(skillData) {
        try {
            const detailsContainer = document.getElementById(
                "selected-skill-details"
            );
            if (!detailsContainer) {
                console.warn("Details container not found");
                return;
            }
            const tooltip = document.getElementById("node-tooltip");
            if (tooltip) {
                tooltip.style.display = "none";
            }
            if (!skillData) {
                console.warn("No skill data provided");
                detailsContainer.innerHTML = `
                    <div class="premium-prompt" style="display: flex; flex-direction: column; align-items: center; padding: 30px 0; text-align: center;">
                        <div style="width: 60px; height: 60px; margin-bottom: 20px; position: relative;">
                            <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #e52e71;"></i>
                            <div style="position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; background: #FF8A00; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-times" style="font-size: 10px; color: white;"></i>
                            </div>
                        </div>
                        <h4 style="margin: 0 0 10px; color: white; font-weight: 600;">Data Unavailable</h4>
                        <p style="margin: 0; opacity: 0.7; max-width: 300px; line-height: 1.6; color: white;">Unable to retrieve skill information. Please select another node in the visualization.</p>
                    </div>
                `;
                return;
            }
            const clusterDisplayNames = {
                programming: "Programming & Languages",
                web: "Web Development & Design",
                creative: "Creative Design",
                ai_ml: "Artificial Intelligence & Machine Learning",
                gamedev: "Game Development & Interactive Media",
                soft: "Leadership & Professional Skills",
                quantum: "Quantum Computing",
                tools: "Tools & Technologies",
            };
            const cluster = skillData.cluster || "general";
            const clusterName =
                clusterDisplayNames[cluster] ||
                cluster.charAt(0).toUpperCase() + cluster.slice(1);
            const level = skillData.level || 0;
            let skillLevelText = "";
            let skillBadgeClass = "";
            if (level >= 90) {
                skillLevelText = "Legendary Mastery";
                skillBadgeClass = "legendary-badge";
            } else if (level >= 80) {
                skillLevelText = "Expert Proficiency";
                skillBadgeClass = "expert-badge";
            } else if (level >= 70) {
                skillLevelText = "Advanced Competency";
                skillBadgeClass = "advanced-badge";
            } else if (level >= 50) {
                skillLevelText = "Intermediate Level";
                skillBadgeClass = "intermediate-badge";
            } else {
                skillLevelText = "Foundational Knowledge";
                skillBadgeClass = "beginner-badge";
            }
            const getColorClass = (level) => {
                if (level >= 90) return "legendary-level";
                if (level >= 80) return "expert-level";
                if (level >= 70) return "advanced-level";
                if (level >= 50) return "intermediate-level";
                return "beginner-level";
            };
            const tools = skillData.tools || [];
            const toolsHTML =
                tools.length > 0
                    ? `<div class="skill-tools" style="margin-top: 15px;">
                    <div style="font-size: 14px; opacity: 0.7; margin-bottom: 8px;">Proficient Tools & Technologies</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${tools
                            .map(
                                (tool) =>
                                    `<span style="background: rgba(255,255,255,0.08); padding: 5px 10px; border-radius: 20px; font-size: 12px; color: white; display: inline-flex; align-items: center;">
                                <i class="fas fa-tools" style="margin-right: 5px; font-size: 10px; opacity: 0.7;"></i>
                                ${tool}
                            </span>`
                            )
                            .join("")}
                    </div>
                </div>`
                    : "";
            const achievements = skillData.keyAchievements || [];
            const achievementsHTML =
                achievements.length > 0
                    ? `<div class="skill-achievements" style="margin-top: 20px;">
                    <div style="font-size: 14px; opacity: 0.7; margin-bottom: 8px;">Key Achievements</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${achievements
                            .map(
                                (achievement) =>
                                    `<div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; font-size: 13px; color: white; display: flex; align-items: flex-start; gap: 8px;">
                                <i class="fas fa-trophy" style="margin-top: 2px; color: #FFD700; font-size: 12px;"></i>
                                <span>${achievement}</span>
                            </div>`
                            )
                            .join("")}
                    </div>
                </div>`
                    : "";
            const description =
                skillData.description ||
                "Expert proficiency in this technical domain with practical application experience.";
            const experience =
                skillData.experience ||
                `${Math.max(1, Math.floor(level / 20))}+ years`;
            let relatedSkillsHTML = "";
            if (
                skillData.connections &&
                Array.isArray(skillData.connections) &&
                skillData.connections.length > 0
            ) {
                relatedSkillsHTML = `
                    <div class="related-skills premium-related" style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                        <div class="related-skills-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <i class="fas fa-network-wired" style="color: #8E54E9;"></i>
                            <h5 style="margin: 0; font-size: 15px; font-weight: 600; color: white;">Connected Expertise</h5>
                        </div>
                        <div class="related-skills-list" style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${skillData.connections
                                .map((id) => {
                                    try {
                                        const relatedNode = nodes.find(
                                            (n) =>
                                                n.userData &&
                                                n.userData.id === id
                                        );
                                        if (
                                            !relatedNode ||
                                            !relatedNode.userData
                                        )
                                            return "";
                                        const nodeData = relatedNode.userData;
                                        const nodeColor =
                                            clusterColors[nodeData.cluster] ||
                                            0xffffff;
                                        const colorHex =
                                            "#" +
                                            nodeColor
                                                .toString(16)
                                                .padStart(6, "0");
                                        return `
                                            <div class="related-skill-badge" data-id="${
                                                nodeData.id
                                            }" 
                                                style="background: rgba(${
                                                    (nodeColor >> 16) & 255
                                                }, ${(nodeColor >> 8) & 255}, ${
                                            nodeColor & 255
                                        }, 0.15); 
                                                border: 1px solid rgba(${
                                                    (nodeColor >> 16) & 255
                                                }, ${(nodeColor >> 8) & 255}, ${
                                            nodeColor & 255
                                        }, 0.3);
                                                padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: all 0.3s ease;
                                                display: flex; align-items: center; gap: 8px; color: white;">
                                                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${colorHex};"></div>
                                                <span style="font-size: 13px;">${
                                                    nodeData.name
                                                }</span>
                                                <span style="background: rgba(${
                                                    (nodeColor >> 16) & 255
                                                }, ${(nodeColor >> 8) & 255}, ${
                                            nodeColor & 255
                                        }, 0.2); 
                                                    font-size: 10px; padding: 2px 6px; border-radius: 10px;">${
                                                        nodeData.level
                                                    }%</span>
                                            </div>
                                        `;
                                    } catch (err) {
                                        console.error(
                                            "Error creating related skill badge:",
                                            err
                                        );
                                        return "";
                                    }
                                })
                                .join("")}
                        </div>
                    </div>`;
            }
            const colorClass = getColorClass(level);
            const gradientStyle =
                colorClass === "legendary-level"
                    ? "background: linear-gradient(135deg, #FF8A00, #e52e71);"
                    : colorClass === "expert-level"
                    ? "background: linear-gradient(135deg, #4776E6, #8E54E9);"
                    : colorClass === "advanced-level"
                    ? "background: linear-gradient(135deg, #00c6ff, #0072ff);"
                    : "background: linear-gradient(135deg, #56CCF2, #2F80ED);";
            try {
                detailsContainer.innerHTML = `
                    <div class="skill-detail-card" style="overflow: hidden; border-radius: 8px; transform-origin: center top; animation: fadeIn 0.5s ease-out;">
                        <div class="skill-header" style="${gradientStyle} padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiAvPgo8L3N2Zz4='); opacity: 0.5;"></div>
                            <div style="position: relative; z-index: 1;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <h3 style="margin: 0; color: white; font-size: 22px; font-weight: 700;">${skillData.name}</h3>
                                    <div class="${skillBadgeClass}" style="background: rgba(255,255,255,0.2); color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; backdrop-filter: blur(5px);">
                                        ${skillLevelText}
                                    </div>
                                </div>
                                <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; max-width: 90%; line-height: 1.5;">
                                    ${description}
                                </p>
                            </div>
                        </div>
                        <div style="padding: 20px; background: rgba(30,30,50,0.5);">
                            <div class="skill-proficiency" style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 14px; color: white; opacity: 0.8;">Mastery Level</span>
                                    <span style="font-size: 14px; font-weight: 600; color: white;">${level}%</span>
                                </div>
                                <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative;">
                                    <div class="${colorClass}" style="height: 100%; width: ${level}%; position: relative; overflow: hidden;">
                                        <div class="progress-glow"></div>
                                        <div class="ultra-shimmer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.5;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="skill-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 20px;">
                                <div class="stat-item">
                                    <div class="stat-icon" style="margin-right: 8px;"><i class="fas fa-layer-group"></i></div>
                                    <div class="stat-info">
                                        <div class="stat-label" style="font-size: 12px; opacity: 0.7; color: white;">Domain</div>
                                        <div class="stat-value" style="font-size: 14px; font-weight: 600; color: white;">${clusterName}</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon" style="margin-right: 8px;"><i class="fas fa-clock"></i></div>
                                    <div class="stat-info">
                                        <div class="stat-label" style="font-size: 12px; opacity: 0.7; color: white;">Experience</div>
                                        <div class="stat-value" style="font-size: 14px; font-weight: 600; color: white;">${experience}</div>
                                    </div>
                                </div>
                            </div>
                            ${toolsHTML}
                            ${achievementsHTML}
                            ${relatedSkillsHTML}
                        </div>
                    </div>
                `;
                const relatedSkillBadges = detailsContainer.querySelectorAll(
                    ".related-skill-badge"
                );
                relatedSkillBadges.forEach((badge) => {
                    badge.addEventListener("click", () => {
                        try {
                            const skillId = badge.getAttribute("data-id");
                            const clickedNode = nodes.find(
                                (n) => n.userData && n.userData.id === skillId
                            );
                            if (clickedNode) {
                                badge.style.transform = "scale(0.95)";
                                setTimeout(() => {
                                    badge.style.transform = "scale(1)";
                                }, 200);
                                const nodePosition = clickedNode.position.clone();
                                const cameraPosition = camera.position.clone();
                                const distance = cameraPosition.distanceTo(
                                    nodePosition
                                );
                                const targetPosition = nodePosition
                                    .clone()
                                    .normalize()
                                    .multiplyScalar(distance);
                                if (window.TWEEN) {
                                    new TWEEN.Tween(camera.position)
                                        .to(
                                            {
                                                x: targetPosition.x,
                                                y: targetPosition.y,
                                                z: targetPosition.z,
                                            },
                                            800
                                        )
                                        .easing(TWEEN.Easing.Cubic.Out)
                                        .start();
                                }
                                showSkillDetails(clickedNode.userData);
                                nodes.forEach((node) => {
                                    if (
                                        node.userData &&
                                        node.userData.id === skillId
                                    ) {
                                        const origScale =
                                            0.5 +
                                            (node.userData.level / 100) * 0.5;
                                        if (window.TWEEN) {
                                            new TWEEN.Tween(node.material)
                                                .to(
                                                    { emissiveIntensity: 0.8 },
                                                    500
                                                )
                                                .easing(TWEEN.Easing.Cubic.Out)
                                                .start();
                                            new TWEEN.Tween(node.scale)
                                                .to(
                                                    {
                                                        x: origScale * 1.2,
                                                        y: origScale * 1.2,
                                                        z: origScale * 1.2,
                                                    },
                                                    500
                                                )
                                                .easing(
                                                    TWEEN.Easing.Elastic.Out
                                                )
                                                .start();
                                        } else {
                                            node.material.emissiveIntensity = 0.8;
                                            node.scale.set(
                                                origScale * 1.2,
                                                origScale * 1.2,
                                                origScale * 1.2
                                            );
                                        }
                                    } else {
                                        const skillLevel =
                                            node.userData && node.userData.level
                                                ? node.userData.level
                                                : 50;
                                        const origScale =
                                            0.5 + (skillLevel / 100) * 0.5;
                                        if (window.TWEEN) {
                                            new TWEEN.Tween(node.material)
                                                .to(
                                                    { emissiveIntensity: 0.3 },
                                                    500
                                                )
                                                .easing(TWEEN.Easing.Cubic.Out)
                                                .start();
                                            new TWEEN.Tween(node.scale)
                                                .to(
                                                    {
                                                        x: origScale,
                                                        y: origScale,
                                                        z: origScale,
                                                    },
                                                    500
                                                )
                                                .easing(TWEEN.Easing.Cubic.Out)
                                                .start();
                                        } else {
                                            node.material.emissiveIntensity = 0.3;
                                            node.scale.set(
                                                origScale,
                                                origScale,
                                                origScale
                                            );
                                        }
                                    }
                                });
                            }
                        } catch (error) {
                            console.error(
                                "Error handling related skill click:",
                                error
                            );
                        }
                    });
                    badge.addEventListener("mouseenter", () => {
                        badge.style.transform = "translateY(-2px)";
                        badge.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                    });
                    badge.addEventListener("mouseleave", () => {
                        badge.style.transform = "translateY(0)";
                        badge.style.boxShadow = "none";
                    });
                });
                const styleElement = document.createElement("style");
                styleElement.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(styleElement);
            } catch (renderError) {
                console.error("Error rendering skill details:", renderError);
                detailsContainer.innerHTML = `
                    <div class="premium-prompt" style="display: flex; flex-direction: column; align-items: center; padding: 40px 0; text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #e52e71; margin-bottom: 15px;"></i>
                        <h3 style="margin: 0 0 10px; color: white;">Rendering Error</h3>
                        <p style="margin: 0; opacity: 0.7; max-width: 300px; line-height: 1.6; color: white;">
                            There was an error displaying the skill details. Please refresh the page and try again.
                        </p>
                    </div>
                `;
            }
        } catch (err) {
            console.error("Error showing skill details:", err);
        }
    }
    changeVisualizationView("sphere");
    function animate() {
        try {
            requestAnimationFrame(animate);
            window.skillVisualizationCamera = camera;
            if (window.TWEEN) {
                TWEEN.update();
            }
            const autoRotateEnabled =
                document.getElementById("auto-rotate")?.checked !== false;
            const showLabelsEnabled =
                document.getElementById("show-labels")?.checked !== false;
            if (autoRotateEnabled) {
                scene.rotation.y += 0.0015;
            }
            const now = performance.now();
            if (!window.lastFpsUpdate || now - window.lastFpsUpdate > 500) {
                const fps = Math.round(
                    1000 / (now - (window.lastFrameTime || now))
                );
                const fpsCounter = document.getElementById("fps-counter");
                if (fpsCounter) {
                    fpsCounter.textContent = fps;
                }
                window.lastFpsUpdate = now;
            }
            window.lastFrameTime = now;
            nodes.forEach((node) => {
                if (node.userData.targetPosition && !node._isTweening) {
                    const ease = 0.05; 
                    node.position.x +=
                        (node.userData.targetPosition.x - node.position.x) *
                        ease;
                    node.position.y +=
                        (node.userData.targetPosition.y - node.position.y) *
                        ease;
                    node.position.z +=
                        (node.userData.targetPosition.z - node.position.z) *
                        ease;
                    const time = Date.now() * 0.001;
                    const nodeId = node.userData.id || "";
                    const idHash = nodeId
                        .split("")
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const oscillationScale = 0.05;
                    node.position.y +=
                        Math.sin(time * 0.5 + idHash * 0.1) * oscillationScale;
                    const skillLevel = node.userData.level || 50;
                    const pulseScale = 0.02 * (skillLevel / 100);
                    const baseScale = 0.5 + (skillLevel / 100) * 0.5;
                    const pulse =
                        Math.sin(time * 0.8 + idHash * 0.2) * pulseScale;
                    if (
                        node.material &&
                        node.material.emissiveIntensity < 0.5
                    ) {
                        node.scale.set(
                            baseScale + pulse,
                            baseScale + pulse,
                            baseScale + pulse
                        );
                    }
                }
                if (node.userData.label) {
                    node.userData.label.position.copy(node.position);
                    node.userData.label.position.y += 1.8;
                    node.userData.label.visible = showLabelsEnabled;
                    const distToCamera = camera.position.distanceTo(
                        node.position
                    );
                    const optimalDist = 30;
                    const scaleFactor = Math.max(
                        0.6,
                        Math.min(1.2, optimalDist / distToCamera)
                    );
                    node.userData.label.scale.set(
                        5 * scaleFactor,
                        2.5 * scaleFactor,
                        1
                    );
                    const material = node.userData.label.material;
                    if (material && material.opacity !== undefined) {
                        material.opacity = Math.min(1, 2 - distToCamera / 40);
                    }
                }
                if (node.userData.lines) {
                    node.userData.lines.forEach((connection) => {
                        try {
                            if (
                                connection.target &&
                                connection.line &&
                                connection.line.geometry
                            ) {
                                const points = [
                                    node.position,
                                    connection.target.position,
                                ];
                                connection.line.geometry.setFromPoints(points);
                                connection.line.geometry.attributes.position.needsUpdate = true;
                                const material = connection.line.material;
                                if (material) {
                                    const dist = node.position.distanceTo(
                                        connection.target.position
                                    );
                                    material.opacity = Math.max(
                                        0.1,
                                        Math.min(0.5, 8 / dist)
                                    );
                                    if (
                                        (node.material &&
                                            node.material.emissiveIntensity >
                                                0.5) ||
                                        (connection.target.material &&
                                            connection.target.material
                                                .emissiveIntensity > 0.5)
                                    ) {
                                        material.opacity =
                                            0.3 +
                                            Math.sin(Date.now() * 0.002) * 0.2;
                                    }
                                }
                            }
                        } catch (lineErr) {
                            console.log(
                                "Error updating connection line:",
                                lineErr
                            );
                        }
                    });
                }
            });
            const nodeCounter = document.getElementById("node-count");
            const connectionCounter = document.getElementById(
                "connection-count"
            );
            if (nodeCounter && !nodeCounter._updated) {
                nodeCounter.textContent = nodes.length;
                nodeCounter._updated = true;
            }
            if (connectionCounter && !connectionCounter._updated) {
                let connectionCount = 0;
                nodes.forEach((node) => {
                    if (node.userData.lines) {
                        connectionCount += node.userData.lines.length;
                    }
                });
                connectionCounter.textContent = connectionCount;
                connectionCounter._updated = true;
            }
            if (!window._tooltipInitialized && window.initSkillTooltip) {
                try {
                    window.initSkillTooltip(
                        renderer,
                        camera,
                        nodes,
                        clusterColors
                    );
                    window._tooltipInitialized = true;
                } catch (err) {
                    console.error("Error initializing tooltip:", err);
                }
            }
            renderer.render(scene, camera);
        } catch (err) {
            console.error("Error in animation loop:", err);
        }
    }
    console.log("Starting 3D skills visualization animation");
    animate();
}