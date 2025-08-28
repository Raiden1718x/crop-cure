import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger the animation after component mounts
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`bg-white shadow-md fixed w-full top-0 z-50 transition-all duration-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14"> {/* Reduced from h-16 to h-14 */}
          {/* Logo with subtle animation */}
          <div className="flex-shrink-0 flex items-center">
            <span className={`text-xl font-bold text-green-700 font-quicksand transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              CROPCURE
            </span>
          </div>

          {/* Desktop Navigation with staggered animation */}
          <div className="hidden md:flex items-center space-x-6"> {/* Reduced spacing */}
            <a href="#" className={`text-green-700 hover:text-green-500 px-2 py-1 text-sm font-medium transition-all duration-700 delay-75 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              Home
            </a>
            <a href="#" className={`text-green-700 hover:text-green-500 px-2 py-1 text-sm font-medium transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              Features
            </a>
            <a href="#" className={`text-green-700 hover:text-green-500 px-2 py-1 text-sm font-medium transition-all duration-700 delay-150 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              How It Works
            </a>
            <a href="#" className={`text-green-700 hover:text-green-500 px-2 py-1 text-sm font-medium transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              About Us
            </a>
            <a href="#" className={`text-green-700 hover:text-green-500 px-2 py-1 text-sm font-medium transition-all duration-700 delay-250 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              Contact
            </a>
            
            {/* Auth Buttons */}
            <div className={`flex items-center space-x-3 ml-4 transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-green-700 hover:text-green-500 transition-colors">
                Log in
              </a>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-600 transition-colors shadow-sm">
                Sign up
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className={`md:hidden flex items-center transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-green-700 hover:text-green-500 hover:bg-green-50 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <a href="#" className="text-green-700 hover:text-green-500 block px-3 py-2 text-sm font-medium transition-colors">
            Home
          </a>
          <a href="#" className="text-green-700 hover:text-green-500 block px-3 py-2 text-sm font-medium transition-colors">
            Features
          </a>
          <a href="#" className="text-green-700 hover:text-green-500 block px-3 py-2 text-sm font-medium transition-colors">
            How It Works
          </a>
          <a href="#" className="text-green-700 hover:text-green-500 block px-3 py-2 text-sm font-medium transition-colors">
            About Us
          </a>
          <a href="#" className="text-green-700 hover:text-green-500 block px-3 py-2 text-sm font-medium transition-colors">
            Contact
          </a>
          
          <div className="pt-3 pb-2 border-t border-gray-200">
            <a href="#" className="block px-3 py-2 text-sm font-medium text-green-700 hover:text-green-500 transition-colors">
              Log in
            </a>
            <a href="#" className="mt-1 block px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-600 transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;