import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

export default function Brand() {
  const navigate = useNavigate();

  return (
    <div className="brand-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .brand-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 15% 15%, rgba(37, 99, 235, .28), transparent 28%),
            radial-gradient(circle at 85% 25%, rgba(14, 165, 233, .18), transparent 25%),
            linear-gradient(145deg, #020617 0%, #07142d 48%, #031027 100%);
          color: #fff;
          font-family: Arial, Tahoma, sans-serif;
          overflow: hidden;
          position: relative;
        }

        .brand-page::before {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          border: 1px solid rgba(96,165,250,.12);
          border-radius: 50%;
          top: -180px;
          right: -180px;
        }

        .brand-page::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border: 1px solid rgba(59,130,246,.10);
          border-radius: 50%;
          bottom: -180px;
          left: -180px;
        }

        .brand-container {
          width: min(1120px, calc(100% - 32px));
          margin: auto;
          position: relative;
          z-index: 2;
        }

        .brand-nav {
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo-mark {
          width: 43px;
          height: 43px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          box-shadow: 0 10px 35px rgba(37,99,235,.35);
          font-weight: 900;
          font-size: 21px;
        }

        .brand-logo-title {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: .5px;
        }

        .brand-logo-sub {
          margin-top: 3px;
          font-size: 8px;
          letter-spacing: 3px;
          color: rgba(255,255,255,.45);
        }

        .brand-nav-button {
          border: 1px solid rgba(255,255,255,.13);
          background: rgba(255,255,255,.055);
          color: #fff;
          border-radius: 13px;
          padding: 11px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          font-weight: 700;
        }

        .brand-hero {
          min-height: 610px;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          align-items: center;
          gap: 55px;
          padding: 55px 0 75px;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 13px;
          border-radius: 999px;
          background: rgba(37,99,235,.13);
          border: 1px solid rgba(96,165,250,.2);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .brand-title {
          font-size: clamp(43px, 6vw, 78px);
          line-height: .98;
          letter-spacing: -3px;
          margin: 0;
          font-weight: 950;
        }

        .brand-title span {
          background: linear-gradient(90deg, #60a5fa, #38bdf8, #fff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .brand-description {
          max-width: 600px;
          color: rgba(255,255,255,.65);
          font-size: 17px;
          line-height: 1.8;
          margin: 24px 0;
        }

        .brand-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .brand-primary {
          border: 0;
          border-radius: 15px;
          padding: 14px 21px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #fff;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 15px 35px rgba(37,99,235,.28);
        }

        .brand-secondary {
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 15px;
          padding: 14px 21px;
          background: rgba(255,255,255,.05);
          color: #fff;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-card-wrap {
          position: relative;
        }

        .brand-card {
          min-height: 390px;
          border-radius: 34px;
          padding: 30px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(145deg, rgba(30,64,175,.58), rgba(2,6,23,.8)),
            rgba(255,255,255,.05);
          border: 1px solid rgba(147,197,253,.18);
          box-shadow:
            0 35px 90px rgba(0,0,0,.4),
            inset 0 1px rgba(255,255,255,.12);
          transform: rotate(2deg);
        }

        .brand-card::before {
          content: "SMART";
          position: absolute;
          right: -35px;
          bottom: 45px;
          font-size: 85px;
          font-weight: 950;
          color: rgba(255,255,255,.035);
        }

        .brand-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand-card-chip {
          width: 52px;
          height: 39px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f8fafc, #64748b);
          opacity: .9;
        }

        .brand-card-mark {
          width: 70px;
          height: 70px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          font-size: 32px;
          font-weight: 950;
        }

        .brand-card-name {
          margin-top: 105px;
          font-size: 27px;
          font-weight: 950;
        }

        .brand-card-label {
          margin-top: 8px;
          font-size: 9px;
          letter-spacing: 4px;
          color: rgba(255,255,255,.5);
        }

        .brand-card-footer {
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-nfc {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 800;
        }

        .brand-checks {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-bottom: 70px;
        }

        .brand-check {
          padding: 19px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(255,255,255,.035);
          border-radius: 19px;
        }

        .brand-check-icon {
          color: #60a5fa;
          margin-bottom: 10px;
        }

        .brand-check strong {
          display: block;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .brand-check span {
          color: rgba(255,255,255,.48);
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 800px) {
          .brand-hero {
            grid-template-columns: 1fr;
            gap: 45px;
            padding-top: 35px;
          }

          .brand-title {
            letter-spacing: -2px;
          }

          .brand-card {
            transform: none;
          }

          .brand-checks {
            grid-template-columns: 1fr;
          }

          .brand-nav-button {
            padding: 9px 12px;
          }
        }
      `}</style>

      <div className="brand-container">
        <nav className="brand-nav">
          <div className="brand-logo">
            <div className="brand-logo-mark">S</div>

            <div>
              <div className="brand-logo-title">SMART CARD</div>
              <div className="brand-logo-sub">
                DIGITAL BUSINESS CARD
              </div>
            </div>
          </div>

          <button
            className="brand-nav-button"
            onClick={() => navigate("/order")}
          >
            <MessageCircle size={16} />
            اطلب كارتك
          </button>
        </nav>

        <main className="brand-hero">
          <section>
            <div className="brand-badge">
              <Sparkles size={15} />
              SMART CARD SYSTEM
            </div>

            <h1 className="brand-title">
              خليك دايمًا
              <br />
              <span>في إيد عميلك.</span>
            </h1>

            <p className="brand-description">
              كارت ذكي واحد يجمع تقييمات جوجل، واتساب،
              السوشيال ميديا، الموقع وكل طرق التواصل مع
              نشاطك التجاري في مكان واحد.
            </p>

            <div className="brand-actions">
              <button
                className="brand-primary"
                onClick={() => navigate("/order")}
              >
                ابدأ مع Smart Card
                <ArrowLeft size={18} />
              </button>

              <button
                className="brand-secondary"
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
              >
                اعرف المميزات
                <Zap size={17} />
              </button>
            </div>
          </section>

          <section className="brand-card-wrap">
            <div className="brand-card">
              <div className="brand-card-top">
                <div className="brand-card-mark">S</div>
                <div className="brand-card-chip" />
              </div>

              <div className="brand-card-name">
                YOUR BUSINESS
              </div>

              <div className="brand-card-label">
                SMART DIGITAL BUSINESS CARD
              </div>

              <div className="brand-card-footer">
                <span className="brand-nfc">
                  NFC + QR READY
                </span>

                <Star
                  size={22}
                  fill="currentColor"
                  color="#60a5fa"
                />
              </div>
            </div>
          </section>
        </main>

        <section className="brand-checks">
          <div className="brand-check">
            <ShieldCheck
              className="brand-check-icon"
              size={23}
            />
            <strong>احترافي وآمن</strong>
            <span>
              صفحة رقمية خاصة بكل نشاط تجاري.
            </span>
          </div>

          <div className="brand-check">
            <CreditCard
              className="brand-check-icon"
              size={23}
            />
            <strong>NFC + QR</strong>
            <span>
              العميل يلمس أو يمسح الكارت ويدخل مباشرة.
            </span>
          </div>

          <div className="brand-check">
            <CheckCircle2
              className="brand-check-icon"
              size={23}
            />
            <strong>تقييمات أكثر</strong>
            <span>
              وصول أسرع لصفحة Google Reviews الخاصة بك.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}