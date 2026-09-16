import { Link } from "react-router-dom";
import {
  ClipboardList,
  Database,
  QrCode,
  Link2,
  Package,
  Smartphone,
  Globe2,
  ArrowLeft,
  Nfc,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "صاحب النشاط يطلب الكارت",
    desc: "يتم تسجيل بيانات النشاط التجاري وروابط التواصل الأساسية.",
  },
  {
    number: "02",
    icon: Database,
    title: "إنشاء النشاط داخل النظام",
    desc: "يتم إنشاء صفحة خاصة بالنشاط داخل منصة Smart Card.",
  },
  {
    number: "03",
    icon: QrCode,
    title: "إنشاء QR و NFC",
    desc: "يتم تجهيز QR Code وNFC URL ورقم الكارت الخاص بالنشاط.",
  },
  {
    number: "04",
    icon: Link2,
    title: "ربط الكارت بالصفحة",
    desc: "يتم ربط الكارت الفعلي بصفحة النشاط الرقمية.",
  },
  {
    number: "05",
    icon: Package,
    title: "تجهيز وتسليم الكارت",
    desc: "يتم تجهيز الكارت وبرمجة الـNFC وتسليمه لصاحب النشاط.",
  },
  {
    number: "06",
    icon: Smartphone,
    title: "العميل يعمل Tap أو Scan",
    desc: "العميل يلمس الكارت بهاتفه أو يمسح QR Code.",
  },
  {
    number: "07",
    icon: Globe2,
    title: "تظهر صفحة النشاط",
    desc: "تظهر صفحة النشاط بكل الروابط والتقييمات ووسائل التواصل.",
  },
];

