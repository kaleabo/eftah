'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  primaryButtonText: z.string().min(1, 'Primary button text is required'),
  primaryButtonLink: z.string().min(1, 'Primary button link is required'),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
})

export default function HeroSettings() {
  const { data: heroContent, refetch, isLoading } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const res = await fetch('/api/hero')
      if (!res.ok) throw new Error('Failed to fetch hero content')
      return res.json()
    }
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      images: [],
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: ''
    }
  })

  // Update form values when heroContent is fetched
  useEffect(() => {
    if (heroContent) {
      form.reset(heroContent)
    }
  }, [heroContent, form])

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) throw new Error('Failed to save hero content')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Hero content updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message
      })
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values)
  }

  if (isLoading) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500">Loading hero content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Hero Section Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize the hero section content and appearance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Hero Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hero title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subtitle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter hero description"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Images</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          multiple
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryButtonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Button Text</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Order Now" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryButtonLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Button Link</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. /menu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryButtonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Button Text (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Learn More" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryButtonLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Button Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. /about" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}