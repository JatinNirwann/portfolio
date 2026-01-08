import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Minimize2, Maximize2, X, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommandOutput {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'warning';
  text: React.ReactNode;
}

const Terminal: React.FC = () => {
  const initialOutput: CommandOutput[] = [
    { id: 0, type: 'output', text: 'JATIN_KERNEL_OS [Version 2.0.4-release]' },
    { id: 1, type: 'output', text: 'Copyright (c) 2024 Jatin Nirwan Corporation.' },
    { id: 2, type: 'output', text: 'Type "help" to view available commands.' }
  ];

  const [input, setInput] = useState('');
  const [output, setOutput] = useState<CommandOutput[]>(initialOutput);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sarcasticResponses = [
    "Nice try, Fed.",
    "Permission denied: You are not a wizard.",
    "I see you hacking...",
    "Root access denied. Try asking politely? (It won't work)."
  ];

  const handleCommand = (cmd: string) => {
    const inputLine: CommandOutput = { id: Date.now(), type: 'input', text: `visitor@jatin-server:~$ ${cmd}` };

    const newOutput = [...output, inputLine];
    const lowerCmd = cmd.trim().toLowerCase();

    if (['ip', 'ifconfig', 'ip a', 'sudo', 'rm -rf', 'ls -a /', 'cat /etc/passwd', 'su'].some(c => lowerCmd.startsWith(c))) {
      const randomSarcasm = sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)];
      newOutput.push({ id: Date.now() + 1, type: 'warning', text: `[SECURITY_ALERT] ${randomSarcasm}` });
      setOutput(newOutput);
      setInput('');
      return;
    }

    switch (lowerCmd) {
      case 'help':
        newOutput.push({ id: Date.now() + 1, type: 'output', text: 'Available commands:' });
        newOutput.push({ id: Date.now() + 2, type: 'output', text: '  who      - Identity verification' });
        newOutput.push({ id: Date.now() + 3, type: 'output', text: '  disc     - Display system description' });
        newOutput.push({ id: Date.now() + 4, type: 'output', text: '  stack    - List active technical frameworks' });
        newOutput.push({ id: Date.now() + 5, type: 'output', text: '  github   - Display GitHub username' });
        newOutput.push({ id: Date.now() + 6, type: 'output', text: '  git-open - Open GitHub profile in new tab' });
        newOutput.push({ id: Date.now() + 7, type: 'output', text: '  contact  - Initialize communication protocol' });
        newOutput.push({ id: Date.now() + 8, type: 'output', text: '  clear    - Clear terminal buffer' });
        break;
      case 'who':
        newOutput.push({ id: Date.now() + 1, type: 'success', text: 'USER: Jatin Nirwan' });
        newOutput.push({ id: Date.now() + 2, type: 'output', text: 'ROLE: Full-Stack Infrastructure Engineer' });
        newOutput.push({ id: Date.now() + 3, type: 'output', text: 'STATUS: Building systems that survive the real internet.' });
        break;
      case 'disc':
        newOutput.push({ id: Date.now() + 1, type: 'output', text: 'DESCRIPTION:' });
        newOutput.push({ id: Date.now() + 2, type: 'output', text: 'A backend-heavy, reality-aware builder. Obsessed with self-hosting, network topology, and deployment pipelines. I don\'t just write code; I orchestrate where it lives.' });
        break;
      case 'stack':
        newOutput.push({ id: Date.now() + 1, type: 'output', text: 'SCANNING SYSTEM MODULES...' });

        const categories = {
          "CORE_LANGUAGES": ["Python", "C", "C++", "Go", "HTML5", "Bash Scripting", "Linux"],
          "FRAMEWORKS_LIBS": ["Flask", "Pandas", "NumPy", "Scikit-learn", "QT", "React"],
          "DATABASES_TOOLS": ["MySQL", "SQLite", "Git & GitHub", "Cloudflare Tunnel", "Docker"],
          "FOCUS_AREAS": ["AI/ML", "Full-stack Python", "Information Security", "VPNs & Networking", "Automation"]
        };

        let delay = 0;
        Object.entries(categories).forEach(([category, items]) => {
          newOutput.push({ id: Date.now() + delay++, type: 'warning', text: `[${category}]` });

          items.forEach((item) => {
            newOutput.push({ id: Date.now() + delay++, type: 'success', text: `  ├─ ${item}` });
          });
        });
        break;
      case 'github':
        newOutput.push({ id: Date.now() + 1, type: 'success', text: 'GITHUB USERNAME: JatinNirwann' });
        break;
      case 'git-open':
        newOutput.push({ id: Date.now() + 1, type: 'output', text: 'Initiating secure handshake with GitHub...' });
        window.open('https://github.com/JatinNirwann', '_blank');
        break;
      case 'clear':
        // Reset to initial output, excluding the "clear" command itself
        setOutput(initialOutput);
        setInput('');
        return;
      case 'contact':
        newOutput.push({ id: Date.now() + 1, type: 'output', text: 'Opening mail client...' });
        window.location.href = "mailto:jatinbuilds@outlook.com";
        break;
      case '':
        break;
      default:
        newOutput.push({ id: Date.now() + 1, type: 'error', text: `Command not found: ${cmd}. Type 'help' for assistance.` });
    }

    setOutput(newOutput);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  const runQuickScript = (scriptName: string) => {
    handleCommand(scriptName);
  }

  return (
    <section className="py-24 bg-off-white text-deep-black border-y border-black/10">
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-center gap-2 text-brand-main">
            <TerminalIcon size={24} />
            <span className="font-mono text-xl font-bold uppercase tracking-widest">Interactive Shell Access</span>
          </div>

          <div className="flex gap-2">
            {['who', 'stack', 'help'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => runQuickScript(cmd)}
                className="px-4 py-2 bg-white border border-black/10 hover:bg-brand-main hover:text-white hover:border-brand-main transition-all font-mono text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <Play size={10} /> {cmd}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto bg-[#0d0d0d] rounded-lg shadow-2xl overflow-hidden border border-gray-800 font-mono text-sm md:text-base relative"
        >
          <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-2 select-none">
              <TerminalIcon size={12} />
              guest@jatin-portfolio:~
            </div>
            <div className="flex gap-2 text-gray-600">
              <X size={14} />
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={containerRef}
            className="p-6 h-[400px] overflow-y-auto text-gray-300 font-medium cursor-text font-mono"
            onClick={() => inputRef.current?.focus()}
          >
            {output.map((line) => (
              <div key={line.id} className="mb-1 break-words leading-relaxed">
                {line.type === 'input' ? (
                  <span className="text-white opacity-80">{line.text}</span>
                ) : line.type === 'error' ? (
                  <span className="text-red-400">{line.text}</span>
                ) : line.type === 'success' ? (
                  <span className="text-green-400">{line.text}</span>
                ) : line.type === 'warning' ? (
                  <span className="text-yellow-400 font-bold">{line.text}</span>
                ) : (
                  <span className="text-brand-sec/80">{line.text}</span>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 mt-2">
              <span className="text-brand-main">➜</span>
              <span className="text-cyan-400">~</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-white w-full caret-brand-main"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </motion.div>

        <p className="mt-4 text-center font-mono text-xs text-gray-400">
          * Warning: Unauthorized access to system internals is monitored. (Just kidding, have fun).
        </p>

      </div>
    </section>
  );
};

export default Terminal;