import { forwardRef } from "react";

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-500 ${className}`.trim()}
      {...props}
    />
  );
});

export default Input;
