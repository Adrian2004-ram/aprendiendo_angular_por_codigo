export interface Product {
  id: number;
  title: string;
}

export interface CartItem extends Product {
  quantity: number;
}
