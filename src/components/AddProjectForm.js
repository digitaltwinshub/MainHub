import React, { useEffect, useState } from 'react';

const initialState = {
  id: undefined,
  title: '',
  category: '',
  owner: '',
  repoUrl: '',
  goal: '',
  imageLink: '',
  imageDataUrl: '',
  videoUrl: '',
  status: 'Idea',
  teamMemberFirstName: '',
  teamMemberLastName: '',
  teamMemberRole: '',
  teamMemberDescription: '',
  structureCapabilities: '',
  keyFeatures: '',
  fileStructure: '',
  modules: '',
  moduleFunctions: '',
  impactData: '',
  problem: '',
  dataTypes: '',
  conclusion: '',
  projectType: 'user',
};

export default function AddProjectForm({ initialData, onCancel, onSave }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialState, ...initialData });
    } else {
      const draftRaw = localStorage.getItem('dt_project_draft');
      if (draftRaw) {
        try {
          const draft = JSON.parse(draftRaw);
          setForm({ ...initialState, ...draft });
        } catch {
          setForm(initialState);
        }
      } else {
        setForm(initialState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Debounced autosave for drafts (new project only)
  useEffect(() => {
    if (form.id) return; // don't autosave drafts for existing IDs
    const handle = setTimeout(() => {
      const { imageDataUrl, ...rest } = form;
      try {
        localStorage.setItem('dt_project_draft', JSON.stringify(rest));
      } catch (e) {
        // If quota is exceeded, just skip autosaving silently
        // console.error('Failed to autosave draft', e);
      }
    }, 1500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim() || !form.goal.trim()) {
      alert('Please fill required fields: Project Title, Category, and Goal.');
      return;
    }
    setSaving(true);
    try {
      const image = form.imageDataUrl || form.imageLink || '';
      const { imageDataUrl, ...rest } = form;
      const project = {
        ...rest,
        image,
        id: form.id ?? Date.now(),
        updatedAt: new Date().toISOString(),
      };
      onSave(project);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20';
  const labelCls = 'block text-black/80 mb-2';
  const sectionTitle = 'text-xl md:text-2xl text-black mb-3';

  return (
    <div className="bg-white rounded-2xl max-h-[80vh] overflow-y-auto p-6 md:p-8 w-full">
      <h2 className="text-2xl md:text-3xl text-black" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{form.id ? 'Edit Project' : 'Add Project'}</h2>
      <p className="mt-1 text-black/70">Create a polished record for your project. All fields save locally in your browser.</p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <div>
          <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Media</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label className={labelCls}>Image Link (URL)</label>
              <input
                name="imageLink"
                value={form.imageLink}
                onChange={onChange}
                className={inputCls}
                placeholder="https://... or /images/my-project.jpg"
              />
              <p className="mt-1 text-xs text-black/60">
                Used as the project thumbnail on cards.
              </p>
            </div>
            <div>
              <label className={labelCls}>Or Upload Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setForm((f) => ({ ...f, imageDataUrl: String(reader.result) }));
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {form.imageDataUrl && (
                <img
                  src={form.imageDataUrl}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded-lg border border-black/10"
                />
              )}
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Video URL / path</label>
              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={onChange}
                className={inputCls}
                placeholder="Example: /Featured Projects/My Project Video.mp4 or https://..."
              />
              <p className="mt-1 text-xs text-black/60">
                Used for the Project of the Month video preview and project details.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Project Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Project Title <span className="text-red-500">*</span></label>
              <input name="title" value={form.title} onChange={onChange} className={inputCls} placeholder="Enter project title" />
            </div>
            <div>
              <label className={labelCls}>Category <span className="text-red-500">*</span></label>
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
              <label className={labelCls}>Repository / Link</label>
              <input
                name="repoUrl"
                value={form.repoUrl || ''}
                onChange={onChange}
                className={inputCls}
                placeholder="https://github.com/... or any project link"
              />
            </div>
            <div>
              <label className={labelCls}>Goal <span className="text-red-500">*</span></label>
              <input name="goal" value={form.goal} onChange={onChange} className={inputCls} placeholder="Primary objective" />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={onChange} className={inputCls}>
                <option>Idea</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div className="mt-4 mb-2">
            <label className="block text-lg font-semibold mb-2">
              Add this project to:
            </label>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="projectType"
                  value="flagship"
                  checked={form.projectType === 'flagship'}
                  onChange={() => setForm((f) => ({ ...f, projectType: 'flagship' }))}
                  className="w-4 h-4"
                />
                <span className="text-base">Flagship Projects</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="projectType"
                  value="user"
                  checked={form.projectType === 'user'}
                  onChange={() => setForm((f) => ({ ...f, projectType: 'user' }))}
                  className="w-4 h-4"
                />
                <span className="text-base">User Added Projects</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Team Member</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <textarea name="structureCapabilities" value={form.structureCapabilities} onChange={onChange} className={inputCls} rows={3} placeholder="Describe architecture, components, and capabilities" />
        </div>

        <div>
          <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>Key Features</div>
          <textarea name="keyFeatures" value={form.keyFeatures} onChange={onChange} className={inputCls} rows={3} placeholder="Example: Realtime map overlay, REST API, CI/CD pipeline" />
        </div>

        <div>
          <div className={sectionTitle} style={{ fontFamily: 'Poppins, ui-sans-serif' }}>File Structure</div>
          <textarea name="fileStructure" value={form.fileStructure} onChange={onChange} className={`${inputCls} font-mono`} rows={3} placeholder="Keeps monospace formatting for clarity" />
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

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="rounded-full bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
            {saving ? 'Saving…' : '💾 Save Project'}
          </button>
          <button onClick={onCancel} className="rounded-full bg-white text-black border border-black/10 px-6 py-3 hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
