type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div
      className="
        rounded-3xl
        bg-white/90
        p-8
        shadow-xl
        backdrop-blur
        border
        border-sky-100
      "
    >
      {children}
    </div>
  );
}