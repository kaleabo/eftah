'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Facebook, Twitter, Instagram, Loader2, Send, Video } from 'lucide-react'

const formSchema = z.object({
  socialLinks: z.object({
    facebook: z.string().url('Please enter a valid Facebook URL').or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').or(z.literal('')),
    instagram: z.string().url('Please enter a valid Instagram URL').or(z.literal('')),
    telegram: z.string().url('Please enter a valid Telegram URL').or(z.literal('')),
    tiktok: z.string().url('Please enter a valid TikTok URL').or(z.literal(''))
  })
})

type FormValues = z.infer<typeof formSchema>

export default function SocialLinksSettings() {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        telegram: '',
        tiktok: ''
      }
    }
  })

  // Query for fetching settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/social/settings')
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      // Update form with links from database
      form.reset({ 
        socialLinks: {
          facebook: data.links.facebook || '',
          twitter: data.links.twitter || '',
          instagram: data.links.instagram || '',
          telegram: data.links.telegram || '',
          tiktok: data.links.tiktok || ''
        }
      })
      return data
    }
  })

  // Mutation for updating settings
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch('/api/social/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Social links updated successfully')
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update social links')
    }
  })

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values)
  }

  if (isLoadingSettings) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm">
          <CardHeader>
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="space-y-2">
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
              <div className="flex justify-end">
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Manage your restaurant's social media presence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="socialLinks.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://facebook.com/your-restaurant" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your restaurant's Facebook page URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://twitter.com/your-restaurant" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your restaurant's Twitter profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://instagram.com/your-restaurant" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your restaurant's Instagram profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Telegram
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://t.me/your-channel" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your restaurant's Telegram channel URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      TikTok
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://tiktok.com/@your-account" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your restaurant's TikTok profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}