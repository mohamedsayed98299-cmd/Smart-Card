import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  LogOut,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
  ExternalLink,
  CreditCard,
} from "lucide-react";

import {
  supabase,
  buildShopUrl,
} from "../lib/supabase.js";

const STATUS_META = {
  pending: {
    label: "طلب جديد",
    className: "pending",
    icon: Clock3,
  },

  reviewing: {
    label: "جاري التنفيذ",
    className: "pending",
    icon: Clock3,
  },

  approved: {
    label: "تم اعتماد الطلب",
    className: "approved",
    icon: CheckCircle2,
  },

  ready: {
    label: "الكارت جاهز",
    className: "ready",
    icon: CheckCircle2,
  },

  delivered: {
    label: "تم التسليم",
    className: "delivered",
    icon: CheckCircle2,
  },

  cancelled: {
    label: "تم إلغاء الطلب",
    className: "cancelled",
    icon: XCircle,
  },
};

function getStatusMeta(status) {
  return (
    STATUS_META[status] || {
      label: status || "غير محدد",
      className: "pending",
      icon: Clock3,
    }
  );
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          navigate("/order", {
            replace: true,
          });

          return;
        }

        setUser(currentUser);

        const {
          data,
          error: ordersError,
        } = await supabase
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
            )
          `)
          .eq("user_id", currentUser.id)
          .order("created_at", {
            ascending: false,
          });

        if (ordersError) {
          throw ordersError;
        }

        if (!mounted) return;

        setOrders(data || []);
      } catch (accountError) {
        console.error(
          "ACCOUNT LOAD ERROR:",
          accountError
        );

        if (mounted) {
          setError(
            accountError?.message ||
              "تعذر تحميل بيانات الحساب."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setOrdersLoading(false);
        }
      }
    }

    loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (!session?.user) {
          navigate("/order", {
            replace: true,
          });

          return;
        }

        setUser(session.user);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();

    navigate("/", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="state-box">
            <Loader2
              size={28}
              className="spin-icon"
            />

            <p
              style={{
                marginTop: 12,
              }}
            >
              جاري تحميل حسابك...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section sc-account-page">
      <div
        className="container"
        style={{
          maxWidth: 1050,
        }}
      >
        {/* HEADER */}
        <div className="section-header">
          <span className="section-tag">
            حسابي
          </span>

          <h1 className="section-title">
            أهلاً بيك في Smart Card
          </h1>

          <p className="section-subtitle">
            تابع طلباتك وحالة الكارت والبيانات الخاصة
            بنشاطك من مكان واحد.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="error-box"
            style={{
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {/* ACCOUNT INFO */}
        <div
          className="grid grid-2"
          style={{
            marginBottom: 24,
          }}
        >
          <div className="card sc-account-info-card">
            <div className="sc-account-icon">
              <User size={24} />
            </div>

            <div>
              <span className="sc-account-label">
                الحساب
              </span>

              <h3 className="sc-account-value">
                {user?.email || "حساب العميل"}
              </h3>

              <p className="sc-account-muted">
                حسابك مرتبط بطلبات Smart Card الخاصة
                بك.
              </p>
            </div>
          </div>

          <div className="card sc-account-info-card">
            <div className="sc-account-icon">
              <Package size={24} />
            </div>

            <div>
              <span className="sc-account-label">
                إجمالي الطلبات
              </span>

              <h3 className="sc-account-value">
                {orders.length}
              </h3>

              <p className="sc-account-muted">
                كل طلباتك المسجلة على الحساب.
              </p>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="card sc-account-orders">
          <div className="sc-account-orders-head">
            <div>
              <span className="section-tag">
                طلباتي
              </span>

              <h2>
                طلبات Smart Card
              </h2>

              <p>
                تقدر تتابع حالة كل طلب من هنا.
              </p>
            </div>

            <Link
              to="/order"
              className="btn btn-primary"
            >
              طلب كارت جديد
              <ArrowLeft size={17} />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="state-box">
              <Loader2
                size={26}
                className="spin-icon"
              />

              <p
                style={{
                  marginTop: 10,
                }}
              >
                جاري تحميل الطلبات...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="sc-account-empty">
              <div className="sc-account-empty-icon">
                <CreditCard size={30} />
              </div>

              <h3>
                لسه مفيش طلبات
              </h3>

              <p>
                لما تعمل أول طلب Smart Card،
                هيظهر هنا وتقدر تتابع حالته.
              </p>

              <Link
                to="/order"
                className="btn btn-primary"
              >
                ابدأ طلبك الآن
                <ArrowLeft size={17} />
              </Link>
            </div>
          ) : (
            <div className="sc-account-order-list">
              {orders.map((order) => {
                const statusMeta =
                  getStatusMeta(
                    order.status
                  );

                const StatusIcon =
                  statusMeta.icon;

                const shop =
                  order.shops;

                return (
                  <article
                    key={order.id}
                    className="sc-account-order"
                  >
                    <div className="sc-account-order-main">
                      <div className="sc-account-order-title">
                        <div className="sc-account-order-icon">
                          <Package size={20} />
                        </div>

                        <div>
                          <h3>
                            {order.shop_name ||
                              "Smart Card"}
                          </h3>

                          <p>
                            {order.plan ||
                              "Smart Card"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`sc-account-status ${statusMeta.className}`}
                      >
                        <StatusIcon
                          size={15}
                        />

                        {statusMeta.label}
                      </div>
                    </div>

                    <div className="sc-account-order-details">
                      <div>
                        <span>
                          تاريخ الطلب
                        </span>

                        <strong>
                          {formatDate(
                            order.created_at
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          المسؤول
                        </span>

                        <strong>
                          {order.responsible ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          الباقة
                        </span>

                        <strong>
                          {order.plan ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          السعر
                        </span>

                        <strong>
                          {order.plan_price
                            ? `${order.plan_price} ${
                                order.currency ||
                                "EGP"
                              }`
                            : "—"}
                        </strong>
                      </div>
                    </div>

                    {order.admin_notes && (
                      <div className="sc-account-note">
                        <strong>
                          ملاحظة من Smart Card:
                        </strong>

                        <span>
                          {order.admin_notes}
                        </span>
                      </div>
                    )}

                    {shop?.slug && (
                      <div className="sc-account-shop-link">
                        <span>
                          صفحة نشاطك:
                        </span>

                        <a
                          href={buildShopUrl(
                            shop.slug
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          فتح صفحة النشاط
                          <ExternalLink
                            size={15}
                          />
                        </a>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="sc-account-footer-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={logout}
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <style>{`
        .sc-account-page {
          min-height: 70vh;
        }

        .sc-account-info-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .sc-account-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--gold-soft);
          background: rgba(212,175,55,.10);
          border: 1px solid rgba(212,175,55,.18);
        }

        .sc-account-label {
          display: block;
          color: var(--text-faint);
          font-size: 12px;
          margin-bottom: 5px;
        }

        .sc-account-value {
          margin: 0;
          font-size: 17px;
          word-break: break-word;
        }

        .sc-account-muted {
          margin-top: 6px;
          color: var(--text-dim);
          font-size: 12px;
          line-height: 1.7;
        }

        .sc-account-orders {
          overflow: hidden;
        }

        .sc-account-orders-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 25px;
          border-bottom: 1px solid var(--border);
        }

        .sc-account-orders-head h2 {
          margin: 10px 0 5px;
          font-size: 22px;
        }

        .sc-account-orders-head p {
          color: var(--text-dim);
          font-size: 13px;
        }

        .sc-account-order-list {
          display: grid;
        }

        .sc-account-order {
          padding: 23px 25px;
          border-bottom: 1px solid var(--border);
        }

        .sc-account-order:last-child {
          border-bottom: 0;
        }

        .sc-account-order-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .sc-account-order-title {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .sc-account-order-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: var(--gold-soft);
          background: rgba(212,175,55,.09);
        }

        .sc-account-order-title h3 {
          margin: 0;
          font-size: 16px;
        }

        .sc-account-order-title p {
          margin-top: 3px;
          color: var(--text-dim);
          font-size: 12px;
        }

        .sc-account-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 999px;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 800;
        }

        .sc-account-status.pending {
          color: #f5d77b;
          background: rgba(212,175,55,.10);
          border: 1px solid rgba(212,175,55,.18);
        }

        .sc-account-status.approved,
        .sc-account-status.ready,
        .sc-account-status.delivered {
          color: #75e0ae;
          background: rgba(51,196,129,.09);
          border: 1px solid rgba(51,196,129,.18);
        }

        .sc-account-status.cancelled {
          color: #ff9a9f;
          background: rgba(229,72,77,.09);
          border: 1px solid rgba(229,72,77,.18);
        }

        .sc-account-order-details {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px;
          margin-top: 20px;
          padding: 15px;
          border-radius: 14px;
          background: rgba(255,255,255,.025);
        }

        .sc-account-order-details div {
          min-width: 0;
        }

        .sc-account-order-details span {
          display: block;
          color: var(--text-faint);
          font-size: 10px;
          margin-bottom: 5px;
        }

        .sc-account-order-details strong {
          display: block;
          color: var(--text);
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .sc-account-note {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 13px;
          padding: 11px 13px;
          border-radius: 12px;
          color: var(--text-dim);
          background: rgba(212,175,55,.055);
          border: 1px solid rgba(212,175,55,.10);
          font-size: 12px;
          line-height: 1.7;
        }

        .sc-account-note strong {
          color: var(--gold-soft);
          white-space: nowrap;
        }

        .sc-account-shop-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 13px;
          color: var(--text-dim);
          font-size: 12px;
        }

        .sc-account-shop-link a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--gold-soft);
          font-weight: 800;
        }

        .sc-account-empty {
          text-align: center;
          padding: 55px 25px;
        }

        .sc-account-empty-icon {
          width: 68px;
          height: 68px;
          margin: 0 auto 17px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          color: var(--gold-soft);
          background: rgba(212,175,55,.09);
          border: 1px solid rgba(212,175,55,.15);
        }

        .sc-account-empty h3 {
          margin-bottom: 7px;
          font-size: 18px;
        }

        .sc-account-empty p {
          max-width: 430px;
          margin: 0 auto 20px;
          color: var(--text-dim);
          font-size: 13px;
          line-height: 1.8;
        }

        .sc-account-footer-actions {
          display: flex;
          justify-content: flex-start;
          margin-top: 20px;
        }

        @media (max-width: 700px) {
          .sc-account-orders-head {
            flex-direction: column;
            align-items: stretch;
          }

          .sc-account-orders-head .btn {
            width: 100%;
            justify-content: center;
          }

          .sc-account-order-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .sc-account-status {
            align-self: flex-start;
          }

          .sc-account-order-details {
            grid-template-columns: 1fr 1fr;
          }

          .sc-account-shop-link {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 430px) {
          .sc-account-order {
            padding: 19px 15px;
          }

          .sc-account-orders-head {
            padding: 20px 15px;
          }

          .sc-account-order-details {
            grid-template-columns: 1fr;
          }

          .sc-account-info-card {
            padding: 18px;
          }

          .sc-account-footer-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}