import { Link } from "react-router-dom";
import { PLANS } from "../data/plans.js";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  BarChart3,
  QrCode,
  Nfc,
  Star,
  Globe2,
  Smartphone,
  Building2,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    icon: Nfc,
    title: "NFC",
    text: "Tap مباشر من الهاتف للكارت.",
  },
  {
    icon: QrCode,
    title: "QR CODE",
    text: "Scan سريع للوصول للصفحة.",
  },
  {
    icon: Star,
    title: "REVIEWS",
    text: "وصول أسهل لتقييم النشاط.",
  },
  {
    icon: BarChart3,
    title: "ANALYTICS",
    text: "تابع تفاعل العملاء مع الكارت.",
  },
];

export default function Pricing() {
  return (
    <main className="sc-price-page">

      {/* HERO */}
      <section className="sc-price-hero">

        <div className="sc-price-grid" />
        <div className="sc-price-orb sc-price-orb-1" />
        <div className="sc-price-orb sc-price-orb-2" />

        <div className="sc-price-container">

          <div className="sc-price-hero-content">

            <div className="sc-price-kicker">
              <Sparkles size={16} />
              <span>SMART CARD PLANS</span>
            </div>

            <h1>
              اختار الباقة
              <br />
              <strong>المناسبة لنشاطك.</strong>
            </h1>

            <p>
              ابدأ بكارت واحد، وطوّر تجربتك مع عملائك
              حسب احتياج نشاطك التجاري.
            </p>

          </div>

          <div className="sc-price-highlights">

            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="sc-price-highlight"
                  key={item.title}
                >
                  <div className="sc-price-highlight-icon">
                    <Icon size={20} />
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* PLANS */}
      <section className="sc-price-plans">

        <div className="sc-price-container">

          <div className="sc-price-section-heading">

            <span>CHOOSE YOUR PLAN</span>

            <h2>
              ثلاث باقات.
              <br />
              <strong>تجربة واحدة.</strong>
            </h2>

            <p>
              كل باقة مصممة لتناسب مرحلة مختلفة من احتياج نشاطك التجاري.
            </p>

          </div>

          <div className="sc-price-cards">

            {PLANS.map((plan, index) => {
              const Icon = plan.icon;

              return (
                <article
                  className={`sc-price-card ${
                    plan.featured
                      ? "sc-price-card-featured"
                      : ""
                  }`}
                  key={plan.name}
                >

                  {plan.featured && (
                    <div className="sc-price-popular">
                      <Crown size={15} />
                      الأكثر طلبًا
                    </div>
                  )}

                  <div className="sc-price-card-glow" />

                  <div className="sc-price-card-top">

                    <div className="sc-price-plan-icon">
                      <Icon size={23} />
                    </div>

                    <span className="sc-price-plan-number">
                      0{index + 1}
                    </span>

                  </div>

                  <h3>{plan.name}</h3>

                  <p className="sc-price-description">
                    {plan.description}
                  </p>

                  <div className="sc-price-value">
                    <strong>{plan.price}</strong>
                    <span>جنيه</span>
                  </div>

                  <div className="sc-price-divider" />

                  <div className="sc-price-feature-title">
                    <span>المميزات</span>
                  </div>

                  <ul className="sc-price-features">

                    {plan.features.map((feature) => (
                      <li key={feature}>

                        <span className="sc-price-check">
                          <Check size={14} />
                        </span>

                        <span>{feature}</span>

                      </li>
                    ))}

                  </ul>

                  {/* اختيار الباقة وإرسالها إلى Order */}
                  <Link
                    to="/order"
                    state={{
                      planId: plan.id,
                    }}
                    className={
                      plan.featured
                        ? "sc-price-button sc-price-button-featured"
                        : "sc-price-button"
                    }
                  >
                    اطلب الباقة
                    <ArrowLeft size={17} />
                  </Link>

                </article>
              );
            })}

          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="sc-price-compare">

        <div className="sc-price-container">

          <div className="sc-price-compare-box">

            <div className="sc-price-compare-copy">

              <span>SMART BUSINESS EXPERIENCE</span>

              <h2>
                مش مجرد
                <br />
                <strong>كارت.</strong>
              </h2>

              <p>
                Smart Card بيجمع بين الكارت الفعلي والتقنية الرقمية
                في تجربة واحدة تساعد عميلك يوصل لنشاطك بسهولة.
              </p>

            </div>

            <div className="sc-price-compare-items">

              <div>
                <Smartphone size={21} />
                <span>تجربة موبايل سريعة</span>
              </div>

              <div>
                <Globe2 size={21} />
                <span>صفحة رقمية خاصة</span>
              </div>

              <div>
                <Star size={21} />
                <span>Google Reviews</span>
              </div>

              <div>
                <BarChart3 size={21} />
                <span>متابعة التفاعل</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="sc-price-cta">

        <div className="sc-price-container">

          <div className="sc-price-cta-box">

            <div className="sc-price-cta-orb" />

            <span>SMART CARD</span>

            <h2>
              جاهز تبدأ؟
              <br />
              <strong>اختار باقتك الآن.</strong>
            </h2>

            <p>
              اختار الباقة المناسبة لنشاطك، وإحنا نكمل معاك باقي الخطوات.
            </p>

            <Link
              to="/order"
              className="sc-price-cta-button"
            >
              ابدأ طلبك
              <ArrowLeft size={19} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}