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
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ExcelToJson from "./dashboard/ExcelToJson";
type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const showSidebar = !pathname.startsWith("/checkin");

  return (
    <>
      {showSidebar && (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <CoffeeIcon className="h-4 w-4 transition-all group-hover:scale-110" />
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
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExcelToJson />
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
      )}
    </>
  );
};

export default Sidebar;
