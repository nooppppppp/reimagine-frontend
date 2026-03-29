import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { Steps } from '../components/Steps';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Steps />
      </main>
      <Footer />
    </div>
  );
}
