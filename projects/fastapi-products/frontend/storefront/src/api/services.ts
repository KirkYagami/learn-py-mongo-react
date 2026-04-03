import { api } from './client';
import type { Product, ProductCreate, ProductUpdate, Seller, SellerCreate, Token } from '../types';

// --- AUTH ---
export async function login(username: string, password: string): Promise<Token> {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  const { data } = await api.post<Token>('/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}

// --- PRODUCTS ---
export async function getProducts(params?: {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  in_stock?: boolean;
}): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products/', { params });
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(body: ProductCreate): Promise<Product> {
  const { data } = await api.post<Product>('/products/', body);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function updateProduct(id: string, body: ProductUpdate): Promise<Product> {
  const { data } = await api.patch<Product>(`/products/${id}`, body);
  return data;
}

// --- SELLERS ---
export async function getSellers(): Promise<Seller[]> {
  const { data } = await api.get<Seller[]>('/sellers/');
  return data;
}

export async function getSeller(id: string): Promise<Seller> {
  const { data } = await api.get<Seller>(`/sellers/${id}`);
  return data;
}

export async function createSeller(body: SellerCreate): Promise<Seller> {
  const { data } = await api.post<Seller>('/sellers/', body);
  return data;
}
