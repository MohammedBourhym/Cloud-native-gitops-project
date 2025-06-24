import React from 'react';

interface NavProps {
  activeTab: 'quiz' | 'saved';
  onTabChange: (tab: 'quiz' | 'saved') => void;
}

const Nav: React.FC<NavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 mb-6 border-b border-gray-700 pb-2">
      <button
        className={`px-3 py-1 ${
          activeTab === 'quiz'
            ? 'text-green-400 border-b-2 border-green-400'
            : 'text-gray-400 hover:text-gray-300'
        }`}
        onClick={() => onTabChange('quiz')}
      >
        Quiz
      </button>
      <button
        className={`px-3 py-1 ${
          activeTab === 'saved'
            ? 'text-green-400 border-b-2 border-green-400'
            : 'text-gray-400 hover:text-gray-300'
        }`}
        onClick={() => onTabChange('saved')}
      >
        Saved Commands
      </button>
    </div>
  );
};

export default Nav;
