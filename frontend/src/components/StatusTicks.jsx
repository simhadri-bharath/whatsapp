const StatusTicks = ({ status }) => {
  const tickColor = status === 'read' ? '#34B7F1' : '#667781';

  const CheckIcon = ({ color }) => (
    <svg viewBox="0 0 16 15" width="16" height="15">
      <path fill={color} d="M15.01 3.316l-1.362-1.363-7.65 7.65-3.825-3.825-1.363 1.362 5.188 5.188z"></path>
    </svg>
  );

  return (
    <div className="flex items-center">
      {status === 'sent' && <CheckIcon color={tickColor} />}
      {(status === 'delivered' || status === 'read') && (
        <div className="relative w-4 h-4">
          <div className="absolute top-0 left-0"><CheckIcon color={tickColor} /></div>
          <div className="absolute top-0 left-1"><CheckIcon color={tickColor} /></div>
        </div>
      )}
    </div>
  );
};

export default StatusTicks;