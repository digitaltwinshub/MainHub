import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DigitalTwinsHub from './pages/DigitalTwinsHub';
import Navbar from './components/Navbar';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import TeamMemberPage from './pages/TeamMemberPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AddProjectPage from './pages/AddProjectPage';
import ContactPage from './pages/ContactPage';
import LearningHubPage from './pages/LearningHubPage';
import { NotificationProvider } from './context/NotificationContext';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DigitalTwinsHub />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team/:slug" element={<TeamMemberPage />} />
            <Route path="/add-project" element={<AddProjectPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/learning-hub" element={<LearningHubPage />} />
          </Routes>
        </main>
        <ChatAssistant />
      </div>
    </NotificationProvider>
  );
}

export default App;
