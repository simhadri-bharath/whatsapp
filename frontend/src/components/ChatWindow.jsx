import { useState, useEffect, useRef } from 'react';
import { fetchMessagesByWaId, postMessage } from '../services/api';
import Header from './Header';
import MessageBubble from './MessageBubble';

// We now accept an `onBack` prop
const ChatWindow = ({ chatId, onBack }) => {
  const [chatData, setChatData] = useState({ userInfo: {}, messages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

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
        console.error(err);
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

    try {
      const sentMessage = await postMessage(chatId, newMessage);
      setChatData(prevData => ({
        ...prevData,
        messages: [...prevData.messages, sentMessage]
      }));
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5]">
      {/* Pass the onBack function to the Header */}
      <Header name={chatData.userInfo.name} status="online" onBack={onBack} />

      <main className="flex-grow p-4 overflow-y-auto">
        {chatData.messages.map((msg) => (
          <MessageBubble key={msg.message_id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-[#f0f2f5]">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;