import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowTo } from "@/components/landing/how-to";
import { Privacy } from "@/components/landing/privacy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <HowTo />
        <Privacy />
      </main>
      <Footer />
    </div>
  );
}
