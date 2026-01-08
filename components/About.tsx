import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-24 bg-off-white text-deep-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-4">
             <h2 className="font-display text-5xl font-bold uppercase sticky top-32">
               Code is <br/><span className="text-brand-sec italic">Architecture,</span><br/> not just syntax.
             </h2>
          </div>

          <div className="md:col-span-8 font-sans text-xl md:text-3xl font-light leading-relaxed">
            <p className="mb-12 border-l-4 border-brand-main pl-8">
              I'm Jatin Nirwan, a 3rd-year CS student obsessed with what happens under the hood. While others play with pixels, I build the engines that power them. My world revolves around backend logic, scalable networks, and self-hosted infrastructure.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
               <div className="border-t border-black/10 pt-6">
                  <span className="text-sm font-bold tracking-widest uppercase text-brand-sec block mb-2">01. Backend</span>
                  <p className="text-base text-gray-600">Python & Flask are my tools of choice. I craft robust APIs and microservices that handle data efficiently.</p>
               </div>
               <div className="border-t border-black/10 pt-6">
                  <span className="text-sm font-bold tracking-widest uppercase text-brand-sec block mb-2">02. Infrastructure</span>
                  <p className="text-base text-gray-600">Docker containers, Nginx reverse proxies, and Linux environments. I don't just write code; I deploy it.</p>
               </div>
               <div className="border-t border-black/10 pt-6">
                  <span className="text-sm font-bold tracking-widest uppercase text-brand-sec block mb-2">03. Networking</span>
                  <p className="text-base text-gray-600">Understanding packets, protocols, and security. I ensure systems talk to each other securely.</p>
               </div>
               <div className="border-t border-black/10 pt-6">
                  <span className="text-sm font-bold tracking-widest uppercase text-brand-sec block mb-2">04. Self-Hosting</span>
                  <p className="text-base text-gray-600">Why rent when you can own? I run my own services, maintaining control over my data and tools.</p>
               </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative large text */}
      <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5">
        <span className="font-display text-[20vw] font-black uppercase">SYSTEM</span>
      </div>
    </section>
  );
};

export default About;