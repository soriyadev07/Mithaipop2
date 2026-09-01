export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  flavorCombination: string;
  tagline: string;
  description: string;
  cityInspiration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  accentColor: string;
  bgColor: string;
  badge?: string;
  ingredients: string[];
  pairingNotes: string;
  temperature: string;
  shelfLife: string;
  canArtworkDescription: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tags: string[];
  // Extended product management fields
  sku?: string;
  category?: 'Classic Fusion' | 'City Edition' | 'Limited Reserve' | 'Custom Creation';
  inventoryCount?: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isAvailableForPreOrder?: boolean;
  isArchived?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customNotes?: string;
  isGiftBox?: boolean;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  email: string;
  flat: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface DeliveryOption {
  id: 'standard' | 'express';
  name: string;
  duration: string;
  price: number;
  estimatedDate: string;
  recommended?: boolean;
}

export interface GiftOption {
  enabled: boolean;
  recipientName: string;
  message: string;
  hidePrice: boolean;
}

// User & Role Types
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'OPERATIONS' | 'INVENTORY_MANAGER' | 'SUPPORT_ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | '';
  addresses?: Address[];
  status?: 'active' | 'suspended';
  createdAt: string;
  totalSpent?: number;
  totalOrders?: number;
  lastOrderDate?: string;
  notes?: string[];
}

export type OrderStatus = 
  | 'Order Confirmed' 
  | 'Preparing' 
  | 'Packed' 
  | 'Shipped'
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Refunded'
  | 'Pending';

export interface InternalOrderNote {
  id: string;
  adminName: string;
  note: string;
  timestamp: string;
}

export interface OrderConfirmation {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes?: number;
  total: number;
  deliveryAddress: Address;
  deliveryOption: DeliveryOption;
  giftOption?: GiftOption;
  deliveryInstructions?: string;
  paymentMethod: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  placedAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  timeline?: {
    stage: OrderStatus;
    timestamp: string;
    completed: boolean;
    description?: string;
  }[];
  internalNotes?: InternalOrderNote[];
  isGiftOrder?: boolean;
}

export type PreOrderStatus = 
  | 'Pre-Order Confirmed' 
  | 'Production' 
  | 'Preparing' 
  | 'Ready to Ship' 
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface PreOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: Product;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  orderDate: string;
  expectedLaunchDate: string;
  expectedDispatchDate: string;
  status: PreOrderStatus;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  deliveryAddress: Address;
  notes?: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-Order';
  lastUpdated: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export interface GiftOrderRecord {
  id: string;
  orderId: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  products: { name: string; quantity: number; image: string }[];
  giftMessage: string;
  deliveryDate: string;
  status: 'Received' | 'Gift Box Assembled' | 'In Transit' | 'Delivered';
  orderDate: string;
}

export interface AppNotification {
  id: string;
  target: 'customer' | 'admin' | 'all';
  userId?: string;
  title: string;
  message: string;
  type: 'order' | 'preorder' | 'stock' | 'customer' | 'review' | 'refund' | 'general';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: string;
  targetType: 'order' | 'product' | 'inventory' | 'customer' | 'coupon' | 'review' | 'settings';
  targetId?: string;
  details: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  supportPhone: string;
  orderPrefix: string;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryThreshold: number;
  taxRatePercent: number;
  enableCod: boolean;
  enableUPI: boolean;
  enableCards: boolean;
  lowStockGlobalThreshold: number;
  autoApproveReviews: boolean;
  maintenanceMode: boolean;
}

export interface CityStory {
  id: string;
  cityName: string;
  hindiName: string;
  state: string;
  color: string;
  dishRemix: string;
  story: string;
  culturalNote: string;
  artMotif: string;
  popProductId: string;
  quote: string;
}

export interface CustomPopIngredient {
  id: string;
  name: string;
  category: 'base' | 'cream' | 'topping' | 'crunch' | 'twist';
  description: string;
  color: string;
  calories: number;
  icon?: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  favoritePop: string;
  verified: boolean;
  avatarBg: string;
  upcycledUse?: string;
  date?: string;
  status?: 'approved' | 'pending' | 'hidden';
  productName?: string;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category: 'general' | 'shipping' | 'packaging' | 'ingredients';
}

