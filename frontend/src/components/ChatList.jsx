import { useState, useEffect } from 'react';
import { fetchConversations } from '../services/api';
import ChatItem from './chatItem';
import Header from './Header';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data);
      } catch (err) {
        setError('Failed to fetch conversations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading chats...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-full">
      <Header name="My Chats" />
      <div className="flex-grow overflow-y-auto">
        {conversations.map((conv) => (
          <ChatItem
            key={conv.wa_id}
            conversation={conv}
            isSelected={conv.wa_id === selectedChatId}
            onSelect={() => onSelectChat(conv.wa_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;