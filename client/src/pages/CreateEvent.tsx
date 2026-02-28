import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function CreateEvent() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DashboardLayout>
        <section>
          <h1 className="text-4xl font-bold mb-8">Create Event</h1>
          <p className="text-muted-foreground">Create a new event</p>
        </section>
      </DashboardLayout>
    </main>
  );
}
