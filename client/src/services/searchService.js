import { getPatients } from "./patientService";
import { getDoctors } from "./doctorService";
import { getAppointments } from "./appointmentService";
import { getWards } from "./wardService";
import { getBills } from "./billingService";

export const globalSearch = async () => {
  const [
    patients,
    doctors,
    appointments,
    wards,
    bills,
  ] = await Promise.all([
    getPatients(),
    getDoctors(),
    getAppointments(),
    getWards(),
    getBills(),
  ]);

  return [
    ...patients.map((p) => ({
      id: p._id,
      type: "Patient",
      title: p.fullName,
      subtitle: p.patientId,
      route: "/patients",
    })),

    ...doctors.map((d) => ({
      id: d._id,
      type: "Doctor",
      title: d.fullName,
      subtitle: d.specialization,
      route: "/doctors",
    })),

    ...appointments.map((a) => ({
      id: a._id,
      type: "Appointment",
      title: a.patient?.fullName || "Appointment",
      subtitle: a.appointmentDate,
      route: "/appointments",
    })),

    ...wards.map((w) => ({
      id: w._id,
      type: "Ward",
      title: w.wardName,
      subtitle: w.bedNumber,
      route: "/wards",
    })),

    ...bills.map((b) => ({
      id: b._id,
      type: "Bill",
      title: b.invoiceNumber,
      subtitle: `₹ ${b.totalAmount}`,
      route: "/billing",
    })),
  ];
};