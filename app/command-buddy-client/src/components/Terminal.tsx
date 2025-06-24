import React from 'react';
import type { ReactNode } from 'react';

interface TerminalProps {
  children: ReactNode;
  title?: string;
}

const Terminal: React.FC<TerminalProps> = ({ children, title = 'command-buddy' }) => {
  return (
    <div className="mx-auto my-8 max-w-4xl overflow-hidden">
      {/* Terminal window with shadow effect */}
      <div className="rounded-lg shadow-lg bg-gray-800 border border-gray-700 overflow-hidden relative">
        {/* Orange glow effect behind terminal */}
        <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-lg -z-10 transform scale-105"></div>
        
        {/* Terminal header */}
        <div className="flex items-center px-4 py-2 bg-gray-900 border-b border-gray-700">
          {/* Traffic light buttons */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Terminal title */}
          <div className="flex-1 text-center text-sm text-gray-400 font-mono">
            {title}
          </div>
          
          {/* Empty div for balance */}
          <div className="w-12"></div>
        </div>
        
        {/* Terminal content */}
        <div className="p-4 font-mono text-gray-300 bg-gray-900 min-h-96">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
