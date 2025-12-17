# MainHub — Digital Twins Hub

A web-based **Digital Twins Projects Hub** for showcasing digital twin projects, learning resources, and team information, with an optional AI chat assistant.

## Overview
This repository contains a React single-page application (SPA) styled with Tailwind CSS. It also includes a small Express chat API (`server/index.js`) used by the in-app assistant.

## Key Features
- **Home**: Digital Twins Hub landing page
- **Projects**
  - Browse projects
  - View project details
  - Add a project
- **Learning Hub**: Learning resources and tutorials
- **Team**: Team listing and per-member pages
- **Contact**: Contact page
- **Chat Assistant**
  - Calls a local Express endpoint (`/api/chat`)
  - Uses OpenAI when `OPENAI_API_KEY` is set
  - Falls back to a local response if no API key is configured

## Tech Stack
- **Frontend**: React 18, React Router, Create React App (`react-scripts`)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Backend (chat API)**: Express, CORS, dotenv
- **AI Provider (optional)**: OpenAI Node SDK

## Project Structure
- `src/` — React application code (pages, components, context)
- `public/` — Static assets
- `server/index.js` — Express chat server (`POST /api/chat`)

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm

### Install
```bash
npm install
```

### Run the Frontend
```bash
npm start
```
Then open:
- http://localhost:3000

### Run the Chat Server (optional)
The chat API is implemented in `server/index.js`.

1) Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=your_key_here
PORT=5001
```

2) Start the server (in a second terminal):
```bash
node server/index.js
```

Notes:
- `server/index.js` uses **ES module** imports (`import ... from ...`). If Node complains about ESM, configure one of the following:
  - Add `"type": "module"` to `package.json`, or
  - Rename `server/index.js` to `server/index.mjs`.

### Chat Endpoint
- **URL**: `POST /api/chat`
- **Body** (JSON):
  - `question` (string)
  - `projects` (array, optional)

## Environment Variables
- `OPENAI_API_KEY` — Enables OpenAI responses in the chat assistant (optional)
- `PORT` or `CHAT_PORT` — Port for the chat server (defaults to `5001`)

## Security
- Do **not** commit `.env` files or API keys.

## Deployment
The frontend can be deployed anywhere Create React App builds are supported.

```bash
npm run build
```
Output will be in `build/`.

If you deploy the chat server separately, ensure the frontend is configured to call the correct API base URL.

## Repository
Target remote:
- https://github.com/digitaltwinshub/MainHub.git
