import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useNotifications } from '../context/NotificationContext';
import { PROJECTS_CATALOG } from '../data/projectsCatalog';

const TEAM_STORAGE_KEY = 'dt_team_members';

const FALLBACK_MEMBERS = [
  { name: 'Meri Sargsian', role: 'ShadeLA ProjectHUB', img: 'https://placehold.co/254x240', slug: 'meri-sargsian' },
  { name: 'Omid Ahmadi', role: 'Software Engineer', img: `${process.env.PUBLIC_URL}/Team%20Members/Omid-Ahmadi.jpg.jpeg`, slug: 'omid-ahmadi' },
  { name: 'Priya N', role: 'Systems', img: 'https://placehold.co/254x240', slug: 'priya-n' },
  { name: 'John Appleseed', role: 'Architecture', img: 'https://placehold.co/254x240', slug: 'john-appleseed' },
];

const ProjectsPage = () => {
  const [savedProjects, setSavedProjects] = useState(PROJECTS_CATALOG);
  const [previewing, setPreviewing] = useState(null);
  const previewScrollRef = useRef(null);
  const [showEmbeddedProject, setShowEmbeddedProject] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'board'
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState(FALLBACK_MEMBERS);
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false); // public view vs admin edit
  // Hooks must be called unconditionally
  const { notifySystem } = useNotifications();
  const location = useLocation();

  // Load repo-backed catalog projects (always available)
  useEffect(() => {
    try {
      const base = Array.isArray(PROJECTS_CATALOG) ? PROJECTS_CATALOG : [];
      setSavedProjects(base);
    } catch (e) {
      setSavedProjects([]);
    }
  }, []);

  const isCatalogProject = (id) => {
    const base = Array.isArray(PROJECTS_CATALOG) ? PROJECTS_CATALOG : [];
    return base.some((p) => String(p.id) === String(id));
  };

  // If navigated here with a projectId in router state OR ?id= query param, auto-open that project in preview once projects are loaded
  useEffect(() => {
    if (!Array.isArray(savedProjects) || savedProjects.length === 0) return;

    const stateId = location && location.state && location.state.projectId;
    const searchParams = new URLSearchParams((location && location.search) || '');
    const queryId = searchParams.get('id');

    const rawId = stateId || queryId;
    if (!rawId) return;

    const target = savedProjects.find((p) => String(p.id) === String(rawId));
    if (target) {
      setPreviewing(target);
    }
  }, [location, savedProjects]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset embedded project view when preview changes
  useEffect(() => {
    setShowEmbeddedProject(false);
  }, [previewing]);

  // Load team members (fallback + dynamic from localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TEAM_STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      if (Array.isArray(stored) && stored.length > 0) {
        const adminMembers = stored
          .map((m) => ({
            name: m.name,
            role: m.role || '',
            img: m.avatar || 'https://placehold.co/254x240',
            slug: m.slug || '',
          }))
          .filter((m) => m.slug);

        if (adminMembers.length > 0) {
          const bySlug = new Map(FALLBACK_MEMBERS.map((m) => [m.slug, m]));
          adminMembers.forEach((m) => {
            bySlug.set(m.slug, m);
          });
          setTeamMembers(Array.from(bySlug.values()));
        }
      }
    } catch (e) {
      // ignore errors, keep fallback members
      setTeamMembers(FALLBACK_MEMBERS);
    }
  }, []);

  const removeProject = (id) => {
    if (isCatalogProject(id)) {
      notifySystem('Not Editable', 'This project is part of the main catalog and must be changed in the repository.', 'info');
      return;
    }
    notifySystem('Not Editable', 'This site uses a repo-backed catalog. To delete a project, edit src/data/projectsCatalog.js and redeploy.', 'info');
  };

  const openPreview = (project) => {
    if (!project || !project.id) return;
    setPreviewing(project);
  };
  const closePreview = () => setPreviewing(null);

  // Restore preview scroll position when opening
  useEffect(() => {
    if (!previewing) return;
    const key = `dt_preview_scroll_${previewing.id}`;
    const y = Number(localStorage.getItem(key) || 0);
    const el = previewScrollRef.current;
    if (el) {
      setTimeout(() => {
        el.scrollTop = y;
      }, 0);
    }
    return () => {
      if (el) localStorage.setItem(key, String(el.scrollTop));
    };
  }, [previewing]);

  // Export to PDF directly using jsPDF (downloads a .pdf file)
  const exportPDF = (proj) => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

      const marginX = 40;
      const marginTop = 40;
      const lineHeight = 16;
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = pageWidth - marginX * 2;
      let y = marginTop;

      const addWrappedText = (text, options = {}) => {
        const { bold = false } = options;
        const content = text || '-';
        if (bold) {
          doc.setFont(undefined, 'bold');
        }
        const lines = doc.splitTextToSize(content, textWidth);
        doc.text(lines, marginX, y);
        const usedHeight = lines.length * lineHeight;
        y += usedHeight + 6;
        if (bold) {
          doc.setFont(undefined, 'normal');
        }
      };

      const addSection = (label, value, mono = false) => {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(label.toUpperCase(), marginX, y);
        doc.setFont(undefined, 'normal');
        y += lineHeight;

        if (mono) {
          doc.setFont('courier', 'normal');
        }
        doc.setFontSize(10);
        const text = value || '-';
        const lines = doc.splitTextToSize(text, textWidth);
        doc.text(lines, marginX, y);
        const usedHeight = lines.length * lineHeight;
        y += usedHeight + 10;
        if (mono) {
          doc.setFont('helvetica', 'normal');
        }
      };

      // Title
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      addWrappedText(proj.title || 'Untitled Project');

      // Meta
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const metaParts = [proj.category || '', proj.owner || '', proj.status || ''].filter(Boolean);
      if (metaParts.length) {
        addWrappedText(metaParts.join(' • '));
      }

      // Team member
      if (proj.teamMemberFirstName) {
        let teamLine = `Team Member: ${proj.teamMemberFirstName} ${proj.teamMemberLastName || ''}`;
        if (proj.teamMemberRole) teamLine += ` • ${proj.teamMemberRole}`;
        addWrappedText(teamLine);
        if (proj.teamMemberDescription) {
          addWrappedText(proj.teamMemberDescription);
        }
      }

      y += 4;

      // Sections
      addSection('Goal', proj.goal);
      addSection('Structure & Capabilities', proj.structureCapabilities);
      addSection('Key Features', proj.keyFeatures);
      addSection('File Structure', proj.fileStructure, true);
      addSection('Modules', proj.modules);
      addSection('Module Functions', proj.moduleFunctions);
      addSection('Impact & Data', proj.impactData);
      addSection('Problem it Solves', proj.problem);
      addSection('Data Types', proj.dataTypes);
      addSection('Conclusion', proj.conclusion);

      // Footer
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const generatedAt = `Generated ${new Date().toLocaleString()}`;
      const footerY = doc.internal.pageSize.getHeight() - marginTop;
      doc.text(generatedAt, marginX, footerY);

      const safeTitle = (proj.title || 'project').replace(/[^a-z0-9-]+/gi, '_');
      doc.save(`${safeTitle}.pdf`);

      notifySystem(
        'PDF Downloaded',
        `Proposal for "${proj.title || 'Untitled Project'}" has been downloaded as a PDF.`,
        'success'
      );
    } catch (e) {
      alert('Could not export PDF in the browser. Please try again or check console for details.');
      // eslint-disable-next-line no-console
      console.error('Export PDF error', e);
      notifySystem('Export Failed', 'There was a problem generating the PDF. Please check the console for details.', 'error');
    }
  };

  const normalizedQuery = (searchTerm || '').trim().toLowerCase();

  const filteredProjects = normalizedQuery
    ? (Array.isArray(savedProjects) ? savedProjects.filter((p) => {
        const title = (p.title || '').toLowerCase();
        const goal = (p.goal || '').toLowerCase();
        return title.includes(normalizedQuery) || goal.includes(normalizedQuery);
      }) : [])
    : (Array.isArray(savedProjects) ? savedProjects : []);

  const flagshipProjects = filteredProjects.filter((p) => p.projectType === 'flagship');
  const userProjects = filteredProjects.filter((p) => !p.projectType || p.projectType === 'user');

  const filteredMembers = normalizedQuery
    ? (Array.isArray(teamMembers) ? teamMembers.filter((m) => {
        const name = (m.name || '').toLowerCase();
        const role = (m.role || '').toLowerCase();
        return name.includes(normalizedQuery) || role.includes(normalizedQuery);
      }) : [])
    : [];

  return (
    <div
      className={`min-h-screen bg-[#DFDFDF] transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 relative">
        <h1
          className="text-black text-4xl sm:text-5xl md:text-7xl"
          style={{ fontFamily: 'Taygiacs, Poppins, ui-sans-serif', fontWeight: 400, lineHeight: 1 }}
        >
          Projects
        </h1>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center w-full max-w-md bg-white/40 rounded-full shadow-[inset_0_4px_6px_rgba(255,255,255,0.6)] px-5 py-3">
              <input
                type="text"
                placeholder="Search projects & people"
                className="bg-transparent placeholder-black/60 text-black w-full focus:outline-none"
                style={{ fontFamily: 'Poppins, ui-sans-serif', fontSize: 18 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {normalizedQuery && (
              <div className="mt-4 bg-white/70 rounded-2xl px-5 py-4 shadow-sm border border-black/5 max-w-md">
                <div className="text-xs font-semibold tracking-wide uppercase text-black/70" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                  People
                </div>
                {filteredMembers.length === 0 ? (
                  <div className="mt-2 text-xs text-black/60" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                    No team members found.
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-3">
                    {filteredMembers.map((m) => (
                      <Link
                        key={m.slug}
                        to={`/team/${m.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-xs hover:bg-black/90"
                      >
                        <span className="inline-block h-6 w-6 rounded-full bg-white/20" />
                        <span>{m.name}</span>
                        {m.role && <span className="text-white/70">• {m.role}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-end gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-black/70" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Edit mode</span>
                <button
                  type="button"
                  onClick={() => setEditMode((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                    editMode ? 'bg-black border-black' : 'bg-white border-black/30'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      editMode ? 'translate-x-5 bg-white' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {editMode && (
                <>
                  <button
                    onClick={() => notifySystem('Repo Update Required', 'To add a project for everyone, edit src/data/projectsCatalog.js and redeploy.', 'info')}
                    className="shrink-0 rounded-full bg-black text-white px-6 py-3"
                    style={{ fontFamily: 'Poppins, ui-sans-serif', fontSize: 24 }}
                  >
                    Add Project
                  </button>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`rounded-full px-4 py-2 border ${
                        viewMode === 'grid'
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black/20'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('board')}
                      className={`rounded-full px-4 py-2 border ${
                        viewMode === 'board'
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black/20'
                      }`}
                    >
                      Board
                    </button>
                  </div>
                </>
              )}
            </div>

            
          </div>
        </div>

        <div className="mt-6">
          {viewMode === 'grid' || !editMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {flagshipProjects.length > 0 && (
                <div className="col-span-full mb-4">
                  <div
                    className="text-3xl font-semibold tracking-wide text-black"
                    style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                  >
                    FLAGSHIP PROJECTS
                  </div>
                </div>
              )}
              {flagshipProjects.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-2xl bg-white/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.6)' }}
                  onClick={() => openPreview(p)}
                >
                  <div className="h-44 w-full overflow-hidden bg-white/40 flex items-center justify-center text-black/50">
                    {p.image ? (
                      <img src={p.image} alt={p.title || 'project image'} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      'No image'
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-2xl font-bold text-black" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>{p.title}</div>
                      {p.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${p.status==='Completed' ? 'bg-green-100 text-green-700 border-green-200' : p.status==='In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{p.status}</span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-black" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>{p.category}{p.owner ? ` • ${p.owner}` : ''}</div>
                    {p.teamMemberFirstName && (
                      <div className="mt-1 text-xs text-black/70" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>
                        Team Member: {p.teamMemberFirstName} {p.teamMemberLastName || ''}{p.teamMemberRole ? ` • ${p.teamMemberRole}` : ''}
                      </div>
                    )}
                    {p.repoUrl && (
                      <div className="mt-2 flex flex-col gap-1 text-xs">
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline break-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {p.repoUrl}
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (p.repoUrl) window.open(p.repoUrl, '_blank');
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-black text-white px-3 py-1 text-[11px] hover:bg-black/90"
                        >
                          Open in browser
                        </button>
                      </div>
                    )}
                    <p className="mt-3 text-xs text-black" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>{p.goal}</p>
                    {editMode && (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notifySystem('Not Editable', 'This project is part of the main catalog and must be changed in the repository.', 'info');
                          }}
                          className="rounded-full bg-black text-white px-3 py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notifySystem('Not Editable', 'This site uses a repo-backed catalog. To delete a project, edit src/data/projectsCatalog.js and redeploy.', 'info');
                          }}
                          className="rounded-full bg-white text-black border border-black/10 px-3 py-1 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {userProjects.length > 0 && (
                <div className="col-span-full mt-10 mb-4">
                  <div
                    className="text-3xl font-semibold tracking-wide text-black"
                    style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                  >
                    USER ADDED PROJECTS
                  </div>
                </div>
              )}
              {userProjects.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-2xl bg-white/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.6)' }}
                  onClick={() => openPreview(p)}
                >
                  <div className="h-44 w-full overflow-hidden bg-white/40 flex items-center justify-center text-black/50">
                    {p.image ? (
                      <img src={p.image} alt={p.title || 'project image'} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      'No image'
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-2xl font-bold text-black" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>{p.title}</div>
                      {p.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${p.status==='Completed' ? 'bg-green-100 text-green-700 border-green-200' : p.status==='In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{p.status}</span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-black" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>{p.category}{p.owner ? ` • ${p.owner}` : ''}</div>
                    {p.teamMemberFirstName && (
                      <div className="mt-1 text-xs text-black/70" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>
                        Team Member: {p.teamMemberFirstName} {p.teamMemberLastName || ''}{p.teamMemberRole ? ` • ${p.teamMemberRole}` : ''}
                      </div>
                    )}
                    {p.repoUrl && (
                      <div className="mt-2 flex flex-col gap-1 text-xs">
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline break-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {p.repoUrl}
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (p.repoUrl) window.open(p.repoUrl, '_blank');
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-black text-white px-3 py-1 text-[11px] hover:bg-black/90"
                        >
                          Open in browser
                        </button>
                      </div>
                    )}
                    <p className="mt-3 text-xs text-black" style={{ fontFamily: 'Istok Web, Poppins, ui-sans-serif' }}>{p.goal}</p>
                    {editMode && (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notifySystem('Not Editable', 'This project is part of the main catalog and must be changed in the repository.', 'info');
                          }}
                          className="rounded-full bg-black text-white px-3 py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notifySystem('Not Editable', 'This site uses a repo-backed catalog. To delete a project, edit src/data/projectsCatalog.js and redeploy.', 'info');
                          }}
                          className="rounded-full bg-white text-black border border-black/10 px-3 py-1 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {flagshipProjects.length === 0 && userProjects.length === 0 && (
                <div className="mt-4 text-xs text-black/60 col-span-full" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                  No user added projects yet.
                </div>
              )}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Idea', 'In Progress', 'Completed'].map((col) => (
                <div key={col} className="rounded-2xl bg-white/60 backdrop-blur-sm border border-black/10 p-4 min-h-[300px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const id = Number(e.dataTransfer.getData('text/plain'));
                    const proj = (Array.isArray(savedProjects) ? savedProjects.find((x) => x.id === id) : null);
                    if (!proj) return;
                    const updated = (Array.isArray(savedProjects) ? savedProjects.map((x) => x.id === id ? { ...x, status: col } : x) : []);
                    try {
                      localStorage.setItem('dt_projects', JSON.stringify(updated));
                    } catch (err) {
                      alert('Could not update project status because browser storage is full. Try deleting some projects or clearing site data.');
                      return;
                    }
                    setSavedProjects(updated);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-black">{col}</h3>
                    <span className="text-xs text-black/60">{filteredProjects.filter((p) => (p.status || 'Idea') === col).length}</span>
                  </div>
                  <div className="space-y-3">
                    {filteredProjects.filter((p) => (p.status || 'Idea') === col).map((p) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', String(p.id))}
                        onClick={() => openPreview(p)}
                        className="cursor-grab active:cursor-grabbing rounded-xl bg-white border border-black/10 p-3 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-black">{p.title}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{p.category || 'General'}</span>
                        </div>
                        <div className="text-xs text-black/70 mt-1 line-clamp-2">{p.goal}</div>
                        {p.repoUrl && (
                          <div className="text-xs text-black/70 mt-1">
                            <a
                              href={p.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-700 underline break-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {p.repoUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closePreview} />
          <div
            ref={previewScrollRef}
            className="relative z-10 w-[96vw] max-w-6xl max-h-[90vh] bg-white rounded-2xl overflow-y-auto flex flex-col transform transition-transform duration-300 ease-out scale-100"
          >
            <div className="bg-white/95 backdrop-blur border-b border-black/10">
              {previewing.image ? (
                <div className="h-36 sm:h-44 lg:h-48 w-full overflow-hidden bg-black/5">
                  <img src={previewing.image} alt={previewing.title || 'preview image'} className="w-full h-full object-cover" />
                </div>
              ) : null}
              <div className="px-5 py-4 md:px-7 md:py-5 lg:px-8 lg:py-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                  <div className="min-w-0">
                    <h3
                      className="text-2xl sm:text-3xl lg:text-4xl text-black font-semibold break-words"
                      style={{ fontFamily: 'Poppins, ui-sans-serif' }}
                    >
                      {previewing.title}
                    </h3>
                    <div className="text-sm sm:text-base text-black/70 mt-1">
                      {previewing.category}
                      {previewing.owner ? ` • ${previewing.owner}` : ''}
                      {previewing.status ? ` • ${previewing.status}` : ''}
                    </div>
                    {previewing.repoUrl && (
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-3 text-xs sm:text-sm">
                        <a
                          href={previewing.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline break-all"
                        >
                          {previewing.repoUrl}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (previewing.repoUrl) setShowEmbeddedProject(true);
                          }}
                          className="mt-2 sm:mt-0 inline-flex items-center justify-center rounded-full bg-black text-white px-3 py-1 text-[11px] sm:text-xs hover:bg-black/90"
                        >
                          Launch project
                        </button>
                      </div>
                    )}
                    {(previewing.summary || (previewing.goal && previewing.goal.split('\n')[0])) && (
                      <div className="mt-2 text-xs sm:text-sm text-black/80 leading-relaxed">
                        {previewing.summary || previewing.goal.split('\n')[0]}
                      </div>
                    )}
                    {previewing.teamMemberFirstName && (
                      <div className="mt-3 text-sm sm:text-base text-black/80" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                        <span className="font-semibold">Team Member:</span>{' '}
                        {previewing.teamMemberFirstName} {previewing.teamMemberLastName || ''}
                        {previewing.teamMemberRole ? ` • ${previewing.teamMemberRole}` : ''}
                        {previewing.teamMemberDescription && (
                          <div className="mt-2 text-xs sm:text-sm text-black/70 whitespace-pre-wrap leading-relaxed">
                            {previewing.teamMemberDescription}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2 md:gap-3 self-start">
                    <button
                      onClick={() => exportPDF(previewing)}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs sm:text-sm"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={closePreview}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs sm:text-sm"
                    >
                      Back to Projects
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-4 md:px-7 md:pt-5 md:pb-6 lg:px-8 lg:pt-6 lg:pb-7">
              <div className="mb-5 flex flex-wrap gap-2 text-[11px] sm:text-xs" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                <span className="px-3 py-1 rounded-full bg-black/5 text-black/70 border border-black/10">Overview</span>
                <span className="px-3 py-1 rounded-full bg-black/5 text-black/70 border border-black/10">Technical</span>
                <span className="px-3 py-1 rounded-full bg-black/5 text-black/70 border border-black/10">Data</span>
                <span className="px-3 py-1 rounded-full bg-black/5 text-black/70 border border-black/10">Impact</span>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm sm:text-base text-black"
                style={{ fontFamily: 'Poppins, ui-sans-serif' }}
              >
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Goal</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.goal || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Structure & Capabilities</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.structureCapabilities || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Key Features</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.keyFeatures || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">File Structure</div>
                  <div className="mt-2 whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">{previewing.fileStructure || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Modules</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.modules || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Module Functions</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.moduleFunctions || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Impact & Data</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.impactData || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Problem it Solves</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.problem || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Data Types</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.dataTypes || '-'}</div>
                </div>
                <div className="bg-black/2 rounded-xl border border-black/5 p-4">
                  <div className="text-sm sm:text-base font-semibold tracking-wide uppercase text-black/80">Conclusion</div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{previewing.conclusion || '-'}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setPreviewing(null);
                    openEdit(previewing);
                  }}
                  className="rounded-full bg-black text-white px-4 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    removeProject(previewing.id);
                    closePreview();
                  }}
                  className="rounded-full bg-white text-black border border-black/10 px-4 py-2 text-sm"
                >
                  Delete
                </button>
              </div>

              {previewing.repoUrl && showEmbeddedProject && (
                <div className="mt-8">
                  <div className="mb-2 text-xs sm:text-sm text-black/70" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                    Embedded project view
                  </div>
                  <div className="border border-black/10 rounded-xl overflow-hidden h-[400px] sm:h-[500px] bg-black/2">
                    <iframe
                      src={previewing.repoUrl}
                      title={`${previewing.title || 'Project'} view`}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
