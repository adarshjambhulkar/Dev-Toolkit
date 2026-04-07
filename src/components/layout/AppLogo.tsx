interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <span
      className={`group inline-flex items-center gap-2 select-none ${className ?? ""}`}
      aria-label="Dev Toolkit"
    >
      {/* Icon mark: animated brackets */}
      <span
        className="relative inline-flex items-center justify-center h-7 w-7 rounded-md shrink-0 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
          boxShadow: "0 0 0 1px rgba(99,102,241,0.3)",
        }}
      >
        <span
          className="font-black text-white leading-none"
          style={{ fontSize: "13px", letterSpacing: "-0.06em", fontFamily: "monospace" }}
        >
          {"</>"}
        </span>
      </span>

      {/* Wordmark */}
      <span className="inline-flex items-baseline gap-[3px]">
        <span
          className="font-extrabold leading-none transition-all duration-200"
          style={{
            fontSize: "inherit",
            letterSpacing: "-0.04em",
            background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 60%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Dev
        </span>
        <span
          className="font-medium leading-none text-[#6B7280] dark:text-[#9CA3AF] transition-colors duration-200"
          style={{ fontSize: "inherit", letterSpacing: "-0.01em" }}
        >
          Toolkit
        </span>
      </span>
    </span>
  );
}
