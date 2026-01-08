import React from 'react';

interface MarqueeProps {
  text: string;
  reverse?: boolean;
  className?: string;
  outline?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ text, reverse = false, className = "", outline = false }) => {
  const content = (
    <>
      <span className={`mx-4 ${outline ? 'text-outline' : ''}`}>{text}</span>
      <span className={`mx-4 text-brand-main`}>●</span>
      <span className={`mx-4 ${outline ? 'text-outline' : ''}`}>{text}</span>
      <span className={`mx-4 text-brand-main`}>●</span>
      <span className={`mx-4 ${outline ? 'text-outline' : ''}`}>{text}</span>
      <span className={`mx-4 text-brand-main`}>●</span>
      <span className={`mx-4 ${outline ? 'text-outline' : ''}`}>{text}</span>
      <span className={`mx-4 text-brand-main`}>●</span>
    </>
  );

  return (
    <div className={`relative flex overflow-x-hidden py-4 ${className} border-y border-white/10`}>
      <div className={`animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap flex flex-row items-center font-display text-4xl md:text-6xl font-bold uppercase`}>
        {content}
        {content}
        {content}
      </div>
      <div className={`absolute top-0 animate-${reverse ? 'marquee-reverse' : 'marquee2'} whitespace-nowrap flex flex-row items-center font-display text-4xl md:text-6xl font-bold uppercase`}>
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

export default Marquee;