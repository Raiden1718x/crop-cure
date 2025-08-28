import React, { useState, useEffect } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-dvh w-screen bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-green-300">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 rounded-full bg-green-400 opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/3 left-10 w-16 h-16 rounded-full bg-emerald-400 opacity-10 animate-bounce"></div>
      
      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-green-600 opacity-10"
          style={{
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 15 + 5}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}

      {/* Main auth container */}
      <div className={`relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* Form switcher tabs */}
        <div className="flex border-b border-green-100">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-medium transition-all duration-300 ${
              isLogin 
                ? 'text-green-700 bg-green-50 border-b-2 border-green-600' 
                : 'text-green-500 hover:text-green-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-medium transition-all duration-300 ${
              !isLogin 
                ? 'text-green-700 bg-green-50 border-b-2 border-green-600' 
                : 'text-green-500 hover:text-green-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms container with horizontal animation */}
        <div className="relative overflow-hidden">
          <div 
            className={`flex transition-transform duration-500 ease-in-out ${
              isLogin ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Login Form */}
            <div className="min-w-full p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Welcome Back</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-green-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-green-700">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-green-600 hover:text-green-800 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-md"
                >
                  Login
                </button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="font-semibold text-green-700 hover:text-green-900 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>

            {/* Signup Form */}
            <div className="min-w-full p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Create Account</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-green-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-green-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-green-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-green-700">
                    I agree to the{' '}
                    <a href="#" className="text-green-600 hover:text-green-800 transition-colors">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-md"
                >
                  Create Account
                </button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="font-semibold text-green-700 hover:text-green-900 transition-colors"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-green-300">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
};

export default AuthPage;