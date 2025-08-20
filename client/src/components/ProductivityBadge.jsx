import "./ProductivityBadge.css";

export default function ProductivityBadge({ score }) {
  let label = "Unknown", color = "gray";
  if (score >= 0.8) { label = "Excellent"; color = "green"; }
  else if (score >= 0.6) { label = "Good"; color = "blue"; }
  else if (score >= 0.4) { label = "Average"; color = "orange"; }
  else { label = "Low"; color = "red"; }

  return (
    <span className={`badge ${color}`}>
      {label} ({Math.round(score * 100)}%)
    </span>
  );
}
