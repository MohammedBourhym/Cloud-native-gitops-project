import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface TerminalProps {
  children: ReactNode;
  title?: string;
}

const Terminal: React.FC<TerminalProps> = ({ children, title = 'command-buddy' }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    // Updated: Center the terminal with max-width and margin auto
  
    <div className="mx-auto  my-10 max-w-7xl w-full overflow-hidden transition-all duration-300 relative">
      {/* Enhanced orange glow effect behind terminal - more pronounced */}
      <div className="absolute -inset-2 bg-gradient-to-b from-orange-500/30 to-transparent blur-xl rounded-xl -z-10 transform scale-105 opacity-80"></div>
      
      {/* Terminal window with enhanced shadow effect and increased border radius */}
      <div className={`rounded-xl shadow-2xl bg-black border border-gray-800 overflow-hidden relative ${isMinimized ? 'h-14' : ''}`}
           ref={terminalRef}>
        
        {/* Terminal header - macOS style */}
        <div className="flex items-center px-4 py-2 bg-gray-900/90 border-b border-gray-700/50">
          {/* Traffic light buttons with hover effects - smaller size */}
          <div className="flex space-x-1.5">
            <button 
              className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors duration-150 flex items-center justify-center group"
              title="Close"
            >
              <span className="opacity-0 group-hover:opacity-100 text-red-900 text-xs">×</span>
            </button>
            <button 
              onClick={toggleMinimize}
              className="w-2.5 h-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors duration-150 flex items-center justify-center group"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <span className="opacity-0 group-hover:opacity-100 text-yellow-900 text-xs">−</span>
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors duration-150 flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-green-900 text-xs">+</span>
            </div>
          </div>
          
          {/* Terminal title with custom font */}
          <div className="flex-1 text-center text-xs text-gray-400 font-mono tracking-wide">
            {title}
          </div>
          
          {/* Current time for realism */}
          <div className="text-xs text-gray-500 font-mono">
            {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        {/* Terminal content with conditional rendering based on minimized state */}
        {!isMinimized && (
          <div className="p-5 font-['Fira_Code'] text-gray-200 bg-black min-h-[500px] max-h-[75vh] overflow-auto
                         border-t border-gray-800/50 shadow-inner">
            {children}
          </div>
        )}
        
        {/* Enhanced terminal glow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-orange-500/15 to-transparent pointer-events-none"></div>
      </div>
      </div>

  );
};

export default Terminal;
