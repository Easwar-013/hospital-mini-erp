import "./InvoicePreviewModal.css";

import generateInvoice from "../../utils/generateInvoice";
const InvoicePreviewModal = ({ isOpen, onClose, bill }) => {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-content").innerHTML;

    const printWindow = window.open("", "", "width=900,height=700");

    printWindow.document.write(`
    <html>
      <head>
        <title>Hospital Invoice</title>

        <style>

          body{
            font-family:Arial,sans-serif;
            padding:30px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th,td{
            border:1px solid #ddd;
            padding:10px;
          }

          h1,h2,h3{
            margin:5px 0;
          }

        </style>

      </head>

      <body>

        ${printContents}

      </body>

    </html>
  `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();
  };

  return (
    <div className="invoice-overlay">
      <div className="invoice-container" id="invoice-content">
        {/* Header */}

        <div className="invoice-header">
          <div>
            <h1>CITY HOSPITAL</h1>

            <p>Hospital Management Mini ERP</p>

            <p>123 Anna Salai, Chennai, Tamil Nadu</p>

            <p>Phone : +91 9876543210</p>

            <p>Email : cityhospital@gmail.com</p>
          </div>

          <div className="invoice-number">
            <h2>INVOICE</h2>

            <p>
              <strong>No :</strong> {bill.invoiceNumber}
            </p>

            <p>
              <strong>Date :</strong>{" "}
              {new Date(bill.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <hr />

        {/* Patient Details */}

        <div className="invoice-details">
          <div>
            <h3>Patient Information</h3>

            <p>
              <strong>Name :</strong> {bill.patient?.fullName}
            </p>

            <p>
              <strong>Patient ID :</strong> {bill.patient?.patientId}
            </p>
          </div>

          <div>
            <h3>Hospital Details</h3>

            <p>
              <strong>Doctor :</strong> {bill.doctor?.fullName}
            </p>

            <p>
              <strong>Ward :</strong> {bill.ward?.wardName}
            </p>

            <p>
              <strong>Bed :</strong> {bill.ward?.bedNumber}
            </p>
          </div>
        </div>

        {/* Charges */}

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>

              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Consultation Fee</td>

              <td>₹ {bill.consultationFee}</td>
            </tr>

            <tr>
              <td>Ward Charge</td>

              <td>₹ {bill.wardCharge}</td>
            </tr>

            <tr>
              <td>Medicine Charge</td>

              <td>₹ {bill.medicineCharge}</td>
            </tr>

            <tr>
              <td>Lab Charge</td>

              <td>₹ {bill.labCharge}</td>
            </tr>

            <tr>
              <td>Other Charge</td>

              <td>₹ {bill.otherCharge}</td>
            </tr>

            <tr>
              <td>Discount</td>

              <td>- ₹ {bill.discount}</td>
            </tr>
          </tbody>
        </table>

        {/* Total */}

        <div className="invoice-total">
          <h2>Grand Total</h2>

          <h1>₹ {bill.totalAmount}</h1>
        </div>

        {/* Payment */}

        <div className="payment-box">
          <p>
            <strong>Payment Method :</strong> {bill.paymentMethod}
          </p>

          <p>
            <strong>Status :</strong> {bill.paymentStatus}
          </p>
        </div>

        {/* Footer */}

        <div className="invoice-footer">
          <h3>Thank You ❤️</h3>

          <p>Get Well Soon</p>
        </div>

        <div className="invoice-buttons">
          <button className="print-btn" onClick={handlePrint}>
            🖨 Print
          </button>

          <button className="pdf-btn" onClick={() => generateInvoice(bill)}>
            📄 Download PDF
          </button>

          <button className="close-btn" onClick={onClose}>
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
