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

    // Add text with increased vertical spacing
    doc.setFontSize(18);
    doc.text(`Invoice: ${bill.invoiceNumber}`, 10, 20);

    doc.setFontSize(12);
    doc.text(`Patient: ${bill.patient?.fullName}`, 10, 35);
    doc.text(`Total Amount: ₹ ${bill.totalAmount}`, 10, 45);

    // Use autoTable with startY set to leave space for the text above
    autoTable(doc, {
      startY: 55, // Ensure this is lower than your last doc.text y-coordinate (45)
      head: [["Description", "Amount"]],
      body: [
        ["Consultation", bill.consultationFee],
        ["Medicine", bill.medicineCharge || 0],
        ["Total", bill.totalAmount],
      ],
    });

    // Open in a new window instead of saving/downloading
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
