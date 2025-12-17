import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const DigitalTwinsHub = () => {
  const [mounted, setMounted] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [leadersInView, setLeadersInView] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);

  const projectsTitleRef = useRef(null);
  const leadersTitleRef = useRef(null);
  const ctaTitleRef = useRef(null);

  const leaders = [
    {
      name: 'Professor Marcela Oliva',
      title: 'Project Leader',
      img: `${process.env.PUBLIC_URL}/Professors/Professor Marcela Oliva.jpg`,
      desc:
        'For over a decade, she led as the Knowledge Architect for the $9 billion Building Program at the Los Angeles Community College District, pioneering the development and rollout of the nations largest Digital Twin/Virtualization BIM/GIS System, aligned with National Intelligence Standards.'
    },
    {
      name: 'Professor Arthur Modine',
      title: 'Project Leader',
      img: `${process.env.PUBLIC_URL}/Professors/Professor Arthur Modine.png`,
      desc:
        'Arthur is a designer and entrepreneur based in Los Angeles, California, specializing in architecture, software development and fashion design. He holds a Master\'s in Architecture from SCI-Arc, where was honored with a master\'s thesis award for developing a prototype of AURA, an innovative AR-based urban planning and geospatial analysis platform.'
    },
    {
      name: 'Professor Jack Rendler',
      title: 'Project Leader',
      img: `${process.env.PUBLIC_URL}/Professors/Professor Jack Rendler.jpg`,
      desc:
        "Jack Oliva-Rendler is a designer and researcher exploring digital 3D modeling, GIS, and algorithmic systems for multi-scalar ecological and infrastructural solutions. He studied at SCI-Arc and earned a Master of Architecture from Harvard GSD. His practice focuses on fractal modeling and algorithmic simulation, which he teaches through Futurly, PA Academy, and LATTC."
    },
  ];

  const [active, setActive] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [savedProjects, setSavedProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectOfMonth, setProjectOfMonth] = useState(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        setSavedProjects([]);
        return;
      }
      const stored = JSON.parse(window.localStorage.getItem('dt_projects') || '[]');
      if (!Array.isArray(stored) || stored.length === 0) {
        setSavedProjects([]);
        return;
      }

      setSavedProjects(stored);

      const shuffled = [...stored].sort(() => Math.random() - 0.5);

      // Prefer flagship projects for Featured Projects; fall back to any projects
      const flagship = shuffled.filter((p) => p && p.projectType === 'flagship');
      const sourceForFeatured = flagship.length > 0 ? flagship : shuffled;
      const pickedFeatured = sourceForFeatured.slice(0, Math.min(3, sourceForFeatured.length));
      setFeaturedProjects(pickedFeatured);

      setProjectOfMonth(shuffled[0]);
    } catch {
      setSavedProjects([]);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Observe Projects heading for scroll-in animation
  useEffect(() => {
    if (!projectsTitleRef.current) return;

    const el = projectsTitleRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Observe Project Leaders heading for scroll-in animation
  useEffect(() => {
    if (!leadersTitleRef.current) return;

    const el = leadersTitleRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLeadersInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Observe CTA heading for scroll-in animation
  useEffect(() => {
    if (!ctaTitleRef.current) return;

    const el = ctaTitleRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCtaInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const goTo = (index) => {
    setIsFading(true);
    setTimeout(() => {
      setActive(index);
      setIsFading(false);
    }, 250);
  };

  const nextSlide = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setActive((prev) => (prev + 1) % leaders.length);
      setIsFading(false);
    }, 250);
  }, [leaders.length]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(id);
  }, [isPaused, nextSlide]);

  return (
    <div
      className={`flex flex-col transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Hero Section - dark header, clean studio layout, unified color with body */}
      <section className="w-full bg-gray-950 relative overflow-hidden">
        {/* subtle spotlight gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="w-full max-w-4xl mx-auto">
            <h1
              className={`text-white leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center transition-transform transition-opacity duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 500, lineHeight: 1.1 }}
            >
              Digital Twins Projects Hub
            </h1>
            <p
              className="mt-6 text-slate-200/90 text-lg md:text-xl leading-relaxed text-justify"
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
            >
              This platform is a collaborative space where innovators, researchers, and students can create, showcase, and track projects from any discipline. Whether it�s a software application, an AI experiment, a 3D architectural model, or a data-driven research study, users can add their projects, assign contributors, and monitor progress in real time. Explore ongoing work, learn from others, and contribute to exciting ideas across fields � all in one interactive and user-friendly environment.
            </p>

            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />

            <ul
              className="mt-6 space-y-2 text-slate-100 text-base md:text-lg text-left md:text-justify"
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
            >
              <li><span className="font-semibold">Collaboration Across Teams:</span> Work with professors, peers, and contributors from anywhere.</li>
              <li><span className="font-semibold">Dynamic Project Tracking:</span> Monitor progress, stages, and milestones visually.</li>
              <li><span className="font-semibold">Cross-Disciplinary Projects:</span> Combine software, data, design, and physical systems in one space.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Projects & Project of the Month */}
      <section className="w-full bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)] items-start">
          {/* Featured Projects Carousel (simple cards with dots) */}
          <div>
            <h3 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
              FLAGSHIP PROJECTS
            </h3>
            <p className="mt-3 text-white/70 max-w-xl text-base md:text-lg" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              A rotating look at digital twin projects pulled from the Projects hub.
            </p>

            <div className="mt-8 space-y-6">
              {(featuredProjects.length > 0 ? featuredProjects : [
                {
                  id: 'sample-1',
                  title: 'Campus Microgrid Digital Twin',
                  category: 'Energy · Simulation',
                  goal: 'Real-time energy monitoring and scenario testing for a multi-building campus microgrid.',
                },
                {
                  id: 'sample-2',
                  title: 'Transit Accessibility Twin',
                  category: 'Mobility · GIS',
                  goal: 'GIS-based twin exploring access to public transit stops by walking, biking, and micro-mobility.',
                },
                {
                  id: 'sample-3',
                  title: 'Manufacturing Line XR Prototype',
                  category: 'XR · Industrial',
                  goal: 'A 3D twin of a factory line with AR overlays for training and maintenance.',
                },
              ]).map((project, index) => (
                <div
                  key={project.id || project.title}
                  className="group rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6 flex flex-col gap-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg md:text-xl font-semibold" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                      {project.title || 'Untitled Project'}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white/10 text-white/80" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                      {project.category || 'Digital Twin Project'}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-white/70" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
                    {project.summary || project.goal || 'A featured project from the Digital Twins hub.'}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-white/70">
                    {project.id ? (
                      <Link
                        to="/projects"
                        state={{ projectId: project.id }}
                        className="underline-offset-4 hover:underline"
                      >
                        View project
                      </Link>
                    ) : (
                      <span>From the fellowship projects</span>
                    )}
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className={`h-1.5 w-1.5 rounded-full ${dot === index ? 'bg-white' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project of the Month with video/presentation embed */}
          <div className="rounded-3xl bg-white text-gray-900 overflow-hidden shadow-lg border border-gray-200">
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                  Project of the Month
                </h3>
                <p className="text-lg md:text-xl font-semibold mt-1" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                  {(projectOfMonth && projectOfMonth.title) || 'LA River Climate Resilience Twin'}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-900 text-white text-xs px-3 py-1" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                {(projectOfMonth && projectOfMonth.category) || 'Climate · GIS · 3D'}
              </span>
            </div>

            <div className="aspect-video bg-black">
              <video
                className="w-full h-full"
                controls
                autoPlay
                loop
                muted
                playsInline
                src={(projectOfMonth && projectOfMonth.videoUrl) || `${process.env.PUBLIC_URL}/Featured%20Projects/Mastering Agile Sprints_ A Manager's Guide.mp4`}
              />
            </div>

            <div className="px-6 py-5 space-y-3 text-sm md:text-base" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              <p className="text-gray-700">
                {(projectOfMonth && (projectOfMonth.summary || projectOfMonth.goal)) ||
                  'An interactive twin combining 3D models, simulations, and community data to explore future scenarios.'}
              </p>
              <p className="text-gray-600 text-sm">
                {projectOfMonth && projectOfMonth.tools
                  ? `Built with: ${projectOfMonth.tools}`
                  : 'Built with: Unreal Engine, Rhino, QGIS, open datasets.'}
              </p>
              <button className="mt-1 inline-flex items-center text-sm font-medium text-gray-900 hover:text-black underline-offset-4 hover:underline">
                View project overview
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="w-full bg-gray-300">
        <div className="max-w-[90rem] mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <h3
              ref={projectsTitleRef}
              className="text-black text-4xl sm:text-5xl md:text-6xl"
              style={{ fontFamily: 'Poppins, ui-sans-serif' }}
            >
              Projects
            </h3>
            <p
              className="mt-4 text-black/70 max-w-2xl text-base md:text-lg"
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
            >
              Explore featured digital twin initiatives across disciplines. Dive into simulations, analytics, and real-time models.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(savedProjects.length > 0
              ? [...savedProjects]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3)
              : [
                  { title: 'Smart Campus Energy Model', img: 'https://placehold.co/640x420', category: 'Energy' },
                  { title: 'Urban Mobility Twin', img: 'https://placehold.co/640x420', category: 'Transportation' },
                  { title: 'Manufacturing Line Simulator', img: 'https://placehold.co/640x420', category: 'Manufacturing' },
                ]
            ).map((p, i) => (
              <div
                key={p.id || p.title || i}
                className="group rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 overflow-hidden shadow-sm"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.image || p.img || 'https://placehold.co/640x420'}
                    alt={p.title || 'Project preview'}
                    className="w-full h-56 object-cover"
                  />
                  <span
                    className="absolute top-3 left-3 rounded-full bg-black/80 text-white text-xs px-3 py-1"
                    style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                  >
                    {p.category || 'Project'}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-black" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                    {p.title || 'Untitled Project'}
                  </h4>
                  {(p.summary || (p.goal && p.goal.split('\n')[0])) && (
                    <p
                      className="mt-2 text-sm text-black/70 line-clamp-2"
                      style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
                    >
                      {p.summary || p.goal.split('\n')[0]}
                    </p>
                  )}
                  {p.id ? (
                    <Link to={`/projects/${p.id}`}>
                      <button
                        className="mt-4 inline-flex items-center text-sm text-black/70 group-hover:text-black underline-offset-4 hover:underline"
                        style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                      >
                        View details
                      </button>
                    </Link>
                  ) : (
                    <Link to="/projects">
                      <button
                        className="mt-4 inline-flex items-center text-sm text-black/70 group-hover:text-black underline-offset-4 hover:underline"
                        style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                      >
                        View details
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link to="/projects">
              <button className="rounded-full bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors text-base" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
                Explore All Projects
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Professors Section */}
      <section className="w-full bg-black text-white relative overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-6 py-20 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-10 items-start">
            <div className="relative">
              <div
                ref={leadersTitleRef}
                className={`text-white transition-all duration-700 ease-out ${
                  leadersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ fontFamily: 'Poppins, ui-sans-serif', fontWeight: 500, fontSize: '88px', lineHeight: 1.05 }}
              >
                Project <br /> Leaders
              </div>
              <p
                className="mt-6 text-white/70 max-w-none text-xl md:text-2xl"
                style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', textAlign: 'justify' }}
              >
                Our fellowship members lead with expertise, creativity, and collaboration. They turn ideas into reality and inspire innovation across every project.
              </p>
            </div>

            <div className="relative">
              <div
                className="relative bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm shadow-[inset_0_1px_6px_rgba(255,255,255,0.6)] px-6 py-6 md:px-10 md:py-10 overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                tabIndex={0}
                aria-label="Project leaders slider"
              >
                <div className={`grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}> 
                  <img
                    src={leaders[active].img}
                    alt={leaders[active].name}
                    className="w-full md:w-[260px] h-[340px] object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/260x340';
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className="pt-2">
                    <div className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{leaders[active].name}</div>
                    <div className="mt-2 text-white/60" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{leaders[active].title}</div>
                    <p className="mt-6 text-white/80 max-w-xl" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                      {leaders[active].desc && leaders[active].desc.trim().length > 0
                        ? leaders[active].desc
                        : 'Digital Twin leadership and mentorship across disciplines.'}
                    </p>
                  </div>
                </div>

                {/* Dots */}
                <div className="mt-6 flex items-center gap-2 justify-center">
                  {leaders.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={`h-2 w-2 rounded-full ${i === active ? 'bg-white' : 'bg-white/40'} hover:bg-white/70 transition-colors`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                {/* Removed */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="w-full bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              ref={ctaTitleRef}
              className={`text-2xl md:text-3xl transition-all duration-700 ease-out ${
                ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ fontFamily: 'Inter, system-ui' }}
            >
              Have a Digital Twin idea?
            </h3>
            <p className="text-white/80 mt-2" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Propose a project and collaborate with mentors and peers.</p>
          </div>
          <button
            className="rounded-full bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors"
            style={{ fontFamily: 'Poppins, ui-sans-serif' }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  setShowProposal(true);
                }, 300);
              } else {
                setShowProposal(true);
              }
            }}
          >
            Submit a Proposal
          </button>
        </div>
      </section>

      {/* Proposal modal */}
      {showProposal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-20">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowProposal(false)}
          />
          <div className="relative z-10 max-w-xl w-[90vw]">
            <div className="absolute -top-10 right-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowProposal(false)}
                className="text-sm text-white/80 hover:text-white underline underline-offset-4"
                style={{ fontFamily: 'Poppins, ui-sans-serif' }}
              >
                Close
              </button>
            </div>
            <ProposalForm />
          </div>
        </div>
      )}

      {/* Terms modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 md:pt-16">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowTerms(false)}
          />
          <div className="relative z-10 max-w-3xl w-[92vw]">
            <div className="absolute -top-10 right-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="text-sm text-white/80 hover:text-white underline underline-offset-4"
                style={{ fontFamily: 'Poppins, ui-sans-serif' }}
              >
                Close
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md px-6 py-8 md:px-8 md:py-10">
              <h2
                className="text-2xl md:text-3xl font-semibold text-gray-900"
                style={{ fontFamily: 'Poppins, ui-sans-serif' }}
              >
                Digital Twins Projects Hub — Terms of Service
              </h2>
              <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                Effective date: November 24, 2025
              </p>

              <div className="mt-6 space-y-4 text-gray-800 text-sm md:text-base" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                <div>
                  <p>
                    Welcome to <strong>Digital Twins Projects Hub</strong> ("we", "us", "Platform"). These Terms explain the rules for using our platform.
                    By joining and using the Platform, you agree to these Terms. If you do not agree, please do not use the Platform.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1. Membership</h3>
                  <p>
                    The Platform is only for fellowship members. Only invited or approved members may register and access projects.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">2. Account &amp; Security</h3>
                  <p>Keep your account details private.</p>
                  <p>You are responsible for all activity under your account.</p>
                  <p>Notify us immediately if your account is compromised.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">3. User Content</h3>
                  <p>Members can upload project ideas, code, 3D models, or other materials ("User Content").</p>
                  <p>
                    By sharing content, you allow other members and the Platform to view and use it within the Platform. You still own your work.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4. Acceptable Use</h3>
                  <p>Do not post illegal, harmful, or offensive content.</p>
                  <p>Do not interfere with the Platform’s operation.</p>
                  <p>We can remove content or suspend accounts if rules are broken.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">5. Third-Party Links</h3>
                  <p>The Platform may link to external resources. We are not responsible for content on those sites.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">6. Privacy</h3>
                  <p>
                    We follow our Privacy Policy to handle personal information. By using the Platform, you agree to our privacy practices.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">7. Liability</h3>
                  <p>We provide the Platform as-is. We are not responsible for loss of data or other damages.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">8. Termination</h3>
                  <p>We may remove access for members who break these rules.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">9. Contact</h3>
                  <p>Questions? Email us at <strong>support@digitaltwins.example</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-black text-white/70">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm" style={{ fontFamily: 'Poppins, ui-sans-serif' }}> {new Date().getFullYear()} Digital Twins Hub</span>
          <div className="flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="hover:text-white cursor-pointer bg-transparent border-none p-0 m-0 text-inherit"
              style={{ fontFamily: 'Poppins, ui-sans-serif' }}
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="hover:text-white cursor-pointer bg-transparent border-none p-0 m-0 text-inherit"
              style={{ fontFamily: 'Poppins, ui-sans-serif' }}
            >
              Terms
            </button>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ...
function ProposalForm() {
  return (
    <div
      className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md"
      style={{ fontFamily: 'Poppins, ui-sans-serif' }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Submit a Proposal
      </h2>

      <form className="space-y-5">
        <Input label="Project Title" placeholder="Enter your project title" />
        <SelectField />
        <DescriptionField />
        <FileUpload />

        <button
          type="button"
          className="rounded-full bg-black text-white px-6 py-3 w-full hover:bg-gray-800 transition-colors"
        >
          Submit Proposal
        </button>
      </form>
    </div>
  );
}

function Input({ label, placeholder }) {
  return (
    <div>
      <label className="block text-gray-700 mb-1 font-medium">{label}</label>
      <input
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField() {
  return (
    <div>
      <label className="block text-gray-700 mb-1 font-medium">Category</label>
      <select className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none">
        <option>Select a category</option>
        <option>AI / Machine Learning</option>
        <option>Software Development</option>
        <option>3D / Architecture</option>
        <option>Data Science</option>
        <option>Research Study</option>
      </select>
    </div>
  );
}

function DescriptionField() {
  return (
    <div>
      <label className="block text-gray-700 mb-1 font-medium">Project Description</label>
      <textarea
        rows="4"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black outline-none"
        placeholder="Describe your idea..."
      />
    </div>
  );
}

function FileUpload() {
  return (
    <div>
      <label className="block text-gray-700 mb-1 font-medium">Attach Files (optional)</label>
      <input type="file" className="w-full rounded-xl border border-gray-300 px-4 py-2" />
    </div>
  );
}

export default DigitalTwinsHub;
