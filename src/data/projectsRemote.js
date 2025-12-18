export function isSupabaseConfigured() {
  return Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY);
}

function supabaseHeaders() {
  const apiKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function supabaseRestUrl(pathAndQuery) {
  const base = String(process.env.REACT_APP_SUPABASE_URL || '').replace(/\/+$/, '');
  return `${base}/rest/v1/${pathAndQuery}`;
}

export async function fetchRemoteProjects() {
  if (!isSupabaseConfigured()) return [];
  const res = await fetch(supabaseRestUrl('projects?select=*'), {
    method: 'GET',
    headers: supabaseHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch projects: ${res.status} ${text}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchRemoteProjectById(id) {
  if (!isSupabaseConfigured()) return null;
  const encoded = encodeURIComponent(String(id));
  const res = await fetch(supabaseRestUrl(`projects?select=*&id=eq.${encoded}`), {
    method: 'GET',
    headers: supabaseHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch project: ${res.status} ${text}`);
  }
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : null;
  return row || null;
}

export async function upsertRemoteProject(project) {
  if (!isSupabaseConfigured()) return null;
  const payload = {
    ...project,
    id: project && project.id !== undefined && project.id !== null ? project.id : Date.now(),
    updatedAt: new Date().toISOString(),
  };
  const res = await fetch(supabaseRestUrl('projects?on_conflict=id'), {
    method: 'POST',
    headers: {
      ...supabaseHeaders(),
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upsert project: ${res.status} ${text}`);
  }
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : null;
  return row || null;
}
