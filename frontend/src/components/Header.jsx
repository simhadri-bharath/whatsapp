import defaultAvatar from '../assets/default-avatar.png';
import { SunIcon, MoonIcon } from './Icons'; // Import theme icons


const BackArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-gray-600">
    <path d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path>
  </svg>
);

// Accept number, theme, and onThemeToggle as props
const Header = ({ name, number, status, onBack, theme, onThemeToggle }) => {
  return (
    <header className="flex items-center justify-between p-3 bg-[#f0f2f5] dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 flex-shrink-0">
      <div className="flex items-center">
        {onBack && (
          <button onClick={onBack} className="mr-4 md:hidden text-gray-600 dark:text-gray-300">
            <BackArrowIcon />
          </button>
        )}
        <img src={defaultAvatar} alt="avatar" className="w-10 h-10 rounded-full" />
        <div className="ml-4">
          <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200">{name}</h2>
          {/* Display the number if it exists */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {number ? `+${number}` : status}
          </p>
        </div>
      </div>

      {/* Theme Toggle Button */}
      {onThemeToggle && (
        <button onClick={onThemeToggle} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      )}
    </header>
  );
};

export default Header;