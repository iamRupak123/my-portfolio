import "./App.css"

import Hero from "./Components/Hero"
import Navbar from "./components/Navbar"
import About from "./components/About"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Achievements from "./components/Achievement"
import Education from "./components/Education"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import RupakAI from "./components/RupakAI"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminProtectedRoute from "./admin/AdminProtectedRoute"
import ProjectsManager from "./admin/ProjectsManager"
import AchievementsManager from "./admin/AchievementsManager"
import SkillsManager from "./admin/SkillsManager"
import ResumeManager from "./admin/ResumeManager"

function Portfolio() {
  return (
    <>
      <Navbar />

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Education />
      <Contact />

      <Footer />

      <RupakAI />
    </>
  )
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Portfolio */}
        <Route
          path="/"
          element={<Portfolio />}
        />

        {/* Admin Login */}
        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
            path="/admin/dashboard/projects"
            element={
                <AdminProtectedRoute>
                  <ProjectsManager />
                </AdminProtectedRoute>
              }
          />
        <Route
          path="/admin/dashboard/achievements"
          element={
            <AdminProtectedRoute>
              <AchievementsManager />
            </AdminProtectedRoute>
          }
        />


        <Route
          path="/admin/dashboard/skills"
          element={
            <AdminProtectedRoute>
              <SkillsManager />
            </AdminProtectedRoute>
          }
        />


        <Route
          path="/admin/dashboard/resume"
          element={
            <AdminProtectedRoute>
              <ResumeManager />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}


export default App