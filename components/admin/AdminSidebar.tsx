"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  FolderTree,
  Image,
  Clock,
  Phone,
  User,
  LogOut,
  Share2,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    heading: "Content Management",
    links: [
      {
        title: "Hero Section",
        href: "/admin/hero",
        icon: Image,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        title: "Menu Items",
        href: "/admin/menu",
        icon: Menu,
      },
    ],
  },
  {
    heading: "Communication",
    links: [
      {
        title: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    heading: "Business Settings",
    links: [
      {
        title: "Business Hours",
        href: "/admin/settings/hours",
        icon: Clock,
      },
      {
        title: "Contact Info",
        href: "/admin/settings/contact",
        icon: Phone,
      },
      {
        title: "Social Media",
        href: "/admin/settings/social",
        icon: Share2,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton
            isActive={pathname === "/admin"}
            tooltip="Dashboard"
            asChild
          >
            <Link href="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>

        {sidebarLinks.slice(1).map((section) => (
          <SidebarGroup key={section.heading}>
            <SidebarGroupLabel>{section.heading}</SidebarGroupLabel>
            {section.links &&
              section.links.map((link) => (
                <SidebarMenuButton
                  key={link.href}
                  isActive={pathname === link.href}
                  tooltip={link.title}
                  asChild
                >
                  <Link href={link.href} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
