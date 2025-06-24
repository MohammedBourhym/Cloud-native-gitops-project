import React, { useState, useEffect } from 'react';

interface NavProps {
  activeTab: 'quiz' | 'saved';
  onTabChange: (tab: 'quiz' | 'saved') => void;
}

const Nav: React.FC<NavProps> = ({ activeTab, onTabChange }) => {
  const [selectedOption, setSelectedOption] = useState<number>(activeTab === 'quiz' ? 0 : 1);
  const [showOptions, setShowOptions] = useState(false);
  
  const options = [
    { id: 'quiz', label: 'Command Quiz', description: 'Practice with interactive command line quizzes' },
    { id: 'saved', label: 'Saved Commands', description: 'View your collection of saved commands' }
  ];
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showOptions) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedOption(prev => (prev < options.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedOption(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          onTabChange(options[selectedOption].id as 'quiz' | 'saved');
          setShowOptions(false);
          break;
        case 'Escape':
          e.preventDefault();
          setShowOptions(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOptions, selectedOption, options, onTabChange]);
  
  // Sync selected option with active tab
  useEffect(() => {
    setSelectedOption(activeTab === 'quiz' ? 0 : 1);
  }, [activeTab]);
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <span className="text-orange-500 font-bold">$</span>
        <span className="text-orange-400 ml-2 font-semibold">ls --modes</span>
        <span className="text-gray-500 text-sm ml-auto">Choose how to interact</span>
      </div>
      
      <div className="relative">
        <div 
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-between bg-gray-900/80 px-4 py-3 rounded-md cursor-pointer border border-gray-800 hover:border-orange-500/50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-orange-400 mr-2">❯</span>
            <span className="text-gray-200">{options[selectedOption].label}</span>
          </div>
          <span className="text-gray-500 text-sm">{showOptions ? '▲' : '▼'}</span>
        </div>
        
        {showOptions && (
          <div className="absolute w-full mt-1 bg-gray-900/95 border border-gray-800 rounded-md overflow-hidden z-10 shadow-lg">
            {/* Terminal-style ls header */}
            <div className="p-2 bg-gray-900/80 text-xs text-gray-500 font-mono border-b border-gray-800/80">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1">Sel</div>
                <div className="col-span-4">Mode</div>
                <div className="col-span-7">Description</div>
              </div>
            </div>
            
            {options.map((option, index) => (
              <div
                key={option.id}
                className={`px-4 py-2.5 cursor-pointer font-mono ${
                  selectedOption === index 
                    ? 'bg-orange-600/20 border-l-2 border-orange-500' 
                    : 'hover:bg-gray-800/80'
                }`}
                onClick={() => {
                  onTabChange(option.id as 'quiz' | 'saved');
                  setSelectedOption(index);
                  setShowOptions(false);
                }}
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1 text-orange-400">
                    {selectedOption === index ? '❯' : ' '}
                  </div>
                  <div className={`col-span-4 ${selectedOption === index ? 'text-orange-300' : 'text-gray-300'}`}>
                    {option.label}
                  </div>
                  <div className="col-span-7 text-xs text-gray-500">
                    {option.description}
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
  );
};

export default Nav;
