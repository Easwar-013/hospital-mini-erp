import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (bill) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("CITY HOSPITAL", 105, 20, { align: "center" });

  doc.setFontSize(11);
  doc.text("Hospital Management Mini ERP", 105, 28, {
    align: "center",
  });

  doc.line(10, 35, 200, 35);

  // Invoice Info
  doc.setFontSize(12);

  doc.text(`Invoice : ${bill.invoiceNumber}`, 14, 45);

  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    140,
    45
  );

  // Patient Details
  doc.text(
    `Patient : ${bill.patient?.fullName}`,
    14,
    60
  );

  doc.text(
    `Doctor : ${bill.doctor?.fullName}`,
    14,
    68
  );

  doc.text(
    `Ward : ${bill.ward?.wardName}`,
    14,
    76
  );

  doc.text(
    `Bed : ${bill.ward?.bedNumber}`,
    14,
    84
  );

  autoTable(doc, {
    startY: 95,

    head: [["Description", "Amount"]],

    body: [
      ["Consultation Fee", `₹ ${bill.consultationFee}`],

      ["Ward Charge", `₹ ${bill.wardCharge}`],

      ["Medicine Charge", `₹ ${bill.medicineCharge}`],

      ["Lab Charge", `₹ ${bill.labCharge}`],

      ["Other Charge", `₹ ${bill.otherCharge}`],

      ["Discount", `₹ ${bill.discount}`],

      ["Grand Total", `₹ ${bill.totalAmount}`],
    ],
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.text(
    `Payment Method : ${bill.paymentMethod}`,
    14,
    finalY
  );

  doc.text(
    `Payment Status : ${bill.paymentStatus}`,
    14,
    finalY + 10
  );

  doc.setFontSize(14);

  doc.text(
    "Thank You! Get Well Soon ❤️",
    105,
    finalY + 30,
    {
      align: "center",
    }
  );

  doc.save(`${bill.invoiceNumber}.pdf`);
};

export default generateInvoice;