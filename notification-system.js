(() => {
    "use strict";
    class NotificationSystem {
        constructor() {
            this.notifications = [
                {
                    id: "new-project-2024",
                    title: "New Project",
                    message: "Check out my latest AI project: THETAEnhancer+",
                    icon: "fas fa-robot",
                    link: "#projects",
                    date: new Date("2024-05-15"),
                },
                {
                    id: "aws-cert",
                    title: "New Certification",
                    message:
                        "Completed AWS certification for Generative AI Applications",
                    icon: "fas fa-certificate",
                    link: "#about",
                    date: new Date("2024-04-10"),
                },
                {
                    id: "website-update",
                    title: "Website Update",
                    message:
                        "My portfolio website has been completely redesigned",
                    icon: "fas fa-palette",
                    link: "#",
                    date: new Date("2024-03-22"),
                },
            ];
            this.storageKey = "dismissedNotifications";
            this.container = null;
        }
        init() {
            this.container = document.createElement("div");
            this.container.className = "notification-center";
            document.body.appendChild(this.container);
            const bell = document.createElement("button");
            bell.className = "notification-bell";
            bell.innerHTML = '<i class="fas fa-bell"></i>';
            bell.setAttribute("aria-label", "Notifications");
            const header = document.getElementById("header");
            if (header) {
                const headerTools = document.querySelector(".header-tools");
                if (headerTools) {
                    headerTools.appendChild(bell);
                } else {
                    const toolsContainer = document.createElement("div");
                    toolsContainer.className = "header-tools";
                    header.appendChild(toolsContainer);
                    toolsContainer.appendChild(bell);
                }
            } else {
                document.body.appendChild(bell);
            }
            this.updateBellBadge(bell);
            bell.addEventListener("click", () => {
                this.container.classList.toggle("active");
                this.renderNotifications();
            });
            document.addEventListener("click", (e) => {
                if (
                    !this.container.contains(e.target) &&
                    !bell.contains(e.target)
                ) {
                    this.container.classList.remove("active");
                }
            });
            setTimeout(() => {
                const unreadNotifications = this.getUnreadNotifications();
                if (unreadNotifications.length > 0) {
                    this.showFirstTimeNotification(unreadNotifications[0]);
                }
            }, 3000);
        }
        updateBellBadge(bell) {
            const unreadCount = this.getUnreadNotifications().length;
            if (unreadCount > 0) {
                let badge = bell.querySelector(".notification-badge");
                if (!badge) {
                    badge = document.createElement("span");
                    badge.className = "notification-badge";
                    bell.appendChild(badge);
                }
                badge.textContent = unreadCount;
            } else {
                const badge = bell.querySelector(".notification-badge");
                if (badge) {
                    bell.removeChild(badge);
                }
            }
        }
        getUnreadNotifications() {
            const dismissedIds = this.getDismissedIds();
            return this.notifications.filter(
                (notification) => !dismissedIds.includes(notification.id)
            );
        }
        getDismissedIds() {
            const dismissed = localStorage.getItem(this.storageKey);
            return dismissed ? JSON.parse(dismissed) : [];
        }
        dismissNotification(id) {
            const dismissedIds = this.getDismissedIds();
            dismissedIds.push(id);
            localStorage.setItem(this.storageKey, JSON.stringify(dismissedIds));
            const bell = document.querySelector(".notification-bell");
            if (bell) {
                this.updateBellBadge(bell);
            }
        }
        renderNotifications() {
            if (!this.container.classList.contains("active")) return;
            const sortedNotifications = [...this.notifications].sort(
                (a, b) => b.date - a.date
            );
            const dismissedIds = this.getDismissedIds();
            this.container.innerHTML = `
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="notification-clear">Clear All</button>
                </div>
                <div class="notification-list">
                    ${
                        sortedNotifications.length === 0
                            ? '<div class="no-notifications">No notifications</div>'
                            : sortedNotifications
                                  .map(
                                      (notification) => `
                            <div class="notification-item ${
                                dismissedIds.includes(notification.id)
                                    ? "read"
                                    : "unread"
                            }" data-id="${notification.id}">
                                <div class="notification-icon">
                                    <i class="${notification.icon}"></i>
                                </div>
                                <div class="notification-content">
                                    <div class="notification-title">${
                                        notification.title
                                    }</div>
                                    <div class="notification-message">${
                                        notification.message
                                    }</div>
                                    <div class="notification-date">${this.formatDate(
                                        notification.date
                                    )}</div>
                                </div>
                                <button class="notification-dismiss" data-id="${
                                    notification.id
                                }">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `
                                  )
                                  .join("")
                    }
                </div>
            `;
            this.container
                .querySelectorAll(".notification-item")
                .forEach((item) => {
                    const id = item.getAttribute("data-id");
                    const notification = this.notifications.find(
                        (n) => n.id === id
                    );
                    item.addEventListener("click", (e) => {
                        if (!e.target.closest(".notification-dismiss")) {
                            if (notification.link) {
                                window.location.href = notification.link;
                            }
                            this.dismissNotification(id);
                            this.container.classList.remove("active");
                        }
                    });
                });
            this.container
                .querySelectorAll(".notification-dismiss")
                .forEach((btn) => {
                    const id = btn.getAttribute("data-id");
                    btn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        this.dismissNotification(id);
                        this.renderNotifications();
                    });
                });
            const clearBtn = this.container.querySelector(
                ".notification-clear"
            );
            clearBtn.addEventListener("click", () => {
                const allIds = this.notifications.map((n) => n.id);
                localStorage.setItem(this.storageKey, JSON.stringify(allIds));
                this.renderNotifications();
                this.updateBellBadge(
                    document.querySelector(".notification-bell")
                );
            });
        }
        showFirstTimeNotification(notification) {
            const toast = document.createElement("div");
            toast.className = "notification-toast";
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="toast-content">
                    <div class="toast-title">${notification.title}</div>
                    <div class="toast-message">${notification.message}</div>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add("show");
            }, 100);
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 5000);
            toast
                .querySelector(".toast-close")
                .addEventListener("click", () => {
                    toast.classList.remove("show");
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                });
            toast.addEventListener("click", (e) => {
                if (!e.target.closest(".toast-close")) {
                    if (notification.link) {
                        window.location.href = notification.link;
                    }
                    this.dismissNotification(notification.id);
                    toast.classList.remove("show");
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }
            });
        }
        formatDate(date) {
            const now = new Date();
            const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            if (diff === 0) {
                return "Today";
            } else if (diff === 1) {
                return "Yesterday";
            } else if (diff < 7) {
                return `${diff} days ago`;
            } else if (diff < 30) {
                const weeks = Math.floor(diff / 7);
                return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
            } else {
                return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
            }
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        const notificationSystem = new NotificationSystem();
        notificationSystem.init();
    });
})();