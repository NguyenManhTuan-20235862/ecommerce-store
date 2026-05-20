import HeroSection from "./components/HeroSection";
import StorySection from "./components/StorySection";
import PhilosophySection from "./components/PhilosophySection";
import WorkshopSection from "./components/WorkshopSection";
import StoresSection from "./components/StoresSection";
import MapSection from "./components/MapSection";
import TeamSection from "./components/TeamSection";
import ContactSection from "./components/ContactSection";
import FooterBanner from "./components/FooterBanner";

export default function About() {
  return (
    <div className="bg-[#f9f6f5] min-h-screen text-[#0f172a] font-sans flex flex-col">
      <HeroSection />
      <StorySection />
      <PhilosophySection />
      <WorkshopSection />
      <StoresSection />
      <MapSection />
      <TeamSection />
      <ContactSection />
      <FooterBanner />
    </div>
  );
}
