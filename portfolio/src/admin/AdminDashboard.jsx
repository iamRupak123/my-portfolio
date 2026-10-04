import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [
        projectsResult,
        skillsResult,
        achievementsResult,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("skills")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("achievements")
          .select("*", { count: "exact", head: true }),
      ])

      setStats({
        projects: projectsResult.count || 0,
        skills: skillsResult.count || 0,
        achievements: achievementsResult.count || 0,
      })
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/admin"
  }

  return (
    <div className="admin-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>RUPAK</h2>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-nav">

          <a
            href="/admin/dashboard"
            className="active"
          >
            Dashboard
          </a>

          <a href="/admin/dashboard/projects">
            Projects
          </a>

          <a href="/admin/dashboard/skills">
            Skills
          </a>

          <a href="/admin/dashboard/achievements">
            Achievements
          </a>

          <a href="/admin/dashboard/certificates">
            Certificates
          </a>

          <a href="/admin/dashboard/courses">
            Courses
          </a>

          <a href="/admin/dashboard/education">
            Education
          </a>

          <a href="/admin/dashboard/experience">
            Experience
          </a>

          <a href="/admin/dashboard/resume">
            Resume
          </a>

          <a href="/admin/dashboard/media">
            Media
          </a>

        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-main">

        {/* Header */}

        <header className="admin-header">

          <div>
            <p className="admin-eyebrow">
              PORTFOLIO MANAGEMENT
            </p>

            <h1>Dashboard</h1>
          </div>

          <button
            className="admin-view-site"
            onClick={() => {
              window.location.href = "/"
            }}
          >
            View Portfolio ↗
          </button>

        </header>


        {/* =========================
            STATISTICS
        ========================= */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span>PROJECTS</span>

            <strong>
              {loading ? "..." : stats.projects}
            </strong>

            <p>Total projects</p>
          </div>


          <div className="admin-stat-card">
            <span>SKILLS</span>

            <strong>
              {loading ? "..." : stats.skills}
            </strong>

            <p>Total skills</p>
          </div>


          <div className="admin-stat-card">
            <span>ACHIEVEMENTS</span>

            <strong>
              {loading ? "..." : stats.achievements}
            </strong>

            <p>Total achievements</p>
          </div>

        </section>


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p>MANAGEMENT</p>
              <h2>Quick Actions</h2>
            </div>

          </div>


          <div className="admin-quick-grid">

            <a href="/admin/dashboard/projects">

              <span>+</span>

              <h3>Add Project</h3>

              <p>
                Create a new portfolio project
              </p>

            </a>


            <a href="/admin/dashboard/skills">

              <span>+</span>

              <h3>Add Skill</h3>

              <p>
                Add a new technical skill
              </p>

            </a>


            <a href="/admin/dashboard/achievements">

              <span>+</span>

              <h3>Add Achievement</h3>

              <p>
                Add a new milestone
              </p>

            </a>


            <a href="/admin/dashboard/certificates">

              <span>+</span>

              <h3>Add Certificate</h3>

              <p>
                Add a new certification
              </p>

            </a>

          </div>

        </section>


        {/* =========================
            SYSTEM STATUS
        ========================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p>SYSTEM</p>
              <h2>Portfolio Status</h2>
            </div>

          </div>


          <div className="admin-status-card">

            <div className="status-indicator"></div>

            <div>

              <h3>
                Portfolio Connected
              </h3>

              <p>
                Your portfolio is connected to
                Supabase and content can be managed
                dynamically.
              </p>

            </div>

            <span className="status-online">
              ONLINE
            </span>

          </div>

        </section>

      </main>

    </div>
  )
}

export default AdminDashboard