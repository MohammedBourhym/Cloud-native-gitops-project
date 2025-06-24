import React, { useState, useEffect } from 'react';

interface Tool {
  name: string;
  icon: string;
}

const tools: Tool[] = [
  { name: 'git', icon: '🔄' },
  { name: 'docker', icon: '🐳' },
  { name: 'kubernetes', icon: '☸️' },
  { name: 'bash', icon: '💻' },
  { name: 'npm', icon: '📦' },
  { name: 'mvn', icon: '🏗️' }
];

const CommandQuiz: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Generate a question when a tool is selected
  useEffect(() => {
    if (selectedTool) {
      generateQuestion();
    }
  }, [selectedTool]);
  
  const generateQuestion = async () => {
    setLoading(true);
    setQuestion('');
    setFeedback('');
    setAnswer('');
    
    try {
      const response = await fetch(`/api/quiz/${selectedTool}`);
      const data = await response.json();
      setQuestion(data.question);
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Error generating question. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const checkAnswer = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    setFeedback('');
    
    try {
      const response = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: selectedTool,
          question,
          answer,
        }),
      });
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error checking answer:', error);
      setFeedback('Error checking answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveCommand = async () => {
    if (!answer.trim() || !feedback) return;
    
    try {
      await fetch('/api/quiz/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: selectedTool,
          command: answer,
          explanation: feedback,
        }),
      });
      
      alert('Command saved successfully!');
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Error saving command. Please try again.');
    }
  };
  
  return (
    <div>
      {/* Tool selection */}
      <div className="mb-6">
        <p className="text-green-400 mb-2">$ select_tool</p>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => setSelectedTool(tool.name)}
              className={`px-3 py-1 rounded flex items-center gap-1 ${
                selectedTool === tool.name
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Question area */}
      {selectedTool && (
        <div className="mb-6">
          <p className="text-green-400 mb-2">$ question</p>
          <div className="bg-gray-800 p-3 rounded border border-gray-700">
            {loading && !question ? (
              <p className="text-yellow-400">Generating question...</p>
            ) : (
              <p className="text-white">{question}</p>
            )}
          </div>
          <button
            onClick={generateQuestion}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            disabled={loading}
          >
            New Question
          </button>
        </div>
      )}
      
      {/* Answer input */}
      {question && (
        <div className="mb-6">
          <p className="text-green-400 mb-2">$ your_answer</p>
          <div className="flex">
            <span className="bg-gray-800 text-green-400 px-2 py-1 border border-gray-700 border-r-0 rounded-l">
              &gt;
            </span>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 bg-gray-800 text-white px-2 py-1 border border-gray-700 rounded-r focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
              placeholder="Type your command here..."
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
          </div>
          <button
            onClick={checkAnswer}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            disabled={!answer.trim() || loading}
          >
            Submit
          </button>
        </div>
      )}
      
      {/* Feedback area */}
      {feedback && (
        <div className="mb-6">
          <p className="text-green-400 mb-2">$ feedback</p>
          <div className="bg-gray-800 p-3 rounded border border-gray-700 whitespace-pre-line">
            <p className="text-white">{feedback}</p>
          </div>
          <button
            onClick={saveCommand}
            className="mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
          >
            Save Command
          </button>
        </div>
      )}
    </div>
  );
};

export default CommandQuiz;
