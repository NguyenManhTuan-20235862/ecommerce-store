export default function Button({
  type = "button",
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary:
      "bg-white text-black border border-neutral-300 hover:bg-neutral-50",
    ghost: "bg-transparent text-black hover:bg-neutral-100",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`.trim()}
      {...props}
    />
  );
}
