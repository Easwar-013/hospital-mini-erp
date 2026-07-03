import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getDoctors } from "../../services/doctorService";
import { bookAppointment } from "../services/appointmentService";

import "./BookAppointment.css";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization === formData.department,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await bookAppointment(formData);

      toast.success("Appointment Booked Successfully");

      setFormData({
        department: "",
        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <div className="book-page">
      <h1>Book Appointment</h1>

      <form onSubmit={submitHandler}>
        <label>Department</label>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>

          <option>Cardiology</option>

          <option>Neurology</option>

          <option>Orthopedics</option>

          <option>Pediatrics</option>

          <option>Dermatology</option>
        </select>

        <label>Doctor</label>

        <select name="doctor" value={formData.doctor} onChange={handleChange}>
          <option>Select Doctor</option>

          {filteredDoctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.fullName}
            </option>
          ))}
        </select>

        <label>Date</label>

        <input
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
        />

        <label>Time</label>

        <input
          type="time"
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
        />

        <label>Reason</label>

        <textarea
          rows="4"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointment;
