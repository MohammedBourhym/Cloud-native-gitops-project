import React, { useState, useEffect } from 'react';
import { apiService, AVAILABLE_TOOLS } from '../services/apiService';

interface Command {
  id: string;
  toolName: string;
  commandText: string;
  explanation: string;
}

interface ToolCommands {
  [key: string]: Command[];
}

const SavedCommands: React.FC = () => {
  const [commands, setCommands] = useState<ToolCommands>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  
  const tools = Object.keys(commands);
  
  useEffect(() => {
    fetchAllCommands();
  }, []);
  
  const fetchAllCommands = async () => {
    setLoading(true);
    try {
      const commandsByTool: ToolCommands = {};
      
      // For each available tool, try to get its commands
      for (const tool of AVAILABLE_TOOLS) {
        try {
          const commands = await apiService.getSavedCommands(tool);
          if (commands.length > 0) {
            commandsByTool[tool] = commands;
          }
        } catch (error) {
          console.error(`Error fetching commands for ${tool}:`, error);
        }
      }
      
      setCommands(commandsByTool);
      if (Object.keys(commandsByTool).length > 0) {
        setSelectedTool(Object.keys(commandsByTool)[0]);
      }
    } catch (error) {
      console.error('Error fetching commands:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCommandsForTool = async (tool: string) => {
    if (!tool) return;
    
    setLoading(true);
    try {
      // For now, we're not implementing search in the API service
      // so we'll just get all commands for the tool
      const commands = await apiService.getSavedCommands(tool);
      
      // If there's a search text, filter the results client-side
      const filteredCommands = searchText
        ? commands.filter(cmd => 
            cmd.commandText.toLowerCase().includes(searchText.toLowerCase()) ||
            cmd.explanation.toLowerCase().includes(searchText.toLowerCase())
          )
        : commands;
      
      setCommands(prev => ({
        ...prev,
        [tool]: filteredCommands
      }));
    } catch (error) {
      console.error(`Error fetching commands for ${tool}:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    if (selectedTool) {
      fetchCommandsForTool(selectedTool);
    }
  };
  
  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    setSearchText('');
    setSelectedCommand(null);
    // If we already have the commands for this tool, don't fetch again
    if (!commands[tool]) {
      fetchCommandsForTool(tool);
    }
  };
  
  return (
    <div>
      {/* Tool selector */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <span className="text-orange-500 font-bold">$</span>
          <span className="text-orange-400 ml-2 font-semibold">ls --tools</span>
          <span className="text-gray-400 text-sm ml-auto">Browse saved commands</span>
        </div>
        
        {loading && tools.length === 0 ? (
          <div className="bg-gray-900/80 p-5 rounded-lg flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-orange-400 border-t-transparent rounded-full mr-3"></div>
            <p className="text-orange-400 font-mono">Loading saved commands...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="bg-gray-900/80 p-5 rounded-lg">
            <p className="text-yellow-400 font-mono">No saved commands found. Complete some quizzes and save commands to see them here.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 bg-gray-900/80 p-4 rounded-lg">
            {tools.map((tool) => (
              <button
                key={tool}
                onClick={() => handleToolChange(tool)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 font-mono ${
                  selectedTool === tool
                    ? 'bg-orange-600/30 text-orange-300 shadow-lg shadow-orange-900/20 border border-orange-500/30 transform scale-105'
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:shadow-md border border-gray-700/50'
                }`}
              >
                <span className="font-medium">{tool}</span>
                <span className="bg-gray-900/50 px-2 py-0.5 rounded-full text-xs">
                  {commands[tool]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Search bar */}
      {selectedTool && commands[selectedTool]?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span className="text-orange-500 font-bold">$</span>
            <span className="text-orange-400 ml-2 font-semibold">grep</span>
            <span className="text-gray-400 text-sm ml-auto">Filter commands</span>
          </div>
          <div className="flex">
            <span className="bg-gray-900/90 text-orange-400 px-3 py-2.5 border border-gray-800 border-r-0 rounded-l-md font-bold">
              ❯
            </span>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-gray-900/90 text-white px-3 py-2.5 border border-gray-800 rounded-r-md focus:outline-none focus:ring-1 focus:ring-orange-500/50 font-['Fira_Code']"
              placeholder="Search commands..."
            />
          </div>
          <button
            onClick={handleSearch}
            className="mt-3 px-4 py-2 bg-gray-800 text-orange-400 rounded-md hover:bg-gray-700 transition-colors text-sm flex items-center border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>
      )}
      
      {/* Command list */}
      {selectedTool && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span className="text-orange-500 font-bold">$</span>
            <span className="text-orange-400 ml-2 font-semibold">cat commands.txt</span>
            <span className="text-gray-400 text-sm ml-auto">
              {commands[selectedTool]?.length || 0} commands for {selectedTool}
            </span>
          </div>
          
          {loading ? (
            <div className="bg-gray-900/80 p-5 rounded-lg flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-orange-400 border-t-transparent rounded-full mr-3"></div>
              <p className="text-orange-400 font-mono">Loading commands...</p>
            </div>
          ) : commands[selectedTool]?.length === 0 ? (
            <div className="bg-gray-900/80 p-5 rounded-lg">
              <p className="text-yellow-400 font-mono">No commands found for {selectedTool}.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commands[selectedTool].map((command) => (
                <div 
                  key={command.id}
                  className={`bg-gray-900/80 p-4 rounded-lg border border-gray-800 hover:border-orange-500/30 transition-all cursor-pointer ${
                    selectedCommand?.id === command.id ? 'border-orange-500/50 shadow-md shadow-orange-900/10' : ''
                  }`}
                  onClick={() => setSelectedCommand(command)}
                >
                  <div className="font-['Fira_Code'] text-orange-400 mb-2 px-2 py-1 bg-gray-900/50 rounded overflow-x-auto whitespace-nowrap">
                    $ {command.commandText}
                  </div>
                  
                  {selectedCommand?.id === command.id && (
                    <div className="mt-3 text-gray-300 text-sm bg-gray-900/50 p-3 rounded border-l-2 border-orange-600">
                      <p className="text-xs text-gray-400 mb-1">Explanation:</p>
                      <p className="font-mono">{command.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedCommands;
