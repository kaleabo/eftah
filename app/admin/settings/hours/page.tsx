'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const timeSchema = z.object({
  open: z.string(),
  close: z.string(), 
  isClosed: z.boolean()
})

const formSchema = z.object({
  monday: timeSchema,
  tuesday: timeSchema,
  wednesday: timeSchema,
  thursday: timeSchema,
  friday: timeSchema,
  saturday: timeSchema,
  sunday: timeSchema
})

// Generate time slots in Ethiopian time (6 hours behind international time)
const timeSlots = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6 // Start from 6 AM Ethiopian time
  const minute = i % 2 === 0 ? '00' : '30'
  const internationalHour = (hour + 6) % 24
  const time = `${internationalHour.toString().padStart(2, '0')}:${minute}`
  return time
})

function toEthiopianTime(time: string): string {
  const [hour, minute] = time.split(':').map(Number)
  const ethiopianHour = (hour - 6 + 24) % 24
  const period = ethiopianHour >= 12 ? 'PM' : 'AM'
  const displayHour = ethiopianHour > 12 ? ethiopianHour - 12 : ethiopianHour
  return `${displayHour || 12}:${minute.toString().padStart(2, '0')} ${period}`
}

export default function BusinessHours() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monday: { open: '08:00', close: '20:00', isClosed: false },
      tuesday: { open: '08:00', close: '20:00', isClosed: false },
      wednesday: { open: '08:00', close: '20:00', isClosed: false },
      thursday: { open: '08:00', close: '20:00', isClosed: false },
      friday: { open: '08:00', close: '20:00', isClosed: false },
      saturday: { open: '08:00', close: '20:00', isClosed: false },
      sunday: { open: '08:00', close: '20:00', isClosed: false }
    }
  })

  const { data: hours, isLoading } = useQuery({
    queryKey: ['businessHours'],
    queryFn: async () => {
      const response = await fetch('/api/settings/hours')
      if (!response.ok) throw new Error('Failed to fetch hours')
      return response.json()
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/settings/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update hours')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Business hours have been updated')
    },
    onError: () => {
      toast.error('Failed to update business hours')
    }
  })

  useEffect(() => {
    if (hours) {
      form.reset(hours)
    }
  }, [hours, form])

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data)
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium">Business Hours</CardTitle>
          <Clock className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {days.map((day) => (
                <div key={day} className="grid gap-4 md:grid-cols-3 items-end">
                  <FormField
                    control={form.control}
                    name={`${day}.isClosed`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel className="capitalize">{day}</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {!form.watch(`${day}.isClosed`) && (
                    <>
                      <FormField
                        control={form.control}
                        name={`${day}.open`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select opening time">
                                    {field.value && toEthiopianTime(field.value)}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {toEthiopianTime(time)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`${day}.close`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select closing time">
                                    {field.value && toEthiopianTime(field.value)}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {toEthiopianTime(time)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              ))}

              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
