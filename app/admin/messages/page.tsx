'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, Mail, Loader2 } from 'lucide-react'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface Contact {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

export default function ContactMessages() {
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch messages with pagination
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contact-messages', page, itemsPerPage],
    queryFn: async () => {
      const res = await fetch(`/api/contact?page=${page}&limit=${itemsPerPage}`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      return res.json() as Promise<{
        messages: Contact[]
        total: number
      }>
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete message')
      return res.json()
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Message deleted successfully'
      })
      refetch()
      setDeleteId(null)
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage)

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Contact Messages</h2>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Messages received
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select items per page" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option} items per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                </TableRow>
              ))
            )}
            {!isLoading && data?.messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  {format(new Date(message.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${message.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {message.email}
                  </a>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate">{message.message}</p>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(message.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && !data?.messages.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No messages found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
              disabled={isLoading}
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || isLoading}
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </div>
  )
}