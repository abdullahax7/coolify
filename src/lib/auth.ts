export interface User {
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  type: 'listing' | 'service';
  name: string;
  price: string;
  detail: string;
  date: string;
  status: 'active' | 'pending' | 'completed';
}

const USER_KEY = 'pt_user';
const ORDERS_KEY = 'pt_orders';

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addOrder(order: Omit<Order, 'id' | 'date'>) {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now()}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]));
  return newOrder;
}
