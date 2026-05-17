import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching YOUR Supabase tables
export interface Product {
  id?: number;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  created_at?: string;
  product_sizes?: ProductSize[];
}

export interface ProductSize {
  id?: number;
  product_id: number;
  size_label: string;
  price: number;
}

export interface Category {
  id?: number;
  name: string;
  slug: string;
  group: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  category?: string;
  size: string;
  flavour?: string;
  cakeFlavour?: string;
  cupcakeFlavour?: string;
  shape?: string;
  addOns: string[];
  messageOnCake?: string;
  theme?: string;
  colorPreferences?: string;
  referenceImage?: string;
  specialInstructions?: string;
  quantity: number;
  pricePerItem: number;
  image?: string;
}

export interface Order {
  id?: number | string;
  order_number?: string;
  order_type?: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  delivery_method: 'delivery' | 'pickup';
  address?: string | null;
  date: string;
  time_slot: string;
  items: OrderItem[];
  total_amount: number;
  status?: string;
  created_at?: string;
}

function generateOrderNumber(): string {
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `MB-${stamp}-${suffix}`;
}

// ─── Product CRUD ───

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .eq('category', category)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'product_sizes'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'created_at' | 'product_sizes'>>) {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: number) {
  // product_sizes deleted automatically via ON DELETE CASCADE
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Product Size CRUD ───

export async function createProductSizes(sizes: Omit<ProductSize, 'id'>[]) {
  if (sizes.length === 0) return;
  const { error } = await supabase
    .from('product_sizes')
    .insert(sizes);

  if (error) throw error;
}

export async function deleteProductSizes(productId: number) {
  const { error } = await supabase
    .from('product_sizes')
    .delete()
    .eq('product_id', productId);

  if (error) throw error;
}

// ─── Dashboard Stats ───

export async function getProductCount() {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('products')
    .select('category');

  if (error) throw error;

  const counts: Record<string, number> = {};
  data?.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

// ─── Category CRUD ───

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('group', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: number) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'status' | 'order_number' | 'order_type'>) {
  const fullRow = {
    order_number: generateOrderNumber(),
    order_type: order.delivery_method,
    customer_name: order.customer_name,
    phone: order.phone,
    email: order.email ?? null,
    delivery_method: order.delivery_method,
    address: order.address ?? null,
    date: order.date,
    time_slot: order.time_slot,
    items: order.items,
    total_amount: order.total_amount,
    status: 'Pending',
  };

  let result = await supabase.from('orders').insert(fullRow).select().single();

  // Fallback for older DB schema (customer_phone + no delivery columns)
  if (result.error?.code === 'PGRST204') {
    result = await supabase
      .from('orders')
      .insert({
        order_number: fullRow.order_number,
        order_type: fullRow.order_type,
        customer_name: order.customer_name,
        customer_phone: order.phone,
        items: {
          lineItems: order.items,
          email: order.email ?? null,
          delivery_method: order.delivery_method,
          address: order.address ?? null,
          date: order.date,
          time_slot: order.time_slot,
        },
        total_amount: order.total_amount,
        status: 'Pending',
      })
      .select()
      .single();
  }

  if (result.error) throw result.error;

  const data = result.data as Order & { customer_phone?: string; items: OrderItem[] | { lineItems?: OrderItem[] } };
  const items = Array.isArray(data.items)
    ? data.items
    : (data.items as { lineItems?: OrderItem[] })?.lineItems ?? order.items;

  return {
    ...data,
    phone: data.phone ?? data.customer_phone ?? order.phone,
    items,
    date: data.date ?? order.date,
    time_slot: data.time_slot ?? order.time_slot,
    delivery_method: data.delivery_method ?? order.delivery_method,
    address: data.address ?? order.address,
    email: data.email ?? order.email,
  } as Order;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Order[];
}

export async function updateOrderStatus(orderId: string | number, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// ─── Reviews ───

export interface Review {
  id?: string;
  name: string;
  rating: number;
  review_text: string;
  created_at?: string;
  status?: string;
}

export async function submitReview(review: Omit<Review, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Review[];
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
