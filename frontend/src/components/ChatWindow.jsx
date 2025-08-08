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
    function onNewMessage(newMessage) {
      if (newMessage.wa_id === chatId) {
        setChatData(prevData => {
          const messageExists = prevData.messages.some(msg => msg.message_id === newMessage.message_id);
          if (!messageExists) {
            return { ...prevData, messages: [...prevData.messages, newMessage] };
          }
          return prevData;
        });
      }
    }
    socket.on('newMessage', onNewMessage);
    return () => {
      socket.off('newMessage', onNewMessage);
      socket.disconnect();
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [chatData.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await postMessage(chatId, newMessage);
    setNewMessage('');
  };

  if (loading) return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5] dark:bg-dark-bg">
      <Header
        name={chatData.userInfo.name}
        number={chatData.userInfo.wa_id}
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
      <footer className="p-4 bg-[#f0f2f5] dark:bg-dark-primary">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-2 rounded-lg border-2 border-gray-300 dark:border-dark-secondary bg-white dark:bg-dark-secondary text-gray-800 dark:text-dark-text focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="ml-4 p-3 bg-green-500 text-white rounded-full font-semibold flex items-center justify-center">
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;