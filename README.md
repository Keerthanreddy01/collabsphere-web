<div align="center">
  <br />
    <a href="https://collabsphereweb.vercel.app" target="_blank">
      <img src="https://raw.githubusercontent.com/Keerthanreddy01/collabsphere-web/main/public/icon.svg" alt="CollabSphere Logo" width="100" height="100">
    </a>
  <br />

  <h1>🚀 CollabSphere</h1>
  
  <p>
    <strong>Where developers find teammates, build projects, and grow together.</strong>
  </p>

  <p>
    <a href="https://collabsphereweb.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <a href="https://github.com/Keerthanreddy01/collabsphere-web/stargazers"><img src="https://img.shields.io/github/stars/Keerthanreddy01/collabsphere-web?style=for-the-badge&color=yellow" alt="Stars" /></a>
    <a href="https://github.com/Keerthanreddy01/collabsphere-web/issues"><img src="https://img.shields.io/github/issues/Keerthanreddy01/collabsphere-web?style=for-the-badge&color=red" alt="Issues" /></a>
    <a href="https://github.com/Keerthanreddy01/collabsphere-web/pulls"><img src="https://img.shields.io/github/issues-pr/Keerthanreddy01/collabsphere-web?style=for-the-badge&color=blue" alt="Pull Requests" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  </p>
</div>

<br />

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🌐 About the Project

**CollabSphere** is a modern, community-driven platform designed to connect developers, designers, and tech enthusiasts. Whether you are looking for a co-founder, a team for an upcoming hackathon, or just want to showcase your latest side project, CollabSphere provides the perfect ecosystem to network and collaborate.

## ✨ Features

- **🔥 Real-Time Feed:** Stay updated with community posts, project launches, and discussions.
- **👥 Developer Profiles:** Showcase your skills, tech stack, and GitHub statistics.
- **💬 Interactive Discussions:** Comment, like, and engage with other builders.
- **🏗️ Project Showcases:** Launch your projects and gather feedback from peers.
- **🏆 Hackathon Teambuilding:** Easily find and form teams for global hackathons.
- **🔍 Advanced Filtering:** Search for developers by tech stack, role, or availability.

## 🛠️ Tech Stack

CollabSphere is built with cutting-edge technologies to ensure performance, scalability, and an exceptional developer experience.

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Framework:** [Express.js 4](https://expressjs.com/) & Node.js
- **Database & Auth:** [Firebase v12](https://firebase.google.com/) (Firestore & Admin SDK)
- **Validation:** [Zod](https://zod.dev/)

## 📂 Project Structure

CollabSphere is structured as a monorepo containing both the Next.js frontend and Express backend.
For a detailed breakdown of the architecture, see the [Project Structure Guide](PROJECT_STRUCTURE.md).

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18+)
- npm or yarn or pnpm
- A Firebase project (for Auth & Firestore)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Keerthanreddy01/collabsphere-web.git
   cd collabsphere-web
   ```

2. **Setup the Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   ```
   > Fill in `.env.local` with your Firebase Web SDK credentials.
   
   Start the frontend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Backend**
   ```bash
   cd ../backend
   npm install
   cp .env.example .env
   ```
   > Fill in `.env` with your Firebase Service Account credentials.
   
   Start the backend development server:
   ```bash
   npm run dev
   ```

## 🗺️ Roadmap

- [x] Initial Release
- [x] User Authentication
- [x] Developer Profiles & Portfolios
- [x] Project Showcase
- [ ] Direct Messaging
- [ ] In-App Notifications
- [ ] Integration with GitHub API to pull pinned repos
- [ ] Mobile App Release

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

> **Looking for a place to start?**
> Check out the issues labeled [`good first issue`](https://github.com/Keerthanreddy01/collabsphere-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 🚀

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📫 Contact

Project Link: [https://github.com/Keerthanreddy01/collabsphere-web](https://github.com/Keerthanreddy01/collabsphere-web)
