import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  OrderConfirmation,
  PreOrder,
  InventoryItem,
  Product,
  Coupon,
  GiftOrderRecord,
  AppNotification,
  ActivityLog,
  SupportTicket,
  StoreSettings,
  OrderStatus,
  PreOrderStatus,
  Review
} from '../types';
import {
  INITIAL_ORDERS,
  INITIAL_PREORDERS,
  INITIAL_INVENTORY,
  INITIAL_COUPONS,
  INITIAL_GIFT_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_SETTINGS,
  ANALYTICS_DATA
} from '../data/mockStoreData';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { REVIEWS as INITIAL_REVIEWS } from '../data/reviews';
import { sounds } from '../utils/audio';
import {
  supabase,
  isSupabaseConfigured,
  mapDbRowToProduct,
  mapProductToDbRow,
  generateSlug
} from '../lib/supabase';

interface StoreDataContextType {
  orders: OrderConfirmation[];
  preOrders: PreOrder[];
  products: Product[];
  inventory: InventoryItem[];
  coupons: Coupon[];
  reviews: Review[];
  giftOrders: GiftOrderRecord[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
  settings: StoreSettings;
  analyticsTimeframe: 'today' | '7d' | '30d' | '3m';
  setAnalyticsTimeframe: (tf: 'today' | '7d' | '30d' | '3m') => void;
  getAnalytics: () => typeof ANALYTICS_DATA['today'];
  
  // Database Status
  isDatabaseConnected: boolean;
  isLoadingProducts: boolean;
  reloadProductsFromDatabase: () => Promise<void>;

  // Public Product Getters
  getPublicProducts: () => Product[];
  getBestSellerProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getProductBySlug: (slug: string) => Product | undefined;

  // Order actions
  createOrder: (order: OrderConfirmation) => void;
  addOrder: (order: OrderConfirmation) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, adminName?: string, note?: string) => void;
  cancelOrder: (orderId: string, reason: string, adminName?: string) => void;
  refundOrder: (orderId: string, amount: number, reason: string, adminName?: string) => void;
  addInternalOrderNote: (orderId: string, note: string, adminName?: string) => void;
  
  // Pre-Order actions
  addPreOrder: (preOrder: PreOrder) => void;
  updatePreOrderStatus: (id: string, status: PreOrderStatus, adminName?: string) => void;
  updatePreOrderDispatchDate: (id: string, date: string, adminName?: string) => void;
  notifyPreOrderCustomer: (id: string, message: string) => void;
  cancelPreOrder: (id: string, reason: string, adminName?: string) => void;
  
