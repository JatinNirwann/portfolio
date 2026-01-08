import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, RefreshCw } from 'lucide-react';

const translations = [
  { raw: "I love internet setup", pro: "Network Configuration & Topology" },
  { raw: "Deploying my own apps", pro: "Production Release Management" },
  { raw: "Know client server", pro: "RESTful API & HTTP Protocols" },
  { raw: "Cloudflare tunnel", pro: "Secure Edge Connectivity" },
  { raw: "Self hosting", pro: "On-Premise Infrastructure Management" }
];

const BuzzTranslator: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-off-white text-deep-black border-y border-black/10">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-main">
                <Terminal size={20} />
                <span className="font-mono text-xs font-bold uppercase tracking-widest">Translation Layer</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight">
              Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-main to-brand-sec">Compiler</span>
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-gray-500 max-w-md text-right md:text-left">
            // DECIPHERING RAW ENGINEERING PASSION INTO ENTERPRISE-READY TERMINOLOGY.
          </p>
        </div>

        <div className="grid gap-4">
          {translations.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative bg-white border border-black/5 hover:border-brand-main transition-colors duration-300 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
            >
              {/* Left: Raw Thought */}
              <div className="w-full md:w-5/12 text-center md:text-left relative z-10">
                <span className="font-mono text-sm text-gray-400 mb-1 block uppercase tracking-widest text-[10px]">Input (Raw)</span>
                <p className={`font-display text-xl md:text-2xl font-bold uppercase transition-colors duration-300 ${hoveredIndex === index ? 'text-gray-400' : 'text-deep-black'}`}>
                  "{item.raw}"
                </p>
              </div>

              {/* Center: Arrow Animation */}
              <div className="w-full md:w-2/12 flex justify-center relative z-10">
                <div className={`p-3 rounded-full border transition-all duration-300 ${hoveredIndex === index ? 'bg-brand-main border-brand-main rotate-180' : 'bg-transparent border-black/10'}`}>
                    {hoveredIndex === index ? <RefreshCw className="text-white animate-spin" size={20} /> : <ArrowRight className="text-black/30" size={20} />}
                </div>
              </div>

              {/* Right: Professional Speak */}
              <div className="w-full md:w-5/12 text-center md:text-right relative z-10">
                <span className="font-mono text-sm text-brand-main mb-1 block uppercase tracking-widest text-[10px]">Output (Compiled)</span>
                <div className="relative overflow-hidden inline-block">
                    <p className={`font-sans text-xl md:text-2xl font-bold transition-all duration-300 ${hoveredIndex === index ? 'text-brand-sec scale-105' : 'text-deep-black'}`}>
                    {item.pro}
                    </p>
                </div>
              </div>

              {/* Background Decor */}
              <div className="absolute inset-0 bg-brand-sec/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BuzzTranslator;