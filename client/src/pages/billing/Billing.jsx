import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Billing.css";

import BillingTable from "../../components/billing/BillingTable";


import GenerateBillModal from "../../components/billing/GenerateBillModal";
import InvoicePreviewModal from "../../components/billing/InvoicePreviewModal";
import { getBills } from "../../services/billingService";
const Billing = () => {
  const [bills, setBills] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBill, setPreviewBill] = useState(null);

  const fetchBills = async () => {
    try {
      const data = await getBills();

      console.log(data);

      setBills(data.bills);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load bills");
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="billing-page">
      <div className="page-header">
        <div>
          <h1>Billing</h1>
          <p>Manage hospital billing and invoices.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedBill(null);
            setOpenModal(true);
          }}
        >
          <FaPlus />
          Create Bill
        </button>
      </div>

      <BillingTable
        bills={bills}
        onEdit={(bill) => {
          setSelectedBill(bill);
          setOpenModal(true);
        }}
        onDelete={fetchBills}
        onPreview={(bill) => {
          setPreviewBill(bill);
          setPreviewOpen(true);
        }}
      />

      <GenerateBillModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedBill(null);
        }}
        selectedBill={selectedBill}
        onBillSaved={fetchBills}
      />

      <InvoicePreviewModal
        isOpen={previewOpen}
        bill={previewBill}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewBill(null);
        }}
      />
    </div>
  );
};

export default Billing;
