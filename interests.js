document.addEventListener("DOMContentLoaded", function () {
    initializeInterestsSection();
});
function initializeInterestsSection() {
    const interestTabs = document.querySelectorAll(".interest-tab");
    const tabContents = document.querySelectorAll(".tab-content");
    if (interestTabs.length > 0) {
        interestTabs.forEach((tab) => {
            tab.addEventListener("click", function () {
                interestTabs.forEach((t) => t.classList.remove("active"));
                this.classList.add("active");
                const tabId = this.getAttribute("data-tab");
                tabContents.forEach((content) => {
                    content.classList.remove("active");
                });
                const targetContent = document.getElementById(
                    tabId + "-content"
                );
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            });
        });
    }
    applyInterestCardEffects();
}
function applyInterestCardEffects() {
    const interestCards = document.querySelectorAll(".interest-card");
    interestCards.forEach((card) => {
        card.addEventListener("mousemove", function (e) {
            if (window.innerWidth < 768) return;
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            this.style.transform = `perspective(1000px) rotateX(${
                -deltaY * la
            }deg) rotateY(${deltaX * 10}deg) translateZ(10px)`;
            const shine =
                this.querySelector(".card-shine") ||
                document.createElement("div");
            if (!this.querySelector(".card-shine")) {
                shine.classList.add("card-shine");
                this.appendChild(shine);
            }
            shine.style.backgroundImage = `
      radial-gradient(
        circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, 
        rgba(255, 255, 255, 0.4), 
        transparent
      )
    `;
        });
        card.addEventListener("mouseleave", function () {
            this.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
            const shine = this.querySelector(".card-shine");
            if (shine) {
                shine.style.backgroundImage = "none";
            }
        });
        const cardInner = card.querySelector(".interest-card-inner");
        if (cardInner) {
            card.addEventListener("click", function () {
                if (cardInner.style.transform === "rotateY(180deg)") {
                    cardInner.style.transform = "rotateY(0deg)";
                } else {
                    cardInner.style.transform = "rotateY(180deg)";
                }
            });
        }
    });
}