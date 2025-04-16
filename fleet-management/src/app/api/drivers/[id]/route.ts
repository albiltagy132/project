import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises"; 
import path from "path";

//GET - Fetch a Single Driver by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const driver_id = parseInt(params.id);
      console.log("Fetching Driver ID:", driver_id);
  
      const driver = await prisma.driver.findUnique({
        where: { driver_id },
      });
  
      if (!driver) {
        return NextResponse.json({ error: "Driver not found" }, { status: 404 });
      }
  
      return NextResponse.json(driver);
    } catch (error) {
      console.error("Error Fetching Driver:", error);
      return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 });
    }
  }

// PUT - Update a Driver
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const driver_id = parseInt(params.id);
      const formData = await req.formData();
  
      const updatedData: any = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        id_number: formData.get("id_number"),
        phone_number: formData.get("phone_number"),
        email: formData.get("email"),
      };
  
      // Handle image upload (if a new image is provided)
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
    } catch (error) {
      console.error("Error Updating Driver:", error);
      return NextResponse.json({ error: "Failed to update driver" }, { status: 500 });
    }
  }

//DELETE - Remove a Driver
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const driver_id = parseInt(params.id);

    console.log("Deleting Driver ID:", driver_id);

    await prisma.driver.delete({
      where: { driver_id },
    });

    return NextResponse.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Driver:", error);
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 });
  }
}


  