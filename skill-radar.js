(() => {
    "use strict";
    class SkillRadar {
        constructor() {
            this.skillCategories = [
                {
                    name: "Development",
                    skills: [
                        { name: "Frontend", level: 90 },
                        { name: "Backend", level: 85 },
                        { name: "Game Dev", level: 80 },
                        { name: "Mobile", level: 75 },
                        { name: "DevOps", level: 70 },
                    ],
                },
                {
                    name: "AI & Data",
                    skills: [
                        { name: "Machine Learning", level: 85 },
                        { name: "Computer Vision", level: 90 },
                        { name: "NLP", level: 75 },
                        { name: "Data Analysis", level: 80 },
                        { name: "Deep Learning", level: 85 },
                    ],
                },
                {
                    name: "Design",
                    skills: [
                        { name: "UI/UX", level: 80 },
                        { name: "Graphic Design", level: 75 },
                        { name: "3D Modeling", level: 70 },
                        { name: "Animation", level: 65 },
                        { name: "Typography", level: 60 },
                    ],
                },
            ];
            this.currentCategory = 0;
            this.canvas = null;
            this.ctx = null;
        }
        init() {
            let skillsSection = document.getElementById("skills");
            if (!skillsSection) {
                skillsSection = document.createElement("section");
                skillsSection.id = "skills";
                skillsSection.className = "section skills-section";
                const projectsSection = document.getElementById("projects");
                if (projectsSection) {
                    projectsSection.parentNode.insertBefore(
                        skillsSection,
                        projectsSection
                    );
                } else {
                    document.body.appendChild(skillsSection);
                }
            }
            this.canvas = document.getElementById("skill-radar");
            this.ctx = this.canvas.getContext("2d");
            const prevBtn = skillsSection.querySelector(".prev-category");
            const nextBtn = skillsSection.querySelector(".next-category");
            prevBtn.addEventListener("click", () => {
                this.currentCategory =
                    (this.currentCategory - 1 + this.skillCategories.length) %
                    this.skillCategories.length;
                this.updateCategory();
            });
            nextBtn.addEventListener("click", () => {
                this.currentCategory =
                    (this.currentCategory + 1) % this.skillCategories.length;
                this.updateCategory();
            });
            this.updateCategory();
            window.addEventListener("resize", () => {
                this.drawRadarChart();
            });
        }
        updateCategory() {
            document.querySelector(
                ".category-title"
            ).textContent = this.skillCategories[this.currentCategory].name;
            const legend = document.querySelector(".skill-legend");
            legend.innerHTML = "";
            this.skillCategories[this.currentCategory].skills.forEach(
                (skill) => {
                    const legendItem = document.createElement("div");
                    legendItem.className = "legend-item";
                    legendItem.innerHTML = `
                    <span class="legend-color" style="background-color: ${this.getRandomColor(
                        skill.name
                    )}"></span>
                    <span class="legend-name">${skill.name}</span>
                    <div class="legend-bar">
                        <div class="legend-fill" style="width: ${
                            skill.level
                        }%"></div>
                    </div>
                    <span class="legend-value">${skill.level}%</span>
                `;
                    legend.appendChild(legendItem);
                }
            );
            this.drawRadarChart();
        }
        drawRadarChart() {
            const width = this.canvas.width;
            const height = this.canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(centerX, centerY) * 0.8;
            this.ctx.clearRect(0, 0, width, height);
            const skills = this.skillCategories[this.currentCategory].skills;
            const numSkills = skills.length;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2);
            this.ctx.stroke();
            for (let i = 0; i < numSkills; i++) {
                const angle = (i / numSkills) * Math.PI * 2 - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(x, y);
                this.ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
                this.ctx.stroke();
                const labelRadius = radius + 20;
                const labelX = centerX + labelRadius * Math.cos(angle);
                const labelY = centerY + labelRadius * Math.sin(angle);
                this.ctx.font = "12px Arial";
                this.ctx.fillStyle = "var(--text-color)";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(skills[i].name, labelX, labelY);
            }
            this.ctx.beginPath();
            for (let i = 0; i < numSkills; i++) {
                const angle = (i / numSkills) * Math.PI * 2 - Math.PI / 2;
                const skillRadius = (skills[i].level / 100) * radius;
                const x = centerX + skillRadius * Math.cos(angle);
                const y = centerY + skillRadius * Math.sin(angle);
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            const firstAngle = -Math.PI / 2;
            const firstSkillRadius = (skills[0].level / 100) * radius;
            const firstX = centerX + firstSkillRadius * Math.cos(firstAngle);
            const firstY = centerY + firstSkillRadius * Math.sin(firstAngle);
            this.ctx.lineTo(firstX, firstY);
            this.ctx.fillStyle = "rgba(var(--primary-rgb), 0.2)";
            this.ctx.fill();
            this.ctx.strokeStyle = "var(--primary-color)";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            for (let i = 0; i < numSkills; i++) {
                const angle = (i / numSkills) * Math.PI * 2 - Math.PI / 2;
                const skillRadius = (skills[i].level / 100) * radius;
                const x = centerX + skillRadius * Math.cos(angle);
                const y = centerY + skillRadius * Math.sin(angle);
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fillStyle = this.getRandomColor(skills[i].name);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
        getRandomColor(seed) {
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = seed.charCodeAt(i) + ((hash << 5) - hash);
            }
            const colors = [
                "#4285F4",
                "#EA4335",
                "#FBBC05",
                "#34A853", 
                "#0095ff",
                "#ff6384",
                "#36a2eb",
                "#ffce56",
                "#4bc0c0",
                "#9966ff", 
            ];
            return colors[Math.abs(hash) % colors.length];
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        const skillRadar = new SkillRadar();
        skillRadar.init();
    });
})();