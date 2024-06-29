import Header from "@/components/Header";
import Products from "@/components/products/Products";
import { db } from "@/lib/db";
import axios from "axios";
import React from "react";

type Props = {};

const ProductPage = async (props: Props) => {
  // const products = await db.product.findMany();
  // const categories = await db.category.findMany();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {/* <Products products={products} categories={categories} /> */}
        coming soon
      </div>
    </div>
  );
};

export default ProductPage;
