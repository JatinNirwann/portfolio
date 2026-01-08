import React from 'react';
import { Server, Database, Container, Globe, Shield, Terminal, Network, Cpu, Lock, Cloud, Box } from 'lucide-react';
import { Service } from '../types';

const services: Service[] = [
  {
    id: 1,
    icon: <Server size={32} />,
    title: "Infra Energy",
    description: "Building resilient systems that survive the real internet.",
    items: ["Server Deployments at Scale", "VPN Architecture & Tunneling", "Internet Stack Deep Dive"]
  },
  {
    id: 2,
    icon: <Cloud size={32} />,
    title: "Cloud & Edge",
    description: "Optimizing content delivery and security at the network edge.",
    items: ["Cloudflare Tunnels", "Edge Security & Caching", "Hybrid Cloud Deployment"]
  },
  {
    id: 3,
    icon: <Box size={32} />,
    title: "Self-Hosting",
    description: "Sovereign infrastructure over vendor-locked ecosystems.",
    items: ["Bare-Metal to Cloud", "Cost-Optimized Infra", "Self-Hosted > Vendor-Locked"]
  },
  {
    id: 4,
    icon: <Network size={32} />,
    title: "Networking",
    description: "Advanced routing and security for modern applications.",
    items: ["Zero-Trust Mindset", "DNS / IP Management", "Secure Routing Protocols"]
  },
  {
    id: 5,
    icon: <Cpu size={32} />,
    title: "AI Infrastructure",
    description: "Running inference and models on optimized hardware.",
    items: ["Local LLM Hosting", "Inference-Ready Deployments", "Model-Serving Pipelines"]
  },
  {
    id: 6,
    icon: <Lock size={32} />,
    title: "Security",
    description: "Hardening systems against threats and vulnerabilities.",
    items: ["Secrets Isolation", "SSL Automation", "Trust-Minimized Systems"]
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-brand-main text-deep-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 border-b border-black/20 pb-8 flex flex-col md:flex-row justify-between items-end">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none">
            Tech <br/>Stack
          </h2>
          <p className="font-mono font-bold uppercase tracking-widest mt-4 md:mt-0 opacity-70 text-right">
            // Core Identity Modules<br/>
            // Architecture over Syntax
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="group p-8 border border-deep-black/10 hover:border-deep-black bg-white/5 hover:bg-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold opacity-30">0{index + 1}</div>
              
              <div className="mb-6 text-deep-black group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              <h3 className="font-display text-2xl font-bold mb-2 uppercase leading-[1.1]">{service.title}</h3>
              <p className="font-sans text-sm mb-6 leading-relaxed opacity-70 border-b border-black/10 pb-4">{service.description}</p>
              
              <ul className="space-y-2 font-mono text-xs mt-auto">
                {service.items?.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-deep-black/80 font-bold uppercase tracking-wide">
                        <span className="w-1 h-1 bg-deep-black rounded-full"></span>
                        {item}
                    </li>
                ))}
              </ul>
              
              {/* Decorative corner accent */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-r-[20px] border-deep-black/0 group-hover:border-deep-black/20 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;