// db/index.js  (replace your current connectDB file with this)
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.error("❌ MONGODB_URI is not set in your .env");
    process.exit(1);
  }

  // Build two candidate URIs:
  // 1) use rawUri as-is
  // 2) fallback: append DB_NAME if it seems missing
  const candidateUris = [rawUri];

  // Only append DB_NAME as fallback if DB_NAME exists and URI doesn't already contain it
  try {
    if (DB_NAME && !rawUri.includes(`/${DB_NAME}`)) {
      // avoid adding DB name if the URI is mongodb+srv and already contains a path/query
      // we'll only append when safe (simple check)
      const uriWithDb = rawUri.endsWith("/") ? `${rawUri}${DB_NAME}` : `${rawUri}/${DB_NAME}`;
      candidateUris.push(uriWithDb);
    }
  } catch (e) {
    // ignore
  }

  const options = {
    // Recommended options
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10s
    socketTimeoutMS: 45000,
  };

  let lastError = null;
  for (const uri of candidateUris) {
    try {
      console.log("\n" + "=".repeat(50));
      console.log("🔗 Attempting MongoDB connection using URI (masked):");
      // Mask password if present for safe logs
      const masked = uri.replace(/(mongodb(?:\+srv)?:\/\/)(.*):(.*)@/, "$1*****:*****@");
      console.log(masked);
      const conn = await mongoose.connect(uri, options);

      console.log("\n" + "=".repeat(50));
      console.log("✅ MongoDB Connected Successfully!");
      console.log(`📍 DB Host: ${conn.connection.host}`);
      console.log(`🗄️  Database: ${conn.connection.name}`);
      console.log("=".repeat(50) + "\n");

      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("⚠️  MongoDB disconnected");
      });

      return conn;
    } catch (err) {
      lastError = err;
      console.error("\n❌ Attempt to connect using above URI failed:");
      console.error(err && err.message ? err.message : err);
      console.log("Trying next candidate (if any)...\n");
    }
  }

  // If we reach here, all attempts failed
  console.error("\n" + "=".repeat(50));
  console.error("❌ MONGODB CONNECTION FAILED! All candidate URIs failed.");
  console.error("Possible causes: incorrect URI, credentials, SRV vs non-SRV mismatch, or Atlas IP/networks not allowed.");
  console.error("Check: MONGODB_URI value, DB_NAME, Atlas Network Access (whitelist), and username/password.");
  console.error("Error (last):", lastError && lastError.message ? lastError.message : lastError);
  console.error("Stack:", lastError && lastError.stack ? lastError.stack : "no stack");
  console.error("=".repeat(50) + "\n");
  process.exit(1);
};

export default connectDB;
