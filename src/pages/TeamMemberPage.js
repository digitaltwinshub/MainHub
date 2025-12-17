import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const TEAM_STORAGE_KEY = 'dt_team_members';

const TEAM = {
  'meri-sargsian': {
    name: 'Meri Sargsian',
    role: 'ShadeLA  ProjectHUB',
    bio: 'Sed nec tortor ac dui maximus facilisis quis ac sapien. Fusce in hendrerit neque. Donec porttitor arcu ut tortor venenatis, ut accumsan neque dignissim. In neque tortor, pretium at lorem sed, malesuada suscipit lorem. In nec quam sapien. Nam sed risus ante.',
    avatar: 'https://placehold.co/333x314',
    skills: ['Urban Design', 'Sustainability', 'Community Engagement'],
    highlights: [
      'ShadeLA community hub lead and coordinator.',
      'Drives cross-discipline collaboration between architecture and technology.',
    ],
    experience: [
      'Lead on ShadeLA community hub initiative.',
      'Collaborated with local stakeholders to design public spaces.',
    ],
    links: {
      github: '',
      linkedin: '',
    },
    projects: [
      'https://placehold.co/361x286',
      'https://placehold.co/361x286'
    ]
  },
  'omid-ahmadi': {
    name: 'Omid Ahmadi',
    role: 'Software Engineer • Project Lead',
    bio: `I worked at AT&T (DIRECTV) as a Quality Assurance on a project called SignalSaver / RainFade. This technology allows viewers to continue watching through the internet whenever there is a streaming interruption, or automatically switch if the satellite signal is lost.
After two years of development and testing, we successfully released it to the market, and in 2024 the project received an award.`,
    avatar: `${process.env.PUBLIC_URL}/Team%20Members/Omid-Ahmadi.jpg.jpeg`,
    highlights: [
      'Led SignalSaver / RainFade quality assurance at AT&T (DIRECTV).',
      'Helped launch an award-winning resiliency feature for satellite TV.',
    ],
    skills: [
      'C / C++ / Java',
      'Python (in progress)',
      'API / Postman / Rest Assured',
      'MySQL',
      'CI/CD / Jenkins',
      'Selenium / Cucumber (BDD)',
      'Agile / Scrum / Waterfall',
      'SDLC / STLC',
      'Google Docs / Sheets / Slides',
    ],
    experience: [
      'Quality Assurance at AT&T (DIRECTV) on SignalSaver / RainFade.',
      'Helped launch a resilience feature that keeps satellite TV streaming via internet during outages.',
      'Two years of development and testing leading to a 2024 project award.',
    ],
    links: {
      github: '',
      linkedin: '',
    },
    projects: [
      'https://placehold.co/361x286',
      'https://placehold.co/361x286'
    ]
  },
  'priya-n': {
    name: 'Priya N',
    role: 'Systems',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis est id neque vulputate fermentum. Maecenas tristique bibendum lorem, nec sagittis libero laoreet a.',
    avatar: 'https://placehold.co/333x314',
    highlights: [
      'Designs robust data and integration pipelines.',
      'Supports backend systems for multi-team projects.',
    ],
    skills: ['Systems Design', 'Data Pipelines'],
    experience: ['Working on backend systems and integration.'],
    links: {
      github: '',
      linkedin: '',
    },
    projects: [
      'https://placehold.co/361x286',
      'https://placehold.co/361x286'
    ]
  }
};

