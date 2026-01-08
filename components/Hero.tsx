import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const quotes = [
  "I build systems that survive the real internet.",
  "From servers to models, I deploy what I design.",
  "Self-hosted when it matters. Cloud when it makes sense."
];

const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-deep-black text-off-white selection:bg-brand-main selection:text-deep-black"
    >

      {/* Background Abstract Element - Tech Grid with Parallax */}
      <motion.div
        animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="w-[600px] h-[600px] rounded-full bg-brand-sec blur-[150px] animate-pulse"></div>
      </motion.div>

      <motion.div
        style={{ y: y1 }}
        className="z-10 text-center flex flex-col items-center px-4"
      >


        <motion.h1
          animate={{ x: mousePosition.x, y: mousePosition.y }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
          className="font-display text-[12vw] leading-[0.85] font-black tracking-tighter mix-blend-exclusion"
        >
          JATIN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-main to-white">NIRWAN</span>
        </motion.h1>

        <div className="h-20 mt-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-base md:text-xl text-brand-sec uppercase tracking-widest text-center max-w-2xl"
            >
              <span className="text-brand-main mr-2">&gt;</span>
              {quotes[index]}
              <span className="animate-pulse ml-1">_</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-10 md:left-20 flex items-center gap-4"
      >
        <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center animate-bounce">
          <ArrowDown className="text-brand-main" />
        </div>
        <span className="font-sans text-xs tracking-widest opacity-50">SCROLL TO ACCESS</span>
      </motion.div>

      <div className="absolute right-0 bottom-20 md:bottom-0 p-10 md:p-20 hidden md:block">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-brand-main to-transparent mx-auto"></div>
      </div>
    </section>
  );
};

export default Hero;