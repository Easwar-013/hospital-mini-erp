import { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteBill } from "../../services/billingService";
import "./BillingTable.css";

const BillingTable = ({ bills, onEdit, onDelete, onPreview }) => {
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bill?",
    );
    if (!confirmDelete) return;

    try {
      await deleteBill(id);
      toast.success("Bill Deleted Successfully");
      onDelete();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  const filteredBills = bills.filter((bill) => {
    const keyword = search.toLowerCase();
    return (
      bill.patient?.fullName?.toLowerCase().includes(keyword) ||
      bill.doctor?.fullName?.toLowerCase().includes(keyword) ||
      bill.paymentStatus?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="patient-table">
      <div className="table-header">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Bill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Bills Found
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr key={bill._id}>
                  {/* FIX: Use the unique invoiceNumber from the database */}
                  <td>{bill.invoiceNumber}</td>
                  <td>{bill.patient?.fullName}</td>
                  <td>{bill.doctor?.fullName}</td>
                  <td>₹ {bill.totalAmount}</td>
                  <td>
                    <span className="status admitted">
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>{bill.paymentMethod}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit" onClick={() => onEdit(bill)}>
                        <FaEdit />
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(bill._id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="pdf"
                        title="Preview Invoice"
                        onClick={() => onPreview(bill)}
                      >
                        <FaFilePdf />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingTable;
