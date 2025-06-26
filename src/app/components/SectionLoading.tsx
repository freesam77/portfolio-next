import React from "react";

const styleSheet = `
@keyframes section-flash {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}
`;

function getRandomWidths(count: number) {
  return Array.from({ length: count }, () => {
    const min = 40;
    const max = 90;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });
}

export default function SectionLoading() {
  React.useEffect(() => {
    // Inject the keyframes style if not already present
    if (!document.getElementById("section-flash-keyframes")) {
      const style = document.createElement("style");
      style.id = "section-flash-keyframes";
      style.innerHTML = styleSheet;
      document.head.appendChild(style);
    }
  }, []);

  // Only generate widths on the client
  const [widths, setWidths] = React.useState<number[] | null>(null);

  React.useEffect(() => {
    setWidths(getRandomWidths(Math.floor(Math.random() * 4) + 3));
  }, []);

  if (!widths) {
    // Render a single bar as fallback until client-side effect runs
    return <div style={{ width: "100%", height: 24, background: "#e0e0e0", borderRadius: 8, margin: 8, opacity: 0.7 }} />;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      {widths.map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}%`,
            height: 24,
            background: "#e0e0e0",
            borderRadius: 8,
            margin: 8,
            animation: "section-flash 1s infinite alternate",
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
} 