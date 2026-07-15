import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  return (
    <div className="billing-page">
      <div className="header-actions">
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
        onPreview={() => toast.info("PDF Preview feature coming soon")}
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
