import "./Settings.css";

import HospitalSettings from "../../components/settings/HospitalSettings";
import AdminSettings from "../../components/settings/AdminSettings";
import SystemInfo from "../../components/settings/SystemInfo";

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your hospital and administrator settings.</p>
        </div>
      </div>

      <div className="settings-grid">
        <HospitalSettings />
        <AdminSettings />
      </div>

      <SystemInfo />
    </div>
  );
};

export default Settings;
