import MMAdHeader from "@/components/hero/MMAdHeader";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <MMAdHeader />
      
      {/* Additional sections can be added here */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Welcome to bbpass
          </h2>
          {/* More content */}
        </div>
      </section>
    </main>
  );
}
