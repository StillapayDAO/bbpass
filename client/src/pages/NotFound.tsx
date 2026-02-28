import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Page not found</p>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </section>
    </main>
  );
}
