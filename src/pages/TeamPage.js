import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TEAM_STORAGE_KEY = 'dt_team_members';

const FALLBACK_MEMBERS = [
  { name: 'Meri Sargsian', role: 'ShadeLA ProjectHUB', img: 'https://placehold.co/254x240', slug: 'meri-sargsian' },
  { name: 'Omid Ahmadi', role: 'Software Engineer', img: `${process.env.PUBLIC_URL}/Team%20Members/Omid-Ahmadi.jpg.jpeg`, slug: 'omid-ahmadi' },
  { name: 'Priya N', role: 'Systems', img: 'https://placehold.co/254x240', slug: 'priya-n' },
  { name: 'John Appleseed', role: 'Architecture', img: 'https://placehold.co/254x240', slug: 'john-appleseed' },
];

const TeamPage = () => {
  const filters = ['All', 'Computer Science', 'Architects'];
  const [members, setMembers] = useState(FALLBACK_MEMBERS);
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false); // view vs future edit

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY) || '[]');
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
          setMembers(Array.from(bySlug.values()));
        }
      }
    } catch {
      // ignore errors, keep fallback members
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-neutral-200 transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1
            className="text-black text-3xl sm:text-4xl md:text-6xl"
            style={{ fontFamily: 'Poppins, ui-sans-serif', fontWeight: 400 }}
          >
            Meet Our Team!
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/70" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
              Edit mode
            </span>
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
        </div>

        <div className="mt-10 flex items-center gap-4 justify-center">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`px-6 py-2 rounded-full ${i === 0 ? 'bg-black text-white' : 'bg-white/40 text-black'} shadow-[inset_0_4px_6px_rgba(255,255,255,0.6)]`}
              style={{ fontFamily: 'Poppins, ui-sans-serif', fontSize: 20 }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="w-full bg-black">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((m) => (
            <Link key={m.slug} to={`/team/${m.slug}`} className="block">
              <div className="group relative bg-white/5 rounded-3xl backdrop-blur-[1px] overflow-hidden transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-60 object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <div className="text-white text-2xl" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{m.name}</div>
                  <div className="text-white/60 text-base leading-8" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>{m.role}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
