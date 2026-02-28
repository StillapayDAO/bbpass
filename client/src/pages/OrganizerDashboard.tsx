import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function OrganizerDashboard() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DashboardLayout>
        <section>
          <h1 className="text-4xl font-bold mb-8">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Manage your events</p>
        </section>
      </DashboardLayout>
    </main>
  );
}
