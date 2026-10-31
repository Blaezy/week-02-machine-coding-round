import { LuMoon, LuSun } from 'react-icons/lu';
import { useSettings } from '../../hooks/useSettings.js';
import Button from '../ui/Button.jsx';

export default function ThemeToggle({ showLabel = false }) {
  const { theme, toggleTheme } = useSettings();
  const next = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? LuSun : LuMoon;

  return (
    <Button
      variant="ghost"
      size={showLabel ? 'md' : 'icon'}
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      className={showLabel ? 'w-full justify-start px-2.5' : undefined}
    >
      <Icon aria-hidden="true" className="size-4" />
      {showLabel && <span>{next === 'light' ? 'Light mode' : 'Dark mode'}</span>}
    </Button>
  );
}
