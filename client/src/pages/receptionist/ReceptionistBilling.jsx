import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBills } from "../../services/billingService";
import BillingTable from "../../components/billing/BillingTable";
import GenerateBillModal from "../../components/billing/GenerateBillModal";

const ReceptionistBilling = () => {
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const data = await getBills();
      setBills(data || []);
    } catch {
      toast.error("Failed to load bills");
    }
  };

  const handlePreviewPDF = (bill) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Blue Header Background
    doc.setFillColor(37, 99, 235); // Blue color
    doc.rect(0, 0, pageWidth, 40, "F");

    // 2. Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("CITY HOSPITAL", 15, 15);
    doc.setFontSize(10);
    doc.text("Hospital Management Mini ERP", 15, 22);

    doc.setFontSize(14);
    doc.text("INVOICE", pageWidth - 50, 15);
    doc.setFontSize(10);
    doc.text(`No : ${bill.invoiceNumber}`, pageWidth - 50, 22);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, pageWidth - 50, 28);

    // 3. Patient & Hospital Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Patient Information", 15, 50);
    doc.setFont("helvetica", "bold");
    doc.text(`Name : ${bill.patient?.fullName}`, 15, 58);
    doc.text(`Patient ID : ${bill.patient?.patientId || "N/A"}`, 15, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Hospital Details", pageWidth - 60, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Doctor : ${bill.doctor?.fullName || "N/A"}`, pageWidth - 60, 58);
    doc.text(
      `Ward : ${bill.ward?.wardName || "General Ward"}`,
      pageWidth - 60,
      65,
    );

    // 4. Billing Table
    autoTable(doc, {
      startY: 80,
      head: [["Description", "Amount"]],
      body: [
        ["Consultation Fee", `Rs. ${bill.consultationFee}`],
        ["Ward Charge", `Rs. ${bill.wardCharge}`],
        ["Medicine Charge", `Rs. ${bill.medicineCharge}`],
        ["Lab Charge", `Rs. ${bill.labCharge}`],
        ["Other Charge", `Rs. ${bill.otherCharge}`],
        ["Discount", `- Rs. ${bill.discount}`],
      ],
      headStyles: { fillColor: [37, 99, 235] },
    });

    // 5. Grand Total (positioned after table)
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(236, 253, 245); // Light green bg
    doc.rect(pageWidth - 80, finalY, 65, 15, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total", pageWidth - 75, finalY + 10);
    doc.setTextColor(5, 150, 105); // Dark green text
    doc.text(`Rs. ${bill.totalAmount}`, pageWidth - 45, finalY + 10);

    // 6. Footer Payment Info
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Method : ${bill.paymentMethod}`, 15, finalY + 30);
    doc.text(`Status : ${bill.paymentStatus}`, 15, finalY + 37);

    doc.setFont("helvetica", "bold");
    doc.text("Thank You", pageWidth / 2 - 10, finalY + 50, { align: "center" });

    // Open in new tab
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="billing-page">
      <div
        className="header-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Billing</h1>
        <button
          className="add-btn"
          onClick={() => {
            setSelectedBill(null);
            setIsModalOpen(true);
          }}
        >
          + Create Bill
        </button>
      </div>
      <BillingTable
        bills={bills}
        onEdit={(bill) => {
          setSelectedBill(bill);
          setIsModalOpen(true);
        }}
        onDelete={fetchBills}
        onPreview={handlePreviewPDF}
      />
      <GenerateBillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBill={selectedBill}
        onBillSaved={fetchBills}
      />
    </div>
  );
};

export default ReceptionistBilling;
