const ChatItem = ({ conversation, isSelected, onSelect }) => {
  const { name, lastMessage, lastMessageTimestamp } = conversation;
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

   const selectedClass = isSelected ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700';

  
  return (
    <div
      className={`flex items-center p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${selectedClass}`}
      onClick={onSelect}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(lastMessageTimestamp)}</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{lastMessage}</p>
      </div>
    </div>
  );

};

export default ChatItem;