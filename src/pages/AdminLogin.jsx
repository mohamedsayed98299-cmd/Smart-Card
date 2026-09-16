import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase.js";
import "./admin-login.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let alive = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!alive) return;

      if (error || !data.session) {
        setStatus("idle");
        return;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_admin");

      if (!alive) return;

      if (!adminError && isAdmin) {
        navigate("/dashboard", { replace: true });
        return;
      }

      await supabase.auth.signOut();

      if (alive) {
        setStatus("idle");
      }
    }

    checkSession();

    return () => {
      alive = false;
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setStatus("error");
      setErrorMsg("من فضلك اكتب البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMsg("بيانات الدخول غير صحيحة، برجاء المحاولة مرة أخرى.");
      return;
    }

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_admin");

    if (adminError || !isAdmin) {
      await supabase.auth.signOut();

      setStatus("error");
      setErrorMsg("هذا الحساب ليس لديه صلاحية دخول لوحة التحكم.");
      return;
    }

    setStatus("success");

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 400);
  }

  if (status === "checking") {
    return (
      <main className="admin-login-page admin-login-loading">
        <div className="admin-login-loader">
          <div className="admin-loader-ring"></div>

          <div className="admin-loader-logo">
            <CreditCard size={25} />
          </div>

          <p>جاري التحقق من الجلسة...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page" dir="rtl">
      <div className="admin-bg-grid"></div>
      <div className="admin-bg-glow admin-glow-one"></div>
      <div className="admin-bg-glow admin-glow-two"></div>

      <div className="admin-login-shell">
        {/* الجانب التعريفي */}
        <section className="admin-login-showcase">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <CreditCard size={25} strokeWidth={2.2} />
            </div>

            <div>
              <strong>
                Smart <span>Card</span>
              </strong>

              <small>SMART DIGITAL BUSINESS CARD</small>
            </div>
          </div>

          <div className="admin-showcase-content">
            <div className="admin-kicker">
              <Sparkles size={15} />
              لوحة التحكم
            </div>

            <h1>
              إدارة Smart Card
              <br />
              <span>من مكان واحد.</span>
            </h1>

            <p>
              تحكم في المحلات والكروت والطلبات وتابع التفاعلات
              والإحصائيات من لوحة تحكم واحدة.
            </p>

            <div className="admin-feature-list">
              <div className="admin-feature">
                <div className="admin-feature-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>دخول آمن</strong>
                  <span>نظام دخول محمي لحسابات الإدارة.</span>
                </div>
              </div>

              <div className="admin-feature">
                <div className="admin-feature-icon">
                  <CreditCard size={18} />
                </div>

                <div>
                  <strong>إدارة الكروت</strong>
                  <span>تابع الكروت وQR وNFC بسهولة.</span>
                </div>
              </div>

              <div className="admin-feature">
                <div className="admin-feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>متابعة النشاط</strong>
                  <span>راقب أداء المحلات والتفاعلات.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-showcase-footer">
            <span>Smart Card</span>
            <span className="admin-footer-dot"></span>
            <span>Admin Portal</span>
          </div>
        </section>

        {/* نموذج الدخول */}
        <section className="admin-login-card">
          <div className="admin-card-top">
            <div className="admin-secure-badge">
              <LockKeyhole size={16} />
              دخول الإدارة
            </div>
          </div>

          <div className="admin-card-heading">
            <h2>أهلًا بيك 👋</h2>

            <p>
              سجل دخولك للوصول إلى لوحة تحكم Smart Card.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-field">
              <label htmlFor="admin-email">البريد الإلكتروني</label>

              <div className="admin-input-wrap">
                <Mail size={19} />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMsg("");
                    }
                  }}
                  placeholder="أدخل البريد الإلكتروني"
                  autoComplete="email"
                  dir="ltr"
                  disabled={status === "loading" || status === "success"}
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">كلمة المرور</label>

              <div className="admin-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMsg("");
                    }
                  }}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
                  dir="ltr"
                  disabled={status === "loading" || status === "success"}
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword
                      ? "إخفاء كلمة المرور"
                      : "إظهار كلمة المرور"
                  }
                  disabled={status === "loading" || status === "success"}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className="admin-login-error">
                <AlertCircle size={19} />
                <span>{errorMsg}</span>
              </div>
            )}

            {status === "success" && (
              <div className="admin-login-success">
                <CheckCircle2 size={19} />
                <span>تم تسجيل الدخول بنجاح...</span>
              </div>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <>
                  <span className="admin-button-spinner"></span>
                  جاري تسجيل الدخول...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={19} />
                  تم الدخول
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowLeft size={19} />
                </>
              )}
            </button>
          </form>

          <div className="admin-security-note">
            <ShieldCheck size={16} />

            <span>
              هذه الصفحة مخصصة لمسؤولي Smart Card فقط.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}