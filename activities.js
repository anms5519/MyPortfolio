document.addEventListener("DOMContentLoaded", function () {
    initializeActivitiesSection();
});
function initializeActivitiesSection() {
    const activityTabs = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    if (activityTabs.length > 0) {
        activityTabs.forEach((tab) => {
            tab.addEventListener("click", function () {
                activityTabs.forEach((t) => t.classList.remove("active"));
                this.classList.add("active");
                const tabId = this.getAttribute("data-tab");
                tabContents.forEach((content) => {
                    content.classList.remove("active");
                });
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            });
        });
    }
    const activityFilter = document.getElementById("activity-filter");
    const activityCards = document.querySelectorAll(".activity-card");
    if (activityFilter) {
        activityFilter.addEventListener("change", function () {
            const filterValue = this.value;
            activityCards.forEach((card) => {
                if (
                    filterValue === "all" ||
                    card.getAttribute("data-activity-type") === filterValue
                ) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
    const searchInput = document.getElementById("activity-search");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchValue = this.value.toLowerCase();
            if (searchValue.length === 0) {
                const currentFilter = activityFilter
                    ? activityFilter.value
                    : "all";
                activityCards.forEach((card) => {
                    if (
                        currentFilter === "all" ||
                        card.getAttribute("data-activity-type") ===
                            currentFilter
                    ) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            } else {
                activityCards.forEach((card) => {
                    const activityText =
                        card.getAttribute("data-activity-search") ||
                        card.textContent.toLowerCase();
                    if (activityText.includes(searchValue)) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            }
        });
    }
    const animateCards = () => {
        activityCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("animated");
            }, index * 100);
        });
    };
    const activitiesSection = document.querySelector(".activities-section");
    if (activitiesSection) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCards();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(activitiesSection);
    }
}
function enrichActivityCards() {
    const activityCards = document.querySelectorAll(
        ".activity-card:not([data-activity-search])"
    );
    activityCards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent || "";
        const role = card.querySelector(".activity-role")?.textContent || "";
        const description =
            card.querySelector(".activity-body p")?.textContent || "";
        const searchText = `${title} ${role} ${description}`.toLowerCase();
        card.setAttribute("data-activity-search", searchText);
    });
}
document.addEventListener("DOMContentLoaded", enrichActivityCards);