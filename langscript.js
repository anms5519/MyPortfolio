document.addEventListener("DOMContentLoaded", function () {
    const languageArtifacts = document.querySelectorAll(".language-artifact");
    languageArtifacts.forEach((artifact) => {
        const frontHint = artifact.querySelector(
            ".artifact-front .artifact-hint"
        );
        const backHint = artifact.querySelector(
            ".artifact-back .artifact-hint"
        );
        const flipCard = () => {
            artifact.classList.toggle("is-flipped");
        };
        if (frontHint) {
            frontHint.addEventListener("click", (e) => {
                e.stopPropagation(); 
                flipCard();
            });
        }
        if (backHint) {
            backHint.addEventListener("click", (e) => {
                e.stopPropagation(); 
                flipCard();
            });
        }
        artifact.addEventListener("click", (e) => {
            if (
                e.target !== frontHint &&
                e.target !== backHint &&
                !frontHint.contains(e.target) &&
                !backHint.contains(e.target)
            ) {
                flipCard();
            }
        });
    });
});