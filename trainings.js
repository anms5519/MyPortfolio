document.addEventListener("DOMContentLoaded", function () {
  initTrainingsSection();
});
function initTrainingsSection() {
  const trainingsSection = document.getElementById("trainings");
  if (!trainingsSection) return;
  setupFilterButtons();
  setupTrainingCards();
  applyCardEffects();
}
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const trainingCards = document.querySelectorAll(".training-card");
  if (filterButtons.length > 0) {
      filterButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
              filterButtons.forEach((b) => b.classList.remove("active"));
              this.classList.add("active");
              const filterValue = this.getAttribute("data-filter");
              filterTrainingCards(filterValue);
          });
      });
  }
  function filterTrainingCards(filterValue) {
      const trainingCards = document.querySelectorAll(".training-card");
      let visibleCount = 0;
      trainingCards.forEach((card, index) => {
          const category = card.getAttribute("data-category");
          if (filterValue === "all" || category === filterValue) {
              card.style.display = "flex";
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              setTimeout(() => {
                  card.style.opacity = "1";
                  card.style.transform = "translateY(0)";
              }, visibleCount * 50);
              visibleCount++;
          } else {
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              setTimeout(() => {
                  card.style.display = "none";
              }, 300);
          }
      });
  }
}
function setupTrainingCards() {
  const trainingCards = document.querySelectorAll(".training-card");
  trainingCards.forEach((card) => {
      card.addEventListener("click", function () {
          const title = this.querySelector("h3").textContent;
          const description = this.querySelector("p").textContent;
          const icon = this.querySelector(".training-icon i").className;
          const details = Array.from(
              this.querySelectorAll(".training-details span")
          ).map((span) => span.textContent);
          createTrainingModal(title, description, details[0] || "2023", icon);
      });
  });
}
function createTrainingModal(title, description, date, iconClass) {
  const existingModal = document.querySelector(".training-modal");
  if (existingModal) {
      existingModal.remove();
  }
  const keywords = [
      "Concepts",
      "Techniques",
      "Applications",
      "Implementation",
      "Practices",
      "Optimization",
  ];
  const topics = [
      `Introduction to ${title} Concepts`,
      `Practical Applications in ${title}`,
      `Technical Implementation Strategies`,
      `Best Practices for ${title}`,
      `Advanced Techniques and Methods`,
      `Real-world Examples and Case Studies`,
  ];
  const skills = [
      "Problem Solving",
      "Technical Communication",
      "Analytical Thinking",
      "Project Management",
      "Critical Analysis",
      "Team Collaboration",
  ];
  const modal = document.createElement("div");
  modal.className = "training-modal";
  modal.innerHTML = `
<div class="training-modal-content">
  <button class="modal-close-btn">&times;</button>
  <div class="training-modal-header">
    <h3>${title}</h3>
    <div class="training-modal-provider">
      <div class="modal-provider-logo">
        <i class="${iconClass}"></i>
      </div>
      <div class="modal-provider-info">
        <div class="modal-provider-name">Professional Training</div>
        <div class="modal-training-date">${date}</div>
      </div>
    </div>
    <div class="training-modal-details">
      <div class="modal-training-detail">
        <i class="fas fa-calendar-alt"></i>
        <span>${date}</span>
      </div>
      <div class="modal-training-detail">
        <i class="fas fa-clock"></i>
        <span>40 Hours</span>
      </div>
      <div class="modal-training-detail">
        <i class="fas fa-signal"></i>
        <span>Intermediate Level</span>
      </div>
    </div>
  </div>
  <div class="training-modal-body">
    <h4>About This Training</h4>
    <p>${description}</p>
    <p>This comprehensive training program combines theoretical knowledge with practical application, providing participants with the skills needed to excel in real-world scenarios.</p>
  </div>
  <div class="training-topics">
    <h4 class="topics-title">Topics Covered</h4>
    <div class="topics-list">
      ${topics
          .map(
              (topic) => `
        <div class="topic-card">
          <h5>${topic}</h5>
          <p>In-depth exploration with practical examples and guided exercises.</p>
        </div>
      `
          )
          .join("")}
    </div>
  </div>
  <div class="training-modal-skills">
    <h4 class="skills-title">Skills Gained</h4>
    <div class="modal-skills-list">
      ${skills
          .map((skill) => `<span class="modal-skill">${skill}</span>`)
          .join("")}
    </div>
  </div>
  <div class="training-modal-footer">
    <button class="training-action-btn">
      <i class="fas fa-certificate"></i>
      <span>View Certificate</span>
    </button>
    <div class="training-share">
      <span class="training-share-btn" aria-label="Share on LinkedIn"><i class="fab fa-linkedin"></i></span>
      <span class="training-share-btn" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></span>
      <span class="training-share-btn" aria-label="Share via Email"><i class="far fa-envelope"></i></span>
    </div>
  </div>
</div>
`;
  document.body.appendChild(modal);
  setTimeout(() => {
      modal.classList.add("active");
  }, 10);
  const closeBtn = modal.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      setTimeout(() => {
          modal.remove();
      }, 500);
  });
  modal.addEventListener("click", (e) => {
      if (e.target === modal) {
          modal.classList.remove("active");
          setTimeout(() => {
              modal.remove();
          }, 500);
      }
  });
  document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
          modal.classList.remove("active");
          setTimeout(() => {
              modal.remove();
          }, 500);
      }
  });
}
function applyCardEffects() {
  const trainingCards = document.querySelectorAll(".training-card");
  trainingCards.forEach((card) => {
      card.addEventListener("mousemove", function (e) {
          const cardRect = this.getBoundingClientRect();
          const x = e.clientX - cardRect.left;
          const y = e.clientY - cardRect.top;
          const centerX = cardRect.width / 2;
          const centerY = cardRect.height / 2;
          const deltaX = (x - centerX) / centerX;
          const deltaY = (y - centerY) / centerY;
          this.style.transform = `perspective(1000px) rotateX(${
              -deltaY * 10
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
      circle at ${(x / cardRect.width) * 100}% ${
              (y / cardRect.height) * 100
          }%, 
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
  });
}