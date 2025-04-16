import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import type { NextApiRequest } from "next"; // optional fallback

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const assignment_id = parseInt(context.params.id);

    await prisma.assignment.delete({
      where: { assignment_id },
    });

    return NextResponse.json({ message: "Driver unassigned successfully" });
  } catch (error) {
    console.error("Error Unassigning Driver:", error);
    return NextResponse.json(
      { error: "Failed to unassign driver" },
      { status: 500 }
    );
  }
}
