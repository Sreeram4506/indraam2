import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { expertise } from '../data/expertise';
import { 
  Zap, 
  Eye, 
  Layout, 
  BrainCircuit, 
  Database, 
  Settings,
  Cpu
} from 'lucide-react';

export default function FlowingNodeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Map expertise to icons
  const iconMap: Record<string, any> = {
    'Agentic AI': Zap,
    'Computer Vision': Eye,
    'Web Applications': Layout,
    'AI & ML Solutions': BrainCircuit,
    'Data Pipelines': Database,
    'Automations': Settings,
  };

  // Filter expertise to select 6 key items for the graph
  const nodes = useMemo(() => {
    const selected = [0, 1, 2, 7, 4, 8]; 
    return selected.map((idx, i) => {
      const angle = (i / selected.length) * Math.PI * 2;
      const radius = 170;
      const title = expertise[idx].title;
      return {
        ...expertise[idx],
        Icon: iconMap[title] || Cpu,
        x: Math.cos(angle) * radius + 250,
        y: Math.sin(angle) * radius + 250,
        id: `node-${idx}`
      };
    });
  }, []);

  const centerNode = {
    title: 'YOUR BUSINESS',
    x: 250,
    y: 250,
    id: 'center-node'
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const ctx = gsap.context(() => {
      // Animate nodes entrance
      const nodeGroups = svgRef.current?.querySelectorAll('.node-group');
      if (nodeGroups?.length) {
        gsap.from(nodeGroups, {
          scale: 0,
          opacity: 0,
          duration: 1.2,
          stagger: {
            each: 0.1,
            from: "center"
          },
          ease: 'expo.out'
        });
      }

      // Dynamic Pulse animation for links (Data flow)
      const particles = svgRef.current?.querySelectorAll('.flow-particle');
      if (particles?.length) {
        particles.forEach((particle, i) => {
          const path = particle as SVGPathElement;
          const length = path.getTotalLength();
          
          // Ensure path properties are reset before animating
          gsap.killTweensOf(path);
          
          const pulseLength = 20; // Consistent pulse length for better visibility
          gsap.set(path, { 
            strokeDasharray: `${pulseLength}, ${length}`,
            strokeDashoffset: length 
          });
          
          gsap.to(path, {
            strokeDashoffset: -length,
            duration: 2.5,
            repeat: -1,
            ease: 'none',
            delay: i * 0.5 // Staggered start
          });
        });
      }

      // Background rings subtle rotation
      gsap.to('.ambient-ring', {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: 'none'
      });
    }, svgRef);

    return () => ctx.revert();
  }, [nodes]);

  return (
    <div ref={containerRef} className="w-full aspect-square relative max-w-[550px] mx-auto group/graph">
      {/* Decorative background depth */}
      <div className="absolute inset-0 bg-saffron/2 rounded-full blur-[80px] group-hover/graph:bg-saffron/5 transition-colors duration-1000" />
      
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(242, 204, 143, 0.15)" />
            <stop offset="100%" stopColor="rgba(5, 4, 1, 0.8)" />
          </radialGradient>
        </defs>

        {/* Ambient background rings */}
        <circle cx="250" cy="250" r="170" className="ambient-ring fill-none stroke-white/[0.03]" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="250" cy="250" r="220" className="ambient-ring fill-none stroke-white/[0.02]" strokeWidth="1" strokeDasharray="10 20" />

        {/* Background connections */}
        <g className="connections">
          {nodes.map((node, i) => (
            <g key={`conn-${i}`}>
              {/* Solid connection line */}
              <line
                x1={centerNode.x} y1={centerNode.y}
                x2={node.x} y2={node.y}
                stroke="rgba(242, 204, 143, 0.2)"
                strokeWidth="1"
              />
              
              {/* Animated pulse */}
              <path
                className="flow-particle"
                d={`M ${centerNode.x} ${centerNode.y} L ${node.x} ${node.y}`}
                stroke="var(--saffron)"
                strokeWidth="2"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </g>
          ))}
        </g>

        {/* Expertise Nodes */}
        {nodes.map((node, i) => (
          <g key={node.id} id={`node-group-${i}`} className="node-group cursor-pointer group/node">
            {/* Outer ring */}
            <circle
              cx={node.x} cy={node.y} r="32"
              className="fill-obsidian stroke-saffron/20 group-hover/node:stroke-saffron/60 transition-all duration-500"
              strokeWidth="1"
            />
            
            {/* Inner circle */}
            <circle
              cx={node.x} cy={node.y} r="26"
              className="fill-saffron/5 stroke-saffron/10"
            />
            
            {/* Icon */}
            <foreignObject x={node.x - 12} y={node.y - 12} width="24" height="24">
              <div className="flex items-center justify-center w-full h-full text-saffron group-hover/node:scale-110 transition-all duration-500">
                <node.Icon size={18} strokeWidth={1.5} />
              </div>
            </foreignObject>
            
            {/* Label (Always Visible) */}
            <g className="transition-all duration-500">
              <text
                x={node.x} y={node.y + 45}
                textAnchor="middle"
                className="font-mono text-[7px] fill-parchment/60 group-hover/node:fill-saffron uppercase tracking-[0.2em]"
              >
                {node.title}
              </text>
            </g>
          </g>
        ))}

        {/* Center Node (Static Glass Hub) */}
        <g className="center-node">
          {/* Subtle outer glow */}
          <circle cx={centerNode.x} cy={centerNode.y} r="60" className="fill-saffron/5 blur-[10px]" />
          
          {/* Main Hub */}
          <circle
            cx={centerNode.x} cy={centerNode.y} r="48"
            className="fill-obsidian stroke-saffron/40"
            strokeWidth="1.5"
          />
          
          <circle
            cx={centerNode.x} cy={centerNode.y} r="42"
            className="fill-saffron/10 stroke-saffron/20"
            strokeWidth="1"
          />

          <text
            x={centerNode.x}
            y={centerNode.y}
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-mono text-[7px] fill-saffron uppercase tracking-[0.2em] font-bold"
          >
            {centerNode.title.split(' ').map((word, i) => (
              <tspan key={i} x={centerNode.x} dy={i === 0 ? '-0.3em' : '1.2em'}>{word}</tspan>
            ))}
          </text>
          
          {/* Center decorative point */}
          <circle cx={centerNode.x} cy={centerNode.y} r="2" fill="var(--saffron)" />
        </g>
      </svg>
    </div>
  );
}
