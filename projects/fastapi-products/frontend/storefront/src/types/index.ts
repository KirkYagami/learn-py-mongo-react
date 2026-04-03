export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  category: string;
  seller_id?: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  category: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  in_stock?: boolean;
  category?: string;
}

export interface Seller {
  id: string;
  username: string;
  email: string;
}

export interface SellerCreate {
  username: string;
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type Theme = 'dark' | 'light';
