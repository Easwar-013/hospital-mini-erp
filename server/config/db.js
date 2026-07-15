import mongoose from "mongoose";

const connectDB = async () => {
  console.log("DEBUG: MONGO_URI is:", process.env.MONGO_URI);
  try {
    // Force Mongoose to use the database name defined in your MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "hospitalMiniERP" // Explicitly define the database name here
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;