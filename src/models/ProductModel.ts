import { Category, SupplierModel } from "./SupplierModel"

export interface ProductModel {
  index: number
  slug: string
  productName: string
  productId: string
  categories: Category[]
  suppliers: SupplierModel[]
  buyingPrice: number
  quantity: number
  unit: string[]
  photoUrls: string[]
  thresholdValue: number
  expiryDate: string
  status: string
  userCreated: string
  dateCreated: string
  isDeleted: boolean
  userEdited: string
  dateEdited: string
  _id: string
}