  // Product actions (Database + Realtime State)
  addProduct: (product: Omit<Product, 'id'>, adminName?: string) => Promise<Product> | Product;
  updateProduct: (id: string, product: Partial<Product>, adminName?: string) => Promise<void> | void;
  deleteProduct: (id: string, adminName?: string) => { success: boolean; message?: string };
  archiveProduct: (id: string, adminName?: string) => Promise<void> | void;
  restoreProduct: (id: string, adminName?: string) => Promise<void> | void;
  duplicateProduct: (id: string, adminName?: string) => Promise<Product> | Product;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>, adminName?: string) => Promise<void> | void;
  quickUpdateProduct: (id: string, updates: Partial<Product>, adminName?: string) => Promise<void> | void;
  
  // Inventory actions
  adjustStock: (productId: string, delta: number, reason: string, adminName?: string) => void;
  updateLowStockThreshold: (productId: string, threshold: number) => void;
  
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, coupon: Partial<Coupon>) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;
  
  // Review actions
  updateReviewStatus: (id: string, status: 'approved' | 'pending' | 'hidden') => void;
  deleteReview: (id: string) => void;
  
  // Gift Order actions
  updateGiftOrderStatus: (id: string, status: GiftOrderRecord['status']) => void;

  // Support Ticket actions
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Partial<SupportTicket>, initialMessage: string) => SupportTicket;
  updateTicketStatus: (id: string, status: SupportTicket['status'], adminName?: string) => void;
  addTicketReply: (id: string, message: string, sender: 'admin' | 'customer', senderName: string) => void;
  addTicketInternalNote: (id: string, note: string, adminName?: string) => void;
  assignTicket: (id: string, assignedTo: string, adminName?: string) => void;
  
  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (target: 'customer' | 'admin') => void;
  clearNotification: (id: string) => void;
  
  // Settings actions
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  
  // CSV Export utility
  exportDataToCSV: (type: 'orders' | 'preorders' | 'inventory' | 'customers' | 'coupons' | 'payments' | 'products') => void;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDatabaseConnected = isSupabaseConfigured();
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Orders
  const [orders, setOrders] = useState<OrderConfirmation[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_orders');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_ORDERS;
  });

  // Pre-Orders
  const [preOrders, setPreOrders] = useState<PreOrder[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_preorders');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_PREORDERS;
  });

  // Products (Database & Local Synced)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRODUCTS.map((p, idx) => ({
      ...p,
      slug: p.slug || generateSlug(p.name),
      sku: p.sku || `MP-${p.name.substring(0, 2).toUpperCase()}-00${idx + 1}`,
      category: p.category || (idx < 3 ? 'Classic Fusion' : 'City Edition'),
      inventoryCount: p.inventoryQuantity ?? (idx === 0 ? 12 : idx === 2 ? 9 : 45),
      inventoryQuantity: p.inventoryQuantity ?? (idx === 0 ? 12 : idx === 2 ? 9 : 45),
      lowStockThreshold: p.lowStockThreshold || 15,
      isFeatured: p.isFeatured !== undefined ? p.isFeatured : idx < 3,
      isBestSeller: p.isBestSeller !== undefined ? p.isBestSeller : (idx === 0 || idx === 2),
      isAvailableForPreOrder: p.isPreorder ?? false,
      isPreorder: p.isPreorder ?? false,
      isActive: p.isActive !== undefined ? p.isActive : true,
      isArchived: p.isArchived ?? false,
      displayOrder: p.displayOrder ?? (idx + 1)
    }));
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_inventory');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_INVENTORY;
  });

  // Fetch / Sync Products from Supabase on mount if configured
  const reloadProductsFromDatabase = useCallback(async () => {
    if (!supabase || !isDatabaseConnected) return;

    try {
      setIsLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbRowToProduct);
        setProducts(mapped);
        try {
          localStorage.setItem('mithai_pop_products', JSON.stringify(mapped));
        } catch {}
      } else if (data && data.length === 0 && products.length > 0) {
        // First-time migration: seed Supabase with initial catalog products
        const rowsToInsert = products.map(mapProductToDbRow);
        await supabase.from('products').insert(rowsToInsert);
      }
    } catch (err) {
      console.warn('Failed to load products from Supabase:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [isDatabaseConnected]);

  useEffect(() => {
    reloadProductsFromDatabase();
  }, [reloadProductsFromDatabase]);

  // Public Getters
  const getPublicProducts = useCallback(() => {
    return products.filter((p) => p.isActive !== false && !p.isArchived);
  }, [products]);

  const getBestSellerProducts = useCallback(() => {
    const active = products.filter((p) => p.isActive !== false && !p.isArchived);
    const best = active.filter((p) => p.isBestSeller);
    return best.length > 0 ? best : active.slice(0, 3);
  }, [products]);

  const getFeaturedProducts = useCallback(() => {
    const active = products.filter((p) => p.isActive !== false && !p.isArchived);
    const featured = active.filter((p) => p.isFeatured);
    return featured.length > 0 ? featured : active;
  }, [products]);

  const getProductBySlug = useCallback((slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  }, [products]);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_coupons');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_COUPONS;
  });

  // Reviews — Starts completely empty (0 reviews)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_reviews');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Gift Orders
  const [giftOrders, setGiftOrders] = useState<GiftOrderRecord[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_gift_orders');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_GIFT_ORDERS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_notifications');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_activity');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_ACTIVITY_LOGS;
  });

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_support_tickets');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem('mithai_pop_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_SETTINGS;
  });

  // Analytics timeframe
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'today' | '7d' | '30d' | '3m'>('today');

  // Persistence effects
  useEffect(() => {
    try { localStorage.setItem('mithai_pop_orders', JSON.stringify(orders)); } catch {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_preorders', JSON.stringify(preOrders)); } catch {}
  }, [preOrders]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_products', JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_inventory', JSON.stringify(inventory)); } catch {}
  }, [inventory]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_coupons', JSON.stringify(coupons)); } catch {}
  }, [coupons]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_reviews', JSON.stringify(reviews)); } catch {}
  }, [reviews]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_activity', JSON.stringify(activityLogs)); } catch {}
  }, [activityLogs]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_support_tickets', JSON.stringify(supportTickets)); } catch {}
  }, [supportTickets]);

  useEffect(() => {
    try { localStorage.setItem('mithai_pop_settings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Activity log helper
  const logActivity = (action: string, targetType: ActivityLog['targetType'], targetId?: string, details?: string, adminName: string = 'Priya Varma') => {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      timestamp: formatted,
      adminName,
      adminEmail: 'admin@mithaipop.com',
      action,
      targetType,
      targetId,
      details: details || action
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Add an order (e.g. from checkout)
  const addOrder = (order: OrderConfirmation) => {
    setOrders((prev) => [order, ...prev]);

    // Update inventory counts
    order.items.forEach((item) => {
      setInventory((prevInv) =>
        prevInv.map((inv) => {
          if (inv.productId === item.product.id || inv.productName.toLowerCase().includes(item.product.name.toLowerCase().split(' ')[0])) {
            const nextAvail = Math.max(0, inv.availableStock - item.quantity);
            return {
              ...inv,
              reservedStock: inv.reservedStock + item.quantity,
              availableStock: nextAvail,
              status: nextAvail === 0 ? 'Out of Stock' : nextAvail <= inv.lowStockThreshold ? 'Low Stock' : 'In Stock',
              lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
          }
          return inv;
        })
      );
    });

    // Notify customer
    const customerNotif: AppNotification = {
      id: `notif_${Date.now()}_cust`,
      target: 'customer',
      userId: order.userId,
      title: `Order Confirmed #${order.orderId}`,
      message: `Your order for ₹${order.total} has been confirmed and scheduled for fresh pack.`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
      link: `#orders/${order.orderId}`
    };

    // Notify admin
    const adminNotif: AppNotification = {
      id: `notif_${Date.now()}_admin`,
      target: 'admin',
      title: `New Order #${order.orderId}`,
      message: `${order.customerName || 'Customer'} placed order for ₹${order.total} (${order.items.length} items).`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
      link: '#admin-orders'
    };

    setNotifications((prev) => [customerNotif, adminNotif, ...prev]);
    logActivity(`New Order Placed #${order.orderId}`, 'order', order.orderId, `Amount: ₹${order.total}, Payment: ${order.paymentMethod}`);

    // If gift option is enabled, add to gift orders
    if (order.giftOption?.enabled) {
      const giftRec: GiftOrderRecord = {
        id: `gift_${Date.now()}`,
        orderId: order.orderId,
        senderName: order.customerName || 'Customer',
        senderEmail: order.customerEmail || 'customer@example.com',
        recipientName: order.giftOption.recipientName || 'Recipient',
        recipientPhone: order.deliveryAddress.phone,
        recipientAddress: `${order.deliveryAddress.flat}, ${order.deliveryAddress.street}, ${order.deliveryAddress.city}`,
        products: order.items.map((it) => ({
          name: it.product.name,
          quantity: it.quantity,
          image: it.product.image
        })),
        giftMessage: order.giftOption.message,
        deliveryDate: order.estimatedDelivery,
        status: 'Received',
        orderDate: new Date().toISOString().split('T')[0]
      };
      setGiftOrders((prev) => [giftRec, ...prev]);
    }
  };

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, adminName: string = 'Priya Varma', noteText?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = `${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' })}, ${nowStr}`;
          
          const updatedTimeline = (ord.timeline || []).map((tl) => {
            if (tl.stage === newStatus) {
              return { ...tl, completed: true, timestamp: dateStr };
            }
            return tl;
          });

          // Add internal note if provided
          let internalNotes = ord.internalNotes || [];
          if (noteText) {
            internalNotes = [
              ...internalNotes,
              {
                id: `note_${Date.now()}`,
                adminName,
                note: noteText,
                timestamp: dateStr
              }
            ];
          }

          return {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline,
            internalNotes
          };
        }
        return ord;
      })
    );

    // Notify customer
    const targetOrder = orders.find((o) => o.orderId === orderId);
    if (targetOrder) {
      const custNotif: AppNotification = {
        id: `notif_${Date.now()}_status`,
        target: 'customer',
        userId: targetOrder.userId,
        title: `Order #${orderId} is now ${newStatus}`,
        message: `Your Pops have moved to stage: ${newStatus}.`,
        type: 'order',
        read: false,
        createdAt: new Date().toISOString(),
        link: `#orders/${orderId}`
      };
      setNotifications((prev) => [custNotif, ...prev]);
    }

    sounds.playCanPop();
    logActivity(`Updated Order #${orderId} status to ${newStatus}`, 'order', orderId, noteText || undefined, adminName);
  };

  // Cancel order
  const cancelOrder = (orderId: string, reason: string, adminName: string = 'Priya Varma') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: 'Cancelled' as OrderStatus } : ord))
    );
    sounds.playError();
    logActivity(`Cancelled Order #${orderId}`, 'order', orderId, `Reason: ${reason}`, adminName);
  };

  // Refund order
  const refundOrder = (orderId: string, amount: number, reason: string, adminName: string = 'Priya Varma') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, paymentStatus: 'Refunded', status: 'Refunded' as OrderStatus } : ord))
    );
    sounds.playCanPop();
    logActivity(`Refunded ₹${amount} for Order #${orderId}`, 'order', orderId, `Reason: ${reason}`, adminName);
  };

  // Internal order note
  const addInternalOrderNote = (orderId: string, note: string, adminName: string = 'Priya Varma') => {
    const dateStrFun = `${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          const notes = ord.internalNotes || [];
          return {
            ...ord,
            internalNotes: [...notes, { id: `note_${Date.now()}`, adminName, note, timestamp: dateStrFun }]
          };
        }
        return ord;
      })
    );
    sounds.playClick();
    logActivity(`Added internal note to Order #${orderId}`, 'order', orderId, note, adminName);
  };

  // Pre-Order handlers
  const addPreOrder = (preOrder: PreOrder) => {
    setPreOrders((prev) => [preOrder, ...prev]);
    logActivity(`New Pre-Order Created #${preOrder.orderNumber}`, 'order', preOrder.orderNumber, `Product: ${preOrder.product.name}`);
  };

  const updatePreOrderStatus = (id: string, status: PreOrderStatus, adminName: string = 'Priya Varma') => {
    setPreOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status } : po))
    );
    sounds.playCanPop();
    logActivity(`Updated Pre-Order #${id} status to ${status}`, 'order', id, undefined, adminName);
  };

  const updatePreOrderDispatchDate = (id: string, date: string, adminName: string = 'Priya Varma') => {
    setPreOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, expectedDispatchDate: date } : po))
    );
    sounds.playClick();
    logActivity(`Updated Pre-Order #${id} dispatch date to ${date}`, 'order', id, undefined, adminName);
  };

  const notifyPreOrderCustomer = (id: string, message: string) => {
    const target = preOrders.find((p) => p.id === id);
    if (target) {
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        target: 'customer',
        userId: target.userId,
        title: `Update on ${target.product.name}`,
        message,
        type: 'preorder',
        read: false,
        createdAt: new Date().toISOString(),
        link: '#preorders'
      };
      setNotifications((prev) => [notif, ...prev]);
      sounds.playCelebration();
    }
  };

  const cancelPreOrder = (id: string, reason: string, adminName: string = 'Priya Varma') => {
    setPreOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'Cancelled' as PreOrderStatus, paymentStatus: 'Refunded' } : po))
    );
    sounds.playError();
    logActivity(`Cancelled Pre-Order #${id}`, 'order', id, `Reason: ${reason}`, adminName);
  };

  // =========================================================================
  // PRODUCT MANAGEMENT ACTIONS (DATABASE + REALTIME SYNC)
  // =========================================================================

  const addProduct = async (prodData: Omit<Product, 'id'>, adminName: string = 'Priya Varma'): Promise<Product> => {
    const rawId = `pop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const productSlug = prodData.slug || generateSlug(prodData.name);
    const sku = prodData.sku || `MP-${prodData.name.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const mainImg = prodData.thumbnail || prodData.image || (prodData.images && prodData.images[0]) || 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600';

    const newProd: Product = {
      ...prodData,
      id: rawId,
      slug: productSlug,
      sku: sku,
      flavor: prodData.flavor || prodData.flavorCombination || '',
      flavorCombination: prodData.flavorCombination || prodData.flavor || '',
      city: prodData.city || prodData.cityInspiration || 'Delhi',
      cityInspiration: prodData.cityInspiration || prodData.city || 'Delhi',
      image: mainImg,
      thumbnail: mainImg,
      images: prodData.images && prodData.images.length > 0 ? prodData.images : [mainImg],
      category: prodData.category || 'Classic Fusion',
      price: Number(prodData.price),
      originalPrice: prodData.compareAtPrice || prodData.originalPrice || undefined,
      compareAtPrice: prodData.compareAtPrice || prodData.originalPrice || undefined,
      inventoryQuantity: prodData.inventoryQuantity ?? prodData.inventoryCount ?? 50,
      inventoryCount: prodData.inventoryQuantity ?? prodData.inventoryCount ?? 50,
      lowStockThreshold: prodData.lowStockThreshold || 10,
      isBestSeller: Boolean(prodData.isBestSeller),
      isFeatured: Boolean(prodData.isFeatured),
      isPreorder: Boolean(prodData.isPreorder ?? prodData.isAvailableForPreOrder),
      isAvailableForPreOrder: Boolean(prodData.isPreorder ?? prodData.isAvailableForPreOrder),
      isActive: prodData.isActive !== undefined ? Boolean(prodData.isActive) : true,
      isArchived: false,
      displayOrder: prodData.displayOrder ?? (products.length + 1),
      rating: prodData.rating || 4.90,
      reviewCount: prodData.reviewCount || 0,
      accentColor: prodData.accentColor || prodData.canisterColor || '#F4BD38',
      bgColor: '#7A0F29',
      canisterColor: prodData.canisterColor || prodData.accentColor || '#7A0F29',
      ingredients: prodData.ingredients && prodData.ingredients.length > 0 ? prodData.ingredients : ['Cardamom', 'Milk Solids', 'Pistachio'],
      dietary: prodData.dietary && prodData.dietary.length > 0 ? prodData.dietary : ['Vegetarian', 'Gelatin-Free'],
      tags: prodData.tags || [prodData.category || 'Classic Fusion'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If Supabase is connected, insert into database
    if (supabase && isDatabaseConnected) {
      try {
        const row = mapProductToDbRow(newProd);
        const { error } = await supabase.from('products').insert([row]);
        if (error) {
          console.warn('Supabase product insert error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase product insert exception:', err);
      }
    }

    setProducts((prev) => [...prev, newProd]);

    // Create corresponding inventory item
    const newInv: InventoryItem = {
      productId: newProd.id,
      productName: newProd.name,
      sku: newProd.sku || 'MP-NEW',
      image: newProd.image,
      currentStock: newProd.inventoryQuantity || 50,
      reservedStock: 0,
      availableStock: newProd.inventoryQuantity || 50,
      lowStockThreshold: newProd.lowStockThreshold || 10,
      status: (newProd.inventoryQuantity || 50) <= (newProd.lowStockThreshold || 10) ? 'Low Stock' : 'In Stock',
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setInventory((prev) => [...prev, newInv]);

    sounds.playCelebration();
    logActivity(`Created Product: ${newProd.name}`, 'product', newProd.id, `Price: ₹${newProd.price}, SKU: ${newProd.sku}`, adminName);
    return newProd;
  };

  const updateProduct = async (id: string, prodData: Partial<Product>, adminName: string = 'Priya Varma') => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;

    // Track what changed for rich activity logs
    const changes: string[] = [];
    if (prodData.price !== undefined && prodData.price !== existing.price) {
      changes.push(`Price changed from ₹${existing.price} to ₹${prodData.price}`);
    }
    const newStock = prodData.inventoryQuantity ?? prodData.inventoryCount;
    const oldStock = existing.inventoryQuantity ?? existing.inventoryCount;
    if (newStock !== undefined && newStock !== oldStock) {
      changes.push(`Inventory changed from ${oldStock} to ${newStock}`);
    }
    if (prodData.isBestSeller !== undefined && prodData.isBestSeller !== existing.isBestSeller) {
      changes.push(prodData.isBestSeller ? 'Marked as Bestseller' : 'Removed from Bestsellers');
    }
    if (prodData.isFeatured !== undefined && prodData.isFeatured !== existing.isFeatured) {
      changes.push(prodData.isFeatured ? 'Marked as Featured' : 'Removed from Featured');
    }
    if (prodData.isActive !== undefined && prodData.isActive !== existing.isActive) {
      changes.push(prodData.isActive ? 'Activated product' : 'Deactivated product');
    }
    if (prodData.isPreorder !== undefined && prodData.isPreorder !== existing.isPreorder) {
      changes.push(prodData.isPreorder ? 'Enabled Pre-Order' : 'Disabled Pre-Order');
    }

    const updatedProduct: Product = {
      ...existing,
      ...prodData,
      slug: prodData.name && prodData.name !== existing.name ? generateSlug(prodData.name) : (prodData.slug || existing.slug),
      flavor: prodData.flavor || prodData.flavorCombination || existing.flavor,
      flavorCombination: prodData.flavorCombination || prodData.flavor || existing.flavorCombination,
      city: prodData.city || prodData.cityInspiration || existing.city,
      cityInspiration: prodData.cityInspiration || prodData.city || existing.cityInspiration,
      inventoryQuantity: prodData.inventoryQuantity ?? prodData.inventoryCount ?? existing.inventoryQuantity,
      inventoryCount: prodData.inventoryQuantity ?? prodData.inventoryCount ?? existing.inventoryCount,
      updatedAt: new Date().toISOString()
    };

    // If Supabase is connected, update database
    if (supabase && isDatabaseConnected) {
      try {
        const row = mapProductToDbRow(updatedProduct);
        const { error } = await supabase
          .from('products')
          .update(row)
          .eq('id', id);
        if (error) {
          console.warn('Supabase product update error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase product update exception:', err);
      }
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));

    // Update inventory item if name, image, or stock changed
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.productId === id || inv.sku === existing.sku) {
          const curStock = updatedProduct.inventoryQuantity ?? inv.currentStock;
          const avail = Math.max(0, curStock - inv.reservedStock);
          return {
            ...inv,
            productName: updatedProduct.name,
            sku: updatedProduct.sku || inv.sku,
            image: updatedProduct.image || inv.image,
            currentStock: curStock,
            availableStock: avail,
            lowStockThreshold: updatedProduct.lowStockThreshold || inv.lowStockThreshold,
            status: avail === 0 ? 'Out of Stock' : avail <= (updatedProduct.lowStockThreshold || inv.lowStockThreshold) ? 'Low Stock' : 'In Stock',
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return inv;
      })
    );

    sounds.playCanPop();
    const details = changes.length > 0 ? changes.join('; ') : `Updated ${existing.name}`;
    logActivity(`Updated Product: ${existing.name}`, 'product', id, details, adminName);
  };

  const archiveProduct = async (id: string, adminName: string = 'Priya Varma') => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;

    await updateProduct(id, { isArchived: true, isActive: false }, adminName);
    logActivity(`Archived Product: ${existing.name}`, 'product', id, 'Moved to Archived status', adminName);
  };

  const restoreProduct = async (id: string, adminName: string = 'Priya Varma') => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;

    await updateProduct(id, { isArchived: false, isActive: true }, adminName);
    logActivity(`Restored Product: ${existing.name}`, 'product', id, 'Restored to Active status', adminName);
  };

  const deleteProduct = (id: string, adminName: string = 'Priya Varma'): { success: boolean; message?: string } => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return { success: false, message: 'Product not found' };

    // Check if this product is referenced in any existing orders
    const hasOrderReferences = orders.some((ord) =>
      ord.items.some((item) => item.product.id === id || item.product.name === existing.name)
    );

    if (hasOrderReferences) {
      // Safe archival instead of breaking order history
      archiveProduct(id, adminName);
      return {
        success: true,
        message: `Product "${existing.name}" is referenced in existing customer orders. It has been safely archived instead of permanently deleted to protect order history.`
      };
    }

    // Permanently remove from database if Supabase is connected
    if (supabase && isDatabaseConnected) {
      supabase.from('products').delete().eq('id', id).then();
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setInventory((prev) => prev.filter((i) => i.productId !== id));
    sounds.playClick();
    logActivity(`Deleted Product: ${existing.name}`, 'product', id, `SKU: ${existing.sku}`, adminName);
    return { success: true, message: `Product "${existing.name}" was permanently removed.` };
  };

  const duplicateProduct = async (id: string, adminName: string = 'Priya Varma'): Promise<Product> => {
    const existing = products.find((p) => p.id === id);
    if (!existing) throw new Error('Product not found to duplicate');

    const copyData: Omit<Product, 'id'> = {
      ...existing,
      name: `${existing.name} (Copy)`,
      slug: `${existing.slug || generateSlug(existing.name)}-copy-${Math.floor(100 + Math.random() * 900)}`,
      sku: `MP-${existing.name.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      isBestSeller: false,
      isFeatured: false,
      isActive: false, // create as draft
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    const cloned = await addProduct(copyData, adminName);
    logActivity(`Duplicated Product: ${existing.name} -> ${cloned.name}`, 'product', cloned.id, `New SKU: ${cloned.sku}`, adminName);
    return cloned;
  };

  const bulkUpdateProducts = async (ids: string[], updates: Partial<Product>, adminName: string = 'Priya Varma') => {
    for (const id of ids) {
      await updateProduct(id, updates, adminName);
    }
    sounds.playCelebration();
    logActivity(`Bulk updated ${ids.length} products`, 'product', undefined, JSON.stringify(updates), adminName);
  };

  const quickUpdateProduct = async (id: string, updates: Partial<Product>, adminName: string = 'Priya Varma') => {
    await updateProduct(id, updates, adminName);
  };

  // Stock Adjustment
  const adjustStock = (productId: string, delta: number, reason: string, adminName: string = 'Priya Varma') => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.productId === productId || item.sku === productId) {
          const nextStock = Math.max(0, item.currentStock + delta);
          const nextAvail = Math.max(0, nextStock - item.reservedStock);
          const status = nextAvail === 0 ? 'Out of Stock' : nextAvail <= item.lowStockThreshold ? 'Low Stock' : 'In Stock';
          
          // Also sync to products table
          setProducts((prevProds) =>
            prevProds.map((prod) => {
              if (prod.id === item.productId || prod.sku === item.sku) {
                if (supabase && isDatabaseConnected) {
                  supabase
                    .from('products')
                    .update({ inventory_quantity: nextStock })
                    .eq('id', prod.id)
                    .then();
                }
                return { ...prod, inventoryQuantity: nextStock, inventoryCount: nextStock };
              }
              return prod;
            })
          );

          return {
            ...item,
            currentStock: nextStock,
            availableStock: nextAvail,
            status,
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return item;
      })
    );
    sounds.playCanPop();
    logActivity(`Adjusted stock by ${delta > 0 ? `+${delta}` : delta} for ${productId}`, 'inventory', productId, `Reason: ${reason}`, adminName);
  };

  const updateLowStockThreshold = (productId: string, threshold: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, lowStockThreshold: threshold } : item))
    );
    setProducts((prev) =>
      prev.map((prod) => (prod.id === productId ? { ...prod, lowStockThreshold: threshold } : prod))
    );
    sounds.playClick();
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    sounds.playCelebration();
    logActivity(`Added coupon ${coupon.code}`, 'coupon', coupon.code);
  };

  const updateCoupon = (code: string, couponData: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, ...couponData } : c))
    );
    sounds.playClick();
    logActivity(`Updated coupon ${code}`, 'coupon', code);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
    sounds.playClick();
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    sounds.playClick();
    logActivity(`Deleted coupon ${code}`, 'coupon', code);
  };

  // Reviews
  const updateReviewStatus = (id: string, status: 'approved' | 'pending' | 'hidden') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    sounds.playClick();
    logActivity(`Updated Review #${id} to ${status}`, 'review', id);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    sounds.playClick();
    logActivity(`Deleted Review #${id}`, 'review', id);
  };

  // Gift Orders
  const updateGiftOrderStatus = (id: string, status: GiftOrderRecord['status']) => {
    setGiftOrders((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
    sounds.playCanPop();
    logActivity(`Updated Gift Order #${id} status to ${status}`, 'order', id);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = (target: 'customer' | 'admin') => {
    setNotifications((prev) =>
      prev.map((n) => (n.target === target || n.target === 'all' ? { ...n, read: true } : n))
    );
    sounds.playClick();
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    sounds.playCelebration();
    logActivity('Updated Store Settings', 'settings');
  };

  // Dynamic Analytics Getter based on live orders
  const getAnalytics = () => {
    const now = new Date();
    let filteredOrders = orders.filter(o => o.status !== 'Cancelled');
    
    if (analyticsTimeframe === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      filteredOrders = filteredOrders.filter(o => o.placedAt.startsWith(todayStr));
    } else if (analyticsTimeframe === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = filteredOrders.filter(o => new Date(o.placedAt) >= sevenDaysAgo);
    } else if (analyticsTimeframe === '30d') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredOrders = filteredOrders.filter(o => new Date(o.placedAt) >= thirtyDaysAgo);
    } else if (analyticsTimeframe === '3m') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filteredOrders = filteredOrders.filter(o => new Date(o.placedAt) >= ninetyDaysAgo);
    }

    const totalRev = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const orderCount = filteredOrders.length;
    const aov = orderCount > 0 ? Math.round(totalRev / orderCount) : 0;

    // Customer repeat rate
    const customerOrderCounts: Record<string, number> = {};
    orders.forEach(o => {
      const key = o.customerEmail || o.customerPhone || o.customerName || 'anon';
      customerOrderCounts[key] = (customerOrderCounts[key] || 0) + 1;
    });
    const uniqueCusts = Object.keys(customerOrderCounts);
    const repeatCusts = uniqueCusts.filter(k => customerOrderCounts[k] > 1);
    const repeatRate = uniqueCusts.length > 0 ? Math.round((repeatCusts.length / uniqueCusts.length) * 100) : 0;

    // Top products aggregated from items sold
    const productStats: Record<string, { name: string; orders: number; revenue: number }> = {};
    filteredOrders.forEach(o => {
      o.items.forEach(item => {
        const prodName = item.product.name;
        if (!productStats[prodName]) {
          productStats[prodName] = { name: prodName, orders: 0, revenue: 0 };
        }
        productStats[prodName].orders += item.quantity;
        productStats[prodName].revenue += item.quantity * item.product.price;
      });
    });

    const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue);

    // Timeline buckets
    let timeline: { label: string; revenue: number; orders: number }[] = [];
    if (analyticsTimeframe === 'today') {
      const hours = ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
      timeline = hours.map(h => ({ label: h, revenue: 0, orders: 0 }));
      filteredOrders.forEach(o => {
        const date = new Date(o.placedAt);
        const hour = date.getHours();
        let bucketIdx = 0;
        if (hour < 11) bucketIdx = 0;
        else if (hour < 14) bucketIdx = 1;
        else if (hour < 17) bucketIdx = 2;
        else if (hour < 20) bucketIdx = 3;
        else bucketIdx = 4;
        if (timeline[bucketIdx]) {
          timeline[bucketIdx].revenue += o.total;
          timeline[bucketIdx].orders += 1;
        }
      });
    } else {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      timeline = days.map(d => ({ label: d, revenue: 0, orders: 0 }));
      filteredOrders.forEach(o => {
        const d = new Date(o.placedAt);
        const dayIdx = (d.getDay() + 6) % 7; // Monday = 0
        if (timeline[dayIdx]) {
          timeline[dayIdx].revenue += o.total;
          timeline[dayIdx].orders += 1;
        }
      });
    }

    return {
      revenue: totalRev,
      orders: orderCount,
      aov,
      repeatRate,
      topProducts,
      timeline
    };
  };

  // Support Ticket actions
  const createSupportTicket = (
    ticket: Partial<SupportTicket>,
    initialMessage: string
  ): SupportTicket => {
    const ticketId = `tkt_${Date.now()}`;
    const ticketNum = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber: ticketNum,
      customerName: ticket.customerName || 'Customer',
      customerEmail: ticket.customerEmail || 'customer@example.com',
      customerPhone: ticket.customerPhone,
      subject: ticket.subject || 'General Inquiry',
      category: ticket.category || 'General',
      priority: ticket.priority || 'Medium',
      status: 'Open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'customer',
          senderName: ticket.customerName || 'Customer',
          message: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      assignedTo: 'Support Desk',
      internalNotes: []
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    logActivity(`Created Support Ticket #${ticketNum}`, 'support', ticketId, `Category: ${newTicket.category}`);
    sounds.playCanPop();
    return newTicket;
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status'], adminName: string = 'Admin Staff') => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    logActivity(`Updated Support Ticket status to ${status}`, 'support', id, `Status: ${status}`, adminName);
  };

  const addTicketReply = (id: string, message: string, sender: 'admin' | 'customer', senderName: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newMsg = {
          id: `msg_${Date.now()}`,
          sender,
          senderName,
          message,
          timestamp: new Date().toISOString()
        };
        const newStatus = sender === 'admin' ? ('Waiting for Customer' as const) : ('In Progress' as const);
        return {
          ...t,
          status: t.status === 'Closed' ? 'Closed' : newStatus,
          messages: [...t.messages, newMsg]
        };
      })
    );
    sounds.playCanPop();
    logActivity(`Replied to Support Ticket`, 'support', id, `Sender: ${senderName}`);
  };

  const addTicketInternalNote = (id: string, note: string, adminName: string = 'Admin Staff') => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          internalNotes: [...(t.internalNotes || []), `${adminName} (${new Date().toLocaleTimeString()}): ${note}`]
        };
      })
    );
  };

  const assignTicket = (id: string, assignedTo: string, adminName: string = 'Admin Staff') => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assignedTo } : t))
    );
    logActivity(`Assigned Ticket to ${assignedTo}`, 'support', id, `Assignee: ${assignedTo}`, adminName);
  };

  // Export CSV
  const exportDataToCSV = (type: 'orders' | 'preorders' | 'inventory' | 'customers' | 'coupons' | 'payments' | 'products') => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (type === 'orders') {
      headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Date', 'Total', 'Payment Method', 'Payment Status', 'Order Status', 'Delivery Method', 'Address', 'Items'];
      rows = orders.map((o) => [
        o.orderId,
        o.customerName || 'N/A',
        o.customerEmail || 'N/A',
        o.customerPhone || 'N/A',
        o.placedAt,
        `Rs. ${o.total}`,
        o.paymentMethod,
        o.status === 'Cancelled' ? 'Cancelled' : o.status === 'Refunded' ? 'Refunded' : 'Paid',
        o.status,
        o.deliveryMethod || 'Standard Cryo-Pack',
        o.shippingAddress ? `${o.shippingAddress.addressLine}, ${o.shippingAddress.city}, ${o.shippingAddress.pincode}` : 'N/A',
        o.items.map((i) => `${i.product.name} (x${i.quantity})`).join('; ')
      ]);
    } else if (type === 'preorders') {
      headers = ['Pre-Order ID', 'Customer', 'Email', 'Phone', 'Product', 'Qty', 'Total', 'Launch Date', 'Dispatch Date', 'Status'];
      rows = preOrders.map((p) => [
        p.orderNumber,
        p.customerName,
        p.customerEmail,
        p.customerPhone,
        p.product.name,
        p.quantity.toString(),
        `Rs. ${p.totalPrice}`,
        p.expectedLaunchDate,
        p.expectedDispatchDate,
        p.status
      ]);
    } else if (type === 'inventory') {
      headers = ['Product', 'SKU', 'Current Stock', 'Reserved Stock', 'Available Stock', 'Low Stock Threshold', 'Status'];
      rows = inventory.map((i) => [
        i.productName,
        i.sku,
        i.currentStock.toString(),
        i.reservedStock.toString(),
        i.availableStock.toString(),
        i.lowStockThreshold.toString(),
        i.status
      ]);
    } else if (type === 'coupons') {
      headers = ['Code', 'Type', 'Value', 'Min Order', 'Max Discount', 'Usage', 'Active'];
      rows = coupons.map((c) => [
        c.code,
        c.discountType,
        c.discountValue.toString(),
        c.minOrderValue.toString(),
        (c.maxDiscount || 'N/A').toString(),
        `${c.usageCount}/${c.usageLimit}`,
        c.isActive ? 'Yes' : 'No'
      ]);
    } else if (type === 'payments') {
      headers = ['Transaction ID', 'Order ID', 'Customer', 'Amount', 'Payment Method', 'Payment Status', 'Date'];
      rows = orders.map((o) => [
        `TXN-${o.orderId}-MP`,
        o.orderId,
        o.customerName || 'N/A',
        `Rs. ${o.total}`,
        o.paymentMethod,
        o.status === 'Cancelled' ? 'Cancelled' : o.status === 'Refunded' ? 'Refunded' : 'Paid',
        o.placedAt
      ]);
    } else if (type === 'customers') {
      headers = ['Customer Name', 'Email', 'Phone', 'Orders Count', 'Total Spent', 'Last Order Date'];
      const customerMap: Record<string, { name: string; email: string; phone: string; orders: number; totalSpent: number; lastOrder: string }> = {};
      orders.forEach((o) => {
        const email = o.customerEmail || 'guest@mithaipop.com';
        if (!customerMap[email]) {
          customerMap[email] = {
            name: o.customerName || 'Guest Customer',
            email,
            phone: o.customerPhone || 'N/A',
            orders: 0,
            totalSpent: 0,
            lastOrder: o.placedAt
          };
        }
        customerMap[email].orders += 1;
        customerMap[email].totalSpent += o.total;
        if (new Date(o.placedAt) > new Date(customerMap[email].lastOrder)) {
          customerMap[email].lastOrder = o.placedAt;
        }
      });
      rows = Object.values(customerMap).map((c) => [
        c.name,
        c.email,
        c.phone,
        c.orders.toString(),
        `Rs. ${c.totalSpent}`,
        c.lastOrder
      ]);
    } else if (type === 'products') {
      headers = ['Product Name', 'SKU', 'Category', 'Flavor', 'City', 'Price', 'Original Price', 'Stock', 'Status'];
      rows = products.map((p) => [
        p.name,
        p.sku || `MP-${p.name.substring(0, 2).toUpperCase()}-001`,
        p.category || 'Classic Fusion',
        p.flavorCombination || 'N/A',
        p.cityInspiration || 'Delhi',
        `Rs. ${p.price}`,
        `Rs. ${p.originalPrice || p.price}`,
        (p.inventoryCount ?? 50).toString(),
        (p.inventoryCount ?? 50) > 0 ? 'In Stock' : 'Out of Stock'
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.map((val) => `"${(val || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mithai_pop_${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sounds.playCanPop();
  };

  return (
    <StoreDataContext.Provider
      value={{
        orders,
        preOrders,
        products,
        inventory,
        coupons,
        reviews,
        giftOrders,
        notifications,
        activityLogs,
        supportTickets,
        settings,
        analyticsTimeframe,
        setAnalyticsTimeframe,
        getAnalytics,
        isDatabaseConnected,
        isLoadingProducts,
        reloadProductsFromDatabase,
        getPublicProducts,
        getBestSellerProducts,
        getFeaturedProducts,
        getProductBySlug,
        createOrder: addOrder,
        addOrder,
        updateOrderStatus,
        cancelOrder,
        refundOrder,
        addInternalOrderNote,
        addPreOrder,
        updatePreOrderStatus,
        updatePreOrderDispatchDate,
        notifyPreOrderCustomer,
        cancelPreOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        archiveProduct,
        restoreProduct,
        duplicateProduct,
        bulkUpdateProducts,
        quickUpdateProduct,
        adjustStock,
        updateLowStockThreshold,
        addCoupon,
        updateCoupon,
        toggleCouponStatus,
        deleteCoupon,
        updateReviewStatus,
        deleteReview,
        updateGiftOrderStatus,
        createSupportTicket,
        updateTicketStatus,
        addTicketReply,
        addTicketInternalNote,
        assignTicket,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        updateSettings,
        exportDataToCSV,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};
