import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function EditEvent() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DashboardLayout>
        <section>
          <h1 className="text-4xl font-bold mb-8">Edit Event</h1>
          <p className="text-muted-foreground">Edit event details</p>
        </section>
      </DashboardLayout>
    </main>
  );
}
