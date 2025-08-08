import { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center">
      <div className="w-full h-full md:w-[95%] md:h-[95%] md:max-w-6xl flex shadow-2xl bg-white dark:bg-dark-primary">
        
        <div className={`
          w-full md:w-[35%] lg:w-[30%] h-full overflow-y-auto
          ${isMobile && selectedChatId ? 'hidden' : 'block'} 
        `}>
          <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
        </div>

        <div className={`
          w-full md:w-[65%] lg:w-[70%] h-full flex-col border-l border-gray-300 dark:border-dark-secondary
          ${isMobile && !selectedChatId ? 'hidden' : 'flex'}
        `}>
          {selectedChatId ? (
            <ChatWindow 
              key={selectedChatId} 
              chatId={selectedChatId} 
              onBack={() => setSelectedChatId(null)}
              theme={theme}
              onThemeToggle={handleThemeToggle}
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-[#f8f9fa] dark:bg-dark-bg">
                <h2 className="text-2xl text-gray-500 dark:text-dark-text-secondary">Select a chat to start messaging</h2>
                <p className="text-gray-400 dark:text-dark-text-secondary mt-2">Your conversations will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;