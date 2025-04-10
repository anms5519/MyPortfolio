document.addEventListener("DOMContentLoaded", () => {
    const gate = document.getElementById("gate");
    const enterButton = document.getElementById("enterButton");
    const smallBGM = document.getElementById("smallBGM");
    const bigBGM = document.getElementById("bigBGM");
    const collageContainer = document.querySelector(".collage");
    const savedSmallTime = localStorage.getItem("smallBGMTime");
    const savedBigTime = localStorage.getItem("bigBGMTime");
    if (savedSmallTime && smallBGM) {
        smallBGM.currentTime = parseFloat(savedSmallTime);
    }
    if (savedBigTime && bigBGM) {
        bigBGM.currentTime = parseFloat(savedBigTime);
    }
    function playAudio() {
        if (!localStorage.getItem("smallBGMPlayed") && smallBGM) {
            smallBGM
                .play()
                .catch((err) =>
                    console.error("Small BGM playback error:", err)
                );
            smallBGM.addEventListener("ended", () => {
                localStorage.setItem("smallBGMPlayed", "true");
            });
        }
        if (bigBGM) {
            bigBGM
                .play()
                .catch((err) => console.error("Big BGM playback error:", err));
        }
    }
    window.addEventListener("beforeunload", () => {
        if (smallBGM)
            localStorage.setItem("smallBGMTime", smallBGM.currentTime);
        if (bigBGM) localStorage.setItem("bigBGMTime", bigBGM.currentTime);
    });
    enterButton.addEventListener("click", () => {
        playAudio();
        gate.classList.add("open");
        setTimeout(() => {
            if (gate.parentNode) {
                gate.parentNode.removeChild(gate);
            }
            document.body.style.overflow = "auto";
        }, 1500);
    });
    const images = [
        "images/145.jpg",
        "images/555.jpg",
        "images/aportday.jpg",
        "images/awards (5).jpg",
        "images/college (2).jpg",
        "images/conp.jpg",
        "images/df.jpg",
        "images/extracurricular (1).jpg",
        "images/extracurricular (5).jpg",
        "images/fdf.jpg",
        "images/IMG-20240623-WA0001.jpg",
        "images/IMG-20241105-WA0001.jpg",
        "images/jh.jpg",
        "images/lok.jpg",
        "images/lol (15).jpg",
        "images/lol (2).jpg",
        "images/lol (4).jpg",
        "images/lol (5).jpg",
        "images/lol (7).jpg",
        "images/lol (8).jpg",
        "images/mp.jpg",
        "images/place (7).jpg",
        "images/place (8).jpg",
        "images/publicspeaking (1).jpg",
        "images/publicspeaking (3).jpg",
        "images/school (3).jpg",
        "images/sp.jpg",
        "images/sport (2).jpg",
        "images/training (3).jpg",
        "images/university (1).jpeg",
        "images/145.jpg",
        "images/555.jpg",
        "images/aportday.jpg",
        "images/awards (5).jpg",
        "images/college (2).jpg",
        "images/conp.jpg",
        "images/df.jpg",
        "images/extracurricular (1).jpg",
        "images/extracurricular (5).jpg",
        "images/fdf.jpg",
        "images/IMG-20240623-WA0001.jpg",
        "images/IMG-20241105-WA0001.jpg",
        "images/jh.jpg",
        "images/lok.jpg",
        "images/lol (15).jpg",
        "images/lol (2).jpg",
        "images/lol (4).jpg",
        "images/lol (5).jpg",
        "images/lol (7).jpg",
        "images/lol (8).jpg",
        "images/mp.jpg",
        "images/place (7).jpg",
        "images/place (8).jpg",
        "images/publicspeaking (1).jpg",
        "images/publicspeaking (3).jpg",
        "images/school (3).jpg",
        "images/sp.jpg",
        "images/sport (2).jpg",
        "images/training (3).jpg",
        "images/university (1).jpeg",
    ];
    function getRandomImages(n) {
        const shuffled = images.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }
    function updateCollage() {
        collageContainer.innerHTML = "";
        const randomImages = getRandomImages(10);
        randomImages.forEach((src) => {
            const img = document.createElement("img");
            img.src = src;
            collageContainer.appendChild(img);
        });
    }
    updateCollage();
    setInterval(updateCollage, 5000);
});