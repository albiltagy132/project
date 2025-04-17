import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";

// GET - Fetch a Single Driver by ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const driver_id = parseInt(context.params.id);

    const driver = await prisma.driver.findUnique({
      where: { driver_id },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json(driver);
  } catch {
    return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 });
  }
}

// PUT - Update a Driver
export async function PUT(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const driver_id = parseInt(context.params.id);
    const formData = await request.formData();

    const updatedData: { [key: string]: string } = {};
    const fields = ["first_name", "last_name", "id_number", "phone_number", "email"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (typeof value === "string") {
        updatedData[field] = value;
      }
    });

    const image = formData.get("image") as File;
    if (image && image.size > 0) {
      const imagePath = `/uploads/${Date.now()}-${image.name}`;
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(`./public${imagePath}`, buffer);
      updatedData.image_url = imagePath;
    }

    const updatedDriver = await prisma.driver.update({
      where: { driver_id },
      data: updatedData,
    });

    return NextResponse.json(updatedDriver);
  } catch {
    return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 });
  }
}

// DELETE - Remove a Driver
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const driver_id = parseInt(context.params.id);

    await prisma.driver.delete({
      where: { driver_id },
    });

    return NextResponse.json({ message: "Driver deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 });
  }
}
