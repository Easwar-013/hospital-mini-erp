import { useState, useEffect } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    phone: "",
    email: "",
    experience: "",
    qualification: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctors/profile");
        if (res.data.doctor) {
          setFormData(res.data.doctor);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/doctors/profile/update", formData);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Experience (Years)</label>
          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Qualification</label>
          <input
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
