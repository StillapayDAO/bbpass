import { Navbar } from "@/components/Navbar";

export default function Events() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-8">Events</h1>
          <p className="text-muted-foreground">Browse upcoming events</p>
        </div>
      </section>
    </main>
  );
}
