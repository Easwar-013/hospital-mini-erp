import "./StatCard.css";

const StatCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>

      <div className="stat-content">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;
