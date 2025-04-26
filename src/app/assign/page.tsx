// src\app\assign\page.tsx
import { Assign } from "@/components/Assign";
import { withAuth } from "@/lib/withAuth"; // 🛠️ Import withAuth

export default async function AssignPage() {
  return withAuth(async () => (  // 🛠️ Wrap with withAuth
    <Assign />
  ));
}
