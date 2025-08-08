import { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
function App() {
const [selectedChatId, setSelectedChatId] = useState(null);
// --- THEME STATE LOGIC ---
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
useEffect(() => {
// Apply the theme class to the root HTML element
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
// --- END THEME LOGIC ---
const isMobile = window.innerWidth < 768;
return (
// The background color is now controlled by body styles via dark mode
<div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
<div className="w-full h-full md:w-[95%] md:h-[95%] md:max-w-6xl flex shadow-2xl bg-white dark:bg-gray-800">
    <div className={`
      w-full md:w-[35%] lg:w-[30%] h-full overflow-y-auto
      ${isMobile && selectedChatId ? 'hidden' : 'block'} 
    `}>
      <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
    </div>

    <div className={`
      w-full md:w-[65%] lg:w-[70%] h-full flex-col border-l border-gray-300 dark:border-gray-700
      ${isMobile && !selectedChatId ? 'hidden' : 'flex'}
    `}>
      {selectedChatId ? (
        <ChatWindow 
          key={selectedChatId} 
          chatId={selectedChatId} 
          onBack={() => setSelectedChatId(null)}
          // Pass theme state and toggle function down
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />
      ) : (
        <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-[#f8f9fa] dark:bg-gray-800">
            <h2 className="text-2xl text-gray-500 dark:text-gray-400">Select a chat to start messaging</h2>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Your conversations will appear here.</p>
        </div>
      )}
    </div>
  </div>
</div>
);
}
export default App;