import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserRound,
  Mail,
  LogOut,
  Package,
  CalendarDays,
  User,
  Phone,
  CreditCard,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  AlertCircle,
  Eye,
  Store,
  Sparkles,
  ArrowLeft,
  MapPin,
  Copy,
  Check,
  Wifi,
} from "lucide-react";

import { supabase, buildShopUrl } from "../lib/supabase.js";

const STATUS_META = {
  pending: {
    label: "قيد المراجعة",
    description: "تم استلام طلبك وجاري مراجعة البيانات.",
    icon: Clock3,
  },
  reviewing: {
    label: "جاري تنفيذ الطلب",
    description: "فريق Smart Card بدأ تنفيذ طلبك.",
    icon: LoaderCircle,
  },
  approved: {
    label: "تم اعتماد الطلب",
    description: "تم اعتماد بيانات نشاطك وأصبحت صفحة النشاط متاحة.",
    icon: CheckCircle2,
  },
  ready: {
    label: "الكارت جاهز",
    description: "الكارت الخاص بنشاطك أصبح جاهزًا للتسليم.",
    icon: CreditCard,
  },
  delivered: {
    label: "تم التسليم",
    description: "الكارت تم تسليمه وأصبح جاهزًا للاستخدام.",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "تم إلغاء الطلب",
    description: "تم إلغاء هذا الطلب.",
    icon: AlertCircle,
  },
};

const STATUS_STEPS = [
  {
    key: "pending",
    label: "استلام الطلب",
  },
  {
    key: "reviewing",
    label: "مراجعة وتنفيذ",
  },
  {
    key: "approved",
    label: "تم الاعتماد",
  },
  {
    key: "ready",
    label: "الكارت جاهز",
  },
  {
    key: "delivered",
    label: "تم التسليم",
  },
];

const STATUS_ORDER = {
  pending: 0,
  reviewing: 1,
  approved: 2,
  ready: 3,
  delivered: 4,
};

function getOrderMessage(status) {
  switch (status) {
    case "pending":
      return {
        title: "استلمنا طلبك",
        text: "طلبك وصل لنا بنجاح، وفريق Smart Card بيراجع البيانات حاليًا.",
      };

    case "reviewing":
      return {
        title: "جاري تجهيز طلبك",
        text: "تم بدء تنفيذ طلبك، وبنجهز صفحة نشاطك والكارت الخاص بيك.",
      };

    case "approved":
      return {
        title: "تم اعتماد طلبك",
        text: "بيانات نشاطك اتعتمدت، وصفحة النشاط أصبحت متاحة. الكارت حاليًا في مرحلة التجهيز.",
      };

    case "ready":
      return {
        title: "الكارت جاهز",
        text: "الكارت الخاص بنشاطك أصبح جاهزًا للتسليم.",
      };

    case "delivered":
      return {
        title: "الكارت تم تسليمه",
        text: "الكارت الخاص بك تم تسليمه وأصبح جاهزًا للاستخدام.",
      };

    case "cancelled":
      return {
        title: "تم إلغاء الطلب",
        text: "تم إلغاء هذا الطلب. لو محتاج تعمل طلب جديد تقدر تبدأ من هنا.",
      };

    default:
      return {
        title: "حالة الطلب",
        text: "جاري تحديث حالة طلبك.",
      };
  }
}

function getProgress(status) {
  if (status === "cancelled") return 0;

  return STATUS_ORDER[status] ?? 0;
}

/* =========================
   Card Status
========================= */

function getCardStatus(order) {
  const card = order?.cards;

  if (!order?.card_id || !card) {
    return {
      label: "لم يتم إنشاء الكارت بعد",
      className: "account-card-status-muted",
    };
  }

  const cardStatus = String(card.status || "")
    .trim()
    .toLowerCase();

  if (cardStatus === "active") {
    return {
      label: "نشط وجاهز للاستخدام",
      className: "account-card-status-success",
    };
  }

  if (cardStatus === "inactive") {
    return {
      label: "غير نشط",
      className: "account-card-status-warning",
    };
  }

  return {
    label: card.status || "قيد التجهيز",
    className: "account-card-status-warning",
  };
}

/* =========================
   Card Visibility
========================= */

function isCardVisible(order) {
  return Boolean(order?.card_id && order?.cards);
}

function formatDate(date) {
  if (!date) return "-";

  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function getUserName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    "مستخدم Smart Card"
  );
}

function getUserAvatar(user) {
  return (
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null
  );
}

