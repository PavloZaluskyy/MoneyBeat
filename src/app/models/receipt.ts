import { Category } from "./category";
import { Good } from "./good";

export interface Receipt {
    id: number;
    nameStore: string;
    adressStore: string;
    date: string | Date;
    goods: Goods[];
    totalAmaund: number;
}
export interface Goods {
    name: string;
    quantity: string;
    category: string;
    price: string
}
