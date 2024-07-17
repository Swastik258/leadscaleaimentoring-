import React, { useState, useEffect } from 'react';
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
  const [dailyChallenge, setDailyChallenge] = useState("");

  const allowedCategories = [
    "programming", "coding", "development", "java", "python", "javascript", "finance", "stock", "crypto", "blockchain",
    "technology", "tech", "news", "updates", "roadmap", "career"
  ];

  const dailyQuestions = [
    "What is React?",
    "Explain closures in JavaScript.",
    "What is blockchain technology?",
    "Describe the basics of machine learning.",
    "What is the purpose of the 'useEffect' hook in React?"
  ];

  useEffect(() => {
    changeDailyChallenge();
  }, []);

  const changeDailyChallenge = () => {
    const randomIndex = Math.floor(Math.random() * dailyQuestions.length);
    setDailyChallenge(dailyQuestions[randomIndex]);
  };

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
      setQuestion("");  // Clear the question input
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
                    <li className="py-2 px-4">
                      <div className="text-lg font-semibold mb-2 text-green-500">Your Points: {points}</div>
                      <ul>
                        {badges.map((badge, index) => (
                          <li key={index} className="text-sm text-gray-400">{badge}</li>
                        ))}
                      </ul>
                    </li>
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
                  Copy Answer
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={clearChatHistory}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/delete-chat.png" alt="Clear History" className="w-6 h-6 mr-2" />
                  Clear Input
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={() => handleSearch(prompt('Enter search term:'))}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/search.png" alt="Search" className="w-6 h-6 mr-2" />
                  Search
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={shareOnFacebook}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" alt="Share on Facebook" className="w-6 h-6 mr-2" />
                  Share on Facebook
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={shareOnTwitter}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" alt="Share on Twitter" className="w-6 h-6 mr-2" />
                  Share on Twitter
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={shareOnLinkedIn}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="Share on LinkedIn" className="w-6 h-6 mr-2" />
                  Share on LinkedIn
                </button>
              </li>
              <li className="mb-4 flex items-center">
                <button
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={shareOnWhatsApp}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="Share on WhatsApp" className="w-6 h-6 mr-2" />
                  Share on WhatsApp
                </button>
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
                  className="w-full text-left py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 flex items-center"
                  onClick={exportChatHistory}
                >
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/download.png" alt="Export History" className="w-6 h-6 mr-2" />
                  Export Chat History
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Subscribe</h2>
          <ul>
            <li className="mb-2">
              <button
                className="w-full text-left py-2 px-4 rounded bg-blue-600 hover:bg-blue-500"
                onClick={() => subscribeToUpdates('Email')}
              >
                Email Updates
              </button>
            </li>
            <li className="mb-2">
              <button
                className="w-full text-left py-2 px-4 rounded bg-blue-600 hover:bg-blue-500"
                onClick={() => subscribeToUpdates('SMS')}
              >
                SMS Updates
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-4/5 bg-white p-8 flex flex-col">
        <h2 className="text-2xl font-semibold mb-6">Chat with our AI</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Daily Challenge</h3>
          <p className="mb-2">{dailyChallenge}</p>
          <button
            className="py-1 px-2 rounded bg-blue-600 text-white hover:bg-blue-500"
            onClick={changeDailyChallenge}
          >
            Change Question
          </button>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="mb-4 p-4 w-full h-40 border border-gray-300 rounded"
        />
        <button
          onClick={generate}
          className="mb-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {loading ? 'Generating...' : 'Generate Answer'}
        </button>
        <div
          className={`mb-4 p-4 w-full border border-gray-300 rounded ${loading ? 'bg-gray-100' : 'bg-gray-50'}`}
        >
          <h3 className="text-lg font-semibold">Answer</h3>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <p>{answer}</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Chat History</h3>
          <ul>
            {chatHistory.map((entry, index) => (
              <li key={index} className="mb-2">
                <strong>Q:</strong> {entry.question}<br />
                <strong>A:</strong> {entry.answer}<br />
                <small className="text-gray-500">{entry.timestamp}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