function getInitials(name) {
  if (!name) return "SC";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2);
  }

  return `${words[0][0]}${words[1][0]}`;
}

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(
    Boolean(location.state?.orderSubmitted)
  );

  useEffect(() => {
    if (location.state?.orderSubmitted) {
      window.history.replaceState({}, document.title);
    }

    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state]);

  /* =========================
     Load User
  ========================== */

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoadingUser(true);

      const { data, error: authError } =
        await supabase.auth.getUser();

      if (!mounted) return;

      if (authError) {
        setError(authError.message);
        setLoadingUser(false);
        return;
      }

      if (!data?.user) {
        setUser(null);
        setLoadingUser(false);

        navigate("/order", {
          replace: true,
        });

        return;
      }

      setUser(data.user);
      setLoadingUser(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        const nextUser = session?.user || null;

        setUser(nextUser);

        if (!nextUser) {
          navigate("/order", {
            replace: true,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  /* =========================
     Load Orders
  ========================== */

  useEffect(() => {
    if (!user?.id) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    let mounted = true;

    async function loadOrders() {
      setLoadingOrders(true);
      setError("");

      const { data, error: ordersError } =
        await supabase
          .from("orders")
          .select(`
            id,
            created_at,
            plan,
            plan_price,
            plan_old_price,
            discount_text,
            currency,
            shop_name,
            responsible,
            phone,
            status,
            shop_id,
            card_id,
            approved_at,
            admin_notes,

            shops:shop_id (
              name,
              slug
            ),

            cards:card_id (
              id,
              card_number,
              status,
              qr_code,
              nfc_url,
              created_at
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (!mounted) return;

      if (ordersError) {
        setError(
          ordersError.message ||
            "حصلت مشكلة أثناء تحميل الطلبات."
        );

        setOrders([]);
      } else {
        setOrders(data || []);
      }

      setLoadingOrders(false);
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  /* =========================
     Logout
  ========================== */

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error: logoutError } =
      await supabase.auth.signOut();

    if (logoutError) {
      setError(
        logoutError.message ||
          "حصلت مشكلة أثناء تسجيل الخروج."
      );

      setLoggingOut(false);
      return;
    }

    navigate("/", {
      replace: true,
    });
  }

  /* =========================
     Copy Card Link
  ========================== */

  async function handleCopyCardLink(order) {
    const shopSlug = order?.shops?.slug;

    if (!shopSlug) return;

    const cardUrl = buildShopUrl(shopSlug);

    try {
      await navigator.clipboard.writeText(cardUrl);

      setCopiedCardId(order.id);

      setTimeout(() => {
        setCopiedCardId(null);
      }, 2000);
    } catch {
      setError("مش قادر أنسخ الرابط تلقائيًا.");
    }
  }

  /* =========================
     Loading
  ========================== */

  if (loadingUser) {
    return (
      <main className="account-page">
        <div className="container account-loading">
          <LoaderCircle
            size={32}
            className="account-spin"
          />

          <p>
            جاري تحميل حسابك...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const userName = getUserName(user);
  const userEmail =
    user.email || "لا يوجد بريد إلكتروني";
  const userAvatar = getUserAvatar(user);
  const initials = getInitials(userName);

  const totalOrders = orders.length;

  return (
    <main className="account-page">
      <div className="container account-container">

        {/* =========================
            Header
        ========================== */}

        <section className="account-header">
          <div>
            <div className="account-eyebrow">
              <Sparkles size={16} />
              Smart Card Account
            </div>

            <h1>
              أهلاً بيك،{" "}
              <span className="gold-text">
                {userName}
              </span>
            </h1>

            <p>
              من هنا تقدر تتابع طلباتك والكروت الخاصة
              بنشاطك التجاري.
            </p>
          </div>

          <Link
            to="/order"
            className="btn btn-primary"
          >
            اطلب كارت جديد
            <ArrowLeft size={18} />
          </Link>
        </section>

        {/* =========================
            Account Profile Card
        ========================== */}

        <section className="account-profile-card">
          <div className="account-profile-main">

            <div className="account-avatar">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";

                    const fallback =
                      event.currentTarget.parentElement?.querySelector(
                        ".account-avatar-fallback"
                      );

                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />
              ) : null}

              <span
                className="account-avatar-fallback"
                style={{
                  display: userAvatar
                    ? "none"
                    : "flex",
                }}
              >
                {initials}
              </span>
            </div>

            <div className="account-profile-info">
              <span className="account-profile-label">
                الحساب الشخصي
              </span>

              <h2>
                {userName}
              </h2>

              <div className="account-email">
                <Mail size={17} />
                <span>
                  {userEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="account-profile-actions">

            <div className="account-profile-badge">
              <UserRound size={17} />
              حساب العميل
            </div>

            <button
              type="button"
              className="account-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="account-spin"
                  />
                  جاري الخروج...
                </>
              ) : (
                <>
                  <LogOut size={17} />
                  تسجيل الخروج
                </>
              )}
            </button>
          </div>
        </section>

        {/* =========================
            Success
        ========================== */}

        {showSuccessMessage && (
          <section className="account-success-message">

            <div className="account-success-icon">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <strong>
                تم إرسال طلبك بنجاح 🎉
              </strong>

              <p>
                طلبك اتسجل عندنا، وتقدر تتابع حالته
                من الصفحة دي.
              </p>
            </div>
          </section>
        )}

        {/* =========================
            Error
        ========================== */}

        {error && (
          <section className="account-error-message">
            <AlertCircle size={20} />

            <div>
              <strong>
                حصلت مشكلة
              </strong>

              <p>
                {error}
              </p>
            </div>
          </section>
        )}

        {/* =========================
            Stats
        ========================== */}

        <section className="account-stats-grid">

          <div className="account-stat-card">
            <div className="account-stat-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                إجمالي الطلبات
              </span>

              <strong>
                {totalOrders}
              </strong>
            </div>
          </div>

          <div className="account-stat-card">
            <div className="account-stat-icon">
              <CreditCard size={21} />
            </div>

            <div>
              <span>
                الكروت
              </span>

              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.card_id
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="account-stat-card">
            <div className="account-stat-icon">
              <Store size={21} />
            </div>

            <div>
              <span>
                الأنشطة
              </span>

              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.shop_id &&
                      order.shops?.slug
                  ).length
                }
              </strong>
            </div>
          </div>
        </section>

        {/* =========================
            Orders
        ========================== */}

        <section className="account-orders-section">

          <div className="account-section-heading">
            <div>
              <span className="account-section-kicker">
                Orders
              </span>

              <h2>
                طلباتك
              </h2>

              <p>
                تابع حالة كل طلب والكارت المرتبط بيه.
              </p>
            </div>

            <Link
              to="/order"
              className="account-new-order-link"
            >
              <Package size={18} />
              طلب جديد
            </Link>
          </div>

          {loadingOrders ? (
            <div className="account-loading-box">
              <LoaderCircle
                size={28}
                className="account-spin"
              />

              <span>
                جاري تحميل الطلبات...
              </span>
            </div>
          ) : orders.length === 0 ? (
            <div className="account-empty-state">

              <div className="account-empty-icon">
                <Package size={32} />
              </div>

              <h3>
                لسه مفيش طلبات
              </h3>

              <p>
                لما تعمل أول طلب ليك، هتقدر تتابعه
                من هنا.
              </p>

              <Link
                to="/order"
                className="btn btn-primary"
              >
                اطلب كارتك الأول
                <ArrowLeft size={18} />
              </Link>
            </div>
          ) : (
            <div className="account-orders-list">

              {orders.map((order) => {
                const status =
                  STATUS_META[order.status] ||
                  STATUS_META.pending;

                const StatusIcon =
                  status.icon;

                const progress =
                  getProgress(order.status);

                const message =
                  getOrderMessage(
                    order.status
                  );

                const cardStatus =
                  getCardStatus(order);

                const shop =
                  order.shops || null;

                const card =
                  order.cards || null;

                const shopAvailable =
                  Boolean(
                    order.shop_id &&
                    shop?.slug
                  );

                const canOpenShop =
                  shopAvailable &&
                  [
                    "approved",
                    "ready",
                    "delivered",
                  ].includes(
                    order.status
                  );

                const showCardData =
                  isCardVisible(order) &&
                  Boolean(card);

                const cardStatusValue =
                  String(
                    card?.status || ""
                  )
                    .trim()
                    .toLowerCase();

                const cardIsActive =
                  cardStatusValue ===
                  "active";

                const cardUrl =
                  shop?.slug
                    ? buildShopUrl(
                        shop.slug
                      )
                    : "";

                return (
                  <article
                    key={order.id}
                    className="account-order-card"
                  >

                    {/* Order top */}

                    <div className="account-order-top">

                      <div>
                        <div className="account-order-number">
                          طلب #{order.id}
                        </div>

                        <div className="account-order-date">
                          <CalendarDays size={15} />

                          {formatDate(
                            order.created_at
                          )}
                        </div>
                      </div>

                      <div
                        className={`account-status-badge status-${order.status}`}
                      >
                        <StatusIcon size={16} />

                        {status.label}
                      </div>
                    </div>

                    {/* Status message */}

                    <div className="account-order-message">

                      <div className="account-order-message-icon">
                        <StatusIcon size={20} />
                      </div>

                      <div>
                        <strong>
                          {message.title}
                        </strong>

                        <p>
                          {message.text}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}

                    {order.status !== "cancelled" && (
                      <div className="account-progress">

                        {STATUS_STEPS.map(
                          (step, index) => {
                            const active =
                              index <=
                              progress;

                            const current =
                              index ===
                              progress;

                            return (
                              <div
                                key={step.key}
                                className={`account-progress-step ${
                                  active
                                    ? "active"
                                    : ""
                                } ${
                                  current
                                    ? "current"
                                    : ""
                                }`}
                              >
                                <div className="account-progress-dot">

                                  {active ? (
                                    <CheckCircle2
                                      size={17}
                                    />
                                  ) : (
                                    <span>
                                      {index + 1}
                                    </span>
                                  )}

                                </div>

                                <span>
                                  {step.label}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                    {/* Order details */}

                    <div className="account-order-details">

                      <div className="account-detail-item">
                        <span>
                          <Store size={16} />
                          النشاط
                        </span>

                        <strong>
                          {order.shop_name ||
                            shop?.name ||
                            "-"}
                        </strong>
                      </div>

                      <div className="account-detail-item">
                        <span>
                          <User size={16} />
                          المسؤول
                        </span>

                        <strong>
                          {order.responsible ||
                            "-"}
                        </strong>
                      </div>

                      <div className="account-detail-item">
                        <span>
                          <Phone size={16} />
                          رقم الهاتف
                        </span>

                        <strong>
                          {order.phone ||
                            "-"}
                        </strong>
                      </div>

                      <div className="account-detail-item">
                        <span>
                          <CreditCard size={16} />
                          الباقة
                        </span>

                        <strong>
                          {order.plan ||
                            "-"}
                        </strong>
                      </div>

                      <div className="account-detail-item">
                        <span>
                          <Sparkles size={16} />
                          السعر
                        </span>

                        <strong>
                          {order.plan_price != null
                            ? `${order.plan_price} ${
                                order.currency ||
                                "EGP"
                              }`
                            : "-"}
                        </strong>
                      </div>

                      <div className="account-detail-item">
                        <span>
                          <CreditCard size={16} />
                          حالة الكارت
                        </span>

                        <strong
                          className={
                            cardStatus.className
                          }
                        >
                          {cardStatus.label}
                        </strong>
                      </div>
                    </div>

                    {/* =========================
                        Real Card Data
                    ========================== */}

                    {showCardData && (
                      <div className="account-real-card-box">

                        <div className="account-real-card-header">

                          <div className="account-real-card-title">

                            <div className="account-real-card-icon">
                              <CreditCard size={22} />
                            </div>

                            <div>
                              <span>
                                Smart Card
                              </span>

                              <strong>
                                بيانات الكارت الخاص بك
                              </strong>
                            </div>
                          </div>

                          <div
                            className={`account-real-card-active ${
                              cardIsActive
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <span className="account-real-card-dot" />

                            {cardIsActive
                              ? "الكارت نشط"
                              : "الكارت غير نشط"}
                          </div>
                        </div>

                        <div className="account-real-card-content">

                          {/* QR */}

                          <div className="account-qr-area">

                            <div className="account-qr-frame">

                              {card.qr_code ? (
                                <img
                                  src={
                                    card.qr_code
                                  }
                                  alt="QR Code"
                                  className="account-qr-image"
                                />
                              ) : (
                                <div className="account-qr-empty">
                                  <CreditCard size={30} />

                                  <span>
                                    QR Code غير متاح
                                  </span>
                                </div>
                              )}

                            </div>

                            <span className="account-qr-label">
                              امسح الكود لفتح صفحة نشاطك
                            </span>
                          </div>

                          {/* Card information */}

                          <div className="account-card-data">

                            <div className="account-card-data-item">

                              <span>
                                <CreditCard size={15} />
                                رقم الكارت
                              </span>

                              <strong dir="ltr">
                                {card.card_number ||
                                  "-"}
                              </strong>
                            </div>

                            <div className="account-card-data-item">

                              <span>
                                <CheckCircle2 size={15} />
                                حالة الكارت
                              </span>

                              <strong
                                className={
                                  cardIsActive
                                    ? "account-card-active-text"
                                    : "account-card-inactive-text"
                                }
                              >
                                {cardIsActive
                                  ? "نشط"
                                  : "غير نشط"}
                              </strong>
                            </div>

                            <div className="account-card-data-item">

                              <span>
                                <CalendarDays size={15} />
                                تاريخ إنشاء الكارت
                              </span>

                              <strong>
                                {formatDate(
                                  card.created_at
                                )}
                              </strong>
                            </div>

                            {card.status && (
                              <div className="account-card-data-item">

                                <span>
                                  <Sparkles size={15} />
                                  حالة النظام
                                </span>

                                <strong>
                                  {card.status}
                                </strong>
                              </div>
                            )}

                            {card.nfc_url && (
                              <div className="account-card-data-item">

                                <span>
                                  <Wifi size={15} />
                                  رابط NFC
                                </span>

                                <a
                                  href={
                                    card.nfc_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="account-nfc-link"
                                >
                                  فتح رابط NFC
                                  <ArrowLeft size={14} />
                                </a>
                              </div>
                            )}

                            {cardUrl && (
                              <div className="account-card-data-item account-card-link-item">

                                <span>
                                  <Eye size={15} />
                                  رابط صفحة النشاط
                                </span>

                                <div className="account-card-link-actions">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopyCardLink(
                                        order
                                      )
                                    }
                                    className="account-copy-button"
                                  >
                                    {copiedCardId ===
                                    order.id ? (
                                      <>
                                        <Check size={14} />
                                        تم النسخ
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={14} />
                                        نسخ الرابط
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card actions */}

                        <div className="account-real-card-actions">

                          {cardUrl && (
                            <a
                              href={cardUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="account-card-main-button"
                            >
                              <Eye size={18} />
                              فتح صفحة الكارت
                              <ArrowLeft size={17} />
                            </a>
                          )}

                          {card.nfc_url && (
                            <a
                              href={
                                card.nfc_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="account-card-secondary-button"
                            >
                              <Wifi size={18} />
                              تجربة NFC
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Business / Card */}

                    {(order.shop_id ||
                      order.card_id ||
                      shopAvailable) && (
                      <div className="account-business-box">

                        <div className="account-business-header">

                          <div className="account-business-icon">
                            <Store size={21} />
                          </div>

                          <div>
                            <span>
                              نشاطك التجاري
                            </span>

                            <strong>
                              {shop?.name ||
                                order.shop_name ||
                                "نشاطك التجاري"}
                            </strong>
                          </div>
                        </div>

                        <div className="account-business-info">

                          <div>
                            <span>
                              <CreditCard size={15} />
                              الكارت
                            </span>

                            <strong>
                              {order.card_id
                                ? card?.card_number ||
                                  "مرتبط بالطلب"
                                : "لم يتم إنشاء الكارت بعد"}
                            </strong>
                          </div>

                          {shop?.slug && (
                            <div>
                              <span>
                                <MapPin size={15} />
                                صفحة النشاط
                              </span>

                              <strong>
                                متاحة
                              </strong>
                            </div>
                          )}
                        </div>

                        {canOpenShop && (
                          <Link
                            to={buildShopUrl(
                              shop.slug
                            ).replace(
                              window.location.origin,
                              ""
                            )}
                            className="account-shop-button"
                          >
                            <Eye size={18} />
                            فتح صفحة النشاط
                            <ArrowLeft size={17} />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Admin notes */}

                    {order.admin_notes && (
                      <div className="account-admin-note">

                        <strong>
                          ملاحظة من فريق Smart Card
                        </strong>

                        <p>
                          {order.admin_notes}
                        </p>
                      </div>
                    )}

                    {/* Approved date */}

                    {order.approved_at && (
                      <div className="account-approved-date">

                        <CheckCircle2 size={15} />

                        تم اعتماد الطلب بتاريخ{" "}
                        {formatDate(
                          order.approved_at
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .account-page {
          min-height: calc(100vh - 76px);
          padding: 55px 0 90px;
        }

        .account-container {
          max-width: 1180px;
        }

        .account-loading {
          min-height: 55vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: var(--text-dim);
        }

        .account-spin {
          animation: account-spin 1s linear infinite;
        }

        @keyframes account-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .account-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 28px;
        }

        .account-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--gold-soft);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .5px;
          margin-bottom: 10px;
        }

        .account-header h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 44px);
          line-height: 1.2;
        }

        .account-header p {
          margin: 10px 0 0;
          color: var(--text-dim);
          font-size: 15px;
          line-height: 1.8;
        }

        .account-profile-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px;
          margin-bottom: 22px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(212, 175, 55, .10),
              transparent 32%
            ),
            rgba(15, 20, 31, .78);
          box-shadow: 0 18px 50px rgba(0, 0, 0, .16);
        }

        .account-profile-main {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .account-avatar {
          position: relative;
          flex: 0 0 auto;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(212, 175, 55, .65);
          background:
            linear-gradient(
              135deg,
              var(--gold),
              var(--gold-soft)
            );
          box-shadow:
            0 8px 25px rgba(0, 0, 0, .22);
        }

        .account-avatar img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .account-avatar-fallback {
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #15110a;
          font-size: 22px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .account-profile-info {
          min-width: 0;
        }

        .account-profile-label {
          display: block;
          color: var(--gold-soft);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .account-profile-info h2 {
          margin: 0;
          font-size: 23px;
          font-weight: 850;
        }

        .account-email {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 8px;
          color: var(--text-dim);
          font-size: 14px;
          overflow: hidden;
        }

        .account-email span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .account-profile-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .account-profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(212, 175, 55, .09);
          border: 1px solid rgba(212, 175, 55, .18);
          color: var(--gold-soft);
          font-size: 13px;
          font-weight: 700;
        }

        .account-logout-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 42px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, .025);
          color: var(--text-dim);
          cursor: pointer;
          font-family: inherit;
          font-weight: 700;
          transition: .2s ease;
        }

        .account-logout-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, .22);
          background: rgba(255, 255, 255, .06);
        }

        .account-logout-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .account-success-message,
        .account-error-message {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 17px 18px;
          border-radius: 16px;
          margin-bottom: 22px;
        }

        .account-success-message {
          background: rgba(34, 197, 94, .08);
          border: 1px solid rgba(34, 197, 94, .18);
        }

        .account-error-message {
          background: rgba(239, 68, 68, .08);
          border: 1px solid rgba(239, 68, 68, .18);
        }

        .account-success-icon {
          color: #4ade80;
        }

        .account-error-message > svg {
          color: #f87171;
          flex: 0 0 auto;
        }

        .account-success-message strong,
        .account-error-message strong {
          display: block;
          margin-bottom: 3px;
        }

        .account-success-message p,
        .account-error-message p {
          margin: 0;
          color: var(--text-dim);
          font-size: 14px;
          line-height: 1.7;
        }

        .account-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 48px;
        }

        .account-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: rgba(255, 255, 255, .025);
        }

        .account-stat-icon {
          width: 45px;
          height: 45px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-soft);
          background: rgba(212, 175, 55, .09);
          border: 1px solid rgba(212, 175, 55, .14);
          flex: 0 0 auto;
        }

        .account-stat-card span {
          display: block;
          color: var(--text-dim);
          font-size: 13px;
          margin-bottom: 3px;
        }

        .account-stat-card strong {
          display: block;
          font-size: 24px;
        }

        .account-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .account-section-kicker {
          display: block;
          color: var(--gold-soft);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1.5px;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .account-section-heading h2 {
          margin: 0;
          font-size: 29px;
        }

        .account-section-heading p {
          margin: 7px 0 0;
          color: var(--text-dim);
          font-size: 14px;
        }

        .account-new-order-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--gold-soft);
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
        }

        .account-empty-state {
          padding: 55px 25px;
          text-align: center;
          border: 1px dashed var(--border);
          border-radius: 20px;
          background: rgba(255, 255, 255, .018);
        }

        .account-empty-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-soft);
          background: rgba(212, 175, 55, .08);
        }

        .account-empty-state h3 {
          margin: 0 0 7px;
          font-size: 21px;
        }

        .account-empty-state p {
          margin: 0 0 20px;
          color: var(--text-dim);
        }

        .account-loading-box {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--text-dim);
          border: 1px solid var(--border);
          border-radius: 20px;
        }

        .account-orders-list {
          display: grid;
          gap: 20px;
        }

        .account-order-card {
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background: rgba(15, 20, 31, .72);
          box-shadow: 0 12px 35px rgba(0, 0, 0, .12);
        }

        .account-order-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 17px;
          border-bottom: 1px solid var(--border);
        }

        .account-order-number {
          font-size: 17px;
          font-weight: 850;
        }

        .account-order-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dim);
          font-size: 12px;
          margin-top: 5px;
        }

        .account-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status-pending,
        .status-reviewing {
          color: #facc15;
          background: rgba(250, 204, 21, .08);
          border: 1px solid rgba(250, 204, 21, .15);
        }

        .status-approved,
        .status-ready,
        .status-delivered {
          color: #4ade80;
          background: rgba(74, 222, 128, .08);
          border: 1px solid rgba(74, 222, 128, .15);
        }

        .status-cancelled {
          color: #f87171;
          background: rgba(248, 113, 113, .08);
          border: 1px solid rgba(248, 113, 113, .15);
        }

        .account-order-message {
          display: flex;
          gap: 12px;
          padding: 17px 0;
        }

        .account-order-message-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: var(--gold-soft);
          background: rgba(212, 175, 55, .08);
        }

        .account-order-message strong {
          display: block;
          font-size: 16px;
          margin-bottom: 3px;
        }

        .account-order-message p {
          margin: 0;
          color: var(--text-dim);
          font-size: 13px;
          line-height: 1.7;
        }

        .account-progress {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin: 4px 0 22px;
          padding: 15px 0 5px;
        }

        .account-progress-step {
          position: relative;
          text-align: center;
          color: var(--text-dim);
          font-size: 11px;
        }

        .account-progress-step:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 15px;
          left: calc(50% + 18px);
          width: calc(100% - 36px);
          height: 2px;
          background: var(--border);
        }

        .account-progress-step.active:not(:last-child)::after {
          background: rgba(212, 175, 55, .55);
        }

        .account-progress-dot {
          position: relative;
          z-index: 2;
          width: 31px;
          height: 31px;
          margin: 0 auto 7px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #151b28;
          border: 1px solid var(--border);
        }

        .account-progress-step.active {
          color: var(--gold-soft);
        }

        .account-progress-step.active .account-progress-dot {
          color: var(--gold-soft);
          border-color: rgba(212, 175, 55, .5);
          background: rgba(212, 175, 55, .09);
        }

        .account-progress-step.current .account-progress-dot {
          box-shadow: 0 0 0 5px rgba(212, 175, 55, .07);
        }

        .account-order-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding-top: 4px;
        }

        .account-detail-item {
          padding: 13px;
          border-radius: 13px;
          background: rgba(255, 255, 255, .025);
          border: 1px solid rgba(255, 255, 255, .04);
        }

        .account-detail-item span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dim);
          font-size: 11px;
          margin-bottom: 5px;
        }

        .account-detail-item strong {
          display: block;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .account-card-status-success {
          color: #4ade80;
        }

        .account-card-status-warning {
          color: #facc15;
        }

        .account-card-status-muted {
          color: var(--text-dim);
        }

        .account-real-card-box {
          margin-top: 18px;
          padding: 18px;
          border-radius: 19px;
          border: 1px solid rgba(212, 175, 55, .20);
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(212, 175, 55, .12),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              rgba(212, 175, 55, .055),
              rgba(255, 255, 255, .018)
            );
          overflow: hidden;
        }

        .account-real-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(212, 175, 55, .12);
        }

        .account-real-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-real-card-icon {
          width: 45px;
          height: 45px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-soft);
          background: rgba(212, 175, 55, .10);
          border: 1px solid rgba(212, 175, 55, .16);
          flex: 0 0 auto;
        }

        .account-real-card-title span {
          display: block;
          color: var(--gold-soft);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 3px;
        }

        .account-real-card-title strong {
          display: block;
          font-size: 16px;
        }

        .account-real-card-active {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
        }

        .account-real-card-active.active {
          color: #4ade80;
          background: rgba(74, 222, 128, .08);
          border: 1px solid rgba(74, 222, 128, .14);
        }

        .account-real-card-active.inactive {
          color: #facc15;
          background: rgba(250, 204, 21, .08);
          border: 1px solid rgba(250, 204, 21, .14);
        }

        .account-real-card-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .account-real-card-content {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 22px;
          padding: 20px 0;
        }

        .account-qr-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .account-qr-frame {
          width: 165px;
          height: 165px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, .22);
        }

        .account-qr-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .account-qr-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 100%;
          color: #777;
          text-align: center;
          font-size: 11px;
        }

        .account-qr-label {
          margin-top: 9px;
          color: var(--text-dim);
          font-size: 10px;
          text-align: center;
          line-height: 1.5;
        }

        .account-card-data {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .account-card-data-item {
          min-width: 0;
          padding: 13px;
          border-radius: 13px;
          background: rgba(255, 255, 255, .025);
          border: 1px solid rgba(255, 255, 255, .05);
        }

        .account-card-data-item > span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dim);
          font-size: 10px;
          margin-bottom: 6px;
        }

        .account-card-data-item > strong {
          display: block;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .account-card-active-text {
          color: #4ade80;
        }

        .account-card-inactive-text {
          color: #facc15;
        }

        .account-nfc-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--gold-soft);
          font-size: 12px;
          font-weight: 800;
        }

        .account-card-link-item {
          grid-column: 1 / -1;
        }

        .account-card-link-actions {
          display: flex;
          align-items: center;
        }

        .account-copy-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 32px;
          padding: 0 11px;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, .18);
          background: rgba(212, 175, 55, .06);
          color: var(--gold-soft);
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }

        .account-copy-button:hover {
          background: rgba(212, 175, 55, .12);
        }

        .account-real-card-actions {
          display: flex;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid rgba(212, 175, 55, .12);
        }

        .account-card-main-button,
        .account-card-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 43px;
          padding: 0 15px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 850;
          transition: .2s ease;
        }

        .account-card-main-button {
          color: #17120a;
          background: linear-gradient(
            135deg,
            var(--gold),
            var(--gold-soft)
          );
        }

        .account-card-secondary-button {
          color: var(--gold-soft);
          background: rgba(212, 175, 55, .06);
          border: 1px solid rgba(212, 175, 55, .17);
        }

        .account-business-box {
          margin-top: 16px;
          padding: 17px;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              rgba(212, 175, 55, .06),
              rgba(255, 255, 255, .018)
            );
          border: 1px solid rgba(212, 175, 55, .12);
        }

        .account-business-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-business-icon {
          width: 43px;
          height: 43px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-soft);
          background: rgba(212, 175, 55, .09);
        }

        .account-business-header span {
          display: block;
          color: var(--text-dim);
          font-size: 11px;
          margin-bottom: 3px;
        }

        .account-business-header strong {
          display: block;
          font-size: 15px;
        }

        .account-business-info {
          display: flex;
          gap: 12px;
          margin-top: 14px;
        }

        .account-business-info > div {
          flex: 1;
          padding: 11px;
          border-radius: 11px;
          background: rgba(255, 255, 255, .025);
        }

        .account-business-info span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-dim);
          font-size: 11px;
          margin-bottom: 5px;
        }

        .account-business-info strong {
          font-size: 12px;
        }

        .account-shop-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 45px;
          margin-top: 12px;
          border-radius: 12px;
          color: #17120a;
          background: linear-gradient(
            135deg,
            var(--gold),
            var(--gold-soft)
          );
          font-weight: 850;
          font-size: 13px;
        }

        .account-admin-note {
          margin-top: 15px;
          padding: 14px 16px;
          border-radius: 13px;
          background: rgba(59, 130, 246, .06);
          border: 1px solid rgba(59, 130, 246, .12);
        }

        .account-admin-note strong {
          display: block;
          font-size: 12px;
          color: #93c5fd;
          margin-bottom: 4px;
        }

        .account-admin-note p {
          margin: 0;
          color: var(--text-dim);
          font-size: 13px;
          line-height: 1.7;
        }

        .account-approved-date {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 13px;
          color: var(--text-dim);
          font-size: 11px;
        }

        .account-approved-date svg {
          color: #4ade80;
        }

        @media (max-width: 850px) {
          .account-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .account-profile-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .account-profile-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .account-stats-grid {
            grid-template-columns: 1fr;
          }

          .account-order-details {
            grid-template-columns: repeat(2, 1fr);
          }

          .account-real-card-content {
            grid-template-columns: 150px 1fr;
            gap: 16px;
          }

          .account-qr-frame {
            width: 140px;
            height: 140px;
          }
        }

        @media (max-width: 650px) {
          .account-page {
            padding: 35px 0 60px;
          }

          .account-header h1 {
            font-size: 30px;
          }

          .account-profile-card {
            padding: 18px;
            border-radius: 18px;
          }

          .account-profile-main {
            align-items: flex-start;
          }

          .account-avatar {
            width: 62px;
            height: 62px;
          }

          .account-profile-info h2 {
            font-size: 19px;
          }

          .account-profile-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .account-profile-badge,
          .account-logout-btn {
            justify-content: center;
            width: 100%;
          }

          .account-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .account-order-card {
            padding: 16px;
            border-radius: 18px;
          }

          .account-order-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .account-status-badge {
            align-self: flex-start;
          }

          .account-progress {
            gap: 2px;
          }

          .account-progress-step {
            font-size: 9px;
          }

          .account-progress-step:not(:last-child)::after {
            left: calc(50% + 16px);
            width: calc(100% - 32px);
          }

          .account-progress-dot {
            width: 29px;
            height: 29px;
          }

          .account-order-details {
            grid-template-columns: 1fr;
          }

          .account-business-info {
            flex-direction: column;
          }

          .account-real-card-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .account-real-card-content {
            grid-template-columns: 1fr;
          }

          .account-qr-area {
            width: 100%;
          }

          .account-qr-frame {
            width: 175px;
            height: 175px;
          }

          .account-card-data {
            grid-template-columns: 1fr;
          }

          .account-card-link-item {
            grid-column: auto;
          }

          .account-real-card-actions {
            flex-direction: column;
          }

          .account-card-main-button,
          .account-card-secondary-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}