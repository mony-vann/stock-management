import React from "react";
import Sidebar from "@/components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import MobileSidebar from "@/components/MobileSidebar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findFirst({
    where: {
      password: userId,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <Sidebar />
      <MobileSidebar />
      {children}
    </>
  );
}
