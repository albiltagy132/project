// src/app/dashboard/page.tsx
import { DashboardContent } from "@/components/DashboardContent";
import { withAuth } from "@/lib/withAuth"; 

export default async function DashboardPage() {
  return withAuth(async () => (
    <DashboardContent />
  ));
}
