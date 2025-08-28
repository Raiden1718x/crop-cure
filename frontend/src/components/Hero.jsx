import React, { useState, useEffect } from 'react'

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-hidden flex items-center justify-end bg-gradient-to-br from-green-100 to-green-300">
      {/* Leaf Background PNG with fade-in animation */}
      <img
        src="/leaf2.png"
        alt="Leaf Background"
        className={`absolute left-0 top-0 h-full object-cover -translate-x-15 transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-20' : 'opacity-0'
        }`}
      />

      {/* Additional decorative elements with animations */}
      <div className={`absolute top-1/4 left-10 w-16 h-16 rounded-full bg-green-500 transition-all duration-700 delay-300 ${
        isLoaded ? 'opacity-20 animate-pulse' : 'opacity-0 scale-50'
      }`}></div>
      
      <div className={`absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-emerald-400 transition-all duration-700 delay-500 ${
        isLoaded ? 'opacity-15 animate-bounce' : 'opacity-0 scale-50'
      }`}></div>
      
      {/* Floating particles with staggered animation */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className={`absolute rounded-full bg-green-600 transition-all duration-1000 ${
            isLoaded ? 'opacity-10' : 'opacity-0 scale-0'
          }`}
          style={{
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 15 + 5}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
            transitionDelay: `${i * 100}ms`
          }}
        ></div>
      ))}
      
      {/* Main content with slide-in animation */}
      <div className={`flex flex-col items-end mr-6 sm:mr-24 mb-20 relative z-10 text-right transition-all duration-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-quicksand text-green-800 mb-4">
          CROPCURE
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-green-700 mb-6 max-w-md">
          Revolutionizing agriculture with AI-powered plant disease detection
        </p>
        <div className="flex gap-4">
          <button className={`px-6 py-3 bg-green-700 text-white rounded-full font-semibold hover:bg-green-800 transition-all duration-500 shadow-lg ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`} style={{ transitionDelay: '400ms' }}>
            Get Started
          </button>
          <button className={`px-6 py-3 bg-white text-green-700 border border-green-700 rounded-full font-semibold hover:bg-green-50 transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`} style={{ transitionDelay: '500ms' }}>
            Learn More
          </button>
        </div>
      </div>

      {/* Inverted wave divider at the bottom with slide-up animation */}
      <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 rotate-180">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-green-700"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-green-700"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-green-700"></path>
        </svg>
      </div>

      {/* Inverted wave divider at the top with slide-down animation */}
      <div className={`absolute top-0 left-0 w-full overflow-hidden leading-[0] transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-green-700"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-green-700"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-green-700"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero