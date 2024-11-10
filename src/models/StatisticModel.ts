import { ReactNode } from "react";

export interface StatisticModel {
    key: string;
    description: string;
    value: number;
    valueType: "number" | "currency";
    type?: "horizontal" | "vertical";
    icon: ReactNode;
    color: string;
    backgroundColor?:string
}