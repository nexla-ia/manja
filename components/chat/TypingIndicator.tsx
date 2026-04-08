export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5">
      {[
        { color: "var(--mint)",  delay: "0s"    },
        { color: "var(--blue)",  delay: "0.18s" },
        { color: "var(--amber)", delay: "0.36s" },
      ].map(({ color, delay }, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: color,
            animation: "bounce-dot 1.3s ease-in-out infinite",
            animationDelay: delay,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      ))}
    </div>
  );
}
