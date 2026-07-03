import { useEffect, useState } from "react";
import "./Dashboard.css";

import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
} from "react-icons/fa";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import Announcements from "../../components/dashboard/Announcements";

import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { getAppointments } from "../../services/appointmentService";
import { getWards } from "../../services/wardService";

const TOTAL_HOSPITAL_BEDS = 30;

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const patientData = await getPatients();
      const doctorData = await getDoctors();
      const appointmentData = await getAppointments();
      const wardData = await getWards();

      setPatients(patientData || []);
      setDoctors(doctorData || []);
      setAppointments(appointmentData || []);
      setWards(wardData || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Count occupied beds
  const occupiedBeds = wards.filter(
    (ward) => ward.status === "Occupied",
  ).length;

  // Calculate available beds
  const availableBeds = Math.max(0, TOTAL_HOSPITAL_BEDS - occupiedBeds);

  // Recent Patients
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Today's Schedule
  const todaySchedule = [...appointments]
    .sort(
      (a, b) =>
        new Date(a.appointmentDate || 0) - new Date(b.appointmentDate || 0),
    )
    .slice(0, 5);

  return (
    <div className="dashboard">
      {/* Welcome Banner */}

      <div className="welcome-banner">
        <div>
          <h1>Welcome Back 👋</h1>

          <p>
            Hospital Management Mini ERP helps you manage patients, appointments
            and billing from one place.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="card-grid">
        <StatCard
          title="Patients"
          value={patients.length}
          icon={<FaUserInjured />}
          color="#2563EB"
        />

        <StatCard
          title="Doctors"
          value={doctors.length}
          icon={<FaUserMd />}
          color="#10B981"
        />

        <StatCard
          title="Appointments"
          value={appointments.length}
          icon={<FaCalendarCheck />}
          color="#F59E0B"
        />

        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon={<FaBed />}
          color="#8B5CF6"
        />
      </div>

      {/* Quick Actions */}

      <div className="dashboard-row">
        <QuickActions />

        <Announcements />
      </div>

      {/* Recent Patients */}

      <div className="dashboard-row">
        <div className="dashboard-box">
          <h3>Recent Patients</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td>{patient.fullName}</td>

                    <td>{patient.age}</td>

                    <td>
                      <span
                        className={`badge ${
                          patient.status === "Admitted"
                            ? "admitted"
                            : patient.status === "Discharged"
                              ? "discharged"
                              : "pending"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Patients Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Today's Schedule */}

        <div className="dashboard-box">
          <h3>Today's Schedule</h3>

          <ul className="appointment-list">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((appointment) => (
                <li key={appointment._id}>
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleDateString()
                    : ""}

                  {" - "}

                  {appointment.patient?.fullName ||
                    appointment.patientName ||
                    "Patient"}
                </li>
              ))
            ) : (
              <li>No Appointments</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
