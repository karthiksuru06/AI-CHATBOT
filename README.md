# AI Chatbot with React Frontend & FastAPI Backend

A modern, full-stack AI chatbot application with a clean React frontend and FastAPI backend. Features real-time chat, conversation history, and local JSON storage.

## ✨ Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Chat**: Instant AI responses powered by Google Gemini Pro
- **Chat History**: View and manage past conversations
- **Local Storage**: All data stored in local JSON files (no database required)
- **Session Management**: Start new chats and switch between conversations
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python** - Programming language
- **Google Gemini Pro** - AI model for generating responses
- **JSON** - Local file storage for chat history
- **Uvicorn** - ASGI server for running FastAPI

### Frontend
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **JavaScript (ES6+)** - Modern JavaScript features

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**
- **Google Gemini API Key** (free tier available)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-chatbot
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
1. Create a `.env` file in the backend directory
2. Add your Gemini API key:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

#### Run the Backend Server
```bash
python main.py
```

The backend server will start on `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Tailwind CSS
Create `postcss.config.js` in the frontend directory:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### Run the Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
ai-chatbot/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables
│   └── chat_history.json      # Auto-generated chat storage
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBot.js     # Main chat component
│   │   ├── App.js             # Main App component
│   │   ├── App.css            # Tailwind CSS imports
│   │   └── index.js           # React entry point
│   ├── package.json           # Node.js dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
└── README.md                  # This file
```

## 🎯 Usage

1. **Start a Conversation**: Type your message in the input field and click "Send"
2. **New Chat**: Click the "New Chat" button to start a fresh conversation
3. **View History**: Click "History" to see all past chat sessions
4. **Clear History**: Click "Clear All" to delete all saved conversations
5. **Load Previous Chat**: In the history sidebar, click on any session to load it

## 🔧 API Endpoints

### Backend API Routes

- `GET /` - Health check
- `POST /chat` - Send a message and get AI response
- `POST /new-chat` - Start a new chat session
- `GET /chat-history` - Retrieve all chat sessions
- `GET /current-session` - Get current active session messages
- `DELETE /chat-history` - Delete all chat history

### Example API Usage

```bash
# Send a message
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, how are you?"}'

# Get chat history
curl "http://localhost:8000/chat-history"

# Start new chat
curl -X POST "http://localhost:8000/new-chat"
```

## 🎨 Customization

### Changing the AI Model

To use OpenAI instead of Gemini:

1. Install OpenAI package:
```bash
pip install openai
```

2. Update `main.py`:
```python
import openai
from openai import OpenAI

# Replace Gemini configuration with:
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Update the chat endpoint:
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": message.message}]
)
ai_response = response.choices[0].message.content
```

3. Update your `.env` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Styling Customization

The frontend uses Tailwind CSS. You can customize:

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Layout**: Modify the React components in `src/components/`
- **Animations**: Add custom animations in `App.css`

## 🔒 Security Notes

- **API Keys**: Never commit API keys to version control
- **CORS**: The backend is configured for local development only
- **Data Storage**: Chat history is stored locally in JSON files

## 🐛 Troubleshooting

### Common Issues

1. **CORS Error**: Make sure the backend is running on port 8000
2. **API Key Error**: Verify your Gemini API key is correct and has quota
3. **Module Not Found**: Ensure all dependencies are installed
4. **Port Conflicts**: Change ports in the configuration if needed

### Backend Issues
```bash
# Check if server is running
curl http://localhost:8000/

# View server logs
python main.py
```

### Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance

- **Response Time**: Typical AI response time is 1-3 seconds
- **Storage**: JSON files are lightweight and efficient for small to medium datasets
- **Scalability**: For production use, consider migrating to a proper database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
4. Contact the maintainers

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File upload support
- [ ] Voice chat capabilities
- [ ] Multiple AI model support
- [ ] Chat export functionality
- [ ] Dark mode theme
- [ ] Real-time typing indicators

---

**Happy Chatting! 🚀**# AI-CHATBOT
