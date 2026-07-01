import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Appointments.css";

import AppointmentTable from "../../components/appointments/AppointmentTable";
import AddAppointmentModal from "../../components/appointments/AddAppointmentModal";

import { getAppointments } from "../../services/appointmentService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data.appointments);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage patient appointments.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedAppointment(null);
            setOpenModal(true);
          }}
        >
          <FaPlus />
          Book Appointment
        </button>
      </div>

      <AppointmentTable
        appointments={appointments}
        onEdit={(appointment) => {
          setSelectedAppointment(appointment);
          setOpenModal(true);
        }}
        onDelete={fetchAppointments}
      />

      <AddAppointmentModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedAppointment(null);
        }}
        selectedAppointment={selectedAppointment}
        onAppointmentSaved={fetchAppointments}
      />
    </div>
  );
};

export default Appointments;
