import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function EventAttendees() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DashboardLayout>
        <section>
          <h1 className="text-4xl font-bold mb-8">Event Attendees</h1>
          <p className="text-muted-foreground">View event attendees</p>
        </section>
      </DashboardLayout>
    </main>
  );
}
