import { CreditCard, Crown, Building2 } from "lucide-react";

export const PLANS = [
  {
    id: "smart-card",
    name: "Smart Card",
    price: 499,
    oldPrice: null,
    discount: null,
    description: "البداية الذكية لنشاطك التجاري.",
    shortDescription: "الحل الأساسي لنشاطك التجاري.",
    text: "البداية الذكية لنشاطك التجاري.",
    icon: CreditCard,
    featured: false,
    features: [
      "كارت Smart Card",
      "QR Code",
      "NFC",
      "صفحة رقمية خاصة بالنشاط",
      "Google Reviews",
      "روابط التواصل والسوشيال",
    ],
  },
  {
    id: "smart-card-pro",
    name: "Smart Card Pro",
    price: 799,
    oldPrice: null,
    discount: null,
    description: "الحل الأكثر طلبًا لتجربة احترافية كاملة.",
    shortDescription: "تجربة أكثر احترافية لنشاطك.",
    text: "التجربة الاحترافية الكاملة.",
    icon: Crown,
    featured: true,
    features: [
      "كل مميزات Smart Card",
      "تصميم مخصص",
      "صفحة رقمية متقدمة",
      "Analytics وإحصائيات",
      "إدارة أفضل للروابط",
      "دعم وتطوير مستمر",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 999,
    oldPrice: null,
    discount: null,
    description: "مصمم للأنشطة والشركات والفروع المتعددة.",
    shortDescription: "للشركات والفروع والبراندات.",
    text: "للشركات والفروع المتعددة.",
    icon: Building2,
    featured: false,
    features: [
      "كل مميزات Smart Card Pro",
      "دعم الفروع المتعددة",
      "كروت إضافية",
      "إدارة موسعة",
      "Analytics متقدمة",
      "حلول مخصصة للشركات",
    ],
  },
];

export const DEFAULT_PLAN_ID = "smart-card-pro";

export function getPlanById(id) {
  return (
    PLANS.find((plan) => plan.id === id) ||
    PLANS.find((plan) => plan.id === DEFAULT_PLAN_ID) ||
    PLANS[0]
  );
}

export function getPlanByName(name) {
  return (
    PLANS.find((plan) => plan.name === name) ||
    PLANS.find((plan) => plan.id === DEFAULT_PLAN_ID) ||
    PLANS[0]
  );
}

export function formatPrice(price) {
  return `${Number(price).toLocaleString("en-US")} جنيه`;
}
