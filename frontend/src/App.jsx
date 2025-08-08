import { useState } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  // The logic for what to show on mobile
  const isMobile = window.innerWidth < 768; // md breakpoint is 768px

  return (
    <div className="w-screen h-screen bg-[#e5ddd5] flex items-center justify-center">
      <div className="w-full h-full md:w-[95%] md:h-[95%] md:max-w-6xl flex shadow-2xl bg-white">
        
        {/* --- LEFT SIDE / MOBILE VIEW --- */}
        {/* On mobile, show ChatList if NO chat is selected. */}
        {/* On desktop, always show ChatList. */}
        <div className={`
          w-full md:w-[35%] lg:w-[30%] h-full overflow-y-auto
          ${isMobile && selectedChatId ? 'hidden' : 'block'} 
        `}>
          <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
        </div>

        {/* --- RIGHT SIDE --- */}
        {/* On mobile, show ChatWindow ONLY if a chat IS selected. */}
        <div className={`
          w-full md:w-[65%] lg:w-[70%] h-full flex-col border-l border-gray-300
          ${isMobile && !selectedChatId ? 'hidden' : 'flex'}
        `}>
          {selectedChatId ? (
            <ChatWindow 
              key={selectedChatId} 
              chatId={selectedChatId} 
              onBack={() => setSelectedChatId(null)} // Pass the back function
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-[#f8f9fa]">
                <h2 className="text-2xl text-gray-500">Select a chat to start messaging</h2>
                <p className="text-gray-400 mt-2">Your conversations will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;