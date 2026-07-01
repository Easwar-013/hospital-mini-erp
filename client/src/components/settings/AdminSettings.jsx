import "./AdminSettings.css";

const AdminSettings = () => {
  return (
    <div className="settings-card">
      <h2>Administrator Profile</h2>

      <div className="form-group">
        <label>Name</label>
        <input type="text" defaultValue="Administrator" />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" defaultValue="admin@hospital.com" />
      </div>

      <div className="form-group">
        <label>Username</label>
        <input type="text" defaultValue="admin" />
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input type="password" />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input type="password" />
      </div>

      <button className="save-btn">Update Profile</button>
    </div>
  );
};

export default AdminSettings;
