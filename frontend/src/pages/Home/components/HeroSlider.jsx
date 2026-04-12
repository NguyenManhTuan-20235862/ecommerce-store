import { Link } from 'react-router';

export default function HeroCover() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image (Static or very slow ambient zoom) */}
      <img
        src="https://images.unsplash.com/photo-1594938298596-eb5fd3f56ceb?q=80&w=2670&auto=format&fit=crop"
        alt="Filling Pieces Editorial"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
      />
      
      {/* Very subtle dark gradient at top to make white header pop */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-10" />

      {/* Massive Brutalism Typography */}
      <div className="relative z-20 text-center flex flex-col items-center mt-20">
        <h1 className="text-white text-[12vw] sm:text-[10vw] leading-none font-sans font-black tracking-tighter uppercase mb-4 mix-blend-overlay opacity-90">
          REDEFINE
        </h1>
        <p className="text-white text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-10 max-w-lg px-4">
          The New Standard For Modern Menswear
        </p>

        <Link 
          to="/shop" 
          className="group relative inline-flex items-center justify-center overflow-hidden bg-white text-black px-10 py-4 font-bold tracking-widest text-xs uppercase"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-black rounded-full group-hover:w-56 group-hover:h-56"></span>
          <span className="relative group-hover:text-white transition-colors duration-300">EXPLORE COLLECTION</span>
        </Link>
      </div>
    </section>
  );
}
