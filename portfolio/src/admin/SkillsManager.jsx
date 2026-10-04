import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)

  const [form, setForm] = useState({
    category: "",
    name: "",
    level: "",
    icon: "",
    display_order: 0,
    category_order: 0,
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  // =========================
  // FETCH SKILLS
  // =========================

  async function fetchSkills() {
    setLoading(true)

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category_order", {
        ascending: true,
      })
      .order("display_order", {
        ascending: true,
      })

    if (error) {
      console.error("Error fetching skills:", error)
      alert("Failed to load skills.")
    } else {
      setSkills(data || [])
    }

    setLoading(false)
  }

  // =========================
  // ADD FORM
  // =========================

  function openAddForm() {
    setEditingSkill(null)

    setForm({
      category: "",
      name: "",
      level: "",
      icon: "",
      display_order: skills.length + 1,
      category_order: 1,
    })

    setShowForm(true)
  }

  // =========================
  // EDIT FORM
  // =========================

  function openEditForm(skill) {
    setEditingSkill(skill)

    setForm({
      category: skill.category || "",
      name: skill.name || "",
      level: skill.level || "",
      icon: skill.icon || "",
      display_order: skill.display_order || 0,
      category_order: skill.category_order || 0,
    })

    setShowForm(true)
  }

  // =========================
  // CLOSE FORM
  // =========================

  function closeForm() {
    setShowForm(false)
    setEditingSkill(null)
  }

  // =========================
  // FORM CHANGE
  // =========================

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =========================
  // ADD / UPDATE
  // =========================

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.category.trim()) {
      alert("Category is required.")
      return
    }

    if (!form.name.trim()) {
      alert("Skill name is required.")
      return
    }

    const skillData = {
      category: form.category.trim(),
      name: form.name.trim(),
      level: form.level.trim(),
      icon: form.icon.trim(),
      display_order: Number(form.display_order) || 0,
      category_order: Number(form.category_order) || 0,
    }

    if (editingSkill) {
      const { error } = await supabase
        .from("skills")
        .update(skillData)
        .eq("id", editingSkill.id)

      if (error) {
        console.error(error)
        alert("Failed to update skill.")
        return
      }

      alert("Skill updated successfully.")
    } else {
      const { error } = await supabase
        .from("skills")
        .insert([skillData])

      if (error) {
        console.error(error)
        alert("Failed to add skill.")
        return
      }

      alert("Skill added successfully.")
    }

    closeForm()
    fetchSkills()
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      alert("Failed to delete skill.")
      return
    }

    alert("Skill deleted successfully.")

    fetchSkills()
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


            <a
            href="/admin/dashboard/skills"
            className="admin-nav-active"
            >
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
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        <div className="admin-page-header">

          <div>

            <p className="admin-page-label">
              CONTENT MANAGEMENT
            </p>

            <h1>
              Skills
            </h1>

            <p>
              Manage your technical skills and categories.
            </p>

          </div>


          <button
            className="admin-add-button"
            onClick={openAddForm}
          >
            + Add Skill
          </button>

        </div>


        {/* FORM */}

        {showForm && (

          <div className="admin-form-card">

            <div className="admin-form-header">

              <h2>
                {editingSkill
                  ? "Edit Skill"
                  : "Add Skill"}
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

              {/* CATEGORY */}

              <div className="admin-form-group">

                <label>
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Machine Learning"
                  required
                />

              </div>


              {/* SKILL */}

              <div className="admin-form-group">

                <label>
                  Skill Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Random Forest"
                  required
                />

              </div>


              {/* LEVEL */}

              <div className="admin-form-group">

                <label>
                  Level
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >

                  <option value="">
                    Select level
                  </option>

                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>

                  <option value="Expert">
                    Expert
                  </option>

                </select>

              </div>


              {/* ICON */}

              <div className="admin-form-group">

                <label>
                  Icon
                </label>

                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="python"
                />

              </div>


              {/* ORDER */}

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Category Order
                  </label>

                  <input
                    type="number"
                    name="category_order"
                    value={form.category_order}
                    onChange={handleChange}
                  />

                </div>


                <div className="admin-form-group">

                  <label>
                    Skill Order
                  </label>

                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                  />

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
                  {editingSkill
                    ? "Update Skill"
                    : "Save Skill"}
                </button>

              </div>

            </form>

          </div>

        )}


        {/* SKILL LIST */}

        <div className="admin-content-card">

          <div className="admin-content-card-header">

            <div>

              <h2>
                All Skills
              </h2>

              <p>
                {skills.length} skill
                {skills.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>


          {loading ? (

            <div className="admin-loading">
              Loading skills...
            </div>

          ) : skills.length === 0 ? (

            <div className="admin-empty-state">

              <h3>
                No skills yet
              </h3>

              <p>
                Add your first skill to get started.
              </p>

              <button
                className="admin-add-button"
                onClick={openAddForm}
              >
                + Add Skill
              </button>

            </div>

          ) : (

            <div className="admin-skill-list">

              {skills.map((skill) => (

                <div
                  className="admin-skill-item"
                  key={skill.id}
                >

                  <div className="admin-skill-info">

                    <h3>
                      {skill.name}
                    </h3>

                    <p>
                      {skill.category}
                    </p>

                    <div className="admin-skill-meta">

                      {skill.level && (
                        <span>
                          {skill.level}
                        </span>
                      )}

                      <span>
                        Category #{skill.category_order}
                      </span>

                      <span>
                        Skill #{skill.display_order}
                      </span>

                    </div>

                  </div>


                  <div className="admin-item-actions">

                    <button
                      className="admin-edit-button"
                      onClick={() =>
                        openEditForm(skill)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(skill.id)
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

export default SkillsManager