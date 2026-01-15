function InsightBar({ label, value, color, scale = 10 }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>{label}</strong>
      <div
        style={{
          height: "20px",
          width: value * scale,
          backgroundColor: color
        }}
      />
    </div>
  );
}

export default InsightBar;
