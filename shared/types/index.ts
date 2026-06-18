export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  addresses: Address[];
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: Category | string;
  inventory: number;
  ratings: {
    average: number;
    count: number;
  };
  features: string[];
  tags: string[];
  specifications: Record<string, string>;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface TrackingStep {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  notes?: string;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'COD' | 'Razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  couponApplied?: string | Coupon;
  discountAmount: number;
  total: number;
  invoicePath?: string;
  trackingHistory: TrackingStep[];
  createdAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  likes: number;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: (Product | string)[];
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
