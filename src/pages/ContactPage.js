import React, { useEffect, useRef, useState } from 'react';

const ContactPage = () => {
  const [missionInView, setMissionInView] = useState(false);
  const missionTitleRef = useRef(null);

  useEffect(() => {
    if (!missionTitleRef.current) return;

    const el = missionTitleRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMissionInView(true);
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

  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-black text-5xl md:text-6xl" style={{ fontFamily: 'Poppins, ui-sans-serif', fontWeight: 400 }}>Contact</h1>
        <p className="mt-4 text-black/80 text-lg" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
          Reach out to the coordinators for access, feedback, or publishing your project.
        </p>

        <div className="mt-8 space-y-4 text-black" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
          <div>
            <span className="font-semibold">Email:</span> team@alphaearth.example
          </div>
          <div>
            <span className="font-semibold">Slack:</span> Digital Twins Fellowship
          </div>
          <div>
            <span className="font-semibold">Discord:</span>{' '}
            <a className="underline text-blue-700" href="https://discord.gg/nu6Vmjgd" target="_blank" rel="noreferrer">
              https://discord.gg/nu6Vmjgd
            </a>
          </div>
          <div>
            <span className="font-semibold">Maintainers:</span> Project Office
          </div>
          <div>
            <span className="font-semibold">Location:</span> Los Angeles Trade Technical-College
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <section className="w-full bg-[#EFEFEF]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <h2
            ref={missionTitleRef}
            className={`text-center text-black leading-tight transition-all duration-700 ease-out ${
              missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: 'Poppins, ui-sans-serif', fontWeight: 400, fontSize: 96, lineHeight: 1.05 }}
          >
            Our Mission
          </h2>
          <p
            className="mt-10 mx-auto text-center text-black"
            style={{ fontFamily: 'Poppins, ui-sans-serif', fontWeight: 400, fontSize: 24, maxWidth: 966 }}
          >
            Our mission is to empower creators, students, and innovators by providing a unified digital space where ideas can grow into impactful projects. We aim to make collaboration seamless, project tracking transparent, and innovation accessible to everyone. By supporting diverse content—from code and AI models to 3D designs and research data—we strive to inspire cross-disciplinary learning and foster a community where knowledge is shared, creativity thrives, and every project has the tools it needs to succeed.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
