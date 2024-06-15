"use client";

import React from "react";
import { Category, Product, SubCategory } from "@prisma/client";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, PlusCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import AllProducts from "@/components/products/AllProducts";
import ActiveProducts from "./ActiveProducts";
import ArchivedProducts from "./ArchivedProducts";

type Props = {
  products: Product[];
  categories: Category[];
};

const Products = ({ products, categories }: Props) => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Dialog>
              <DialogTrigger className="flex items-center justify-center rounded-md bg-primary h-9 px-2 text-primary-foreground">
                <PlusCircle className="h-3.5 w-3.5 mr-2" />
                <span className="sr-only text-sm font-medium sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new Product</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <AllProducts products={products} categories={categories} />
        </TabsContent>
        <TabsContent value="active">
          <ActiveProducts products={products} categories={categories} />
        </TabsContent>
        <TabsContent value="archived">
          <ArchivedProducts products={products} categories={categories} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Products;
