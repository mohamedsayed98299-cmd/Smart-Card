import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Globe2,
  Loader2,
  MapPin,
  Phone,
  Sparkles,
  Store,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import { supabase } from "../lib/supabase.js";

import {
  DEFAULT_PLAN_ID,
  PLANS,
  getPlanById,
  getPlanByName,
} from "../data/plans.js";

const PENDING_ORDER_KEY = "smart_card_pending_order";

const EMPTY_FORM = {
  shop_name: "",
  responsible: "",
  phone: "",
  whatsapp: "",
  email: "",
  google_review: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  website: "",
  location: "",
  description: "",
  logo_url: "",
};

const CSS = `
.sc-order-page {
  --sc-bg: #050816;
  --sc-bg-2: #091126;
  --sc-card: rgba(12, 20, 43, .78);
  --sc-card-2: rgba(18, 29, 58, .86);
  --sc-border: rgba(255,255,255,.10);
  --sc-border-gold: rgba(215,170,70,.35);
  --sc-gold: #d8aa4a;
  --sc-gold-light: #f1d58d;
  --sc-blue: #3b82f6;
  --sc-blue-light: #60a5fa;
  --sc-text: #f8fafc;
  --sc-muted: #9aa8c2;
  direction: rtl;
  min-height: 100vh;
  color: var(--sc-text);
  background: 
    radial-gradient(circle at 82% 8%, rgba(37,99,235,.20), transparent 28%),
    radial-gradient(circle at 15% 22%, rgba(216,170,74,.11), transparent 25%),
    linear-gradient(145deg, #030611 0%, #071022 48%, #030611 100%);
  padding-bottom: 90px;
  overflow: hidden;
}

.sc-order-page *,
.sc-order-page *::before,
.sc-order-page *::after {
  box-sizing: border-box;
}

.sc-order-shell {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.sc-order-hero {
  position: relative;
  padding: 60px 0 40px;
  text-align: right;
}

.sc-order-hero::before {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  top: -180px;
  right: -160px;
  border-radius: 50%;
  background: rgba(59,130,246,.12);
  filter: blur(80px);
  pointer-events: none;
}

.sc-order-hero-content {
  position: relative;
  max-width: 850px;
}

.sc-order-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(216,170,74,.35);
  border-radius: 999px;
  background: rgba(216,170,74,.08);
  color: var(--sc-gold-light);
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 24px;
}

.sc-order-title {
  margin: 0;
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1.4;
  font-weight: 900;
  color: #ffffff;
}

.sc-order-title span {
  display: inline-block;
  background: linear-gradient(90deg, #ffffff 0%, var(--sc-gold-light) 50%, #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.5;
  padding-top: 6px;
  padding-bottom: 6px;
  word-spacing: 2px;
}

.sc-order-subtitle {
  max-width: 720px;
  margin: 18px 0 0;
  color: var(--sc-muted);
  font-size: 16px;
  line-height: 1.8;
}

.sc-order-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(310px, .75fr);
  gap: 24px;
  align-items: start;
}

.sc-order-main {
  min-width: 0;
}

.sc-order-side {
  min-width: 0;
  position: sticky;
  top: 24px;
}

.sc-order-panel {
  background: 
    linear-gradient(145deg, rgba(15,25,51,.92), rgba(6,13,29,.94));
  border: 1px solid var(--sc-border);
  border-radius: 26px;
  box-shadow: 0 25px 80px rgba(0,0,0,.30);
  overflow: hidden;
}

.sc-order-panel-head {
  padding: 25px 26px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.sc-order-panel-title {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
}

.sc-order-panel-description {
  margin: 7px 0 0;
  color: var(--sc-muted);
  font-size: 13px;
}

.sc-order-section {
  padding: 26px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}

.sc-order-section:last-child {
  border-bottom: 0;
}

.sc-order-section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.sc-order-section-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: var(--sc-gold-light);
  background: rgba(216,170,74,.09);
  border: 1px solid rgba(216,170,74,.20);
  flex: 0 0 auto;
}

.sc-order-section-head h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 900;
}

.sc-order-section-head p {
  margin: 3px 0 0;
  color: var(--sc-muted);
  font-size: 12px;
}

.sc-order-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.sc-order-field {
  min-width: 0;
}

.sc-order-field.full {
  grid-column: 1 / -1;
}

.sc-order-label {
  display: block;
  margin-bottom: 8px;
  color: #dce5f5;
  font-size: 13px;
  font-weight: 800;
}

.sc-order-required {
  color: #f87171;
}

.sc-order-input,
.sc-order-textarea {
  width: 100%;
  border: 1px solid rgba(255,255,255,.10);
  outline: none;
  color: #f8fafc;
  background: rgba(255,255,255,.045);
  border-radius: 13px;
  padding: 13px 14px;
  font-family: inherit;
  font-size: 14px;
  transition: .2s ease;
}

.sc-order-input {
  height: 48px;
}

.sc-order-textarea {
  min-height: 112px;
  resize: vertical;
}

.sc-order-input::placeholder,
.sc-order-textarea::placeholder {
  color: #687894;
}

.sc-order-input:focus,
.sc-order-textarea:focus {
  border-color: rgba(216,170,74,.55);
  background: rgba(255,255,255,.065);
  box-shadow: 0 0 0 3px rgba(216,170,74,.08);
}

.sc-order-plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.sc-order-plan {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 50px 16px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.10);
  background: linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
  cursor: pointer;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}

.sc-order-plan:hover {
  transform: translateY(-3px);
  border-color: rgba(216,170,74,.35);
}

.sc-order-plan.selected {
  border-color: rgba(216,170,74,.85);
  background: linear-gradient(145deg, rgba(216,170,74,.12), rgba(15,25,51,.85));
  box-shadow: 0 12px 35px rgba(0,0,0,.35);
}

.sc-order-plan-header-tags {
  position: absolute;
  top: 14px;
  right: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  pointer-events: none;
}

.sc-order-plan.featured::before {
  content: "الأكثر طلباً";
  padding: 4px 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, #d8aa4a, #f1d58d);
  color: #17120a;
  font-size: 10px;
  font-weight: 900;
  display: inline-block;
}

.sc-order-plan-discount {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(34,197,94,.12);
  border: 1px solid rgba(34,197,94,.30);
  color: #86efac;
  font-size: 10px;
  font-weight: 900;
  margin-right: auto;
}

.sc-order-plan-check {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,.20);
  color: transparent;
  background: rgba(255,255,255,.05);
  z-index: 2;
}

.sc-order-plan.selected .sc-order-plan-check {
  background: var(--sc-gold);
  border-color: var(--sc-gold);
  color: #17120a;
}

.sc-order-plan-name {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
}

.sc-order-plan-text {
  min-height: 38px;
  color: var(--sc-muted);
  font-size: 12px;
  line-height: 1.6;
}

.sc-order-plan-price {
  margin: 14px 0 18px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 28px;
  font-weight: 950;
  color: var(--sc-gold-light);
  border-bottom: 1px solid rgba(255,255,255,.06);
  padding-bottom: 12px;
}

.sc-order-plan-old-price {
  color: #71809a;
  font-size: 13px;
  font-weight: 700;
  text-decoration: line-through;
}

.sc-order-plan-price small {
  font-size: 12px;
  color: var(--sc-muted);
  font-weight: 700;
}

.sc-order-plan-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sc-order-plan-feature {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.5;
  text-align: right;
}

.sc-order-plan-feature svg {
  color: var(--sc-gold);
  flex-shrink: 0;
  margin-top: 2px;
}

.sc-order-social-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 12px;
}

.sc-order-social {
  position: relative;
}

.sc-order-social-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  color: #cbd5e1;
  pointer-events: none;
}

.sc-order-social .sc-order-input {
  padding-right: 45px;
  direction: ltr;
  text-align: left;
}

.sc-order-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 26px;
  background: rgba(0,0,0,.12);
}

.sc-order-submit {
  min-height: 52px;
  border: 0;
  border-radius: 14px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #17120a;
  background: linear-gradient(135deg, #d8aa4a, #f1d58d);
  font-family: inherit;
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 15px 35px rgba(216,170,74,.16);
  transition: .2s ease;
}

.sc-order-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgba(216,170,74,.24);
}

.sc-order-submit:disabled {
  opacity: .65;
  cursor: not-allowed;
}

.sc-order-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #aebbd0;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
}

.sc-order-back:hover {
  color: white;
}

.sc-order-error {
  margin: 0 26px 20px;
  padding: 13px 15px;
  border-radius: 12px;
  color: #fecaca;
  background: rgba(239,68,68,.09);
  border: 1px solid rgba(239,68,68,.22);
  font-size: 13px;
}

.sc-order-preview {
  padding: 18px;
}

.sc-order-preview-card {
  position: relative;
  min-height: 300px;
  border-radius: 25px;
  padding: 22px;
  overflow: hidden;
  background: 
    radial-gradient(circle at 85% 15%, rgba(59,130,246,.40), transparent 30%),
    radial-gradient(circle at 10% 90%, rgba(216,170,74,.24), transparent 35%),
    linear-gradient(145deg, #101d3c, #050a18);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
}

.sc-order-preview-card::before {
  content: "S";
  position: absolute;
  left: -15px;
  bottom: -65px;
  font-size: 240px;
  line-height: 1;
  font-weight: 950;
  color: rgba(255,255,255,.025);
}

.sc-order-preview-brand {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sc-order-preview-logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(216,170,74,.30);
  background: rgba(255,255,255,.07);
  color: var(--sc-gold-light);
  font-size: 20px;
  font-weight: 950;
}

.sc-order-preview-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sc-order-preview-brand-name {
  flex: 1;
  padding-right: 12px;
}

.sc-order-preview-brand-name strong {
  display: block;
  font-size: 16px;
  font-weight: 950;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-order-preview-brand-name span {
  display: block;
  margin-top: 4px;
  color: #8493ae;
  font-size: 10px;
}

.sc-order-preview-chip {
  width: 38px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid rgba(216,170,74,.42);
  background: 
    linear-gradient(90deg, transparent 30%, rgba(216,170,74,.5) 31%, transparent 34%),
    linear-gradient(0deg, transparent 45%, rgba(216,170,74,.45) 46%, transparent 50%),
    rgba(216,170,74,.09);
}

.sc-order-preview-body {
  position: relative;
  margin-top: 55px;
}

.sc-order-preview-title {
  margin: 0;
  font-size: 24px;
  font-weight: 950;
}

.sc-order-preview-review {
  margin-top: 13px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255,255,255,.055);
  border: 1px solid rgba(255,255,255,.08);
}

.sc-order-preview-review strong {
  display: block;
  color: white;
  font-size: 13px;
}

.sc-order-stars {
  margin-top: 7px;
  color: #f5c84c;
  letter-spacing: 2px;
  font-size: 15px;
}

.sc-order-preview-location {
  margin-top: 14px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: #a9b6ca;
  font-size: 11px;
  line-height: 1.6;
}

.sc-order-preview-socials {
  position: relative;
  margin-top: 18px;
  display: flex;
  gap: 7px;
}

.sc-order-preview-socials span {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.07);
  color: #c7d2e4;
}

.sc-order-selected {
  margin-top: 14px;
  padding: 18px;
  border-radius: 19px;
  border: 1px solid rgba(216,170,74,.18);
  background: rgba(216,170,74,.055);
}

.sc-order-selected-label {
  color: var(--sc-muted);
  font-size: 11px;
}

.sc-order-selected-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
}

.sc-order-selected-name {
  font-size: 15px;
  font-weight: 900;
}

.sc-order-selected-price {
  display: flex;
  align-items: baseline;
  gap: 7px;
  color: var(--sc-gold-light);
  font-size: 20px;
  font-weight: 950;
}

.sc-order-selected-old-price {
  color: #71809a;
  font-size: 11px;
  font-weight: 700;
  text-decoration: line-through;
}

.sc-order-selected-price small {
  color: var(--sc-muted);
  font-size: 10px;
}

.sc-order-benefits {
  margin-top: 14px;
  padding: 18px;
  border-radius: 19px;
  background: rgba(255,255,255,.035);
  border: 1px solid rgba(255,255,255,.07);
}

.sc-order-benefits h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 900;
}

.sc-order-benefit {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 9px;
  color: #aebbd0;
  font-size: 12px;
}

.sc-order-benefit svg {
  color: var(--sc-gold);
  flex: 0 0 auto;
}

.sc-order-note {
  margin-top: 14px;
  text-align: center;
  color: #687894;
  font-size: 10px;
  line-height: 1.8;
}

.sc-order-success {
  min-height: 72vh;
  display: grid;
  place-items: center;
  padding: 50px 0;
}

.sc-order-success-box {
  width: min(600px, 100%);
  padding: 45px 30px;
  text-align: center;
  border-radius: 28px;
  border: 1px solid rgba(216,170,74,.24);
  background: 
    radial-gradient(circle at 50% 0%, rgba(216,170,74,.12), transparent 42%),
    rgba(9,17,36,.9);
  box-shadow: 0 30px 90px rgba(0,0,0,.35);
}

.sc-order-success-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #17120a;
  background: linear-gradient(135deg, #d8aa4a, #f1d58d);
}

.sc-order-success-box h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 950;
}

.sc-order-success-box p {
  margin: 14px auto 25px;
  max-width: 450px;
  color: var(--sc-muted);
  line-height: 1.9;
  font-size: 14px;
}

.sc-order-success-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sc-order-success-button {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.sc-order-success-button.primary {
  color: #17120a;
  background: linear-gradient(135deg, #d8aa4a, #f1d58d);
  border: 0;
}

.sc-order-success-button.secondary {
  color: white;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.10);
}

@keyframes sc-order-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1050px) {
  .sc-order-layout {
    grid-template-columns: 1fr;
  }

  .sc-order-side {
    position: static;
  }

  .sc-order-preview-card {
    min-height: 280px;
  }
}

@media (max-width: 760px) {
  .sc-order-shell {
    width: min(100% - 22px, 680px);
  }

  .sc-order-hero {
    padding: 36px 0 20px;
  }

  .sc-order-title {
    font-size: 32px;
  }

  .sc-order-subtitle {
    font-size: 14px;
  }

  .sc-order-form-grid,
  .sc-order-social-grid,
  .sc-order-plans {
    grid-template-columns: 1fr;
  }

  .sc-order-section {
    padding: 20px 17px;
  }

  .sc-order-panel-head {
    padding: 21px 17px;
  }

  .sc-order-actions {
    padding: 19px 17px;
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .sc-order-submit,
  .sc-order-back {
    width: 100%;
  }

  .sc-order-submit {
    min-height: 50px;
  }

  .sc-order-plan {
    min-height: auto;
  }

  .sc-order-error {
    margin-left: 17px;
    margin-right: 17px;
  }
}
`;

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();

  const autoSubmitStartedRef = useRef(false);
  const mountedRef = useRef(true);

  const initialPlanId =
    location.state?.planId ||
    (location.state?.plan
      ? getPlanByName(location.state.plan)?.id
      : DEFAULT_PLAN_ID);

  const [planId, setPlanId] = useState(initialPlanId);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const selectedPlan = getPlanById(planId);

  /*
   * =========================================================
   * حفظ الطلب في Supabase
   * =========================================================
   */
  async function createOrder(currentUser, orderPlan, orderForm) {
    if (!currentUser) {
      throw new Error("USER_NOT_AUTHENTICATED");
    }

    if (!orderPlan) {
      throw new Error("PLAN_NOT_FOUND");
    }

    const { error: insertError } = await supabase
      .from("orders")
      .insert({
        user_id: currentUser.id,

        plan: orderPlan.name,
        plan_price: orderPlan.price,
        plan_old_price: orderPlan.oldPrice,
        discount_text: orderPlan.discount,
        currency: "EGP",

        shop_name: orderForm.shop_name.trim(),
        responsible: orderForm.responsible.trim(),
        phone: orderForm.phone.trim(),

        whatsapp: orderForm.whatsapp?.trim() || null,

        email:
          orderForm.email?.trim() ||
          currentUser.email ||
          null,

        google_review:
          orderForm.google_review?.trim() || null,

        instagram:
          orderForm.instagram?.trim() || null,

        facebook:
          orderForm.facebook?.trim() || null,

        tiktok:
          orderForm.tiktok?.trim() || null,

        youtube:
          orderForm.youtube?.trim() || null,

        website:
          orderForm.website?.trim() || null,

        location:
          orderForm.location?.trim() || null,

        description:
          orderForm.description?.trim() || null,

        logo_url:
          orderForm.logo_url?.trim() || null,

        status: "pending",
      });

    if (insertError) {
      throw insertError;
    }
  }

  /*
   * =========================================================
   * إرسال الطلب المعلق بعد الرجوع من Google
   * =========================================================
   */
  async function submitPendingOrder(currentUser) {
    if (!currentUser) return false;

    if (autoSubmitStartedRef.current) {
      return false;
    }

    const savedOrder = sessionStorage.getItem(PENDING_ORDER_KEY);

    if (!savedOrder) {
      return false;
    }

    autoSubmitStartedRef.current = true;

    try {
      const parsed = JSON.parse(savedOrder);

      const restoredForm = parsed?.form;

      if (!restoredForm) {
        throw new Error("INVALID_PENDING_ORDER");
      }

      const restoredPlanId =
        parsed.planId ||
        (parsed.plan
          ? getPlanByName(parsed.plan)?.id
          : DEFAULT_PLAN_ID);

      const restoredPlan = getPlanById(restoredPlanId);

      if (!restoredPlan) {
        throw new Error("PLAN_NOT_FOUND");
      }

      if (!restoredForm.shop_name?.trim()) {
        throw new Error("SHOP_NAME_REQUIRED");
      }

      if (!restoredForm.responsible?.trim()) {
        throw new Error("RESPONSIBLE_REQUIRED");
      }

      if (!restoredForm.phone?.trim()) {
        throw new Error("PHONE_REQUIRED");
      }

      if (mountedRef.current) {
        setLoading(true);
        setError("");
        setPlanId(restoredPlan.id);
        setForm(restoredForm);
      }

      /*
       * هنا أهم نقطة:
       * بعد نجاح Google Login يتم إرسال الطلب تلقائيًا.
       */
      await createOrder(
        currentUser,
        restoredPlan,
        restoredForm
      );

      /*
       * نحذف الطلب المعلق فقط بعد نجاح الحفظ.
       * لو حصل خطأ، يفضل موجود علشان المستخدم يقدر يحاول تاني.
       */
      sessionStorage.removeItem(PENDING_ORDER_KEY);

      if (mountedRef.current) {
        setLoading(false);

        /*
         * الانتقال المباشر للحساب.
         */
        navigate("/account", {
          replace: true,
          state: {
            orderSubmitted: true,
          },
        });
      }

      return true;
    } catch (submitError) {
      console.error(
        "Automatic pending order submit error:",
        submitError
      );

      /*
       * نرجع السماح بالمحاولة في حالة الخطأ.
       */
      autoSubmitStartedRef.current = false;

      if (mountedRef.current) {
        setLoading(false);

        setError(
          "تم تسجيل الدخول بنجاح، لكن حصلت مشكلة أثناء حفظ الطلب. اضغط إرسال الطلب مرة أخرى."
        );
      }

      return false;
    }
  }

  /*
   * =========================================================
   * تحميل المستخدم + التعامل مع رجوع Google OAuth
   * =========================================================
   */
  useEffect(() => {
    mountedRef.current = true;

    let subscription;

    async function loadUser() {
      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!mountedRef.current) return;

        setUser(currentUser || null);

        /*
         * لو رجعنا من Google والمستخدم عنده طلب معلق:
         * يتم إرساله تلقائيًا.
         */
        if (currentUser) {
          const savedOrder = sessionStorage.getItem(
            PENDING_ORDER_KEY
          );

          if (savedOrder) {
            await submitPendingOrder(currentUser);
          }
        }
      } catch (authError) {
        console.error("Auth load error:", authError);

        if (mountedRef.current) {
          setUser(null);
        }
      } finally {
        if (mountedRef.current) {
          setAuthLoading(false);
        }
      }
    }

    loadUser();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mountedRef.current) return;

        const currentUser = session?.user || null;

        setUser(currentUser);
        setAuthLoading(false);

        /*
         * بعض الأحيان OAuth event يحصل بعد getUser.
         * الـref تمنع إرسال نفس الطلب مرتين.
         */
        if (currentUser) {
          const savedOrder = sessionStorage.getItem(
            PENDING_ORDER_KEY
          );

          if (savedOrder) {
            await submitPendingOrder(currentUser);
          }
        }
      }
    );

    subscription = authSubscription;

    return () => {
      mountedRef.current = false;

      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  /*
   * =========================================================
   * إرسال الطلب يدويًا
   * =========================================================
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.shop_name.trim()) {
      setError("من فضلك اكتب اسم المحل.");
      return;
    }

    if (!form.responsible.trim()) {
      setError("من فضلك اكتب اسم المسؤول.");
      return;
    }

    if (!form.phone.trim()) {
      setError("من فضلك اكتب رقم الهاتف.");
      return;
    }

    if (!selectedPlan) {
      setError("من فضلك اختار الباقة.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      /*
       * =====================================================
       * المستخدم غير مسجل:
       * نحفظ الطلب مؤقتًا ثم نبدأ Google OAuth.
       * =====================================================
       */
      if (!currentUser) {
        sessionStorage.setItem(
          PENDING_ORDER_KEY,
          JSON.stringify({
            plan: selectedPlan.name,
            planId: selectedPlan.id,
            form,
          })
        );

        const redirectTo = import.meta.env.DEV
          ? `${window.location.origin}/order`
          : `${window.location.origin}/Smart-Card/order`;

        const { error: googleError } =
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo,
            },
          });

        if (googleError) {
          throw googleError;
        }

        /*
         * هنا المتصفح هينتقل لـ Google.
         * بعد الرجوع، useEffect + onAuthStateChange
         * هيكملوا إرسال الطلب تلقائيًا.
         */
        return;
      }

      /*
       * المستخدم مسجل بالفعل:
       * نرسل الطلب مباشرة.
       */
      await createOrder(
        currentUser,
        selectedPlan,
        form
      );

      sessionStorage.removeItem(PENDING_ORDER_KEY);

      /*
       * بدل شاشة النجاح القديمة:
       * ندخل مباشرة على الحساب بعد إرسال الطلب.
       */
      navigate("/account", {
        replace: true,
        state: {
          orderSubmitted: true,
        },
      });
    } catch (submitError) {
      console.error(
        "Order submit error:",
        submitError
      );

      if (mountedRef.current) {
        setError(
          "حصلت مشكلة أثناء إرسال الطلب. تأكد من تسجيل الدخول وحاول مرة أخرى."
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }

  function resetOrder() {
    setForm(EMPTY_FORM);
    setPlanId(initialPlanId);
    setError("");
    setSuccess(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * =========================================================
   * شاشة النجاح القديمة - احتياطية فقط
   * =========================================================
   */
  if (success) {
    return (
      <main className="sc-order-page">
        <style>{CSS}</style>

        <div className="sc-order-shell sc-order-success">
          <div className="sc-order-success-box">
            <div className="sc-order-success-icon">
              <CheckCircle2 size={40} />
            </div>

            <h1>تم إرسال طلبك بنجاح</h1>

            <p>
              استلمنا بيانات نشاطك التجاري وباقة{" "}
              <strong>{selectedPlan?.name}</strong>.
              <br />
              هنراجع البيانات ونتواصل معاك لاستكمال التفاصيل.
            </p>

            <div className="sc-order-success-buttons">
              <button
                type="button"
                className="sc-order-success-button primary"
                onClick={resetOrder}
              >
                إرسال طلب جديد
              </button>

              <Link
                to="/"
                className="sc-order-success-button secondary"
              >
                العودة للرئيسية
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * الواجهة
   * =========================================================
   */
  return (
    <main className="sc-order-page">
      <style>{CSS}</style>

      <section className="sc-order-hero">
        <div className="sc-order-shell">
          <div className="sc-order-hero-content">
            <div className="sc-order-badge">
              <Sparkles size={15} />
              ابدأ Smart Card لنشاطك
            </div>

            <h1 className="sc-order-title">
              خلى نشاطك التجاري
              <br />
              <span>أذكى وأسهل في التواصل</span>
            </h1>

            <p className="sc-order-subtitle">
              اختار الباقة المناسبة، اكتب بيانات نشاطك، وإحنا نستلم الطلب ونجهز لك تجربة Smart Card الخاصة بنشاطك.
            </p>
          </div>
        </div>
      </section>

      <div className="sc-order-shell">
        <form onSubmit={handleSubmit}>
          <div className="sc-order-layout">
            <div className="sc-order-main">
              <section className="sc-order-panel">
                <div className="sc-order-panel-head">
                  <h2 className="sc-order-panel-title">
                    بيانات الطلب
                  </h2>

                  <p className="sc-order-panel-description">
                    املأ البيانات الأساسية لنبدأ تجهيز Smart Card.
                  </p>
                </div>

                <div className="sc-order-section">
                  <div className="sc-order-section-head">
                    <div className="sc-order-section-icon">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <h3>اختار الباقة</h3>

                      <p>
                        تقدر تغير اختيارك في أي وقت قبل إرسال الطلب.
                      </p>
                    </div>
                  </div>

                  <div className="sc-order-plans">
                    {PLANS.map((item) => {
                      const selected = item.id === planId;

                      return (
                        <div
                          key={item.name}
                          className={[
                            "sc-order-plan",
                            selected ? "selected" : "",
                            item.featured ? "featured" : "",
                          ].join(" ")}
                          onClick={() => setPlanId(item.id)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={selected}
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" ||
                              event.key === " "
                            ) {
                              event.preventDefault();
                              setPlanId(item.id);
                            }
                          }}
                        >
                          <div className="sc-order-plan-header-tags">
                            {item.discount && (
                              <div className="sc-order-plan-discount">
                                {item.discount}
                              </div>
                            )}
                          </div>

                          <div className="sc-order-plan-check">
                            {selected && <Check size={14} />}
                          </div>

                          <div className="sc-order-plan-name">
                            {item.name}
                          </div>

                          <div className="sc-order-plan-text">
                            {item.shortDescription ||
                              item.description}
                          </div>

                          <div className="sc-order-plan-price">
                            <span>
                              {item.price}
                              <small> جنيه</small>
                            </span>

                            {item.oldPrice && (
                              <span className="sc-order-plan-old-price">
                                {item.oldPrice} جنيه
                              </span>
                            )}
                          </div>

                          <div className="sc-order-plan-features">
                            {item.features
                              .slice(0, 4)
                              .map((feature) => (
                                <div
                                  className="sc-order-plan-feature"
                                  key={feature}
                                >
                                  <Check size={13} />
                                  <span>{feature}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="sc-order-section">
                  <div className="sc-order-section-head">
                    <div className="sc-order-section-icon">
                      <Store size={20} />
                    </div>

                    <div>
                      <h3>بيانات النشاط التجاري</h3>

                      <p>
                        البيانات الأساسية التي ستظهر في صفحة نشاطك.
                      </p>
                    </div>
                  </div>

                  <div className="sc-order-form-grid">
                    <div className="sc-order-field">
                      <label className="sc-order-label">
                        اسم المحل{" "}
                        <span className="sc-order-required">
                          *
                        </span>
                      </label>

                      <input
                        className="sc-order-input"
                        value={form.shop_name}
                        onChange={(e) =>
                          updateField(
                            "shop_name",
                            e.target.value
                          )
                        }
                        placeholder="مثال: مطعم النيل"
                      />
                    </div>

                    <div className="sc-order-field">
                      <label className="sc-order-label">
                        اسم المسؤول{" "}
                        <span className="sc-order-required">
                          *
                        </span>
                      </label>

                      <input
                        className="sc-order-input"
                        value={form.responsible}
                        onChange={(e) =>
                          updateField(
                            "responsible",
                            e.target.value
                          )
                        }
                        placeholder="اسم صاحب أو مسؤول النشاط"
                      />
                    </div>

                    <div className="sc-order-field">
                      <label className="sc-order-label">
                        الهاتف{" "}
                        <span className="sc-order-required">
                          *
                        </span>
                      </label>

                      <input
                        className="sc-order-input"
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="01xxxxxxxxx"
                        dir="ltr"
                      />
                    </div>

                    <div className="sc-order-field">
                      <label className="sc-order-label">
                        WhatsApp
                      </label>

                      <input
                        className="sc-order-input"
                        type="tel"
                        value={form.whatsapp}
                        onChange={(e) =>
                          updateField(
                            "whatsapp",
                            e.target.value
                          )
                        }
                        placeholder="رقم الواتساب"
                        dir="ltr"
                      />
                    </div>

                    <div className="sc-order-field">
                      <label className="sc-order-label">
                        البريد الإلكتروني
                      </label>

                      <input
                        className="sc-order-input"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="example@email.com"
                        dir="ltr"
                      />
                    </div>

                    <div className="sc-order-field">
                      <label className="sc-order-label">
                        الموقع
                      </label>

                      <input
                        className="sc-order-input"
                        value={form.location}
                        onChange={(e) =>
                          updateField(
                            "location",
                            e.target.value
                          )
                        }
                        placeholder="العنوان أو رابط Google Maps"
                      />
                    </div>

                    <div className="sc-order-field full">
                      <label className="sc-order-label">
                        وصف النشاط
                      </label>

                      <textarea
                        className="sc-order-textarea"
                        value={form.description}
                        onChange={(e) =>
                          updateField(
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="اكتب وصفًا مختصرًا عن النشاط..."
                      />
                    </div>

                    <div className="sc-order-field full">
                      <label className="sc-order-label">
                        رابط اللوجو
                      </label>

                      <input
                        className="sc-order-input"
                        value={form.logo_url}
                        onChange={(e) =>
                          updateField(
                            "logo_url",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="sc-order-section">
                  <div className="sc-order-section-head">
                    <div className="sc-order-section-icon">
                      <Globe2 size={20} />
                    </div>

                    <div>
                      <h3>روابط النشاط</h3>

                      <p>
                        الروابط التي تريد ظهورها في صفحة Smart Card.
                      </p>
                    </div>
                  </div>

                  <div className="sc-order-field full">
                    <label className="sc-order-label">
                      Google Reviews
                    </label>

                    <input
                      className="sc-order-input"
                      value={form.google_review}
                      onChange={(e) =>
                        updateField(
                          "google_review",
                          e.target.value
                        )
                      }
                      placeholder="رابط Google Reviews"
                      dir="ltr"
                    />
                  </div>

                  <div
                    className="sc-order-social-grid"
                    style={{ marginTop: 16 }}
                  >
                    <div className="sc-order-social">
                      <span className="sc-order-social-icon">
                        <FaInstagram />
                      </span>

                      <input
                        className="sc-order-input"
                        value={form.instagram}
                        onChange={(e) =>
                          updateField(
                            "instagram",
                            e.target.value
                          )
                        }
                        placeholder="Instagram"
                      />
                    </div>

                    <div className="sc-order-social">
                      <span className="sc-order-social-icon">
                        <FaFacebookF />
                      </span>

                      <input
                        className="sc-order-input"
                        value={form.facebook}
                        onChange={(e) =>
                          updateField(
                            "facebook",
                            e.target.value
                          )
                        }
                        placeholder="Facebook"
                      />
                    </div>

                    <div className="sc-order-social">
                      <span className="sc-order-social-icon">
                        <FaTiktok />
                      </span>

                      <input
                        className="sc-order-input"
                        value={form.tiktok}
                        onChange={(e) =>
                          updateField(
                            "tiktok",
                            e.target.value
                          )
                        }
                        placeholder="TikTok"
                      />
                    </div>

                    <div className="sc-order-social">
                      <span className="sc-order-social-icon">
                        <FaYoutube />
                      </span>

                      <input
                        className="sc-order-input"
                        value={form.youtube}
                        onChange={(e) =>
                          updateField(
                            "youtube",
                            e.target.value
                          )
                        }
                        placeholder="YouTube"
                      />
                    </div>

                    <div className="sc-order-social">
                      <span className="sc-order-social-icon">
                        <Globe2 size={16} />
                      </span>

                      <input
                        className="sc-order-input"
                        value={form.website}
                        onChange={(e) =>
                          updateField(
                            "website",
                            e.target.value
                          )
                        }
                        placeholder="Website"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="sc-order-error">
                    {error}
                  </div>
                )}

                <div className="sc-order-actions">
                  <Link
                    to="/pricing"
                    className="sc-order-back"
                  >
                    <ArrowLeft size={16} />
                    العودة للباقات
                  </Link>

                  <button
                    type="submit"
                    className="sc-order-submit"
                    disabled={loading || authLoading}
                  >
                    {loading || authLoading ? (
                      <>
                        <Loader2
                          size={18}
                          style={{
                            animation:
                              "sc-order-spin 1s linear infinite",
                          }}
                        />
                        جاري التجهيز...
                      </>
                    ) : user ? (
                      <>
                        إرسال طلب Smart Card
                        <ArrowLeft size={18} />
                      </>
                    ) : (
                      <>
                        تسجيل الدخول وإرسال الطلب
                        <ArrowLeft size={18} />
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>

            <aside className="sc-order-side">
              <div className="sc-order-panel">
                <div className="sc-order-panel-head">
                  <h2 className="sc-order-panel-title">
                    معاينة Smart Card
                  </h2>

                  <p className="sc-order-panel-description">
                    شكل تقريبي لتجربة العميل بعد تجهيز الصفحة.
                  </p>
                </div>

                <div className="sc-order-preview">
                  <div className="sc-order-preview-card">
                    <div className="sc-order-preview-brand">
                      <div className="sc-order-preview-logo">
                        {form.logo_url ? (
                          <img
                            src={form.logo_url}
                            alt=""
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          "S"
                        )}
                      </div>

                      <div className="sc-order-preview-brand-name">
                        <strong>
                          {form.shop_name.trim() ||
                            "اسم نشاطك"}
                        </strong>

                        <span>Smart Card</span>
                      </div>

                      <div className="sc-order-preview-chip" />
                    </div>

                    <div className="sc-order-preview-body">
                      <h3 className="sc-order-preview-title">
                        {form.shop_name.trim() ||
                          "نشاطك التجاري"}
                      </h3>

                      <div className="sc-order-preview-review">
                        <strong>
                          قيّم تجربتك معنا
                        </strong>

                        <div className="sc-order-stars">
                          ★★★★★
                        </div>
                      </div>

                      {(form.location ||
                        form.phone) && (
                        <div className="sc-order-preview-location">
                          {form.location ? (
                            <>
                              <MapPin size={14} />
                              <span>
                                {form.location}
                              </span>
                            </>
                          ) : (
                            <>
                              <Phone size={14} />
                              <span>
                                {form.phone}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="sc-order-preview-socials">
                        <span>
                          <FaGoogleFallback />
                        </span>

                        <span>
                          <FaWhatsapp />
                        </span>

                        <span>
                          <FaInstagram />
                        </span>

                        <span>
                          <FaFacebookF />
                        </span>

                        <span>
                          <FaTiktok />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sc-order-selected">
                    <div className="sc-order-selected-label">
                      الباقة المختارة
                    </div>

                    <div className="sc-order-selected-row">
                      <div className="sc-order-selected-name">
                        {selectedPlan?.name}
                      </div>

                      <div className="sc-order-selected-price">
                        <span>
                          {selectedPlan?.price}
                          <small> جنيه</small>
                        </span>

                        {selectedPlan?.oldPrice && (
                          <span className="sc-order-selected-old-price">
                            {selectedPlan.oldPrice} جنيه
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sc-order-benefits">
                    <h4>
                      إيه اللي هيحصل بعد الطلب؟
                    </h4>

                    <div className="sc-order-benefit">
                      <Check size={15} />
                      مراجعة بيانات النشاط
                    </div>

                    <div className="sc-order-benefit">
                      <Check size={15} />
                      تجهيز صفحة Smart Card
                    </div>

                    <div className="sc-order-benefit">
                      <Check size={15} />
                      تجهيز QR + NFC
                    </div>

                    <div className="sc-order-benefit">
                      <Check size={15} />
                      التواصل معاك لاستكمال الطلب
                    </div>
                  </div>

                  <div className="sc-order-note">
                    أنت لا تحتاج لطباعة أو إنشاء أي شيء بنفسك.
                    <br />
                    فريق Smart Card يتولى تجهيز الكارت والصفحة.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

function FaGoogleFallback() {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 950,
        color: "#facc15",
        fontFamily: "Arial, sans-serif",
      }}
    >
      G
    </span>
  );
}