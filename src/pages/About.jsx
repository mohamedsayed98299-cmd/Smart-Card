import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Target,
  Users,
  Zap,
} from "lucide-react";

export default function About() {
  return (
    <main className="sc-about">

      <section className="sc-about-hero">
        <div className="sc-about-grid-bg" />
        <div className="sc-about-glow sc-about-glow-1" />
        <div className="sc-about-glow sc-about-glow-2" />

        <div className="sc-about-container">

          <div className="sc-about-hero-content">

            <div className="sc-about-badge">
              <span />
              عن Smart Card
            </div>

            <h1>
              بنخلي التواصل بين
              <br />
              <em>النشاط التجاري وعميله أسهل</em>
            </h1>

            <p>
              Smart Card فكرة بسيطة هدفها مساعدة الأنشطة التجارية
              على جمع تقييمات العملاء وتجميع روابط التواصل في مكان واحد.
            </p>

          </div>

          <div className="sc-about-hero-card-wrap">

            <div className="sc-about-card">

              <div className="sc-about-card-top">
                <div className="sc-about-logo">S</div>

                <div>
                  <strong>SMART CARD</strong>
                  <small>PREMIUM DIGITAL EXPERIENCE</small>
                </div>
              </div>

              <div className="sc-about-card-middle">

                <div className="sc-about-chip">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <div className="sc-about-nfc">
                  ))))
                </div>

              </div>

              <div className="sc-about-card-bottom">

                <div>
                  <small>TAP • SCAN • REVIEW</small>
                  <strong>كل روابطك في مكان واحد</strong>
                </div>

                <div className="sc-about-qr">
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

            <div className="sc-about-float sc-about-float-1">
              <Zap size={15} />
              NFC
            </div>

            <div className="sc-about-float sc-about-float-2">
              <span>★</span>
              Google Reviews
            </div>

          </div>

        </div>
      </section>

      <section className="sc-about-story">

        <div className="sc-about-container sc-about-story-grid">

          <div className="sc-about-story-title">

            <span>فكرتنا</span>

            <h2>
              كارت واحد،
              <br />
              <strong>تجربة كاملة.</strong>
            </h2>

          </div>

          <div className="sc-about-story-text">

            <p>
              بدل ما العميل يبحث عن اسم النشاط على Google أو يسأل
              عن رقم WhatsApp أو حساب Instagram، كل المعلومات تكون
              أمامه في صفحة واحدة.
            </p>

            <p>
              الكارت يعمل من خلال QR Code وNFC، والعميل بمجرد المسح
              أو اللمس يصل مباشرة إلى صفحة النشاط التجاري.
            </p>

            <Link to="/how-it-works" className="sc-about-button">
              شوف طريقة العمل
              <ArrowLeft size={18} />
            </Link>

          </div>

        </div>

      </section>

      <section className="sc-about-features">

        <div className="sc-about-container">

          <div className="sc-about-section-title">

            <span>Smart Card</span>

            <h2>كل حاجة بسيطة وواضحة.</h2>

          </div>

          <div className="sc-about-feature-grid">

            <div className="sc-about-feature">
              <div className="sc-about-feature-icon">
                <Target />
              </div>

              <b>01</b>

              <h3>هدفنا</h3>

              <p>
                تسهيل وصول العميل للنشاط وتشجيع العملاء على ترك
                تقييماتهم بعد تجربة الخدمة.
              </p>
            </div>

            <div className="sc-about-feature">
              <div className="sc-about-feature-icon">
                <Zap />
              </div>

              <b>02</b>

              <h3>البساطة</h3>

              <p>
                تجربة سريعة بدون تطبيقات إضافية أو خطوات معقدة.
              </p>
            </div>

            <div className="sc-about-feature">
              <div className="sc-about-feature-icon">
                <Users />
              </div>

              <b>03</b>

              <h3>للأنشطة التجارية</h3>

              <p>
                مناسب للمطاعم والكافيهات والمحلات والخدمات
                ومختلف الأنشطة التجارية.
              </p>
            </div>

            <div className="sc-about-feature">
              <div className="sc-about-feature-icon">
                <CreditCard />
              </div>

              <b>04</b>

              <h3>Smart Card</h3>

              <p>
                كارت فعلي مرتبط بصفحة رقمية خاصة بنشاطك.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="sc-about-values">

        <div className="sc-about-container">

          <div className="sc-about-section-title center">

            <span>ليه Smart Card؟</span>

            <h2>مصمم عشان يكون عملي</h2>

          </div>

          <div className="sc-about-values-grid">

            <div className="sc-about-value">
              <CheckCircle />

              <div>
                <strong>سهل الاستخدام</strong>
                <p>العميل يعمل Scan أو Tap ويدخل مباشرة.</p>
              </div>
            </div>

            <div className="sc-about-value">
              <CheckCircle />

              <div>
                <strong>صفحة خاصة لكل نشاط</strong>
                <p>كل نشاط له بيانات وروابط خاصة به.</p>
              </div>
            </div>

            <div className="sc-about-value">
              <CheckCircle />

              <div>
                <strong>قابل للتطوير</strong>
                <p>النظام مصمم بحيث نقدر نضيف خدمات ومميزات جديدة.</p>
              </div>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}