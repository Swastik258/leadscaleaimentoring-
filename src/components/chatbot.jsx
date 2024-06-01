import React, { useState } from 'react';
import axios from 'axios';
import './chatbot.css';

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [theme, setTheme] = useState('light');

  const allowedCategories = [
    "programming", "coding", "development", "java", "python", "javascript", "finance", "stock", "crypto", "blockchain",
    "technology", "tech", "news", "updates", "roadmap", "career"
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard'));
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=235');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20awesome%20chatbot`, '_blank', 'width=550,height=235');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=Awesome%20Chatbot&summary=Check%20out%20this%20chatbot`, '_blank', 'width=550,height=235');
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=Hey,%20check%20out%20this%20chatbot:%20${url}`, '_blank', 'width=550,height=235');
  };

  async function generate() {
    if (question.trim() === "") {
      setAnswer("Please enter a question.");
      return;
    }

    const isQuestionAllowed = allowedCategories.some(category =>
      question.toLowerCase().includes(category)
    );

    if (!isQuestionAllowed) {
      setAnswer("Please ask a question related to coding, finance, or tech news.");
      return;
    }

    try {
      setAnswer("Generating...");
      setLoading(true);

      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBWSQ7Xs2Y3a7v2gqoRHXrLYMZ-Lg_gJlg",
        method: "POST",
        data: {
          contents: [
            { parts: [{ text: question }] },
          ]
        }
      });

      const generatedText = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedText);
      setChatHistory([...chatHistory, { question, answer: generatedText, timestamp: new Date().toLocaleString() }]);
      setLoading(false);
    } catch (error) {
      console.error("Error generating content:", error);
      setAnswer("An error occurred while generating the content.");
      setLoading(false);
    }
  }

  const handleSearch = (searchTerm) => {
    const filteredHistory = chatHistory.filter(entry =>
      entry.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setChatHistory(filteredHistory);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <div className={`chatbot-container ${theme}`}>
      <div className="chatbot-box">
        <h1 className="title">Mentoring AI</h1>
        
        <textarea
          className="question-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question here"
          rows="4"
        />
        <button
          className="generate-button"
          onClick={generate}
        >
          Generate Answer
        </button>
        {loading && (
          <div className="loading-spinner"></div>
        )}
        <div className="answer-box">
          {answer && <pre className="answer-text">{answer}</pre>}
        </div>
        <div className="chat-history-container">
          <h2 className="chat-history-title">Chat History</h2>
          <div className="chat-history">
            {chatHistory.map((entry, index) => (
              <div key={index} className="chat-history-entry">
                <div>
                  <p className="font-semibold"><strong>Q:</strong> {entry.question}</p>
                  <p><strong>A:</strong> <pre className="whitespace-pre-wrap">{entry.answer}</pre></p>
                  <p className="timestamp">{entry.timestamp}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => setChatHistory(chatHistory.filter((_, i) => i !== index))}
                  aria-label="Delete this entry"
                >
                  <img src="https://img.icons8.com/ios-glyphs/30/000000/trash.png" alt="Delete"/>
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search chat history..."
            className="search-input"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            className="clear-history-button"
            onClick={clearChatHistory}
          >
            Clear Chat History
          </button>
        </div>
        <div className="button-group">
          <button
            className="theme-toggle-button"
            onClick={toggleTheme}
          >
            Switch Theme
          </button>
          <button
            className="copy-button"
            onClick={() => copyToClipboard(answer)}
          >
            Copy Answer
          </button>
          <button
            className="clear-question-button"
            onClick={() => setQuestion("")}
          >
            Clear Question
          </button>
          <div className="flex space-x-2">
            <button
              className="social-button"
              onClick={shareOnFacebook}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" alt="Facebook" className="w-5 h-5"/>
            </button>
            <button
              className="social-button"
              onClick={shareOnTwitter}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter--v1.png" alt="Twitter" className="w-5 h-5"/>
            </button>
            <button
              className="social-button"
              onClick={shareOnLinkedIn}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" className="w-5 h-5"/>
            </button>
            <button
              className="social-button"
              onClick={shareOnWhatsApp}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" alt="WhatsApp" className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
