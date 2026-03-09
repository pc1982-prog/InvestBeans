import mongoose from "mongoose";

const ipoSchema = new mongoose.Schema(
  {
    companyName:        { type: String, required: true, trim: true },
    logo:               { type: String, trim: true, maxlength: 3, default: "" },
    industry:           { type: String, trim: true, default: "" },
    // "listed" removed — only upcoming | open | closed
    status:             { type: String, enum: ["upcoming","open","closed"], default: "upcoming" },
    category:           { type: String, enum: ["Mainboard","SME"], default: "Mainboard" },
    exchange:           { type: String, enum: ["NSE / BSE","NSE","BSE","NSE SME","BSE SME"], default: "NSE / BSE" },
    openDate:           { type: String, required: true },
    closeDate:          { type: String, required: true },
    allotmentDate:      { type: String, default: "" },
    refundDate:         { type: String, default: "" },
    listingDate:        { type: String, default: "" },
    priceRange:         { type: String, required: true },
    lotSize:            { type: Number, required: true, min: 1 },
    issueSize:          { type: String, required: true },
    minInvestment:      { type: String, required: true },
    subscriptionStatus: { type: String, default: "" },
    listingGain:        { type: Number, default: null },
    gmp:                { type: Number, default: null },
    rating:             { type: Number, min: 1, max: 5, default: 3 },
    rhpLink:            { type: String, default: "" },
    // SWOT Analysis — admin-entered arrays of strings
    swot: {
      strengths:     { type: [String], default: [] },
      weaknesses:    { type: [String], default: [] },
      opportunities: { type: [String], default: [] },
      threats:       { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Auto-generate logo from company name if not set
ipoSchema.pre("save", function (next) {
  if (!this.logo && this.companyName) {
    this.logo = this.companyName
      .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }
  next();
});

export const IPO = mongoose.model("IPO", ipoSchema);