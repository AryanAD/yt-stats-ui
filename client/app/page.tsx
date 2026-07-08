import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowTo } from "@/components/landing/how-to";
import { Privacy } from "@/components/landing/privacy";
import { SiteHeader } from "@/components/landing/site-header";
import { Reveal } from "@/components/motion/reveal";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Reveal>
          <Hero />
        </Reveal>
        <Reveal>
          <HowTo />
        </Reveal>
        <Reveal>
          <Privacy />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
