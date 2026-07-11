import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "A file field is required" }, { status: 400 });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return Response.json({
      secureUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
      status: "demo_upload_placeholder",
    });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const secureUrl = await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "duraiz-mart" }, (error, result) => {
      if (error || !result?.secure_url) reject(error ?? new Error("Cloudinary upload failed"));
      else resolve(result.secure_url);
    });
    stream.end(buffer);
  });

  return Response.json({ secureUrl, status: "uploaded" });
}
