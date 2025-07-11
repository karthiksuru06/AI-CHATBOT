import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Trash2, History, Plus, Bot, User } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const messagesEndRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadCurrentSession();
  }, []);

  const loadCurrentSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/current-session`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading current session:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          type: 'bot',
          content: data.response,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/new-chat`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([]);
        setCurrentSessionId(data.session_id);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-history`);
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.sessions || []);
        setShowHistory(true);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const deleteChatHistory = async () => {
    if (!window.confirm('Are you sure you want to delete all chat history?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat-history`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChatHistory([]);
        setMessages([]);
        setShowHistory(false);
        alert('Chat history deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting chat history:', error);
    }
  };

  const loadHistorySession = (session) => {
    setMessages(session.messages || []);
    setShowHistory(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Time Unknown';
      }
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Time Unknown';
    }
  };

  const formatSessionDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Date Unknown';
      }
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date Unknown';
    }
  };

  const getSessionTitle = (session) => {
    if (!session.messages || session.messages.length === 0) {
      return 'New Chat';
    }
    const firstUserMessage = session.messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 30 
        ? firstUserMessage.content.substring(0, 30) + '...'
        : firstUserMessage.content;
    }
    return 'New Chat';
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Chatbot</h1>
                <p className="text-sm text-gray-600">Powered by Gemini Pro</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={startNewChat}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </button>
              
              <button
                onClick={loadChatHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </button>
              
              <button
                onClick={deleteChatHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        {/* Chat History Sidebar */}
        {showHistory && (
          <div className="w-96 bg-white shadow-lg border-r border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ✕
                </button>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
              >
                ← Back to Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No chat history yet</p>
                  <p className="text-xs text-gray-400 mt-1">Your conversations will appear here</p>
                </div>
              ) : (
                chatHistory.map((session, index) => (
                  <div
                    key={session.id}
                    onClick={() => loadHistorySession(session)}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {getSessionTitle(session)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatSessionDate(session.created_at)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {session.messages?.length || 0} messages
                    </div>
                    
                    {/* Chat Preview */}
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {session.messages?.slice(-3).map((msg, msgIndex) => (
                        <div key={msgIndex} className="text-xs">
                          <span className={`font-medium ${
                            msg.type === 'user' ? 'text-blue-600' : 'text-purple-600'
                          }`}>
                            {msg.type === 'user' ? 'You' : 'AI'}:
                          </span>
                          <span className="text-gray-600 ml-1">
                            {msg.content?.length > 60 
                              ? msg.content.substring(0, 60) + '...'
                              : msg.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">Welcome to AI Chatbot</h3>
                <p>Start a conversation by typing a message below!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user'
                          ? 'bg-blue-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 shadow-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.type === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white text-gray-800 shadow-md px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;