import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink } from "lucide-react";

export default function QRCodeCard({
  url,
  title = "QR Code",
}) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function generateQR() {
      if (!url || !canvasRef.current) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        await QRCode.toCanvas(
          canvasRef.current,
          url,
          {
            width: 280,
            margin: 2,
            errorCorrectionLevel: "H",
          }
        );

        if (active) {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError("حصل خطأ أثناء إنشاء QR Code");
          setLoading(false);
        }
      }
    }

    generateQR();

    return () => {
      active = false;
    };
  }, [url]);

  const downloadQR = () => {
    if (!canvasRef.current || !url) {
      return;
    }

    const link = document.createElement("a");

    link.download = "smart-card-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");

    link.click();
  };

  if (!url) {
    return (
      <div className="qr-box">
        <h4>{title}</h4>
        <p className="muted">
          لا يوجد رابط للكارت.
        </p>
      </div>
    );
  }

  return (
    <div className="qr-box">
      <h4>{title}</h4>

      <div className="qr-preview">
        <canvas
          ref={canvasRef}
          aria-label="Smart Card QR Code"
        />

        {loading && (
          <div className="qr-loading">
            جاري إنشاء QR...
          </div>
        )}

        {error && (
          <div className="qr-error">
            {error}
          </div>
        )}
      </div>

      <div className="qr-actions">

        <button
          type="button"
          onClick={downloadQR}
          disabled={loading || !!error}
        >
          <Download size={16} />
          تحميل
        </button>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={16} />
          فتح
        </a>

      </div>
    </div>
  );
}