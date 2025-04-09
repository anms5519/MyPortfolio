document.addEventListener("DOMContentLoaded", function () {
    initUltraGallery();
});
function initUltraGallery() {
    const gallerySection = document.getElementById("gallery");
    if (!gallerySection) return;
    enhanceGalleryUI();
    initialize3DEffects();
    setupAIImageEnhancements();
    setupMicroInteractions();
    initializeImmersiveView();
}
function enhanceGalleryUI() {
    const galleryContainer = document.querySelector(
        ".gallery-section .container"
    );
    const controlPanel = document.createElement("div");
    controlPanel.className = "gallery-control-panel";
    controlPanel.innerHTML = `
  <div class="panel-section">
    <h4>View Mode</h4>
    <div class="control-buttons">
      <button class="view-mode-btn active" data-mode="grid"><i class="fas fa-th"></i> Grid</button>
      <button class="view-mode-btn" data-mode="carousel"><i class="fas fa-film"></i> Carousel</button>
    </div>
  </div>
  <div class="panel-section">
    <h4>Effects</h4>
    <div class="effect-sliders">
      <div class="effect-control">
        <label>Depth <span>50%</span></label>
        <input type="range" min="0" max="100" value="50" class="effect-slider" data-effect="depth">
      </div>
      <div class="effect-control">
        <label>Glow <span>30%</span></label>
        <input type="range" min="0" max="100" value="30" class="effect-slider" data-effect="glow">
      </div>
      <div class="effect-control">
        <label>Motion <span>40%</span></label>
        <input type="range" min="0" max="100" value="40" class="effect-slider" data-effect="motion">
      </div>
    </div>
  </div>
  <div class="panel-section">
    <h4>AI Features</h4>
    <div class="ai-toggles">
      <div class="toggle-control">
        <label>Smart Sort</label>
        <label class="switch">
          <input type="checkbox" checked class="ai-feature" data-feature="smart-sort">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="toggle-control">
        <label>Auto Enhance</label>
        <label class="switch">
          <input type="checkbox" class="ai-feature" data-feature="auto-enhance">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="toggle-control">
        <label>Content Analysis</label>
        <label class="switch">
          <input type="checkbox" class="ai-feature" data-feature="content-analysis">
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
`;
    galleryContainer.insertBefore(
        controlPanel,
        galleryContainer.querySelector(".lifestyle-collage")
    );
    setupControlListeners(controlPanel);
}
function setupControlListeners(panel) {
    const viewButtons = panel.querySelectorAll(".view-mode-btn");
    viewButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            viewButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            const mode = this.getAttribute("data-mode");
            const galleryElement = document.querySelector(".lifestyle-collage");
            galleryElement.classList.remove(
                "mode-grid",
                "mode-masonry",
                "mode-carousel",
                "mode-3d"
            );
            galleryElement.classList.add(`mode-${mode}`);
            if (mode === "3d") {
                setup3DGalleryMode(galleryElement);
            }
        });
    });
    const effectSliders = panel.querySelectorAll(".effect-slider");
    effectSliders.forEach((slider) => {
        slider.addEventListener("input", function () {
            const valueDisplay = this.parentElement.querySelector("span");
            valueDisplay.textContent = `${this.value}%`;
            const effect = this.getAttribute("data-effect");
            const value = this.value;
            applyGalleryEffect(effect, value);
        });
    });
    const aiToggles = panel.querySelectorAll(".ai-feature");
    aiToggles.forEach((toggle) => {
        toggle.addEventListener("change", function () {
            const feature = this.getAttribute("data-feature");
            const enabled = this.checked;
            toggleAIFeature(feature, enabled);
        });
    });
}
function applyGalleryEffect(effect, value) {
    const galleryItems = document.querySelectorAll(".collage-item");
    galleryItems.forEach((item) => {
        switch (effect) {
            case "depth":
                item.style.setProperty(
                    "--item-depth",
                    `${(value / 100) * 50}px`
                );
                break;
            case "glow":
                item.style.setProperty(
                    "--item-glow",
                    `${(value / 100) * 20}px`
                );
                break;
            case "motion":
                item.style.setProperty("--item-motion", `${(value / 100) * 2}`);
                break;
        }
    });
}
function toggleAIFeature(feature, enabled) {
    console.log(`AI feature ${feature} ${enabled ? "enabled" : "disabled"}`);
    const gallery = document.querySelector(".lifestyle-collage");
    switch (feature) {
        case "smart-sort":
            if (enabled) {
                gallery.classList.add("ai-smart-sort");
                simulateAISort();
            } else {
                gallery.classList.remove("ai-smart-sort");
            }
            break;
        case "auto-enhance":
            if (enabled) {
                gallery.classList.add("ai-auto-enhance");
                simulateImageEnhancement();
            } else {
                gallery.classList.remove("ai-auto-enhance");
            }
            break;
        case "content-analysis":
            if (enabled) {
                gallery.classList.add("ai-content-analysis");
                simulateContentAnalysis();
            } else {
                gallery.classList.remove("ai-content-analysis");
            }
            break;
    }
}
function setupAIImageEnhancements() {
    const galleryItems = document.querySelectorAll(".collage-item");
    galleryItems.forEach((item) => {
        const overlay = item.querySelector(".collage-overlay");
        const aiPanel = document.createElement("div");
        aiPanel.className = "ai-analysis-panel";
        aiPanel.innerHTML = `
    <div class="ai-tag">AI Enhanced</div>
    <div class="ai-data hidden">
      <div class="ai-metric">
        <span class="metric-name">Subject</span>
        <span class="metric-value">Portrait</span>
      </div>
      <div class="ai-metric">
        <span class="metric-name">Composition</span>
        <span class="metric-value">Rule of Thirds</span>
      </div>
      <div class="ai-metric">
        <span class="metric-name">Color Mood</span>
        <span class="metric-value">Vibrant</span>
      </div>
    </div>
  `;
        if (overlay) {
            overlay.appendChild(aiPanel);
        }
    });
}
function simulateAISort() {
    const gallery = document.querySelector(".lifestyle-collage");
    const items = Array.from(gallery.querySelectorAll(".collage-item"));
    items.forEach((item) => {
        item.style.transition = "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
    setTimeout(() => {
        items
            .sort(() => Math.random() - 0.5)
            .forEach((item) => {
                gallery.appendChild(item);
            });
        const notification = document.createElement("div");
        notification.className = "ai-notification";
        notification.innerHTML = `
    <i class="fas fa-robot"></i>
    <span>AI has optimized gallery arrangement based on visual harmony</span>
  `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add("show");
            setTimeout(() => {
                notification.classList.remove("show");
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        }, 100);
    }, 1000);
}
function simulateImageEnhancement() {
    const galleryItems = document.querySelectorAll(".collage-item");
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            const img = item.querySelector("img");
            if (!img) return;
            const processingOverlay = document.createElement("div");
            processingOverlay.className = "processing-overlay";
            processingOverlay.innerHTML = `
      <div class="processing-spinner"></div>
      <div class="processing-text">AI Enhancing...</div>
    `;
            item.appendChild(processingOverlay);
            setTimeout(() => {
                processingOverlay.remove();
                img.style.filter =
                    "brightness(1.1) contrast(1.1) saturate(1.2)";
                const enhancedBadge = document.createElement("div");
                enhancedBadge.className = "enhanced-badge";
                enhancedBadge.innerHTML =
                    '<i class="fas fa-magic"></i> Enhanced';
                item.appendChild(enhancedBadge);
                setTimeout(() => {
                    enhancedBadge.classList.add("show");
                    setTimeout(() => {
                        enhancedBadge.classList.add("fade");
                        setTimeout(() => {
                            enhancedBadge.remove();
                        }, 1000);
                    }, 2000);
                }, 100);
            }, 1500 + Math.random() * 1000);
        }, index * 300);
    });
}
function simulateContentAnalysis() {
    const galleryItems = document.querySelectorAll(".collage-item");
    const possibleTags = [
        "People",
        "Group",
        "Portrait",
        "Landscape",
        "Indoor",
        "Outdoor",
        "Event",
        "Celebration",
        "Education",
        "Sports",
        "Formal",
        "Casual",
    ];
    const possibleScores = ["93%", "87%", "95%", "82%", "91%", "89%", "97%"];
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            const aiPanel = item.querySelector(".ai-analysis-panel");
            if (!aiPanel) return;
            const aiData = aiPanel.querySelector(".ai-data");
            if (aiData) {
                aiData.classList.remove("hidden");
            }
            const metrics = aiPanel.querySelectorAll(".ai-metric");
            metrics.forEach((metric) => {
                const valueElement = metric.querySelector(".metric-value");
                if (valueElement) {
                    valueElement.style.opacity = "0";
                    setTimeout(() => {
                        if (
                            metric
                                .querySelector(".metric-name")
                                .textContent.includes("Subject")
                        ) {
                            valueElement.textContent =
                                possibleTags[
                                    Math.floor(
                                        Math.random() * possibleTags.length
                                    )
                                ];
                        } else if (
                            metric
                                .querySelector(".metric-name")
                                .textContent.includes("Composition")
                        ) {
                            valueElement.textContent = [
                                "Rule of Thirds",
                                "Golden Ratio",
                                "Centered",
                                "Leading Lines",
                            ][Math.floor(Math.random() * 4)];
                        } else {
                            valueElement.textContent = [
                                "Vibrant",
                                "Monochrome",
                                "Warm",
                                "Cool",
                                "Neutral",
                            ][Math.floor(Math.random() * 5)];
                        }
                        valueElement.style.opacity = "1";
                    }, 300);
                }
            });
            const confidenceScore = document.createElement("div");
            confidenceScore.className = "ai-confidence-score";
            confidenceScore.innerHTML = `
      <span class="score-label">AI Confidence</span>
      <div class="score-bar">
        <div class="score-fill" style="width: ${
            possibleScores[Math.floor(Math.random() * possibleScores.length)]
        }"></div>
      </div>
    `;
            if (aiData) {
                aiData.appendChild(confidenceScore);
                setTimeout(() => {
                    const scoreFill = confidenceScore.querySelector(
                        ".score-fill"
                    );
                    if (scoreFill) {
                        scoreFill.style.transition =
                            "width 1s cubic-bezier(0.19, 1, 0.22, 1)";
                    }
                }, 100);
            }
        }, index * 200);
    });
}
function setupMicroInteractions() {
    const galleryItems = document.querySelectorAll(".collage-item");
    galleryItems.forEach((item) => {
        const particlesContainer = document.createElement("div");
        particlesContainer.className = "micro-particles";
        item.appendChild(particlesContainer);
        item.addEventListener("mouseenter", function () {
            generateParticles(particlesContainer, 15);
            this.classList.add("pulse-effect");
            setTimeout(() => {
                this.classList.remove("pulse-effect");
            }, 700);
        });
        item.addEventListener("touchstart", function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            createRippleEffect(this, x, y);
        });
        item.addEventListener("click", function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            createRippleEffect(this, x, y);
        });
    });
}
function generateParticles(container, count) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "micro-particle";
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 10 + 5;
        const colors = [
            "var(--primary-color)",
            "var(--accent-color)",
            "var(--secondary-color)",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 1 + 0.5;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.animationDuration = `${duration}s`;
        container.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
}
function createRippleEffect(element, x, y) {
    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    element.appendChild(ripple);
    setTimeout(() => {
        ripple.remove();
    }, 600);
}
function initializeImmersiveView() {
    const gallerySection = document.getElementById("gallery");
    const immersiveBtn = document.createElement("button");
    immersiveBtn.className = "immersive-view-btn";
    immersiveBtn.innerHTML = '<i class="fas fa-expand"></i> Immersive View';
    gallerySection.querySelector(".container").appendChild(immersiveBtn);
    const immersiveContainer = document.getElementById(
        "gallery-lightbox-modal"
    );
    if (!immersiveContainer) {
        console.error("Gallery lightbox modal not found in DOM");
        return;
    }
    immersiveContainer.innerHTML = `
  <div class="lightbox-wrapper">
    <button class="gallery-close" aria-label="Close">
      <i class="fas fa-times"></i>
    </button>
    <div class="gallery-modal-content">
      <div class="lightbox-loading">
        <div class="spinner-wrapper">
          <div class="spinner"></div>
        </div>
      </div>
      <div class="immersive-header">
        <h3 id="gallery-caption-title">Immersive Gallery Experience</h3>
      </div>
      <div class="immersive-content">
        <div class="immersive-image-container">
          <img src="" alt="Immersive view" id="gallery-modal-img" class="immersive-image">
          <div class="image-controls">
            <button id="gallery-prev" class="image-control prev-image"><i class="fas fa-chevron-left"></i></button>
            <button id="gallery-next" class="image-control next-image"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
        <div class="immersive-info">
          <p id="gallery-caption-description" class="immersive-description">Image description will appear here.</p>
          <div class="immersive-metadata">
            <div class="metadata-item">
              <i class="fas fa-calendar-alt"></i>
              <span class="metadata-value date-taken">Date: <span id="image-date">-</span></span>
            </div>
            <div class="metadata-item">
              <i class="fas fa-camera"></i>
              <span class="metadata-value camera-info">Category: <span id="image-category">-</span></span>
            </div>
            <div class="metadata-item">
              <i class="fas fa-image"></i>
              <span class="metadata-value">Photo <span id="gallery-current">1</span> of <span id="gallery-total">1</span></span>
            </div>
          </div>
          <div class="immersive-ai-analysis">
            <h4><i class="fas fa-robot"></i> AI Vision Analysis</h4>
            <div class="analysis-tags"></div>
            <div class="analysis-insights"></div>
          </div>
        </div>
      </div>
      <div class="immersive-thumbnails"></div>
    </div>
  </div>
`;
    immersiveBtn.addEventListener("click", function () {
        openImmersiveView();
    });
    const closeBtn = immersiveContainer.querySelector(".gallery-close");
    closeBtn.addEventListener("click", function () {
        closeImmersiveView();
    });
    window.closeLightbox = closeImmersiveView;
    document.addEventListener("keydown", function (e) {
        if (!immersiveContainer.classList.contains("active")) return;
        if (e.key === "Escape") {
            closeImmersiveView();
        } else if (e.key === "ArrowLeft") {
            changeImmersiveImage("prev");
        } else if (e.key === "ArrowRight") {
            changeImmersiveImage("next");
        }
    });
    const prevButton = immersiveContainer.querySelector("#gallery-prev");
    const nextButton = immersiveContainer.querySelector("#gallery-next");
    prevButton.addEventListener("click", () => changeImmersiveImage("prev"));
    nextButton.addEventListener("click", () => changeImmersiveImage("next"));
    const collageItems = document.querySelectorAll(".collage-item");
    collageItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            currentImmersiveIndex = index;
            openImmersiveView();
        });
    });
}
let currentImmersiveIndex = 0;
let galleryImages = [];
function openImmersiveView() {
    const immersiveContainer = document.getElementById(
        "gallery-lightbox-modal"
    );
    if (!immersiveContainer) return;
    const galleryItems = document.querySelectorAll(".collage-item");
    galleryImages = Array.from(galleryItems).map((item) => {
        const img = item.querySelector("img");
        const title =
            item.querySelector(".collage-info h3")?.textContent || "Image";
        const description =
            item.querySelector(".collage-info p")?.textContent ||
            "No description available";
        const category = item.classList.contains("lifestyle-1")
            ? "Education"
            : item.classList.contains("lifestyle-2")
            ? "Friends"
            : item.classList.contains("lifestyle-3")
            ? "Events"
            : item.classList.contains("lifestyle-4")
            ? "Presentations"
            : item.classList.contains("lifestyle-5")
            ? "Sports"
            : item.classList.contains("lifestyle-6")
            ? "Activities"
            : item.classList.contains("lifestyle-7")
            ? "Travel"
            : "Memories";
        const currentYear = new Date().getFullYear();
        const year = currentYear - Math.floor(Math.random() * 5);
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const dateStr = `${day}/${month}/${year}`;
        return {
            src: img?.src || "",
            title: title,
            description: description,
            category: category,
            date: dateStr,
        };
    });
    const totalCounter = document.getElementById("gallery-total");
    if (totalCounter) {
        totalCounter.textContent = galleryImages.length.toString();
    }
    immersiveContainer.classList.add("active");
    document.body.classList.add("immersive-mode");
    loadImmersiveImage(currentImmersiveIndex);
    createImmersiveThumbnails();
    setTimeout(() => {
        const modalContent = immersiveContainer.querySelector(
            ".gallery-modal-content"
        );
        if (modalContent) {
            modalContent.classList.add("active");
        }
    }, 10);
}
function closeImmersiveView() {
    const immersiveContainer = document.getElementById(
        "gallery-lightbox-modal"
    );
    if (!immersiveContainer) return;
    const modalContent = immersiveContainer.querySelector(
        ".gallery-modal-content"
    );
    if (modalContent) {
        modalContent.classList.remove("active");
    }
    setTimeout(() => {
        immersiveContainer.classList.remove("active");
        document.body.classList.remove("immersive-mode");
        const modalImg = document.getElementById("gallery-modal-img");
        if (modalImg) {
            modalImg.src = "";
        }
    }, 300);
}
function loadImmersiveImage(index) {
    if (index < 0 || index >= galleryImages.length) return;
    const immersiveContainer = document.getElementById(
        "gallery-lightbox-modal"
    );
    if (!immersiveContainer) return;
    const imageData = galleryImages[index];
    const loadingIndicator = immersiveContainer.querySelector(
        ".lightbox-loading"
    );
    if (loadingIndicator) {
        loadingIndicator.classList.add("show");
    }
    const preloadImg = new Image();
    preloadImg.onload = function () {
        const imageElement = immersiveContainer.querySelector(
            "#gallery-modal-img"
        );
        if (imageElement) {
            imageElement.style.opacity = "0";
            imageElement.style.transform = "scale(0.95)";
            setTimeout(() => {
                imageElement.src = imageData.src;
                imageElement.style.opacity = "1";
                imageElement.style.transform = "scale(1)";
                if (loadingIndicator) {
                    loadingIndicator.classList.remove("show");
                }
            }, 200);
        }
        const titleElement = immersiveContainer.querySelector(
            "#gallery-caption-title"
        );
        const descElement = immersiveContainer.querySelector(
            "#gallery-caption-description"
        );
        if (titleElement) titleElement.textContent = imageData.title;
        if (descElement) descElement.textContent = imageData.description;
        const dateElement = immersiveContainer.querySelector("#image-date");
        const categoryElement = immersiveContainer.querySelector(
            "#image-category"
        );
        const currentCounter = immersiveContainer.querySelector(
            "#gallery-current"
        );
        if (dateElement) dateElement.textContent = imageData.date;
        if (categoryElement) categoryElement.textContent = imageData.category;
        if (currentCounter) currentCounter.textContent = (index + 1).toString();
        simulateImmersiveAIAnalysis(imageData);
        const thumbnails = immersiveContainer.querySelectorAll(
            ".immersive-thumbnail"
        );
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add("active");
                thumb.style.transform = "scale(1.1)";
                setTimeout(() => {
                    thumb.style.transform = "scale(1)";
                }, 300);
            } else {
                thumb.classList.remove("active");
            }
        });
    };
    preloadImg.onerror = function () {
        console.error("Failed to load image:", imageData.src);
        if (loadingIndicator) {
            loadingIndicator.classList.remove("show");
        }
    };
    preloadImg.src = imageData.src;
}
function createImmersiveThumbnails() {
    const thumbnailContainer = document.querySelector(".immersive-thumbnails");
    if (!thumbnailContainer) return;
    thumbnailContainer.innerHTML = "";
    galleryImages.forEach((image, index) => {
        const thumbnail = document.createElement("div");
        thumbnail.className = `immersive-thumbnail ${
            index === currentImmersiveIndex ? "active" : ""
        }`;
        thumbnail.style.backgroundImage = `url(${image.src})`;
        thumbnail.style.animationDelay = `${index * 0.05}s`;
        thumbnail.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.1)";
        });
        thumbnail.addEventListener("mouseleave", function () {
            if (!this.classList.contains("active")) {
                this.style.transform = "scale(1)";
            }
        });
        thumbnail.addEventListener("click", function () {
            const ripple = document.createElement("div");
            ripple.className = "ripple-effect";
            ripple.style.left = "50%";
            ripple.style.top = "50%";
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            currentImmersiveIndex = index;
            loadImmersiveImage(index);
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    setTimeout(() => {
        const activeThumb = thumbnailContainer.querySelector(".active");
        if (activeThumb) {
            thumbnailContainer.scrollLeft =
                activeThumb.offsetLeft -
                thumbnailContainer.clientWidth / 2 +
                activeThumb.clientWidth / 2;
        }
    }, 100);
}
function changeImmersiveImage(direction) {
    const modal = document.getElementById("gallery-lightbox-modal");
    const img = modal?.querySelector("#gallery-modal-img");
    if (img) {
        if (direction === "next") {
            img.style.transform = "translateX(20px)";
            img.style.opacity = "0";
        } else {
            img.style.transform = "translateX(-20px)";
            img.style.opacity = "0";
        }
    }
    if (direction === "next") {
        currentImmersiveIndex =
            (currentImmersiveIndex + 1) % galleryImages.length;
    } else {
        currentImmersiveIndex =
            (currentImmersiveIndex - 1 + galleryImages.length) %
            galleryImages.length;
    }
    setTimeout(() => {
        loadImmersiveImage(currentImmersiveIndex);
        const thumbnailContainer = document.querySelector(
            ".immersive-thumbnails"
        );
        const activeThumb = thumbnailContainer?.querySelector(".active");
        if (thumbnailContainer && activeThumb) {
            thumbnailContainer.scrollLeft =
                activeThumb.offsetLeft -
                thumbnailContainer.clientWidth / 2 +
                activeThumb.clientWidth / 2;
        }
    }, 200);
}
function simulateImmersiveAIAnalysis(imageData) {
    const tagsContainer = document.querySelector(".analysis-tags");
    const insightsContainer = document.querySelector(".analysis-insights");
    if (!tagsContainer || !insightsContainer) return;
    tagsContainer.style.opacity = "0";
    insightsContainer.style.opacity = "0";
    setTimeout(() => {
        tagsContainer.innerHTML = "";
        insightsContainer.innerHTML = "";
        const possibleTags = [
            "People",
            "Group",
            "Portrait",
            "Landscape",
            "Indoor",
            "Outdoor",
            "Event",
            "Celebration",
            "Education",
            "Sports",
            "Formal",
            "Casual",
            "Historical",
            "Modern",
            "Nature",
            "Urban",
            "Architectural",
            "Academic",
            "Team",
            "Presentation",
            "Performance",
            "Graduation",
            "Conference",
            "Workshop",
            "Activity",
            "Travel",
            "Cultural",
            "Friendship",
        ];
        const combinedText = (
            imageData.title +
            " " +
            imageData.description +
            " " +
            imageData.category
        ).toLowerCase();
        let relevantTags = possibleTags.filter((tag) =>
            combinedText.includes(tag.toLowerCase())
        );
        const categoryTags = {
            Education: [
                "Academic",
                "Learning",
                "Education",
                "Classroom",
                "School",
            ],
            Events: [
                "Celebration",
                "Gathering",
                "Event",
                "Ceremony",
                "Occasion",
            ],
            Sports: ["Athletic", "Competition", "Team", "Physical", "Activity"],
            Presentations: [
                "Speech",
                "Conference",
                "Presentation",
                "Audience",
                "Stage",
            ],
            Activities: [
                "Engagement",
                "Participation",
                "Activity",
                "Workshop",
                "Interaction",
            ],
            Travel: [
                "Journey",
                "Exploration",
                "Destination",
                "Visit",
                "Travel",
            ],
        };
        if (categoryTags[imageData.category]) {
            relevantTags = [
                ...relevantTags,
                ...categoryTags[imageData.category],
            ];
        }
        const selectedTags = [...new Set(relevantTags)].slice(
            0,
            Math.min(relevantTags.length, 5 + Math.floor(Math.random() * 3))
        );
        while (selectedTags.length < 5) {
            const randomTag =
                possibleTags[Math.floor(Math.random() * possibleTags.length)];
            if (!selectedTags.includes(randomTag)) {
                selectedTags.push(randomTag);
            }
        }
        selectedTags.forEach((tag, index) => {
            let confidence = 0;
            if (combinedText.includes(tag.toLowerCase())) {
                confidence = 85 + Math.floor(Math.random() * 15);
            } else if (
                categoryTags[imageData.category] &&
                categoryTags[imageData.category].includes(tag)
            ) {
                confidence = 78 + Math.floor(Math.random() * 17);
            } else {
                confidence = 65 + Math.floor(Math.random() * 20);
            }
            const tagElement = document.createElement("div");
            tagElement.className = "analysis-tag";
            tagElement.style.opacity = "0";
            tagElement.style.transform = "translateY(10px)";
            tagElement.style.transition = "all 0.3s ease";
            tagElement.style.transitionDelay = `${index * 0.1}s`;
            tagElement.innerHTML = `
      <span class="tag-name">${tag}</span>
      <span class="tag-confidence">${confidence}%</span>
    `;
            tagsContainer.appendChild(tagElement);
            setTimeout(() => {
                tagElement.style.opacity = "1";
                tagElement.style.transform = "translateY(0)";
            }, 10);
        });
        let possibleInsights = [
            "This image appears to be taken during daytime with good natural lighting.",
            "The composition follows the rule of thirds for visual balance.",
            "The color palette is primarily warm with high saturation.",
            "Multiple subjects are present in this image, suggesting a group activity.",
            "The background appears to be slightly blurred, creating depth of field.",
            "The image has strong emotional content based on facial expressions.",
            "This appears to be an indoor setting with artificial lighting.",
            "This outdoor scene features natural landscape elements.",
            "The image shows a formal setting based on attire and environment.",
            "This image captures a casual moment with relaxed body language.",
        ];
        const categoryInsights = {
            Education: [
                "This image captures an educational environment with academic elements.",
                "The setting appears to be focused on learning and knowledge sharing.",
                "This composition documents an important academic milestone or achievement.",
            ],
            Events: [
                "This appears to be a significant event with ceremonial elements.",
                "The gathering suggests a planned celebration or important occasion.",
                "This moment captures a special event with multiple participants.",
            ],
            Sports: [
                "The image shows athletic activity with competitive elements.",
                "This composition highlights physical activity and teamwork.",
                "The scene depicts sports participation with active engagement.",
            ],
            Presentations: [
                "This captures a formal presentation or speaking engagement.",
                "The setup indicates a knowledge-sharing session or talk.",
                "This appears to be a structured presentation with audience attendance.",
            ],
        };
        if (categoryInsights[imageData.category]) {
            possibleInsights = [
                ...possibleInsights,
                ...categoryInsights[imageData.category],
            ];
        }
        let selectedInsights = [];
        if (categoryInsights[imageData.category]) {
            selectedInsights.push(
                categoryInsights[imageData.category][
                    Math.floor(
                        Math.random() *
                            categoryInsights[imageData.category].length
                    )
                ]
            );
        }
        while (selectedInsights.length < 3) {
            const randomInsight =
                possibleInsights[
                    Math.floor(Math.random() * possibleInsights.length)
                ];
            if (!selectedInsights.includes(randomInsight)) {
                selectedInsights.push(randomInsight);
            }
        }
        selectedInsights.forEach((insight, index) => {
            const insightElement = document.createElement("p");
            insightElement.className = "analysis-insight";
            insightElement.textContent = insight;
            insightElement.style.opacity = "0";
            insightElement.style.transform = "translateY(10px)";
            insightElement.style.transition = "all 0.4s ease";
            insightElement.style.transitionDelay = `${index * 0.15 + 0.3}s`;
            insightsContainer.appendChild(insightElement);
            setTimeout(() => {
                insightElement.style.opacity = "1";
                insightElement.style.transform = "translateY(0)";
            }, 10);
        });
        tagsContainer.style.opacity = "1";
        insightsContainer.style.opacity = "1";
    }, 300);
}