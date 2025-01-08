"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  category: Category;
  categoryId: number;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
  image: z.string().min(1, "Image is required"),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

export default function EditMenuItem({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      image: "",
      categoryId: "",
      isAvailable: true,
      isPopular: false,
    },
  });

  const { data: menuItem, isLoading: isLoadingMenuItem } = useQuery<MenuItem>({
    queryKey: ["menuItem", resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/menu/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Failed to fetch menu item");
      return response.json();
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  React.useEffect(() => {
    if (menuItem) {
      form.reset({
        name: menuItem.name,
        price: menuItem.price.toString(),
        description: menuItem.description || "",
        image: menuItem.image,
        categoryId: menuItem.categoryId.toString(),
        isAvailable: menuItem.isAvailable,
        isPopular: menuItem.isPopular,
      });
    }
  }, [menuItem, form]);

  const { mutate: updateMenuItem, isPending: isUpdating } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch(`/api/menu/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update menu item");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Menu item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["menuItem"] });
      router.push("/admin/menu");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { mutate: deleteMenuItem, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/menu/${resolvedParams.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete menu item");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Menu item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["menuItem"] });
      router.push("/admin/menu");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMenuItem(values);
  }

  if (isLoadingMenuItem || isLoadingCategories) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/menu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">Edit Menu Item</h2>
        </div>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Delete Item"
          )}
        </Button>
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => deleteMenuItem()}
        title="Delete Menu Item"
        description="This action cannot be undone. This will permanently delete the menu item."
        loading={isDeleting}
      />

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="9.99"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Item description"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-8">
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Available</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Popular</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
