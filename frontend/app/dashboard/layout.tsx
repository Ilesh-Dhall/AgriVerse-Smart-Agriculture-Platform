"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { notifications, languageOptions } from "@/data/data";
import { Separator } from "@/components/ui/separator";

import {
  MessageSquare,
  Sprout,
  CloudSun,
  LineChart as LineChartIcon,
  Wallet,
  ShieldAlert,
  BookOpen,
  Users,
  User,
  Bell,
  Languages,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = useMemo(
    () => [
      {
        id: "ai",
        href: "/dashboard/ai",
        label: "AI Assistant",
        icon: MessageSquare,
      },
      { id: "farm", href: "/dashboard/farm", label: "My Farm", icon: Sprout },
      {
        id: "weather",
        href: "/dashboard/weather",
        label: "Weather",
        icon: CloudSun,
      },
      {
        id: "market",
        href: "/dashboard/market",
        label: "Market",
        icon: LineChartIcon,
      },
      {
        id: "finance",
        href: "/dashboard/finance",
        label: "Finance",
        icon: Wallet,
      },
      // {
      //   id: "health",
      //   href: "/dashboard/health",
      //   label: "Crop Health",
      //   icon: ShieldAlert,
      // },
      {
        id: "knowledge",
        href: "/dashboard/knowledge",
        label: "Knowledge",
        icon: BookOpen,
      },
      {
        id: "community",
        href: "/dashboard/community",
        label: "Community",
        icon: Users,
      },
      {
        id: "profile",
        href: "/dashboard/profile",
        label: "Profile",
        icon: User,
      },
    ],
    []
  );

  const activeHref = pathname === "/dashboard" ? "/dashboard/ai" : pathname;
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  useEffect(() => {
    languageOptions.forEach((lang) => {
      if (lang.code.toUpperCase() === language) {
        localStorage.setItem("speech", lang.speech);
      }
    });
  }, [language]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-svh flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>AgriVerse</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeHref.startsWith(item.href)}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="top-0 z-10 w-full">
            <div className="flex h-16 items-center px-2">
              <SidebarTrigger variant={"outline"}></SidebarTrigger>
              <Separator orientation="vertical" className="mx-3 h-8" />
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Sprout className="h-4 w-4" />
              </div>
              <div className="font-display font-bold text-lg ">
                AgriVerse Dashboard
              </div>
              <div className="ml-auto flex items-center gap-3">
                {/* ============== */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      <Languages className="h-4 w-4" />
                      <span className="hidden sm:inline">{language}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={language}
                      onValueChange={setLanguage}
                    >
                      {languageOptions.map((lang, index) => (
                        <DropdownMenuRadioItem
                          key={index}
                          value={lang.code.toUpperCase()}
                        >
                          {lang.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* ============== */}

                <Drawer
                  direction="right"
                  open={sidebarOpen}
                  onOpenChange={setSidebarOpen}
                >
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="relative" size="icon">
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full">
                          {notifications.length}
                        </span>
                      )}
                      <Bell />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size={"icon"}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <X size={40} strokeWidth={3} />
                        </Button>
                        <DrawerTitle>Notifications</DrawerTitle>
                      </div>
                    </DrawerHeader>
                    <div className="flex flex-col p-4 gap-3">
                      {notifications.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-start gap-3 p-2 rounded-xl border"
                        >
                          <span className="text-xl">{note.icon}</span>
                          <div>
                            <div className="font-medium">{note.title}</div>
                            <div className="text-xs">{note.description}</div>
                            <div className="text-muted-foreground text-xs mt-1">
                              {note.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DrawerContent>
                </Drawer>
                <Button
                  onClick={() =>
                    theme.setTheme(theme.theme === "dark" ? "light" : "dark")
                  }
                  variant={"outline"}
                  size={"icon"}
                >
                  {mounted && theme.theme === "dark" && <Moon />}
                  {mounted && theme.theme === "light" && <Sun />}
                </Button>
              </div>
            </div>
            <Separator />
          </header>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
