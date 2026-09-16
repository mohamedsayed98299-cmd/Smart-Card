import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, CreditCard } from "lucide-react";

const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/how-it-works", label: "كيف يعمل؟" },
  { to: "/pricing", label: "الباقات" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled
          ? "rgba(10,14,23,0.85)"
          : "transparent",
        backdropFilter: scrolled
          ? "blur(14px)"
          : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 0.25s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 76,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: 38,
              height: 38,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, var(--gold), var(--gold-soft))",
            }}
          >
            <CreditCard
              size={20}
              color="#14100a"
            />
          </span>

          Smart{" "}
          <span className="gold-text">
            Card
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
          className="navbar-links"
        >
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontWeight: 600,
                fontSize: 15,
                color:
                  location.pathname === link.to
                    ? "var(--gold-soft)"
                    : "var(--text-dim)",
              }}
              className="navbar-link-desktop"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            to="/order"
            className="btn btn-primary"
          >
            اطلب كارتك
          </Link>

          <Link
            to="/admin"
            className="btn btn-outline"
          >
            دخول الإدارة
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="navbar-mobile-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="فتح القائمة"
          >
            {open ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile-menu">
          <div className="container">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="navbar-mobile-link"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/order"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              اطلب كارتك
            </Link>

            <Link
              to="/admin"
              className="btn btn-outline"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              دخول الإدارة
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}