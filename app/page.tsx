import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import ContactInformation from "@/components/ContactInformation";
import Footer from "@/components/Footer";
import { type MenuItem } from "@/types";
import WorkingHours from "@/components/WorkingHours";

// Add revalidation to ensure page updates when data changes
export const revalidate = 0;

export default async function Home() {
  // Fetch all data in parallel for better performance
  const [heroContent, contactInfo, menuItems, hours] = await Promise.all([
    prisma.heroContent.findFirst(),
    prisma.contactInformation.findFirst(),
    prisma.menuItem.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.businessHours.findFirst(),
  ]);

  // Transform hero content with default fallbacks
  const transformedHeroContent = {
    title: heroContent?.title ?? "Delicious Food for Every Craving",
    subtitle: heroContent?.subtitle ?? undefined,
    description:
      heroContent?.description ??
      "Experience the best burgers, pizzas, and more in Addis Ababa. Fresh ingredients, amazing taste, and quick delivery.",
    images: (heroContent?.images as string[]) ?? [
      "/images/hero/image-1.jpg",
      "/images/hero/image-2.jpg",
    ],
    primaryButtonText: heroContent?.primaryButtonText ?? "Order Now",
    primaryButtonLink: heroContent?.primaryButtonLink ?? "/order-now",
    secondaryButtonText: heroContent?.secondaryButtonText ?? "View Menu",
    secondaryButtonLink: heroContent?.secondaryButtonLink ?? "/menu",
  };

  // Parse business hours with type safety
  const parsedHours = {
    monday:
      typeof hours?.monday === "string"
        ? JSON.parse(hours.monday)
        : hours?.monday ?? { open: "", close: "", isClosed: false },
    tuesday:
      typeof hours?.tuesday === "string"
        ? JSON.parse(hours.tuesday)
        : hours?.tuesday ?? { open: "", close: "", isClosed: false },
    wednesday:
      typeof hours?.wednesday === "string"
        ? JSON.parse(hours.wednesday)
        : hours?.wednesday ?? { open: "", close: "", isClosed: false },
    thursday:
      typeof hours?.thursday === "string"
        ? JSON.parse(hours.thursday)
        : hours?.thursday ?? { open: "", close: "", isClosed: false },
    friday:
      typeof hours?.friday === "string"
        ? JSON.parse(hours.friday)
        : hours?.friday ?? { open: "", close: "", isClosed: false },
    saturday:
      typeof hours?.saturday === "string"
        ? JSON.parse(hours.saturday)
        : hours?.saturday ?? { open: "", close: "", isClosed: false },
    sunday:
      typeof hours?.sunday === "string"
        ? JSON.parse(hours.sunday)
        : hours?.sunday ?? { open: "", close: "", isClosed: false },
  };

  return (
    <main className="min-h-screen bg-white">
      <TopBar
        contactInfo={{
          phone1: contactInfo?.phone1 ?? "",
          phone2: contactInfo?.phone2 ?? "",
        }}
      />
      <Header contactInfo={{ phone1: contactInfo?.phone1 ?? "" }} />
      <Hero content={transformedHeroContent} />

      <section
        className="relative border-y border-gray-200 py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white"
        id="menu"
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative flex flex-col items-center text-center mb-16">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-red-50 rounded-full blur-2xl opacity-70"></div>
            <span className="relative inline-block px-4 py-2 bg-red-50 text-red-500 text-sm font-medium rounded-full mb-4">
              Our Culinary Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Explore Our Menu
            </h2>
            <div className="mt-6 w-20 h-1.5 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
              Embark on a culinary journey through our carefully crafted
              selection of dishes, where every bite tells a story of flavor and
              passion
            </p>
          </div>
          <div className="relative mt-10">
            <Menu
              menuItems={menuItems.map((item) => ({
                ...item,
                id: item.id.toString(),
                category: {
                  ...item.category,
                  id: item.category.id.toString(),
                },
                description: item.description ?? "",
                slug: item.category.slug ?? item.id.toString(),
              }))}
            />
          </div>
        </div>
      </section>
      <WorkingHours />
      <ContactInformation
        contactInfo={{
          address: contactInfo?.address ?? "",
          email: contactInfo?.email ?? "",
          mapUrl: contactInfo?.mapUrl ?? "",
          phone1: contactInfo?.phone1 ?? "",
          phone2: contactInfo?.phone2 ?? "",
        }}
      />
      <Footer />
    </main>
  );
}