export default function HowItWorks() {
  return (
    <main className="sc-how2-page">

      {/* ================= HERO ================= */}
      <section className="sc-how2-hero">
        <div className="sc-how2-grid" />
        <div className="sc-how2-glow sc-how2-glow-1" />
        <div className="sc-how2-glow sc-how2-glow-2" />

        <div className="sc-how2-container sc-how2-hero-grid">

          <div className="sc-how2-hero-copy">

            <div className="sc-how2-kicker">
              <Sparkles size={16} />
              <span>HOW SMART CARD WORKS</span>
            </div>

            <h1>
              من أول طلب...
              <br />
              <strong>لأول تفاعل مع عميلك.</strong>
            </h1>

            <p>
              رحلة Smart Card مصممة ببساطة. من تسجيل نشاطك التجاري
              وتجهيز الكارت، إلى وصول العميل مباشرة لصفحتك الرقمية.
            </p>

            <div className="sc-how2-badges">
              <div>
                <Nfc size={18} />
                <span>NFC</span>
              </div>

              <div>
                <QrCode size={18} />
                <span>QR CODE</span>
              </div>

              <div>
                <Star size={18} />
                <span>REVIEWS</span>
              </div>
            </div>

          </div>

          {/* BIG CARD */}
          <div className="sc-how2-card-stage">

            <div className="sc-how2-card-shadow" />

            <div className="sc-how2-card">

              <div className="sc-how2-card-reflection" />

              <div className="sc-how2-card-header">
                <div className="sc-how2-logo">
                  S
                </div>

                <div>
                  <strong>SMART CARD</strong>
                  <small>DIGITAL BUSINESS</small>
                </div>

                <Nfc size={30} />
              </div>

              <div className="sc-how2-card-chip">
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="sc-how2-card-main">
                <span>TAP</span>
                <b>•</b>
                <span>SCAN</span>
                <b>•</b>
                <span>REVIEW</span>
              </div>

              <div className="sc-how2-card-center">
                <div className="sc-how2-card-ring">
                  <QrCode size={72} />
                </div>
              </div>

              <div className="sc-how2-card-footer">
                <span>SMART BUSINESS EXPERIENCE</span>
                <strong>SC-000123</strong>
              </div>

            </div>

            <div className="sc-how2-float sc-how2-float-one">
              <Nfc size={19} />
              <div>
                <small>Technology</small>
                <strong>NFC TAP</strong>
              </div>
            </div>

            <div className="sc-how2-float sc-how2-float-two">
              <Star size={18} fill="currentColor" />
              <div>
                <small>Customer action</small>
                <strong>Review</strong>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="sc-how2-journey">

        <div className="sc-how2-container">

          <div className="sc-how2-heading">
            <span>THE JOURNEY</span>

            <h2>
              سبع مراحل.
              <br />
              <strong>نظام واحد متكامل.</strong>
            </h2>

            <p>
              من لحظة طلب الكارت وحتى وصول العميل لصفحة نشاطك،
              كل خطوة لها دور واضح داخل النظام.
            </p>
          </div>

          <div className="sc-how2-steps">

            <div className="sc-how2-step-line" />

            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  className="sc-how2-step"
                  key={step.number}
                >

                  <div className="sc-how2-step-number">
                    {step.number}
                  </div>

                  <div className="sc-how2-step-node">
                    <div className="sc-how2-step-node-inner">
                      <Icon size={23} />
                    </div>
                  </div>

                  <div className="sc-how2-step-card">

                    <div className="sc-how2-step-top">
                      <span>STEP {step.number}</span>
                      <Icon size={20} />
                    </div>

                    <h3>{step.title}</h3>

                    <p>{step.desc}</p>

                    <div className="sc-how2-step-check">
                      <CheckCircle2 size={16} />
                      <span>تمت العملية</span>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ================= TAP SCAN ================= */}
      <section className="sc-how2-interaction">

        <div className="sc-how2-container">

          <div className="sc-how2-interaction-box">

            <div className="sc-how2-interaction-copy">

              <span>SMART INTERACTION</span>

              <h2>
                Tap أو Scan...
                <br />
                <strong>والتجربة تبدأ.</strong>
              </h2>

              <p>
                العميل مش محتاج تطبيق إضافي ومش محتاج يبحث عن
                اسم النشاط. مجرد Tap أو Scan ويوصل مباشرة لصفحتك.
              </p>

              <div className="sc-how2-methods">

                <div>
                  <Nfc size={22} />
                  <div>
                    <strong>NFC TAP</strong>
                    <small>قرّب الهاتف من الكارت</small>
                  </div>
                </div>

                <div>
                  <QrCode size={22} />
                  <div>
                    <strong>QR SCAN</strong>
                    <small>امسح الكود بالكاميرا</small>
                  </div>
                </div>

              </div>

              <Link
                to="/order"
                className="sc-how2-button"
              >
                اطلب Smart Card الآن
                <ArrowLeft size={18} />
              </Link>

            </div>

            <div className="sc-how2-phone-stage">

              <div className="sc-how2-signal sc-how2-signal-1">
                NFC
              </div>

              <div className="sc-how2-signal sc-how2-signal-2">
                QR
              </div>

              <div className="sc-how2-phone">

                <div className="sc-how2-phone-top">
                  <span />
                </div>

                <div className="sc-how2-phone-screen">

                  <div className="sc-how2-phone-header">
                    <div className="sc-how2-phone-s-logo">
                      S
                    </div>

                    <div>
                      <strong>Smart Card</strong>
                      <small>Digital Business Page</small>
                    </div>
                  </div>

                  <div className="sc-how2-business-avatar">
                    SC
                  </div>

                  <h3>نشاطك التجاري</h3>

                  <p>كل روابطك في مكان واحد</p>

                  <div className="sc-how2-review">
                    <Star
                      size={21}
                      fill="currentColor"
                    />

                    <div>
                      <strong>Google Reviews</strong>
                      <span>شاركنا رأيك</span>
                    </div>
                  </div>

                  <div className="sc-how2-links">
                    <span>WhatsApp</span>
                    <span>Instagram</span>
                    <span>Facebook</span>
                    <span>Website</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="sc-how2-reviews">

        <div className="sc-how2-container">

          <div className="sc-how2-review-grid">

            <div className="sc-how2-review-copy">

              <span>GOOGLE REVIEWS</span>

              <h2>
                خلي التقييم
                <br />
                <strong>أسهل لعميلك.</strong>
              </h2>

              <p>
                Smart Card يختصر الطريق بين العميل ونشاطك.
                يدخل العميل إلى صفحتك مباشرة، يراجع معلوماتك،
                وبعدها يقدر يشارك تجربته ويترك تقييمه.
              </p>

              <div className="sc-how2-review-points">

                <div>
                  <CheckCircle2 size={18} />
                  <span>وصول مباشر لصفحة النشاط</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>زر تقييم واضح وسريع</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>كل وسائل التواصل في مكان واحد</span>
                </div>

              </div>

            </div>

            <div className="sc-how2-review-card">

              <div className="sc-how2-rating-top">
                <div className="sc-how2-rating-icon">
                  G
                </div>

                <div>
                  <strong>Google Reviews</strong>
                  <span>Customer Experience</span>
                </div>
              </div>

              <div className="sc-how2-rating-number">
                <strong>5.0</strong>

                <div className="sc-how2-rating-stars">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star
                      key={item}
                      size={22}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              <div className="sc-how2-rating-divider" />

              <div className="sc-how2-rating-flow">

                <div>
                  <b>01</b>
                  <span>Tap / Scan</span>
                </div>

                <div>
                  <b>02</b>
                  <span>صفحة النشاط</span>
                </div>

                <div>
                  <b>03</b>
                  <span>Google Review</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="sc-how2-cta">

        <div className="sc-how2-container">

          <div className="sc-how2-cta-box">

            <div className="sc-how2-cta-orb" />

            <span>SMART CARD</span>

            <h2>
              جاهز تخلي نشاطك التجاري
              <br />
              <strong>أكثر احترافية؟</strong>
            </h2>

            <p>
              كارت واحد يجمع الـNFC والـQR والتقييمات
              وروابط نشاطك في تجربة واحدة.
            </p>

            <Link
              to="/order"
              className="sc-how2-cta-button"
            >
              اطلب Smart Card الآن
              <ArrowLeft size={19} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}