import { useEffect, useState } from "react";
import api from "../services/api";
import InsightBar from "../components/InsightBar";

const AVAILABLE_SKILLS = ["DSA", "SQL", "JavaScript", "React", "OS"];

function getCgpaBucket(cgpa) {
  if (cgpa < 6.5) return "6–6.5";
  if (cgpa < 7) return "6.5–7";
  if (cgpa < 7.5) return "7–7.5";
  if (cgpa < 8) return "7.5–8";
  return "8+";
}

function Simulator() {
  const [cgpa, setCgpa] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [cgpaAnalytics, setCgpaAnalytics] = useState([]);
  const [skillsAnalytics, setSkillsAnalytics] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      const cgpaRes = await api.get("/analytics/cgpa-vs-selection");
      const skillsRes = await api.get("/analytics/skills-impact");

      setCgpaAnalytics(cgpaRes.data.data);
      setSkillsAnalytics(skillsRes.data.data);
    }

    fetchAnalytics();
  }, []);

  function toggleSkill(skill) {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  }

  function handleSimulate() {
    const bucket = getCgpaBucket(Number(cgpa));

    const cgpaData = cgpaAnalytics.find(
      (item) => item.cgpaBucket === bucket
    );

    const skillData = skillsAnalytics.filter((item) =>
      selectedSkills.includes(item.skill)
    );

    setResult({
      bucket,
      cgpa: cgpaData,
      skills: skillData
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Preparation Impact Simulator</h1>

      <p style={{ color: "#555" }}>
        This simulator compares historical outcomes of candidates with the same
        CGPA bucket, with and without selected skills. It does not predict
        individual outcomes.
      </p>

      <div style={{ marginTop: 20 }}>
        <label>
          Your CGPA:{" "}
          <input
            type="number"
            step="0.1"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <p>Select Skills:</p>
        {AVAILABLE_SKILLS.map((skill) => (
          <label key={skill} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedSkills.includes(skill)}
              onChange={() => toggleSkill(skill)}
            />{" "}
            {skill}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          disabled={!cgpa || selectedSkills.length === 0}
          onClick={handleSimulate}
        >
          Simulate Impact
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>Historical Comparison</h3>

          <InsightBar
            label={`CGPA ${result.bucket}`}
            value={result.cgpa.selectionRate}
            color="purple"
          />

          <h4 style={{ marginTop: 20 }}>Skill-wise Association</h4>

          {result.skills.map((s) => (
            <InsightBar
              key={s.skill}
              label={s.skill}
              value={s.selectionRate}
              color="teal"
              scale={10}
            />
          ))}

          <p style={{ marginTop: 10, color: "#666" }}>
            Values indicate historical association, not guarantees or
            recommendations.
          </p>
        </div>
      )}
    </div>
  );
}

export default Simulator;







