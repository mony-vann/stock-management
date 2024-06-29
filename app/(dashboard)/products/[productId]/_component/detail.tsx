// "use client";

// import Image from "next/image";
// import { Car, ChevronLeft, PlusCircle, Upload, Users2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Textarea } from "@/components/ui/textarea";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Category, Product, Size, SubCategory, Variant } from "@prisma/client";
// import { useRouter } from "next/navigation";

// type Props = {
//   product: Product;
//   category: Category;
//   categories: Category[];
//   variants: Variant[];
//   sizes: Size[];
//   subCategories: SubCategory[];
// };

// export function Details({
//   product,
//   category,
//   categories,
//   variants,
//   sizes,
//   subCategories,
// }: Props) {
//   const router = useRouter();
//   return (
//     <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
//       <div className="mx-auto grid flex-1 auto-rows-max gap-4">
//         <div className="flex items-center gap-4">
//           <Button
//             onClick={() => {
//               router.back();
//             }}
//             variant="outline"
//             size="icon"
//             className="h-7 w-7"
//           >
//             <ChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Back</span>
//           </Button>
//           <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
//             {product.name}
//           </h1>
//           <Badge variant="outline" className="ml-auto sm:ml-0">
//             In stock
//           </Badge>
//           <div className="hidden items-center gap-2 md:ml-auto md:flex">
//             <Button variant="outline" size="sm">
//               Discard
//             </Button>
//             <Button size="sm">Save Product</Button>
//           </div>
//         </div>
//         <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
//           <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Product Details</CardTitle>
//                 <CardDescription>View and edit product details</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-6">
//                   <div className="grid grid-cols-4 gap-3">
//                     <div className="col-span-2">
//                       <Label htmlFor="name">Name</Label>
//                       <Input
//                         id="name"
//                         type="text"
//                         className="w-full"
//                         defaultValue={product.name}
//                       />
//                     </div>
//                     <div className="col-span-2">
//                       <Label htmlFor="description">Category</Label>
//                       <Select>
//                         <SelectTrigger
//                           id="category"
//                           aria-label="Select category"
//                         >
//                           <SelectValue placeholder={category.name} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {categories.map((category) => (
//                             <SelectItem key={category.id} value={category.name}>
//                               {category.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="grid gap-3">
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea
//                       id="description"
//                       defaultValue={product.description || ""}
//                       className="min-h-32"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Stock</CardTitle>
//                 <CardDescription>
//                   Manage stock and variants of the product
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-[100px]">Name</TableHead>
//                       <TableHead>Stock</TableHead>
//                       <TableHead>Price</TableHead>
//                       <TableHead>Sub-Category</TableHead>
//                       <TableHead className="w-[100px]">Size</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {variants.map((variant) => (
//                       <TableRow key={variant.id}>
//                         <TableCell className="font-semibold">
//                           {variant.name}
//                         </TableCell>
//                         <TableCell>
//                           <Label
//                             htmlFor={`stock-${variant.id}`}
//                             className="sr-only"
//                           >
//                             Stock
//                           </Label>
//                           <Input
//                             id={`stock-${variant.id}`}
//                             type="number"
//                             defaultValue={variant.amount}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Label
//                             htmlFor={`price-${variant.id}`}
//                             className="sr-only"
//                           >
//                             Price
//                           </Label>
//                           <Input
//                             id={`price-${variant.id}`}
//                             type="number"
//                             defaultValue={variant.price}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Label htmlFor="sub-category" className="sr-only">
//                             Sub-Category
//                           </Label>
//                           <Select>
//                             <SelectTrigger>
//                               <SelectValue
//                                 placeholder={variant.subCategoryId}
//                               />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="t-shirt">Cold</SelectItem>
//                               <SelectItem value="hoodie">Hot</SelectItem>
//                               <SelectItem value="hoodie">Frappe</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                         <TableCell>
//                           <ToggleGroup
//                             type="single"
//                             defaultValue={
//                               sizes
//                                 .filter((size) => size.id === variant.sizeId)
//                                 .map((size) => size.name)[0]
//                             }
//                             variant="outline"
//                           >
//                             <ToggleGroupItem value="Small">S</ToggleGroupItem>
//                             <ToggleGroupItem value="Medium">M</ToggleGroupItem>
//                             <ToggleGroupItem value="Large">L</ToggleGroupItem>
//                           </ToggleGroup>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//               <CardFooter className="justify-center border-t p-4">
//                 <Button size="sm" variant="ghost" className="gap-1">
//                   <PlusCircle className="h-3.5 w-3.5" />
//                   Add Variant
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//           <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Product Status</CardTitle>
//                 <CardDescription>
//                   Status of the product and its availability
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-6">
//                   <div className="grid gap-3">
//                     <Label htmlFor="status">Status</Label>
//                     <Select>
//                       <SelectTrigger id="status" aria-label="Select status">
//                         <SelectValue placeholder={product.status} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="published">Active</SelectItem>
//                         <SelectItem value="archived">Archived</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Archive Product</CardTitle>
//                 <CardDescription>
//                   Archive the product and make it unavailable
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div></div>
//                 <Button size="sm" variant="secondary">
//                   Archive Product
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card className="overflow-hidden">
//               <CardHeader>
//                 <CardTitle>Product Images</CardTitle>
//                 <CardDescription>
//                   Upload and manage product images
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-2">
//                   <Image
//                     alt="Product image"
//                     className="aspect-square w-full rounded-md object-cover"
//                     height="300"
//                     src="/placeholder.svg"
//                     width="300"
//                   />
//                   <div className="grid grid-cols-3 gap-2">
//                     <button>
//                       <Image
//                         alt="Product image"
//                         className="aspect-square w-full rounded-md object-cover"
//                         height="84"
//                         src="/placeholder.svg"
//                         width="84"
//                       />
//                     </button>
//                     <button>
//                       <Image
//                         alt="Product image"
//                         className="aspect-square w-full rounded-md object-cover"
//                         height="84"
//                         src="/placeholder.svg"
//                         width="84"
//                       />
//                     </button>
//                     <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
//                       <Upload className="h-4 w-4 text-muted-foreground" />
//                       <span className="sr-only">Upload</span>
//                     </button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//         <div className="flex items-center justify-center gap-2 md:hidden">
//           <Button variant="outline" size="sm">
//             Discard
//           </Button>
//           <Button size="sm">Save Product</Button>
//         </div>
//       </div>
//     </main>
//   );
// }
