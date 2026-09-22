import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Package } from "lucide-react";
import { supabase } from "../lib/supabase.js";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        navigate("/order", { replace: true });
        return;
      }

      setUser(user);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/order", { replace: true });
      } else {
        setUser(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="state-box">
            جاري تحميل حسابك...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="section-header">
          <span className="section-tag">حسابي</span>

          <h1 className="section-title">
            أهلاً بيك في Smart Card
          </h1>

          <p className="section-subtitle">
            من هنا تقدر تتابع طلبك وبيانات الكارت الخاص بنشاطك.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <User size={30} />

            <h3 style={{ marginTop: 16 }}>
              بيانات الحساب
            </h3>

            <p style={{ marginTop: 10 }}>
              {user?.email}
            </p>
          </div>

          <div className="card">
            <Package size={30} />

            <h3 style={{ marginTop: 16 }}>
              طلب Smart Card
            </h3>

            <p style={{ marginTop: 10 }}>
              لا يوجد طلبات معروضة حالياً.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-outline"
            onClick={logout}
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </section>
  );
}