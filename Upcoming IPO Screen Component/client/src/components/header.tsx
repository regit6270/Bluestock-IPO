import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import bluestockLogo from "@/assets/bluestock-logo.png";

export function Header() {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center" data-testid="logo">
            <img 
              src={bluestockLogo} 
              alt="Bluestock" 
              className="h-10 w-auto"
            />
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8" data-testid="navigation">
            <button className="text-gray-700 hover:text-bluestock-500 font-medium transition-colors">
              IPO
            </button>
            <button className="text-gray-700 hover:text-bluestock-500 font-medium transition-colors">
              Mutual Funds
            </button>
            <button className="text-gray-700 hover:text-bluestock-500 font-medium transition-colors">
              Trading
            </button>
            <button className="text-gray-700 hover:text-bluestock-500 font-medium transition-colors">
              Support
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3" data-testid="auth-buttons">
            <Button
              variant="ghost"
              className="text-bluestock-500 font-medium hover:bg-bluestock-50"
              data-testid="login-button"
              onClick={() => setLocation('/admin/login')}
            >
              Login
            </Button>
            <Button
              className="bg-bluestock-500 hover:bg-bluestock-600 text-white font-medium"
              data-testid="signup-button"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" data-testid="mobile-menu-button">
            <Menu className="text-gray-600" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
