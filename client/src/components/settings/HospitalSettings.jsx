import "./HospitalSettings.css";

const HospitalSettings = () => {
  return (
    <div className="settings-card">
      <h2>Hospital Information</h2>

      <div className="form-group">
        <label>Hospital Name</label>
        <input type="text" defaultValue="City Care Hospital" />
      </div>

      <div className="form-group">
        <label>Hospital Address</label>
        <textarea rows="3" defaultValue="Chennai, Tamil Nadu"></textarea>
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input type="text" defaultValue="+91 9876543210" />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" defaultValue="info@citycare.com" />
      </div>

      <div className="form-group">
        <label>License Number</label>
        <input type="text" defaultValue="LIC-2026-001" />
      </div>

      <button className="save-btn">Save Changes</button>
    </div>
  );
};

export default HospitalSettings;
