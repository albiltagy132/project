// src/lib/withAuth.tsx
import { redirect } from "next/navigation";
import { getTokenFromCookies } from "@/lib/auth";
import { ReactNode } from "react"; // ✅ Import ReactNode

export async function withAuth(renderPage: () => Promise<ReactNode>) {
  const token = await getTokenFromCookies();

  if (!token) {
    redirect("/login");
  }

  return renderPage();
}

