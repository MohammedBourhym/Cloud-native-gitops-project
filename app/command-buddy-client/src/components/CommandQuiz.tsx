import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';

interface Tool {
  name: string;
  icon: string;
  description: string;
}

const tools: Tool[] = [
  { name: 'git', icon: '🔄', description: 'Version control system for tracking changes' },
  { name: 'docker', icon: '🐳', description: 'Platform for developing, shipping, and running applications' },
  { name: 'kubernetes', icon: '☸️', description: 'Container orchestration system for automating deployment' },
  { name: 'bash', icon: '💻', description: 'Unix shell and command language' },
  { name: 'npm', icon: '📦', description: 'Package manager for JavaScript and Node.js' },
  { name: 'mvn', icon: '🏗️', description: 'Build automation tool for Java projects' }
];

const CommandQuiz: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toolMenuOpen, setToolMenuOpen] = useState<boolean>(false);
  const [highlightedTool, setHighlightedTool] = useState<number>(0);
  
  const answerInputRef = useRef<HTMLInputElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation for tools menu
  useEffect(() => {
    if (!toolMenuOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedTool(prev => (prev < tools.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedTool(prev => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          selectTool(tools[highlightedTool].name);
          setToolMenuOpen(false);
          break;
        case 'Escape':
          e.preventDefault();
          setToolMenuOpen(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toolMenuOpen, highlightedTool]);
  
  // Generate a question when a tool is selected
  useEffect(() => {
    if (selectedTool) {
      generateQuestion();
    }
  }, [selectedTool]);
  
  // Scroll highlighted tool into view
  useEffect(() => {
    if (toolMenuOpen && toolsRef.current) {
      const highlightedElement = toolsRef.current.querySelector(`[data-index="${highlightedTool}"]`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedTool, toolMenuOpen]);
  
  const selectTool = (toolName: string) => {
    setSelectedTool(toolName);
    setToolMenuOpen(false);
    
    // Focus answer input after tool selection and question generation
    setTimeout(() => {
      if (answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }, 1000);
  };
  
  const generateQuestion = async () => {
    setLoading(true);
    setQuestion('');
    setFeedback('');
    setAnswer('');
    
    console.log('Generating question for tool:', selectedTool);
    
    try {
      const data = await apiService.getQuizQuestion(selectedTool);
      console.log('Received question data:', data);
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
      const data = await apiService.checkAnswer(selectedTool, question, answer);
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
      await apiService.saveCommand(selectedTool, answer, feedback);
      alert('Command saved successfully!');
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Error saving command. Please try again.');
    }
  };
  
  return (
    <div>
      {/* Tool selection - Terminal style with ls-like output */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <span className="text-orange-500 font-bold">$</span>
          <span className="text-orange-400 ml-2 font-semibold">ls --tools</span>
          <span className="text-gray-500 text-sm ml-auto">Select a tool to practice</span>
        </div>
        
        <div className="relative">
          <div 
            onClick={() => setToolMenuOpen(!toolMenuOpen)}
            className="flex items-center justify-between bg-gray-900/80 px-4 py-3 rounded-md cursor-pointer border border-gray-800 hover:border-orange-500/50 transition-colors"
          >
            {selectedTool ? (
              <div className="flex items-center">
                <span className="text-orange-400 mr-2">❯</span>
                <span className="text-gray-300 mr-2 text-sm">
                  {tools.find(t => t.name === selectedTool)?.icon}
                </span>
                <span className="text-gray-200 font-mono">{selectedTool}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-orange-400 mr-2">❯</span>
                <span className="text-gray-400 font-mono">Select a CLI tool</span>
              </div>
            )}
            <span className="text-gray-500 text-sm">{toolMenuOpen ? '▲' : '▼'}</span>
          </div>
          
          {toolMenuOpen && (
            <div 
              ref={toolsRef}
              className="absolute w-full mt-1 bg-gray-900/95 border border-gray-800 rounded-md overflow-hidden z-10 shadow-lg max-h-64 overflow-y-auto"
            >
              <div className="p-2 border-b border-gray-800 text-xs text-gray-500 font-mono bg-gray-900/80">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-1">Sel</div>
                  <div className="col-span-1">Icon</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-7">Description</div>
                </div>
              </div>
              
              {tools.map((tool, index) => (
                <div
                  key={tool.name}
                  data-index={index}
                  className={`px-3 py-2 cursor-pointer font-mono ${
                    highlightedTool === index 
                      ? 'bg-orange-600/20 border-l-2 border-orange-500' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={() => selectTool(tool.name)}
                  onMouseEnter={() => setHighlightedTool(index)}
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-orange-400">
                      {highlightedTool === index ? '❯' : ' '}
                    </div>
                    <div className="col-span-1 text-sm">{tool.icon}</div>
                    <div className={`col-span-3 ${highlightedTool === index ? 'text-orange-300' : 'text-gray-300'}`}>
                      {tool.name}
                    </div>
                    <div className="col-span-7 text-xs text-gray-500">
                      {tool.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500 font-mono bg-gray-900/30 p-2 rounded border-l border-gray-700/50">
          <span className="text-orange-400">Tip:</span> Use ↑/↓ arrows to navigate and Enter to select
        </div>
      </div>
      
      {/* Question area */}
      {selectedTool && (
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <span className="text-orange-500 font-bold">$</span>
            <span className="text-orange-400 ml-2 font-semibold">cat question.txt</span>
            <span className="text-gray-500 text-sm ml-auto">Your challenge</span>
          </div>
          <div className="bg-gray-900/80 p-5 rounded-md border border-gray-800 shadow-inner">
            {loading && !question ? (
              <div className="flex items-center">
                <div className="animate-pulse h-4 w-4 rounded-full bg-orange-400 mr-3"></div>
                <p className="text-orange-400 font-mono">Generating question...</p>
              </div>
            ) : (
              <>
                <p className="text-gray-200 leading-relaxed font-mono text-sm">{question}</p>
                <div className="terminal-cursor mt-2"></div>
              </>
            )}
          </div>
          <button
            onClick={() => {
              console.log('New Question button clicked');
              generateQuestion();
            }}
            className="mt-3 px-4 py-1.5 bg-gray-800 text-orange-400 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center border border-gray-700"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Question
          </button>
        </div>
      )}
      
      {/* Answer input */}
      {question && (
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <span className="text-orange-500 font-bold">$</span>
            <span className="text-orange-400 ml-2 font-semibold">{selectedTool}</span>
            <span className="text-gray-500 text-sm ml-auto">Type your command</span>
          </div>
          <div className="flex">
            <span className="bg-gray-900/90 text-orange-400 px-3 py-2.5 border border-gray-800 border-r-0 rounded-l-md font-bold">
              ❯
            </span>
            <input
              ref={answerInputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 bg-gray-900/90 text-white px-3 py-2.5 border border-gray-800 rounded-r-md focus:outline-none focus:ring-1 focus:ring-orange-500/50 font-['Fira_Code'] text-base shadow-inner"
              placeholder="Type your command here..."
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              autoFocus
            />
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={checkAnswer}
              className="px-4 py-2 bg-gray-800 text-orange-400 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center flex-1 justify-center border border-gray-700"
              disabled={!answer.trim() || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-orange-400 border-t-transparent rounded-full mr-2"></div>
                  Checking...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Submit Answer
                </>
              )}
            </button>
            <button 
              onClick={() => setAnswer('')}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm border border-gray-700"
              disabled={!answer.trim() || loading}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* Feedback area */}
      {feedback && (
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <span className="text-orange-500 font-bold">$</span>
            <span className="text-orange-400 ml-2 font-semibold">result</span>
            <span className="text-gray-500 text-sm ml-auto">Result & explanation</span>
          </div>
          <div className="bg-gray-900/80 p-5 rounded-md border border-gray-800 shadow-inner relative overflow-hidden">
            {/* Color indicator for correct/incorrect answers */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${feedback.toLowerCase().includes('correct') ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="whitespace-pre-line ml-2">
              <p className="text-gray-200 leading-relaxed font-mono text-sm">{feedback}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={saveCommand}
              className="px-4 py-2 bg-gray-800 text-orange-400 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center border border-gray-700"
              disabled={!answer.trim() || !feedback}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Command
            </button>
            <button
              onClick={() => {
                console.log('Next Question button clicked');
                generateQuestion();
              }}
              className="px-4 py-2 bg-gray-800 text-orange-400 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center border border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandQuiz;
