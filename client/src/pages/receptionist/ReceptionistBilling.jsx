import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
    doc.text(`Invoice: ${bill.invoiceNumber}`, 10, 10);
    doc.text(`Patient: ${bill.patient?.fullName}`, 10, 20);
    doc.text(`Total Amount: ₹ ${bill.totalAmount}`, 10, 30);

    // Add table if needed
    doc.autoTable({
      head: [["Description", "Amount"]],
      body: [
        ["Consultation", bill.consultationFee],
        ["Total", bill.totalAmount],
      ],
    });

    doc.save(`${bill.invoiceNumber}.pdf`);
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
