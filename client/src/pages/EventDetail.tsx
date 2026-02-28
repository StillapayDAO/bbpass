import { Navbar } from "@/components/Navbar";

export default function EventDetail() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-8">Event Details</h1>
          <p className="text-muted-foreground">Event detail page</p>
        </div>
      </section>
    </main>
  );
}
