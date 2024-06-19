import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Category, Product, SubCategory } from "@prisma/client";
import { DataTable } from "../ui/data-table";
import {
  ProductColumn,
  columns,
} from "@/app/(dashboard)/products/_component/column";

type Props = {
  products: Product[];
  categories: Category[];
};

const ArchivedProducts = ({ products, categories }: Props) => {
  const allProducts = products.map((product) => {
    return {
      ...product,
      category: categories.find(
        (category) => category.id === product.categoryId
      ),
    };
  });
  const archivedProducts = allProducts.filter(
    (product) => product.status === "archived"
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
        <DataTable
          columns={columns}
          data={archivedProducts as ProductColumn[]}
        />
      </CardContent>
    </Card>
  );
};

export default ArchivedProducts;
