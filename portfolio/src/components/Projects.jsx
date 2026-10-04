import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      setError("Unable to load projects.")
      setLoading(false)
      return
    }

    setProjects(data)
    setLoading(false)
  }

  function formatDate(date) {
    if (!date) return ""

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <section className="projects" id="projects">
      <div className="section-heading">
        <p>WHAT I'VE BUILT</p>
        <h2>Projects</h2>
      </div>

      {loading && (
        <p className="projects-status">
          Loading projects...
        </p>
      )}

      {error && (
        <p className="projects-status">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              className={`project-card ${
                project.featured ? "featured-project" : ""
              }`}
              key={project.id}
            >
              <div className="project-top">
                <span className="project-category">
                  {project.category}
                </span>

                {project.featured && (
                  <span className="featured-badge">
                    Featured
                  </span>
                )}
              </div>

              <h3>{project.title}</h3>

              <p>{project.description}</p>

              {/* Technologies */}
              <div className="project-tech">
                {project.technologies?.map((technology) => (
                  <span key={technology}>
                    {technology}
                  </span>
                ))}
              </div>

              {/* Project Date */}
              <div className="project-date">
                <span>📅</span>
                <span>
                  {project.project_year}
                </span>
              </div>

              {/* Project Links */}
              <div className="project-links">

                {project.github_url && (
                  <a
                    href={project.github_url}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo ↗
                  </a>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects