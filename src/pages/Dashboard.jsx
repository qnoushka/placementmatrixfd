import { useEffect, useState } from "react";
import api from "../services/api";
import InsightBar from "../components/InsightBar";

function Dashboard() {
  const [cgpaData, setCgpaData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(false);

        const cgpaRes = await api.get("/analytics/cgpa-vs-selection");
        const skillsRes = await api.get("/analytics/skills-impact");

        setCgpaData(
          Array.isArray(cgpaRes.data?.data) ? cgpaRes.data.data : []
        );
        setSkillsData(
          Array.isArray(skillsRes.data?.data) ? skillsRes.data.data : []
        );
      } catch (err) {
        console.error("Analytics fetch failed", err);
        setError(true);
        setCgpaData([]);
        setSkillsData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Placement Insights Dashboard</h1>

      <p style={{ color: "#555" }}>
        Metrics shown are based on historical placement data (simulated).
      </p>

      {loading && <p>Loading analytics…</p>}

      {error && (
        <p style={{ color: "red" }}>
          Backend unavailable. Please try again later.
        </p>
      )}

      {!loading && cgpaData.length > 0 && (
        <section style={{ marginTop: 30 }}>
          <h2>CGPA Impact</h2>
          <p style={{ color: "#666" }}>
            Metric: Historical Selection Probability
          </p>

          {cgpaData.map((item, idx) => (
            <InsightBar
              key={idx}
              label={item.cgpaBucket}
              value={item.selectionRate}
              color="purple"
            />
          ))}
        </section>
      )}

      {!loading && skillsData.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2>Skills Impact</h2>
          <p style={{ color: "#666" }}>
            Metric: Historical Selection Probability
          </p>

          {skillsData.map((item, idx) => (
            <InsightBar
              key={idx}
              label={item.skill}
              value={item.selectionRate}
              color="teal"
              scale={10}
            />
          ))}

          <p style={{ marginTop: 8, color: "#666" }}>
            Skills reflect historical association, not job requirements.
          </p>
        </section>
      )}

      {!loading && cgpaData.length === 0 && skillsData.length === 0 && !error && (
        <p style={{ color: "#666", marginTop: 20 }}>
          No analytics data available yet.
        </p>
      )}
    </div>
  );
}

export default Dashboard;




