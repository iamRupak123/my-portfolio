function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <a href="#home" className="footer-logo">
          RUPAK<span>.</span>
        </a>

        <p>
          Computer Science (AI & ML) Undergraduate
        </p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a href="/admin" className="admin-link">Admin</a>
        </div>
         <div className="footer-socials">

          <a
            href="https://github.com/iamRupak123"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/rupak-ghosh-ab4107339/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>

        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Rupak Ghosh. All rights reserved.
        </p>
      </div>

    </footer>
  )
}

export default Footer