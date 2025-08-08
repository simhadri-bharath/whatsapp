import defaultAvatar from '../assets/default-avatar.png';

const BackArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-gray-600">
    <path d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path>
  </svg>
);

// We now accept an `onBack` prop
const Header = ({ name, status, onBack }) => {
  return (
    <header className="flex items-center p-3 bg-[#f0f2f5] border-b border-gray-300">
      {/* The back button, which is only visible on mobile (hidden on md and up) */}
      {onBack && (
        <button onClick={onBack} className="mr-4 md:hidden">
          <BackArrowIcon />
        </button>
      )}

      <img src={defaultAvatar} alt="avatar" className="w-10 h-10 rounded-full" />
      <div className="ml-4">
        <h2 className="text-md font-semibold text-gray-700">{name}</h2>
        {status && <p className="text-xs text-gray-500">{status}</p>}
      </div>
    </header>
  );
};

export default Header;