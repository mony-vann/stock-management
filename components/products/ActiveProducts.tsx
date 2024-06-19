import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, Product, SubCategory } from "@prisma/client";
import { DataTable } from "../ui/data-table";
import { columns } from "@/app/(dashboard)/products/_component/column";
import { ProductColumn } from "@/app/(dashboard)/products/_component/column";

type Props = {
  products: Product[];
  categories: Category[];
};

const ActiveProducts = ({ products, categories }: Props) => {
  const allProducts = products.map((product) => {
    return {
      ...product,
      category: categories.find(
        (category) => category.id === product.categoryId
      ),
    };
  });
  const activeProducts = allProducts.filter(
    (product) => product.status === "active"
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={activeProducts as ProductColumn[]} />
      </CardContent>
    </Card>
  );
};

export default ActiveProducts;
