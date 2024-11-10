import { ReactNode } from "react";

export interface InventoryModel {
    key: string;
    description: string;
    value: number
    valueType: "number" | "currency";
    cost: number;
    costName?: string;
    type?: "horizontal" | "vertical";
    icon?: ReactNode;
    color: string;
    status: string
    typeShow?: 'categories' | 'other'
}