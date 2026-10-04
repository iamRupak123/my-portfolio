import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

function Skills() {
  const [skillCategories, setSkillCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
const { data, error } = await supabase
  .from("skills")
  .select("*")
  .order("category_order", { ascending: true })
  .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching skills:", error)
      setError("Unable to load skills.")
      setLoading(false)
      return
    }

    // Convert database rows into the same structure
    // your old component was using.
    const groupedSkills = data.reduce((categories, skill) => {
      const existingCategory = categories.find(
        (category) => category.title === skill.category
      )

      if (existingCategory) {
        existingCategory.skills.push(skill.name)
      } else {
        categories.push({
          title: skill.category,
          skills: [skill.name],
        })
      }

      return categories
    }, [])

    setSkillCategories(groupedSkills)
    setLoading(false)
  }

  return (
    <section className="skills" id="skills">

      <div className="section-heading">
        <p>WHAT I WORK WITH</p>
        <h2>Skills</h2>
      </div>

      {loading && (
        <p className="skills-status">
          Loading skills...
        </p>
      )}

      {error && (
        <p className="skills-status">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="skills-grid">

          {skillCategories.map((category) => (
            <div
              className="skill-card"
              key={category.title}
            >

              <h3>{category.title}</h3>

              <div className="skill-list">

                {category.skills.map((skill) => (
                  <span
                    className="skill-tag"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  )
}

export default Skills