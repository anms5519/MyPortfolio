document.addEventListener("DOMContentLoaded", function () {
    const searchContainer = document.querySelector(
        ".legendary-search-container"
    );
    const searchInput = document.getElementById("portfolio-search");
    const searchResults = document.getElementById("search-results");
    const searchResultsList = document.getElementById("search-results-list");
    const searchResultCount = document.getElementById("search-result-count");
    const prevResultBtn = document.getElementById("prev-result");
    const nextResultBtn = document.getElementById("next-result");
    const searchSuggestion = document.getElementById("search-suggestion");
    let currentHighlightIndex = -1;
    let searchHighlights = [];
    let searchTimeout = null;
    let isSearching = false;
    let allContent = [];
    let searchSuggestions = [];
    const searchCache = new Map(); // Add search result caching
    let categories = [
        "skills",
        "projects",
        "experiences",
        "education",
        "contact",
    ];
    let currentCategory = "all";
    function initLegendarySearch() {
        if (!searchInput || !searchResults) return;
        searchContainer.classList.add("legendary-initialized");
        createCategoryFilter();
        indexContent();
const debounceSearch = debounce((searchTerm) => {
                performSearch(searchTerm);
                if (searchHighlights.length > 0) {
                    currentHighlightIndex = 0;
                    searchHighlights[currentHighlightIndex].classList.add("current");
                    scrollToHighlight(currentHighlightIndex);
                    showNavigationControls();
                }
            }, 300);
        searchInput.addEventListener("input", () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            searchContainer.classList.add("searching");
            provideSuggestions(searchInput.value);
                const searchTerm = searchInput.value.toLowerCase().trim();
                debounceSearch(searchTerm);
        });
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                navigateHighlights(e.key === "ArrowDown" ? 1 : -1);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (
                    searchSuggestion.textContent &&
                    searchHighlights.length === 0
                ) {
                    searchInput.value = searchSuggestion.textContent;
                    searchSuggestion.textContent = "";
                    performSearch(searchInput.value.toLowerCase().trim());
                    if (searchHighlights.length > 0) {
                        currentHighlightIndex = 0;
                        searchHighlights[currentHighlightIndex].classList.add(
                            "current"
                        );
                        scrollToHighlight(currentHighlightIndex);
                    }
                } else if (currentHighlightIndex >= 0) {
                    scrollToHighlight(currentHighlightIndex);
                }
            } else if (e.key === "Escape") {
                clearSearch();
            } else if (e.key === "Tab" && searchSuggestion.textContent) {
                e.preventDefault();
                searchInput.value = searchSuggestion.textContent;
                searchSuggestion.textContent = "";
                performSearch(searchInput.value.toLowerCase().trim());
                if (searchHighlights.length > 0) {
                    currentHighlightIndex = 0;
                    searchHighlights[currentHighlightIndex].classList.add(
                        "current"
                    );
                    scrollToHighlight(currentHighlightIndex);
                }
            }
        });
        if (prevResultBtn) {
            prevResultBtn.addEventListener("click", () =>
                navigateHighlights(-1)
            );
        }
        if (nextResultBtn) {
            nextResultBtn.addEventListener("click", () =>
                navigateHighlights(1)
            );
        }
        addClearButton();
        createFloatingNavigationControls();
    }
    function indexContent() {
        const searchableElements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, p, li, .skill-item, .project-card, .experience-item, .education-item"
        );
        searchableElements.forEach((element) => {
            const text = element.textContent.trim();
            if (text.length > 0) {
                let category = "general";
                if (
                    element.closest("#skills") ||
                    element.classList.contains("skill-item")
                ) {
                    category = "skills";
                } else if (
                    element.closest("#projects") ||
                    element.classList.contains("project-card")
                ) {
                    category = "projects";
                } else if (
                    element.closest("#experience") ||
                    element.classList.contains("experience-item")
                ) {
                    category = "experiences";
                } else if (
                    element.closest("#education") ||
                    element.classList.contains("education-item")
                ) {
                    category = "education";
                } else if (element.closest("#contact")) {
                    category = "contact";
                }
                allContent.push({
                    element: element,
                    text: text,
                    category: category,
                    tokens: text.toLowerCase().split(/\s+/),
                });
                if (category === "skills" || text.length < 20) {
                    searchSuggestions.push(text);
                }
            }
        });
        searchSuggestions = [...new Set(searchSuggestions)]
            .filter((text) => text.length > 2 && text.length < 30)
            .sort((a, b) => a.length - b.length);
    }
    function createCategoryFilter() {
        const filterContainer = document.createElement("div");
        filterContainer.className = "search-category-filter";
        const filterSelect = document.createElement("select");
        filterSelect.id = "search-category-select";
        filterSelect.className = "search-category-select";
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Content";
        filterSelect.appendChild(allOption);
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent =
                category.charAt(0).toUpperCase() + category.slice(1);
            filterSelect.appendChild(option);
        });
        filterContainer.appendChild(filterSelect);
        searchContainer.appendChild(filterContainer);
        filterSelect.addEventListener("change", function () {
            currentCategory = this.value;
            if (searchInput.value.trim().length > 0) {
                performSearch(searchInput.value.toLowerCase().trim());
            }
        });
    }
    function addClearButton() {
        const clearButton = document.createElement("button");
        clearButton.className = "search-clear-btn";
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.setAttribute("aria-label", "Clear search");
        clearButton.addEventListener("click", clearSearch);
        searchContainer.insertBefore(clearButton, searchResults);
    }
    function provideSuggestions(value) {
        if (!searchSuggestion) return;
        if (!value.trim()) {
            searchSuggestion.textContent = "";
            return;
        }
        const inputLower = value.toLowerCase();
        const matchingSuggestions = searchSuggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().startsWith(inputLower) &&
                suggestion.toLowerCase() !== inputLower
        );
        if (matchingSuggestions.length > 0) {
            const bestSuggestion = matchingSuggestions.sort(
                (a, b) => a.length - b.length
            )[0];
            searchSuggestion.textContent = bestSuggestion;
        } else {
            searchSuggestion.textContent = "";
        }
    }
    function performSearch(searchTerm) {
        if (!searchTerm) {
            clearSearch();
            return;
        }
        // Check cache first
        const cacheKey = `${searchTerm}-${currentCategory}`;
        if (searchCache.has(cacheKey)) {
            const cachedResults = searchCache.get(cacheKey);
            updateSearchResults(cachedResults);
            return;
        }
        currentHighlightIndex = -1;
        searchHighlights = [];
        searchResultsList.innerHTML = "";
        currentHighlightIndex = -1;
        searchHighlights = [];
        searchResultsList.innerHTML = "";
        const terms = searchTerm.split(/\s+/).filter((term) => term.length > 0);
        if (terms.length === 0) return;
        let matchCount = 0;
        allContent.forEach((item) => {
            if (
                currentCategory !== "all" &&
                item.category !== currentCategory
            ) {
                return;
            }
            let isMatch = false;
            let matchScore = 0;
            for (const term of terms) {
                if (item.text.toLowerCase().includes(term)) {
                    isMatch = true;
                    matchScore += 10;
                    continue;
                }
                for (const token of item.tokens) {
                    const distance = levenshteinDistance(token, term);
                    if (
                        distance <= Math.max(2, Math.floor(term.length * 0.3))
                    ) {
                        isMatch = true;
                        matchScore += 5 - Math.min(4, distance);
                    }
                }
            }
            if (isMatch) {
                const element = item.element;
                const matches = fuzzyFindMatches(item.text, terms);
                matches.sort((a, b) => b.score - a.score);
                matches.slice(0, 3).forEach((match) => {
                    const highlight = createHighlight(
                        element,
                        match,
                        matchScore
                    );
                    if (highlight) {
                        searchHighlights.push({
                            element: highlight,
                            score: matchScore,
                        });
                        matchCount++;
                    }
                });
            }
        });
        searchHighlights.sort((a, b) => b.score - a.score);
        searchHighlights = searchHighlights.map((h) => h.element);
        updateSearchUI(matchCount);
    }
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a[j - 1] === b[i - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[b.length][a.length];
    }
    function fuzzyFindMatches(text, searchTerms) {
        const matches = [];
        const textLower = text.toLowerCase();
        for (const term of searchTerms) {
            let index = textLower.indexOf(term);
            while (index !== -1) {
                matches.push({
                    start: index,
                    end: index + term.length,
                    matchedTerm: term,
                    exact: true,
                    score: 10,
                });
                index = textLower.indexOf(term, index + 1);
            }
        }
        if (matches.length < 3) {
            const words = text.split(/\s+/);
            let currentIndex = 0;
            for (const word of words) {
                const wordLower = word.toLowerCase();
                for (const term of searchTerms) {
                    const distance = levenshteinDistance(wordLower, term);
                    if (
                        distance <=
                            Math.max(2, Math.floor(term.length * 0.3)) &&
                        !wordLower.includes(term)
                    ) {
                        matches.push({
                            start: currentIndex,
                            end: currentIndex + word.length,
                            matchedTerm: term,
                            exact: false,
                            score: 5 - Math.min(4, distance),
                        });
                    }
                }
                currentIndex += word.length + 1;
            }
        }
        return matches;
    }
    function createHighlight(element, match, score) {
        const text = element.textContent;
        const before = text.substring(0, match.start);
        const matched = text.substring(match.start, match.end);
        const after = text.substring(match.end);
        if (!element.dataset.originalContent) {
            element.dataset.originalContent = text;
        }
        element.innerHTML = `${before}<span class="highlight-text">${matched}</span>${after}`;
        element.classList.add("contains-highlight");
        element.dataset.matchScore = score;
        element.dataset.matchTerm = match.matchedTerm;
        if (!match.exact) {
            element.classList.add("fuzzy-match");
        }
        let icon = "fa-file-alt";
        let category = "General";
        if (
            element.closest("#skills") ||
            element.classList.contains("skill-item")
        ) {
            icon = "fa-tools";
            category = "Skills";
        } else if (
            element.closest("#projects") ||
            element.classList.contains("project-card")
        ) {
            icon = "fa-project-diagram";
            category = "Projects";
        } else if (
            element.closest("#experience") ||
            element.classList.contains("experience-item")
        ) {
            icon = "fa-briefcase";
            category = "Experience";
        } else if (
            element.closest("#education") ||
            element.classList.contains("education-item")
        ) {
            icon = "fa-graduation-cap";
            category = "Education";
        } else if (element.closest("#contact")) {
            icon = "fa-address-card";
            category = "Contact";
        } else if (element.tagName === "H1" || element.tagName === "H2") {
            icon = "fa-heading";
            category = "Heading";
        }
        const resultItem = document.createElement("div");
        resultItem.className = "search-result-item";
        if (!match.exact) {
            resultItem.classList.add("fuzzy-match");
        }
        resultItem.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="result-content">
                <span class="result-title">${
                    match.exact
                        ? highlightTextInHTML(matched, match.matchedTerm)
                        : `<span class="fuzzy-match-indicator">~</span> ${matched}`
                }
                </span>
                <span class="result-context">${before.slice(-20)}…${after.slice(
            0,
            20
        )}</span>
            </div>
            <span class="result-category">${category}</span>
        `;
        const currentIndex = searchHighlights.length;
        resultItem.addEventListener("click", () => {
            if (
                currentHighlightIndex >= 0 &&
                searchHighlights[currentHighlightIndex]
            ) {
                searchHighlights[currentHighlightIndex].classList.remove(
                    "current"
                );
            }
            currentHighlightIndex = currentIndex;
            if (searchHighlights[currentHighlightIndex]) {
                searchHighlights[currentHighlightIndex].classList.add(
                    "current"
                );
                scrollToHighlight(currentHighlightIndex);
            }
            searchResults.classList.remove("active");
        });
        searchResultsList.appendChild(resultItem);
        return element;
    }
    function highlightTextInHTML(text, term) {
        const textLower = text.toLowerCase();
        const termLower = term.toLowerCase();
        let result = "";
        let lastIndex = 0;
        let index = textLower.indexOf(termLower);
        while (index !== -1) {
            result += text.substring(lastIndex, index);
            result += `<span class="internal-highlight">${text.substring(
                index,
                index + term.length
            )}</span>`;
            lastIndex = index + term.length;
            index = textLower.indexOf(termLower, lastIndex);
        }
        result += text.substring(lastIndex);
        return result;
    }
    function updateSearchUI(matchCount) {
        const ITEMS_PER_PAGE = 20;
        let currentPage = 0;
        function renderResultPage(page) {
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const pageResults = searchHighlights.slice(start, end);
            
            searchResultsList.innerHTML = '';
            pageResults.forEach(result => {
                // Render result item
                const resultItem = createResultItem(result);
                searchResultsList.appendChild(resultItem);
            });
        }
        if (searchResultCount) {
            searchResultCount.innerHTML = matchCount > 0
                ? `<span class="match-count">${matchCount}</span> ${matchCount === 1 ? "result" : "results"}`
                    : `<span class="no-match">No matches found</span>`;
        }
        if (searchResults) {
            searchResults.classList.toggle("active", matchCount > 0);
            if (matchCount === 0 && searchInput.value.trim().length > 0) {
                searchResultsList.innerHTML = `
                    <div class="empty-results">
                        <i class="fas fa-search-minus"></i>
                        <p>No matches found for "${searchInput.value}"</p>
                        <p class="empty-suggestion">Try different keywords or browse categories</p>
                    </div>
                `;
                searchResults.classList.add("active");
                hideNavigationControls();
            } else if (matchCount > 0) {
                showNavigationControls();
            }
        }
        if (prevResultBtn) {
            prevResultBtn.disabled = matchCount === 0;
        }
        if (nextResultBtn) {
            nextResultBtn.disabled = matchCount === 0;
        }
        searchContainer.classList.toggle(
            "searching",
            matchCount > 0 || searchInput.value.trim().length > 0
        );
        searchContainer.classList.toggle("has-results", matchCount > 0);
    }
    function navigateHighlights(direction) {
        if (searchHighlights.length === 0) return;
        if (currentHighlightIndex >= 0) {
            searchHighlights[currentHighlightIndex].classList.remove("current");
        }
        currentHighlightIndex =
            (currentHighlightIndex + direction + searchHighlights.length) %
            searchHighlights.length;
        searchHighlights[currentHighlightIndex].classList.add("current");
        const navStatus =
            document.querySelector(".navigation-status") ||
            (() => {
                const status = document.createElement("div");
                status.className = "navigation-status";
                searchResultCount.parentNode.appendChild(status);
                return status;
            })();
        navStatus.innerHTML = `<span class="current-match">${
            currentHighlightIndex + 1
        }</span>/<span class="total-matches">${searchHighlights.length}</span>`;
        navStatus.classList.add("updating");
        setTimeout(() => navStatus.classList.remove("updating"), 300);
        const floatingNav = document.querySelector(".search-floating-nav");
        if (floatingNav) {
            const currentIndexEl = floatingNav.querySelector(
                ".search-current-index"
            );
            if (currentIndexEl) {
                currentIndexEl.textContent = currentHighlightIndex + 1;
            }
        }
        scrollToHighlight(currentHighlightIndex);
    }
    function scrollToHighlight(index) {
        const highlight = searchHighlights[index];
        if (!highlight) return;
        console.log("Scrolling to highlight:", highlight);
        makeHighlightVisible(highlight);
        setTimeout(() => {
            highlight.classList.add("pre-animating");
            const rect = highlight.getBoundingClientRect();
            const isInView =
                rect.top >= 50 && rect.bottom <= window.innerHeight - 50;
            if (!isInView) {
                const topPosition =
                    window.pageYOffset + rect.top - window.innerHeight / 2;
                window.scrollTo({
                    top: topPosition,
                    behavior: "smooth",
                });
            }
            setTimeout(() => {
                highlight.classList.remove("pre-animating");
                highlight.classList.add("animating");
                setTimeout(() => {
                    highlight.classList.remove("animating");
                    highlight.classList.add("post-animating");
                    setTimeout(() => {
                        highlight.classList.remove("post-animating");
                    }, 300);
                }, 300);
            }, 300);
        }, 50);
    }
    function makeHighlightVisible(highlight) {
        const collapsedSection = highlight.closest(
            '.collapsed, .section-collapsed, [aria-expanded="false"]'
        );
        if (collapsedSection) {
            const expandButton = collapsedSection.querySelector(
                ".expand-btn, .toggle-btn, [aria-controls]"
            );
            if (expandButton) {
                expandButton.click();
            } else {
                collapsedSection.classList.remove(
                    "collapsed",
                    "section-collapsed"
                );
                collapsedSection.setAttribute("aria-expanded", "true");
            }
        }
        const tabContent = highlight.closest(".tab-content, .tab-pane");
        if (tabContent && !tabContent.classList.contains("active")) {
            const tabId = tabContent.id;
            if (tabId) {
                const tabButton = document.querySelector(
                    `[data-tab="${tabId}"], [aria-controls="${tabId}"], [href="#${tabId}"]`
                );
                if (tabButton) {
                    tabButton.click();
                }
            }
            tabContent.classList.add("active", "show");
        }
    }
    function createFloatingNavigationControls() {
        const floatingNav = document.createElement("div");
        floatingNav.className = "search-floating-nav";
        floatingNav.innerHTML = `
            <div class="search-nav-info">
                <span class="search-current-index">0</span>/<span class="search-total-count">0</span>
            </div>
            <div class="search-nav-buttons">
                <button class="search-nav-prev" aria-label="Previous result">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <button class="search-nav-next" aria-label="Next result">
                    <i class="fas fa-chevron-down"></i>
                </button>
                <button class="search-nav-close" aria-label="Close search">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(floatingNav);
        const prevBtn = floatingNav.querySelector(".search-nav-prev");
        const nextBtn = floatingNav.querySelector(".search-nav-next");
        const closeBtn = floatingNav.querySelector(".search-nav-close");
        prevBtn.addEventListener("click", () => navigateHighlights(-1));
        nextBtn.addEventListener("click", () => navigateHighlights(1));
        closeBtn.addEventListener("click", clearSearch);
        floatingNav.style.display = "none";
    }
    function showNavigationControls() {
        const floatingNav = document.querySelector(".search-floating-nav");
        if (floatingNav) {
            floatingNav.style.display = "flex";
            const currentIndexEl = floatingNav.querySelector(
                ".search-current-index"
            );
            const totalCountEl = floatingNav.querySelector(
                ".search-total-count"
            );
            if (currentIndexEl && totalCountEl) {
                currentIndexEl.textContent = currentHighlightIndex + 1;
                totalCountEl.textContent = searchHighlights.length;
            }
        }
    }
    function hideNavigationControls() {
        const floatingNav = document.querySelector(".search-floating-nav");
        if (floatingNav) {
            floatingNav.style.display = "none";
        }
    }
    function clearSearch() {
        searchInput.value = "";
        searchResults.classList.remove("active");
        searchSuggestion.textContent = "";
        searchContainer.classList.add("clearing");
        setTimeout(() => {
            searchContainer.classList.remove("searching");
            searchContainer.classList.remove("clearing");
            searchContainer.classList.remove("has-results");
        }, 300);
        document.querySelectorAll(".contains-highlight").forEach((el) => {
            el.classList.remove(
                "contains-highlight",
                "current",
                "pre-animating",
                "animating",
                "post-animating",
                "fuzzy-match"
            );
            if (el.dataset.originalContent) {
                el.textContent = el.dataset.originalContent;
            }
        });
        currentHighlightIndex = -1;
        searchHighlights = [];
        searchResultsList.innerHTML = "";
        if (searchResultCount) {
            searchResultCount.textContent = "";
        }
        const navStatus = document.querySelector(".navigation-status");
        if (navStatus) {
            navStatus.remove();
        }
        hideNavigationControls();
        searchInput.focus();
    }
    initLegendarySearch();
});