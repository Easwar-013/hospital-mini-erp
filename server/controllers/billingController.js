import Bill from "../models/Bill.js";
import Patient from "../models/Patient.js";

// =========================================
// Create Bill
// =========================================
export const createBill = async (req, res) => {
  try {
    console.log(req.body);
    
    // Find the latest bill based on invoice number to maintain sequence
    const lastBill = await Bill.findOne().sort({ invoiceNumber: -1 });
    
    let nextNumber = 1;
    // Standardize using 'lastBill' consistently
    if (lastBill && lastBill.invoiceNumber) {
        const currentNum = parseInt(lastBill.invoiceNumber.replace('INV', ''), 10);
        if (!isNaN(currentNum)) {
            nextNumber = currentNum + 1;
        }
    } 

    const invoiceNumber = "INV" + String(nextNumber).padStart(4, "0");

    const consultationFee = Number(req.body.consultationFee || 0);
    const wardCharge = Number(req.body.wardCharge || 0);
    const medicineCharge = Number(req.body.medicineCharge || 0);
    const labCharge = Number(req.body.labCharge || 0);
    const otherCharge = Number(req.body.otherCharge || 0);
    const discount = Number(req.body.discount || 0);

    const totalAmount =
      consultationFee +
      wardCharge +
      medicineCharge +
      labCharge +
      otherCharge -
      discount;

    if (totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount cannot be negative.",
      });
    }

    const bill = await Bill.create({
      ...req.body,
      invoiceNumber,
      consultationFee,
      wardCharge,
      medicineCharge,
      labCharge,
      otherCharge,
      discount,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Bill Created Successfully",
      bill,
    });
  } catch (error) {
      console.log("========== BILL ERROR ==========");
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

// =========================================
// Get All Bills
// =========================================
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("patient", "patientId fullName phone")
      .populate("doctor", "doctorId fullName specialization")
      .populate("ward", "wardName bedNumber")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// Get Logged In Patient Bills
// =========================================
export const getMyBills = async (req, res) => {
  try {
    const patient = await Patient.findOne({ phone: req.user.phone });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    const bills = await Bill.find({ patient: patient._id })
      .populate("doctor", "fullName specialization")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// Update Bill
// =========================================
export const updateBill = async (req, res) => {
  try {
    const totalAmount = (Number(req.body.consultationFee) || 0) +
                        (Number(req.body.wardCharge) || 0) +
                        (Number(req.body.medicineCharge) || 0) +
                        (Number(req.body.labCharge) || 0) +
                        (Number(req.body.otherCharge) || 0) -
                        (Number(req.body.discount) || 0);

    if (totalAmount < 0) {
      return res.status(400).json({ success: false, message: "Total amount cannot be negative." });
    }

    const bill = await Bill.findByIdAndUpdate(req.params.id, 
        { ...req.body, totalAmount }, 
        { new: true, runValidators: true }
    );

    if (!bill) return res.status(404).json({ success: false, message: "Bill Not Found" });
    res.status(200).json({ success: true, message: "Bill Updated Successfully", bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// Delete Bill
// =========================================
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: "Bill Not Found" });
    res.status(200).json({ success: true, message: "Bill Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};