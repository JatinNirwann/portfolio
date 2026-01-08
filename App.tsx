import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Work from './components/Work';
import Services from './components/Services';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import Terminal from './components/Terminal';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-brand-main flex items-center justify-center z-[9999]">
        <div className="text-deep-black font-display text-4xl md:text-6xl font-black animate-pulse uppercase tracking-tighter">
          System Boot...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-deep-black cursor-none">
      <CustomCursor />
      <Navbar />
      
      <main>
        <Hero />
        <Marquee text="BACKEND ENGINEERING • NETWORK ARCHITECTURE • SELF-HOSTED INFRASTRUCTURE •" />
        <About />
        <Services />
        <Terminal />
        <Marquee text="PYTHON • FLASK • DOCKER • NGINX • CLOUDFLARE •" reverse outline className="bg-deep-black text-white" />
        <Work />
        <Contact />
      </main>
    </div>
  );
};

export default App;