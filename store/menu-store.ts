import { create } from 'zustand'
import { MenuItem, Category } from '@/lib/types'

interface MenuState {
  items: MenuItem[]
  categories: Category[]
  selectedCategory: string | null
  isLoading: boolean
  error: string | null
  fetchItems: (category?: string) => Promise<void>
  fetchCategories: () => Promise<void>
  setSelectedCategory: (category: string | null) => void
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchItems: async (category?: string) => {
    try {
      set({ isLoading: true })
      const url = category 
        ? `/api/menu?category=${category}`
        : '/api/menu'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch menu items')
      const data = await response.json()
      set({ items: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      set({ categories: data })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  },

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category })
    get().fetchItems(category || undefined)
  }
}))