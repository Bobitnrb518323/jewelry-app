import { supabase } from './supabase';
import type { Product, Order, Customer, OrderStatus } from '../types';

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function upsertProduct(product: Product): Promise<void> {
  const { error } = await supabase
    .from('products')
    .upsert(product, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function insertOrder(order: Order): Promise<void> {
  const { error } = await supabase.from('orders').insert(order);
  if (error) throw error;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, trackingEvents: Order['trackingEvents']): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status, trackingEvents })
    .eq('id', orderId);
  if (error) throw error;
}

// ── Customers ─────────────────────────────────────────────────────────────────

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('dateJoined', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function upsertCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .upsert(customer, { onConflict: 'id' });
  if (error) throw error;
}

export async function updateCustomerStatus(customerId: string, status: 'active' | 'suspended'): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .update({ status })
    .eq('id', customerId);
  if (error) throw error;
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}
