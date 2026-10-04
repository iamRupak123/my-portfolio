import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

function AchievementsManager() {
  const navigate = useNavigate()

  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)

  const [form, setForm] = useState({
    title: "",
    organization: "",
    description: "",
    achievement_year: "",
    type: "Achievement",
    score: "",
    image_url: "",
    credential_url: "",
    featured: false,
    display_order: 0,
  })

  useEffect(() => {
    fetchAchievements()
  }, [])

  // =========================
  // FETCH
  // =========================

  async function fetchAchievements() {
    setLoading(true)

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order", {
        ascending: true,
      })

    if (error) {
      console.error("Error fetching achievements:", error)
      alert("Failed to load achievements.")
    } else {
      setAchievements(data || [])
    }

    setLoading(false)
  }

  // =========================
  // FORM
  // =========================

  function openAddForm() {
    setEditingAchievement(null)

    setForm({
      title: "",
      organization: "",
      description: "",
      achievement_year: "",
      type: "Achievement",
      score: "",
      image_url: "",
      credential_url: "",
      featured: false,
      display_order: achievements.length + 1,
    })

    setShowForm(true)
  }

  function openEditForm(achievement) {
    setEditingAchievement(achievement)

    setForm({
      title: achievement.title || "",
      organization: achievement.organization || "",
      description: achievement.description || "",
      achievement_year: achievement.achievement_year || "",
      type: achievement.type || "Achievement",
      score: achievement.score || "",
      image_url: achievement.image_url || "",
      credential_url: achievement.credential_url || "",
      featured: achievement.featured || false,
      display_order: achievement.display_order || 0,
    })

    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingAchievement(null)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // =========================
  // ADD / UPDATE
  // =========================

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim()) {
      alert("Achievement title is required.")
      return
    }

    if (!form.organization.trim()) {
      alert("Organization is required.")
      return
    }

    const achievementData = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      description: form.description.trim(),
      achievement_year: form.achievement_year
        ? Number(form.achievement_year)
        : null,
      type: form.type.trim(),
      score: form.score.trim(),
      image_url: form.image_url.trim(),
      credential_url: form.credential_url.trim(),
      featured: form.featured,
      display_order: Number(form.display_order) || 0,
    }

    if (editingAchievement) {
      const { error } = await supabase
        .from("achievements")
        .update(achievementData)
        .eq("id", editingAchievement.id)

      if (error) {
        console.error(error)
        alert("Failed to update achievement.")
        return
      }

      alert("Achievement updated successfully.")
    } else {
      const { error } = await supabase
        .from("achievements")
        .insert([achievementData])

      if (error) {
        console.error(error)
        alert("Failed to add achievement.")
        return
      }

      alert("Achievement added successfully.")
    }

    closeForm()
    fetchAchievements()
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this achievement?"
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      alert("Failed to delete achievement.")
      return
    }

    alert("Achievement deleted successfully.")

    fetchAchievements()
  }

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    await supabase.auth.signOut()

    window.location.href = "/admin"
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <div className="admin-logo-circle">
            RG
          </div>

          <div>
            <h2>Rupak</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">

          <a href="/admin/dashboard">
            Dashboard
          </a>

          <a href="/admin/dashboard/projects">
            Projects
          </a>
          <a href="/admin/dashboard/skills">
            Skills
          </a>

          <a
            href="/admin/dashboard/achievements"
            className="active"
          >
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
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}

      <main className="admin-main">

        <div className="admin-page-header">

          <div>
            <p className="admin-page-label">
              CONTENT MANAGEMENT
            </p>

            <h1>
              Achievements
            </h1>

            <p>
              Manage your achievements and certifications.
            </p>
          </div>

          <button
            className="admin-add-button"
            onClick={openAddForm}
          >
            + Add Achievement
          </button>

        </div>


        {/* FORM */}

        {showForm && (
          <div className="admin-form-card">

            <div className="admin-form-header">

              <h2>
                {editingAchievement
                  ? "Edit Achievement"
                  : "Add Achievement"}
              </h2>

              <button
                className="admin-close-form"
                onClick={closeForm}
              >
                ×
              </button>

            </div>


            <form
              className="admin-content-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="admin-form-group">

                <label>
                  Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="1st Place - Textibition Technical Exhibition"
                  required
                />

              </div>


              {/* ORGANIZATION */}

              <div className="admin-form-group">

                <label>
                  Organization *
                </label>

                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Brainware University"
                  required
                />

              </div>


              {/* TYPE + SCORE */}

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="Achievement">
                      Achievement
                    </option>

                    <option value="Assessment">
                      Assessment
                    </option>

                    <option value="Certification">
                      Certification
                    </option>

                    <option value="Competition">
                      Competition
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>


                <div className="admin-form-group">

                  <label>
                    Score / Grade
                  </label>

                  <input
                    type="text"
                    name="score"
                    value={form.score}
                    onChange={handleChange}
                    placeholder="60.64% / Grade A"
                  />

                </div>

              </div>


              {/* YEAR */}

              <div className="admin-form-group">

                <label>
                  Year
                </label>

                <input
                  type="number"
                  name="achievement_year"
                  value={form.achievement_year}
                  onChange={handleChange}
                  placeholder="2026"
                  min="2000"
                  max="2100"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="admin-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this achievement..."
                  rows="5"
                />

              </div>


              {/* IMAGE URL */}

              <div className="admin-form-group">

                <label>
                  Image URL
                </label>

                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


              {/* CREDENTIAL URL */}

              <div className="admin-form-group">

                <label>
                  Credential URL
                </label>

                <input
                  type="url"
                  name="credential_url"
                  value={form.credential_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


              {/* DISPLAY ORDER */}

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                  />

                </div>


                <div className="admin-form-checkbox">

                  <label>

                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                    />

                    <span>
                      Featured Achievement
                    </span>

                  </label>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-button"
                >
                  {editingAchievement
                    ? "Update Achievement"
                    : "Save Achievement"}
                </button>

              </div>

            </form>

          </div>
        )}


        {/* ACHIEVEMENT LIST */}

        <div className="admin-content-card">

          <div className="admin-content-card-header">

            <div>
              <h2>
                All Achievements
              </h2>

              <p>
                {achievements.length} achievement
                {achievements.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>


          {loading ? (
            <div className="admin-loading">
              Loading achievements...
            </div>
          ) : achievements.length === 0 ? (

            <div className="admin-empty-state">

              <h3>
                No achievements yet
              </h3>

              <p>
                Add your first achievement to get started.
              </p>

              <button
                className="admin-add-button"
                onClick={openAddForm}
              >
                + Add Achievement
              </button>

            </div>

          ) : (

            <div className="admin-achievement-list">

              {achievements.map((achievement) => (

                <div
                  className="admin-achievement-item"
                  key={achievement.id}
                >

                  <div className="admin-achievement-info">

                    <div className="admin-achievement-title-row">

                      <h3>
                        {achievement.title}
                      </h3>

                      {achievement.featured && (
                        <span className="admin-featured-badge">
                          Featured
                        </span>
                      )}

                    </div>

                    <p className="admin-achievement-org">
                      {achievement.organization}
                    </p>

                    <div className="admin-achievement-meta">

                      {achievement.type && (
                        <span>
                          {achievement.type}
                        </span>
                      )}

                      {achievement.achievement_year && (
                        <span>
                          {achievement.achievement_year}
                        </span>
                      )}

                      {achievement.score && (
                        <span>
                          {achievement.score}
                        </span>
                      )}

                    </div>

                    {achievement.description && (
                      <p className="admin-achievement-description">
                        {achievement.description}
                      </p>
                    )}

                  </div>


                  <div className="admin-item-actions">

                    <button
                      className="admin-edit-button"
                      onClick={() =>
                        openEditForm(achievement)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(achievement.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  )
}

export default AchievementsManager