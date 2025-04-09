document.addEventListener("DOMContentLoaded", function () {
    initTestimonials();
    function initTestimonials() {
        const testimonialSection = document.createElement("section");
        testimonialSection.id = "testimonials";
        testimonialSection.className = "section testimonials-section";
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.parentNode.insertBefore(
                testimonialSection,
                contactSection
            );
        } else {
            document.body.appendChild(testimonialSection);
        }
        testimonialSection.innerHTML = `
            <div class="container">
                <h2 class="section-title" data-aos="fade-right">
                    <span class="title-icon"><i class="fas fa-quote-right"></i></span>
                    <span class="title-text">Client <span class="accent-text">Testimonials</span></span>
                </h2>
                <div class="testimonials-intro" data-aos="fade-up" data-aos-delay="100">
                    <p>What people are saying about my work and collaborations.</p>
                </div>
                <div class="testimonials-carousel" data-aos="fade-up" data-aos-delay="200">
                    <div class="carousel-container">
                        <div class="testimonial-card active">
                            <div class="testimonial-content">
                                <div class="quote-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <p>Kholipha delivered an exceptional AI solution that transformed our image processing capabilities. His attention to detail and technical expertise exceeded our expectations.</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-image">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe">
                                </div>
                                <div class="author-info">
                                    <h4>John Doe</h4>
                                    <p>CTO, Tech Innovations Inc.</p>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <div class="quote-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <p>Working with Kholipha on our web development project was a pleasure. His creative approach to problem-solving and dedication to quality made all the difference.</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-image">
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson">
                                </div>
                                <div class="author-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>Product Manager, Digital Solutions</p>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <div class="quote-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <p>Kholipha's game development skills are truly impressive. He created an immersive 3D experience that captured exactly what we were looking for and more.</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-image">
                                    <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="Michael Chen">
                                </div>
                                <div class="author-info">
                                    <h4>Michael Chen</h4>
                                    <p>Creative Director, GameVerse Studios</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-controls">
                        <button class="control-prev">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="carousel-indicators">
                            <span class="indicator active"></span>
                            <span class="indicator"></span>
                            <span class="indicator"></span>
                        </div>
                        <button class="control-next">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="testimonial-cta" data-aos="fade-up" data-aos-delay="300">
                    <a href="#contact" class="btn glow-btn">Work with me</a>
                </div>
            </div>
        `;
        const nextButton = testimonialSection.querySelector(".control-next");
        const prevButton = testimonialSection.querySelector(".control-prev");
        const cards = testimonialSection.querySelectorAll(".testimonial-card");
        const indicators = testimonialSection.querySelectorAll(".indicator");
        let currentIndex = 0;
        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove("active");
                indicators[index].classList.remove("active");
            });
            cards[currentIndex].classList.add("active");
            indicators[currentIndex].classList.add("active");
        }
        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
        prevButton.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
        indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 5000);
    }
});