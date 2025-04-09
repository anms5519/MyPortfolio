(() => {
    "use strict";
    const initVoiceChat = () => {
        if (
            !("webkitSpeechRecognition" in window) &&
            !("SpeechRecognition" in window)
        ) {
            console.warn("Speech recognition not supported in this browser");
            return;
        }
        const voiceButton = document.createElement("button");
        voiceButton.className = "voice-chat-btn";
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.title = "Speak to chatbot";
        const chatbotInput = document.getElementById("chatbot-input");
        if (chatbotInput && chatbotInput.parentNode) {
            chatbotInput.parentNode.appendChild(voiceButton);
        }
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatbotInput.value = transcript;
            setTimeout(() => {
                document.getElementById("chatbot-send").click();
            }, 500);
        };
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            voiceButton.classList.remove("listening");
        };
        recognition.onend = () => {
            voiceButton.classList.remove("listening");
        };
        voiceButton.addEventListener("click", () => {
            if (voiceButton.classList.contains("listening")) {
                recognition.stop();
                voiceButton.classList.remove("listening");
            } else {
                recognition.start();
                voiceButton.classList.add("listening");
            }
        });
        const speakResponse = (text) => {
            if (!("speechSynthesis" in window)) {
                console.warn("Text-to-speech not supported in this browser");
                return;
            }
            const cleanText = text.replace(/<[^>]*>/g, "");
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = "en-US";
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        };
        const addSpeakButton = () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (
                                node.classList &&
                                node.classList.contains("bot-message")
                            ) {
                                const speakBtn = document.createElement(
                                    "button"
                                );
                                speakBtn.className = "speak-message-btn";
                                speakBtn.innerHTML =
                                    '<i class="fas fa-volume-up"></i>';
                                speakBtn.title = "Listen to this message";
                                speakBtn.addEventListener("click", () => {
                                    const messageContent = node.querySelector(
                                        ".message-content"
                                    );
                                    if (messageContent) {
                                        speakResponse(
                                            messageContent.textContent
                                        );
                                    }
                                });
                                node.appendChild(speakBtn);
                            }
                        });
                    }
                });
            });
            observer.observe(document.getElementById("chatbot-messages"), {
                childList: true,
            });
        };
        addSpeakButton();
    };
    document.addEventListener("DOMContentLoaded", initVoiceChat);
})();