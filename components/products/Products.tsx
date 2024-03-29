"use client";

import React from "react";
import { Product } from "@prisma/client";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ListFilter, File, PlusCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AllProducts from "@/components/products/AllProducts";
import ActiveProducts from "./ActiveProducts";
import DraftProducts from "./DraftProducts";
import { Input } from "../ui/input";

type Props = {
  products: Product[];
};

const Products = ({ products }: Props) => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Button variant="outline" className="h-10 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button className="h-10">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <AllProducts products={products} />
        </TabsContent>
        <TabsContent value="active">
          <ActiveProducts />
        </TabsContent>
        <TabsContent value="draft">
          <DraftProducts />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Products;
