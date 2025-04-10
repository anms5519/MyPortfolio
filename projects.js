document.addEventListener("DOMContentLoaded", function () {
    const projectCards = document.querySelectorAll(
        ".projects-grid .project-card"
    ); 
    const filterForm = document.querySelector(".project-filter-container");
    const searchInput = document.getElementById("project-search");
    const searchClear = document.querySelector(".search-clear");
    const filterSelects = document.querySelectorAll(".filter-group select");
    const resetBtn = document.querySelector(".reset-filters");
    const projectFilterButtons = document.querySelectorAll(".project-filter");
    const activeFiltersContainer = document.querySelector(".active-filters");
    const noResultsMsg = document.querySelector(".no-results-message");
    const resultsCount = document.querySelector(".results-count");
    const gridView = document.querySelector(".projects-grid-view");
    const listView = document.querySelector(".projects-list-view");
    const carouselView = document.querySelector(".projects-carousel-view");
    const threeDView = document.querySelector(".projects-3d-scene");
    const viewBtns = document.querySelectorAll(".view-btn");
    const modal = document.getElementById("project-detail-modal");
    const modalCloseBtn = modal?.querySelector(".close-btn");
    const modalTitle = modal?.querySelector("#modal-title");
    const modalDescription = modal?.querySelector("#modal-description");
    let currentCategoryFilter = "all"; 
    function filterProjects() {
        if (!filterForm) return;
        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedTech =
            document.getElementById("tech-filter")?.value || "all";
        const selectedType =
            document.getElementById("type-filter")?.value || "all";
        const selectedYear =
            document.getElementById("year-filter")?.value || "all";
        const activeFilters = [];
        if (searchValue)
            activeFilters.push({ type: "search", value: searchValue });
        if (selectedTech !== "all")
            activeFilters.push({ type: "tech", value: selectedTech });
        if (selectedType !== "all")
            activeFilters.push({ type: "type", value: selectedType });
        if (selectedYear !== "all")
            activeFilters.push({ type: "year", value: selectedYear });
        if (currentCategoryFilter !== "all")
            activeFilters.push({
                type: "category",
                value: currentCategoryFilter,
            });
        updateActiveFilters(activeFilters);
        let visibleCount = 0;
        projectCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category") || "";
            const cardTechs = (
                card.getAttribute("data-techs") || ""
            ).toLowerCase();
            const cardType = card.getAttribute("data-type") || "";
            const cardYear = card.getAttribute("data-year") || "";
            const cardTitle = (
                card.querySelector(".card-title")?.textContent || ""
            ).toLowerCase();
            const cardDesc = (
                card.querySelector(".card-description")?.textContent || ""
            ).toLowerCase();
            const cardCategories = cardCategory.split(" "); 
            const matchesCategory =
                currentCategoryFilter === "all" ||
                cardCategories.includes(currentCategoryFilter);
            const matchesSearch =
                !searchValue ||
                cardTitle.includes(searchValue) ||
                cardDesc.includes(searchValue);
            const matchesTech =
                selectedTech === "all" ||
                cardTechs
                    .split(",")
                    .map((t) => t.trim())
                    .includes(selectedTech);
            const matchesType =
                selectedType === "all" || cardType === selectedType;
            const matchesYear =
                selectedYear === "all" || cardYear === selectedYear;
            const isVisible =
                matchesCategory &&
                matchesSearch &&
                matchesTech &&
                matchesType &&
                matchesYear;
            if (isVisible) {
                card.style.display = "flex"; 
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
                visibleCount++;
            } else {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                setTimeout(() => {
                    card.style.display = "none";
                }, 300); 
            }
        });
        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} project${
                visibleCount !== 1 ? "s" : ""
            } found`;
        }
        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
        }
        const activeViewBtn = document.querySelector(".view-btn.active");
        if (activeViewBtn) {
            const activeView = activeViewBtn.getAttribute("data-view");
            if (activeView === "list") {
                populateListView(); 
            } else if (activeView === "carousel") {
                populateCarouselView(); 
            }
        }
    }
    function updateActiveFilters(filters) {
        if (!activeFiltersContainer) return;
        activeFiltersContainer.innerHTML = ""; 
        if (filters.length > 0) {
            activeFiltersContainer.style.display = "flex";
            filters.forEach((filter) => {
                const filterTag = document.createElement("div");
                filterTag.className = "active-filter";
                let filterLabel = "Unknown";
                switch (filter.type) {
                    case "search":
                        filterLabel = "Search";
                        break;
                    case "tech":
                        filterLabel = "Technology";
                        break;
                    case "type":
                        filterLabel = "Type";
                        break;
                    case "year":
                        filterLabel = "Year";
                        break;
                    case "category":
                        filterLabel = "Category";
                        break;
                }
                filterTag.innerHTML = `
                    ${filterLabel}: ${filter.value}
                    <button class="remove-filter" data-type="${filter.type}" data-value="${filter.value}">×</button>
                `;
                activeFiltersContainer.appendChild(filterTag);
                filterTag
                    .querySelector(".remove-filter")
                    .addEventListener("click", function () {
                        const filterType = this.getAttribute("data-type");
                        if (filterType === "search" && searchInput) {
                            searchInput.value = "";
                        } else if (filterType === "tech") {
                            document.getElementById("tech-filter").value =
                                "all";
                        } else if (filterType === "type") {
                            document.getElementById("type-filter").value =
                                "all";
                        } else if (filterType === "year") {
                            document.getElementById("year-filter").value =
                                "all";
                        } else if (filterType === "category") {
                            projectFilterButtons.forEach((btn) =>
                                btn.classList.remove("active")
                            );
                            document
                                .querySelector(
                                    '.project-filter[data-filter="all"]'
                                )
                                .classList.add("active");
                            currentCategoryFilter = "all";
                        }
                        filterProjects(); 
                    });
            });
        } else {
            activeFiltersContainer.style.display = "none";
        }
    }
    function initFilterListeners() {
        if (searchInput) {
            searchInput.addEventListener("input", filterProjects);
            if (searchClear) {
                searchClear.addEventListener("click", () => {
                    searchInput.value = "";
                    filterProjects();
                });
            }
        }
        filterSelects.forEach((select) => {
            select.addEventListener("change", filterProjects);
        });
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                filterSelects.forEach((select) => {
                    select.selectedIndex = 0;
                });
                projectFilterButtons.forEach((btn) =>
                    btn.classList.remove("active")
                );
                document
                    .querySelector('.project-filter[data-filter="all"]')
                    .classList.add("active");
                currentCategoryFilter = "all";
                filterProjects();
            });
        }
        if (projectFilterButtons.length > 0) {
            projectFilterButtons.forEach((button) => {
                button.addEventListener("click", function () {
                    projectFilterButtons.forEach((btn) =>
                        btn.classList.remove("active")
                    );
                    this.classList.add("active");
                    currentCategoryFilter = this.getAttribute("data-filter");
                    filterProjects(); 
                });
            });
        }
    }
    function setupProjectViewToggle() {
        if (!viewBtns.length) return;
        viewBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                viewBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                if (gridView) gridView.style.display = "none";
                if (listView) listView.style.display = "none";
                if (carouselView) carouselView.style.display = "none";
                if (threeDView) threeDView.style.display = "none";
                const viewType = btn.getAttribute("data-view");
                if (viewType === "grid" && gridView) {
                    gridView.style.display = "grid";
                } else if (viewType === "list" && listView) {
                    listView.style.display = "block";
                    populateListView(); 
                } else if (viewType === "carousel" && carouselView) {
                    carouselView.style.display = "block";
                    populateCarouselView(); 
                } else if (viewType === "3d" && threeDView) {
                    threeDView.style.display = "block";
                }
            });
        });
        const defaultViewBtn = document.querySelector(
            '.view-btn[data-view="grid"]'
        );
        if (defaultViewBtn) {
            defaultViewBtn.click(); 
        } else if (viewBtns.length > 0) {
            viewBtns[0].click(); 
        }
    }
    function getVisibleProjectCards() {
        return Array.from(projectCards).filter(
            (card) => card.style.display !== "none"
        );
    }
    function populateListView() {
        const listContainer = listView?.querySelector(".projects-list");
        if (!listContainer) return;
        listContainer.innerHTML = ""; 
        const visibleCards = getVisibleProjectCards(); 
        if (visibleCards.length === 0) {
            return;
        }
        visibleCards.forEach((card) => {
            const title =
                card.querySelector(".card-title")?.textContent || "Project";
            const description =
                card.querySelector(".card-description")?.textContent || "";
            const imageSrc = card.querySelector(".card-image img")?.src || "";
            const tags = Array.from(card.querySelectorAll(".tech-tag")).map(
                (tag) => tag.textContent
            );
            const links = Array.from(
                card.querySelectorAll(".card-action-btn")
            ).map((link) => ({
                href: link.getAttribute("href") || "#",
                target: link.getAttribute("target") || "",
                icon: link.innerHTML,
                isDetails: link.classList.contains("details-btn"),
                detailsTitle: link.getAttribute("data-title"),
                detailsDesc: link.getAttribute("data-description"),
            }));
            const listItem = document.createElement("div");
            listItem.className = "list-item";
            listItem.innerHTML = `
                <div class="list-item-image">
                    <img src="${imageSrc}" alt="${title}" loading="lazy">
                </div>
                <div class="list-item-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="list-item-tags">
                        ${tags
                            .map(
                                (tag) => `<span class="list-tag">${tag}</span>`
                            )
                            .join("")}
                    </div>
                </div>
                <div class="list-item-actions">
                    ${links
                        .map(
                            (link) =>
                                `<a href="${link.href}" ${
                                    link.target ? `target="${link.target}"` : ""
                                }
                           class="list-action-btn ${
                               link.isDetails ? "details-btn" : ""
                           }"
                           ${
                               link.isDetails
                                   ? `data-title="${link.detailsTitle}" data-description="${link.detailsDesc}"`
                                   : ""
                           }>
                           ${link.icon}
                         </a>`
                        )
                        .join("")}
                </div>
            `;
            listContainer.appendChild(listItem);
        });
        setupProjectDetailModalListeners(listContainer);
    }
    function populateCarouselView() {
        const carouselTrack = carouselView?.querySelector(".carousel-track");
        const carouselIndicators = carouselView?.querySelector(
            ".carousel-indicators"
        );
        if (!carouselTrack || !carouselIndicators) return;
        carouselTrack.innerHTML = ""; 
        carouselIndicators.innerHTML = ""; 
        const visibleCards = getVisibleProjectCards(); 
        if (visibleCards.length === 0) {
            carouselView.querySelector(".carousel-container").style.display =
                "none";
            return;
        } else {
            carouselView.querySelector(".carousel-container").style.display =
                "block";
        }
        visibleCards.forEach((card, index) => {
            const title =
                card.querySelector(".card-title")?.textContent || "Project";
            const description =
                card.querySelector(".card-description")?.textContent || "";
            const imageSrc = card.querySelector(".card-image img")?.src || "";
            const links = Array.from(
                card.querySelectorAll(".card-action-btn")
            ).map((link) => ({
                href: link.getAttribute("href") || "#",
                target: link.getAttribute("target") || "",
                icon: link.innerHTML,
                isDetails: link.classList.contains("details-btn"),
                detailsTitle: link.getAttribute("data-title"),
                detailsDesc: link.getAttribute("data-description"),
            }));
            const carouselItem = document.createElement("div");
            carouselItem.className = "carousel-item";
            carouselItem.innerHTML = `
                <div class="carousel-item-inner">
                    <div class="carousel-image">
                        <img src="${imageSrc}" alt="${title}" loading="lazy">
                    </div>
                    <div class="carousel-content">
                        <h3>${title}</h3>
                        <p>${description}</p>
                         <div class="carousel-actions">
                            ${links
                                .map(
                                    (link) =>
                                        `<a href="${link.href}" ${
                                            link.target
                                                ? `target="${link.target}"`
                                                : ""
                                        }
                                   class="carousel-action-btn ${
                                       link.isDetails ? "details-btn" : ""
                                   }"
                                   ${
                                       link.isDetails
                                           ? `data-title="${link.detailsTitle}" data-description="${link.detailsDesc}"`
                                           : ""
                                   }>
                                   ${link.icon}
                                 </a>`
                                )
                                .join("")}
                        </div>
                    </div>
                </div>
            `;
            carouselTrack.appendChild(carouselItem);
            const indicator = document.createElement("button");
            indicator.className = "carousel-indicator";
            indicator.setAttribute("data-index", index);
            if (index === 0) indicator.classList.add("active");
            carouselIndicators.appendChild(indicator);
        });
        setupCarouselControls(visibleCards.length);
        setupProjectDetailModalListeners(carouselTrack);
    }
    let currentCarouselIndex = 0;
    function setupCarouselControls(itemCount) {
        const carouselTrack = carouselView?.querySelector(".carousel-track");
        const indicators = carouselView?.querySelectorAll(
            ".carousel-indicator"
        );
        const prevBtn = carouselView?.querySelector(".prev-arrow");
        const nextBtn = carouselView?.querySelector(".next-arrow");
        if (
            !carouselTrack ||
            !indicators ||
            !prevBtn ||
            !nextBtn ||
            itemCount === 0
        )
            return;
        function updateCarousel() {
            if (itemCount === 0) return;
            carouselTrack.style.transform = `translateX(-${
                currentCarouselIndex * 100
            }%)`;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle(
                    "active",
                    index === currentCarouselIndex
                );
            });
            prevBtn.disabled = currentCarouselIndex === 0;
            nextBtn.disabled = currentCarouselIndex === itemCount - 1;
        }
        prevBtn.replaceWith(prevBtn.cloneNode(true)); 
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        carouselView
            .querySelector(".prev-arrow")
            .addEventListener("click", () => {
                if (currentCarouselIndex > 0) {
                    currentCarouselIndex--;
                    updateCarousel();
                }
            });
        carouselView
            .querySelector(".next-arrow")
            .addEventListener("click", () => {
                if (currentCarouselIndex < itemCount - 1) {
                    currentCarouselIndex++;
                    updateCarousel();
                }
            });
        indicators.forEach((indicator) => {
            indicator.replaceWith(indicator.cloneNode(true)); 
            carouselView
                .querySelector(
                    `.carousel-indicator[data-index="${indicator.getAttribute(
                        "data-index"
                    )}"]`
                )
                .addEventListener("click", (e) => {
                    currentCarouselIndex = parseInt(
                        e.target.getAttribute("data-index")
                    );
                    updateCarousel();
                });
        });
        currentCarouselIndex = 0; 
        updateCarousel(); 
    }
    function setupProjectDetailModalListeners(container = document) {
        const detailButtons = container.querySelectorAll(".details-btn");
        detailButtons.forEach((button) => {
            button.addEventListener("click", handleDetailButtonClick);
        });
    }
    function handleDetailButtonClick(e) {
        e.preventDefault();
        const button = e.currentTarget; 
        const title = button.getAttribute("data-title") || "Project Details";
        const description =
            button.getAttribute("data-description") ||
            "No description available.";
        if (modal && modalTitle && modalDescription) {
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modal.style.display = "block";
            document.body.classList.add("modal-open");
        } else {
            console.error("Modal elements not found!");
        }
    }
    function setupModalCloseActions() {
        if (!modal) return;
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", () => {
                modal.style.display = "none";
                document.body.classList.remove("modal-open");
            });
        }
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.classList.remove("modal-open");
            }
        });
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.style.display === "block") {
                modal.style.display = "none";
                document.body.classList.remove("modal-open");
            }
        });
    }
    initFilterListeners();
    setupProjectViewToggle(); 
    setupModalCloseActions(); 
    setupProjectDetailModalListeners(); 
    filterProjects(); 
});