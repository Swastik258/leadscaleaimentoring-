


import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  const allowedCategories = [
    "programming", "coding", "development", "java", "python", "javascript", "finance", "stock", "crypto", "blockchain",
    "technology", "tech", "news", "updates", "roadmap", "career"
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
      addPoints(5);  // Reward points for copying the answer
    });
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=235');
    addPoints(10);  // Reward points for sharing on Facebook
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20awesome%20chatbot`, '_blank', 'width=550,height=235');
    addPoints(10);  // Reward points for sharing on Twitter
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=Awesome%20Chatbot&summary=Check%20out%20this%20chatbot`, '_blank', 'width=550,height=235');
    addPoints(10);  // Reward points for sharing on LinkedIn
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=Hey,%20check%20out%20this%20chatbot:%20${url}`, '_blank', 'width=550,height=235');
    addPoints(10);  // Reward points for sharing on WhatsApp
  };

  const showHelp = () => {
    alert('To use this chatbot, enter your question and click "Generate Answer". You can toggle the theme, copy the answer, clear the input, search chat history, and share the chatbot on social media.');
    addPoints(5);  // Reward points for viewing help
  };

  const exportChatHistory = () => {
    const chatHistoryString = chatHistory.map(entry => `Q: ${entry.question}\nA: ${entry.answer}\nTimestamp: ${entry.timestamp}\n\n`).join('');
    const blob = new Blob([chatHistoryString], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat_history.txt';
    link.click();
    addPoints(5);  // Reward points for exporting chat history
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const subscribeToUpdates = (service) => {
    // Placeholder function to simulate subscribing to updates
    alert(`Subscribed to updates from ${service}`);
    addPoints(10);  // Reward points for subscribing to updates
  };

  const addPoints = (pointsToAdd) => {
    const newPoints = points + pointsToAdd;
    setPoints(newPoints);

    // Check if the user earned a new badge
    if (newPoints >= 100 && !badges.includes('100 Points')) {
      setBadges([...badges, '100 Points']);
      alert('Congratulations! You earned the "100 Points" badge!');
    }
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
      addPoints(20);  // Reward points for generating an answer
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
    addPoints(5);  // Reward points for clearing chat history
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="w-1/5 bg-black text-white p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Mentoring AI</h1>
          <nav>
            <ul>
              <li className="mb-4 flex items-center relative">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={toggleProfileDropdown}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Profile" className="w-6 h-6 mr-2" />
                  Profile
                </button>
                {showProfileDropdown && (
                  <ul className="absolute left-0 mt-2 w-full bg-gray-700 rounded shadow-lg z-10">
                    <li className="py-2 px-4 hover:bg-gray-600 cursor-pointer">Settings</li>
                    <li className="py-2 px-4 hover:bg-gray-600 cursor-pointer">Logout</li>
                  </ul>
                )}
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={toggleTheme}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/sun.png" alt="Theme Toggle" className="w-6 h-6 mr-2" />
                  Theme
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={() => copyToClipboard(answer)}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/copy.png" alt="Copy" className="w-6 h-6 mr-2" />
                  Copy
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={() => setQuestion("")}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/clear-symbol.png" alt="Clear" className="w-6 h-6 mr-2" />
                  Clear
                </button>
              </li>
              <li className="mb-4">
                <input
                  type="text"
                  placeholder="Search chat history..."
                  className="w-full p-2 rounded bg-gray-700 placeholder-gray-400"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={showHelp}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/help.png" alt="Help" className="w-6 h-6 mr-2" />
                  Help
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-red-700 hover:bg-red-600 flex items-center"
                  onClick={clearChatHistory}
                >
                  <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash.png" alt="Clear History" className="w-6 h-6 mr-2" />
                  Clear History
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-green-700 hover:bg-green-600 flex items-center"
                  onClick={exportChatHistory}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/export.png" alt="Export Chat" className="w-6 h-6 mr-2" />
                  Export Chat
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 flex items-center"
                  onClick={() => subscribeToUpdates('Facebook')}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" alt="Facebook" className="w-6 h-6 mr-2" />
                  Get Facebook Updates
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-blue-400 hover:bg-blue-300 flex items-center"
                  onClick={() => subscribeToUpdates('Twitter')}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter--v1.png" alt="Twitter" className="w-6 h-6 mr-2" />
                  Get Twitter Updates
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-blue-700 hover:bg-blue-600 flex items-center"
                  onClick={() => subscribeToUpdates('LinkedIn')}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" className="w-6 h-6 mr-2" />
                  Get LinkedIn Updates
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-green-500 hover:bg-green-400 flex items-center"
                  onClick={() => subscribeToUpdates('WhatsApp')}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" alt="WhatsApp" className="w-6 h-6 mr-2" />
                  Get WhatsApp Updates
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-2">
          <button onClick={shareOnFacebook} className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" alt="Facebook" className="w-5 h-5" />
          </button>
          <button onClick={shareOnTwitter} className="w-8 h-8 flex items-center justify-center bg-blue-400 hover:bg-blue-300 rounded">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter--v1.png" alt="Twitter" className="w-5 h-5" />
          </button>
          <button onClick={shareOnLinkedIn} className="w-8 h-8 flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" className="w-5 h-5" />
          </button>
          <button onClick={shareOnWhatsApp} className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-400 rounded">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" alt="WhatsApp" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="w-4/5 p-8">
        <div className="mb-6">
          <textarea
            className="w-full p-4 border rounded mb-4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here"
            rows="4"
          />
          <button
            className="py-2 px-4  bg-blue-600 text-white rounded hover:bg-blue-500"
            onClick={generate}
          >
            Generate Answer
          </button>
        </div>
        {loading && (
          <div className="loading-spinner">Loading...</div>
        )}
        <div className="answer-box mb-6">
          {answer && <pre className="whitespace-pre-wrap bg-gray-200 p-4 rounded">{answer}</pre>}
        </div>
        <div className="chat-history-container">
          <h2 className="text-xl font-semibold mb-4">Chat History</h2>
          <div className="chat-history">
            {chatHistory.map((entry, index) => (
              <div key={index} className="chat-history-entry mb-4 p-4 bg-gray-200 rounded flex justify-between items-start">
                <div>
                  <p className="font-semibold"><strong>Q:</strong> {entry.question}</p>
                  <p><strong>A:</strong> <pre className="whitespace-pre-wrap">{entry.answer}</pre></p>
                  <p className="text-sm text-gray-500">{entry.timestamp}</p>
                </div>
                <button
                  className="delete-button ml-4"
                  onClick={() => setChatHistory(chatHistory.filter((_, i) => i !== index))}
                  aria-label="Delete this entry"
                >
                  <img src="https://img.icons8.com/ios-glyphs/30/000000/trash.png" alt="Delete" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;



