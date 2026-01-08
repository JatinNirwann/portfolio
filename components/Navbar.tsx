import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  const links = [
    { name: 'PROJECTS', href: '#work' },
    { name: 'ABOUT ME', href: '#about' },
    { name: 'STACK', href: '#services' },
    { name: 'CONTACT', href: '#contact' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <a href="#" className="text-2xl font-display font-bold text-white tracking-tighter">
          JATIN <span className="text-brand-main">NIRWAN</span>
        </a>
        <button 
          onClick={toggleMenu} 
          className="text-white hover:text-brand-main transition-colors focus:outline-none"
        >
          <Menu size={32} />
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-brand-main z-50 flex flex-col justify-center items-center"
          >
            <button 
              onClick={toggleMenu} 
              className="absolute top-6 right-6 text-deep-black hover:text-white transition-colors"
            >
              <X size={40} />
            </button>
            
            <div className="flex flex-col space-y-4 text-center">
              {links.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  variants={itemVariants}
                  onClick={toggleMenu}
                  className="font-display text-6xl md:text-8xl font-black text-deep-black hover:text-white transition-colors uppercase tracking-tight"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <motion.div 
              variants={itemVariants}
              className="absolute bottom-10 text-deep-black font-sans font-medium"
            >
              EST. 2024 &copy; INDIA
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;