// ==================== CONFIGURATION ====================
let CONFIG = {
    apiKey: localStorage.getItem('apiKey') || '',
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadSettings();
});

function initializeApp() {
    setupEventListeners();
    initializeSpeechRecognition();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Send message
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Voice input
    document.getElementById('voiceBtn').addEventListener('click', toggleVoiceInput);

    // Quick actions
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Settings
    document.getElementById('settingsToggle').addEventListener('click', () => {
        const panel = document.getElementById('settingsPanel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    });

    // API Key
    document.getElementById('apiKey').addEventListener('change', (e) => {
        CONFIG.apiKey = e.target.value;
        localStorage.setItem('apiKey', e.target.value);
    });

    // Volume
    document.getElementById('volume').addEventListener('change', (e) => {
        localStorage.setItem('volume', e.target.value);
    });

    // Theme
    document.getElementById('theme').addEventListener('change', (e) => {
        setTheme(e.target.value);
    });

    // Auto speak
    document.getElementById('autoSpeak').addEventListener('change', (e) => {
        localStorage.setItem('autoSpeak', e.target.checked);
    });
}

// ==================== MESSAGE HANDLING ====================
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Get response
    getResponse(message);
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender === 'user' ? 'user' : 'bot'}`;
    messageEl.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getResponse(userMessage) {
    const responses = {
        hello: "Hello! How can I help you?",
        hi: "Hi there! What can I do for you?",
        how: "I'm doing great! Thanks for asking.",
        help: "I can help with weather, time, jokes, quotes, or just chat!",
        jarvis: "I'm JARVIS - Just A Rather Very Intelligent System!",
        name: "My name is JARVIS, your AI assistant.",
        weather: "Click the Weather button to get current conditions!",
        default: "That's interesting! Feel free to ask me anything."
    };

    const lower = userMessage.toLowerCase();
    let response = responses.default;

    for (const [key, value] of Object.entries(responses)) {
        if (lower.includes(key)) {
            response = value;
            break;
        }
    }

    setTimeout(() => {
        addMessage(response, 'bot');
        if (document.getElementById('autoSpeak').checked) {
            speak(response);
        }
    }, 300);
}

// ==================== QUICK ACTIONS ====================
function handleQuickAction(action) {
    switch (action) {
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
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const message = `${time} on ${date}`;
    addMessage(message, 'bot');
    speak(message);
}

function getWeather() {
    addMessage('🌤️ Fetching weather...', 'bot');

    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const { latitude, longitude, city } = data;
            return fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
            )
                .then(res => res.json())
                .then(weather => {
                    const temp = weather.current.temperature_2m;
                    const wind = weather.current.wind_speed_10m;
                    const msg = `Weather in ${city}: ${temp}°C, wind ${wind}km/h`;
                    
                    const messages = document.querySelectorAll('.message.bot');
                    messages[messages.length - 1].remove();
                    
                    addMessage(msg, 'bot');
                    speak(msg);
                });
        })
        .catch(() => {
            const messages = document.querySelectorAll('.message.bot');
            messages[messages.length - 1].remove();
            addMessage('Unable to fetch weather data', 'bot');
        });
}

function getJoke() {
    addMessage('😄 Getting a joke...', 'bot');

    if (!CONFIG.apiKey) {
        const fallbackJokes = [
            "Why did the AI go to school? To improve its learning!",
            "What do you call an AI that tells jokes? A funny algorithm!",
            "How many programmers does it take to change a lightbulb? None, that's a hardware problem!",
            "Why do programmers prefer dark mode? Because light attracts bugs!"
        ];
        const joke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
        
        const messages = document.querySelectorAll('.message.bot');
        messages[messages.length - 1].remove();
        addMessage(joke, 'bot');
        speak(joke);
        return;
    }

    fetch('https://api.api-ninjas.com/v1/jokes', {
        headers: { 'X-Api-Key': CONFIG.apiKey }
    })
        .then(res => res.json())
        .then(data => {
            const joke = data[0]?.body || "Why did the AI go to school? To improve its learning!";
            const messages = document.querySelectorAll('.message.bot');
            messages[messages.length - 1].remove();
            addMessage(joke, 'bot');
            speak(joke);
        })
        .catch(() => {
            const fallbackJokes = [
                "Why did the AI go to school? To improve its learning!",
                "What do you call an AI that tells jokes? A funny algorithm!",
                "How many programmers does it take to change a lightbulb? None, that's a hardware problem!",
                "Why do programmers prefer dark mode? Because light attracts bugs!"
            ];
            const joke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
            const messages = document.querySelectorAll('.message.bot');
            messages[messages.length - 1].remove();
            addMessage(joke, 'bot');
            speak(joke);
        });
}

function getQuote() {
    addMessage('💡 Finding a quote...', 'bot');

    fetch('https://api.quotable.io/random')
        .then(res => res.json())
        .then(data => {
            const quote = `"${data.content}" - ${data.author}`;
            const messages = document.querySelectorAll('.message.bot');
            messages[messages.length - 1].remove();
            addMessage(quote, 'bot');
            speak(quote);
        })
        .catch(() => {
            const quote = '"The only way to do great work is to love what you do." - Steve Jobs';
            const messages = document.querySelectorAll('.message.bot');
            messages[messages.length - 1].remove();
            addMessage(quote, 'bot');
            speak(quote);
        });
}

// ==================== SPEECH ====================
let recognition = null;
let isListening = false;

function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech Recognition not supported');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        document.getElementById('voiceBtn').classList.add('active');
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            }
        }
        if (transcript) {
            document.getElementById('userInput').value = transcript;
        }
    };

    recognition.onend = () => {
        isListening = false;
        document.getElementById('voiceBtn').classList.remove('active');
    };
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

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.volume = document.getElementById('volume').value / 100;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

// ==================== SETTINGS ====================
function setTheme(theme) {
    document.body.className = '';
    if (theme === 'neon') {
        document.body.classList.add('neon-theme');
    }
    localStorage.setItem('theme', theme);
}

function loadSettings() {
    const theme = localStorage.getItem('theme') || 'dark';
    const volume = localStorage.getItem('volume') || 70;
    const autoSpeak = localStorage.getItem('autoSpeak') !== 'false';
    const apiKey = localStorage.getItem('apiKey') || '';

    document.getElementById('theme').value = theme;
    document.getElementById('volume').value = volume;
    document.getElementById('autoSpeak').checked = autoSpeak;
    document.getElementById('apiKey').value = apiKey;

    CONFIG.apiKey = apiKey;
    setTheme(theme);
}

// ==================== UTILITY ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
