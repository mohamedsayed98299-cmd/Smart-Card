import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  ChevronLeft,
  CreditCard,
  Globe,
  MapPin,
  MessageCircle,
  MousePointer2,
  QrCode,
  ScanLine,
  Smartphone,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

function SmartCardVisual() {
  return (
    <div className="lux-card-scene">
      <div className="lux-orbit lux-orbit-one" />
      <div className="lux-orbit lux-orbit-two" />

      <div className="lux-card">
        <div className="lux-card-glow" />

        <div className="lux-card-top">
          <div className="lux-logo-mark">S</div>

          <div className="lux-card-brand">
            <strong>SMART CARD</strong>
            <span>SMART BUSINESS IDENTITY</span>
          </div>

          <CreditCard size={23} />
        </div>

        <div className="lux-card-center">
          <div className="lux-nfc-chip">
            <div />
            <div />
            <div />
          </div>

          <div className="lux-nfc-text">
            <span>NFC</span>
            <small>TAP TO CONNECT</small>
          </div>
        </div>

        <div className="lux-card-middle">
          <span>TAP • SCAN • REVIEW</span>
        </div>

        <div className="lux-card-bottom">
          <div>
            <strong>YOUR BUSINESS</strong>
            <span>One Card. Everything Connected.</span>
          </div>

          <div className="lux-mini-qr">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="lux-floating-tag lux-tag-review">
        <FaGoogle />
        <div>
          <strong>Google Reviews</strong>
          <span>خلّي التقييم أسهل</span>
        </div>
      </div>

      <div className="lux-floating-tag lux-tag-nfc">
        <Zap size={17} />
        <div>
          <strong>NFC Ready</strong>
          <span>Tap & Go</span>
        </div>
      </div>

      <div className="lux-card-shadow" />
    </div>
  );
}

function SocialIcons() {
  return (
    <div className="lux-social-icons">
      <div className="lux-social google">
        <FaGoogle />
      </div>

      <div className="lux-social whatsapp">
        <FaWhatsapp />
      </div>

      <div className="lux-social instagram">
        <FaInstagram />
      </div>

      <div className="lux-social facebook">
        <FaFacebookF />
      </div>

      <div className="lux-social tiktok">
        <FaTiktok />
      </div>

      <div className="lux-social youtube">
        <FaYoutube />
      </div>

      <div className="lux-social website">
        <Globe size={19} />
      </div>

      <div className="lux-social location">
        <MapPin size={19} />
      </div>
    </div>
  );
}

