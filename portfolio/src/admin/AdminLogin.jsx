import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  // Check if admin is already logged in
  useEffect(() => {
    checkExistingSession()
  }, [])

  async function checkExistingSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      navigate("/admin/dashboard", {
        replace: true,
      })
    }
  }

  async function handleLogin(e) {
    e.preventDefault()

    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    setLoading(false)

    navigate("/admin/dashboard")
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        {/* Header */}

        <div className="admin-login-header">

          <div className="admin-login-logo">
            RG
          </div>

          <p className="admin-login-label">
            ADMIN PANEL
          </p>

          <h1>
            Welcome back
          </h1>

          <p className="admin-login-subtitle">
            Sign in to manage your portfolio.
          </p>

        </div>


        {/* Form */}

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          <div className="admin-login-field">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

          </div>


          <div className="admin-login-field">

            <label>
              Password
            </label>

            <div className="admin-password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="show-password-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          {/* Error */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}


          {/* Login */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>


        {/* Back */}

        <button
          className="admin-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Portfolio
        </button>

      </div>

    </div>
  )
}

export default AdminLogin