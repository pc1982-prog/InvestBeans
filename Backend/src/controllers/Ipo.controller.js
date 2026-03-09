import { IPO } from "../models/Ipo.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/v1/ipo?status=open&search=tata&sort=gmp&category=SME
const getAllIPOs = asyncHandler(async (req, res) => {
  const { status, search, sort, category } = req.query;
  const filter = {};

  // "listed" removed from valid statuses
  if (status && ["upcoming","open","closed"].includes(status)) {
    filter.status = status;
  }
  if (search?.trim()) {
    filter.$or = [
      { companyName: { $regex: search.trim(), $options: "i" } },
      { industry:    { $regex: search.trim(), $options: "i" } },
    ];
  }
  if (category && ["Mainboard","SME"].includes(category)) {
    filter.category = category;
  }

  let sortOption = { createdAt: -1 };
  if (sort === "gmp")    sortOption = { gmp: -1, createdAt: -1 };
  if (sort === "rating") sortOption = { rating: -1, createdAt: -1 };

  const ipos = await IPO.find(filter).sort(sortOption).lean();

  // "listed" count removed
  const counts = {
    open:     await IPO.countDocuments({ status: "open" }),
    upcoming: await IPO.countDocuments({ status: "upcoming" }),
    closed:   await IPO.countDocuments({ status: "closed" }),
    total:    await IPO.countDocuments(),
  };

  return res.status(200).json(new ApiResponse(200, { ipos, counts }, "IPOs fetched"));
});

// GET /api/v1/ipo/:id
const getIPOById = asyncHandler(async (req, res) => {
  const ipo = await IPO.findById(req.params.id).lean();
  if (!ipo) throw new ApiError(404, "IPO not found");
  return res.status(200).json(new ApiResponse(200, ipo, "IPO fetched"));
});

// POST /api/v1/ipo
const createIPO = asyncHandler(async (req, res) => {
  const {
    companyName, logo, industry, status, category, exchange,
    openDate, closeDate, allotmentDate, refundDate, listingDate,
    priceRange, lotSize, issueSize, minInvestment,
    subscriptionStatus, listingGain, gmp, rating, rhpLink, swot,
  } = req.body;

  // Validation
  if (!companyName?.trim())   throw new ApiError(400, "companyName is required");
  if (!openDate?.trim())      throw new ApiError(400, "openDate is required");
  if (!closeDate?.trim())     throw new ApiError(400, "closeDate is required");
  if (!priceRange?.trim())    throw new ApiError(400, "priceRange is required");
  if (!issueSize?.trim())     throw new ApiError(400, "issueSize is required");
  if (!minInvestment?.trim()) throw new ApiError(400, "minInvestment is required");
  if (!lotSize || isNaN(Number(lotSize)) || Number(lotSize) < 1)
    throw new ApiError(400, "lotSize must be a valid positive number");

  // Reject "listed" status
  const validStatuses = ["upcoming","open","closed"];
  if (status && !validStatuses.includes(status))
    throw new ApiError(400, `Invalid status. Allowed: ${validStatuses.join(", ")}`);

  const ipo = await IPO.create({
    companyName:        companyName.trim(),
    logo:               logo?.trim().toUpperCase() || "",
    industry:           industry?.trim() || "",
    status:             status || "upcoming",
    category:           category || "Mainboard",
    exchange:           exchange || "NSE / BSE",
    openDate:           openDate.trim(),
    closeDate:          closeDate.trim(),
    allotmentDate:      allotmentDate?.trim() || "",
    refundDate:         refundDate?.trim() || "",
    listingDate:        listingDate?.trim() || "",
    priceRange:         priceRange.trim(),
    lotSize:            Number(lotSize),
    issueSize:          issueSize.trim(),
    minInvestment:      minInvestment.trim(),
    subscriptionStatus: subscriptionStatus?.trim() || "",
    listingGain:        (listingGain !== undefined && listingGain !== "" && listingGain !== null) ? Number(listingGain) : null,
    gmp:                (gmp !== undefined && gmp !== "" && gmp !== null) ? Number(gmp) : null,
    rating:             rating ? Number(rating) : 3,
    rhpLink:            rhpLink?.trim() || "",
    swot: {
      strengths:     Array.isArray(swot?.strengths)     ? swot.strengths.filter(Boolean)     : [],
      weaknesses:    Array.isArray(swot?.weaknesses)    ? swot.weaknesses.filter(Boolean)    : [],
      opportunities: Array.isArray(swot?.opportunities) ? swot.opportunities.filter(Boolean) : [],
      threats:       Array.isArray(swot?.threats)       ? swot.threats.filter(Boolean)       : [],
    },
  });

  console.log("✅ IPO created:", ipo.companyName);
  return res.status(201).json(new ApiResponse(201, ipo, "IPO created successfully"));
});

// PUT /api/v1/ipo/:id
const updateIPO = asyncHandler(async (req, res) => {
  const ipo = await IPO.findById(req.params.id);
  if (!ipo) throw new ApiError(404, "IPO not found");

  // Reject "listed" status on update too
  if (req.body.status && !["upcoming","open","closed"].includes(req.body.status))
    throw new ApiError(400, "Invalid status. Allowed: upcoming, open, closed");

  const fields = [
    "companyName","logo","industry","status","category","exchange",
    "openDate","closeDate","allotmentDate","refundDate","listingDate",
    "priceRange","lotSize","issueSize","minInvestment",
    "subscriptionStatus","listingGain","gmp","rating","rhpLink",
  ];

  // Handle swot separately (nested object)
  if (req.body.swot) {
    ipo.swot = {
      strengths:     Array.isArray(req.body.swot.strengths)     ? req.body.swot.strengths.filter(Boolean)     : ipo.swot?.strengths     || [],
      weaknesses:    Array.isArray(req.body.swot.weaknesses)    ? req.body.swot.weaknesses.filter(Boolean)    : ipo.swot?.weaknesses    || [],
      opportunities: Array.isArray(req.body.swot.opportunities) ? req.body.swot.opportunities.filter(Boolean) : ipo.swot?.opportunities || [],
      threats:       Array.isArray(req.body.swot.threats)       ? req.body.swot.threats.filter(Boolean)       : ipo.swot?.threats       || [],
    };
  }

  fields.forEach((f) => {
    if (req.body[f] === undefined) return;
    if (["lotSize","rating"].includes(f)) ipo[f] = Number(req.body[f]);
    else if (["listingGain","gmp"].includes(f))
      ipo[f] = (req.body[f] !== "" && req.body[f] !== null) ? Number(req.body[f]) : null;
    else ipo[f] = req.body[f];
  });

  await ipo.save();
  console.log("✅ IPO updated:", ipo.companyName);
  return res.status(200).json(new ApiResponse(200, ipo, "IPO updated successfully"));
});

// DELETE /api/v1/ipo/:id
const deleteIPO = asyncHandler(async (req, res) => {
  const ipo = await IPO.findById(req.params.id);
  if (!ipo) throw new ApiError(404, "IPO not found");
  await ipo.deleteOne();
  console.log("✅ IPO deleted:", ipo.companyName);
  return res.status(200).json(new ApiResponse(200, { id: req.params.id }, "IPO deleted"));
});

export { getAllIPOs, getIPOById, createIPO, updateIPO, deleteIPO };