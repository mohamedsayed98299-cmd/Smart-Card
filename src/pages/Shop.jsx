import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ArrowUpRight,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Share2,
  Star,
} from "lucide-react";

import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import {
  normalizePhoneForWhatsapp,
  normalizeUrl,
  supabase,
} from "../lib/supabase.js";

function ActionCard({
  icon,
  title,
  subtitle,
  href,
  onClick,
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel={href.startsWith("tel:") ? undefined : "noreferrer"}
      className="shop-action-card"
      onClick={onClick}
    >
      <div className="shop-action-icon">
        {icon}
      </div>

      <div className="shop-action-content">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <ArrowUpRight size={17} />
    </a>
  );
}

export default function Shop() {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const trackEvent = async (
    shopId,
    eventType
  ) => {
    if (!shopId || !eventType) return;

    try {
      await supabase
        .from("shop_events")
        .insert({
          shop_id: shopId,
          event_type: eventType,
        });
    } catch (err) {
      console.error(
        "Analytics error:",
        err
      );
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadShop() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } =
        await supabase
          .from("shops")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();

      if (!mounted) return;

      if (fetchError) {
        console.error(fetchError);

        setError(
          "حصل خطأ أثناء تحميل صفحة النشاط."
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "النشاط غير موجود أو الصفحة غير مفعلة."
        );

        setLoading(false);
        return;
      }

      setShop(data);
      setLoading(false);

      trackEvent(
        data.id,
        "page_view"
      );
    }

    loadShop();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleShare = async () => {
    if (!shop) return;

    const url =
      window.location.href;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: shop.name,
          text:
            `تعرف على ${shop.name}`,
          url,
        });
      } else if (
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          url
        );

        alert(
          "تم نسخ رابط الصفحة."
        );
      }

      trackEvent(
        shop.id,
        "share"
      );
    } catch {
      // المستخدم ألغى المشاركة
    }
  };

  const handleTrackedClick =
    (eventType) => {
      if (shop) {
        trackEvent(
          shop.id,
          eventType
        );
      }
    };

  const googleReview =
    normalizeUrl(
      shop?.google_review
    );

  const instagram =
    normalizeUrl(
      shop?.instagram
    );

  const facebook =
    normalizeUrl(
      shop?.facebook
    );

  const tiktok =
    normalizeUrl(
      shop?.tiktok
    );

  const youtube =
    normalizeUrl(
      shop?.youtube
    );

  const website =
    normalizeUrl(
      shop?.website
    );

  const location =
    normalizeUrl(
      shop?.location
    );

  const phone =
    shop?.phone
      ? `tel:${String(
          shop.phone
        ).replace(
          /\s+/g,
          ""
        )}`
      : null;

  const whatsappNumber =
    normalizePhoneForWhatsapp(
      shop?.whatsapp ||
        shop?.phone
    );

  const whatsapp =
    whatsappNumber
      ? `https://wa.me/${whatsappNumber}`
      : null;

  if (loading) {
    return (
      <div className="shop-state">
        <div className="shop-loader" />
        <p>
          جاري تحميل الصفحة...
        </p>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="shop-state">
        <div className="shop-state-card">
          <h1>
            Smart Card
          </h1>

          <p>
            {error ||
              "الصفحة غير موجودة."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">

      {/* BACKGROUND */}
      <div className="shop-bg">
        <div className="shop-bg-orb shop-bg-orb-1" />
        <div className="shop-bg-orb shop-bg-orb-2" />

        <div className="shop-watermark">
          S
        </div>

        <div className="shop-lines" />
      </div>

      {/* HEADER */}
      <header className="shop-header">

        <div className="shop-brand">

          <div className="shop-brand-mark">
            S
          </div>

          <div>
            <div className="brandName">
              SMART CARD
            </div>

            <div className="brandSubtitle">
              DIGITAL BUSINESS CARD
            </div>
          </div>

        </div>

        <button
          type="button"
          className="shop-share-button"
          onClick={handleShare}
          aria-label="مشاركة الصفحة"
        >
          <Share2 size={18} />
        </button>

      </header>

      {/* MAIN */}
      <main className="shop-main">

        {/* HERO */}
        <section className="shop-hero-card">

          <div className="shop-hero-glow" />

          <div className="shop-logo-wrap">

            {shop.logo_url ? (
              <img
                src={shop.logo_url}
                alt={shop.name}
                className="shop-logo"
              />
            ) : (
              <div className="shop-logo-placeholder">
                {shop.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "S"}
              </div>
            )}

          </div>

          <div className="shop-hero-content">

            <span className="shop-mini-label">
              SMART BUSINESS PROFILE
            </span>

            <h1>
              {shop.name}
            </h1>

            {shop.description && (
              <p>
                {shop.description}
              </p>
            )}

            {shop.location && (
              <div className="shop-location">
                <MapPin size={16} />
                <span>
                  {shop.location}
                </span>
              </div>
            )}

          </div>

        </section>

        {/* GOOGLE REVIEW */}
        {googleReview && (
          <section className="shop-review-card">

            <div className="shop-review-top">

              <div className="google-icon">
                <FaGoogle size={27} />
              </div>

              <div>
                <span>
                  GOOGLE REVIEWS
                </span>

                <h2>
                  رأيك يهمنا ⭐
                </h2>
              </div>

            </div>

            <p>
              لو جربت خدمتنا، يسعدنا جدًا
              تقييمك على Google.
            </p>

            <div className="shop-stars">
              <Star fill="currentColor" size={22} />
              <Star fill="currentColor" size={22} />
              <Star fill="currentColor" size={22} />
              <Star fill="currentColor" size={22} />
              <Star fill="currentColor" size={22} />
            </div>

            <a
              href={googleReview}
              target="_blank"
              rel="noreferrer"
              className="shop-review-button"
              onClick={() =>
                handleTrackedClick(
                  "google_click"
                )
              }
            >
              قيّمنا على Google
              <ExternalLink size={17} />
            </a>

          </section>
        )}

        {/* CONTACT */}
        <section className="shop-section">

          <div className="shop-section-title">
            <span>
              تواصل معنا
            </span>
          </div>

          <div className="shop-actions">

            {whatsapp && (
              <ActionCard
                icon={
                  <FaWhatsapp />
                }
                title="WhatsApp"
                subtitle="تواصل معنا مباشرة"
                href={whatsapp}
                onClick={() =>
                  handleTrackedClick(
                    "whatsapp_click"
                  )
                }
              />
            )}

            {phone && (
              <ActionCard
                icon={
                  <Phone size={20} />
                }
                title="اتصال"
                subtitle={shop.phone}
                href={phone}
                onClick={() =>
                  handleTrackedClick(
                    "phone_click"
                  )
                }
              />
            )}

            {website && (
              <ActionCard
                icon={
                  <Globe size={20} />
                }
                title="الموقع الإلكتروني"
                subtitle="زيارة الموقع"
                href={website}
                onClick={() =>
                  handleTrackedClick(
                    "website_click"
                  )
                }
              />
            )}

            {location && (
              <ActionCard
                icon={
                  <MapPin size={20} />
                }
                title="الموقع"
                subtitle="افتح الخريطة"
                href={location}
                onClick={() =>
                  handleTrackedClick(
                    "location_click"
                  )
                }
              />
            )}

          </div>

        </section>

        {/* SOCIAL */}
        {(instagram ||
          facebook ||
          tiktok ||
          youtube) && (
          <section className="shop-section">

            <div className="shop-section-title">
              <span>
                تابعنا
              </span>
            </div>

            <div className="shop-social-grid">

              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    handleTrackedClick(
                      "instagram_click"
                    )
                  }
                >
                  <FaInstagram />
                  <span>
                    Instagram
                  </span>
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    handleTrackedClick(
                      "facebook_click"
                    )
                  }
                >
                  <FaFacebookF />
                  <span>
                    Facebook
                  </span>
                </a>
              )}

              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    handleTrackedClick(
                      "tiktok_click"
                    )
                  }
                >
                  <FaTiktok />
                  <span>
                    TikTok
                  </span>
                </a>
              )}

              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    handleTrackedClick(
                      "youtube_click"
                    )
                  }
                >
                  <FaYoutube />
                  <span>
                    YouTube
                  </span>
                </a>
              )}

            </div>

          </section>
        )}

        {/* FINAL MESSAGE */}
        <section className="shop-message">

          <div className="shop-message-icon">
            <Star size={20} />
          </div>

          <h3>
            شكرًا لزيارتك
          </h3>

          <p>
            رأيك وتواصلك بيفرقوا معانا.
          </p>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="shop-footer">

        <div className="shop-footer-brand">
          SMART CARD
        </div>

        <span>
          DIGITAL BUSINESS CARD
        </span>

      </footer>

    </div>
  );
}