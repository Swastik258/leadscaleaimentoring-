import React, { useState } from 'react';
import axios from 'axios';

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isRoadmap, setIsRoadmap] = useState(false);
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
      setIsRoadmap(false);
      return;
    }

    try {
      setAnswer("Generating...");
      setLoading(true);
      setIsRoadmap(question.toLowerCase().includes("roadmap") || question.toLowerCase().includes("career"));

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
      setIsRoadmap(false);
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

  function renderAnswer() {
    if (isRoadmap) {
      const steps = answer.split('\n').map((step, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6 transform hover:-translate-y-1 transition-transform duration-150 ease-in-out">
          <div className="flex items-center mb-2">
            <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold">Step {index + 1}</h3>
          </div>
          <p className="text-gray-700">{step}</p>
        </div>
      ));
      return <div className="space-y-4">{steps}</div>;
    } else {
      return <p className="bg-white p-6 rounded-lg shadow-lg text-gray-800">{answer}</p>;
    }
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-4`}>
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-2xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Mentoring AI</h1>
        
        <textarea
          className="w-full p-4 mb-4 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question here"
          rows="4"
        />
        <button
          className="w-full px-4 py-2 bg-black text-white border border-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={generate}
        >
          Generate Answer
        </button>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
          </div>
        )}
        <div className="mt-6 p-4 bg-gray-800 text-white rounded-lg shadow-inner max-w-4xl mx-auto">
          {answer && renderAnswer()}
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-center">Chat History</h2>
          <div className="max-h-64 overflow-y-auto space-y-4">
            {chatHistory.map((entry, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-inner flex justify-between items-center">
                <div>
                  <p><strong>Q:</strong> {entry.question}</p>
                  <p><strong>A:</strong> {entry.answer}</p>
                  <p className="text-sm text-gray-500">{entry.timestamp}</p>
                </div>
                <button
                  className="ml-4 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => setChatHistory(chatHistory.filter((_, i) => i !== index))}
                  aria-label="Delete this entry"
                >
                  <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash.png" alt="Delete"/>
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search chat history..."
            className="w-full p-2 mt-4 border border-white rounded-md focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            className="w-full mt-4 px-4 py-2 bg-red-600 text-white border border-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={clearChatHistory}
          >
            Clear Chat History
          </button>
        </div>
        <div className="flex justify-between mt-6 flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-black text-white border border-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleTheme}
          >
            Switch Theme
          </button>
          <button
            className="px-4 py-2 bg-black text-white border border-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => copyToClipboard(answer)}
          >
            Copy Answer
          </button>
          <button
            className="px-4 py-2 bg-black text-white border border-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setQuestion("")}
          >
            Clear Question
          </button>
          <div className="flex gap-2">
            <button
              className="p-2 bg-black text-white border border-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={shareOnFacebook}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" alt="Facebook" className="h-6 w-6"/>
            </button>
            <button
              className="p-2 bg-black text-white border border-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={shareOnTwitter}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter--v1.png" alt="Twitter" className="h-6 w-6"/>
            </button>
            <button
              className="p-2 bg-black text-white border border-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
              onClick={shareOnLinkedIn}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" className="h-6 w-6"/>
            </button>
            <button
              className="p-2 bg-black text-white border border-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              onClick={shareOnWhatsApp}
            >
              <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" alt="WhatsApp" className="h-6 w-6"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
