import profileImage from "../assets/profile.jpg"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function Hero() {

  // =========================
  // RESUME
  // =========================

  const [resume, setResume] = useState(null)

  // Fetch latest resume when Hero loads
  useEffect(() => {
    fetchResume()
  }, [])

  async function fetchResume() {
    const { data, error } = await supabase
      .from("resume")
      .select("file_url, file_name, updated_at")
      .order("updated_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Failed to load resume:", error)
      return
    }

    setResume(data)
  }

  // =========================
  // DOWNLOAD RESUME
  // =========================

  async function handleDownloadResume() {
    try {
      // Create a signed URL for downloading the resume
      const { data, error } = await supabase.storage
        .from("resume")
        .createSignedUrl(
          "Resume.pdf",
          60,
          {
            download: "Rupak-Ghosh-Resume.pdf",
          }
        )

      if (error) {
        console.error("Resume download failed:", error)
        alert("Unable to download resume.")
        return
      }

      if (!data?.signedUrl) {
        console.error("No signed URL generated.")
        alert("Unable to download resume.")
        return
      }

      console.log("Resume download URL:", data.signedUrl)

      // Start download
      window.location.href = data.signedUrl

    } catch (error) {
      console.error("Resume download failed:", error)
      alert("Unable to download resume.")
    }
  }

  return (
    <section className="hero" id="home">

      {/* Background graphics */}

      <div className="hero-grid"></div>

      <div className="hero-glow hero-glow-one"></div>

      <div className="hero-glow hero-glow-two"></div>


      <div className="hero-container">

        {/* LEFT SIDE */}

        <div className="hero-content">

          <div className="hero-status">
            <span className="status-dot"></span>
            Available for opportunities
          </div>


          <p className="hero-small-text">
            AI / ML <span>•</span> SOFTWARE <span>•</span> DATA
          </p>


          <h1>
            Hi, I'm
            <br />

            <span className="hero-name">
              Rupak Ghosh
            </span>

            <span className="hero-wave">
              👋
            </span>
          </h1>


          <h2>
            Computer Science <span>(AI & ML)</span> Undergraduate
          </h2>


          <p className="hero-description">
            I build intelligent applications, data-driven solutions,
            and scalable software using modern technologies.
          </p>


          {/* BUTTONS */}

          <div className="hero-buttons">

            <a
              href="#projects"
              className="btn primary-btn"
            >
              View My Projects
              <span>↗</span>
            </a>


            {/* DYNAMIC RESUME */}

            {resume && (
              <button
                type="button"
                onClick={handleDownloadResume}
                className="btn secondary-btn"
              >
                Download Resume
                <span>↓</span>
              </button>
            )}

          </div>


          {/* Social links */}

          <div className="hero-socials">

            <a
              href="https://github.com/iamRupak123"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              GitHub ↗
            </a>


            <span></span>


            <a
              href="#contact"
              aria-label="Contact"
            >
              Let's Connect ↗
            </a>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="hero-visual">

          {/* Decorative rotating ring */}

          <div className="hero-ring hero-ring-one"></div>

          <div className="hero-ring hero-ring-two"></div>


          {/* Profile image */}

          <div className="profile-wrapper">

            <div className="profile-glow"></div>

            <div className="profile-image-container">

              <img
                src={profileImage}
                alt="Rupak Ghosh"
                className="profile-image"
              />

            </div>

          </div>


          {/* Floating cards */}

          <div className="floating-card floating-card-one">

            <span className="floating-icon">
              ⌘
            </span>

            <div>
              <strong>
                AI / ML
              </strong>

              <small>
                Building intelligent systems
              </small>
            </div>

          </div>


          <div className="floating-card floating-card-two">

            <span className="floating-icon">
              {"</>"}
            </span>

            <div>

              <strong>
                Developer
              </strong>

              <small>
                Software & Web
              </small>

            </div>

          </div>


          <div className="floating-card floating-card-three">

            <span className="floating-icon">
              ◈
            </span>

            <div>

              <strong>
                Data
              </strong>

              <small>
                Analysis & Visualization
              </small>

            </div>

          </div>

        </div>

      </div>


      {/* Scroll indicator */}

      <a
        href="#about"
        className="scroll-indicator"
      >
        <span></span>
        Scroll to explore
      </a>

    </section>
  )
}

export default Hero