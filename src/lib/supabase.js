import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase env vars are missing. تأكد من ملف .env.local"
  );
}

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

export const PUBLIC_DOMAIN =
  import.meta.env.VITE_PUBLIC_DOMAIN ||
  window.location.origin;

export function buildShopUrl(slug) {
  return `${PUBLIC_DOMAIN}/shop/${encodeURIComponent(slug)}`;
}

export function generateSlug(
  shopName = "shop"
) {
  const base = String(shopName)
    .trim()
    .toLowerCase()
    .replace(
      /[^\u0600-\u06FFa-z0-9\s-]/g,
      ""
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32)
    .replace(/^-|-$/g, "");

  return `${
    base || "shop"
  }-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function generateCardNumber() {
  return `SC-${Date.now()}-${Math.floor(
    Math.random() * 900 + 100
  )}`;
}

export function normalizeUrl(value) {
  if (!value) return null;

  const trimmed = String(value).trim();

  if (!trimmed) return null;

  if (
    /^(https?:|tel:|mailto:)/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  if (
    /^(www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(
      trimmed
    )
  ) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function normalizePhoneForWhatsapp(
  value
) {
  if (!value) return null;

  return String(value).replace(/\D/g, "");
}