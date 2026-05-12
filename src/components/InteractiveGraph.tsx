import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Brain,
  Eye,
  Layout,
  Mic,
  Database
} from 'lucide-react';

const InteractiveGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centralNodeRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const nodes = [
    { id: 'agentic-ai', label: 'Agentic AI', icon: <Brain size={20} />, angle: -150, distance: 250, description: "Autonomous AI agents that reason, plan, and execute workflows." },
    { id: 'computer-vision', label: 'Computer Vision', icon: <Eye size={20} />, angle: -30, distance: 250, description: "Turn visual data into actionable, real-time insights." },
    { id: 'web-apps', label: 'Web Apps', icon: <Layout size={20} />, angle: 30, distance: 250, description: "High-performance, responsive web applications." },
    { id: 'voice-agent', label: 'Voice Agent', icon: <Mic size={20} />, angle: 90, distance: 250, description: "Conversational AI voice agents for seamless 24/7 customer interactions." },
    { id: 'aiml-solutions', label: 'AI/ML Solutions', icon: <Database size={20} />, angle: 150, distance: 250, description: "Custom machine learning models and NLP systems tailored to your domain." },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(centralNodeRef.current, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    );

    nodesRef.current.forEach((node) => {
      if (node) {
        tl.fromTo(node,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.3"
        );
      }
    });
  }, []);

  const handleNodeHover = (_id: string) => {
    // We could trigger specific line glow here if needed
  };

  return (
    <div ref={containerRef} className="relative w-full h-[650px] flex items-center justify-center pointer-events-none">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[400px] h-[400px] bg-saffron/10 rounded-full blur-[100px]" />
      </div>

      {/* SVG Connections */}
      <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none">
        {/* Draw lines from center to outer nodes */}
        {nodes.map((node) => {
          const x = (node.distance) * Math.cos((node.angle * Math.PI) / 180);
          const y = (node.distance) * Math.sin((node.angle * Math.PI) / 180);
          
          return (
            <g key={node.id}>
              <line 
                x1="0" y1="0" 
                x2={x} y2={y} 
                stroke="rgba(242, 204, 143, 0.25)" 
                strokeWidth="1" 
                strokeDasharray="5,5"
                className="opacity-40"
              />
              {/* Data Flow Particles */}
              {[0, 1, 2].map((p) => (
                <circle key={`particle-${node.id}-${p}`} r="1.5" fill="#F2CC8F" className="opacity-70 drop-shadow-[0_0_5px_rgba(242,204,143,0.8)]">
                  <animateMotion 
                    path={`M 0 0 L ${x} ${y}`} 
                    dur="3s" 
                    repeatCount="indefinite" 
                    begin={`${(p * -1)}s`}
                  />
                </circle>
              ))}
            </g>
          );
        })}

        {/* Cross-connections between outer nodes to form a web */}
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          const x1 = (node.distance) * Math.cos((node.angle * Math.PI) / 180);
          const y1 = (node.distance) * Math.sin((node.angle * Math.PI) / 180);
          const x2 = (nextNode.distance) * Math.cos((nextNode.angle * Math.PI) / 180);
          const y2 = (nextNode.distance) * Math.sin((nextNode.angle * Math.PI) / 180);
          
          return (
            <line 
              key={`cross-${i}`}
              x1={x1} y1={y1} 
              x2={x2} y2={y2} 
              stroke="rgba(242, 204, 143, 0.1)" 
              strokeWidth="0.5" 
            />
          );
        })}
      </svg>

      {/* Central Node */}
      <div 
        ref={centralNodeRef}
        className="relative z-20 w-44 h-44 rounded-full border border-saffron/30 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center text-center p-4 pointer-events-auto cursor-pointer group hover:border-saffron/80 transition-colors duration-700 shadow-[0_0_60px_rgba(242,204,143,0.08)]"
      >
        <div className="absolute inset-2 rounded-full border border-saffron/10 group-hover:border-saffron/30 transition-colors duration-700" />
        <div className="absolute inset-0 rounded-full bg-saffron/5" />
        
        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-saffron/50 mb-2">Your</span>
          <span className="font-display text-3xl tracking-wide uppercase text-parchment font-medium leading-none">Business</span>
        </div>
      </div>

      {/* Outer Nodes */}
      {nodes.map((node, i) => {
        const x = (node.distance) * Math.cos((node.angle * Math.PI) / 180);
        const y = (node.distance) * Math.sin((node.angle * Math.PI) / 180);

        return (
          <div
            key={node.id}
            ref={el => { nodesRef.current[i] = el; }}
            style={{ 
              transform: `translate(${x}px, ${y}px)`,
            }}
            className="absolute z-10 w-20 h-20 rounded-full glass-card border border-white/10 flex flex-col items-center justify-center text-center p-2 pointer-events-auto cursor-pointer group hover:border-saffron/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(242,204,143,0.15)]"
            onMouseEnter={() => handleNodeHover(node.id)}
          >
            <div className="text-white/40 group-hover:text-saffron transition-colors duration-500 transform group-hover:scale-110">
              {node.icon}
            </div>
            <span className="font-mono text-[9px] mt-2 tracking-tighter uppercase text-white/30 group-hover:text-white transition-colors duration-500 whitespace-nowrap">
              {node.label}
            </span>
            
            {/* Subtle orbital ring */}
            <div className="absolute inset-[-4px] rounded-full border border-white/5 group-hover:border-saffron/20 transition-colors duration-500" />

            {/* Hover Tooltip */}
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg bg-[#050401]/95 border border-saffron/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              <p className="font-mono text-[9px] uppercase tracking-widest text-saffron mb-1">{node.label}</p>
              <p className="font-body text-xs text-fog/80 leading-snug">{node.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveGraph;
