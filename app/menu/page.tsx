import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Menu from "@/components/Menu";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Menu | Eftah Fast Food",
  description:
    "Explore our delicious menu of burgers, pizza, and more at Eftah Fast Food.",
};

export default async function MenuPage() {
  const contactInfo = await prisma.contactInformation.findFirst();
  const menuItems = await prisma.menuItem.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isAvailable: true,
      isPopular: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <TopBar
        contactInfo={{
          phone1: contactInfo?.phone1 || "",
          phone2: contactInfo?.phone2 || "",
        }}
      />
      <Header contactInfo={{ phone1: contactInfo?.phone1 || "" }} />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-5 md:px-0">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600 mb-8">
            Discover our delicious selection of burgers, pizza, and more
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-0">
          <Menu menuItems={menuItems.map(item => ({
            ...item,
            id: String(item.id),
            description: item.description ?? "",
            category: {
              ...item.category,
              id: String(item.category.id)
            },
            slug: item.category.slug
          }))} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
