import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: { id: string } } // ✅ this structure is correct
): Promise<Response> {
  const id = parseInt(context.params.id);

  try {
    await prisma.assignment.delete({
      where: { assignment_id: id },
    });

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
