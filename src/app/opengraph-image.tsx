import { ImageResponse } from "next/og";

export const alt = "Fatima de la Iglesia, Junior Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F9F2FD",
          color: "#52144A",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 12,
            background: "#15803D",
            marginBottom: 40,
          }}
        />
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          Fatima de la Iglesia
        </div>
        <div style={{ fontSize: 44, marginTop: 24, color: "#166534" }}>
          Junior Web Developer
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "#8A5A06" }}>
          React, responsive design and accessible front-end
        </div>
      </div>
    ),
    { ...size }
  );
}
