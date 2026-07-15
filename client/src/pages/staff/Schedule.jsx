import { useState, useEffect } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";

const Schedule = () => {
  // 1. Use 'status' as the state variable
  const [status, setStatus] = useState("Available");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/doctors/profile");
        // 2. Set the status from the database field
        setStatus(response.data.doctor.status);
      } catch (error) {
        toast.error("Could not load status");
      }
    };
    fetchStatus();
  }, []);

  const toggleAvailability = async () => {
    try {
      // 3. Logic to toggle based on the 'status' string
      const newStatus = status === "Available" ? "On Leave" : "Available";

      await api.put("/doctors/update-availability", { status: newStatus });

      setStatus(newStatus);
      toast.success(`You are now ${newStatus}`);
    } catch (error) {
      console.error("Frontend Update Error:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="staff-dashboard-container">
      <h1>Availability Schedule</h1>
      <p>Toggle your active hours and duty status below.</p>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3>Duty Status</h3>
          <p>
            {status === "Available"
              ? "You are currently accepting appointments."
              : "You are currently offline."}
          </p>
        </div>
        <button
          onClick={toggleAvailability}
          style={{
            padding: "10px 25px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            backgroundColor: status === "Available" ? "#22c55e" : "#64748b",
            color: "white",
          }}
        >
          {status === "Available" ? "Switch to Offline" : "Switch to Available"}
        </button>
      </div>
    </div>
  );
};

export default Schedule;
