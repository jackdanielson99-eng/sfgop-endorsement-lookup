// Dynamically generated social card preview. Next.js auto-discovers this file
// and serves it at /opengraph-image when the OG tags reference it.
// Embeds the actual SFGOP logo (app/og-logo.png) so shares look on-brand.

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SFGOP Endorsement Lookup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await fetch(new URL("./og-logo.png", import.meta.url)).then(
    (r) => r.arrayBuffer()
  );

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
        {/* Top brand block — actual SFGOP logo on a small white tile so the
            transparent PNG reads cleanly against the navy background. */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 110,
              height: 110,
              background: "white",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            }}
          >
            {/* @ts-expect-error — Satori accepts ArrayBuffer for img src */}
            <img src={logo} width={94} height={94} style={{ objectFit: "contain" }} />
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
                fontSize: 22,
                letterSpacing: 4,
                opacity: 0.85,
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
            gap: 18,
          }}
        >
          <span
            style={{
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            SFGOP Endorsement
          </span>
          <span
            style={{
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Lookup
          </span>
        </div>

        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            marginTop: 28,
            display: "flex",
          }}
        >
          Find Republican-endorsed candidates for the June 2026 primary.
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
