import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, MessageSquare, TrendingUp, Users } from "lucide-react"
import { RecentMessages } from "@/components/admin/RecentMessages"
import { PopularItems } from "@/components/admin/PopularItems"

async function getStats() {
  const [
    menuItemCount,
    contactCount,
    recentMessages,
    popularItems,
    monthlyStats,
    userCount,
    businessHours,
    contactInfo
  ] = await Promise.all([
    prisma.menuItem.count(),
    prisma.contact.count(),
    prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.menuItem.findMany({
      where: { isPopular: true },
      take: 5,
      include: { category: true }
    }),
    prisma.$queryRaw`
      SELECT 
        to_char("createdAt", 'YYYY-MM') as month,
        COUNT(*)::integer as count
      FROM "Contact"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY to_char("createdAt", 'YYYY-MM')
      ORDER BY month ASC
    ` as Promise<{ month: string; count: number }[]>,
    prisma.user.count(),
    prisma.businessHours.findFirst({
      where: { id: 1 }
    }),
    prisma.contactInformation.findFirst({
      where: { id: 1 }
    })
  ])

  const formattedStats = {
    menuItemCount: Number(menuItemCount),
    contactCount: Number(contactCount),
    userCount: Number(userCount),
    recentMessages,
    popularItems,
    businessHours,
    contactInfo,
    monthlyStats: monthlyStats.map(stat => ({
      month: stat.month,
      count: Number(stat.count)
    }))
  }

  return formattedStats
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const currentMonth = stats.monthlyStats[stats.monthlyStats.length - 1]?.count || 0
  const previousMonth = stats.monthlyStats[stats.monthlyStats.length - 2]?.count || 0
  const monthlyGrowth = currentMonth - previousMonth

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.menuItemCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total menu items</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contactCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total messages</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.popularItems.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Featured items</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.userCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Registered users</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentMessages messages={stats.recentMessages} />
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <PopularItems items={stats.popularItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}