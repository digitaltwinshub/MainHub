export const PROJECTS_CATALOG = [
  {
    id: 1,
    title: 'Jira Digital Twin',
    category: 'Computer Science',
    owner: 'Internal',
    repoUrl: '',
    goal: 'A flagship twin of our Jira workflows, showcasing how project management systems can be modeled as digital twins for portfolio visibility.',
    image: '',
    status: 'In Progress',
    projectType: 'flagship',
  },
  {
    id: 2,
    title: 'USGBC Engagement Twin',
    category: 'Computer Science',
    owner: 'Mario',
    teamMemberFirstName: 'Mario',
    teamMemberLastName: '',
    teamMemberRole: 'Software Engineer',
    repoUrl: 'https://siromidahmadi.github.io/USGBC-/',
    goal: 'A reference twin for USGBC-style engagement data, visualizing projects, certifications, and performance insights in one hub.',
    image: '',
    status: 'Idea',
    projectType: 'flagship',
  },
  {
    id: 3,
    title: 'Alpha Earth Sandbox',
    category: 'Architecture',
    owner: 'Lab',
    repoUrl: '',
    goal: 'An experimental sandbox twin where new structures, modules, and data types can be prototyped before going live.',
    image: '',
    status: 'Idea',
    projectType: 'flagship',
  },
  {
    id: 4,
    title: 'Baldwin Hills 6-Mile Corridor Digital Twin',
    category: 'Architecture',
    owner: 'Omid Ahmadi',
    teamMemberFirstName: 'Omid',
    teamMemberLastName: 'Ahmadi',
    teamMemberRole: 'Software Engineer',
    repoUrl: 'https://digitaltwinshub.github.io/Baldwin/',
    goal: 'The goal of the Baldwin Hills 6-Mile Corridor Digital Twin is to provide an accessible, data-driven platform that visualizes environmental, infrastructure, and community conditions along the corridor. The project aims to bridge the gap between technical urban data and public understanding, enabling planners, students, and community members to explore risks, opportunities, and impacts in a clear, interactive way that supports informed decision-making and equitable planning.',
    image: '',
    status: 'In Progress',
    projectType: 'flagship',
  },
  {
    id: 1001,
    title: 'User Project',
    category: 'Architecture',
    owner: 'You',
    repoUrl: '',
    goal: 'A starter user project that demonstrates how to describe goals, structure, and modules for your own digital twin.',
    image: '',
    status: 'Idea',
    projectType: 'user',
  },
];

export function getAllProjects() {
  return PROJECTS_CATALOG;
}

export function getProjectById(id) {
  return PROJECTS_CATALOG.find((p) => String(p.id) === String(id)) || null;
}
