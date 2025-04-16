import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🗑️ DELETE - Unassign a Driver
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const assignment_id = parseInt(context.params.id); //Fix: Properly access params

    await prisma.assignment.delete({
      where: { assignment_id },
    });

    return NextResponse.json({ message: "Driver unassigned successfully" });
  } catch (error) {
    console.error("Error Unassigning Driver:", error);
    return NextResponse.json({ error: "Failed to unassign driver" }, { status: 500 });
  }
}
