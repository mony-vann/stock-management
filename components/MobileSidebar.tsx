"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  ShoppingCart,
  Package,
  Users2,
  LineChart,
  Settings,
  CoffeeIcon,
  Menu,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BottleSalesToJson from "./dashboard/BottleSalesToJson";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {};

const MobileSidebar = (props: Props) => {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const showSidebar = !pathname.startsWith("/checkin");

  return (
    <>
      {showSidebar && (
        <Sheet>
          <SheetTrigger
            asChild
            className="block md:hidden absolute top-[52px] left-4"
          >
            <Button variant="ghost">
              <Menu className="w-8 h-8" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[60px]">
            <aside className="absolute left-0 z-10 w-14 h-screen  bg-background flex flex-col justify-between">
              <nav className="flex flex-col items-center gap-4 px-2 ">
                <Link
                  href="#"
                  className="mb-10 group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                  <CoffeeIcon className="h-6 w-6 transition-all group-hover:scale-110 stroke-primary" />
                  <span className="sr-only">Cafe Corner</span>
                </Link>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-primary md:h-8 md:w-8 ${
                          isLinkActive("/") &&
                          !isLinkActive("/products") &&
                          !isLinkActive("/staff")
                            ? "bg-primary text-accent hover:text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Dashboard</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Dashboard</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-primary md:h-8 md:w-8 ${
                          isLinkActive(`/orders`)
                            ? "bg-primary text-accent hover:text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Orders</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Orders</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/products`}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-primary md:h-8 md:w-8 ${
                          isLinkActive(`/products`)
                            ? "bg-primary text-accent hover:text-primary-foreground"
                            : "text-muted-foreground "
                        }`}
                      >
                        <Package className="h-5 w-5" />
                        <span className="sr-only">Products</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Products</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/staff`}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-primary md:h-8 md:w-8 ${
                          isLinkActive(`/staff`)
                            ? "bg-primary text-accent hover:text-primary-foreground"
                            : "text-muted-foreground "
                        }`}
                      >
                        <Users2 className="h-5 w-5" />
                        <span className="sr-only">Staffs</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Staffs</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-primary md:h-8 md:w-8 ${
                          isLinkActive("/analytics")
                            ? "bg-primary text-accent hover:text-primary-foreground"
                            : "text-muted-foreground "
                        }`}
                      >
                        <LineChart className="h-5 w-5" />
                        <span className="sr-only">Analytics</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Analytics</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </nav>
              <nav className="pb-10 flex flex-col items-center gap-4 px-2 ">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* <ExcelToJson /> */}
                      <BottleSalesToJson />
                    </TooltipTrigger>
                    <TooltipContent side="right">Analytics</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-primary md:h-8 md:w-8 ${
                          isLinkActive("/settings")
                            ? "bg-primary text-accent hover:text-primary-foreground"
                            : "text-muted-foreground "
                        }`}
                      >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </nav>
            </aside>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default MobileSidebar;
