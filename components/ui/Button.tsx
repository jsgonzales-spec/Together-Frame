type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) {
  const base =
    "w-full rounded-2xl py-3 font-semibold transition-all duration-200";

  const styles = {
    primary:
      "bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl",

    secondary:
      "bg-white border border-sky-300 text-sky-700 hover:bg-sky-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}