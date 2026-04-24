import { Sparkles } from "lucide-react";

export default function VibeLoyaltyCard({ promoBadge }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#8f3000] p-8">
      <img
        src={promoBadge}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 opacity-80"
      />
      <h3 className="font-heading text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.03em] text-white">
        VIBE LOYALTY
        <br />
        MEMBER?
      </h3>
      <p className="mt-3 max-w-xs text-xs font-bold uppercase tracking-[0.08em] text-[#ffc4af]/80">
        EARN 5,560 PULSE POINTS ON THIS DEPLOYMENT
      </p>
      <button
        type="button"
        className="mt-4 border-b-2 border-white pb-0.5 text-xs font-bold uppercase tracking-[0.12em] text-white"
      >
        Learn More
      </button>
      <Sparkles className="absolute bottom-5 right-5 h-6 w-6 text-white/80" />
    </div>
  );
}
