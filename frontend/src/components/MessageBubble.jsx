import StatusTicks from './StatusTicks';

const MessageBubble = ({ message }) => {
  const { body, from_me, timestamp, status } = message;

  const bubbleAlignment = from_me ? 'justify-end' : 'justify-start';
const bubbleColor = from_me ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-gray-700';  
  const formatDate = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${bubbleAlignment} mb-2`}>
      <div className={`rounded-lg px-3 py-2 max-w-sm shadow ${bubbleColor}`}>
        <p className="text-sm text-gray-800 dark:text-gray-200">{body}</p>
        <div className="flex justify-end items-center mt-1">
          <p className="text-xs text-gray-400 dark:text-gray-500 mr-2">{formatDate(timestamp)}</p>
          {from_me && <StatusTicks status={status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;