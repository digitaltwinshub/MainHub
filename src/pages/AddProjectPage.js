import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const initialState = {
  title: '',
  category: '',
  owner: '',
  goal: '',
  teamMemberFirstName: '',
  teamMemberLastName: '',
  teamMemberRole: '',
  teamMemberDescription: '',
  structureCapabilities: '',
  keyFeatures: '',
  fileStructure: '',
  modules: '',
  moduleFunctions: '',
  problem: '',
  dataTypes: '',
  impactData: '',
  conclusion: '',
};

export default function AddProjectPage() {
  const [form, setForm] = useState(initialState);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { notifyProjectAdded, notifySystem } = useNotifications();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const saveProject = () => {
    if (!form.title.trim() || !form.category.trim() || !form.goal.trim()) {
      notifySystem('Validation Error', 'Please fill required fields: Project Title, Category, and Goal.', 'error');
      return;
    }
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem('dt_projects') || '[]');
    } catch {
      stored = [];
    }
    const project = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('dt_projects', JSON.stringify([project, ...stored]));
    } catch (e) {
      notifySystem('Storage Full', 'Could not save project because browser storage is full. Try deleting some projects or clearing site data.', 'error');
      return;
    }

    // Also auto-create/update a team member card when team member info is provided
    if (form.teamMemberFirstName && form.teamMemberFirstName.trim()) {
      const first = form.teamMemberFirstName.trim();
      const last = (form.teamMemberLastName || '').trim();
      const name = [first, last].filter(Boolean).join(' ');
      const slugBase = [first, last].filter(Boolean).join('-').toLowerCase();
      const slug = slugBase || first.toLowerCase();
      try {
        const raw = localStorage.getItem('dt_team_members') || '[]';
        const existing = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
        const idx = existing.findIndex((m) => m.slug === slug);
        const member = {
          slug,
          name,
          role: form.teamMemberRole || '',
          bio: form.teamMemberDescription || '',
          avatar: '',
        };
        if (idx >= 0) {
          existing[idx] = { ...existing[idx], ...member };
        } else {
          existing.push(member);
        }
        localStorage.setItem('dt_team_members', JSON.stringify(existing));
      } catch {
        // ignore team-member save errors; project is already saved
      }
    }
    setSaved(true);
    
    // Send notification
    notifyProjectAdded(form.title);
    
    // Show success message and navigate
    setTimeout(() => {
      setSaved(false);
      navigate('/projects');
    }, 2000);
  };

  const inputCls = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20';
  const labelCls = 'block text-black/80 mb-2';
  const sectionTitle = 'text-2xl md:text-3xl text-black mb-4';
  const requiredMark = <span className="text-red-500">*</span>;

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl text-black" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Add Project</h1>
        <p className="mt-2 text-black/70">Create a polished record for your project. All fields save locally in your browser.</p>

        <div className="mt-10 grid grid-cols-1 gap-8">
          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Project Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Project Title {requiredMark}</label>
                <input name="title" value={form.title} onChange={onChange} className={inputCls} placeholder="Enter project title" />
              </div>
              <div>
                <label className={labelCls}>Category {requiredMark}</label>
                <select name="category" value={form.category} onChange={onChange} className={inputCls}>
                  <option value="">Select…</option>
                  <option>Computer Science</option>
                  <option>Architecture</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Owner</label>
                <input name="owner" value={form.owner} onChange={onChange} className={inputCls} placeholder="Name or team" />
              </div>
              <div>
                <label className={labelCls}>Goal {requiredMark}</label>
                <input name="goal" value={form.goal} onChange={onChange} className={inputCls} placeholder="Primary objective" />
              </div>
            </div>
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Team Member</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  name="teamMemberFirstName"
                  value={form.teamMemberFirstName}
                  onChange={onChange}
                  className={inputCls}
                  placeholder="First name"
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  name="teamMemberLastName"
                  value={form.teamMemberLastName}
                  onChange={onChange}
                  className={inputCls}
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <input
                  name="teamMemberRole"
                  value={form.teamMemberRole}
                  onChange={onChange}
                  className={inputCls}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Short Description</label>
                <textarea
                  name="teamMemberDescription"
                  value={form.teamMemberDescription}
                  onChange={onChange}
                  className={inputCls}
                  rows={3}
                  placeholder="Brief bio or responsibilities"
                />
              </div>
            </div>
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Structure & Capabilities</div>
            <textarea name="structureCapabilities" value={form.structureCapabilities} onChange={onChange} className={inputCls} rows={4} placeholder="Describe architecture, components, and capabilities" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Key Features</div>
            <textarea name="keyFeatures" value={form.keyFeatures} onChange={onChange} className={inputCls} rows={4} placeholder="Example: Realtime map overlay, REST API, CI/CD pipeline" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>File Structure</div>
            <textarea name="fileStructure" value={form.fileStructure} onChange={onChange} className={`${inputCls} font-mono`} rows={4} placeholder="Keeps monospace formatting for clarity" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Modules</div>
            <textarea name="modules" value={form.modules} onChange={onChange} className={inputCls} rows={3} placeholder="Example: Ingest | Fetch feeds | GeoJSON, CSV | Normalize formats" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Module Functions</div>
            <textarea name="moduleFunctions" value={form.moduleFunctions} onChange={onChange} className={inputCls} rows={3} placeholder="Key functions per module" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Impact & Data</div>
            <textarea name="impactData" value={form.impactData} onChange={onChange} className={inputCls} rows={3} placeholder="Expected impact and data sources" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Problem it Solves</div>
            <textarea name="problem" value={form.problem} onChange={onChange} className={inputCls} rows={3} placeholder="What problem does this project solve?" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Data Types</div>
            <textarea name="dataTypes" value={form.dataTypes} onChange={onChange} className={inputCls} rows={3} placeholder="Data formats and schemas" />
          </div>

          <div>
            <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Conclusion</div>
            <textarea name="conclusion" value={form.conclusion} onChange={onChange} className={inputCls} rows={3} placeholder="Summary and next steps" />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={saveProject} className="rounded-full bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
              💾 Save Project
            </button>
            {saved && <span className="text-green-600">Saved locally</span>}
            <button onClick={() => navigate(-1)} className="rounded-full bg-white text-black border border-black/10 px-6 py-3 hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
