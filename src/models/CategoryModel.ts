export interface CategoryModel {
    _id: string
    title: string
    parentId: string
    slug: string
    description: string
    createdAt: string
    userCreated: string,
    updatedAt: string
    userEdited: string,
    isDeleted: boolean
    __v: number
}