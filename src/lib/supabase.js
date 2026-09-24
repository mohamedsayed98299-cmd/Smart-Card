import { createClient } from "@supabase/supabase-js";

/**
 * ============================================================
 * SMART CARD - SUPABASE CLIENT
 * ============================================================
 *
 * This file is the single source of truth for:
 * - Supabase connection
 * - Public domain
 * - Shop URLs
 * - Slug generation
 * - Card number generation
 * - URL normalization
 * - WhatsApp phone normalization
 */

// ============================================================
// ENVIRONMENT
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase environment variables are missing. تأكد من ملف .env.local"
  );
}

// ============================================================
// SUPABASE CLIENT
// ============================================================

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ============================================================
// PUBLIC DOMAIN
// ============================================================

export const PUBLIC_DOMAIN =
  import.meta.env.VITE_PUBLIC_DOMAIN ||
  window.location.origin;


// ============================================================
// SHOP URL
// ============================================================

export function buildShopUrl(slug) {
  if (!slug) return PUBLIC_DOMAIN;

  return `${PUBLIC_DOMAIN}/shop/${encodeURIComponent(slug)}`;
}


// ============================================================
// SLUG GENERATOR
// ============================================================

export function generateSlug(shopName = "shop") {
  const base = String(shopName)
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32)
    .replace(/^-|-$/g, "");

  const timestamp = Date.now().toString(36);

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 7);

  return `${base || "shop"}-${timestamp}-${randomPart}`;
}


// ============================================================
// CARD NUMBER GENERATOR
// ============================================================

export function generateCardNumber() {
  const timestamp = Date.now();

  const randomNumber = Math.floor(
    Math.random() * 900 + 100
  );

  return `SC-${timestamp}-${randomNumber}`;
}


// ============================================================
// URL NORMALIZER
// ============================================================

export function normalizeUrl(value) {
  if (!value) return null;

  const trimmed = String(value).trim();

  if (!trimmed) return null;

  // Already has a supported protocol
  if (
    /^(https?:|tel:|mailto:)/i.test(trimmed)
  ) {
    return trimmed;
  }

  // Common domain formats
  if (
    /^(www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(
      trimmed
    )
  ) {
    return `https://${trimmed}`;
  }

  return trimmed;
}


// ============================================================
// WHATSAPP PHONE NORMALIZER
// ============================================================

export function normalizePhoneForWhatsapp(value) {
  if (!value) return null;

  const phone = String(value).replace(/\D/g, "");

  return phone || null;
}


// ============================================================
// WHATSAPP URL
// ============================================================

export function buildWhatsAppUrl(
  phone,
  message = ""
) {
  const normalizedPhone =
    normalizePhoneForWhatsapp(phone);

  if (!normalizedPhone) return null;

  const encodedMessage =
    encodeURIComponent(message);

  return `https://wa.me/${normalizedPhone}${
    encodedMessage
      ? `?text=${encodedMessage}`
      : ""
  }`;
}


// ============================================================
// SHOP EVENT TYPES
// ============================================================

export const SHOP_EVENT_TYPES = {
  PAGE_VIEW: "page_view",
  WHATSAPP_CLICK: "whatsapp_click",
  GOOGLE_REVIEW_CLICK: "google_review_click",
  INSTAGRAM_CLICK: "instagram_click",
  FACEBOOK_CLICK: "facebook_click",
  TIKTOK_CLICK: "tiktok_click",
  YOUTUBE_CLICK: "youtube_click",
  WEBSITE_CLICK: "website_click",
  MAP_CLICK: "map_click",
  SHARE: "share",
};


// ============================================================
// ORDER STATUS
// ============================================================

export const ORDER_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  APPROVED: "approved",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};


// ============================================================
// CARD STATUS
// ============================================================

export const CARD_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
};


// ============================================================
// SAFE ERROR MESSAGE
// ============================================================

export function getSupabaseErrorMessage(error) {
  if (!error) {
    return "حدث خطأ غير معروف.";
  }

  if (typeof error === "string") {
    return error;
  }

  return (
    error.message ||
    error.details ||
    error.hint ||
    "حدث خطأ أثناء الاتصال بقاعدة البيانات."
  );
}