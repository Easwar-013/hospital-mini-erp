import "./SystemInfo.css";

const SystemInfo = () => {
  return (
    <div className="system-card">
      <h2>System Information</h2>

      <div className="info-grid">
        <div>
          <strong>Application</strong>
          <p>Hospital Management Mini ERP</p>
        </div>

        <div>
          <strong>Version</strong>
          <p>1.0.0</p>
        </div>

        <div>
          <strong>Technology</strong>
          <p>MERN Stack</p>
        </div>

        <div>
          <strong>Developed By</strong>
          <p>Easwar R</p>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
