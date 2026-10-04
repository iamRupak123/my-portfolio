import { useState } from 'react'

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">

      <a href="#home" className="logo">
        RUPAK<span>.</span>
      </a>

      {/* Desktop Navigation */}
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>

        <a href="#home" onClick={closeMenu}>Home</a>

        <a href="#about" onClick={closeMenu}>About</a>

        <a href="#skills" onClick={closeMenu}>Skills</a>

        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#achievements" onClick={closeMenu}>Achievements</a>
        <a href="#education" onClick={closeMenu}>Education</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>

      </div>

      {/* Mobile Menu Button */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

    </nav>
  )
}

export default Navbar