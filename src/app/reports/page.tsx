// src/app/reports/page.tsx
import { withAuth } from "@/lib/withAuth";
import { ReportsContent } from "@/components/ReportsContent";

export default async function ReportsPage() {
  return withAuth(async () => <ReportsContent />);
}