import { Category, SupplierModel } from "./SupplierModel";

export interface ProductModel {
  index: number;
  slug: string;
  productName: string;
  description: string;
  content: string;
  productId: string;
  categories: Category[];
  suppliers: SupplierModel[];
  buyingPrice: number;
  quantity: number;
  unit: string[];
  photoUrls: string[];
  thresholdValue: number;
  expiryDate: string;
  status: string;
  userCreated: string;
  dateCreated: string;
  isDeleted: boolean;
  userEdited: string;
  dateEdited: string;
  _id: string;
  // children: SubProductModel[]
  subItems: SubProductModel[];
}

export interface SubProductModel {
  size: string;
  color: string;
  price: number;
  qty: number;
  productId: string;
  image: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
