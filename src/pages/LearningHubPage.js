import React, { useState } from 'react';

const LearningHubPage = () => {
  const [editMode, setEditMode] = useState(false); // view vs future edit
  return (
    <div className="space-y-10 relative">
      {/* Subtle animated gradient background for the page */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 bottom-0 -z-10 opacity-50">
        <div className="h-full w-full bg-gradient-to-br from-sky-200/40 via-emerald-200/40 to-purple-200/40 blur-3xl animate-pulse" />
      </div>

      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h1
            className="text-3xl md:text-4xl font-semibold text-gray-900 transition-all duration-700 ease-out"
            style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
          >
            Learning Hub
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              Edit mode
            </span>
            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                editMode ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'
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
        <p
          className="text-gray-600 max-w-2xl transition-all duration-700 ease-out delay-100"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
        >
          Your educational / research space for Digital Twins: learn concepts, follow tutorials, and design projects.
        </p>
      </header>

      {/* Subpages overview */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
            Courses / Workshops
          </h2>
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            Organize short courses or workshops on digital twins, data, and tools for your class or lab.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            <li>1-week bootcamp: Intro to Digital Twins.</li>
            <li>Studio workshop: From GIS data to 3D twin.</li>
            <li>Guest lecture series with industry partners.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
            Video lessons
          </h2>
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            Curate or embed video explainers that walk through core ideas and example digital twin builds.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            <li>"What is a Digital Twin?" concept video.</li>
            <li>Screen-recorded tutorial building a campus energy map.</li>
            <li>Walkthrough of a full student project presentation.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
            Step-by-step tutorials
          </h2>
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            Build guided tutorials that students can follow at their own pace, from data import to dashboards.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            <li>Importing open data into QGIS and cleaning it.</li>
            <li>Connecting a live sensor feed to a simple dashboard.</li>
            <li>Publishing a web map of a neighborhood twin.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
            Hands-on labs
          </h2>
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            Design labs where students work with real geospatial or sensor data to prototype digital twins.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            <li>Lab: Measure and map temperatures across a campus.</li>
            <li>Lab: Build a small traffic flow simulation for one street.</li>
            <li>Lab: Compare baseline vs. retrofitted building energy.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
            Student project templates
          </h2>
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            Provide structured templates for student projects, including goals, data sources, and evaluation.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            <li>Template: Building energy and comfort twin.</li>
            <li>Template: Public space usage and mobility twin.</li>
            <li>Template: Environmental monitoring twin for air or water.</li>
          </ul>
        </div>
      </section>

      {/* Tutorial pathways */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
          Tutorial Pathways
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              GIS Basics
            </h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              Learn how maps, layers, and spatial data work so you can bring real-world geography into your twins.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
              <li>Reading shapefiles and GeoJSON.</li>
              <li>Understanding coordinate systems.</li>
              <li>Making your first styled map of a campus.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              Python for geospatial
            </h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              Use Python libraries (like GeoPandas and raster tools) to clean, join, and analyze spatial datasets.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
              <li>Intro notebook: loading and plotting spatial data.</li>
              <li>Joining census and boundary data for a city.</li>
              <li>Simple spatial queries (buffers, intersections).</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              Digital Twin fundamentals
            </h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              Connect data, models, and visualization to create twins of buildings, campuses, or cities.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
              <li>Conceptual model: physical system → data → virtual model.</li>
              <li>Examples of twins at different scales (room, building, city).</li>
              <li>How to scope a realistic student twin project.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              AI for environmental modeling
            </h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              Apply machine learning to forecast energy use, emissions, or environmental indicators in your twins.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
              <li>Predicting hourly energy consumption from weather data.</li>
              <li>Training a simple air quality prediction model.</li>
              <li>Comparing baseline vs. intervention scenarios with AI.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tutorials & Example Projects */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
          Tutorials & Example Projects
        </h2>
        <p
          className="text-gray-600 text-sm max-w-2xl"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
        >
          Random examples from the projects hub that you can study, clone, or adapt.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[
            {
              id: 'tut-1',
              title: 'Campus Building Energy Twin Starter',
              category: 'Starter Project',
              goal: 'Template with sample plans, load profiles, and a simple dashboard.',
            },
            {
              id: 'tut-2',
              title: 'How We Built This Twin',
              category: 'Case Study',
              goal: 'Walkthrough of modeling workflow, data pipeline, and visualization stack.',
            },
            {
              id: 'tut-3',
              title: 'Mobility Twin Notebook',
              category: 'Starter Project',
              goal: 'Notebook showing how to pull GTFS data and generate accessibility maps.',
            },
            {
              id: 'tut-4',
              title: 'Studio Workflow: From Rhino to Game Engine',
              category: 'Case Study',
              goal: 'Guide to exporting, optimizing, and lighting architectural models.',
            },
          ].map((proj) => (
            <div key={proj.id} className="rounded-2xl bg-white border border-gray-200 p-5 flex flex-col gap-3 shadow-sm">
              <span
                className="inline-flex items-center text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-gray-900 text-white"
                style={{ fontFamily: 'Poppins, ui-sans-serif' }}
              >
                {proj.category || 'Example Project'}
              </span>
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                {proj.title || 'Untitled Project'}
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
                {proj.goal || 'An example from the Digital Twins project collection.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Assignments & exercises */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
          Assignments & Exercises
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            Collect assignment prompts and practice exercises that align with your courses and research projects.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Short data exploration tasks using local or open data.</li>
            <li>Mini-projects that build specific pieces of a digital twin (e.g., sensor dashboard).</li>
            <li>Reflection questions about ethics, equity, and real-world impact of digital twins.</li>
          </ul>
          <p className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            You can expand each item into a full assignment page later, or link directly to your LMS.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LearningHubPage;
