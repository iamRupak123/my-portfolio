import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setSession(session)
    setLoading(false)
  }

  if (loading) {
    return <p>Checking authentication...</p>
  }

  if (!session) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default AdminProtectedRoute