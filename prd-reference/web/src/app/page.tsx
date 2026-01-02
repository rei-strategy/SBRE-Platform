import { CalloutSection } from "@/components/sections/callout";
import { ContactSection } from "@/components/sections/contact";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { HeroSection } from "@/components/sections/hero";
import { SiteFooter } from "@/components/sections/footer";
import { SocialProof } from "@/components/sections/social-proof";
import { ValueGrid } from "@/components/sections/value-grid";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { AudienceSection } from "@/components/sections/who-its-for";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <ValueGrid />
        <FeatureShowcase />
        <HowItWorksSection />
        <SocialProof />
        <AudienceSection />
        <CalloutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
