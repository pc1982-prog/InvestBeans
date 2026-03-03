// src/services/testimonialService.ts

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API = `${BASE_URL}/testimonials`;

export interface Testimonial {
  _id: string;
  user: { _id: string; name: string; email: string };
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  preview: string;
  fullText: string;
  tag: string;
  source: string;
  createdAt: string;
}

// ─── GET all testimonials (public) ────────────────────────────────────────
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(API, { credentials: "include" });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch testimonials");
  return data.data;
}

// ─── GET my testimonial (authenticated) ───────────────────────────────────
export async function getMyTestimonial(): Promise<Testimonial | null> {
  const res = await fetch(`${API}/my`, { credentials: "include" });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch your review");
  return data.data;
}

// ─── CREATE testimonial (authenticated) ───────────────────────────────────
export async function createTestimonial(
  payload: Omit<Testimonial, "_id" | "user" | "avatar" | "createdAt">
): Promise<Testimonial> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to create review");
  return data.data;
}

// ─── UPDATE testimonial (owner) ───────────────────────────────────────────
export async function updateTestimonial(
  id: string,
  payload: Partial<Omit<Testimonial, "_id" | "user" | "avatar" | "createdAt">>
): Promise<Testimonial> {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to update review");
  return data.data;
}

// ─── DELETE testimonial (admin) ───────────────────────────────────────────
export async function deleteTestimonial(id: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to delete review");
}