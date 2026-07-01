import Bill from "../models/Bill.js";

// =========================================
// Create Bill
// =========================================
export const createBill = async (req, res) => {
  try {
    const count = await Bill.countDocuments();

    const invoiceNumber =
      "INV" + String(count + 1).padStart(4, "0");

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

    res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// Update Bill
// =========================================
export const updateBill = async (req, res) => {
  try {
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

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        consultationFee,
        wardCharge,
        medicineCharge,
        labCharge,
        otherCharge,
        discount,
        totalAmount,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bill Updated Successfully",
      bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// Delete Bill
// =========================================
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bill Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};