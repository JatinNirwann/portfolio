import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project, GitHubRepo } from '../types';
import { ArrowUpRight, Loader, Github, ServerCrash } from 'lucide-react';

const Work: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'cache' | 'api' | 'fallback' | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Try Fetching from the local Python backend
        // We use a short timeout to fail fast if backend isn't running
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/github-repos', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Backend unavailable`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Backend returned failure");
        }

        const backendRepos = data.repos;

        // Set data source based on backend response
        const source = data.source;
        if (source === 'cache' || source === 'cache_stale') {
          setDataSource('cache');
        } else {
          setDataSource('api');
        }

        if (!Array.isArray(backendRepos)) {
          throw new Error("Backend data format invalid");
        }

        const formattedProjects: Project[] = backendRepos.map((repo: any, index: number) => ({
          id: index,
          title: repo.name ? repo.name.replace(/-/g, ' ') : 'Untitled',
          category: repo.language || 'Development',
          description: repo.description,
          year: repo.updated_at ? new Date(repo.updated_at).getFullYear().toString() : '2024',
          url: repo.html_url,
          status: (repo.status === 'under dev' ? 'under dev' : 'completed') as 'completed' | 'under dev',
          topics: repo.topics || []
        }));

        setProjects(formattedProjects);
      } catch (backendErr) {
        console.warn("Backend fetch failed, switching to fallback.", backendErr);

        // 2. Fallback: Direct GitHub API
        try {
          setDataSource('fallback');
          const response = await fetch('https://api.github.com/users/JatinNirwann/repos?sort=updated');

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "GitHub API unavailable");
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("GitHub API returned non-array data (likely rate limit)");
          }

          const repos: GitHubRepo[] = data;

          // Client-side filtering logic (replicating backend logic loosely)
          const formattedProjects: Project[] = repos
            .filter(repo => !repo.fork) // Simple filter
            .slice(0, 12)
            .map((repo, index) => {
              const desc = repo.description?.toLowerCase() || '';
              const isWip = desc.includes('wip') ||
                desc.includes('under development') ||
                desc.includes('todo') ||
                (repo.topics && repo.topics.includes('wip'));

              return {
                id: repo.id,
                title: repo.name.replace(/-/g, ' '),
                category: repo.language || 'Development',
                description: repo.description,
                year: new Date(repo.created_at).getFullYear().toString(),
                url: repo.html_url,
                status: isWip ? 'under dev' : 'completed',
                topics: repo.topics || []
              };
            });

          setProjects(formattedProjects);
        } catch (fallbackErr: any) {
          console.error("Fallback failed:", fallbackErr);
          setError(`System Offline: ${fallbackErr.message || 'Check connection'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <section id="work" className="bg-deep-black text-white py-32 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-20 border-b border-white/20 pb-8">
          <div>
            <h2 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter">
              System <span className="text-brand-main">Log</span>
            </h2>

            {/* Status Indicators */}
            {!loading && !error && (
              <div className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                {dataSource === 'fallback' ? (
                  <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
                    <ServerCrash size={12} />
                    <span>Backend Offline • Private Cloud Unreachable</span>
                  </div>
                ) : dataSource === 'cache' ? (
                  <div className="flex items-center gap-2 text-brand-sec">
                    <div className="w-2 h-2 rounded-full bg-brand-sec"></div>
                    <span>System Online • Cached Data</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>System Online • Live Connection</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="hidden md:block font-sans text-sm tracking-widest text-brand-main">
            <Github className="inline mr-2" size={16} />
            github.com/JatinNirwann
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-brand-main" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-20 px-4 border border-red-900/50 bg-red-900/10 rounded-lg max-w-2xl mx-auto">
            <ServerCrash className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-red-500 mb-2">Connection Failed</h3>
            <p className="font-mono text-sm text-gray-400 mb-4">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {projects.length === 0 ? (
              <div className="text-center py-10 font-mono text-gray-500">No public projects found.</div>
            ) : (
              projects.map((project) => (
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={project.id}
                  className="group relative border-b border-white/10 py-12 md:py-20 flex flex-col md:flex-row justify-between items-center cursor-pointer overflow-hidden transition-all duration-300 hover:bg-white/5 px-4"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="z-10 w-full md:w-3/4">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-display text-4xl md:text-6xl font-bold uppercase transition-transform duration-300 group-hover:translate-x-4 group-hover:text-brand-main">
                        {project.title}
                      </h3>
                      {project.status === 'under dev' && (
                        <span className="px-3 py-1 border border-brand-sec text-brand-sec text-xs font-bold uppercase tracking-wider rounded-full bg-brand-sec/10">
                          WIP
                        </span>
                      )}
                    </div>

                    <p className="font-sans text-gray-500 mt-2 flex items-center gap-2 group-hover:translate-x-4 transition-transform duration-300 delay-75 max-w-2xl">
                      <span className={`w-2 h-2 rounded-full ${project.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-brand-sec font-bold">{project.category}</span>
                      <span className="hidden md:inline text-gray-600">|</span>
                      <span className="truncate hidden md:inline">{project.description || 'No description available.'}</span>
                    </p>

                    {project.topics && project.topics.length > 0 && (
                      <div className="mt-4 flex gap-2 group-hover:translate-x-4 transition-transform duration-300 delay-100">
                        {project.topics.slice(0, 3).map(topic => (
                          <span key={topic} className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">#{topic}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hidden md:flex items-center gap-12 z-10">
                    <span className="font-sans text-xl font-light">{project.year}</span>
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-brand-main group-hover:border-brand-main transition-all duration-300">
                      <ArrowUpRight className="text-white group-hover:text-black transition-colors" />
                    </div>
                  </div>

                  {/* Abstract Hover Background */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-transparent to-brand-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                </motion.a>
              ))
            )}
          </div>
        )}

        <div className="mt-20 text-center">
          <a href="https://github.com/JatinNirwann" target="_blank" className="inline-block px-10 py-4 border border-brand-main text-brand-main hover:bg-brand-main hover:text-black transition-all duration-300 font-bold tracking-widest uppercase">
            View GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default Work;