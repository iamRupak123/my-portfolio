import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAchievements()
  }, [])

  async function fetchAchievements() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching achievements:", error)
      setError("Unable to load achievements.")
      setLoading(false)
      return
    }

    setAchievements(data)
    setLoading(false)
  }

  return (
    <section className="achievements" id="achievements">
      <div className="section-heading">
        <p>MY MILESTONES</p>
        <h2>Achievements & Certifications</h2>
      </div>

      {loading && (
        <p className="achievements-status">
          Loading achievements...
        </p>
      )}

      {error && (
        <p className="achievements-status">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="achievements-grid">
          {achievements.map((item) => (
            <div
              className="achievement-card"
              key={item.id}
            >
              <div className="achievement-top">
                <span className="achievement-type">
                  {item.type}
                </span>

                <span className="achievement-year">
                  {item.achievement_year}
                </span>
              </div>

              <h3>{item.title}</h3>

              <p>{item.organization}</p>

              {item.score && (
                <span className="achievement-score">
                  {item.score}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Achievements