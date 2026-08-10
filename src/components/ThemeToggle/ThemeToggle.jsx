import { useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        className={styles.themeButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sun className={styles.sunIcon} />
        <Moon className={styles.moonIcon} />
        <span className={styles.srOnly}>Toggle theme</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <button 
            className={styles.dropdownItem}
            onClick={() => handleThemeChange('light')}
          >
            <Sun size={16} />
            Light
          </button>
          <button 
            className={styles.dropdownItem}
            onClick={() => handleThemeChange('dark')}
          >
            <Moon size={16} />
            Dark
          </button>
          <button 
            className={styles.dropdownItem}
            onClick={() => handleThemeChange('system')}
          >
            <Monitor size={16} />
            System
          </button>
        </div>
      )}
    </div>
  );
}
