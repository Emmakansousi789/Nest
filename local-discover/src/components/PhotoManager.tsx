"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { VendorPhoto } from "@/types";

interface PhotoManagerProps {
  vendorId: string;
  photos: VendorPhoto[];
  onPhotosChange: (photos: VendorPhoto[]) => void;
}

interface LocalPhoto extends VendorPhoto {
  id?: string; // DB id for existing photos
  uploading?: boolean;
  error?: string;
}

export default function PhotoManager({ vendorId, photos, onPhotosChange }: PhotoManagerProps) {
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>(
    photos.map((p) => ({ ...p }))
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPhoto = useCallback(
    async (file: File) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // Add optimistic placeholder
      const placeholder: LocalPhoto = {
        id: tempId,
        url: URL.createObjectURL(file),
        alt: file.name,
        uploading: true,
      };
      setLocalPhotos((prev) => [...prev, placeholder]);

      try {
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));

        const res = await fetch(`/api/vendors/${vendorId}/photos`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { photo } = await res.json();

        // Replace placeholder with real photo
        setLocalPhotos((prev) => {
          const updated = prev.map((p) =>
            p.id === tempId ? { ...photo, uploading: false } : p
          );
          onPhotosChange(updated.map(({ id: _id, uploading: _u, error: _e, ...rest }) => rest));
          return updated;
        });
      } catch (err) {
        setLocalPhotos((prev) => {
          const updated = prev.map((p) =>
            p.id === tempId
              ? { ...p, uploading: false, error: (err as Error).message }
              : p
          );
          return updated;
        });
      }
    },
    [vendorId, onPhotosChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      Array.from(files).forEach(uploadPhoto);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadPhoto]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .forEach(uploadPhoto);
    },
    [uploadPhoto]
  );

  const handleDelete = useCallback(
    async (photo: LocalPhoto) => {
      if (!photo.id || photo.id.startsWith("temp-")) {
        // Just remove from local state
        setLocalPhotos((prev) => {
          const updated = prev.filter((p) => p !== photo);
          onPhotosChange(updated.map(({ id: _id, uploading: _u, error: _e, ...rest }) => rest));
          return updated;
        });
        return;
      }

      try {
        const res = await fetch(
          `/api/vendors/${vendorId}/photos?photoId=${photo.id}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          setLocalPhotos((prev) => {
            const updated = prev.filter((p) => p.id !== photo.id);
            onPhotosChange(updated.map(({ id: _id, uploading: _u, error: _e, ...rest }) => rest));
            return updated;
          });
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    },
    [vendorId, onPhotosChange]
  );

  const handleMove = useCallback(
    async (fromIndex: number, direction: "up" | "down") => {
      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= localPhotos.length) return;

      const updated = [...localPhotos];
      [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
      setLocalPhotos(updated);
      onPhotosChange(updated.map(({ id: _id, uploading: _u, error: _e, ...rest }) => rest));

      // Persist new order if all photos have DB ids
      const dbIds = updated.filter((p) => p.id && !p.id.startsWith("temp-")).map((p) => p.id!);
      if (dbIds.length === updated.length && dbIds.length > 1) {
        try {
          await fetch(`/api/vendors/${vendorId}/photos`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photoIds: dbIds }),
          });
        } catch (err) {
          console.error("Reorder failed:", err);
        }
      }
    },
    [localPhotos, vendorId, onPhotosChange]
  );

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-terracotta bg-terracotta/5"
            : "border-parchment hover:border-stone hover:bg-ecru/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-ecru flex items-center justify-center">
          <svg className="w-6 h-6 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-charcoal mb-1">
          {dragOver ? "Drop photos here" : "Upload photos"}
        </p>
        <p className="text-xs text-stone">
          Drag & drop or tap to browse · JPEG, PNG, WebP · Max 5MB each
        </p>
      </div>

      {/* Photo grid */}
      {localPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {localPhotos.map((photo, index) => (
            <div
              key={photo.id || index}
              className="relative aspect-square rounded-2xl overflow-hidden bg-ecru group"
            >
              {photo.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-ecru">
                  <div className="w-6 h-6 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                </div>
              ) : photo.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-2">
                  <svg className="w-5 h-5 text-red-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-[10px] text-red-500 text-center">{photo.error}</p>
                </div>
              ) : (
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover"
                />
              )}

              {/* Controls overlay */}
              {!photo.uploading && !photo.error && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Top-right: delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(photo); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Bottom: reorder arrows */}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMove(index, "up"); }}
                        className="w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        title="Move left"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                    )}
                    {index < localPhotos.length - 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMove(index, "down"); }}
                        className="w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        title="Move right"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Position indicator */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full">
                    <span className="text-[10px] font-medium text-white">{index + 1}/{localPhotos.length}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
