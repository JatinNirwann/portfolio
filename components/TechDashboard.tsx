import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Cloud, Cpu, Network, Lock, Zap, Box } from 'lucide-react';

const DashboardCard: React.FC<{ title: string; icon: React.ReactNode; items: string[]; delay: number; active?: boolean }> = ({ title, icon, items, delay, active = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={`relative p-6 border ${active ? 'border-brand-main bg-brand-main/5' : 'border-white/10 hover:border-white/30 bg-white/5'} flex flex-col h-full overflow-hidden group transition-colors duration-300`}
    >
        {/* Tech Decor */}
        <div className="absolute top-2 right-2 flex gap-1">
            <div className={`w-1 h-1 rounded-full ${active ? 'bg-brand-main' : 'bg-white/20'}`}></div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
        </div>

        <div className="mb-4 flex items-center gap-3">
            <span className={`${active ? 'text-brand-main' : 'text-gray-400 group-hover:text-brand-sec'} transition-colors`}>
                {icon}
            </span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest">{title}</h3>
        </div>

        <ul className="space-y-2 relative z-10">
            {items.map((item, idx) => (
                <li key={idx} className="font-sans text-sm text-gray-400 flex items-center gap-2 group-hover:text-gray-200 transition-colors">
                    <span className="text-[10px] text-brand-main opacity-50">&gt;</span> {item}
                </li>
            ))}
        </ul>

        {/* Hover Effect - Scanning Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-main/5 to-transparent h-[200%] w-full -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    </motion.div>
  );
};

const TechDashboard: React.FC = () => {
  const stacks = [
    {
      title: "Infra Energy",
      icon: <Server size={18} />,
      items: ["Server Deployments at Scale", "VPN Architecture & Tunneling", "Internet Stack Deep Dive"],
      active: true
    },
    {
      title: "Cloud & Edge",
      icon: <Cloud size={18} />,
      items: ["Cloudflare Tunnels", "Edge Security & Caching", "Hybrid Cloud Reality"],
      active: false
    },
    {
      title: "Self-Hosting",
      icon: <Box size={18} />,
      items: ["Bare-Metal to Cloud", "Cost-Optimized Infra", "Self-Hosted > Vendor-Locked"],
      active: false
    },
    {
      title: "Networking",
      icon: <Network size={18} />,
      items: ["Zero-Trust Mindset", "DNS / IP Management", "Secure Routing Protocols"],
      active: false
    },
    {
      title: "AI Infrastructure",
      icon: <Cpu size={18} />,
      items: ["Local LLM Hosting", "Inference-Ready Deployments", "Model-Serving Pipelines"],
      active: true
    },
    {
      title: "Security",
      icon: <Lock size={18} />,
      items: ["Secrets Isolation", "SSL Automation", "Trust-Minimized Systems"],
      active: false
    }
  ];

  return (
    <section className="py-24 bg-deep-black border-y border-white/5 relative">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 border border-brand-sec/50 rounded-full bg-brand-sec/10 mb-4"
                    >
                        <Zap size={12} className="text-brand-sec" />
                        <span className="font-mono text-xs text-brand-sec font-bold uppercase tracking-wider">Live System Status</span>
                    </motion.div>
                    <h2 className="font-display text-5xl md:text-6xl font-black uppercase text-white tracking-tight">
                        Core <span className="text-outline">Identity</span> <br/> 
                        <span className="text-brand-main">Dashboard</span>
                    </h2>
                </div>
                <div className="text-right hidden md:block">
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Uptime: 99.99%</p>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Region: AP-SOUTH-1</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stacks.map((stack, index) => (
                    <DashboardCard 
                        key={index}
                        title={stack.title}
                        icon={stack.icon}
                        items={stack.items}
                        delay={index}
                        active={stack.active}
                    />
                ))}
            </div>

            {/* Decorative Footer for Dashboard */}
            <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-xs font-mono text-gray-600 uppercase">
                <span>Memory Usage: 34%</span>
                <span className="animate-pulse text-green-500">Connected via SSH</span>
                <span>Load Avg: 0.45</span>
            </div>
        </div>
    </section>
  );
};

export default TechDashboard;