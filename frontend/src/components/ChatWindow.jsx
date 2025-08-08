import { useState, useEffect, useRef } from 'react';
import { fetchMessagesByWaId, postMessage } from '../services/api';
import { socket } from '../services/socket';
import Header from './Header';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ chatId, onBack }) => {
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
    <div className="flex flex-col h-full bg-[#e5ddd5]">
      <Header name={chatData.userInfo.name} status="online" onBack={onBack} />
      <main className="flex-grow p-4 overflow-y-auto">
        {/* The key is now guaranteed to be unique */}
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