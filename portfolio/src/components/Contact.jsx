function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">

        <div className="section-heading">
          <p>LET'S CONNECT</p>
          <h2>Get In Touch</h2>
        </div>

        <div className="contact-content">

          <div className="contact-text">
            <h3>
              Have a project or opportunity in mind?
            </h3>

            <p>
              I'm always interested in learning, building
              meaningful projects, and connecting with people
              working in technology.
            </p>

            <a
              href="mailto:rupakghosh10101@gmail.com"
              className="email-link"
            >
              rupakghosh10101@gmail.com ↗
            </a>
          </div>

          <div className="contact-details">

            <a
              href="mailto:rupakghosh10101@gmail.com"
              className="contact-card"
            >
              <span className="contact-icon">✉</span>

              <div>
                <small>Email</small>
                <p>rupakghosh10101@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+916297893183"
              className="contact-card"
            >
              <span className="contact-icon">☎</span>

              <div>
                <small>Phone</small>
                <p>+91 62978 93183</p>
              </div>
            </a>

            <div className="contact-card">
              <span className="contact-icon">📍</span>

              <div>
                <small>Location</small>
                <p>West Bengal, India</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Contact