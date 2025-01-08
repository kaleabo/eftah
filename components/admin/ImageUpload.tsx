"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, ImagePlus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  className?: string;
  maxSize?: number;
  multiple?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  className,
  maxSize = 5,
  multiple = false,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setPreviewUrls(value);
    } else if (typeof value === "string" && value) {
      setPreviewUrls([value]);
    } else {
      setPreviewUrls([]);
    }
  }, [value, multiple]);

  const validateFile = (file: File) => {
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > maxSize) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("File type must be JPEG, PNG, WEBP or GIF");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      files.forEach(validateFile);
      setIsLoading(true);

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Upload failed");
        }

        const data = await response.json();
        return data.url.startsWith("http")
          ? data.url
          : `${window.location.origin}${data.url}`;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      if (multiple) {
        const newUrls = [...previewUrls, ...uploadedUrls];
        setPreviewUrls(newUrls);
        onChange(newUrls);
      } else {
        setPreviewUrls([uploadedUrls[0]]);
        onChange(uploadedUrls[0]);
      }

      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newUrls = previewUrls.filter((_, index) => index !== indexToRemove);
    setPreviewUrls(newUrls);
    onChange(multiple ? newUrls : "");
    toast.success("The image has been removed");
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(previewUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPreviewUrls(items);
    onChange(multiple ? items : items[0]);
    
    toast.success("The image order has been updated");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-4 relative min-h-[200px]"
              style={{ 
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                onClick={() => document.getElementById("imageUpload")?.click()}
                className="relative w-[200px] h-[200px] rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
              >
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  {isLoading ? "Uploading..." : "Add Image"}
                </span>
              </div>

              {previewUrls.map((url, index) => (
                <Draggable key={url} draggableId={url} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "w-[200px] h-[200px] relative rounded-lg overflow-hidden group",
                        snapshot.isDragging && "ring-2 ring-primary shadow-lg"
                      )}
                      style={{
                        ...provided.draggableProps.style,
                        position: 'relative',
                        transform: snapshot.isDragging 
                          ? provided.draggableProps.style?.transform 
                          : 'translate(0, 0)',
                      }}
                    >
                      <Image
                        src={url}
                        alt="Upload preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <GripVertical className="h-5 w-5 text-white cursor-move" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(index);
                          }}
                          className="h-8 w-8 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <input
        id="imageUpload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
        disabled={isLoading}
        multiple={multiple}
      />
    </div>
  );
}