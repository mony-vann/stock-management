import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Category, Product, SubCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { ProductColumn, columns } from "@/app/products/_component/column";

type Props = {
  products: Product[];
  categories: Category[];
};

const AllProducts = ({ products, categories }: Props) => {
  const allProducts = products.map((product) => {
    return {
      ...product,
      category: categories.find(
        (category) => category.id === product.categoryId
      ),
    };
  });

  console.log(allProducts);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={allProducts as ProductColumn[]} />
      </CardContent>
    </Card>
  );
};

export default AllProducts;
