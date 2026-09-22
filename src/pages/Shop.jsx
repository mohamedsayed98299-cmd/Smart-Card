import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowUpLeft,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Share2,
  Star,
  Store,
} from "lucide-react";

import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import { supabase, normalizePhoneForWhatsapp, normalizeUrl } from "../lib/supabase.js";

import "./shop.css";

const SOCIALS = [
  {
    key: "instagram",
    label: "Instagram",
    subtitle: "تابعنا على إنستجرام",
    icon: FaInstagram,
    className: "instagram",
  },
  {
    key: "facebook",
    label: "Facebook",
    subtitle: "تابعنا على فيسبوك",
    icon: FaFacebookF,
    className: "facebook",
  },
  {
    key: "tiktok",
    label: "TikTok",
    subtitle: "تابعنا على تيك توك",
    icon: FaTiktok,
    className: "tiktok",
  },
  {
    key: "youtube",
    label: "YouTube",
    subtitle: "شاهدنا على يوتيوب",
    icon: FaYoutube,
    className: "youtube",
  },
];

export default function Shop() {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [status, setStatus] = useState("loading");
  const [copied, setCopied] = useState(false);

  const logEvent = useCallback(async (eventType, shopId) => {
    if (!shopId) return;

    try {
      await supabase.from("shop_events").insert({
        shop_id: shopId,
        event_type: eventType,
      });
    } catch {
      // Analytics must never block the public page.
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadShop() {
      setStatus("loading");

      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        console.error(error);
        setStatus("error");
        return;
      }

      if (!data) {
        setStatus("notfound");
        return;
      }

      setShop(data);
      setStatus("ready");

      logEvent("page_view", data.id);
    }

    loadShop();

    return () => {
      alive = false;
    };
  }, [slug, logEvent]);

  const socials = useMemo(() => {
    return SOCIALS.filter((item) => shop?.[item.key]);
  }, [shop]);

  const open = (eventType, value, platform = null) => {
    if (!shop || !value) return;

    logEvent(eventType, shop.id);

    let target = String(value).trim();

    if (!target) return;

    // لو الرابط كامل بالفعل
    if (/^https?:\/\//i.test(target)) {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

    // لو رابط بدون https://
    if (/^(www\.|instagram\.com|facebook\.com|tiktok\.com|youtube\.com)/i.test(target)) {
      window.open(`https://${target}`, "_blank", "noopener,noreferrer");
      return;
    }

    // روابط السوشيال المختصرة مثل @username أو username
    if (platform === "instagram") {
      target = target.replace(/^@/, "");
      window.open(`https://www.instagram.com/${target}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "facebook") {
      target = target.replace(/^@/, "");
      window.open(`https://www.facebook.com/${target}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "tiktok") {
      target = target.replace(/^@/, "");
      window.open(`https://www.tiktok.com/@${target}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "youtube") {
      target = target.replace(/^@/, "");
      window.open(`https://www.youtube.com/@${target}`, "_blank", "noopener,noreferrer");
      return;
    }

    // أي رابط عادي آخر
    const normalized = normalizeUrl(target);

    if (normalized) {
      window.open(normalized, "_blank", "noopener,noreferrer");
    }
  };

  const call = () => {
    if (!shop?.phone) return;

    logEvent("phone_click", shop.id);

    window.location.href = `tel:${shop.phone}`;
  };

  const whatsapp = () => {
    const phone = normalizePhoneForWhatsapp(
      shop?.whatsapp || shop?.phone
    );

    if (!phone) return;

    logEvent("whatsapp_click", shop.id);

    window.open(
      `https://wa.me/${phone}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openMap = () => {
    if (!shop?.location) return;

    logEvent("location_click", shop.id);

    const target = normalizeUrl(shop.location);

    if (target?.startsWith("http")) {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        shop.location
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const sharePage = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shop?.name || "Smart Card",
          text: `تواصل مع ${shop?.name || "هذا النشاط"}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1800);
      }

      logEvent("share", shop?.id);
    } catch {
      // User cancelled share.
    }
  };

  if (status === "loading") {
    return (
      <div className="shop-page-state">
        <div className="shop-loader" />
        <strong>جاري تحميل الصفحة...</strong>
        <span>لحظات ونكون جاهزين</span>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="shop-page-state">
        <div className="shop-state-icon">
          <Store size={34} />
        </div>

        <h2>النشاط غير موجود</h2>

        <p>
          الرابط غير صحيح أو الصفحة غير مفعّلة حاليًا.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="shop-page-state">
        <div className="shop-state-icon danger">
          !
        </div>

        <h2>حدث خطأ</h2>

        <p>
          تعذر تحميل صفحة النشاط. حاول مرة أخرى.
        </p>
      </div>
    );
  }

  return (
    <main className="smart-shop-page">
      <div className="shop-bg-glow glow-one" />
      <div className="shop-bg-glow glow-two" />

      <div className="shop-container">

        {/* Top Brand */}
        <header className="shop-topbar">
          <div className="shop-brand">
            <div className="shop-brand-logo">S</div>

            <div>
              <strong>Smart Card</strong>
              <span>DIGITAL BUSINESS PROFILE</span>
            </div>
          </div>

          <button
            type="button"
            className="shop-share-button"
            onClick={sharePage}
            aria-label="مشاركة الصفحة"
          >
            {copied ? "✓" : <Share2 size={19} />}
          </button>
        </header>

        {/* Main Profile */}
        <section className="shop-profile-card">

          <div className="profile-cover">
            <div className="cover-orb cover-orb-one" />
            <div className="cover-orb cover-orb-two" />
          </div>

          <div className="profile-content">

            <div className="shop-profile-logo">
              {shop.logo_url ? (
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                />
              ) : (
                <div className="shop-profile-logo-fallback">
                  <Store size={42} />
                </div>
              )}
            </div>

            <div className="verified-badge">
              <span />
              SMART CARD VERIFIED
            </div>

            <h1>{shop.name}</h1>

            {shop.responsible && (
              <div className="shop-responsible">
                {shop.responsible}
              </div>
            )}

            {shop.description && (
              <p className="shop-description">
                {shop.description}
              </p>
            )}

            {shop.location && (
              <button
                type="button"
                className="shop-location-button"
                onClick={openMap}
              >
                <MapPin size={16} />
                <span>{shop.location}</span>
                <ArrowUpLeft size={15} />
              </button>
            )}
          </div>
        </section>

        {/* Google Review */}
        {shop.google_review && (
          <section className="google-card">

            <div className="google-card-content">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="currentColor"
                  />
                ))}
              </div>

              <span className="google-small-title">
                GOOGLE REVIEWS
              </span>

              <h2>رأيك يهمنا ⭐</h2>

              <p>
                لو تعاملت معانا، شاركنا رأيك وتقييمك على Google.
              </p>

              <button
                type="button"
                className="google-button"
                onClick={() =>
                  open(
                    "google_click",
                    shop.google_review
                  )
                }
              >
                <span className="google-icon">
                  <FaGoogle />
                </span>

                <span>قيّمنا على Google</span>

                <ExternalLink size={16} />
              </button>
            </div>

            <div className="google-visual">
              <div className="google-g">
                <FaGoogle />
              </div>

              <div className="google-stars">
                ★★★★★
              </div>
            </div>
          </section>
        )}

        {/* Quick Contact */}
        {(shop.whatsapp || shop.phone) && (
          <section className="shop-section">

            <div className="shop-section-heading">
              <span />
              <div>
                <small>QUICK CONTACT</small>
                <h2>تواصل معنا</h2>
              </div>
              <span />
            </div>

            <div className="quick-contact-grid">

              {(shop.whatsapp || shop.phone) && (
                <button
                  type="button"
                  className="quick-contact whatsapp"
                  onClick={whatsapp}
                >
                  <span className="quick-icon">
                    <FaWhatsapp />
                  </span>

                  <span>
                    <strong>WhatsApp</strong>
                    <small>راسلنا مباشرة</small>
                  </span>

                  <ArrowUpLeft size={17} />
                </button>
              )}

              {shop.phone && (
                <button
                  type="button"
                  className="quick-contact phone"
                  onClick={call}
                >
                  <span className="quick-icon">
                    <Phone />
                  </span>

                  <span>
                    <strong>اتصل بنا</strong>
                    <small>{shop.phone}</small>
                  </span>

                  <ArrowUpLeft size={17} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Social & Links */}
        {(socials.length > 0 || shop.website || shop.location) && (
          <section className="shop-section">

            <div className="shop-section-heading">
              <span />
              <div>
                <small>CONNECT WITH US</small>
                <h2>روابطنا</h2>
              </div>
              <span />
            </div>

            <div className="shop-links-list">

              {socials.map(
                ({
                  key,
                  label,
                  subtitle,
                  icon: Icon,
                  className,
                }) => (
                  <button
                    type="button"
                    key={key}
                    className={`shop-link-item ${className}`}
                    onClick={() =>
                      open(
                        `${key}_click`,
                        shop[key],
                        key
                      )
                    }
                  >
                    <span className="link-icon">
                      <Icon />
                    </span>

                    <span className="link-copy">
                      <strong>{label}</strong>
                      <small>{subtitle}</small>
                    </span>

                    <ArrowUpLeft size={18} />
                  </button>
                )
              )}

              {shop.website && (
                <button
                  type="button"
                  className="shop-link-item website"
                  onClick={() =>
                    open(
                      "website_click",
                      shop.website
                    )
                  }
                >
                  <span className="link-icon">
                    <Globe />
                  </span>

                  <span className="link-copy">
                    <strong>الموقع الإلكتروني</strong>
                    <small>تصفح موقعنا الرسمي</small>
                  </span>

                  <ArrowUpLeft size={18} />
                </button>
              )}

              {shop.location && (
                <button
                  type="button"
                  className="shop-link-item maps"
                  onClick={openMap}
                >
                  <span className="link-icon">
                    <MapPin />
                  </span>

                  <span className="link-copy">
                    <strong>موقعنا على الخريطة</strong>
                    <small>اعثر علينا بسهولة</small>
                  </span>

                  <ArrowUpLeft size={18} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Share */}
        <button
          type="button"
          className="share-full-button"
          onClick={sharePage}
        >
          <Share2 size={18} />

          <span>
            {copied
              ? "تم نسخ رابط الصفحة"
              : "مشاركة صفحة النشاط"}
          </span>
        </button>

        {/* Footer */}
        <footer className="shop-final-footer">
          <div className="footer-line" />

          <span>POWERED BY</span>

          <strong>
            <b>S</b> Smart Card
          </strong>

          <p>
            بطاقة رقمية ذكية تجمع كل طرق التواصل في مكان واحد.
          </p>
        </footer>

      </div>
    </main>
  );
}