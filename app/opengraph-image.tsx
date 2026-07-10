import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const alt = `${siteConfig.name} — Payoneer Verification, Fast & Compliant`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph / social share image for all routes. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #071a2e 0%, #0a2540 55%, #0d2e4f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 40,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#10b981",
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <span>
            Swift<span style={{ color: "#34d399" }}>Verify</span>
          </span>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: 900,
          }}
        >
          Get your Payoneer account verified. Fast. Compliant.
        </div>

        <div style={{ marginTop: 28, fontSize: 30, color: "#93b4d4", maxWidth: 860 }}>
          Verification &amp; global receiving accounts for East African freelancers — 99% success
          rate.
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 12,
            fontSize: 24,
            color: "#c7dbf0",
          }}
        >
          <span>M-PESA payments</span>
          <span style={{ color: "#34d399" }}>•</span>
          <span>470+ sellers verified</span>
          <span style={{ color: "#34d399" }}>•</span>
          <span>Kenya · Tanzania · Uganda</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
