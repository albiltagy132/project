// src\app\api\assignments\[id]\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const assignment_id = parseInt(id);

    await prisma.assignment.delete({
      where: { assignment_id },
    });

    return NextResponse.json({ message: "Driver unassigned successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to unassign driver" }, { status: 500 });
  }
}
