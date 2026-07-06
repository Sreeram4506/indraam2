import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Seo from '../components/Seo';
import { projects } from '../data/projects';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.num === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-obsidian text-parchment flex flex-col items-center justify-center">
        <Seo
          title="Project Not Found | Indraam Studio"
          description="The requested Indraam Studio project could not be found."
          keywords={['Indraam Studio', 'project not found']}
          path={`/project/${id ?? ''}`}
          noIndex
        />
        <h1 className="font-display text-4xl mb-4">Project Not Found</h1>
        <button onClick={() => navigate('/')} className="text-saffron font-mono tracking-widest hover:underline">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-parchment pt-32 px-6 md:px-20 pb-32 relative overflow-hidden">
      <Seo
        title={`${project.title} | Indraam Studio Case Study`}
        description={`${project.description} Explore the ${project.category.toLowerCase()} work behind ${project.title} by Indraam Studio.`}
        keywords={[
          'Indraam Studio',
          project.title,
          project.category,
          'case study',
          'AI automation',
          'software development',
          'digital product design',
          'web application',
        ]}
        path={`/project/${project.num}`}
        type="article"
      />

      <button
        onClick={() => navigate('/')}
        className="absolute top-12 left-6 md:left-20 text-saffron font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 z-20 cursor-pointer"
      >
        <span className="text-lg" aria-hidden="true">
          &larr;
        </span>{' '}
        Back to Studio
      </button>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-saffron/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron">
            {project.category}
          </span>
        </div>

        <h1 className="font-display text-[clamp(40px,8vw,120px)] leading-[0.9] mb-12">
          {project.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <p className="font-body text-fog/80 text-xl leading-relaxed">
            {project.description}
            <br />
            <br />
            This project represents a synthesis of spatial logic and experiential design. By focusing on atmospheric lighting and seamless material transitions, we created an environment that feels both grounded and deeply futuristic.
          </p>
          <div className="border border-white/10 p-8 backdrop-blur-sm bg-white/5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-saffron mb-4">Project Overview</h3>
            <ul className="space-y-4 font-body text-fog/60">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Status</span>
                <span className="text-parchment">Completed</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Year</span>
                <span className="text-parchment">2026</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Core Focus</span>
                <span className="text-parchment" style={{ color: project.color }}>
                  {project.category.split(' / ')[0]}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full aspect-[16/9] border border-white/10 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-obsidian via-ink to-obsidian/90 flex flex-col items-center justify-center text-center px-6">
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-saffron/70 mb-3">
              Project Visual
            </span>
            <span className="font-display text-[clamp(28px,4vw,56px)] leading-none text-parchment">
              Coming Soon
            </span>
          </div>
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" style={{ backgroundColor: project.color }} />
        </div>
      </div>
    </div>
  );
}
