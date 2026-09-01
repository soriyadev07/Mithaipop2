import { 
  User, 
  OrderConfirmation, 
  PreOrder, 
  InventoryItem, 
  Coupon, 
  GiftOrderRecord, 
  AppNotification, 
  ActivityLog, 
  StoreSettings 
} from '../types';
import { PRODUCTS } from './products';

// INITIAL USERS — Only Admin user for prototype authentication; customers start at 0
export const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user_admin_01',
    fullName: 'Admin Staff',
    email: 'admin123@mail.com',
    phone: '+91 98100 99881',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2024-01-01',
    passwordHash: 'admin123@mail.com',
    notes: ['Head of Operations & Brand Commerce', 'Store Administrator']
  }
];

// INITIAL ORDERS — Starts completely empty (0 orders)
export const INITIAL_ORDERS: OrderConfirmation[] = [];

// INITIAL PRE-ORDERS — Starts completely empty (0 pre-orders)
export const INITIAL_PREORDERS: PreOrder[] = [];

// INITIAL INVENTORY — Connected directly to storefront products
export const INITIAL_INVENTORY: InventoryItem[] = PRODUCTS.map((prod, idx) => ({
  productId: prod.id,
  productName: prod.name,
  sku: `MP-${prod.name.substring(0, 2).toUpperCase()}-00${idx + 1}`,
  image: prod.image,
  currentStock: 50,
  reservedStock: 0,
  availableStock: 50,
  lowStockThreshold: 15,
  status: 'In Stock',
  lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
}));

// INITIAL COUPONS — Active promo codes with 0 usage
export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'POP20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 400,
    maxDiscount: 200,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usageCount: 0,
    isActive: true,
    description: '20% off on all orders above ₹400'
  },
  {
    code: 'POPFIRST',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 249,
    maxDiscount: 100,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    usageLimit: 5000,
    usageCount: 0,
    isActive: true,
    description: '10% welcome discount on first Pop order'
  },
  {
    code: 'MITHAI10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    maxDiscount: 150,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    usageLimit: 800,
    usageCount: 0,
    isActive: true,
    description: '10% off for festival celebrations'
  },
  {
    code: 'FESTIVE50',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 500,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    usageLimit: 300,
    usageCount: 0,
    isActive: true,
    description: 'Flat ₹50 off on festival dessert boxes'
  }
];

// INITIAL GIFT ORDERS — Starts completely empty (0 gift orders)
export const INITIAL_GIFT_ORDERS: GiftOrderRecord[] = [];

// INITIAL NOTIFICATIONS — Starts completely empty (0 notifications)
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

// INITIAL ACTIVITY LOGS — Starts completely empty (0 activity logs)
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

// INITIAL SUPPORT TICKETS — Starts completely empty (0 support tickets)
export const INITIAL_SUPPORT_TICKETS: any[] = [];

// INITIAL STORE SETTINGS
export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Mithai Pop Foods Pvt. Ltd.',
  tagline: 'Classic Indian Flavours. In a Cold Collectible Can.',
  contactEmail: 'care@mithaipop.com',
  supportPhone: '+91 98200 11223',
  orderPrefix: 'MP',
  standardDeliveryFee: 49,
  expressDeliveryFee: 99,
  freeDeliveryThreshold: 499,
  standardDeliveryTime: '30-45 mins (Cryo-Pack)',
  expressDeliveryTime: '15-25 mins (Super-Chill Priority)',
  serviceableAreas: 'Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Jaipur, Ahmedabad',
  taxRatePercent: 5,
  enableCod: true,
  enableUPI: true,
  enableCards: true,
  lowStockGlobalThreshold: 15,
  autoApproveReviews: false,
  maintenanceMode: false
};

// EMPTY ANALYTICS TEMPLATE — Will be calculated dynamically from real orders
export const ANALYTICS_DATA = {
  today: {
    revenue: 0,
    orders: 0,
    aov: 0,
    repeatRate: 0,
    topProducts: [] as { name: string; orders: number; revenue: number }[],
    timeline: [] as { label: string; revenue: number; orders: number }[]
  },
  '7d': {
    revenue: 0,
    orders: 0,
    aov: 0,
    repeatRate: 0,
    topProducts: [] as { name: string; orders: number; revenue: number }[],
    timeline: [] as { label: string; revenue: number; orders: number }[]
  },
  '30d': {
    revenue: 0,
    orders: 0,
    aov: 0,
    repeatRate: 0,
    topProducts: [] as { name: string; orders: number; revenue: number }[],
    timeline: [] as { label: string; revenue: number; orders: number }[]
  },
  '3m': {
    revenue: 0,
    orders: 0,
    aov: 0,
    repeatRate: 0,
    topProducts: [] as { name: string; orders: number; revenue: number }[],
    timeline: [] as { label: string; revenue: number; orders: number }[]
  }
};
