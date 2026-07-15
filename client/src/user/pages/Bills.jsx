import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyBills } from "../services/appointmentService";
import "./Bills.css";
import axios from "axios";

const Bills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const getAuthHeader = () => {
    // Try to get the token directly when the function is called
    const token = localStorage.getItem("patientToken");

    console.log("Checking Token during click:", token);

    if (!token || token === "undefined" || token === "null") {
      // If it's missing, try to see if it was saved as 'user' or another key
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("Fallback check on user object:", user);

      // If you are storing the token inside the 'user' object:
      if (user && user.token) return { Authorization: `Bearer ${user.token}` };

      throw new Error("No token found. Please log in.");
    }

    return { Authorization: `Bearer ${token}` };
  };

  const previewInvoice = async (id) => {
    try {
      const response = await axios.get(
        `https://hospital-mini-erp.onrender.com/api/patient-user/bill/${id}/pdf`,
        {
          responseType: "blob",
          headers: getAuthHeader(),
        },
      );

      const url = URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );
      window.open(url);
    } catch (error) {
      console.error("Preview Error:", error.response || error);
      toast.error(
        error.response?.status === 401
          ? "Session expired. Please log in again."
          : "Failed to preview",
      );
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const response = await axios.get(
        `https://hospital-mini-erp.onrender.com/api/patient-user/bill/${id}/pdf`,
        {
          responseType: "blob",
          headers: getAuthHeader(),
        },
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download Error:", error.response || error);
      toast.error("Failed to download");
    }
  };

  const fetchBills = async () => {
    try {
      const data = await getMyBills();
      setBills(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load bills");
    }
  };

  return (
    <div className="user-bills">
      <h1>My Bills</h1>
      {Array.isArray(bills) && bills.length === 0 ? (
        <div className="bill-card">
          <h3>No Bills Available</h3>
          <p>Your hospital bills will appear here once generated.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="bill-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Doctor</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.invoiceNumber}</td>
                  <td>{bill.doctor?.fullName}</td>
                  <td>₹ {bill.totalAmount}</td>
                  <td>{bill.paymentMethod}</td>
                  <td>{bill.paymentStatus}</td>
                  <td>
                    <div className="pdf-actions">
                      <button
                        className="preview-btn"
                        onClick={() => previewInvoice(bill._id)}
                      >
                        👁 Preview
                      </button>
                      <button
                        className="download-btn"
                        onClick={() => downloadInvoice(bill._id)}
                      >
                        ⬇ Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bills;
