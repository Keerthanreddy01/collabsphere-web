import { CalendarDays, ExternalLink, Github, Triangle } from 'lucide-react'

import { cn } from '@/lib/utils'

type ProjectCardProps = {
  title: string
  description: string
  stack: string[]
  builder: string
  date: string
  upvotes: number
  liveUrl?: string
  githubUrl?: string
  className?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const FOLDER_THEMES = [
  {
    // Warm Orange (Like Folder 1 in screenshot)
    svgColor: 'text-[#FFAE42] dark:text-[#D97706]',
    shadowColor: 'drop-shadow-[0_-8px_20px_rgba(251,191,36,0.2)]',
    subtitle: 'You\'re Doing Great!',
    textColor: 'text-black dark:text-white',
    avatarRing: 'ring-amber-200',
  },
  {
    // Vibrant Blue (Like Folder 2/6 in screenshot)
    svgColor: 'text-[#2563EB] dark:text-[#1D4ED8]',
    shadowColor: 'drop-shadow-[0_-8px_20px_rgba(37,99,235,0.2)]',
    subtitle: 'Everything is Here',
    textColor: 'text-black dark:text-white',
    avatarRing: 'ring-blue-200',
  },
  {
    // Soft Purple (Like Folder 11 in screenshot)
    svgColor: 'text-[#A855F7] dark:text-[#7E22CE]',
    shadowColor: 'drop-shadow-[0_-8px_20px_rgba(168,85,247,0.2)]',
    subtitle: 'Work in Progress',
    textColor: 'text-black dark:text-white',
    avatarRing: 'ring-purple-200',
  },
  {
    // Cyber Green (Like Folder 5 in screenshot)
    svgColor: 'text-[#10B981] dark:text-[#047857]',
    shadowColor: 'drop-shadow-[0_-8px_20px_rgba(16,185,129,0.2)]',
    subtitle: 'Documentation & Code',
    textColor: 'text-black dark:text-white',
    avatarRing: 'ring-emerald-200',
  },
]

export function ProjectCard({
  title,
  description,
  stack,
  builder,
  date,
  upvotes,
  liveUrl,
  githubUrl,
  className,
}: ProjectCardProps) {
  const initials = getInitials(builder) || 'CB'
  const hash = hashString(title)
  const theme = FOLDER_THEMES[hash % FOLDER_THEMES.length]

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-end w-full h-[400px] overflow-visible bg-transparent border-0 shadow-none transition-all duration-300 hover:-translate-y-2',
        className,
      )}
    >
      {/* 
        TOP SECTION: 3D Layered Documents & Widgets (Sticking out of the folder pocket)
      */}
      <div className="absolute top-0 left-0 w-full h-[200px] overflow-visible pointer-events-none z-10">
        
        {/* Back Document: Technology Stack Manifest */}
        <div className="absolute bottom-6 left-[12%] w-[76%] h-[120px] rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 shadow-sm rotate-[4deg] transition-all duration-500 group-hover:rotate-[7deg] group-hover:-translate-y-3 group-hover:translate-x-2 flex flex-col justify-between p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              tech_stack.json
            </span>
            <div className="flex gap-1">
              <span className="size-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <span className="size-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          {/* Tech Badges List */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[8px] font-bold text-slate-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Front Document: Project Description Specs */}
        <div className="absolute bottom-3 left-[8%] w-[84%] h-[140px] rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-white/10 shadow-md rotate-[-2.5deg] transition-all duration-500 group-hover:rotate-[-5deg] group-hover:-translate-y-2 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-1.5">
            <span className="font-mono text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              README.md
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
          </div>
          {/* Description Content */}
          <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed font-semibold text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* Floating Upvote Widget Badge (Tilted paper slip) */}
        <div className="absolute top-4 right-10 bg-slate-950 text-[#ccff00] text-[8px] font-mono font-bold tracking-wider px-2 py-1 rounded-lg border border-slate-800 shadow-md rotate-[12deg] transition-all duration-500 group-hover:rotate-[16deg] group-hover:-translate-y-4 group-hover:translate-x-1 z-15">
          +{upvotes} UPVOTES
        </div>
      </div>

      {/* 
        BOTTOM SECTION: 3D Folder Pocket Face
        (Physically overlaps and covers the bottom of the documents)
      */}
      <div className="relative z-20 w-full h-[220px] select-none">
        
        {/* SVG Folder Face Shape with custom color & soft drop shadow */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg
            className={cn('w-full h-full transition-all duration-300 fill-current', theme.svgColor, theme.shadowColor)}
            viewBox="0 0 400 220"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            {/* 
              Responsive 3D folder shape path:
              - Left tab is rounded, starting at y=0
              - Curves down to flat y=24 on the right
            */}
            <path d="
              M 0 24 
              Q 0 0 24 0 
              L 140 0 
              Q 160 0 170 12 
              Q 180 24 200 24 
              L 376 24 
              Q 400 24 400 48 
              L 400 220 
              L 0 220 
              Z" 
            />
          </svg>
        </div>

        {/* Folder Pocket Inside Content */}
        <div className={cn('relative z-30 flex flex-col justify-between h-full p-6 pt-12', theme.textColor)}>
          
          {/* Project Title & Status */}
          <div>
            <h3 className="text-xl font-black tracking-tight leading-tight truncate">
              {title}
            </h3>
            
            {/* Folder Subtitle metadata */}
            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest opacity-80 font-mono">
              {theme.subtitle}
            </p>
          </div>

          {/* Folder Divider & Footer */}
          <div className="mt-4">
            <div className="border-t border-gray-200 dark:border-white/20 dark:border-slate-950/20 pb-3" />
            
            <div className="flex items-center justify-between gap-3">
              {/* Creator details inside folder pocket */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-800 shadow-sm ring-2', theme.avatarRing)}>
                  {initials}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="truncate text-[10px] font-bold opacity-90 leading-tight">
                    By {builder}
                  </span>
                  <span className="text-[8px] opacity-70 mt-0.5 font-mono">
                    {date}
                  </span>
                </div>
              </div>

              {/* Action controller buttons */}
              <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-7 items-center justify-center rounded-full bg-black/20 dark:bg-white/20 hover:bg-white/30 text-black dark:text-white backdrop-blur-md transition-all active:scale-90"
                    title="Live Demo"
                  >
                    <ExternalLink className="size-3.5 stroke-[2.5px]" />
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-7 items-center justify-center rounded-full bg-black/20 dark:bg-white/20 hover:bg-white/30 text-black dark:text-white backdrop-blur-md transition-all active:scale-90"
                    title="GitHub Code"
                  >
                    <Github className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}