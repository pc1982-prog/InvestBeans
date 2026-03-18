// test-totp.js
import * as OTPAuth from "otpauth";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.KITE_TOTP_SECRET;
console.log("Secret length:", secret?.length);
console.log("Secret first 6 chars:", secret?.slice(0, 6));
console.log("Secret has spaces:", secret?.includes(" "));
console.log("Secret has underscore:", secret?.includes("_"));
console.log("Secret has special chars:", /[^A-Z2-7]/i.test(secret || ""));

try {
  const totp = new OTPAuth.TOTP({
    secret:    OTPAuth.Secret.fromBase32(secret.replace(/\s/g, "").toUpperCase()),
    algorithm: "SHA1",
    digits:    6,
    period:    30,
  });
  console.log("✅ Generated TOTP:", totp.generate());
  console.log("Ab Google Authenticator kholo — same hona chahiye");
} catch(e) {
  console.log("❌ Error:", e.message);
}