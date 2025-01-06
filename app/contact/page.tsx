import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import ContactInformation from "@/components/ContactInformation";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Contact Us | Eftah Fast Food",
  description:
    "Get in touch with Eftah Fast Food. Contact us for orders, feedback, or inquiries.",
};

export default async function ContactPage() {
  const contactInfo = await prisma.contactInformation.findFirst();

  return (
    <main className="min-h-screen bg-white">
      <TopBar
        contactInfo={{
          phone1: contactInfo?.phone1 || "",
          phone2: contactInfo?.phone2 || "",
        }}
      />

      <Header contactInfo={{ phone1: contactInfo?.phone1 || "" }} />
      <ContactInformation
        contactInfo={{
          address: contactInfo?.address || "",
          email: contactInfo?.email || "",
          mapUrl: contactInfo?.mapUrl || "",
          phone1: contactInfo?.phone1 || "",
          phone2: contactInfo?.phone2 || "",
        }}
      />
      <Footer />
    </main>
  );
}
