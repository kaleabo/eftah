export interface MenuItem {
    id: number
    name: string
    slug: string
    price: number
    description?: string | null
    image: string
    isPopular: boolean
    isAvailable: boolean
    categoryId: number
    category: Category
  }
  
  export interface Category {
    id: number
    name: string
    slug: string
    description?: string | null
    menuItems?: MenuItem[]
  }
  
  export interface BusinessInfo {
    id: number
    name: string
    description?: string | null
    address: string
    phone1: string
    phone2?: string | null
    email: string
    openingHours: {
      [key: string]: {
        open: string
        close: string
        isClosed?: boolean
      }
    }
    socialLinks: {
      facebook?: string
      instagram?: string
      twitter?: string
    }
  }