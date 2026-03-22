import { apiFetch } from "./api";

export type PresignPayload = {
  fileName: string;
  contentType: string;
  category: "food" | "physique";
};

export type PresignResponse = {
  success: boolean;
  uploadUrl: string;
  key: string;
};

export async function getPresignedUploadUrl(payload: PresignPayload) {
  return apiFetch<PresignResponse>("/uploads/presign", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadFileToS3(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("S3 upload failed");
  }

  return true;
}