import React from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.dataset.name as string]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending signal:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="min-h-screen bg-deep-black text-white flex flex-col justify-between pt-24 pb-10 px-6">
      <div className="container mx-auto flex-grow flex flex-col justify-center">
        <h2 className="font-display text-[10vw] leading-[0.8] font-black uppercase text-center md:text-left">
          Let's <br />
          <span className="text-outline text-outline-hover transition-all duration-500 cursor-pointer">Connect</span> <br />
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                data-name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="NAME"
                required
                className="bg-transparent border-b border-white/30 py-4 text-xl focus:outline-none focus:border-brand-main transition-colors placeholder:text-white/30 w-full"
              />
              <input
                type="email"
                data-name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL"
                required
                className="bg-transparent border-b border-white/30 py-4 text-xl focus:outline-none focus:border-brand-main transition-colors placeholder:text-white/30 w-full"
              />
            </div>
            <textarea
              data-name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="MESSAGE"
              rows={3}
              required
              className="w-full bg-transparent border-b border-white/30 py-4 text-xl focus:outline-none focus:border-brand-main transition-colors placeholder:text-white/30 resize-none"
            ></textarea>

            <button
              disabled={status === 'sending' || status === 'success'}
              className={`px-10 py-4 font-bold uppercase transition-all w-full md:w-auto ${status === 'success' ? 'bg-green-500 text-white' :
                  status === 'error' ? 'bg-red-500 text-white' :
                    'bg-white text-black hover:bg-brand-main'
                }`}
            >
              {status === 'sending' ? 'Transmitting...' :
                status === 'success' ? 'Signal Received' :
                  status === 'error' ? 'Transmission Failed' :
                    'Send Signal'}
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