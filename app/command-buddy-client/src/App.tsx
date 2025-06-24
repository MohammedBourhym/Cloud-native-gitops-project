import { useState } from 'react'
import Terminal from './components/Terminal'
import CommandQuiz from './components/CommandQuiz'
import SavedCommands from './components/SavedCommands'
import Nav from './components/Nav'

function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'saved'>('quiz')

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Enhanced orange glow effect at the top */}
      <div className="fixed  top-0 left-0 right-0 h-60 bg-gradient-to-b from-orange-600/15 to-transparent pointer-events-none"></div>
      
      <Terminal title="command-buddy@localhost:~">
        <div className="mx-auto">
          <div className="flex items-center mb-6">
            <div className="text-lg font-['Fira_Code'] text-orange-400 font-bold flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <span className="bg-black p-1">Command Buddy</span>
            </div>
            <div className="ml-auto flex items-center text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              <span className="text-xs">Online</span>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6 leading-relaxed max-w-3xl text-sm border-l-2 border-orange-600/50 pl-3 py-1 bg-gray-900/30">
            Master command line tools through interactive quizzes and practice. 
            Select a tool below, answer questions, and build your CLI skills one command at a time.
          </p>
          
          <Nav activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 'quiz' ? <CommandQuiz /> : <SavedCommands />}
        </div>
      </Terminal>
      
      <footer className="text-center text-gray-600 text-xs mt-6 font-mono">
        <div className="flex justify-center items-center space-x-2">
          <span className="text-orange-500">$</span>
          <span>echo "© {new Date().getFullYear()} Command Buddy | Practice makes perfect"</span>
        </div>
      </footer>
    </div>
  )
}

export default App
