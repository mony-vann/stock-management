"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button variant={"ghost"} onClick={() => router.back()}>
      <MoveLeft size={24} />
    </Button>
  );
};

export default BackButton;
