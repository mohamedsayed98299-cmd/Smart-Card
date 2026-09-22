import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Pricing from "./pages/Pricing.jsx";
import Order from "./pages/Order.jsx";
import Account from "./pages/Account.jsx";
import Shop from "./pages/Shop.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

function MarketingLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="state-box section">
      <h2 style={{ marginBottom: 10 }}>
        404 — الصفحة غير موجودة
      </h2>

      <p>
        الرابط الذي حاولت فتحه غير موجود أو تم نقله.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* الصفحة الرئيسية */}
        <Route
          path="/"
          element={
            <MarketingLayout>
              <Home />
            </MarketingLayout>
          }
        />

        {/* من نحن */}
        <Route
          path="/about"
          element={
            <MarketingLayout>
              <About />
            </MarketingLayout>
          }
        />

        {/* كيف يعمل */}
        <Route
          path="/how-it-works"
          element={
            <MarketingLayout>
              <HowItWorks />
            </MarketingLayout>
          }
        />

        {/* الأسعار */}
        <Route
          path="/pricing"
          element={
            <MarketingLayout>
              <Pricing />
            </MarketingLayout>
          }
        />

        {/* طلب الخدمة */}
        <Route
          path="/order"
          element={
            <MarketingLayout>
              <Order />
            </MarketingLayout>
          }
        />

        {/* حساب العميل */}
        <Route
          path="/account"
          element={
            <MarketingLayout>
              <Account />
            </MarketingLayout>
          }
        />

        {/* صفحة المحل العامة */}
        <Route
          path="/shop/:slug"
          element={<Shop />}
        />

        {/* دخول الإدارة */}
        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        {/* لوحة التحكم */}
        <Route
          path="/dashboard/*"
          element={<Dashboard />}
        />

        {/* أي رابط غير موجود */}
        <Route
          path="*"
          element={
            <MarketingLayout>
              <NotFound />
            </MarketingLayout>
          }
        />

      </Routes>
    </>
  );
}