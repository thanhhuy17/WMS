// Định nghĩa kiểu Category
export interface Category {
  _id: string;
  title: string;
  slug: string;
  description: string;
}

export interface SupplierModel {
  index: number
  name: string
  slug: string
  product: string
  email: string
  active: number
  categories: Category[];  // Dùng kiểu Category[] thay vì any[]
  price: number
  contactNumber: string
  isTaking: boolean
  photoUrl: string
  status: string
  userCreated: string
  dateCreated: string
  updatedAt: string
  userEdited: string
  dateEdited: string
  _id: string
}