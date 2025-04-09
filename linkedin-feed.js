document.addEventListener("DOMContentLoaded", function () {
    const createLinkedInFeed = () => {
        const contactSection = document.getElementById("contact");
        if (!contactSection) return;
        const linkedinSection = document.createElement("section");
        linkedinSection.id = "linkedin";
        linkedinSection.className = "section linkedin-section";
        linkedinSection.innerHTML = `
            <div class="container">
                <h2 class="section-title" data-aos="fade-right">
                    <span class="title-icon"><i class="fab fa-linkedin"></i></span>
                    <span class="title-text">Professional <span class="accent-text">Updates</span></span>
                </h2>
                <div class="linkedin-intro" data-aos="fade-up" data-aos-delay="100">
                    <p>Stay connected with my latest professional activities and insights.</p>
                </div>
                <div class="linkedin-feed" data-aos="fade-up" data-aos-delay="200">
                    <div class="feed-header">
                        <div class="profile-preview">
                            <img src="logo.png" alt="Kholipha Ahmmad Al-Amin" class="linkedin-profile-image">
                            <div class="profile-info">
                                <h3>Kholipha Ahmmad Al-Amin</h3>
                                <p>AI Specialist | Game Developer | Full-Stack Developer</p>
                            </div>
                        </div>
                        <a href="https://www.linkedin.com/in/kholipha-ahmmad-al-amin-3856b1305/" target="_blank" class="linkedin-follow-btn">
                            <i class="fab fa-linkedin"></i> Connect
                        </a>
                    </div>
                    <div class="feed-content">
                        <div class="linkedin-posts">
                            <!-- Placeholder for LinkedIn posts -->
                            <div class="linkedin-post">
                                <div class="post-header">
                                    <img src="logo.png" alt="Kholipha Ahmmad Al-Amin" class="post-author-img">
                                    <div class="post-meta">
                                        <div class="post-author">Kholipha Ahmmad Al-Amin</div>
                                        <div class="post-date">2 days ago</div>
                                    </div>
                                </div>
                                <div class="post-content">
                                    <p>Excited to share my latest AI project: THETAEnhancer+ - Advanced image restoration using deep learning techniques! #AI #MachineLearning #ImageProcessing</p>
                                </div>
                                <div class="post-image">
                                    <img src="images/projects/ai-enhancer.jpg" alt="THETAEnhancer+ Project">
                                </div>
                                <div class="post-engagement">
                                    <div class="engagement-item">
                                        <i class="far fa-thumbs-up"></i> 78
                                    </div>
                                    <div class="engagement-item">
                                        <i class="far fa-comment"></i> 12
                                    </div>
                                    <div class="engagement-item">
                                        <i class="far fa-share-square"></i> 5
                                    </div>
                                </div>
                            </div>
                            <div class="linkedin-post">
                                <div class="post-header">
                                    <img src="logo.png" alt="Kholipha Ahmmad Al-Amin" class="post-author-img">
                                    <div class="post-meta">
                                        <div class="post-author">Kholipha Ahmmad Al-Amin</div>
                                        <div class="post-date">1 week ago</div>
                                    </div>
                                </div>
                                <div class="post-content">
                                    <p>Just completed the AWS certification for Building Generative AI Applications Using Amazon Bedrock! Looking forward to applying these skills to my upcoming projects. #AWS #GenerativeAI #MachineLearning</p>
                                </div>
                                <div class="post-engagement">
                                    <div class="engagement-item">
                                        <i class="far fa-thumbs-up"></i> 124
                                    </div>
                                    <div class="engagement-item">
                                        <i class="far fa-comment"></i> 23
                                    </div>
                                    <div class="engagement-item">
                                        <i class="far fa-share-square"></i> 15
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="feed-footer">
                        <a href="https://www.linkedin.com/in/kholipha-ahmmad-al-amin-3856b1305/" target="_blank" class="view-more-btn">
                            View more on LinkedIn <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        contactSection.parentNode.insertBefore(linkedinSection, contactSection);
    };
    createLinkedInFeed();
});