const TeamMemberPage = () => {
  const { slug } = useParams();
  const [member, setMember] = useState(TEAM['omid-ahmadi']);
  const [memberProjects, setMemberProjects] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [highlightsInView, setHighlightsInView] = useState(false);
  const [skillsInView, setSkillsInView] = useState(false);
  const [memberProjectsInView, setMemberProjectsInView] = useState(false);
  const [experienceInView, setExperienceInView] = useState(false);

  const highlightsRef = useRef(null);
  const skillsRef = useRef(null);
  const memberProjectsRef = useRef(null);
  const experienceRef = useRef(null);
  const memberName = member && member.name ? member.name : '';
  
  // Resolve member: try dynamic storage first, then fallback to static TEAM (default Omid)
  useEffect(() => {
    let resolved = null;

    // 1) Try dynamic admin-defined member by slug
    try {
      const stored = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY) || '[]');
      if (Array.isArray(stored) && stored.length > 0 && slug) {
        const dyn = stored.find((m) => m.slug === slug);
        if (dyn) {
          resolved = {
            name: dyn.name,
            role: dyn.role || '',
            bio: dyn.bio || '',
            avatar: dyn.avatar || 'https://placehold.co/333x314',
            // Optional structured sections so dynamic members share the same layout
            highlights: Array.isArray(dyn.highlights) ? dyn.highlights : [],
            skills: Array.isArray(dyn.skills) ? dyn.skills : [],
            experience: Array.isArray(dyn.experience) ? dyn.experience : [],
            links: dyn.links && typeof dyn.links === 'object' ? dyn.links : { github: '', linkedin: '' },
            projects: [],
          };
        }
      }
    } catch {
      // ignore parse errors
    }

    // 2) If no dynamic member, fall back to hard-coded TEAM
    if (!resolved) {
      if (slug && TEAM[slug]) {
        resolved = TEAM[slug];
      } else {
        resolved = TEAM['omid-ahmadi'];
      }
    }

    setMember(resolved);
  }, [slug]);

  // Trigger a soft fade/slide-in when the page mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to observe a section ref and set a state flag when in view
  useEffect(() => {
    const entries = [
      { ref: highlightsRef, setter: setHighlightsInView },
      { ref: skillsRef, setter: setSkillsInView },
      { ref: memberProjectsRef, setter: setMemberProjectsInView },
      { ref: experienceRef, setter: setExperienceInView },
    ];

    const observers = [];

    entries.forEach(({ ref, setter }) => {
      if (!ref.current) return;

      const el = ref.current;
      const observer = new IntersectionObserver(
        (obsEntries) => {
          obsEntries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.25,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Load projects owned by this member
  useEffect(() => {
    if (!memberName) return;
    try {
      const stored = JSON.parse(localStorage.getItem('dt_projects') || '[]');
      const normalizedName = memberName.trim().toLowerCase();
      const filtered = stored.filter((p) => (p.owner || '').trim().toLowerCase() === normalizedName);
      setMemberProjects(filtered);
    } catch {
      setMemberProjects([]);
    }
  }, [memberName]);

  return (
    <div
      className={`min-h-screen bg-neutral-200 transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Black content panel */}
      <section className="w-full bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 md:py-10">
          {/* Header area: image + name/role/bio */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-[inset_0_1px_8px_rgba(255,255,255,0.8)]">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start gap-6">
              <h1 className="text-4xl md:text-5xl" style={{ fontFamily: 'Taygiacs, Poppins, ui-sans-serif' }}>{member.name}</h1>
              <p className="text-white/80 text-lg text-center md:text-left" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{member.role}</p>
              <p className="text-white/80 text-base md:text-lg text-center md:text-left whitespace-pre-line" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{member.bio}</p>

              {/* Highlights */}
              {Array.isArray(member.highlights) && member.highlights.length > 0 && (
                <div
                  ref={highlightsRef}
                  className={`w-full transition-all duration-700 ease-out ${
                    highlightsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <h2 className="text-xl text-white mb-2" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Highlights</h2>
                  <ul className="list-disc list-inside text-white/85 space-y-1 text-base md:text-lg">
                    {member.highlights.map((item) => (
                      <li key={item} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {Array.isArray(member.skills) && member.skills.length > 0 && (
                <div
                  ref={skillsRef}
                  className={`w-full transition-all duration-700 ease-out ${
                    skillsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <h2 className="text-xl text-white mb-2" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Skills</h2>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-white/10 text-white text-xs md:text-sm border border-white/20 shadow-sm transition-transform transition-colors duration-200 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-md"
                        style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects mini portfolio */}
              <div
                ref={memberProjectsRef}
                className={`w-full mt-4 transition-all duration-700 ease-out ${
                  memberProjectsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <h2 className="text-xl text-white mb-2" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memberProjects.length > 0 ? (
                    memberProjects.map((p) => (
                      <div
                        key={p.id}
                        className="group rounded-3xl bg-white/5 shadow-[inset_0_0.8px_4px_rgba(255,255,255,0.6)] overflow-hidden transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-40 object-cover transform transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="p-4">
                          <div className="text-lg font-semibold" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{p.title}</div>
                          <div className="mt-1 text-white/80 text-xs" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                            {p.category || 'Project'}{p.status ? ` • ${p.status}` : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/70 text-sm" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                      No projects linked to this team member yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              {Array.isArray(member.experience) && member.experience.length > 0 && (
                <div
                  ref={experienceRef}
                  className={`w-full transition-all duration-700 ease-out ${
                    experienceInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <h2 className="text-xl text-white mb-2" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Experience</h2>
                  <ul className="list-none m-0 p-0">
                    {member.experience.map((exp) => (
                      <li key={exp} className="text-white/80 text-base md:text-lg" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Social links */}
              <div className="flex items-center gap-4">
                <a
                  href={member.links && member.links.github ? member.links.github : '#'}
                  aria-label="GitHub"
                  className="opacity-80 hover:opacity-100"
                >
                  <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 0C11.82 0 8.259 1.343 5.456 3.788 2.653 6.234.79 9.622.2 13.347c-.59 3.725.133 7.543 2.038 10.772 1.905 3.228 4.868 5.657 8.36 6.85.775.139 1.066-.338 1.066-.755 0-.378-.02-1.629-.02-2.96-3.894.735-4.902-1.0-5.212-1.894-.344-.869-.89-1.64-1.59-2.245-.542-.298-1.317-1.033-.02-1.053.496.055.971.232 1.386.515.415.284.757.666.997 1.114.212.39.497.734.839 1.011.342.277.734.483 1.153.605.419.121.858.157 1.291.104.433-.052.852-.192 1.232-.41.067-.808.418-1.563.988-2.125-3.449-.397-7.053-1.768-7.053-7.846-.022-1.58.546-3.108 1.588-4.272-.474-1.373-.418-2.88.155-4.212 0 0 1.298-.417 4.262 1.629 2.536-.715 5.213-.715 7.749 0 2.965-2.066 4.263-1.629 4.263-1.629.573 1.332.628 2.838.154 4.211 1.045 1.162 1.614 2.691 1.588 4.271 0 6.099-3.623 7.45-7.072 7.847.37.385.655.847.835 1.354.181.508.253 1.049.211 1.588 0 2.126-.019 3.835-.019 4.371 0 .417.29.913 1.065.754 3.485-1.203 6.44-3.637 8.337-6.867 1.897-3.231 2.612-7.047 2.018-10.769C30.203 9.613 28.339 6.229 25.537 3.786 22.735 1.344 19.178.002 15.5 0Z" fill="white" fillOpacity="0.8"/></svg>
                </a>
                <a
                  href={member.links && member.links.linkedin ? member.links.linkedin : '#'}
                  aria-label="LinkedIn"
                  className="opacity-80 hover:opacity-100"
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.879 0C2.646 0 0 2.646 0 5.879V24.122C0 27.355 2.646 30 5.879 30H24.122C27.355 30 30 27.355 30 24.122V5.879C30 2.646 27.355 0 24.122 0H5.879zM7.358 4.951c1.55 0 2.505 1.017 2.534 2.355 0 1.308-.984 2.355-2.564 2.355h-.029c-1.521 0-2.503-1.046-2.503-2.355 0-1.338 1.012-2.355 2.562-2.355h.001zM20.716 11.203c2.981 0 5.216 1.948 5.216 6.135v7.817h-4.53V17.863c0-1.832-.656-3.083-2.295-3.083-1.252 0-1.998.842-2.326 1.656-.12.291-.149.698-.149 1.105v7.614h-4.53s.06-12.354 0-13.633h4.531v1.93c.602-.929 1.679-2.25 4.083-2.25zM5.062 11.523H9.593V25.155H5.062V11.523z" fill="white" fillOpacity="0.8"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link to="/team" className="text-white/80 hover:text-white underline underline-offset-4" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Back to team</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamMemberPage;
