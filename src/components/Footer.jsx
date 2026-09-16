import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Brand */}
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
          >
            Smart{" "}
            <span className="gold-text">
              Card
            </span>
          </Link>

          <p>
            كارتك الذكي... خليك أقرب لعملائك
            وخلي تقييماتك تزيد بشكل احترافي.
          </p>

          <div className="footer-socials">

            <a
              href="#"
              aria-label="Facebook"
            >
              <FaFacebookF size={15} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
            >
              <FaInstagram size={15} />
            </a>

            <a
              href="#"
              aria-label="TikTok"
            >
              <FaTiktok size={15} />
            </a>

            <a
              href="#"
              aria-label="YouTube"
            >
              <FaYoutube size={15} />
            </a>

          </div>
        </div>

        {/* Links */}
        <div>
          <h4>Smart Card</h4>

          <div className="footer-links">
            <Link to="/">
              الرئيسية
            </Link>

            <Link to="/about">
              من نحن
            </Link>

            <Link to="/how-it-works">
              كيف يعمل؟
            </Link>

            <Link to="/pricing">
              الباقات
            </Link>
          </div>
        </div>

        {/* Service */}
        <div>
          <h4>الخدمة</h4>

          <div className="footer-links">
            <Link to="/order">
              اطلب كارتك
            </Link>

            <a href="#features">
              المميزات
            </a>

            <a href="#reviews">
              تقييمات Google
            </a>

            <a href="#demo">
              التجربة
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4>تواصل معنا</h4>

          <div className="footer-links">
            <a href="tel:+201000000000">
              الهاتف
            </a>

            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>

            <a href="mailto:info@smartcard.local">
              البريد الإلكتروني
            </a>
          </div>
        </div>

      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Smart Card
        </span>

        <span>
          جميع الحقوق محفوظة
        </span>
      </div>
    </footer>
  );
}