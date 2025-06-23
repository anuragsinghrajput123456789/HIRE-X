
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    toast({
      title: `Switched to ${newTheme} mode`,
      duration: 2000,
    });
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

export default ThemeToggle;
