// src\app\api\drivers\[id]\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

// GET - Fetch a single driver
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { driver_id: parseInt(params.id) },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 });
  }
}

// PUT - Update a driver
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const driver_id = parseInt(params.id);
    const formData = await req.formData();

    const updatedData: Record<string, string> = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      id_number: formData.get("id_number") as string,
      phone_number: formData.get("phone_number") as string,
      email: formData.get("email") as string,
    };

    const image = formData.get("image") as File;

    if (image && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const imagePath = `/uploads/${Date.now()}-${image.name}`;
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(path.join(process.cwd(), "public", imagePath), buffer);

      updatedData.image_url = imagePath;
    }

    const updatedDriver = await prisma.driver.update({
      where: { driver_id },
      data: updatedData,
    });

    return NextResponse.json(updatedDriver);
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ error: "Failed to update driver" }, { status: 500 });
  }
}

// DELETE - Delete a driver
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const driver_id = parseInt(params.id);

    await prisma.driver.delete({
      where: { driver_id },
    });

    return NextResponse.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 });
  }
}
