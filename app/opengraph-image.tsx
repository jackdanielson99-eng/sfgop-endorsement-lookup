// Dynamically generated social card preview. Next.js auto-discovers this file
// and serves it at /opengraph-image when the OG tags reference it.
//
// Renders at build time via @vercel/og's edge ImageResponse.

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SFGOP Endorsement Lookup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0d47a1",
          color: "white",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
          padding: "70px 80px",
          position: "relative",
        }}
      >
        {/* Top brand block */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              background: "#d32f2f",
              color: "white",
              fontWeight: 800,
              fontSize: 42,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: -2,
            }}
          >
            SF
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.05,
            }}
          >
            <span
              style={{
                fontSize: 20,
                letterSpacing: 4,
                opacity: 0.7,
                textTransform: "uppercase",
              }}
            >
              San Francisco Republican Party
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
            gap: 24,
          }}
        >
          <span style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            SFGOP Endorsement
          </span>
          <span style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            Lookup
          </span>
        </div>

        <div
          style={{
            fontSize: 32,
            opacity: 0.85,
            marginTop: 28,
            display: "flex",
          }}
        >
          Find Republican-endorsed candidates in your area.
        </div>

        {/* Bottom red stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 16,
            background: "#d32f2f",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
