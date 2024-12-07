export interface ProductModel {
  index: number
  slug: string
  productName: string
  productId: string
  categories: string[]
  suppliers:string[]
  buyingPrice: number
  quantity: number
  unit: string[]
  photoUrl: string
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