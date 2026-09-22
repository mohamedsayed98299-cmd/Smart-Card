import "./dashboard.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
  X,
  Eye,
  Star,
  MessageCircle,
  Phone,
  Globe,
  MapPin,
  Share2,
  QrCode,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

import {
  supabase,
  buildShopUrl,
  generateCardNumber,
  generateSlug,
} from "../lib/supabase.js";

import QRCodeCard from "../components/QRCodeCard.jsx";


/* =========================================================
   DASHBOARD CONTEXT
========================================================= */

const DashboardContext = createContext(null);

const EMPTY_SHOP = {
  name: "",
  responsible: "",
  phone: "",
  whatsapp: "",
  google_review: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  website: "",
  location: "",
  description: "",
  logo_url: "",
  is_active: true,
};

function useDashboard() {
  const value = useContext(DashboardContext);

  if (!value) {
    throw new Error("Dashboard context is missing");
  }

  return value;
}


/* =========================================================
   ADMIN SESSION
========================================================= */

function useAdminSession() {
  const [state, setState] = useState({
    loading: true,
    session: null,
    admin: false,
  });

  useEffect(() => {
    let alive = true;

    async function check() {
      const { data } =
        await supabase.auth.getSession();

      if (!data.session) {
        if (alive) {
          setState({
            loading: false,
            session: null,
            admin: false,
          });
        }

        return;
      }

      const { data: admin } =
        await supabase.rpc("is_admin");

      if (alive) {
        setState({
          loading: false,
          session: data.session,
          admin: !!admin,
        });
      }
    }

    check();

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return state;
}


/* =========================================================
   DASHBOARD PROVIDER
========================================================= */

function DashboardProvider({ children }) {
  const [shops, setShops] = useState([]);
  const [cards, setCards] = useState([]);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [user, setUser] =
    useState(null);

  const loadData =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const {
        data: userData,
      } =
        await supabase.auth.getUser();

      setUser(
        userData?.user || null
      );

      const [
        shopsRes,
        cardsRes,
        ordersRes,
        eventsRes,
      ] = await Promise.all([
        supabase
          .from("shops")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("cards")
          .select(
            "*, shops:shop_id(name, slug)"
          )
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("orders")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("shop_events")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      const failed = [
        shopsRes,
        cardsRes,
        ordersRes,
        eventsRes,
      ].find(
        (item) => item.error
      );

      if (failed) {
        setError(
          failed.error.message
        );
      }

      setShops(
        shopsRes.data || []
      );

      setCards(
        cardsRes.data || []
      );

      setOrders(
        ordersRes.data || []
      );

      setEvents(
        eventsRes.data || []
      );

      setLoading(false);
    }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = useMemo(
    () => ({
      shops,
      setShops,

      cards,
      setCards,

      orders,
      setOrders,

      events,

      loading,
      error,
      setError,

      user,

      loadData,
    }),
    [
      shops,
      cards,
      orders,
      events,
      loading,
      error,
      user,
      loadData,
    ]
  );

  return (
    <DashboardContext.Provider
      value={value}
    >
      {children}
    </DashboardContext.Provider>
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

const NAV = [
  {
    to: "/dashboard",
    label: "نظرة عامة",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/dashboard/shops",
    label: "المحلات",
    icon: Building2,
  },
  {
    to: "/dashboard/cards",
    label: "الكروت",
    icon: CreditCard,
  },
  {
    to: "/dashboard/orders",
    label: "الطلبات",
    icon: ShoppingCart,
  },
  {
    to: "/dashboard/analytics",
    label: "الإحصائيات",
    icon: BarChart3,
  },
];


/* =========================================================
   DASHBOARD SHELL
========================================================= */

function DashboardShell({
  children,
}) {
  const [open, setOpen] =
    useState(false);

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    error,
    setError,
  } = useDashboard();

  const logout = async () => {
    await supabase.auth.signOut();

    navigate("/admin", {
      replace: true,
    });
  };

  return (
    <div
      className="dashboard-app"
      dir="rtl"
    >

      <aside
        className={`dashboard-sidebar ${
          open ? "open" : ""
        }`}
      >

        <div className="dashboard-logo">

          <span>SC</span>

          <div>
            <strong>
              Smart Card
            </strong>

            <small>
              Admin Panel
            </small>
          </div>

        </div>


        <nav className="dashboard-nav">

          {NAV.map((item) => {
            const active = item.end
              ? location.pathname ===
                item.to
              : location.pathname.startsWith(
                  item.to
                );

            const Icon =
              item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  active ? "active" : ""
                }
                onClick={() =>
                  setOpen(false)
                }
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>

              </Link>
            );
          })}

        </nav>


        <button
          className="dashboard-logout"
          onClick={logout}
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>

      </aside>


      <div className="dashboard-main">

        <header className="dashboard-header">

          <button
            className="dashboard-mobile-menu"
            onClick={() =>
              setOpen((v) => !v)
            }
          >
            <Menu size={21} />
          </button>


          <div>

            <span className="dashboard-eyebrow">
              SMART CARD MANAGEMENT
            </span>

            <h1>
              {pageTitle(
                location.pathname
              )}
            </h1>

          </div>


          <div className="dashboard-user">

            <Bell size={18} />

            <span>
              {user?.email ||
                "Admin"}
            </span>

          </div>

        </header>


        <div className="dashboard-content">

          {error && (
            <div className="error-box dashboard-error">

              <span>
                {error}
              </span>

              <button
                onClick={() =>
                  setError("")
                }
              >
                <X size={16} />
              </button>

            </div>
          )}

          {children}

        </div>

      </div>

    </div>
  );
}


function pageTitle(pathname) {
  if (pathname === "/dashboard") {
    return "نظرة عامة";
  }

  if (
    pathname.startsWith(
      "/dashboard/shops"
    )
  ) {
    return "إدارة المحلات";
  }

  if (
    pathname.startsWith(
      "/dashboard/cards"
    )
  ) {
    return "إدارة الكروت";
  }

  if (
    pathname.startsWith(
      "/dashboard/orders"
    )
  ) {
    return "الطلبات";
  }

  if (
    pathname.startsWith(
      "/dashboard/analytics"
    )
  ) {
    return "الإحصائيات";
  }

  return "لوحة التحكم";
}


/* =========================================================
   OVERVIEW
========================================================= */

function Overview() {
  const {
    shops,
    cards,
    orders,
    events,
  } = useDashboard();

  const stats = [
    [
      "المحلات",
      shops.length,
      Building2,
    ],

    [
      "المحلات النشطة",
      shops.filter(
        (s) => s.is_active
      ).length,
      ToggleRight,
    ],

    [
      "الكروت",
      cards.length,
      CreditCard,
    ],

    [
      "الكروت النشطة",
      cards.filter(
        (c) =>
          c.status === "active"
      ).length,
      CreditCard,
    ],

    [
      "الطلبات",
      orders.length,
      ShoppingCart,
    ],

    [
      "زيارات الصفحات",
      events.filter(
        (e) =>
          e.event_type ===
          "page_view"
      ).length,
      Eye,
    ],
  ];

  return (
    <div className="dashboard-view">

      <div className="dashboard-welcome">

        <div>

          <span>
            ملخص سريع
          </span>

          <h2>
            إدارة Smart Card من مكان واحد
          </h2>

          <p>
            المحلات، الكروت، الطلبات،
            والنتائج في لوحة واحدة.
          </p>

        </div>


        <Link
          className="primary-dashboard-btn"
          to="/dashboard/shops"
        >
          <Plus size={17} />
          إضافة عميل
        </Link>

      </div>


      <div className="dashboard-stat-grid">

        {stats.map(
          ([
            label,
            value,
            Icon,
          ]) => (
            <div
              className="dashboard-stat"
              key={label}
            >

              <div>

                <span>
                  {label}
                </span>

                <strong>
                  {value}
                </strong>

              </div>

              <Icon size={24} />

            </div>
          )
        )}

      </div>


      <section className="dashboard-panel">

        <div className="dashboard-panel-head">

          <div>

            <h3>
              آخر المحلات
            </h3>

            <p>
              أحدث الأنشطة التي تمت
              إضافتها للنظام.
            </p>

          </div>

          <Link to="/dashboard/shops">
            عرض الكل
            <ExternalLink size={14} />
          </Link>

        </div>


        <div className="recent-shops-list">

          {shops
            .slice(0, 8)
            .map((shop) => (
              <div
                className="recent-shop-row"
                key={shop.id}
              >

                <div className="shop-avatar">
                  {shop.name?.charAt(
                    0
                  ) || "S"}
                </div>


                <div className="recent-shop-info">

                  <strong>
                    {shop.name}
                  </strong>

                  <small>
                    {shop.card_number ||
                      "بدون رقم كارت"}
                  </small>

                </div>


                <span
                  className={`status-pill ${
                    shop.is_active
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {shop.is_active
                    ? "نشط"
                    : "متوقف"}
                </span>


                <a
                  href={buildShopUrl(
                    shop.slug
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="table-icon-btn"
                >
                  <ExternalLink size={16} />
                </a>

              </div>
            ))}


          {!shops.length && (
            <div className="empty-dashboard">
              لسه مفيش محلات مضافة.
            </div>
          )}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   SHOPS MANAGEMENT
========================================================= */

function ShopsManagement() {
  const {
    shops,
    setShops,
    setCards,
    user,
    setError,
  } = useDashboard();

  const [search, setSearch] =
    useState("");

  const [modal, setModal] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_SHOP);

  const [saving, setSaving] =
    useState(false);

  const filtered =
    shops.filter(
      (shop) =>
        `${shop.name} ${
          shop.responsible || ""
        } ${shop.phone || ""} ${
          shop.slug
        }`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const openNew = () => {
    setForm(EMPTY_SHOP);
    setModal("new");
  };

  const openEdit = (shop) => {
    setForm({
      ...EMPTY_SHOP,
      ...shop,
    });

    setModal("edit");
  };

  const close = () => {
    if (!saving) {
      setModal(null);
    }
  };

  const change = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const saveNew = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return setError(
        "اكتب اسم النشاط أولًا."
      );
    }

    setSaving(true);
    setError("");

    const slug =
      generateSlug(form.name);

    const cardNumber =
      generateCardNumber();

    try {
      const {
        data: shop,
        error: shopError,
      } =
        await supabase
          .from("shops")
          .insert({
            ...shopPayload(form),
            slug,
            card_number:
              cardNumber,
            created_by:
              user?.id || null,
          })
          .select()
          .single();

      if (shopError) {
        throw shopError;
      }

      const shopUrl =
        buildShopUrl(slug);

      const {
        data: card,
        error: cardError,
      } =
        await supabase
          .from("cards")
          .insert({
            shop_id: shop.id,
            card_number:
              cardNumber,
            qr_code: shopUrl,
            nfc_url: shopUrl,
            status: "pending",
          })
          .select(
            "*, shops:shop_id(name, slug)"
          )
          .single();

      if (cardError) {
        await supabase
          .from("shops")
          .delete()
          .eq(
            "id",
            shop.id
          );

        throw cardError;
      }

      setShops((current) => [
        shop,
        ...current,
      ]);

      setCards((current) => [
        card,
        ...current,
      ]);

      setModal(null);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "تعذر إضافة العميل."
      );

    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return setError(
        "اسم النشاط مطلوب."
      );
    }

    setSaving(true);
    setError("");

    const {
      data,
      error,
    } =
      await supabase
        .from("shops")
        .update(
          shopPayload(form)
        )
        .eq("id", form.id)
        .select()
        .single();

    if (error) {
      setError(error.message);
    } else {
      setShops((current) =>
        current.map((shop) =>
          shop.id === data.id
            ? data
            : shop
        )
      );

      setModal(null);
    }

    setSaving(false);
  };

  const toggle = async (
    shop
  ) => {
    const { error } =
      await supabase
        .from("shops")
        .update({
          is_active:
            !shop.is_active,
        })
        .eq(
          "id",
          shop.id
        );

    if (error) {
      setError(error.message);
    } else {
      setShops((current) =>
        current.map(
          (item) =>
            item.id === shop.id
              ? {
                  ...item,
                  is_active:
                    !shop.is_active,
                }
              : item
        )
      );
    }
  };

  return (
    <div className="dashboard-view">

      <div className="dashboard-toolbar">

        <div>

          <h2>
            المحلات
          </h2>

          <p>
            كل عميل له صفحة عامة
            وكارت QR/NFC.
          </p>

        </div>


        <div className="dashboard-toolbar-actions">

          <div className="dashboard-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="ابحث عن عميل..."
            />

          </div>


          <button
            className="primary-dashboard-btn"
            onClick={openNew}
          >
            <Plus size={17} />
            إضافة عميل جديد
          </button>

        </div>

      </div>


      <section className="dashboard-panel table-panel">

        <div className="table-scroll">

          <table className="dashboard-table">

            <thead>

              <tr>
                <th>النشاط</th>
                <th>المسؤول</th>
                <th>الهاتف</th>
                <th>الكارت</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>إجراءات</th>
              </tr>

            </thead>


            <tbody>

              {filtered.map(
                (shop) => (
                  <tr key={shop.id}>

                    <td>

                      <strong>
                        {shop.name}
                      </strong>

                      <small>
                        {shop.slug}
                      </small>

                    </td>


                    <td>
                      {shop.responsible ||
                        "—"}
                    </td>


                    <td>
                      {shop.phone ||
                        "—"}
                    </td>


                    <td>
                      {shop.card_number ||
                        "—"}
                    </td>


                    <td>

                      <span
                        className={`status-pill ${
                          shop.is_active
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {shop.is_active
                          ? "نشط"
                          : "متوقف"}
                      </span>

                    </td>


                    <td>
                      {new Date(
                        shop.created_at
                      ).toLocaleDateString(
                        "ar-EG"
                      )}
                    </td>


                    <td>

                      <div className="table-actions">

                        <button
                          className="table-icon-btn"
                          title="تعديل"
                          onClick={() =>
                            openEdit(
                              shop
                            )
                          }
                        >
                          <Pencil size={15} />
                        </button>


                        <button
                          className="table-icon-btn"
                          title="تفعيل/تعطيل"
                          onClick={() =>
                            toggle(shop)
                          }
                        >
                          {shop.is_active ? (
                            <ToggleRight size={17} />
                          ) : (
                            <ToggleLeft size={17} />
                          )}
                        </button>


                        <a
                          className="table-icon-btn"
                          title="فتح الصفحة"
                          href={buildShopUrl(
                            shop.slug
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink size={15} />
                        </a>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>


        {!filtered.length && (
          <div className="empty-dashboard">
            لا توجد نتائج.
          </div>
        )}

      </section>


      {modal && (
        <ShopModal
          mode={modal}
          form={form}
          change={change}
          saving={saving}
          close={close}
          onSave={
            modal === "new"
              ? saveNew
              : saveEdit
          }
        />
      )}

    </div>
  );
}


function shopPayload(form) {
  return {
    name:
      form.name.trim(),

    responsible:
      form.responsible?.trim() ||
      null,

    phone:
      form.phone?.trim() ||
      null,

    whatsapp:
      form.whatsapp?.trim() ||
      null,

    google_review:
      form.google_review?.trim() ||
      null,

    instagram:
      form.instagram?.trim() ||
      null,

    facebook:
      form.facebook?.trim() ||
      null,

    tiktok:
      form.tiktok?.trim() ||
      null,

    youtube:
      form.youtube?.trim() ||
      null,

    website:
      form.website?.trim() ||
      null,

    location:
      form.location?.trim() ||
      null,

    description:
      form.description?.trim() ||
      null,

    logo_url:
      form.logo_url?.trim() ||
      null,

    is_active:
      !!form.is_active,
  };
}


/* =========================================================
   SHOP MODAL
========================================================= */

function ShopModal({
  mode,
  form,
  change,
  saving,
  close,
  onSave,
}) {
  const fields = [
    ["name", "اسم النشاط", true],
    [
      "responsible",
      "اسم المسؤول",
    ],
    ["phone", "الهاتف"],
    ["whatsapp", "WhatsApp"],
    [
      "google_review",
      "Google Reviews",
    ],
    [
      "instagram",
      "Instagram",
    ],
    [
      "facebook",
      "Facebook",
    ],
    ["tiktok", "TikTok"],
    ["youtube", "YouTube"],
    [
      "website",
      "الموقع الإلكتروني",
    ],
    [
      "location",
      "الموقع / الخريطة",
    ],
    [
      "logo_url",
      "رابط اللوجو",
    ],
  ];

  return (
    <Modal onClose={close}>

      <form
        onSubmit={onSave}
        className="dashboard-modal-form"
      >

        <div className="modal-head">

          <div>

            <span className="section-tag">
              Smart Card
            </span>

            <h2>
              {mode === "new"
                ? "إضافة عميل جديد"
                : "تعديل بيانات العميل"}
            </h2>

          </div>


          <button
            type="button"
            className="modal-close"
            onClick={close}
          >
            <X />
          </button>

        </div>


        <div className="form-grid-dashboard">

          {fields.map(
            ([
              name,
              label,
              required,
            ]) => (
              <label
                key={name}
                className="dashboard-form-label"
              >

                <span>
                  {label}
                </span>

                <input
                  className="form-input"
                  name={name}
                  value={
                    form[name] || ""
                  }
                  onChange={change}
                  required={required}
                />

              </label>
            )
          )}

        </div>


        <label className="dashboard-form-label">

          <span>
            الوصف
          </span>

          <textarea
            className="form-textarea"
            name="description"
            value={
              form.description || ""
            }
            onChange={change}
          />

        </label>


        <label className="dashboard-check">

          <input
            type="checkbox"
            name="is_active"
            checked={
              !!form.is_active
            }
            onChange={change}
          />

          الصفحة ظاهرة للعملاء

        </label>


        {mode === "new" && (
          <div className="info-note">

            <CreditCard size={17} />

            سيتم إنشاء رقم كارت
            وQR/NFC تلقائيًا بحالة
            «قيد التجهيز».

          </div>
        )}


        <div className="modal-actions">

          <button
            type="button"
            className="btn btn-outline"
            onClick={close}
          >
            إلغاء
          </button>


          <button
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "جاري الحفظ..."
              : "حفظ"}
          </button>

        </div>

      </form>

    </Modal>
  );
}


/* =========================================================
   CARDS MANAGEMENT
========================================================= */

function CardsManagement() {
  const {
    cards,
    shops,
    setCards,
    setError,
  } = useDashboard();

  const [search, setSearch] =
    useState("");

  const [showNew, setShowNew] =
    useState(false);

  const [qr, setQr] =
    useState(null);

  const [form, setForm] =
    useState({
      card_number: "",
      shop_id: "",
      nfc_url: "",
      status: "pending",
    });

  const [saving, setSaving] =
    useState(false);

  const filtered =
    cards.filter(
      (card) =>
        `${card.card_number} ${
          card.shops?.name || ""
        } ${card.status}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const save = async (
    event
  ) => {
    event.preventDefault();

    if (!form.shop_id) {
      return setError(
        "اختار المحل أولًا."
      );
    }

    setSaving(true);
    setError("");

    const shop =
      shops.find(
        (item) =>
          String(item.id) ===
          String(form.shop_id)
      );

    if (!shop) {
      setError(
        "المحل غير موجود."
      );

      setSaving(false);
      return;
    }

    const cardNumber =
      form.card_number.trim() ||
      generateCardNumber();

    const shopUrl =
      buildShopUrl(
        shop.slug
      );

    const nfcUrl =
      form.nfc_url.trim() ||
      shopUrl;

    const {
      data,
      error,
    } =
      await supabase
        .from("cards")
        .insert({
          shop_id: shop.id,
          card_number:
            cardNumber,
          qr_code: shopUrl,
          nfc_url: nfcUrl,
          status: form.status,
        })
        .select(
          "*, shops:shop_id(name, slug)"
        )
        .single();

    if (error) {
      setError(error.message);
    } else {
      setCards((current) => [
        data,
        ...current,
      ]);

      setShowNew(false);

      setForm({
        card_number: "",
        shop_id: "",
        nfc_url: "",
        status: "pending",
      });
    }

    setSaving(false);
  };

  const toggle = async (
    card
  ) => {
    const next =
      card.status === "active"
        ? "inactive"
        : "active";

    const { error } =
      await supabase
        .from("cards")
        .update({
          status: next,
        })
        .eq(
          "id",
          card.id
        );

    if (error) {
      setError(error.message);
    } else {
      setCards((current) =>
        current.map(
          (item) =>
            item.id === card.id
              ? {
                  ...item,
                  status: next,
                }
              : item
        )
      );
    }
  };

  return (
    <div className="dashboard-view">

      <div className="dashboard-toolbar">

        <div>

          <h2>
            الكروت
          </h2>

          <p>
            إدارة QR وNFC وحالة كل كارت.
          </p>

        </div>


        <div className="dashboard-toolbar-actions">

          <div className="dashboard-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="ابحث برقم الكارت..."
            />

          </div>


          <button
            className="primary-dashboard-btn"
            onClick={() =>
              setShowNew(true)
            }
          >
            <Plus size={17} />
            إضافة كارت
          </button>

        </div>

      </div>


      <div className="cards-admin-grid">

        {filtered.map(
          (card) => (
            <div
              className="card-admin-item"
              key={card.id}
            >

              <div className="card-admin-top">

                <div>

                  <span className="card-number-label">
                    CARD NUMBER
                  </span>

                  <strong>
                    {card.card_number}
                  </strong>

                </div>


                <span
                  className={`status-pill ${
                    card.status ===
                    "active"
                      ? "active"
                      : card.status ===
                        "pending"
                      ? "pending"
                      : "inactive"
                  }`}
                >
                  {statusLabel(
                    card.status
                  )}
                </span>

              </div>


              <div className="card-admin-shop">

                <div className="shop-avatar small">

                  {card.shops?.name?.charAt(
                    0
                  ) || "S"}

                </div>


                <div>

                  <strong>
                    {card.shops?.name ||
                      "غير معروف"}
                  </strong>

                  <small>
                    {card.shops?.slug ||
                      ""}
                  </small>

                </div>

              </div>


              <QRCodeCard
                slug={card.shops?.slug}
                url={card.qr_code}
                size={190}
                label={card.qr_code}
              />


              <div className="card-admin-actions">

                <button
                  className="btn btn-outline"
                  onClick={() =>
                    setQr(
                      card.shops?.slug
                    )
                  }
                >
                  <QrCode size={16} />
                  QR
                </button>


                <a
                  className="btn btn-outline"
                  href={
                    card.nfc_url ||
                    card.qr_code
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={16} />
                  فتح
                </a>


                <button
                  className="btn btn-primary"
                  onClick={() =>
                    toggle(card)
                  }
                >
                  {card.status ===
                  "active"
                    ? "تعطيل"
                    : "تفعيل"}
                </button>

              </div>

            </div>
          )
        )}

      </div>


      {!filtered.length && (
        <div className="empty-dashboard">
          لا توجد كروت.
        </div>
      )}


      {showNew && (
        <Modal
          onClose={() =>
            !saving &&
            setShowNew(false)
          }
        >

          <form
            className="dashboard-modal-form"
            onSubmit={save}
          >

            <div className="modal-head">

              <div>

                <span className="section-tag">
                  Cards
                </span>

                <h2>
                  إضافة كارت جديد
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowNew(false)
                }
              >
                <X />
              </button>

            </div>


            <label className="dashboard-form-label">

              <span>
                المحل
              </span>

              <select
                className="form-select"
                value={
                  form.shop_id
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    shop_id:
                      e.target.value,
                  })
                }
                required
              >

                <option value="">
                  اختار المحل
                </option>

                {shops.map(
                  (shop) => (
                    <option
                      key={shop.id}
                      value={shop.id}
                    >
                      {shop.name}
                    </option>
                  )
                )}

              </select>

            </label>


            <label className="dashboard-form-label">

              <span>
                رقم الكارت (اختياري)
              </span>

              <input
                className="form-input"
                value={
                  form.card_number
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    card_number:
                      e.target.value,
                  })
                }
                placeholder="سيتم توليده تلقائيًا"
              />

            </label>


            <label className="dashboard-form-label">

              <span>
                رابط NFC (اختياري)
              </span>

              <input
                className="form-input"
                value={
                  form.nfc_url
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    nfc_url:
                      e.target.value,
                  })
                }
                placeholder="يُستخدم رابط صفحة المحل تلقائيًا"
              />

            </label>


            <label className="dashboard-form-label">

              <span>
                الحالة
              </span>

              <select
                className="form-select"
                value={
                  form.status
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
              >

                <option value="pending">
                  قيد التجهيز
                </option>

                <option value="active">
                  نشط
                </option>

                <option value="inactive">
                  غير نشط
                </option>

              </select>

            </label>


            <div className="modal-actions">

              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  setShowNew(false)
                }
              >
                إلغاء
              </button>


              <button
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "جاري الحفظ..."
                  : "إنشاء الكارت"}
              </button>

            </div>

          </form>

        </Modal>
      )}


      {qr && (
        <Modal
          onClose={() =>
            setQr(null)
          }
        >

          <div className="qr-modal">

            <button
              className="modal-close qr-close"
              onClick={() =>
                setQr(null)
              }
            >
              <X />
            </button>


            <h2>
              QR Code
            </h2>


            <QRCodeCard
              slug={qr}
              size={280}
            />

          </div>

        </Modal>
      )}

    </div>
  );
}


function statusLabel(status) {
  if (
    status === "active"
  ) {
    return "نشط";
  }

  if (
    status === "pending"
  ) {
    return "قيد التجهيز";
  }

  return "متوقف";
}


/* =========================================================
   ORDERS MANAGEMENT
========================================================= */

function OrdersManagement() {
  const {
    orders,
    setError,
    loadData,
  } = useDashboard();

  const [selected, setSelected] =
    useState(null);

  return (
    <div className="dashboard-view">

      <div className="dashboard-toolbar">

        <div>

          <h2>
            الطلبات
          </h2>

          <p>
            الطلبات الواردة من موقع Smart Card.
          </p>

        </div>

      </div>


      <section className="dashboard-panel table-panel">

        <div className="table-scroll">

          <table className="dashboard-table">

            <thead>

              <tr>
                <th>النشاط</th>
                <th>المسؤول</th>
                <th>الهاتف</th>
                <th>الباقة</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>

            </thead>


            <tbody>

              {orders.map(
                (order) => (
                  <tr key={order.id}>

                    <td>

                      <strong>
                        {order.shop_name}
                      </strong>

                      <small>
                        {order.email ||
                          "بدون بريد"}
                      </small>

                    </td>


                    <td>
                      {order.responsible ||
                        "—"}
                    </td>


                    <td>
                      {order.phone ||
                        "—"}
                    </td>


                    <td>
                      {order.plan ||
                        "—"}
                    </td>


                    <td>

                      <span
                        className={`status-pill ${orderStatusClass(
                          order.status
                        )}`}
                      >
                        {orderStatusLabel(
                          order.status
                        )}
                      </span>

                    </td>


                    <td>
                      {new Date(
                        order.created_at
                      ).toLocaleString(
                        "ar-EG"
                      )}
                    </td>


                    <td>

                      <button
                        className="table-icon-btn"
                        title="عرض الطلب"
                        onClick={() =>
                          setSelected(
                            order
                          )
                        }
                      >
                        <ExternalLink
                          size={15}
                        />
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>


        {!orders.length && (
          <div className="empty-dashboard">
            لا توجد طلبات.
          </div>
        )}

      </section>


      {selected && (
        <OrderDetails
          order={selected}
          onClose={() =>
            setSelected(null)
          }
          onCompleted={async () => {
            await loadData();
            setSelected(null);
          }}
          setError={setError}
        />
      )}

    </div>
  );
}


/* =========================================================
   ORDER STATUS
========================================================= */

function orderStatusLabel(status) {
  if (
    status === "pending"
  ) {
    return "طلب جديد";
  }

  if (
    status === "reviewing"
  ) {
    return "جاري التنفيذ";
  }

  if (
    status === "approved"
  ) {
    return "تم اعتماد الطلب";
  }

  if (
    status === "ready"
  ) {
    return "الكارت جاهز";
  }

  if (
    status === "delivered"
  ) {
    return "تم التسليم";
  }

  if (
    status === "cancelled"
  ) {
    return "ملغي";
  }

  return (
    status || "غير محدد"
  );
}


function orderStatusClass(
  status
) {
  if (
    status === "pending" ||
    status === "reviewing"
  ) {
    return "pending";
  }

  if (
    status === "approved" ||
    status === "ready" ||
    status === "delivered"
  ) {
    return "active";
  }

  return "inactive";
}


/* =========================================================
   ORDER DETAILS + EXECUTION
========================================================= */

function OrderDetails({
  order,
  onClose,
  onCompleted,
  setError,
}) {
  const {
    user,
    setShops,
  } = useDashboard();

  const [saving, setSaving] =
    useState(false);

  const [syncing, setSyncing] =
    useState(false);


  /* =======================================================
     تنفيذ طلب جديد
  ======================================================= */

  const startOrder = async () => {
    if (saving || syncing) {
      return;
    }

    setSaving(true);
    setError("");


    let createdShop = null;
    let createdCard = null;


    try {

      /* ---------------------------------------------
         منع تكرار تنفيذ نفس الطلب
      --------------------------------------------- */

      if (order.shop_id) {

        setError(
          "الطلب ده تم تنفيذه بالفعل ومربوط بنشاط موجود."
        );

        setSaving(false);
        return;
      }


      /* ---------------------------------------------
         إنشاء البيانات الأساسية
      --------------------------------------------- */

      const slug =
        generateSlug(
          order.shop_name
        );

      const cardNumber =
        generateCardNumber();

      const shopUrl =
        buildShopUrl(slug);


      /* ---------------------------------------------
         إنشاء الـ SHOP
      --------------------------------------------- */

      const {
        data: shop,
        error: shopError,
      } =
        await supabase
          .from("shops")
          .insert({

            name:
              order.shop_name?.trim() ||
              "نشاط جديد",

            responsible:
              order.responsible?.trim() ||
              null,

            phone:
              order.phone?.trim() ||
              null,

            whatsapp:
              order.whatsapp?.trim() ||
              null,

            google_review:
              order.google_review?.trim() ||
              null,

            instagram:
              order.instagram?.trim() ||
              null,

            facebook:
              order.facebook?.trim() ||
              null,

            tiktok:
              order.tiktok?.trim() ||
              null,

            youtube:
              order.youtube?.trim() ||
              null,

            website:
              order.website?.trim() ||
              null,

            location:
              order.location?.trim() ||
              null,

            description:
              order.description?.trim() ||
              null,

            logo_url:
              order.logo_url?.trim() ||
              null,

            is_active: true,

            slug,

            card_number:
              cardNumber,

            created_by:
              user?.id || null,
          })
          .select()
          .single();


      if (shopError) {
        throw shopError;
      }


      createdShop = shop;


      /* ---------------------------------------------
         إنشاء الـ CARD
      --------------------------------------------- */

      const {
        data: card,
        error: cardError,
      } =
        await supabase
          .from("cards")
          .insert({

            shop_id:
              shop.id,

            card_number:
              cardNumber,

            qr_code:
              shopUrl,

            nfc_url:
              shopUrl,

            status:
              "pending",
          })
          .select(
            "*, shops:shop_id(name, slug)"
          )
          .single();


      if (cardError) {
        throw cardError;
      }


      createdCard = card;


      /* ---------------------------------------------
         ربط ORDER بالـ SHOP
      --------------------------------------------- */

      const {
        error: orderError,
      } =
        await supabase
          .from("orders")
          .update({

            shop_id:
              shop.id,

            status:
              "approved",

          })
          .eq(
            "id",
            order.id
          );


      if (orderError) {
        throw orderError;
      }


      /* ---------------------------------------------
         تحديث المحلات محليًا
      --------------------------------------------- */

      setShops((current) => [
        shop,
        ...current,
      ]);


      /* ---------------------------------------------
         نجاح
      --------------------------------------------- */

      setSaving(false);


      alert(
        `تم تنفيذ الطلب بنجاح

النشاط: ${shop.name}

رقم الكارت:
${cardNumber}

حالة الكارت:
قيد التجهيز`
      );


      await onCompleted();

    } catch (error) {

      console.error(
        "START ORDER ERROR:",
        error
      );


      /* ---------------------------------------------
         تنظيف البيانات لو حصل خطأ
      --------------------------------------------- */

      if (
        createdCard?.id
      ) {
        await supabase
          .from("cards")
          .delete()
          .eq(
            "id",
            createdCard.id
          );
      }


      if (
        createdShop?.id
      ) {
        await supabase
          .from("shops")
          .delete()
          .eq(
            "id",
            createdShop.id
          );
      }


      setError(
        error?.message ||
          "حدث خطأ أثناء تنفيذ الطلب."
      );


      setSaving(false);
    }
  };


  /* =======================================================
     مزامنة بيانات الطلب مع المحل الموجود بالفعل
     
     مهم جدًا:
     - لا ينشئ Shop جديد
     - لا ينشئ Card جديد
     - لا يغير QR
     - لا يغير NFC
     - فقط يحدث بيانات المحل
  ======================================================= */

  const syncShopData = async () => {
    if (saving || syncing) {
      return;
    }

    if (!order.shop_id) {
      setError(
        "الطلب غير مربوط بمحل موجود."
      );

      return;
    }

    setSyncing(true);
    setError("");

    try {

      const shopPayloadFromOrder = {
        name:
          order.shop_name?.trim() ||
          null,

        responsible:
          order.responsible?.trim() ||
          null,

        phone:
          order.phone?.trim() ||
          null,

        whatsapp:
          order.whatsapp?.trim() ||
          null,

        google_review:
          order.google_review?.trim() ||
          null,

        instagram:
          order.instagram?.trim() ||
          null,

        facebook:
          order.facebook?.trim() ||
          null,

        tiktok:
          order.tiktok?.trim() ||
          null,

        youtube:
          order.youtube?.trim() ||
          null,

        website:
          order.website?.trim() ||
          null,

        location:
          order.location?.trim() ||
          null,

        description:
          order.description?.trim() ||
          null,

        logo_url:
          order.logo_url?.trim() ||
          null,
      };


      const {
        data: updatedShop,
        error: shopError,
      } =
        await supabase
          .from("shops")
          .update(
            shopPayloadFromOrder
          )
          .eq(
            "id",
            order.shop_id
          )
          .select()
          .single();


      if (shopError) {
        throw shopError;
      }


      /* ---------------------------------------------
         تحديث المحل في الـ Dashboard
      --------------------------------------------- */

      setShops((current) =>
        current.map(
          (shop) =>
            String(shop.id) ===
            String(updatedShop.id)
              ? updatedShop
              : shop
        )
      );


      /* ---------------------------------------------
         رسالة نجاح
      --------------------------------------------- */

      alert(
        `تمت مزامنة بيانات المحل بنجاح

النشاط:
${updatedShop.name}

تم نقل بيانات الطلب إلى صفحة المحل.

لم يتم إنشاء كارت جديد
ولم يتم تغيير QR أو NFC.`
      );

    } catch (error) {

      console.error(
        "SYNC SHOP DATA ERROR:",
        error
      );

      setError(
        error?.message ||
          "حدث خطأ أثناء مزامنة بيانات المحل."
      );

    } finally {
      setSyncing(false);
    }
  };


  return (
    <Modal
      onClose={() =>
        !saving &&
        !syncing &&
        onClose()
      }
    >

      <div className="dashboard-modal-form">


        {/* HEADER */}

        <div className="modal-head">

          <div>

            <span className="section-tag">
              Order Details
            </span>

            <h2>
              {order.shop_name}
            </h2>

          </div>


          <button
            className="modal-close"
            onClick={onClose}
            disabled={
              saving || syncing
            }
          >
            <X />
          </button>

        </div>


        {/* DETAILS */}

        <div className="order-details-grid">

          <div>

            <span>
              النشاط
            </span>

            <strong>
              {order.shop_name ||
                "—"}
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
              الهاتف
            </span>

            <strong>
              {order.phone ||
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
              البريد الإلكتروني
            </span>

            <strong>
              {order.email ||
                "—"}
            </strong>

          </div>


          <div>

            <span>
              حالة الطلب
            </span>

            <strong>
              {orderStatusLabel(
                order.status
              )}
            </strong>

          </div>


          <div>

            <span>
              تاريخ الطلب
            </span>

            <strong>
              {order.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleString(
                    "ar-EG"
                  )
                : "—"}
            </strong>

          </div>


          <div>

            <span>
              رقم الطلب
            </span>

            <strong>
              #{order.id}
            </strong>

          </div>


          {order.shop_id && (
            <div>

              <span>
                Shop ID
              </span>

              <strong>
                {order.shop_id}
              </strong>

            </div>
          )}

        </div>


        {/* ORDER LINKS / DATA */}

        <div
          className="order-details-grid"
          style={{
            marginTop: 18,
          }}
        >

          <div>

            <span>
              WhatsApp
            </span>

            <strong>
              {order.whatsapp ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              Google Reviews
            </span>

            <strong>
              {order.google_review ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              Instagram
            </span>

            <strong>
              {order.instagram ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              Facebook
            </span>

            <strong>
              {order.facebook ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              TikTok
            </span>

            <strong>
              {order.tiktok ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              YouTube
            </span>

            <strong>
              {order.youtube ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              الموقع الإلكتروني
            </span>

            <strong>
              {order.website ||
                "غير مضاف"}
            </strong>

          </div>


          <div>

            <span>
              الموقع / الخريطة
            </span>

            <strong>
              {order.location ||
                "غير مضاف"}
            </strong>

          </div>

        </div>


        {order.description && (
          <div
            className="info-note"
            style={{
              marginTop: 18,
            }}
          >

            <div>

              <strong>
                وصف النشاط
              </strong>

              <div
                style={{
                  marginTop: 5,
                }}
              >
                {order.description}
              </div>

            </div>

          </div>
        )}


        {/* INFO */}

        {!order.shop_id ? (

          <div
            className="info-note"
            style={{
              marginTop: 20,
            }}
          >

            <CreditCard size={18} />

            <div>

              <strong>
                الطلب جاهز للتنفيذ
              </strong>

              <div
                style={{
                  marginTop: 5,
                }}
              >
                عند بدء التنفيذ سيتم إنشاء
                صفحة النشاط ورقم الكارت
                وربط QR وNFC تلقائيًا،
                مع نقل جميع بيانات العميل
                الموجودة في الطلب.
              </div>

            </div>

          </div>

        ) : (

          <div
            className="info-note"
            style={{
              marginTop: 20,
            }}
          >

            <Building2 size={18} />

            <div>

              <strong>
                الطلب تم تنفيذه بالفعل
              </strong>

              <div
                style={{
                  marginTop: 5,
                }}
              >
                الطلب مرتبط بنشاط موجود
                داخل النظام.

                <br />

                يمكنك الآن مزامنة بيانات
                الطلب مع صفحة المحل إذا
                كانت بعض الروابط أو البيانات
                ناقصة.
              </div>

            </div>

          </div>

        )}


        {/* ACTIONS */}

        <div className="modal-actions">

          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={
              saving || syncing
            }
          >
            إغلاق
          </button>


          {order.shop_id && (

            <button
              type="button"
              className="btn btn-primary"
              onClick={
                syncShopData
              }
              disabled={
                saving || syncing
              }
            >
              {syncing
                ? "جاري مزامنة البيانات..."
                : "مزامنة بيانات المحل"}
            </button>

          )}


          {!order.shop_id && (

            <button
              type="button"
              className="btn btn-primary"
              onClick={startOrder}
              disabled={
                saving || syncing
              }
            >
              {saving
                ? "جاري تنفيذ الطلب..."
                : "بدء تنفيذ الطلب"}
            </button>

          )}

        </div>

      </div>

    </Modal>
  );
}


/* =========================================================
   ANALYTICS
========================================================= */

const EVENT_META = {
  page_view: [
    "زيارات الصفحة",
    Eye,
  ],

  google_click: [
    "Google Reviews",
    Star,
  ],

  whatsapp_click: [
    "WhatsApp",
    MessageCircle,
  ],

  phone_click: [
    "اتصالات",
    Phone,
  ],

  instagram_click: [
    "Instagram",
    FaInstagram,
  ],

  facebook_click: [
    "Facebook",
    FaFacebookF,
  ],

  tiktok_click: [
    "TikTok",
    FaTiktok,
  ],

  youtube_click: [
    "YouTube",
    FaYoutube,
  ],

  website_click: [
    "الموقع الإلكتروني",
    Globe,
  ],

  location_click: [
    "الخريطة",
    MapPin,
  ],

  share: [
    "المشاركة",
    Share2,
  ],
};


function Analytics() {
  const {
    events,
    shops,
  } = useDashboard();


  const counts =
    useMemo(
      () =>
        events.reduce(
          (acc, event) => {
            acc[
              event.event_type
            ] =
              (acc[
                event.event_type
              ] || 0) + 1;

            return acc;
          },
          {}
        ),
      [events]
    );


  const activeShops =
    useMemo(
      () =>
        shops
          .map((shop) => {

            const list =
              events.filter(
                (event) =>
                  event.shop_id ===
                  shop.id
              );

            const views =
              list.filter(
                (event) =>
                  event.event_type ===
                  "page_view"
              ).length;

            const actions =
              list.length - views;

            return {
              ...shop,
              views,
              actions,
              total:
                list.length,
            };
          })
          .filter(
            (shop) =>
              shop.total > 0
          )
          .sort(
            (a, b) =>
              b.total - a.total
          ),
      [shops, events]
    );


  return (
    <div className="dashboard-view">

      <div className="dashboard-toolbar">

        <div>

          <h2>
            الإحصائيات
          </h2>

          <p>
            كل ضغطة على صفحة العميل
            يمكن تتبعها.
          </p>

        </div>

      </div>


      <div className="dashboard-stat-grid analytics-stat-grid">

        <div className="dashboard-stat">

          <div>

            <span>
              زيارات الصفحات
            </span>

            <strong>
              {counts.page_view ||
                0}
            </strong>

          </div>

          <Eye size={24} />

        </div>


        <div className="dashboard-stat">

          <div>

            <span>
              إجمالي التفاعلات
            </span>

            <strong>
              {
                events.filter(
                  (event) =>
                    event.event_type !==
                    "page_view"
                ).length
              }
            </strong>

          </div>

          <Activity size={24} />

        </div>


        <div className="dashboard-stat">

          <div>

            <span>
              الأحداث المسجلة
            </span>

            <strong>
              {events.length}
            </strong>

          </div>

          <BarChart3 size={24} />

        </div>


        <div className="dashboard-stat">

          <div>

            <span>
              محلات لها نشاط
            </span>

            <strong>
              {activeShops.length}
            </strong>

          </div>

          <Building2 size={24} />

        </div>

      </div>


      <section className="dashboard-panel">

        <div className="dashboard-panel-head">

          <div>

            <h3>
              تفاصيل التفاعل
            </h3>

            <p>
              التوزيع الحالي للأحداث.
            </p>

          </div>

        </div>


        <div className="dashboard-stat-grid interaction-grid">

          {Object.entries(
            EVENT_META
          ).map(
            ([
              key,
              [label, Icon],
            ]) => (
              <div
                className="dashboard-stat interaction-stat"
                key={key}
              >

                <div>

                  <span>
                    {label}
                  </span>

                  <strong>
                    {counts[key] ||
                      0}
                  </strong>

                </div>

                <Icon size={21} />

              </div>
            )
          )}

        </div>

      </section>


      <section className="dashboard-panel">

        <div className="dashboard-panel-head">

          <div>

            <h3>
              النشاط حسب المحل
            </h3>

            <p>
              المحلات الأكثر تفاعلًا.
            </p>

          </div>

        </div>


        {activeShops.length ? (

          <div className="activity-shop-list">

            {activeShops.map(
              (shop) => (
                <div
                  className="activity-shop-row"
                  key={shop.id}
                >

                  <div className="shop-avatar small">

                    {shop.name?.charAt(
                      0
                    ) || "S"}

                  </div>


                  <div>

                    <strong>
                      {shop.name}
                    </strong>

                    <small>
                      زيارات:{" "}
                      {shop.views}
                      {" — "}
                      تفاعلات:{" "}
                      {shop.actions}
                    </small>

                  </div>


                  <b>
                    {shop.total}
                  </b>

                </div>
              )
            )}

          </div>

        ) : (

          <div className="empty-dashboard">
            لسه مفيش تفاعلات مسجلة.
          </div>

        )}

      </section>


      <section className="dashboard-panel">

        <div className="dashboard-panel-head">

          <div>

            <h3>
              آخر الأحداث
            </h3>

            <p>
              آخر 100 حدث.
            </p>

          </div>

        </div>


        <div className="event-list-dashboard">

          {events
            .slice(0, 100)
            .map((event) => {

              const meta =
                EVENT_META[
                  event.event_type
                ] || [
                  event.event_type,
                  BarChart3,
                ];

              const Icon =
                meta[1];

              return (
                <div
                  className="event-row-dashboard"
                  key={event.id}
                >

                  <span className="event-icon">
                    <Icon size={16} />
                  </span>


                  <div>

                    <strong>
                      {meta[0]}
                    </strong>

                    <small>
                      {shops.find(
                        (shop) =>
                          shop.id ===
                          event.shop_id
                      )?.name ||
                        "غير معروف"}
                    </small>

                  </div>


                  <time>
                    {new Date(
                      event.created_at
                    ).toLocaleString(
                      "ar-EG"
                    )}
                  </time>

                </div>
              );
            })}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   MODAL
========================================================= */

function Modal({
  children,
  onClose,
}) {
  return (
    <div
      className="dashboard-modal-backdrop"
      onMouseDown={onClose}
    >

      <div
        className="dashboard-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>

    </div>
  );
}


/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const session =
    useAdminSession();

  const navigate =
    useNavigate();


  useEffect(() => {

    if (
      !session.loading &&
      (!session.session ||
        !session.admin)
    ) {
      navigate("/admin", {
        replace: true,
      });
    }

  }, [
    session,
    navigate,
  ]);


  if (session.loading) {
    return (
      <div
        className="state-box"
        style={{
          minHeight:
            "100vh",
          display:
            "grid",
          placeItems:
            "center",
        }}
      >
        جاري التحقق من صلاحيات الإدارة...
      </div>
    );
  }


  if (
    !session.session ||
    !session.admin
  ) {
    return null;
  }


  return (
    <DashboardProvider>

      <DashboardShell>

        <Routes>

          <Route
            index
            element={
              <Overview />
            }
          />

          <Route
            path="shops"
            element={
              <ShopsManagement />
            }
          />

          <Route
            path="cards"
            element={
              <CardsManagement />
            }
          />

          <Route
            path="orders"
            element={
              <OrdersManagement />
            }
          />

          <Route
            path="analytics"
            element={
              <Analytics />
            }
          />

        </Routes>

      </DashboardShell>

    </DashboardProvider>
  );
}