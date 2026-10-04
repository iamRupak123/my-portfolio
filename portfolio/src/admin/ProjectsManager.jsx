import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function ProjectsManager() {
  const emptyForm = {
    title: "",
    category: "",
    description: "",
    technologies: "",
    github_url: "",
    live_url: "",
    image_url: "",
    project_year: "",
    featured: false,
    status: "Completed",
    display_order: 0,
  }

  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

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
      return
    }

    setProjects(data || [])
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEditForm(project) {
    setEditingId(project.id)

    setForm({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      technologies: project.technologies?.join(", ") || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
      project_year: project.project_year || "",
      featured: project.featured || false,
      status: project.status || "Completed",
      display_order: project.display_order || 0,
    })

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setSaving(true)

    const technologies = form.technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    const projectData = {
      title: form.title,
      category: form.category,
      description: form.description,
      technologies,
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      image_url: form.image_url || null,
      project_year: Number(form.project_year),
      featured: form.featured,
      status: form.status,
      display_order: Number(form.display_order),
    }

    let error

    if (editingId) {
      const result = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingId)

      error = result.error
    } else {
      const result = await supabase
        .from("projects")
        .insert([projectData])

      error = result.error
    }

    if (error) {
      console.error("Error saving project:", error)
      alert(error.message)
      setSaving(false)
      return
    }

    closeForm()
    setSaving(false)

    await fetchProjects()
  }

  async function handleDelete(id, title) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    )

    if (!confirmed) {
      return
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      alert(error.message)
      return
    }

    await fetchProjects()
  }

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>RUPAK</h2>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-nav">

          <a href="/admin/dashboard">
            Dashboard
          </a>

          <a
            href="/admin/dashboard/projects"
            className="active"
          >
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
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = "/admin"
          }}
        >
          Logout
        </button>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <p className="admin-eyebrow">
              PORTFOLIO MANAGEMENT
            </p>

            <h1>Projects</h1>
          </div>

          <button
            className="admin-view-site"
            onClick={
              showForm
                ? closeForm
                : openAddForm
            }
          >
            {showForm ? "Cancel" : "+ Add Project"}
          </button>

        </header>


        {/* FORM */}

        {showForm && (
          <section className="admin-form-card">

            <div className="admin-section-heading">

              <p>
                {editingId
                  ? "EDIT PROJECT"
                  : "NEW PROJECT"}
              </p>

              <h2>
                {editingId
                  ? "Edit Project"
                  : "Add Project"}
              </h2>

            </div>


            <form
              className="admin-project-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                {/* TITLE */}

                <div className="admin-form-group">

                  <label>
                    Project Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Smart Data Cleaner"
                    required
                  />

                </div>


                {/* CATEGORY */}

                <div className="admin-form-group">

                  <label>
                    Category
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Data • Full Stack"
                    required
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="admin-form-group full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your project..."
                    rows="4"
                    required
                  />

                </div>


                {/* TECHNOLOGIES */}

                <div className="admin-form-group full-width">

                  <label>
                    Technologies
                  </label>

                  <input
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="Python, Flask, Pandas, PostgreSQL"
                  />

                  <small>
                    Separate technologies with commas
                  </small>

                </div>


                {/* GITHUB */}

                <div className="admin-form-group">

                  <label>
                    GitHub URL
                  </label>

                  <input
                    name="github_url"
                    type="url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />

                </div>


                {/* LIVE */}

                <div className="admin-form-group">

                  <label>
                    Live Demo URL
                  </label>

                  <input
                    name="live_url"
                    type="url"
                    value={form.live_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </div>


                {/* IMAGE */}

                <div className="admin-form-group">

                  <label>
                    Image URL
                  </label>

                  <input
                    name="image_url"
                    type="url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </div>


                {/* YEAR */}

                <div className="admin-form-group">

                  <label>
                    Project Year
                  </label>

                  <input
                    name="project_year"
                    type="number"
                    value={form.project_year}
                    onChange={handleChange}
                    placeholder="2026"
                    required
                  />

                </div>


                {/* STATUS */}

                <div className="admin-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Planned">
                      Planned
                    </option>

                  </select>

                </div>


                {/* ORDER */}

                <div className="admin-form-group">

                  <label>
                    Display Order
                  </label>

                  <input
                    name="display_order"
                    type="number"
                    value={form.display_order}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* FEATURED */}

              <label className="admin-checkbox">

                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />

                <span>
                  Featured Project
                </span>

              </label>


              {/* BUTTONS */}

              <div className="admin-form-buttons">

                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Save Project"}
                </button>

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}


        {/* PROJECT LIST */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <p>
              YOUR WORK
            </p>

            <h2>
              Projects ({projects.length})
            </h2>

          </div>


          <div className="admin-project-list">

            {projects.map((project) => (

              <div
                className="admin-project-card"
                key={project.id}
              >

                <div>

                  <div className="admin-project-meta">

                    <span className="project-category">
                      {project.category}
                    </span>

                    {project.featured && (
                      <span className="featured-badge">
                        Featured
                      </span>
                    )}

                  </div>


                  <h3>
                    {project.title}
                  </h3>


                  <p>
                    {project.description}
                  </p>


                  <small>
                    Year: {project.project_year}
                    {" • "}
                    Order: {project.display_order}
                  </small>

                </div>


                <div className="admin-project-actions">

                  <button
                    onClick={() =>
                      openEditForm(project)
                    }
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(
                        project.id,
                        project.title
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default ProjectsManager