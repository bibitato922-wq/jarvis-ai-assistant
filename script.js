// ==================== CONFIGURATION ====================
const CONFIG = {
    apiBaseUrl: 'https://api.open-meteo.com',
    jokeApi: 'https://api.api-ninjas.com/v1/jokes',
    quoteApi: 'https://api.quotable.io/random',
};

// ==================== GLOBAL STATE ====================
let isListening = false;
let recognition = null;
let isSpeaking = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeSpeechRecognition();
    setupEventListeners();
    createParticles();
    loadSettings();
});

// ==================== SPEECH RECOGNITION ====================
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            document.getElementById('voiceBtn').classList.add('active');
            document.getElementById('voiceStatus').style.display = 'block';
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                document.getElementById('userInput').value = finalTranscript.trim();
            }
        };

        recognition.onend = () => {
            isListening = false;
            document.getElementById('voiceBtn').classList.remove('active');
            document.getElementById('voiceStatus').style.display = 'none';
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            document.getElementById('voiceStatus').style.display = 'none';
            addMessage(`Error: ${event.error}`, 'assistant');
        };
    } else {
        console.warn('Speech Recognition API not supported');
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const userInput = document.getElementById('userInput');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');
    const themeSelect = document.getElementById('themeSelect');
    const autoSpeak = document.getElementById('autoSpeak');

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Voice input
    voiceBtn.addEventListener('click', toggleVoiceInput);

    // Settings
    settingsBtn.addEventListener('click', () => {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    });

    themeSelect.addEventListener('change', (e) => {
        setTheme(e.target.value);
    });

    // Quick actions
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.settings-panel')) {
            settingsMenu.style.display = 'none';
        }
    });

    // Auto speak toggle
    autoSpeak.addEventListener('change', (e) => {
        localStorage.setItem('autoSpeak', e.target.checked);
    });
}

// ==================== MESSAGE HANDLING ====================
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    userInput.value = '';

    // Get AI response
    getAIResponse(message);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(userMessage) {
    // Simple AI logic with predefined responses
    const responses = {
        hello: "Hello! How can I assist you today?",
        hi: "Hi there! What can I do for you?",
        how: "I'm doing great! Thanks for asking. How can I help you?",
        help: "I can help you with many things! Try: weather, time, joke, quote, or just chat with me.",
        jarvis: "I'm JARVIS, your advanced AI assistant. I can provide information, tell jokes, share quotes, and more!",
        name: "My name is JARVIS - Just A Rather Very Intelligent System.",
        what: "I'm an AI assistant designed to help you with information and entertainment!",
        default: "That's interesting! I'm here to help. Ask me about the weather, time, jokes, quotes, or anything else!"
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses.default;

    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }

    // Simulate thinking delay
    setTimeout(() => {
        addMessage(response, 'assistant');
        
        // Auto-speak response
        if (document.getElementById('autoSpeak').checked) {
            speak(response);
        }
    }, 500);
}

// ==================== QUICK ACTIONS ====================
function handleQuickAction(action) {
    switch(action) {
        case 'weather':
            getWeather();
            break;
        case 'time':
            getTime();
            break;
        case 'joke':
            getJoke();
            break;
        case 'quote':
            getQuote();
            break;
    }
}

function getTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const message = `It's ${timeString} on ${dateString}`;
    addMessage(message, 'assistant');
    speak(message);
}

function getWeather() {
    addMessage("Getting weather information...", 'assistant');
    
    // Get user's location (using IP geolocation)
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const { latitude, longitude, city } = data;
            return fetch(`${CONFIG.apiBaseUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`)
                .then(res => res.json())
                .then(weatherData => {
                    const current = weatherData.current;
                    const temp = current.temperature_2m;
                    const windSpeed = current.wind_speed_10m;
                    const message = `Current weather in ${city}: ${temp}°C, Wind speed ${windSpeed} km/h`;
                    
                    // Remove the loading message
                    const messages = document.querySelectorAll('.message.assistant');
                    messages[messages.length - 1].remove();
                    
                    addMessage(message, 'assistant');
                    speak(message);
                });
        })
        .catch(error => {
            console.error('Weather error:', error);
            addMessage("Unable to fetch weather data", 'assistant');
        });
}

function getJoke() {
    addMessage("Finding a joke for you...", 'assistant');
    
    fetch(CONFIG.jokeApi, {
        headers: {
            'X-Api-Key': 'test-key'
        }
    })
    .then(response => {
        // Fallback if API fails
        if (!response.ok) throw new Error('API failed');
        return response.json();
    })
    .then(data => {
        const joke = data[0]?.body || "Why did the AI go to school? To improve its learning!";
        
        // Remove the loading message
        const messages = document.querySelectorAll('.message.assistant');
        messages[messages.length - 1].remove();
        
        addMessage(joke, 'assistant');
        speak(joke);
    })
    .catch(() => {
        const jokes = [
            "Why did the AI go to school? To improve its learning!",
            "What do you call an AI that tells jokes? A funny algorithm!",
            "How many AI assistants does it take to change a lightbulb? Just one, but it takes a lot of processing power!",
            "Why did the programmer quit his job? Because he didn't get arrays!"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        
        // Remove the loading message
        const messages = document.querySelectorAll('.message.assistant');
        messages[messages.length - 1].remove();
        
        addMessage(joke, 'assistant');
        speak(joke);
    });
}

function getQuote() {
    addMessage("Finding an inspiring quote...", 'assistant');
    
    fetch(CONFIG.quoteApi)
        .then(response => response.json())
        .then(data => {
            const quote = `"${data.content}" - ${data.author}`;
            
            // Remove the loading message
            const messages = document.querySelectorAll('.message.assistant');
            messages[messages.length - 1].remove();
            
            addMessage(quote, 'assistant');
            speak(quote);
        })
        .catch(() => {
            const quote = '"The only way to do great work is to love what you do." - Steve Jobs';
            
            // Remove the loading message
            const messages = document.querySelectorAll('.message.assistant');
            messages[messages.length - 1].remove();
            
            addMessage(quote, 'assistant');
            speak(quote);
        });
}

// ==================== TEXT-TO-SPEECH ====================
function speak(text) {
    if (isSpeaking) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = document.getElementById('volumeControl').value / 100;

    utterance.onstart = () => {
        isSpeaking = true;
    };

    utterance.onend = () => {
        isSpeaking = false;
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function toggleVoiceInput() {
    if (!recognition) {
        alert('Speech Recognition not supported in your browser');
        return;
    }

    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// ==================== THEME MANAGEMENT ====================
function setTheme(theme) {
    document.body.className = '';
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'neon') {
        document.body.classList.add('neon-theme');
    }
    localStorage.setItem('theme', theme);
}

function loadSettings() {
    const theme = localStorage.getItem('theme') || 'dark';
    const volume = localStorage.getItem('volume') || 70;
    const autoSpeak = localStorage.getItem('autoSpeak') !== 'false';

    document.getElementById('themeSelect').value = theme;
    document.getElementById('volumeControl').value = volume;
    document.getElementById('autoSpeak').checked = autoSpeak;

    setTheme(theme);
}

// ==================== VISUAL EFFECTS ====================
function createParticles() {
    const container = document.querySelector('.particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        particle.style.animationDelay = `${i * 0.15}s`;
        
        container.appendChild(particle);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ADVANCED FEATURES ====================
// Update volume control
document.addEventListener('DOMContentLoaded', () => {
    const volumeControl = document.getElementById('volumeControl');
    volumeControl.addEventListener('input', (e) => {
        localStorage.setItem('volume', e.target.value);
    });
});

// Add typing indicator for AI response
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingEl = document.createElement('div');
    typingEl.className = 'message assistant typing-indicator';
    typingEl.innerHTML = `
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingEl;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        sendMessage();
    }
    // Alt + V to toggle voice
    if (e.altKey && e.key === 'v') {
        toggleVoiceInput();
    }
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
        // Service worker registration failed, app will work online only
    });
}
