import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, QrCode, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import { buildShopUrl } from "../lib/supabase.js";

export default function QRCodeCard({
  slug,
  qrCode,
  size = 220,
  showDownload = true,
  showActions = true,
  label,
}) {
  const canvasRef = useRef(null);

  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  /*
    الأولوية:
    1) qrCode الحقيقي الموجود في cards.qr_code
    2) لو الـDashboard القديم بيمرره في label
    3) buildShopUrl من الـslug كـfallback
  */
  const url =
    qrCode ||
    (typeof label === "string" && /^https?:\/\//i.test(label.trim())
      ? label.trim()
      : null) ||
    (slug ? buildShopUrl(slug) : null);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (!canvasRef.current || !url) {
        setDataUrl("");
        return;
      }

      setError("");

      try {
        await QRCode.toCanvas(canvasRef.current, url, {
          width: size,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#07111f",
            light: "#ffffff",
          },
        });

        if (cancelled) return;

        const image = canvasRef.current.toDataURL("image/png");
        setDataUrl(image);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "تعذر إنشاء QR Code");
        }
      }
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, [url, size]);

  const downloadQR = () => {
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `smart-card-qr-${slug || "card"}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openUrl = () => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyUrl = async () => {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setError("تعذر نسخ الرابط");
    }
  };

  if (!url) {
    return (
      <div className="qr-empty-state">
        <QrCode size={30} />
        <strong>لا يوجد رابط QR لهذا الكرت</strong>
        <span>تأكد من ربط الكارت بالمحل.</span>
      </div>
    );
  }

  return (
    <div className="qr-card-final">
      <div className="qr-card-header">
        <div>
          <span>SMART CARD</span>
          <strong>QR CODE</strong>
        </div>

        <div className="qr-card-icon">
          <QrCode size={18} />
        </div>
      </div>

      <div className="qr-image-wrap">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="qr-canvas"
        />
      </div>

      {error ? (
        <div className="qr-error">
          {error}
        </div>
      ) : (
        <div className="qr-url">
          {url}
        </div>
      )}

      {showActions && (
        <div className="qr-actions">
          <button
            type="button"
            className="qr-action primary"
            onClick={openUrl}
          >
            <ExternalLink size={16} />
            فتح الصفحة
          </button>

          <button
            type="button"
            className="qr-action"
            onClick={copyUrl}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "تم النسخ" : "نسخ الرابط"}
          </button>

          {showDownload && (
            <button
              type="button"
              className="qr-action"
              onClick={downloadQR}
              disabled={!dataUrl}
            >
              <Download size={16} />
              تحميل QR
            </button>
          )}
        </div>
      )}
    </div>
  );
}