const DOTS = [
  { color: "#BB8FCE", left: "12%", duration: 2.8, delay: 0 },
  { color: "#F7DC6F", left: "85%", duration: 3.2, delay: 0.3 },
  { color: "#BB8FCE", left: "42%", duration: 3.5, delay: 1.2 },
  { color: "#4ECDC4", left: "93%", duration: 2.6, delay: 0.8 },
  { color: "#45B7D1", left: "88%", duration: 3.1, delay: 1.5 },
  { color: "#FF6B6B", left: "2%", duration: 3.4, delay: 0.5 },
  { color: "#F7DC6F", left: "78%", duration: 2.9, delay: 1.8 },
  { color: "#FF6B6B", left: "24%", duration: 3.3, delay: 0.2 },
  { color: "#F7DC6F", left: "31%", duration: 2.7, delay: 1.0 },
  { color: "#4ECDC4", left: "63%", duration: 3.6, delay: 0.6 },
  { color: "#FF6B6B", left: "58%", duration: 3.0, delay: 1.4 },
  { color: "#FF6B6B", left: "45%", duration: 2.5, delay: 2.0 },
  { color: "#45B7D1", left: "17%", duration: 3.2, delay: 0.9 },
  { color: "#4ECDC4", left: "68%", duration: 2.8, delay: 1.6 },
  { color: "#98D8C8", left: "96%", duration: 3.4, delay: 0.4 },
  { color: "#45B7D1", left: "8%", duration: 3.0, delay: 1.1 },
  { color: "#45B7D1", left: "1%", duration: 3.5, delay: 2.2 },
  { color: "#98D8C8", left: "31%", duration: 2.6, delay: 0.7 },
  { color: "#4ECDC4", left: "51%", duration: 3.1, delay: 1.3 },
  { color: "#85C1E2", left: "9%", duration: 2.9, delay: 1.9 },
];

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[452px] overflow-hidden">
      {DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute size-3 rounded-full confetti-fall"
          style={{
            backgroundColor: dot.color,
            left: dot.left,
            top: -20,
            "--duration": `${dot.duration}s`,
            "--delay": `${dot.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export { Confetti };
