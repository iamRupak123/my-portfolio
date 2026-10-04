import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function ResumeManager() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchResume()
  }, [])

  // =========================
  // FETCH CURRENT RESUME
  // =========================

  async function fetchResume() {
    setLoading(true)

    const { data, error } = await supabase
      .from("resume")
      .select("*")
      .order("updated_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Error fetching resume:", error)
    }

    setResume(data || null)

    setLoading(false)
  }

  // =========================
  // FILE SELECT
  // =========================

  function handleFileChange(e) {
    const file = e.target.files?.[0]

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.")
      e.target.value = ""
      return
    }

    const maxSize = 10 * 1024 * 1024

    if (file.size > maxSize) {
      alert("Resume must be smaller than 10 MB.")
      e.target.value = ""
      return
    }

    setSelectedFile(file)
  }

  // =========================
  // UPLOAD / REPLACE
  // =========================

  async function handleUpload(e) {
    e.preventDefault()

    if (!selectedFile) {
      alert("Please select a PDF file first.")
      return
    }

    setUploading(true)

    try {
      /*
        Use a fixed filename so the public resume URL
        always points to the latest resume.
      */

      const filePath = "Resume.pdf"

      // --------------------------------
      // Remove previous file
      // --------------------------------

      const { error: removeError } =
        await supabase.storage
          .from("resume")
          .remove([filePath])

      if (removeError) {
        console.warn(
          "Previous resume could not be removed:",
          removeError
        )
      }

      // --------------------------------
      // Upload new file
      // --------------------------------

      const { error: uploadError } =
        await supabase.storage
          .from("resume")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: "application/pdf",
          })

      if (uploadError) {
        console.error(uploadError)

        alert(
          `Failed to upload resume: ${uploadError.message}`
        )

        setUploading(false)
        return
      }

      // --------------------------------
      // Get public URL
      // --------------------------------

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("resume")
        .getPublicUrl(filePath)

      const publicUrl =
        publicUrlData.publicUrl

      // --------------------------------
      // Delete old DB record
      // --------------------------------

      if (resume?.id) {
        const { error: deleteDbError } =
          await supabase
            .from("resume")
            .delete()
            .eq("id", resume.id)

        if (deleteDbError) {
          console.error(deleteDbError)
        }
      }

      // --------------------------------
      // Insert new DB record
      // --------------------------------

      const { error: insertError } =
        await supabase
          .from("resume")
          .insert([
            {
              title: "Resume",
              file_url: publicUrl,
              file_name: selectedFile.name,
            },
          ])

      if (insertError) {
        console.error(insertError)

        alert(
          `Resume uploaded, but database update failed: ${insertError.message}`
        )

        setUploading(false)
        return
      }

      alert(
        resume
          ? "Resume replaced successfully!"
          : "Resume uploaded successfully!"
      )

      setSelectedFile(null)

      const fileInput =
        document.getElementById("resume-file")

      if (fileInput) {
        fileInput.value = ""
      }

      await fetchResume()
    } catch (error) {
      console.error(error)

      alert(
        "Something went wrong while uploading the resume."
      )
    } finally {
      setUploading(false)
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete() {
    if (!resume) return

    const confirmed = window.confirm(
      "Are you sure you want to delete your current resume?"
    )

    if (!confirmed) return

    setUploading(true)

    try {
      // Delete storage file
      const { error: storageError } =
        await supabase.storage
          .from("resume")
          .remove(["Resume.pdf"])

      if (storageError) {
        console.error(storageError)
      }

      // Delete database record
      const { error: dbError } =
        await supabase
          .from("resume")
          .delete()
          .eq("id", resume.id)

      if (dbError) {
        console.error(dbError)

        alert(
          `Failed to delete resume: ${dbError.message}`
        )

        setUploading(false)
        return
      }

      setResume(null)

      alert("Resume deleted successfully.")
    } catch (error) {
      console.error(error)

      alert(
        "Something went wrong while deleting the resume."
      )
    } finally {
      setUploading(false)
    }
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

          <a href="/admin/dashboard/achievements">
            Achievements
          </a>

          <a href="/admin/dashboard/skills">
            Skills
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


          <a
            href="/admin/dashboard/resume"
            className="active"
          >
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
              Resume
            </h1>

            <p>
              Upload and manage your portfolio resume.
            </p>

          </div>

        </div>


        {/* CURRENT RESUME */}

        <div className="admin-content-card">

          <div className="admin-content-card-header">

            <div>

              <h2>
                Current Resume
              </h2>

              <p>
                Your resume currently used by the portfolio.
              </p>

            </div>

          </div>


          {loading ? (

            <div className="admin-loading">
              Loading resume...
            </div>

          ) : resume ? (

            <div className="admin-resume-card">

              <div className="admin-resume-icon">
                PDF
              </div>

              <div className="admin-resume-info">

                <h3>
                  {resume.file_name || "Resume.pdf"}
                </h3>

                <p>
                  {resume.updated_at
                    ? `Updated ${new Date(
                        resume.updated_at
                      ).toLocaleDateString()}`
                    : "Current resume"}
                </p>

              </div>


              <div className="admin-item-actions">

                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-view-button"
                >
                  View
                </a>

                <button
                  className="admin-delete-button"
                  onClick={handleDelete}
                  disabled={uploading}
                >
                  Delete
                </button>

              </div>

            </div>

          ) : (

            <div className="admin-empty-state">

              <h3>
                No resume uploaded
              </h3>

              <p>
                Upload your resume below to make it
                available on your portfolio.
              </p>

            </div>

          )}

        </div>


        {/* UPLOAD */}

        <div className="admin-content-card admin-resume-upload-card">

          <div className="admin-content-card-header">

            <div>

              <h2>
                {resume
                  ? "Replace Resume"
                  : "Upload Resume"}
              </h2>

              <p>
                Only PDF files up to 10 MB are allowed.
              </p>

            </div>

          </div>


          <form
            onSubmit={handleUpload}
            className="admin-resume-upload-form"
          >

            <label
              htmlFor="resume-file"
              className="admin-file-label"
            >
              <span>
                {selectedFile
                  ? selectedFile.name
                  : "Choose PDF file"}
              </span>

              <span>
                Browse
              </span>

            </label>

            <input
              id="resume-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              hidden
            />


            {selectedFile && (

              <div className="admin-selected-file">

                <span>
                  Selected:
                  {" "}
                  {selectedFile.name}
                </span>

                <span>
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}
                  {" MB"}
                </span>

              </div>

            )}


            <button
              type="submit"
              className="admin-save-button"
              disabled={
                !selectedFile ||
                uploading
              }
            >
              {uploading
                ? "Uploading..."
                : resume
                  ? "Replace Resume"
                  : "Upload Resume"}
            </button>

          </form>

        </div>

      </main>

    </div>
  )
}

export default ResumeManager