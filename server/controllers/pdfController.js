import PDFDocument from "pdfkit";
import Bill from "../models/Bill.js";

export const generateInvoicePDF = async (req, res) => {
  try {
    // Populate ward details as well so we can show Ward & Bed in the PDF
    const bill = await Bill.findById(req.params.id)
      .populate("patient", "fullName patientId")
      .populate("doctor", "fullName")
      .populate("ward", "wardName bedNumber");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${bill.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    /* =========================
       HEADER (Blue Bar)
    ========================= */
    doc.rect(0, 0, 595, 90).fill("#0d6efd");

    doc.fillColor("white").font("Helvetica-Bold").fontSize(24).text("CITY HOSPITAL", 40, 28);
    doc.font("Helvetica").fontSize(12).text("Hospital Management Mini ERP", 40, 58);

    doc.font("Helvetica-Bold").fontSize(18).text("INVOICE", 445, 28);
    doc.font("Helvetica").fontSize(10).text(`No : ${bill.invoiceNumber}`, 445, 50);
    
    // Formatting date to match React standard
    const dateStr = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    doc.text(`Date : ${dateStr}`, 445, 65);

    /* =========================
       INFO GRID (Patient & Hospital)
    ========================= */
    const infoTop = 120;
    doc.fillColor("black");

    // Left Column: Patient
    doc.font("Helvetica-Bold").fontSize(14).text("Patient Information", 40, infoTop);
    doc.font("Helvetica").fontSize(11);
    doc.text(`Name : ${bill.patient?.fullName || "-"}`, 40, infoTop + 20);
    doc.text(`Patient ID : ${bill.patient?.patientId || "-"}`, 40, infoTop + 38);

    // Right Column: Hospital
    doc.font("Helvetica-Bold").fontSize(14).text("Hospital Details", 380, infoTop, { align: "right" });
    doc.font("Helvetica").fontSize(11);
    doc.text(`Doctor : ${bill.doctor?.fullName || "-"}`, 380, infoTop + 20, { align: "right" });
    doc.text(`Ward : ${bill.ward?.wardName || "General Ward"}`, 380, infoTop + 38, { align: "right" });
    doc.text(`Bed : ${bill.ward?.bedNumber || "-"}`, 380, infoTop + 56, { align: "right" });

    doc.moveTo(40, infoTop + 85).lineTo(555, infoTop + 85).stroke("#eeeeee");

    /* =========================
       TABLE HEADER (Blue)
    ========================= */
    const tableTop = 230;

    doc.rect(40, tableTop, 515, 30).fill("#0d6efd");
    doc.fillColor("white").font("Helvetica-Bold").fontSize(12);
    
    doc.text("Description", 55, tableTop + 9);
    doc.text("Amount", 435, tableTop + 9, { width: 100, align: "right" });

    /* =========================
       TABLE ROWS (Charges Breakdown)
    ========================= */
    doc.fillColor("black").font("Helvetica").fontSize(11);
    let y = tableTop + 45;
    const rowHeight = 35;

    // We pull the exact fields from your database to match the Admin UI
    const charges = [
      { label: "Consultation Fee", amount: bill.consultationFee || 0 },
      { label: "Ward Charge", amount: bill.wardCharge || 0 },
      { label: "Medicine Charge", amount: bill.medicineCharge || 0 },
      { label: "Lab Charge", amount: bill.labCharge || 0 },
      { label: "Other Charge", amount: bill.otherCharge || 0 },
      { label: "Discount", amount: `- Rs. ${bill.discount || 0}` } // formatting discount negative
    ];

    charges.forEach((charge) => {
      doc.text(charge.label, 55, y);
      
      // If it's the discount, use the string we made, otherwise format with ₹
      const amtText = typeof charge.amount === 'string' ? charge.amount : `Rs. ${charge.amount}`;
      doc.text(amtText, 435, y, { width: 100, align: "right" });
      
      // Draw light gray line under row
      doc.moveTo(40, y + 20).lineTo(555, y + 20).stroke("#f0f0f0");
      y += rowHeight;
    });

    /* =========================
       GRAND TOTAL BOX
    ========================= */
    y += 10;
    
    // Light green background box for total
    doc.rect(335, y, 220, 50).fill("#ecfdf5");
    
    doc.fillColor("#374151").font("Helvetica-Bold").fontSize(14);
    doc.text("Grand Total", 350, y + 18);
    
    doc.fillColor("#10b981").font("Helvetica-Bold").fontSize(20);
    doc.text(`Rs. ${bill.totalAmount || 0}`, 435, y + 15, { width: 100, align: "right" });

    /* =========================
       FOOTER INFO
    ========================= */
    y += 80;
    doc.rect(40, y, 515, 50).fill("#f8fafc");
    
    doc.fillColor("black").font("Helvetica").fontSize(11);
    doc.text(`Payment Method : ${bill.paymentMethod || "Cash"}`, 55, y + 12);
    doc.text(`Rs. : ${bill.paymentStatus || bill.status || "Pending"}`, 55, y + 30);

    /* =========================
       THANK YOU MESSAGE
    ========================= */
    y += 90;
    doc.fillColor("black").font("Helvetica-Bold").fontSize(14).text("Thank You", 0, y, { align: "center" });
    doc.fillColor("gray").font("Helvetica").fontSize(11).text("Get Well Soon", 0, y + 18, { align: "center" });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};