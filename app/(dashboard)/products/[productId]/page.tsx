import React from "react";
import { db } from "@/lib/db";
import { Details } from "./_component/detail";

type Props = {};

const ProductDetailPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const product = await db.product.findUnique({
    where: {
      id: parseInt(params.productId),
    },
  });
  const category = await db.category.findFirst({
    where: {
      id: product?.categoryId,
    },
  });
  const categories = await db.category.findMany();
  const variant = await db.variant.findMany({
    where: {
      productId: parseInt(params.productId),
    },
  });
  const sizes = await db.size.findMany();
  const subCategories = await db.subCategory.findMany();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-5">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Details
          product={product!}
          category={category!}
          categories={categories}
          variants={variant}
          sizes={sizes}
          subCategories={subCategories}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
