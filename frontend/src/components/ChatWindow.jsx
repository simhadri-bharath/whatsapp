import { useState, useEffect, useRef } from 'react';
import { fetchMessagesByWaId, postMessage } from '../services/api';
import { socket } from '../services/socket';
import Header from './Header';
import MessageBubble from './MessageBubble';
import { SendIcon } from './Icons'; 

const ChatWindow = ({ chatId, onBack, theme, onThemeToggle }) => {
  const [chatData, setChatData] = useState({ userInfo: {}, messages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.connect();

    // This function will now be the ONLY way new messages are added to the state
    function onNewMessage(newMessage) {
      // Only update if the message belongs to the currently open chat
      if (newMessage.wa_id === chatId) {
        setChatData(prevData => ({
          ...prevData,
          messages: [...prevData.messages, newMessage]
        }));
      }
    }

    socket.on('newMessage', onNewMessage);

    return () => {
      socket.off('newMessage', onNewMessage);
      socket.disconnect();
    };
  }, [chatId]); // Rerun effect if the user switches chats

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial messages when chat ID changes
  useEffect(() => {
    const getMessages = async () => {
      if (!chatId) return;
      setLoading(true);
      try {
        const data = await fetchMessagesByWaId(chatId);
        setChatData(data);
      } catch (err) {
        setError('Failed to fetch messages.');
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [chatId]);

  // Scroll to bottom whenever messages array changes
  useEffect(() => {
    scrollToBottom();
  }, [chatData.messages]);


  // THE MAJOR CHANGE IS HERE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // 1. Send the message to the backend.
    await postMessage(chatId, newMessage);
    
    // 2. Clear the input field.
    setNewMessage('');

    // 3. DO NOT update the state here. Wait for the WebSocket event to arrive.
  };


  if (loading) return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

   return (
    <div className="flex flex-col h-full bg-[#e5ddd5] dark:bg-gray-900">
      {/* Pass all the required props to the Header */}
      <Header
        name={chatData.userInfo.name}
        number={chatData.userInfo.wa_id} // Pass the number
        onBack={onBack}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />

      <main className="flex-grow p-4 overflow-y-auto">
        {chatData.messages.map((msg) => (
          <MessageBubble key={msg.message_id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-[#f0f2f5] dark:bg-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            // ... (no changes here)
            className="flex-grow p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
          />
          {/* Use the SendIcon in the button */}
          <button type="submit" className="ml-4 p-3 bg-green-500 text-white rounded-full font-semibold flex items-center justify-center">
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;