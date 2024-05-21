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
    setTheme(theme === 'light'? 'dark' : 'light');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard'));
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
      setChatHistory([...chatHistory, { question, answer: generatedText }]);
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
    <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center ${theme === 'dark'? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Mentoring AI</h1>
        <textarea
          className="w-full p-4 mb-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question here"
          rows="4"
        />
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={generate}
        >
          Generate Answer
        </button>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
          </div>
        )}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner max-w-4xl mx-auto">
          {answer && renderAnswer()}
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-center text-white">Chat History</h2>
          <div className="max-h-64 overflow-y-auto space-y-4">
            {chatHistory.map((entry, index) => (
              <div key={index} className="bg-gray-600 p-4 rounded-lg shadow-inner">
                <p className="text-white"><strong>Q:</strong> {entry.question}</p>
                <p className="text-white"><strong>A:</strong> {entry.answer}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search chat history..."
            className="md:hidden p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleTheme}
          >
            Switch Theme
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => copyToClipboard(answer)}
          >
            Copy Answer
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setQuestion("")}
          >
            Clear Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
