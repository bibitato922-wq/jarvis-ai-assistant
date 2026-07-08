![JARVIS AI Assistant](https://img.shields.io/badge/JARVIS-AI%20Assistant-blue?style=for-the-badge&logo=robot)

# JARVIS - Advanced AI Assistant

A stunning, interactive AI assistant with voice recognition, chat interface, and mesmerizing visual effects.

## ✨ Features

### 🎯 Core Functionality
- **Voice Input**: Real-time speech recognition (works in modern browsers)
- **Chat Interface**: Clean, modern messaging system
- **Voice Output**: Text-to-speech responses with adjustable volume
- **API Integration**: 
  - Weather data from Open-Meteo API
  - Quotes from Quotable.io
  - Jokes from API Ninjas
  - Automatic geolocation

### 🎨 Visual Effects
- **Glowing Circles**: Rotating concentric circles with neon glow
- **Animated Orb**: Pulsing center orb with gradient fill
- **Floating Particles**: Dynamic particle animation
- **Status Indicator**: Real-time status with blinking indicator
- **Smooth Animations**: All UI elements have smooth transitions

### ⚙️ Customization
- **Theme Support**: Dark, Light, and Neon themes
- **Volume Control**: Adjust speech synthesis volume
- **Auto Response**: Toggle automatic voice responses
- **Responsive Design**: Works on desktop, tablet, and mobile

### ⌨️ Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Send message
- **Alt + V**: Toggle voice input

## 🚀 Quick Start

1. **Clone or download this repository**
```bash
git clone https://github.com/bibitato922-wq/jarvis-ai-assistant.git
cd jarvis-ai-assistant
```

2. **Open in browser**
```bash
# Simply open index.html in a modern web browser
open index.html
# or double-click index.html in your file explorer
```

3. **Start using JARVIS**
   - Type messages in the input field or click the microphone button
   - Try the quick action buttons: Weather, Time, Joke, Quote
   - Adjust settings with the gear icon

## 📁 Project Structure

```
jarvis-ai-assistant/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── script.js           # Core JavaScript logic
├── sw.js              # Service Worker (optional)
└── README.md          # This file
```

## 🔌 API Integration

### Supported APIs
- **Open-Meteo Weather API** - Free weather data (no key required)
- **Quotable.io** - Random quotes (no key required)
- **IP API** - Geolocation (no key required)
- **API Ninjas** - Jokes (free tier available)

### To enable API Ninjas jokes:
1. Get a free API key from [api-ninjas.com](https://api-ninjas.com)
2. Update `script.js` line 11 with your API key
3. Replace `'test-key'` with your actual key

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Speech Recognition | ✅ | ✅ | ✅ | ✅ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |
| Modern CSS | ✅ | ✅ | ✅ | ✅ |
| Web APIs | ✅ | ✅ | ✅ | ✅ |

## 🎮 Usage Examples

### Voice Commands
1. Click the 🎤 button to start listening
2. Speak clearly (e.g., "What's the weather?")
3. JARVIS will respond with voice and text

### Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. Get instant responses with optional voice playback

### Quick Actions
- **🌤️ Weather**: Get current weather for your location
- **⏰ Time**: Get current time and date
- **😄 Joke**: Hear a funny joke
- **💡 Quote**: Get an inspiring quote

## ⚙️ Settings

- **Volume**: Adjust the volume of voice responses (0-100%)
- **Theme**: Choose between Dark, Light, or Neon theme
- **Auto Voice Response**: Toggle automatic voice feedback

## 🔧 Customization

### Change Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #00d4ff;      /* Main glow color */
    --secondary-color: #0099cc;    /* Secondary color */
    --accent: #ff00ff;             /* Accent color */
    --success: #00ff88;            /* Success color */
}
```

### Modify Response Messages
Edit the `responses` object in `script.js`:
```javascript
const responses = {
    hello: "Your custom greeting here!",
    // ... more responses
};
```

### Add New Quick Actions
1. Add a button in `index.html`:
   ```html
   <button class="quick-btn" data-action="custom">Action</button>
   ```

2. Add handler in `script.js`:
   ```javascript
   case 'custom':
       // Your custom logic here
       break;
   ```

## 🐛 Troubleshooting

### Voice Input Not Working
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check if microphone permissions are granted
- Try refreshing the page

### No Sound Output
- Check volume is not muted in settings
- Verify your system audio is working
- Ensure "Auto Voice Response" is enabled

### API Issues
- Check internet connection
- Verify API endpoints are accessible
- Check browser console for error messages

## 📱 Mobile Support

JARVIS works on mobile devices with:
- Responsive design that adapts to screen size
- Touch-friendly buttons and controls
- Voice input and output support

## 🌟 Advanced Features

### Offline Support
The app includes a service worker for basic offline functionality.

### Local Storage
Settings are saved locally:
- Theme preference
- Volume level
- Auto-speak setting

### Real-time Updates
- Chat messages appear instantly
- Voice recognition provides live feedback
- Status indicator shows connection state

## 🤝 Contributing

Feel free to fork, modify, and improve JARVIS! Some ideas:
- Add more API integrations
- Create additional themes
- Implement more AI responses
- Add language support
- Improve voice quality

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

Built with:
- Vanilla JavaScript
- Modern CSS3 with animations
- Web Speech API
- Open APIs (Open-Meteo, Quotable.io, etc.)

---

**Enjoy your advanced AI assistant! 🚀**

Have questions or suggestions? Feel free to open an issue or reach out!
