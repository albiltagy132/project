import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises"; // ✅ Use Node.js File System instead of Bun
import path from "path";

// GET - Fetch all drivers
export async function GET() {
  try {
    const drivers = await prisma.driver.findMany();
    return NextResponse.json(drivers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}


// 🟢 POST - Add a new driver
export async function POST(req: Request) {
    try {
      const formData = await req.formData();
  
      const first_name = formData.get("first_name") as string;
      const last_name = formData.get("last_name") as string;
      const id_number = formData.get("id_number") as string;
      const phone_number = formData.get("phone_number") as string;
      const email = formData.get("email") as string;
      const image = formData.get("image") as File;
  
      console.log("Received Data:", { first_name, last_name, id_number, phone_number, email, image });
  
      if (!first_name || !last_name || !id_number || !phone_number || !email || !image) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // ✅ Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });
  
      // ✅ Save the image using Node.js File System
      const imagePath = `/uploads/${Date.now()}-${image.name}`;
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(path.join(process.cwd(), "public", imagePath), buffer);
  
      console.log("✅ Image saved at:", imagePath);
  
      // ✅ Store driver in Prisma
      const newDriver = await prisma.driver.create({
        data: { first_name, last_name, id_number, phone_number, email, image_url: imagePath },
      });
  
      console.log("✅ Driver Created:", newDriver);
  
      return NextResponse.json(newDriver, { status: 201 });
    } catch (error) {
      console.error("❌ Error Creating Driver:", error);
      return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
    }
  }
