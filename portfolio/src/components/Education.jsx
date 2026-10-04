const education = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    specialization: "Artificial Intelligence & Machine Learning",
    institution: "Brainware University",
    period: "2023 — 2027",
    result: "CGPA: 9.5 / 10",
  },
  {
    degree: "Higher Secondary",
    specialization: "Higher Secondary Education",
    institution: "Begumpur High School",
    period: "2023",
    result: "Percentage: 90.2%",
  },
  {
    degree: "Secondary Education",
    specialization: "Secondary Education",
    institution: "Baratajpur High School",
    period: "2021",
    result: "Percentage: 87.57%",
  },
]

function Education() {
  return (
    <section className="education" id="education">
      <div className="section-heading">
        <p>MY ACADEMIC JOURNEY</p>
        <h2>Education</h2>
      </div>

      <div className="education-container">
        {education.map((item, index) => (
          <div className="education-item" key={item.institution}>

            <div className="education-number">
              0{index + 1}
            </div>

            <div className="education-content">
              <div className="education-period">
                {item.period}
              </div>

              <h3>{item.degree}</h3>

              <h4>{item.specialization}</h4>

              <p className="education-institution">
                {item.institution}
              </p>

              <span className="education-result">
                {item.result}
              </span>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}

export default Education