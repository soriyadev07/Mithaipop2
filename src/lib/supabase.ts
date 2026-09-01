import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';

// Supabase Environment Configurations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database product row interface matching Supabase products table
export interface DatabaseProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number | null;
  category: string;
  flavor?: string;
  city?: string;
  sku: string;
  images: string[];
  thumbnail?: string;
  inventory_quantity: number;
  low_stock_threshold: number;
  is_best_seller: boolean;
  is_featured: boolean;
  is_preorder: boolean;
  is_active: boolean;
  is_archived?: boolean;
  display_order?: number;
  texture?: string;
  ingredients?: string[];
  dietary?: string[];
  canister_color?: string;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// Convert DB row to Frontend Product model
export function mapDbRowToProduct(row: DatabaseProductRow): Product {
  const images = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : row.thumbnail
    ? [row.thumbnail]
    : [];

  const mainImage = row.thumbnail || images[0] || 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600';

  return {
    id: row.id,
    name: row.name,
    slug: row.slug || generateSlug(row.name),
    description: row.description || '',
    shortDescription: row.short_description || row.description?.substring(0, 90) || '',
    tagline: row.short_description || row.description?.substring(0, 90) || '',
    price: Number(row.price),
    originalPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    category: row.category as any,
    flavor: row.flavor || '',
    flavorCombination: row.flavor || '',
    city: row.city || 'Delhi',
    cityInspiration: row.city || 'Delhi',
    sku: row.sku || `MP-${row.name.substring(0, 2).toUpperCase()}-001`,
    images: images.length > 0 ? images : [mainImage],
    thumbnail: mainImage,
    image: mainImage,
    inventoryQuantity: Number(row.inventory_quantity ?? 50),
    inventoryCount: Number(row.inventory_quantity ?? 50),
    lowStockThreshold: Number(row.low_stock_threshold ?? 10),
    isBestSeller: Boolean(row.is_best_seller),
    isFeatured: Boolean(row.is_featured),
    isPreorder: Boolean(row.is_preorder),
    isAvailableForPreOrder: Boolean(row.is_preorder),
    isActive: Boolean(row.is_active),
    isArchived: Boolean(row.is_archived),
    displayOrder: row.display_order ?? 0,
    texture: row.texture || 'Creamy & Crispy',
    ingredients: row.ingredients || ['Cardamom', 'Milk Solids', 'Pistachio'],
    dietary: row.dietary || ['Vegetarian', 'Gelatin-Free'],
    accentColor: row.canister_color || '#F4BD38',
    bgColor: '#7A0F29',
    canisterColor: row.canister_color || '#7A0F29',
    canArtworkDescription: `Iconic artisanal collection piece with heritage motifs from ${row.city || 'India'}.`,
    temperature: row.is_preorder ? 'Pre-Order Drop' : 'Best at 4°C (Chilled)',
    shelfLife: '14 Days Refrigerated',
    rating: Number(row.rating || 4.92),
    reviewCount: Number(row.review_count || 140),
    badge: row.is_best_seller ? 'Bestseller' : row.is_preorder ? 'Pre-Order' : undefined,
    tags: [
      row.category,
      row.is_best_seller ? 'Bestseller' : null,
      row.is_featured ? 'Featured' : null,
      row.city
    ].filter(Boolean) as string[],
    nutrition: {
      calories: 280,
      protein: '6.5g',
      carbs: '32g',
      fat: '12.0g'
    },
    pairingNotes: 'Best enjoyed chilled straight from the collectible can.',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

// Convert Frontend Product model to DB row
export function mapProductToDbRow(p: Product): DatabaseProductRow {
  const images = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : p.image
    ? [p.image]
    : [];

  const thumbnail = p.thumbnail || p.image || images[0] || '';

  return {
    id: p.id,
    name: p.name,
    slug: p.slug || generateSlug(p.name),
    description: p.description || '',
    short_description: p.shortDescription || p.tagline || p.description?.substring(0, 90) || '',
    price: Number(p.price),
    compare_at_price: p.compareAtPrice || p.originalPrice || null,
    category: p.category || 'Classic Fusion',
    flavor: p.flavor || p.flavorCombination || '',
    city: p.city || p.cityInspiration || 'Delhi',
    sku: p.sku || `MP-${p.name.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    images: images.length > 0 ? images : [thumbnail],
    thumbnail: thumbnail,
    inventory_quantity: p.inventoryQuantity ?? p.inventoryCount ?? 50,
    low_stock_threshold: p.lowStockThreshold ?? 10,
    is_best_seller: Boolean(p.isBestSeller),
    is_featured: Boolean(p.isFeatured),
    is_preorder: Boolean(p.isPreorder ?? p.isAvailableForPreOrder),
    is_active: p.isActive !== undefined ? Boolean(p.isActive) : true,
    is_archived: Boolean(p.isArchived),
    display_order: p.displayOrder ?? 0,
    texture: p.texture || 'Creamy & Crispy',
    ingredients: p.ingredients || [],
    dietary: p.dietary || ['Vegetarian', 'Gelatin-Free'],
    canister_color: p.canisterColor || p.accentColor || '#7A0F29',
    rating: p.rating || 4.90,
    review_count: p.reviewCount || 100,
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Generate URL-safe slug
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `pop-${Date.now()}`;
}

// Image upload handler (Supabase Storage with graceful persistent fallback)
export async function uploadProductImageToStorage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    // Validate file format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        url: '',
        error: 'Invalid file format. Please upload JPG, JPEG, PNG, or WEBP images.'
      };
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return {
        success: false,
        url: '',
        error: 'File size exceeds 8MB limit. Please upload a smaller image.'
      };
    }

    onProgress?.(25);

    // If Supabase is connected, upload to 'product-images' bucket
    if (supabase && isSupabaseConfigured()) {
      const fileExt = file.name.split('.').pop();
      const fileName = `pop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      onProgress?.(50);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn('Supabase storage upload error:', error.message);
        // Fall back to client storage
      } else if (data) {
        onProgress?.(90);
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        onProgress?.(100);
        return {
          success: true,
          url: publicUrlData.publicUrl
        };
      }
    }

    // High performance Browser Data / Local Storage Fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress?.(pct);
        }
      };
      reader.onload = () => {
        onProgress?.(100);
        resolve({
          success: true,
          url: reader.result as string
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: '',
          error: 'Failed to read image file.'
        });
      };
      reader.readAsDataURL(file);
    });
  } catch (err: any) {
    return {
      success: false,
      url: '',
      error: err.message || 'Image upload failed'
    };
  }
}
