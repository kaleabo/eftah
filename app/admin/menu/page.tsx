'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Image from 'next/image'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface MenuItem {
  id: number
  name: string
  price: number
  image: string
  isAvailable: boolean
  category?: {
    id: number
    name: string
    slug: string
  }
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function MenuItems() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      return res.json()
    }
  })

  const { data: menuItems, isLoading, refetch } = useQuery<MenuItem[]>({
    queryKey: ['menuItems', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all' 
        ? '/api/menu'
        : `/api/menu?category=${selectedCategory}`
      const res = await fetch(url)
      return res.json()
    }
  })

  const filteredItems = menuItems?.filter((item: MenuItem) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete item')
      
      toast.success('Menu item deleted successfully')
      refetch()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error('Failed to delete menu item')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Menu Items</h2>
        <Button className="w-full md:w-auto" asChild>
          <Link href="/admin/menu/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category: Category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 w-[140px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-3 w-[100px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse md:hidden" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-5 w-[100px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-[80px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-5 w-[90px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredItems?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No menu items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems?.map((item: MenuItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative h-10 w-10">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="md:hidden text-sm text-muted-foreground">
                            {item.category?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">
                          {item.category?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>ETB {item.price.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={item.isAvailable ? "default" : "destructive"}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <Link href={`/admin/menu/${item.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedItem && handleDelete(selectedItem.id)}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  )
}