function PhoneDemo() {
  return (
    <div className="lux-phone-wrap">
      <div className="lux-phone-glow" />

      <div className="lux-phone">
        <div className="lux-phone-top">
          <span />
        </div>

        <div className="lux-phone-content">
          <div className="lux-shop-cover">
            <div className="lux-shop-avatar">S</div>
          </div>

          <div className="lux-shop-info">
            <h4>اسم نشاطك التجاري</h4>
            <p>أفضل تجربة تبدأ من هنا</p>

            <div className="lux-rating">
              <FaGoogle />
              <strong>Google Reviews</strong>
              <span>★★★★★</span>
            </div>
          </div>

          <button className="lux-review-button">
            <Star size={17} />
            قيّمنا على Google
            <ArrowUpLeft size={16} />
          </button>

          <div className="lux-phone-links">
            <div>
              <FaWhatsapp />
              <span>WhatsApp</span>
            </div>

            <div>
              <FaInstagram />
              <span>Instagram</span>
            </div>

            <div>
              <FaFacebookF />
              <span>Facebook</span>
            </div>

            <div>
              <FaTiktok />
              <span>TikTok</span>
            </div>

            <div>
              <FaYoutube />
              <span>YouTube</span>
            </div>

            <div>
              <Globe size={17} />
              <span>Website</span>
            </div>
          </div>

          <div className="lux-location">
            <MapPin size={15} />
            <span>موقع النشاط التجاري</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="lux-section-title">
      <div className="lux-eyebrow">
        <span />
        {eyebrow}
      </div>

      <h2>{title}</h2>

      {description && <p>{description}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main className="lux-home">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="lux-hero">
        <div className="lux-grid-background" />
        <div className="lux-hero-glow lux-glow-one" />
        <div className="lux-hero-glow lux-glow-two" />

        <div className="container lux-hero-container">

          <div className="lux-hero-copy">

            <div className="lux-hero-badge">
              <Sparkles size={15} />
              <span>SMART DIGITAL BUSINESS CARD</span>
            </div>

            <h1>
              خليك أقرب
              <br />
              <span>لعملائك وتقييماتهم.</span>
            </h1>

            <p>
              Smart Card يحوّل كارتك العادي إلى تجربة رقمية ذكية.
              عميلك يلمس أو يمسح الكارت، يوصل لصفحتك، يقيّمك
              ويتواصل معاك في ثواني.
            </p>

            <div className="lux-hero-actions">
              <Link to="/order" className="lux-main-button">
                اطلب Smart Card
                <ArrowLeft size={18} />
              </Link>

              <Link to="/how-it-works" className="lux-outline-button">
                اكتشف النظام
                <ChevronLeft size={17} />
              </Link>
            </div>

            <div className="lux-hero-stats">
              <div>
                <strong>01</strong>
                <span>كارت واحد</span>
              </div>

              <div>
                <strong>02</strong>
                <span>QR + NFC</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>روابطك كلها</span>
              </div>
            </div>

          </div>

          <div className="lux-hero-visual">
            <SmartCardVisual />
          </div>

        </div>

        <div className="lux-scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <div />
        </div>
      </section>


      {/* =====================================================
          SOCIAL STRIP
      ===================================================== */}

      <section className="lux-social-strip">
        <div className="container">

          <div className="lux-strip-copy">
            <span>EVERYTHING CONNECTED</span>
            <strong>كل روابط نشاطك في تجربة واحدة</strong>
          </div>

          <SocialIcons />

        </div>
      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="lux-intro lux-section">
        <div className="container">

          <SectionTitle
            eyebrow="WHY SMART CARD"
            title={
              <>
                مش مجرد كارت...
                <br />
                <span>دي هوية رقمية كاملة.</span>
              </>
            }
            description="بدل ما العميل يدور على حساباتك أو يسأل عن طريقة التقييم، كل شيء موجود أمامه في مكان واحد."
          />

          <div className="lux-feature-grid">

            <div className="lux-feature large">
              <div className="lux-feature-number">01</div>

              <div className="lux-feature-icon">
                <FaGoogle />
              </div>

              <h3>Google Reviews</h3>

              <p>
                وصل عميلك لصفحة تقييم Google مباشرة بعد الخدمة،
                وخلي عملية التقييم أسرع وأسهل.
              </p>

              <div className="lux-feature-line" />
            </div>

            <div className="lux-feature">
              <div className="lux-feature-number">02</div>

              <div className="lux-feature-icon">
                <QrCode />
              </div>

              <h3>QR Code</h3>

              <p>
                QR خاص بنشاطك التجاري يفتح صفحتك الرقمية فورًا.
              </p>
            </div>

            <div className="lux-feature">
              <div className="lux-feature-number">03</div>

              <div className="lux-feature-icon">
                <Zap />
              </div>

              <h3>NFC Tap</h3>

              <p>
                لمسة واحدة من الموبايل وتظهر صفحة نشاطك بدون كتابة أي رابط.
              </p>
            </div>

            <div className="lux-feature wide">
              <div className="lux-feature-number">04</div>

              <div className="lux-feature-icon">
                <Globe />
              </div>

              <h3>كل شيء في مكان واحد</h3>

              <p>
                WhatsApp، Instagram، Facebook، TikTok، YouTube،
                الموقع، الموقع الجغرافي والتقييمات.
              </p>

              <SocialIcons />
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          TAP SCAN REVIEW
      ===================================================== */}

      <section className="lux-experience lux-section">

        <div className="lux-experience-glow" />

        <div className="container">

          <SectionTitle
            eyebrow="THE EXPERIENCE"
            title={
              <>
                من أول Tap
                <br />
                <span>لحد أول Review.</span>
              </>
            }
            description="تجربة بسيطة للعميل، لكن بشكل احترافي يليق بالبراند بتاعك."
          />

          <div className="lux-flow">

            <div className="lux-flow-item">
              <div className="lux-flow-icon">
                <MousePointer2 />
              </div>

              <span className="lux-flow-number">01</span>

              <h3>Tap</h3>

              <p>
                العميل يقرّب موبايله من الكارت.
              </p>
            </div>

            <div className="lux-flow-line" />

            <div className="lux-flow-item">
              <div className="lux-flow-icon">
                <ScanLine />
              </div>

              <span className="lux-flow-number">02</span>

              <h3>Scan</h3>

              <p>
                أو يمسح QR Code الموجود على الكارت.
              </p>
            </div>

            <div className="lux-flow-line" />

            <div className="lux-flow-item">
              <div className="lux-flow-icon">
                <Star />
              </div>

              <span className="lux-flow-number">03</span>

              <h3>Review</h3>

              <p>
                يدخل مباشرة على تجربة نشاطك وتقييم Google.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          GOOGLE REVIEW
      ===================================================== */}

      <section className="lux-review-section lux-section">

        <div className="container">

          <div className="lux-review-panel">

            <div className="lux-review-copy">

              <div className="lux-google-logo">
                <FaGoogle />
              </div>

              <div className="lux-eyebrow">
                <span />
                GOOGLE REVIEWS
              </div>

              <h2>
                تقييم واحد ممكن
                <br />
                <span>يفرق في قرار عميل.</span>
              </h2>

              <p>
                كل ما عملية التقييم كانت أسهل، زادت فرصة إن العميل
                يشارك تجربته. Smart Card يختصر الطريق بين العميل
                وبين صفحة التقييم.
              </p>

              <Link to="/how-it-works" className="lux-text-link">
                اعرف التفاصيل
                <ArrowLeft size={17} />
              </Link>

            </div>

            <div className="lux-google-card">

              <div className="lux-google-card-top">
                <FaGoogle />

                <span>Google Reviews</span>

                <div className="lux-stars">
                  ★★★★★
                </div>
              </div>

              <div className="lux-google-score">
                <strong>4.9</strong>
                <div>
                  <span>★★★★★</span>
                  <small>مئات التقييمات</small>
                </div>
              </div>

              <div className="lux-review-bars">
                <div>
                  <span>5</span>
                  <div>
                    <i style={{ width: "94%" }} />
                  </div>
                </div>

                <div>
                  <span>4</span>
                  <div>
                    <i style={{ width: "72%" }} />
                  </div>
                </div>

                <div>
                  <span>3</span>
                  <div>
                    <i style={{ width: "32%" }} />
                  </div>
                </div>
              </div>

              <button className="lux-google-button">
                <Star size={16} />
                قيّم تجربتك الآن
              </button>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          DIGITAL PAGE
      ===================================================== */}

      <section className="lux-digital lux-section">

        <div className="container lux-digital-grid">

          <div className="lux-digital-visual">
            <PhoneDemo />
          </div>

          <div className="lux-digital-copy">

            <div className="lux-eyebrow">
              <span />
              YOUR DIGITAL PAGE
            </div>

            <h2>
              صفحة واحدة...
              <br />
              <span>كل نشاطك فيها.</span>
            </h2>

            <p>
              بمجرد ما العميل يعمل Tap أو Scan، يفتح له رابط
              Smart Card الخاص بنشاطك. صفحة بسيطة، سريعة واحترافية
              تجمع كل طرق التواصل والتقييم.
            </p>

            <div className="lux-check-list">

              <div>
                <Check />
                <span>Google Reviews</span>
              </div>

              <div>
                <Check />
                <span>WhatsApp والتواصل المباشر</span>
              </div>

              <div>
                <Check />
                <span>Instagram وFacebook وTikTok</span>
              </div>

              <div>
                <Check />
                <span>YouTube والموقع الإلكتروني</span>
              </div>

              <div>
                <Check />
                <span>الموقع الجغرافي للنشاط</span>
              </div>

            </div>

            <Link to="/order" className="lux-main-button">
              صمّم كارت نشاطك
              <ArrowLeft size={18} />
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="lux-process lux-section">

        <div className="container">

          <SectionTitle
            eyebrow="HOW IT WORKS"
            title={
              <>
                ثلاث خطوات.
                <br />
                <span>ونشاطك جاهز.</span>
              </>
            }
          />

          <div className="lux-process-grid">

            <div className="lux-process-card">
              <span>01</span>
              <Smartphone />
              <h3>بيانات نشاطك</h3>
              <p>
                بنجهز صفحة نشاطك بكل بيانات التواصل والتقييم والروابط.
              </p>
            </div>

            <div className="lux-process-card featured">
              <span>02</span>
              <CreditCard />
              <h3>الكارت الذكي</h3>
              <p>
                بنجهز الكارت بتصميمك، QR Code وNFC الخاصين بنشاطك.
              </p>
            </div>

            <div className="lux-process-card">
              <span>03</span>
              <Star />
              <h3>ابدأ التفاعل</h3>
              <p>
                عميلك يعمل Tap أو Scan ويتفاعل مع نشاطك فورًا.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          PRICING
      ===================================================== */}

      <section className="lux-pricing lux-section">

        <div className="container">

          <SectionTitle
            eyebrow="PLANS"
            title={
              <>
                اختار المستوى
                <br />
                <span>المناسب لنشاطك.</span>
              </>
            }
            description="كل مشروع له احتياجات مختلفة، لذلك السعر النهائي بيتم تحديده حسب التفاصيل المطلوبة."
          />

          <div className="lux-pricing-grid">

            <div className="lux-price-card">

              <div className="lux-price-top">
                <span>01</span>
                <CreditCard />
              </div>

              <h3>Smart Card</h3>

              <p>الحل الأساسي لنشاطك التجاري.</p>

              <div className="lux-price">
                حسب الاتفاق
              </div>

              <div className="lux-price-divider" />

              <ul>
                <li><Check /> كارت Smart Card</li>
                <li><Check /> QR Code</li>
                <li><Check /> NFC</li>
                <li><Check /> صفحة رقمية للنشاط</li>
                <li><Check /> Google Reviews</li>
                <li><Check /> روابط التواصل</li>
              </ul>

              <Link to="/order" className="lux-price-button">
                اطلب الآن
                <ArrowLeft size={17} />
              </Link>

            </div>


            <div className="lux-price-card featured">

              <div className="lux-popular">
                الأكثر طلبًا
              </div>

              <div className="lux-price-top">
                <span>02</span>
                <Sparkles />
              </div>

              <h3>Smart Card Pro</h3>

              <p>تجربة أكثر احترافية لنشاطك.</p>

              <div className="lux-price">
                حسب الاتفاق
              </div>

              <div className="lux-price-divider" />

              <ul>
                <li><Check /> كل مميزات Smart Card</li>
                <li><Check /> تصميم مخصص</li>
                <li><Check /> صفحة أكثر احترافية</li>
                <li><Check /> Google Reviews</li>
                <li><Check /> كل روابط التواصل</li>
                <li><Check /> Analytics وإحصائيات</li>
              </ul>

              <Link to="/order" className="lux-price-button gold">
                اختار Pro
                <ArrowLeft size={17} />
              </Link>

            </div>


            <div className="lux-price-card">

              <div className="lux-price-top">
                <span>03</span>
                <Globe />
              </div>

              <h3>Business</h3>

              <p>للشركات والفروع والبراندات.</p>

              <div className="lux-price">
                حسب الاتفاق
              </div>

              <div className="lux-price-divider" />

              <ul>
                <li><Check /> كل مميزات Pro</li>
                <li><Check /> عدة فروع</li>
                <li><Check /> إدارة متعددة</li>
                <li><Check /> Analytics متقدمة</li>
                <li><Check /> هوية مخصصة</li>
                <li><Check /> حلول للشركات</li>
              </ul>

              <Link to="/order" className="lux-price-button">
                تواصل معنا
                <ArrowLeft size={17} />
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="lux-final-cta">

        <div className="lux-final-glow" />

        <div className="container">

          <div className="lux-final-card">

            <div className="lux-final-icon">
              <Sparkles />
            </div>

            <div className="lux-eyebrow">
              <span />
              SMART CARD
            </div>

            <h2>
              خلي كل Tap
              <br />
              <span>يبدأ علاقة جديدة.</span>
            </h2>

            <p>
              حوّل كارتك العادي إلى تجربة رقمية تخلّي نشاطك
              أقرب لعملائك وأسهل في التقييم والتواصل.
            </p>

            <Link to="/order" className="lux-main-button">
              ابدأ مع Smart Card
              <ArrowLeft size={18} />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}