export default function ProductivityBadge({ score }) {
  let color = "gray";
  let label = "Unknown";

  if (score >= 0.8) {
    color = "green";
    label = "Excellent";
  } else if (score >= 0.65) {
    color = "blue";
    label = "Good";
  } else if (score >= 0.5) {
    color = "orange";
    label = "Average";
  } else {
    color = "red";
    label = "Low";
  }

  return (
    <div
      style={{
        padding: "8px 16px",
        borderRadius: 12,
        display: "inline-block",
        background: color,
        color: "white",
        fontWeight: "bold"
      }}
    >
      {label} ({(score * 100).toFixed(0)}%)
    </div>
  );
}
