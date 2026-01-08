import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="min-h-screen bg-deep-black text-white flex flex-col justify-between pt-24 pb-10 px-6">
      <div className="container mx-auto flex-grow flex flex-col justify-center">
        <h2 className="font-display text-[10vw] leading-[0.8] font-black uppercase text-center md:text-left">
          Let's <br/>
          <span className="text-outline text-outline-hover transition-all duration-500 cursor-pointer">Connect</span> <br/>
          <span className="text-brand-main">Now.</span>
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="font-sans text-xl text-gray-400 max-w-sm">
              Interested in collaborating on backend projects or talking about self-hosting? Ping me.
            </p>
            <div className="mt-8">
              <a href="mailto:jatinbuilds@outlook.com" className="text-3xl font-display font-bold hover:text-brand-main transition-colors border-b-2 border-transparent hover:border-brand-main inline-block pb-1">
                jatinbuilds@outlook.com
              </a>
            </div>
          </div>

          <form className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input type="text" placeholder="NAME" className="bg-transparent border-b border-white/30 py-4 text-xl focus:outline-none focus:border-brand-main transition-colors placeholder:text-white/30" />
               <input type="email" placeholder="EMAIL" className="bg-transparent border-b border-white/30 py-4 text-xl focus:outline-none focus:border-brand-main transition-colors placeholder:text-white/30" />
             </div>
             <textarea placeholder="MESSAGE" rows={3} className="w-full bg-transparent border-b border-white/30 py-4 text-xl focus:outline-none focus:border-brand-main transition-colors placeholder:text-white/30 resize-none"></textarea>
             <button className="bg-white text-black px-10 py-4 font-bold uppercase hover:bg-brand-main transition-colors w-full md:w-auto">
               Send Signal
             </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-gray-500 uppercase tracking-widest">
        <p>&copy; 2024 JATIN NIRWAN. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;