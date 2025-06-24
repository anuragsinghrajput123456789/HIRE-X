
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/generator', label: 'Generator' },
    { path: '/analyzer', label: 'Analyzer' },
    { path: '/job-match', label: 'Job Match' },
    { path: '/cold-email', label: 'Cold Email' },
    { path: '/export', label: 'Export' },
    { path: '/chat', label: 'AI Chat' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200">
              AI Resume Builder
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="pt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50 border-transparent hover:border-accent"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
