import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

const MIN_MERCHANT_SIZE = 500;
const TARGET_SIZE = 1000;

/**
 * Google Merchant Center rejects product images smaller than 500x500.
 * Small uploads are upscaled onto a square white canvas before upload.
 */
async function ensureMerchantSize(file: File): Promise<File> {
  if (typeof document === "undefined") return file;
  const bitmap = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
  if (!bitmap) return file;
  if (bitmap.naturalWidth >= MIN_MERCHANT_SIZE && bitmap.naturalHeight >= MIN_MERCHANT_SIZE) {
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = TARGET_SIZE;
  canvas.height = TARGET_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);
  const scale = Math.min(
    TARGET_SIZE / bitmap.naturalWidth,
    TARGET_SIZE / bitmap.naturalHeight,
  );
  const w = bitmap.naturalWidth * scale;
  const h = bitmap.naturalHeight * scale;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, (TARGET_SIZE - w) / 2, (TARGET_SIZE - h) / 2, w, h);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92),
  );
  if (!blob) return file;
  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${base}-1000.jpg`, { type: "image/jpeg" });
}

export async function uploadProductImage(input: File): Promise<string> {
  const file = await ensureMerchantSize(input);
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("Could not create image URL");
  return data.signedUrl;
}