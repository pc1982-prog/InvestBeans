
export type IPOStatus = "upcoming" | "open" | "closed" | "listed";
export type ExchangeType = "NSE / BSE" | "NSE" | "BSE" | "NSE SME" | "BSE SME";

export interface IPO {
  _id: string;
  companyName: string;
  logo: string;
  industry: string;
  status: IPOStatus;
  openDate: string;
  closeDate: string;
  listingDate?: string;
  priceRange: string;
  lotSize: number;
  issueSize: string;
  minInvestment: string;
  subscriptionStatus?: string;
  listingGain?: number | null;
  gmp?: number | null;
  allotmentDate?: string;
  refundDate?: string;
  exchange: ExchangeType;
  rating: number;
  rhpLink?: string;
  category?: string;
  createdAt?: string;
}

export interface IPOCounts {
  open: number;
  upcoming: number;
  closed: number;
  listed: number;
  total: number;
}

export const EMPTY_FORM: Omit<IPO, "_id"> = {
  companyName: "",
  logo: "",
  industry: "",
  status: "upcoming",
  category: "Mainboard",
  exchange: "NSE / BSE",
  openDate: "",
  closeDate: "",
  allotmentDate: "",
  refundDate: "",
  listingDate: "",
  priceRange: "",
  lotSize: 0,
  issueSize: "",
  minInvestment: "",
  subscriptionStatus: "",
  listingGain: null,
  gmp: null,
  rating: 3,
  rhpLink: "",
};

export const INDUSTRIES = [
  "IT Services", "Defence & Aerospace", "FMCG & Retail", "Automobile Components",
  "Renewable Energy", "Electric Vehicles", "Pharmaceuticals", "Solar Manufacturing",
  "Food Delivery & Tech", "E-Commerce & Beauty", "Banking & Finance", "Infrastructure",
  "Healthcare", "Real Estate", "Telecom", "Insurance", "Chemicals", "Textiles",
  "Retail", "Logistics", "Media & Entertainment", "Other",
];

export const STATUS_CONFIG = {
  upcoming: { bg: "bg-blue-500/10",   text: "text-blue-500",   border: "border-blue-500/20",   label: "Upcoming" },
  open:     { bg: "bg-green-500/10",  text: "text-green-500",  border: "border-green-500/20",  label: "Open Now" },
  closed:   { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20", label: "Closed"   },
  listed:   { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", label: "Listed"   },
};

export function genLogo(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";
export const IPO_API = `${API_BASE}/ipo`;

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `API Error ${res.status}`);
  }
  return json.data;
}