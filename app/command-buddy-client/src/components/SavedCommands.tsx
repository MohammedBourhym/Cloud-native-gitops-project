import React, { useState, useEffect } from 'react';

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
  
  const tools = Object.keys(commands);
  
  useEffect(() => {
    fetchAllCommands();
  }, []);
  
  const fetchAllCommands = async () => {
    setLoading(true);
    try {
      // Get all tools with commands
      const toolsResponse = await fetch('/commands');
      const toolsData = await toolsResponse.json();
      
      const commandsByTool: ToolCommands = {};
      
      // For each tool, get its commands
      for (const tool of toolsData) {
        const response = await fetch(`/commands/${tool}`);
        const data = await response.json();
        if (data.length > 0) {
          commandsByTool[tool] = data;
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
      const url = searchText
        ? `/commands/${tool}/search?searchText=${encodeURIComponent(searchText)}`
        : `/commands/${tool}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setCommands(prev => ({
        ...prev,
        [tool]: data
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
    // If we already have the commands for this tool, don't fetch again
    if (!commands[tool]) {
      fetchCommandsForTool(tool);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <p className="text-green-400 mb-2">$ saved_commands</p>
        
        {loading && Object.keys(commands).length === 0 ? (
          <p className="text-yellow-400">Loading commands...</p>
        ) : Object.keys(commands).length === 0 ? (
          <p className="text-gray-400">No saved commands found. Start saving some!</p>
        ) : (
          <>
            {/* Tool selection */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleToolChange(tool)}
                    className={`px-3 py-1 rounded ${
                      selectedTool === tool
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Search */}
            {selectedTool && (
              <div className="mb-4 flex">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="flex-1 bg-gray-800 text-white px-2 py-1 border border-gray-700 rounded-l focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
                  placeholder="Search commands..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-3 py-1 rounded-r hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            )}
            
            {/* Command list */}
            {selectedTool && commands[selectedTool] && commands[selectedTool].length > 0 ? (
              <div className="space-y-4">
                {commands[selectedTool].map((cmd) => (
                  <div
                    key={cmd.id}
                    className="bg-gray-800 p-3 rounded border border-gray-700"
                  >
                    <p className="text-purple-400 font-bold mb-1">$ {cmd.commandText}</p>
                    <p className="text-gray-300 text-sm">{cmd.explanation}</p>
                  </div>
                ))}
              </div>
            ) : selectedTool ? (
              <p className="text-gray-400">No commands found for {selectedTool}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedCommands;
