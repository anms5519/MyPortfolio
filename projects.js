document.addEventListener("DOMContentLoaded", function () {
    // Store references to frequently used elements
    const projectCards = document.querySelectorAll(".projects-grid .project-card"); // Source of truth
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

    let currentCategoryFilter = "all"; // Keep track of category filter

    // --- Filtering Logic ---
    function filterProjects() {
        if (!filterForm) return;

        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedTech = document.getElementById("tech-filter")?.value || "all";
        const selectedType = document.getElementById("type-filter")?.value || "all";
        const selectedYear = document.getElementById("year-filter")?.value || "all";

        const activeFilters = [];
        if (searchValue) activeFilters.push({ type: "search", value: searchValue });
        if (selectedTech !== "all") activeFilters.push({ type: "tech", value: selectedTech });
        if (selectedType !== "all") activeFilters.push({ type: "type", value: selectedType });
        if (selectedYear !== "all") activeFilters.push({ type: "year", value: selectedYear });
        if (currentCategoryFilter !== "all") activeFilters.push({ type: "category", value: currentCategoryFilter });

        updateActiveFilters(activeFilters);

        let visibleCount = 0;
        projectCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category") || "";
            const cardTechs = (card.getAttribute("data-techs") || "").toLowerCase();
            const cardType = card.getAttribute("data-type") || "";
            const cardYear = card.getAttribute("data-year") || "";
            const cardTitle = (card.querySelector(".card-title")?.textContent || "").toLowerCase();
            const cardDesc = (card.querySelector(".card-description")?.textContent || "").toLowerCase();

            const cardCategories = cardCategory.split(' '); // Split by space
            const matchesCategory = currentCategoryFilter === "all" || cardCategories.includes(currentCategoryFilter);
            const matchesSearch = !searchValue || cardTitle.includes(searchValue) || cardDesc.includes(searchValue);
            const matchesTech = selectedTech === "all" || cardTechs.split(',').map(t => t.trim()).includes(selectedTech);
            const matchesType = selectedType === "all" || cardType === selectedType;
            const matchesYear = selectedYear === "all" || cardYear === selectedYear;

            const isVisible = matchesCategory && matchesSearch && matchesTech && matchesType && matchesYear;

            if (isVisible) {
                // Apply styles for grid view directly
                card.style.display = "flex"; // Use flex for cards
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
                visibleCount++;
            } else {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                // Use timeout to hide after animation
                setTimeout(() => {
                    card.style.display = "none";
                }, 300); // Match transition duration
            }
        });

        // Update results count and message
        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} project${visibleCount !== 1 ? "s" : ""} found`;
        }
        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
        }

        // Re-populate list/carousel if they are currently active
        const activeViewBtn = document.querySelector(".view-btn.active");
        if (activeViewBtn) {
            const activeView = activeViewBtn.getAttribute("data-view");
            if (activeView === 'list') {
                populateListView(); // Repopulate based on new filter state
            } else if (activeView === 'carousel') {
                populateCarouselView(); // Repopulate based on new filter state
            }
        }
    }

    function updateActiveFilters(filters) {
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = ""; // Clear previous filters
        if (filters.length > 0) {
            activeFiltersContainer.style.display = "flex";
            filters.forEach((filter) => {
                const filterTag = document.createElement("div");
                filterTag.className = "active-filter";
                let filterLabel = "Unknown";
                switch (filter.type) {
                    case "search": filterLabel = "Search"; break;
                    case "tech": filterLabel = "Technology"; break;
                    case "type": filterLabel = "Type"; break;
                    case "year": filterLabel = "Year"; break;
                    case "category": filterLabel = "Category"; break;
                }

                filterTag.innerHTML = `
                    ${filterLabel}: ${filter.value}
                    <button class="remove-filter" data-type="${filter.type}" data-value="${filter.value}">×</button>
                `;
                activeFiltersContainer.appendChild(filterTag);

                // Add event listener to the remove button
                filterTag.querySelector(".remove-filter").addEventListener("click", function () {
                    const filterType = this.getAttribute("data-type");
                    if (filterType === "search" && searchInput) {
                        searchInput.value = "";
                    } else if (filterType === "tech") {
                        document.getElementById("tech-filter").value = "all";
                    } else if (filterType === "type") {
                        document.getElementById("type-filter").value = "all";
                    } else if (filterType === "year") {
                        document.getElementById("year-filter").value = "all";
                    } else if (filterType === "category") {
                        // Reset category filter UI and state
                        projectFilterButtons.forEach(btn => btn.classList.remove("active"));
                        document.querySelector('.project-filter[data-filter="all"]').classList.add("active");
                        currentCategoryFilter = "all";
                    }
                    filterProjects(); // Re-apply filters
                });
            });
        } else {
            activeFiltersContainer.style.display = "none";
        }
    }

    // --- Event Listeners Setup ---
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
                filterSelects.forEach((select) => { select.selectedIndex = 0; });
                // Also reset category filter
                projectFilterButtons.forEach(btn => btn.classList.remove("active"));
                document.querySelector('.project-filter[data-filter="all"]').classList.add("active");
                currentCategoryFilter = "all";
                filterProjects();
            });
        }

        if (projectFilterButtons.length > 0) {
            projectFilterButtons.forEach((button) => {
                button.addEventListener("click", function () {
                    projectFilterButtons.forEach((btn) => btn.classList.remove("active"));
                    this.classList.add("active");
                    currentCategoryFilter = this.getAttribute("data-filter");
                    filterProjects(); // Use the main filter function
                });
            });
        }
    }

    // --- View Toggling ---
    function setupProjectViewToggle() {
        if (!viewBtns.length) return;

        viewBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                viewBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                // Hide all views first
                if (gridView) gridView.style.display = "none";
                if (listView) listView.style.display = "none";
                if (carouselView) carouselView.style.display = "none";
                if (threeDView) threeDView.style.display = "none";

                const viewType = btn.getAttribute("data-view");

                // Show the selected view
                if (viewType === "grid" && gridView) {
                    gridView.style.display = "grid";
                    // Grid always shows filtered cards directly, no population needed
                } else if (viewType === "list" && listView) {
                    listView.style.display = "block";
                    populateListView(); // Populate based on current filters
                } else if (viewType === "carousel" && carouselView) {
                    carouselView.style.display = "block";
                    populateCarouselView(); // Populate based on current filters
                } else if (viewType === "3d" && threeDView) {
                    threeDView.style.display = "block";
                    // Add any necessary 3D scene initialization here
                }
            });
        });

        // Activate the default view (Grid) on load
        const defaultViewBtn = document.querySelector('.view-btn[data-view="grid"]');
        if (defaultViewBtn) {
            defaultViewBtn.click(); // Programmatically click the grid button
        } else if (viewBtns.length > 0) {
            viewBtns[0].click(); // Or click the first button if grid isn't found
        }
    }

    // --- View Population ---
    function getVisibleProjectCards() {
        // Return card elements that are currently visible based on filter state
        // We check the display style set by filterProjects
        return Array.from(projectCards).filter(card => card.style.display !== 'none');
    }

    function populateListView() {
        const listContainer = listView?.querySelector(".projects-list");
        if (!listContainer) return;

        listContainer.innerHTML = ""; // Clear previous items
        const visibleCards = getVisibleProjectCards(); // Get only filtered cards

        if (visibleCards.length === 0) {
            // Optionally display a message within the list view
            // listContainer.innerHTML = "<p>No projects match the current filters.</p>";
            return;
        }

        visibleCards.forEach((card) => {
            const title = card.querySelector(".card-title")?.textContent || "Project";
            const description = card.querySelector(".card-description")?.textContent || "";
            const imageSrc = card.querySelector(".card-image img")?.src || "";
            const tags = Array.from(card.querySelectorAll(".tech-tag")).map(tag => tag.textContent);
            const links = Array.from(card.querySelectorAll(".card-action-btn")).map(link => ({
                href: link.getAttribute("href") || "#",
                target: link.getAttribute("target") || "",
                icon: link.innerHTML,
                isDetails: link.classList.contains('details-btn'),
                detailsTitle: link.getAttribute('data-title'),
                detailsDesc: link.getAttribute('data-description')
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
                        ${tags.map((tag) => `<span class="list-tag">${tag}</span>`).join("")}
                    </div>
                </div>
                <div class="list-item-actions">
                    ${links.map(link =>
                        `<a href="${link.href}" ${link.target ? `target="${link.target}"` : ''}
                           class="list-action-btn ${link.isDetails ? 'details-btn' : ''}"
                           ${link.isDetails ? `data-title="${link.detailsTitle}" data-description="${link.detailsDesc}"` : ''}>
                           ${link.icon}
                         </a>`
                    ).join("")}
                </div>
            `;
            listContainer.appendChild(listItem);
        });
        // Re-attach modal listeners if details buttons were added
        setupProjectDetailModalListeners(listContainer);
    }

    function populateCarouselView() {
        const carouselTrack = carouselView?.querySelector(".carousel-track");
        const carouselIndicators = carouselView?.querySelector(".carousel-indicators");
        if (!carouselTrack || !carouselIndicators) return;

        carouselTrack.innerHTML = ""; // Clear previous items
        carouselIndicators.innerHTML = ""; // Clear previous indicators
        const visibleCards = getVisibleProjectCards(); // Get only filtered cards

        if (visibleCards.length === 0) {
            // Optionally hide carousel controls or display a message
            carouselView.querySelector('.carousel-container').style.display = 'none';
            return;
        } else {
             carouselView.querySelector('.carousel-container').style.display = 'block';
        }


        visibleCards.forEach((card, index) => {
            const title = card.querySelector(".card-title")?.textContent || "Project";
            const description = card.querySelector(".card-description")?.textContent || "";
            const imageSrc = card.querySelector(".card-image img")?.src || "";
            const links = Array.from(card.querySelectorAll(".card-action-btn")).map(link => ({
                href: link.getAttribute("href") || "#",
                target: link.getAttribute("target") || "",
                icon: link.innerHTML,
                isDetails: link.classList.contains('details-btn'),
                detailsTitle: link.getAttribute('data-title'),
                detailsDesc: link.getAttribute('data-description')
            }));


            const carouselItem = document.createElement("div");
            carouselItem.className = "carousel-item";
            // Add actions to carousel item as well
            carouselItem.innerHTML = `
                <div class="carousel-item-inner">
                    <div class="carousel-image">
                        <img src="${imageSrc}" alt="${title}" loading="lazy">
                    </div>
                    <div class="carousel-content">
                        <h3>${title}</h3>
                        <p>${description}</p>
                         <div class="carousel-actions">
                            ${links.map(link =>
                                `<a href="${link.href}" ${link.target ? `target="${link.target}"` : ''}
                                   class="carousel-action-btn ${link.isDetails ? 'details-btn' : ''}"
                                   ${link.isDetails ? `data-title="${link.detailsTitle}" data-description="${link.detailsDesc}"` : ''}>
                                   ${link.icon}
                                 </a>`
                            ).join("")}
                        </div>
                    </div>
                </div>
            `;
            carouselTrack.appendChild(carouselItem);

            // Create indicator
            const indicator = document.createElement("button");
            indicator.className = "carousel-indicator";
            indicator.setAttribute("data-index", index);
            if (index === 0) indicator.classList.add("active");
            carouselIndicators.appendChild(indicator);
        });

        setupCarouselControls(visibleCards.length);
        // Re-attach modal listeners if details buttons were added
        setupProjectDetailModalListeners(carouselTrack);
    }

    // --- Carousel Controls ---
    let currentCarouselIndex = 0;
    function setupCarouselControls(itemCount) {
        const carouselTrack = carouselView?.querySelector(".carousel-track");
        const indicators = carouselView?.querySelectorAll(".carousel-indicator");
        const prevBtn = carouselView?.querySelector(".prev-arrow");
        const nextBtn = carouselView?.querySelector(".next-arrow");

        if (!carouselTrack || !indicators || !prevBtn || !nextBtn || itemCount === 0) return;

        function updateCarousel() {
            if (itemCount === 0) return;
            carouselTrack.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle("active", index === currentCarouselIndex);
            });
            prevBtn.disabled = currentCarouselIndex === 0;
            nextBtn.disabled = currentCarouselIndex === itemCount - 1;
        }

        // Remove previous listeners before adding new ones to prevent duplicates
        prevBtn.replaceWith(prevBtn.cloneNode(true)); // Clone to remove listeners
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        carouselView.querySelector(".prev-arrow").addEventListener("click", () => {
            if (currentCarouselIndex > 0) {
                currentCarouselIndex--;
                updateCarousel();
            }
        });
        carouselView.querySelector(".next-arrow").addEventListener("click", () => {
             if (currentCarouselIndex < itemCount - 1) {
                currentCarouselIndex++;
                updateCarousel();
            }
        });

        indicators.forEach((indicator) => {
            indicator.replaceWith(indicator.cloneNode(true)); // Clone to remove listeners
            carouselView.querySelector(`.carousel-indicator[data-index="${indicator.getAttribute('data-index')}"]`)
                .addEventListener("click", (e) => {
                    currentCarouselIndex = parseInt(e.target.getAttribute("data-index"));
                    updateCarousel();
                });
        });

        currentCarouselIndex = 0; // Reset index when repopulating
        updateCarousel(); // Initial setup
    }


    // --- Modal Logic ---
    function setupProjectDetailModalListeners(container = document) {
        // Use event delegation or query within the specific container
        const detailButtons = container.querySelectorAll(".details-btn");

        detailButtons.forEach((button) => {
            // Remove existing listener before adding (optional, good practice if re-running)
            // button.removeEventListener('click', handleDetailButtonClick);
            button.addEventListener('click', handleDetailButtonClick);
        });
    }

    function handleDetailButtonClick(e) {
         e.preventDefault();
         const button = e.currentTarget; // Use currentTarget for delegated events
         const title = button.getAttribute("data-title") || "Project Details";
         const description = button.getAttribute("data-description") || "No description available.";

         if (modal && modalTitle && modalDescription) {
             modalTitle.textContent = title;
             modalDescription.textContent = description;
             modal.style.display = "block";
             // Add class to body to prevent scrolling when modal is open
             document.body.classList.add('modal-open');
         } else {
             console.error("Modal elements not found!");
         }
    }

    function setupModalCloseActions() {
        if (!modal) return;

        // Close button listener
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", () => {
                modal.style.display = "none";
                document.body.classList.remove('modal-open');
            });
        }

        // Window click listener (close if clicked outside content)
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.classList.remove('modal-open');
            }
        });

        // Keyboard listener (close with Escape key)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                 modal.style.display = "none";
                 document.body.classList.remove('modal-open');
            }
        });
    }

    // --- Initialization ---
    initFilterListeners();
    setupProjectViewToggle(); // This will trigger the initial view and potentially population
    setupModalCloseActions(); // Setup modal close listeners once
    setupProjectDetailModalListeners(); // Setup listeners for initial grid view cards
    filterProjects(); // Apply initial filter state (e.g., show all)

});